import { defineStore } from 'pinia'
import { ref, computed, watchEffect } from 'vue'
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
        },
        { 
            name: 'textTransform',
            label: 'text-transform',
            placeholder: 'uppercase',
            allowedValues: ['uppercase','lowercase','capitalize'],
            inputValue: '',
            convertedValue: '',
            className: '',
        },
    ]
    const formRows = ref([
        {
            id: formRowId.value,
            fields: formRowFields,
            baseStyle: false,
            active: true,
            generatedClasses: []
        }
    ])
    const convertProperty = {
        fontSize: convertFontSize,
        lineHeight: convertLineHeight,
        letterSpacing: convertLetterSpacing,
        fontWeight: convertFontWeight,
        textDecoration: convertTextProperty,
        textTransform: convertTextProperty,
        // color: this.convertColor(),
    }


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
    const getMaxScreenWidth = computed(() => maxScreenWidth.value)
    const getStyleFontSize = computed(() => id => getMatchingFormRow.value(id).fields.filter(field => field.name === 'fontSize')[0].inputValue)
    const getStyleData = computed(() => getSortedFormRows.value.map(formRow => formRow.fields.map(field => `${[field.name]}: ${convertStyleData(field.value,field.givenUnit,field.targetUnit,formRow.id) || ''}`)))
    const getCSS = computed(() => generateCSS())
    const getGeneratedStyleVariables = computed(() => generateStyleVariables())
    const getTailwindConfigJs = computed(() => generateCustomTailwindClasses())
    const getTailwindClassPrefix = computed(() => property => generateTailwindClassPrefix(property))
    const getTailwindFontWeightClass = computed(() => value => generateTailwindFontWeightClass(value))

    // ######################################
    //                 actions
    // ######################################
    
    function addFormRow() {
        formRowId.value++ 
        
        formRows.value.push({
            id: formRowId.value,
            fields: getDeepCopy.value(formRowFieldsTemplate),
            baseStyle: false,
            generatedClasses: [],
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
        else if (matchingField.allowedValues.length) {
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
        if(!field || !convertProperty[field.name]) return 
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

        minValue = getTrimmedNumber.value(matchingField.inputValue.min/getBodyFontSize.value)
        maxValue = getTrimmedNumber.value(matchingField.inputValue.max/getBodyFontSize.value)
        
        coefficients = [
            [(+getBodyFontSize.value), (+minScreenWidth.value)],
            [(+getBodyFontSize.value), (+maxScreenWidth.value)],
        ]
        constants = [matchingField.inputValue.min, matchingField.inputValue.max]
        const [[remFactor],[vwFactor]] = lusolve(coefficients,constants)

        dynValue = `${remFactor.toFixed(2)}rem + ${(vwFactor * 100).toFixed(2)}vw`

        matchingField.convertedValue = `clamp(${minValue}rem, ${dynValue}, ${maxValue}rem)`
        
        // } 
    }
    
    function convertLineHeight(matchingField,id) {
        const { min: minFontSize, max: maxFontSize } = getStyleFontSize.value(id) 
        if (!minFontSize || !maxFontSize) return

        let coefficients = []
        let constants = []

        let minValue
        let dynValue
        let maxValue

        // TODO: add other cases, like rem <-> px or em <-> rem
        // if (matchingField.givenUnit.min === 'px' && matchingField.givenUnit.max === 'px') {

        minValue = getTrimmedNumber.value(matchingField.inputValue.min/minFontSize)
        maxValue = getTrimmedNumber.value(matchingField.inputValue.max/maxFontSize)
        
        coefficients = [
            [(+minValue), (+minScreenWidth.value)],
            [(+minValue), (+maxScreenWidth.value)],
        ]
        constants = [minValue, maxValue]
        const [[numFactor],[vwFactor]] = lusolve(coefficients,constants)
        dynValue = `${numFactor.toFixed(2)} + ${(vwFactor * 100).toFixed(2)}vw`

        matchingField.convertedValue = minValue === maxValue || Math.abs((vwFactor * 100).toFixed(2)) === 0.00 ? minValue : `clamp(${minValue}, ${dynValue}, ${maxValue})`
        
        // } 
    }

    function convertLetterSpacing(matchingField,id) {
        const { min: minFontSize, max: maxFontSize } = getStyleFontSize.value(id) 
        if (!minFontSize || !maxFontSize) return

        let coefficients = []
        let constants = []

        let minValue
        let dynValue
        let maxValue

        // TODO: add other cases, like rem <-> px or em <-> rem
        // if (matchingField.givenUnit.min === 'px' && matchingField.givenUnit.max === 'px') {

        minValue = getTrimmedNumber.value(matchingField.inputValue.min/minFontSize)
        maxValue = getTrimmedNumber.value(matchingField.inputValue.max/maxFontSize).toFixed(3) > 0 ? getTrimmedNumber.value(matchingField.inputValue.max/maxFontSize).toFixed(2) : 0
        
        coefficients = [
            [(+minValue), (+minScreenWidth.value)],
            [(+minValue), (+maxScreenWidth.value)],
        ]
        constants = [minValue, maxValue]
        const [[emFactor],[vwFactor]] = lusolve(coefficients,constants)
        dynValue = `${emFactor.toFixed(2)}em + ${(vwFactor * 100).toFixed(3)}vw`

        matchingField.convertedValue = minValue === maxValue || Math.abs((vwFactor * 100).toFixed(3)) === 0.00 ? minValue : `clamp(${minValue}em, ${dynValue}, ${maxValue}em)`
        
        // } 
    }

    function convertFontWeight(matchingField,id) {
        matchingField.convertedValue = getTrimmedNumber.value(matchingField.inputValue)
    }

    function convertTextProperty(matchingField,id) {
        matchingField.convertedValue = matchingField.inputValue
    }



    


    function setBaseStyle(id) {
        getMatchingFormRow.value(id).baseStyle = true
        formRows.value
            .filter(formRow => formRow.id !== id)
            .forEach(formRow => formRow.baseStyle = false)
    }

    


    function generateCustomTailwindClasses() {
        const configObject = { 'theme': { 'extend': {} } }
        const convertedValues = {}
        const convertedValuesSet = {}
        
        formRowFields.reduce((acc,formRowField) => {
            if (formRowField.name === 'textTransform' || formRowField.name === 'textDecoration') return

            convertedValues[formRowField.name] = {}
            convertedValuesSet[formRowField.name] = []
            let classIndex = 1
            
            getSortedFormRows.value.forEach((sortedFormRow,index) => {
                let matchingField = sortedFormRow.fields.filter(field => field.name === formRowField.name)[0]
                let convertedValue = matchingField.convertedValue
                let className

                if (!convertedValue) return 

                switch (matchingField.name) {
                    case 'fontWeight':
                        if (convertedValue === 0 || convertedValue > 1000) return 
                        if (convertedValue % 100 === 0) return
                        className = `fw${convertedValue}`
                        break;
                    case 'color':
                        className = matchingField.className
                        break;
                    default:
                        let classNameAbbr = `${formRowField.name.match(/^[a-z]/g)}${formRowField.name.match(/((?<=\w)[A-Z])/g)}`
                        className = `${classNameAbbr.toLowerCase()}${classIndex}`
                        break;
                }

                if (convertedValuesSet[formRowField.name].includes(convertedValue) && convertedValue !== '') return
                if (convertedValue) convertedValues[formRowField.name][className] = `${convertedValue}`
                if (acc) convertedValuesSet[formRowField.name].push(convertedValue)

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

                if (convertedValue) generatedCSS.typography['DEFAULT']['css'][selectorName][field.label] = `${convertedValue}`
            })
        })

        return generatedCSS
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
            let styleClasses = []

            sortedFormRow.fields.forEach(field => {
                let propertyName = field.name.replace(/((?<=-)[a-z])/g, (match) => match.toUpperCase()).replace(/(?!\w)-/g,'')
                let styleValue = `${field.convertedValue}${field.targetUnit === 'clamp()' || field.targetUnit === 'num' ? '' : field.targetUnit || ''}`

                if (field.name === 'text-transform' || field.name === 'text-decoration') {
                    if (field.inputValue) styleClasses.push(field.inputValue)
                    return
                }

                if (!getTailwindConfigJs.value.theme.extend.hasOwnProperty(propertyName) || (propertyName === 'fontSize' && !Object.keys(getTailwindConfigJs.value.theme.extend.fontSize).length)) return

                if (field.name === 'font-weight' && !Object.values(getTailwindConfigJs.value.theme.extend['fontWeight']).length) styleClasses.push(`${getTailwindFontWeightClass.value(field.inputValue)}`) 

                Object.entries(getTailwindConfigJs.value.theme.extend[propertyName]).forEach(entry => {
                    const property = entry[0]
                    const convertedValue = entry[1]
                    if (convertedValue === styleValue) {
                        styleClasses.push(`${getTailwindClassPrefix.value(property)}${property}`)
                        return
                    }

                }) 
            })
            
            generatedStyleVariables[variableName] = styleClasses.join(',').replaceAll(',',' ')
            classIndex ++
        })

        return generatedStyleVariables
    }
    function generateTailwindClassPrefix(property) {
        let propertyAbbr = property.substring(0,2)
        let prefix = ''

        switch (propertyAbbr) {
            case 'fs':
                prefix = 'text-'
                break;
            case 'lh':
                prefix = 'leading-'
                break;
            case 'ls':
                prefix = 'tracking-'
                break;
            case 'fw':
                prefix = 'font-'
                break;
            default:
                prefix = 'text-'
                break;
        }
        
        return prefix
    }
    function generateTailwindFontWeightClass(value) {
        let className = ''

        switch (value) {
            case '100':
                className = 'font-thin'
                break;
            case '200':
                className = 'font-extralight'
                break;
            case '300':
                className = 'font-light'
                break;
            case '400':
                className = 'font-normal'
                break;
            case '500':
                className = 'font-medium'
                break;
            case '600':
                className = 'font-semibold'
                break;
            case '700':
                className = 'font-bold'
                break;
            case '800':
                className = 'font-extrabold'
                break;
            case '900':
                className = 'font-black'
                break;
            default:
                className = 'font-normal'
                break;
        }
        
        return className
    }
    function sortFormRows(a,b) {
        const aFontSize = a.fields.filter(field => field.name === 'font-size')[0].inputValue.max 
        const bFontSize = b.fields.filter(field => field.name === 'font-size')[0].inputValue.max 
        const aFontWeight = a.fields.filter(field => field.name === 'font-weight')[0].inputValue || '400'
        const bFontWeight = b.fields.filter(field => field.name === 'font-weight')[0].inputValue || '400'
        const aLineHeight = a.fields.filter(field => field.name === 'line-height')[0].inputValue
        const bLineHeight = b.fields.filter(field => field.name === 'line-height')[0].inputValue

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
        // convertStyleData, 
        convertValues, 
        generateCSS, 
        generateStyleVariables 
    }
})