import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFormRowStore = defineStore('formRow', () => {

    // state
    const formRowId = ref(0)
    const formRows = ref([
        {
            id: formRowId.value,
            fields: [
                { 
                    name: 'font-size',
                    fieldType: 'input',
                    placeholder: '16px',
                    dataType: 'number',
                    allowedUnits: ['px','rem','em'],
                    conversionOptions: ['rem','vw','clamp()'],
                    range: true,
                    targetUnit: 'rem',
                    givenUnit: '',
                    value: {
                    min: '',
                    max: '',
                    },
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
                    value: '',
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
                    value: '',
                },
                { 
                    name: 'font-weight',
                    fieldType: 'input',
                    placeholder: '400',
                    dataType: 'number',
                    value: '',
                },
                { 
                    name: 'color',
                    fieldType: 'input',
                    placeholder: '#ACACAC',
                    dataType: 'string',
                    value: '',
                },
            ]
        }
    ])
    const showFontSizeRange = ref(false)
    const inputTextColor = ref('')

    // getters
    const fieldData = computed(() => formRows)
    const getMatchingFormRow = computed(() => id => formRows?.value?.filter(formRow => formRow.id === id)[0])
    const getMatchingField = computed(() => (property,id) => getMatchingFormRow.value(id).fields?.filter(field => field.name === property)[0])

    // actions
    function addFormRow() {
        formRowId.value++ 
        
        formRows.value.push({
            id: formRowId.value,
            fields: [
                { 
                    name: 'font-size',
                    fieldType: 'input',
                    placeholder: '16px',
                    dataType: 'number',
                    allowedUnits: ['px','rem','em'],
                    conversionOptions: ['rem','vw','clamp()'],
                    range: true,
                    targetUnit: 'rem',
                    givenUnit: '',
                    value: {
                    min: '',
                    max: '',
                    },
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
                    value: '',
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
                    value: '',
                },
                { 
                    name: 'font-weight',
                    fieldType: 'input',
                    placeholder: '400',
                    dataType: 'number',
                    value: '',
                },
                { 
                    name: 'color',
                    fieldType: 'input',
                    placeholder: '#ACACAC',
                    dataType: 'string',
                    value: '',
                },
            ]
        })
    }
    function deleteFormRow(id) {
        formRows.value = formRows?.value?.filter(formRow => formRow.id !== id)
    }

    function handleInputData(property,inputValue,id,key = 'value') {
        
        if (property === 'color') {
            inputValue = inputValue.startsWith('#') ? inputValue : `#${inputValue}`
        }

        const matchingField = getMatchingField.value(property,id)
        let givenUnit

        if (key === 'value') {
            givenUnit = inputValue.match(/\D/g)?.join('')?.trim()
            givenUnit = matchingField?.allowedUnits?.includes(givenUnit) ? givenUnit : matchingField?.allowedUnits?.[0]
            matchingField['givenUnit'] = givenUnit
            inputValue = matchingField.dataType === 'string' ? inputValue : inputValue.replace(/\D/g,'')
            matchingField[key] = inputValue
            return
        }

        if (key === 'min' || key === 'max') {
            givenUnit = inputValue?.match(/\D/g)?.join('')?.trim()
            givenUnit = matchingField?.allowedUnits?.includes(givenUnit) ? givenUnit : matchingField?.allowedUnits?.[0]
            matchingField['givenUnit'] = givenUnit
            inputValue = matchingField.dataType === 'string' ? inputValue : inputValue?.replace(/\D/g,'')
            matchingField['value'][key] = inputValue
            return
        }

        matchingField[key] = inputValue
    }
    function handleFontSizeInput(range,property,value,id) {
        handleInputData(property,value,id,range)
    }
    

    return { formRowId, formRows, fieldData, getMatchingFormRow, getMatchingField, addFormRow, deleteFormRow, handleInputData, handleFontSizeInput }
})