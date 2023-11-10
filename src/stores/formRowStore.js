import { defineStore } from 'pinia'
import { ref, computed, watchEffect } from 'vue'

export const useFormRowStore = defineStore('formRow', () => {
    
    // ######################################
    //                  state
    // ######################################

    const formRowId = ref(0)
    const bodyFontSize = ref(16)
    const maxScreenWidth = ref(1920)
    const isBaseFontSize = ref(false)
    const formRowFields = [
        { 
            name: 'font-size',
            fieldType: 'input',
            placeholder: '16px',
            dataType: 'number',
            allowedUnits: ['px','rem','em'],
            conversionOptions: ['rem','vw','clamp()'],
            range: true,
            baseFontSize: false,
            givenUnit: '',
            targetUnit: 'rem',
            inputValue: {
                min: '',
                max: '',
            },
            convertedValue: '',
        },
        { 
            name: 'line-height',
            fieldType: 'input',
            dataType: 'number',
            placeholder: '24px',
            allowedUnits: ['px','rem','em','num'],
            conversionOptions: ['num','rem'],
            givenUnit: '',
            targetUnit: 'num',
            inputValue: '',
            convertedValue: '',
        },
        { 
            name: 'letter-spacing',
            fieldType: 'input',
            dataType: 'number',
            placeholder: '1px',
            allowedUnits: ['px','rem','em'],
            conversionOptions: ['em','rem'],
            givenUnit: '',
            targetUnit: 'em',
            inputValue: '',
            convertedValue: '',
        },
        { 
            name: 'font-weight',
            fieldType: 'input',
            placeholder: '400',
            dataType: 'number',
            inputValue: '',
            convertedValue: '',
        },
        { 
            name: 'color',
            fieldType: 'input',
            placeholder: '#ACACAC',
            dataType: 'string',
            inputValue: '',
            convertedValue: '',
            className: '',
        },
        { 
            name: 'text-transform',
            fieldType: 'input',
            placeholder: 'uppercase',
            allowedUnits: ['uppercase','lowercase','capitalize'],
            dataType: 'string',
            inputValue: '',
            convertedValue: '',
            className: '',
        },
        { 
            name: 'text-decoration',
            fieldType: 'input',
            placeholder: 'underline',
            allowedUnits: ['underline','overline','line-through'],
            dataType: 'string',
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
    const getTrimmedNumber = computed(() => number => parseFloat(number.toFixed(2).toString()))
    const getBodyFontSize = computed(() => bodyFontSize.value)
    const getMaxScreenWidth = computed(() => maxScreenWidth.value)
    const getStyleFontSize = computed(() => id => getMatchingFormRow.value(id).fields[0].inputValue.max || 16)
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

    function handleInputData(property,value,id,key = 'inputValue') {
        // TODO: detect givenUnit
        const matchingField = getMatchingField.value(property,id)
        let givenUnit

        if (property === 'color') {
            value = value.startsWith('#') ? value : `#${value}`
            watchEffect(async () => {
                try {
                    const res = await fetch(`https://www.thecolorapi.com/id?hex=${value?.replace('#','')}`)
                    const data = await res.json()
                    matchingField.className = data?.name?.value.toLowerCase().replace(/[^\w]+/g,'-')
                } catch (error) {
                    console.log(error);
                }
            })
        }

        if (key === 'inputValue') {
            if (property === 'text-transform' || property === 'text-decoration') {
                if (!matchingField.allowedUnits.includes(value)) {
                    value = ''
                }
            }

            givenUnit = value.match(/\D/g)?.join('')?.trim()
            givenUnit = matchingField?.allowedUnits?.includes(givenUnit) ? givenUnit : matchingField?.allowedUnits?.[0]
            matchingField['givenUnit'] = givenUnit
            value = matchingField.dataType === 'string' ? value : getNumberFromInput.value(value)
            matchingField[key] = value
            setConvertedValues()
            return
        }

        if (key === 'min' || key === 'max') {
            givenUnit = value?.match(/\D/g)?.join('')?.trim()
            givenUnit = matchingField?.allowedUnits?.includes(givenUnit) ? givenUnit : matchingField?.allowedUnits?.[0]
            matchingField['givenUnit'] = givenUnit
            value = matchingField.dataType === 'string' ? value : getNumberFromInput.value(value)
            matchingField['inputValue'][key] = value
            setConvertedValues()
            return
        }

        matchingField[key] = value
        setConvertedValues()
    }

    function handleFontSizeInput(range,property,value,id) {
        handleInputData(property,value,id,range)
    }

    function setBaseStyle(id) {
        getMatchingFormRow.value(id).baseStyle = true
        formRows.value
            .filter(formRow => formRow.id !== id)
            .forEach(formRow => formRow.baseStyle = false)
    }

    function handleGlobalStyleInput(property,value) {
        if (this.hasOwnProperty(property)) this[property] = value
        setConvertedValues()
    }

    function setConvertedValues() {
        formRows.value.forEach(formRow => {
            formRow.fields.forEach(field => {
                convertStyleData(field,formRow.id)
            })
        })
    } 

    function convertStyleData(field,id) {
        if(!field) return 

        let minFontSize
        let maxFontSize
        let inputValue

        if (field.givenUnit === undefined) {
            field.convertedValue = field.inputValue
            return 
        }
        
        if (field.givenUnit === 'px') {
            if (typeof field.inputValue === 'object') {
                minFontSize = field.inputValue.min
                maxFontSize = field.inputValue.max
            }

            inputValue = maxFontSize ? maxFontSize : field.inputValue

            if (field.targetUnit === 'rem') {
                field.convertedValue = getTrimmedNumber.value(inputValue/(getBodyFontSize.value))
            }
            if (field.targetUnit === 'em' || field.targetUnit === 'num') {
                field.convertedValue = getTrimmedNumber.value(inputValue/(getStyleFontSize.value(id)))
            }
            if (field.targetUnit === 'vw') {
                field.convertedValue = getTrimmedNumber.value(inputValue*100/(getMaxScreenWidth.value))
            }
            if (field.targetUnit === 'clamp()') {
                field.convertedValue = `clamp(${getTrimmedNumber.value(minFontSize/getBodyFontSize.value)}rem, ${getTrimmedNumber.value(maxFontSize*100/getMaxScreenWidth.value)}vw, ${getTrimmedNumber.value(maxFontSize/getBodyFontSize.value)}rem)`
            }
        }
    }

    function generateCustomTailwindClasses() {
        let fieldName = ''
        const configObject = { 'theme': { 'extend': {} } }
        const convertedValues = {}
        const convertedValuesSet = {}
        
        formRowFields.reduce((acc,formRowField) => {
            if (formRowField.name === 'text-transform' || formRowField.name === 'text-decoration') return

            fieldName = formRowField.name.replace(/((?<=-)[a-z])/g, (match) => match.toUpperCase()).replace(/(?!\w)-/g,'')
            convertedValues[fieldName] = {}
            convertedValuesSet[fieldName] = []
            let classIndex = 1
            
            getSortedFormRows.value.forEach((sortedFormRow,index) => {
                let matchingField = sortedFormRow.fields.filter(field => field.name === formRowField.name)[0]
                let convertedValue = matchingField.convertedValue
                let targetUnit = convertedValue ? matchingField.targetUnit : ''
                let className = ''

                if (!convertedValue) return 

                switch (matchingField.name) {
                    case 'font-weight':
                        if (convertedValue === 0 || convertedValue > 1000) return 
                        if (convertedValue % 100 === 0) return
                        className = `fw${convertedValue}`
                        break;
                    case 'color':
                        className = matchingField.className
                        break;
                    default:
                        let classNameAbbr = `${fieldName.match(/^[a-z]/g)}${fieldName.match(/((?<=\w)[A-Z])/g)}`
                        className = `${classNameAbbr.toLowerCase()}${classIndex}`
                        break;
                }

                if (convertedValuesSet[fieldName].includes(convertedValue) && convertedValue !== '') return
                if (convertedValue) convertedValues[fieldName][className] = `${convertedValue}${targetUnit === 'clamp()' || targetUnit === 'num' ? '' : targetUnit || ''}`
                if (acc) convertedValuesSet[fieldName].push(convertedValue)

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

        getSortedFormRows.value.forEach((sortedFormRow,index) => {
            selectorName = sortedFormRow.baseStyle ? 'p' : `h${index + 1}`
            generatedCSS.typography['DEFAULT']['css'][selectorName] = {}

            sortedFormRow.fields.forEach(field => {
                let convertedValue = field.convertedValue 
                let targetUnit = convertedValue ? field.targetUnit : ''

                if (convertedValue) generatedCSS.typography['DEFAULT']['css'][selectorName][field.name] = `${convertedValue}${targetUnit === 'clamp()' || targetUnit === 'num' ? '' : targetUnit || ''}`
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

                if (!getTailwindConfigJs.value.theme.extend.hasOwnProperty(propertyName) || (propertyName === 'fontSize' && !Object.keys(getTailwindConfigJs.value.theme.extend.fontSize).length)) return

                if (field.name === 'font-weight' && !Object.values(getTailwindConfigJs.value.theme.extend['fontWeight']).length) styleClasses.push(`${getTailwindFontWeightClass.value(field.inputValue)}`) 
                if (field.name === 'text-transform' || field.name === 'text-decoration') {
                    if (field.inputValue) styleClasses.push(field.inputValue)
                    return
                }

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
        maxScreenWidth, 
        formRows, 
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
        handleFontSizeInput, 
        setBaseStyle, 
        handleGlobalStyleInput, 
        convertStyleData, 
        setConvertedValues, 
        generateCSS, 
        generateStyleVariables 
    }
})