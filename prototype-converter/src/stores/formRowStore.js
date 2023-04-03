import { defineStore } from 'pinia'
import { ref, computed, watchEffect, watch } from 'vue'

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
            targetUnit: 'rem',
            givenUnit: '',
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
            targetUnit: 'num',
            givenUnit: '',
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
            targetUnit: 'em',
            givenUnit: '',
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
        },
    ]
    const formRows = ref([
        {
            id: formRowId.value,
            fields: formRowFields,
            baseStyle: false
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
    const getTailwindConfigJs = computed(() => generateTailwindConfigJs())

    // ######################################
    //                 actions
    // ######################################
    function addFormRow() {
        formRowId.value++ 
        
        formRows.value.push({
            id: formRowId.value,
            fields: getDeepCopy.value(formRowFieldsTemplate)
        })
    }
    function deleteFormRow(id) {
        formRows.value = formRows?.value?.filter(formRow => formRow.id !== id)
    }
    function handleInputData(property,value,id,key = 'inputValue') {
        // TODO: detect givenUnit
        if (property === 'color') {
            value = value.startsWith('#') ? value : `#${value}`
        }

        const matchingField = getMatchingField.value(property,id)
        let givenUnit

        if (key === 'inputValue') {
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
    function generateTailwindConfigJs() {
        // TODO: generate color names for custom colors
        let fieldName
        let convertedValues = {}
        let switchClassNames = false
        
        formRowFields.forEach(formRowField => {
            fieldName = formRowField.name.replace(/((?<=-)[a-z])/g, (match) => match.toUpperCase()).replace(/(?!\w)-/g,'')
            convertedValues[fieldName] = {}
            let classIndex = 1
            
            getSortedFormRows.value.forEach((sortedFormRow,index) => {
                let matchingField = sortedFormRow.fields.filter(field => field.name === formRowField.name)[0]
                let convertedValue = matchingField.convertedValue 
                let targetUnit = convertedValue ? matchingField.targetUnit : ''

                if (sortedFormRow.baseStyle) {
                    switchClassNames = true
                    classIndex = 1
                }

                let className = `${switchClassNames ? 's' : 't'}${classIndex}`

                convertedValues[fieldName][className] = `${convertedValue}${targetUnit === 'clamp()' || targetUnit === 'num' ? '' : targetUnit || ''}`
                classIndex ++
            })
            
            switchClassNames = false
        })

        return convertedValues
    }

    function generateCSS() {
        return 'hallo'
    }

    function sortFormRows(a,b) {
        return b.fields[0].inputValue.max - a.fields[0].inputValue.max
    }

    return { formRowId, bodyFontSize, maxScreenWidth, formRows, getDeepCopy, getFieldData, getSortedFormRows, getStyleData, getCSS, getMatchingFormRow, getMatchingField, getNumberFromInput, getStyleFontSize, getTrimmedNumber, getTailwindConfigJs, addFormRow, deleteFormRow, handleInputData, handleFontSizeInput, setBaseStyle, handleGlobalStyleInput, convertStyleData, setConvertedValues, generateCSS }
})