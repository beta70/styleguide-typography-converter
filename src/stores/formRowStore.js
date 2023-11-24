import { defineStore } from 'pinia'
import { ref, computed, watchEffect, nextTick, watch } from 'vue'
import { lusolve } from 'mathjs'

export const useFormRowStore = defineStore('formRow', () => {
    
    // ######################################
    //                  state
    // ######################################

    const formRowId = ref(0)
    const bodyFontSize = ref(16)
    const minScreenWidth = ref(320)
    const maxScreenWidth = ref(1920)
    const isBaseFontSize = ref(false)
    const formRowFields = [
        { 
            name: 'fontSize',
            label: 'font-size',
            range: true,
            placeholder: '16px',
            allowedUnits: ['px','rem','em'],
            givenUnit: {
                min: '',
                max: ''
            },
            inputValue: {
                min: '',
                max: '',
            },
            convertedValue: '',
        },
        { 
            name: 'lineHeight',
            label: 'line-height',
            range: true,
            placeholder: '24px',
            allowedUnits: ['px','rem','em','num'],
            givenUnit: {
                min: '',
                max: ''
            },
            inputValue: {
                min: '',
                max: '',
            },
            convertedValue: '',
        },
        { 
            name: 'letterSpacing',
            label: 'letter-spacing',
            range: true,
            placeholder: '1px',
            allowedUnits: ['px','rem','em'],
            givenUnit: {
                min: '',
                max: ''
            },
            inputValue: {
                min: '',
                max: '',
            },
            convertedValue: '',
        },
        { 
            name: 'fontWeight',
            label: 'font-weight',
            placeholder: '400',
            inputValue: '',
            convertedValue: '',
        },
        { 
            name: 'color',
            label: 'color',
            placeholder: '#ACACAC',
            inputValue: '',
            convertedValue: '',
            className: '',
        },
        { 
            name: 'textDecoration',
            label: 'text-decoration',
            placeholder: 'underline',
            allowedValues: ['underline','overline','line-through'],
            inputValue: '',
            convertedValue: '',
            className: '',
            textProperty: true
        },
        { 
            name: 'textTransform',
            label: 'text-transform',
            placeholder: 'uppercase',
            allowedValues: ['uppercase','lowercase','capitalize'],
            inputValue: '',
            convertedValue: '',
            className: '',
            textProperty: true
        },
    ]
    const formRows = ref([
        {
            id: formRowId.value,
            fields: formRowFields,
            baseStyle: false,
            active: true,
            inlineStyle: {}
        }
    ])
    const convertProperty = {
        fontSize: convertFontSize,
        lineHeight: convertDetailTypo,
        letterSpacing: convertDetailTypo,
        fontWeight: convertFontWeight,
        textDecoration: convertTextProperty,
        textTransform: convertTextProperty,
        color: convertColor,
    }
    const tailwindClassPrefixes = {
        fontSize: 'text-',
        lineHeight: 'leading-',
        letterSpacing: 'tracking-',
        fontWeight: 'font-',
        color: 'text-',
    }
    const generateCustomClassForProperty = {
        fontSize: generateRangePropertyClass,
        lineHeight: generateRangePropertyClass,
        letterSpacing: generateRangePropertyClass,
        fontWeight: generateFontWeightClass,
        color: generateColorClass,
    }
    const tailwindFontWeightClasses = {
        100: 'font-thin',
        200: 'font-extralight',
        300: 'font-light',
        400: 'font-normal',
        500: 'font-medium',
        600: 'font-semibold',
        700: 'font-bold',
        800: 'font-extrabold',
        900: 'font-black',
    }

    const colorRef = ref('')

    // ######################################
    //                getters
    // ######################################

    const getDeepCopy = computed(() => object => JSON.parse(JSON.stringify(object)))
    const formRowFieldsTemplate = getDeepCopy.value(formRowFields)
    const getFieldData = computed(() => formRows)
    const getSortedFormRows = computed(() => getDeepCopy.value(formRows.value).sort(sortFormRows))
    const getMatchingFormRow = computed(() => id => formRows?.value?.filter(formRow => formRow.id === id)[0])
    const getMatchingField = computed(() => (property,id) => getMatchingFormRow.value(id).fields?.filter(field => field.name === property)[0])
    const getNumberFromInput = computed(() => value => value.replace(/[^\d,.]/g,'').replace(/,/g,'.'))
    const getTrimmedNumber = computed(() => number => parseFloat((+number).toFixed(2).toString()))
    const getBodyFontSize = computed(() => bodyFontSize.value)
    // const getMaxScreenWidth = computed(() => maxScreenWidth.value)
    const getStyleFontSize = computed(() => id => getMatchingFormRow.value(id).fields.filter(field => field.name === 'fontSize')[0].inputValue)
    const getStyleData = computed(() => getSortedFormRows.value.map(formRow => formRow.fields.map(field => `${[field.name]}: ${convertStyleData(field.value,field.givenUnit,field.targetUnit,formRow.id) || ''}`)))
    const getCSS = computed(() => generateCSS())
    const getInlineCSS = computed(() => generateInlineCSS())
    const getGeneratedStyleVariables = computed(() => generateStyleVariables())
    const getTailwindConfigJs = computed(() => generateCustomTailwindClasses())
    const getTailwindClassPrefix = computed(() => property => generateTailwindClassPrefix(property))
    // const getTailwindFontWeightClass = computed(() => value => generateTailwindFontWeightClass(value))

    // ######################################
    //                 actions
    // ######################################
    
    function addFormRow() {
        formRowId.value++ 
        
        formRows.value.push({
            id: formRowId.value,
            fields: getDeepCopy.value(formRowFieldsTemplate),
            baseStyle: false,
            inlineStyle: {},
            active: false
        })

        this.showActiveFormRow(formRowId.value)
    }
    
    function deleteFormRow(id) {
        formRows.value = formRows?.value?.filter(formRow => formRow.id !== id)
    }

    function copyCode(code) {
        console.log('clicked', code);
        navigator.clipboard.writeText(JSON.stringify(code, null, 2))
    }

    function showActiveFormRow(id) {
        getMatchingFormRow.value(id).active = true
        formRows.value
            .filter(formRow => formRow !== getMatchingFormRow.value(id))
            .forEach(formRow => formRow.active = false)
    }

    function handleGlobalInputData(property,value) {
        if (this.hasOwnProperty(property)) this[property] = value

        convertValues()
    }

    function handleInputData(property,value,id,range = null) {
        setProperties(property,value,id,range)

        convertValues()
    }

    function extractGivenUnit(inputValue,matchingField) {
        let givenUnit = inputValue.match(/\D/g)?.join('')?.trim()
        return matchingField?.allowedUnits?.includes(givenUnit) ? givenUnit : matchingField?.allowedUnits?.[0]
    }

    function setProperties(property,value,id,range) {
        const matchingField = getMatchingField.value(property,id)

        if (range) {
            matchingField.inputValue[range] = value
            matchingField.givenUnit[range] = extractGivenUnit(value,matchingField)
        }
        else if (matchingField.allowedValues) {
            matchingField.inputValue = matchingField.allowedValues.includes(value) ? value : ''
        }
        else {
            matchingField.inputValue = value
            matchingField.givenUnit = extractGivenUnit(value,matchingField)
        }
    }

    function convertValues() {
        formRows.value.forEach(formRow => {
            formRow.fields.forEach(field => {
                convertStyleData(field,formRow.id)
            })
        })
    } 

    // TODO: build conversion logic for all properties
    function convertStyleData(field,id) {
        if(!field || !field.inputValue || !convertProperty[field.name]) return 
        if (field.range && !field.inputValue.min && !field.inputValue.max) return

        convertProperty[field.name](field,id)
    }

    function convertFontSize(matchingField,id) {
        let coefficients = []
        let constants = []

        let minValue
        let dynValue
        let maxValue

        // TODO: add other cases, like rem <-> px or em <-> rem
        // if (matchingField.givenUnit.min === 'px' && matchingField.givenUnit.max === 'px') {

        /*

            16px = 16px * x + 320 * y
            48px = 16px * x + 1920 * y

        */

        minValue = getTrimmedNumber.value(matchingField.inputValue.min/getBodyFontSize.value)
        maxValue = getTrimmedNumber.value(matchingField.inputValue.max/getBodyFontSize.value)
        
        coefficients = [
            [(+getBodyFontSize.value), (+minScreenWidth.value)],
            [(+getBodyFontSize.value), (+maxScreenWidth.value)],
        ]
        constants = [matchingField.inputValue.min, matchingField.inputValue.max]
        const [[remFactor],[vwFactor]] = lusolve(coefficients,constants)

        dynValue = `${remFactor.toFixed(2)}rem + ${(vwFactor * 100).toFixed(2)}vw`

        matchingField.convertedValue = minValue === maxValue || Math.abs((vwFactor * 100).toFixed(2)) === 0.00 ? `${minValue}rem` : `clamp(${minValue}rem, ${dynValue}, ${maxValue}rem)`
        
        // } 
    }
    
    function convertDetailTypo(matchingField,id) {
        const { min: minFontSize, max: maxFontSize } = getStyleFontSize.value(id) 
        if (!minFontSize || !maxFontSize) return

        let minPxValue
        let minEmValue
        let maxPxValue
        let maxEmValue
        let dynValue

        // TODO: add other cases, like rem <-> px or em <-> rem
        minPxValue = getTrimmedNumber.value(matchingField.inputValue.min)
        minEmValue = getTrimmedNumber.value(matchingField.inputValue.min/minFontSize)
        maxPxValue = getTrimmedNumber.value(matchingField.inputValue.max)
        maxEmValue = getTrimmedNumber.value(matchingField.inputValue.max/maxFontSize)

        dynValue = `calc(${minPxValue}px + (${maxPxValue} - ${minPxValue}) * ( 100vw - ${(+minScreenWidth.value)}px ) / ( ${(+maxScreenWidth.value)} - ${(+minScreenWidth.value)} ) )`

        matchingField.convertedValue = minEmValue === maxEmValue 
            ? `${minEmValue}em` 
            : `clamp(${Math.min(minEmValue,maxEmValue)}em, ${dynValue}, ${Math.max(minEmValue,maxEmValue)}em)`
    }

    function convertFontWeight(matchingField,id) {
        if (!getTrimmedNumber.value(matchingField.inputValue)) {
            matchingField.convertedValue = ''
            return
        }

        if (isNaN(getTrimmedNumber.value(matchingField.inputValue))) return
        if (getTrimmedNumber.value(matchingField.inputValue) <= 0 || getTrimmedNumber.value(matchingField.inputValue) > 1000) return

        matchingField.convertedValue = getTrimmedNumber.value(matchingField.inputValue).toString()
    }

    function convertTextProperty(matchingField,id) {
        matchingField.convertedValue = matchingField.inputValue
    }

    function convertColor(matchingField,id) {
        const hexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/gm
        const withoutHash = /^(?:[0-9a-fA-F]{3}){1,2}$/gm
        matchingField.convertedValue = matchingField.inputValue.match(hexPattern) 
            ? matchingField.inputValue
            : matchingField.inputValue.match(withoutHash)
            ? `#${matchingField.inputValue}`
            : null 

        watchEffect(async () => {
            try {
                const res = await fetch(`https://www.thecolorapi.com/id?hex=${matchingField.convertedValue.replace('#','')}`);
                const data = await res.json();
                matchingField.className = data?.name?.value.toLowerCase().replace(/[^\w]+/g,'-');
            } catch (error) {
                console.log(error);
            }
        })
    }

    function setBaseStyle(id) {
        getMatchingFormRow.value(id).baseStyle = true
        formRows.value
            .filter(formRow => formRow.id !== id)
            .forEach(formRow => formRow.baseStyle = false)
    }

    function generateRangePropertyClass(field,formRowField,index) {
        let classNameAbbr = `${formRowField.name.match(/^[a-z]/g)}${formRowField.name.match(/((?<=\w)[A-Z])/g)}`
        return `${classNameAbbr.toLowerCase()}${index}`
    }

    function generateFontWeightClass(field,formRowField,index) {
        if (field.convertedValue % 100 === 0) return null
        return `fw${field.convertedValue}`
    }

    function generateColorClass(field,formRowField,index) {
        return field.className
    }

    function generateCustomTailwindClasses() {
        const configObject = { 'theme': { 'extend': {} } }
        const convertedValues = {}
        const convertedValuesSet = {}
        
        formRowFields.reduce((acc,formRowField) => {
            if (formRowField.textProperty) return

            convertedValues[formRowField.name] = {}
            convertedValuesSet[formRowField.name] = []
            let classIndex = 1
            
            getSortedFormRows.value.map(async (sortedFormRow,index) => {
                let matchingField = sortedFormRow.fields.filter(field => field.name === formRowField.name)[0]
                if (!matchingField.convertedValue) return 

                let className = generateCustomClassForProperty[matchingField.name](matchingField,formRowField,classIndex)
                if (!className) return

                if (convertedValuesSet[formRowField.name].includes(matchingField.convertedValue) && matchingField.convertedValue !== '') return
                if (matchingField.convertedValue) convertedValues[formRowField.name][className] = `${matchingField.convertedValue}`
                if (acc) convertedValuesSet[formRowField.name].push(matchingField.convertedValue)

                classIndex ++
            })
            
            return {}
        }, {})

        configObject.theme.extend = convertedValues  
        return configObject
    }

    function generateCSS() {
        const generatedCSS = { 'typography': {} }
        generatedCSS.typography['DEFAULT'] = {
            css: {}
        }
        let selectorName = ''
        let switchClassNames = false

        getSortedFormRows.value.forEach((sortedFormRow,index) => {
            if (switchClassNames) return

            if (sortedFormRow.baseStyle) {
                switchClassNames = true
            }

            if  ((index > 5 && !switchClassNames)) return

            selectorName = switchClassNames === true ? 'p' : `h${index + 1}`
            generatedCSS.typography['DEFAULT']['css'][selectorName] = {}

            sortedFormRow.fields.forEach(field => {
                let convertedValue = field.convertedValue 

                if (convertedValue) {
                    generatedCSS.typography['DEFAULT']['css'][selectorName][field.label] = `${convertedValue}`

                    console.log(convertedValue);
                    getMatchingFormRow.value(sortedFormRow.id).inlineStyle[field.label] = convertedValue
                    
                }
            })
        })

        return generatedCSS
    }

    function generateInlineCSS() {
        console.log('generate inline css');
        return getCSS.value
    }

    function generateStyleVariables() {
        const generatedStyleVariables = {}
        let switchClassNames = false
        let classIndex = 1

        getSortedFormRows.value.forEach(sortedFormRow => {
            if (sortedFormRow.baseStyle) {
                switchClassNames = true
                classIndex = 1
            }

            let variableName = `${switchClassNames === true ? 's' : 't'}${classIndex}`
            generatedStyleVariables[variableName] = {}
            getMatchingFormRow.value(sortedFormRow.id).indexTitle = variableName
            const styleClasses = []

            sortedFormRow.fields.forEach(field => {
                if (!field.convertedValue) return 

                if (field.name === 'fontWeight' && tailwindFontWeightClasses.hasOwnProperty(field.convertedValue)) {
                    styleClasses.push(tailwindFontWeightClasses[field.convertedValue]) 
                    return
                }

                if (field.textProperty) {
                    styleClasses.push(field.convertedValue)
                    return
                }

                Object.entries(getTailwindConfigJs.value.theme.extend[field.name]).forEach(entry => {
                    if (!entry.length) return

                    const className = entry[0]
                    const value = entry[1]

                    if (value === field.convertedValue) {
                        styleClasses.push(`${tailwindClassPrefixes[field.name]}${className}`)
                        return
                    }
                }) 
            })
            
            generatedStyleVariables[variableName] = styleClasses.join(',').replaceAll(',',' ')
            classIndex ++
        })

        return generatedStyleVariables
    }
    
    function sortFormRows(a,b) {
        const aFontSize = a.fields.filter(field => field.name === 'fontSize')[0].inputValue.max 
        const bFontSize = b.fields.filter(field => field.name === 'fontSize')[0].inputValue.max 
        const aFontWeight = a.fields.filter(field => field.name === 'fontWeight')[0].convertedValue || '400'
        const bFontWeight = b.fields.filter(field => field.name === 'fontWeight')[0].convertedValue || '400'
        const aLineHeight = a.fields.filter(field => field.name === 'lineHeight')[0].inputValue
        const bLineHeight = b.fields.filter(field => field.name === 'lineHeight')[0].inputValue

        if (aFontSize === bFontSize) {
            if (bFontWeight === aFontWeight) {
                return bLineHeight - aLineHeight
            }
            return bFontWeight - aFontWeight 
        } 
        return bFontSize - aFontSize 
    }

    return { 
        formRowId, 
        bodyFontSize, 
        minScreenWidth, 
        maxScreenWidth, 
        formRows, 
        convertFontSize, 
        // convertLineHeight, 
        getDeepCopy, 
        copyCode,
        getFieldData, 
        getSortedFormRows, 
        getStyleData, 
        getCSS, 
        getGeneratedStyleVariables, 
        getMatchingFormRow, 
        getMatchingField, 
        getNumberFromInput, 
        getStyleFontSize, 
        getTrimmedNumber, 
        getTailwindConfigJs, 
        addFormRow, 
        showActiveFormRow, 
        deleteFormRow, 
        handleInputData, 
        setBaseStyle, 
        handleGlobalInputData, 
        convertValues, 
        generateCSS, 
        getInlineCSS, 
        generateStyleVariables, 
        colorRef 
    }
})