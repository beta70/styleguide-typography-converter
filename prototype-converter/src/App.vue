<script setup>

  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
  import { computed,ref } from 'vue'

  const formRows = ref([
    {
      id: Math.ceil(Math.random() * 1000000),
      fields: [
        { 
          name: 'font-size',
          fieldType: 'input',
          placeholder: '16px',
          dataType: 'number',
          allowedUnits: ['px','rem','em'],
          conversionOptions: ['rem','vw','clamp()'],
          range: true,
          targetUnit: '',
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
          targetUnit: '',
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
          targetUnit: '',
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
  function addFormRow() {
    formRows.value.push(
      {
        id: Math.ceil(Math.random() * 1000000),
        fields: [
          { 
            name: 'font-size',
            fieldType: 'input',
            placeholder: '16px',
            dataType: 'number',
            allowedUnits: ['px','rem','em'],
            conversionOptions: ['rem','vw','clamp()'],
            range: true,
            targetUnit: '',
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
            targetUnit: '',
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
            targetUnit: '',
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
    )
  }
  function deleteFormRow(id) {
    formRows.value = formRows.value.filter(formRow => formRow.id !== id)
    styleData.value = styleData.value.filter(data => data.id !== id)
  }
  const fieldData = computed(() => {
    return formRows
  })
  const styleData = computed(() => {
    return formRows
  })


  const baseFontSize = ref('')
  const maxScreenWidth = ref('')
  function handleGlobalInputData(property,inputValue) {
    if (property === 'base font-size') baseFontSize.value = `${inputValue}px`
    if (property === 'max screen-width') maxScreenWidth.value = `${inputValue}px`
  }
  
  function handleInputData(property,inputValue,id,key = 'value') {
    const matchingFormRow = formRows.value.filter(formRow => formRow.id === id)[0]
    const matchingField = matchingFormRow?.fields?.filter(field => field.name === property)[0]
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
  function handleConversionOptions(property,value,id) {
    handleInputData(property,value,id,'targetUnit')
  }

  
  const generatedStyles = ref({})


</script>

<template>
  <div>
      <Form 
        v-bind:form-rows="formRows" 
        :base-font-size="baseFontSize"
        :max-screen-width="maxScreenWidth"
        @handle-input-data="handleInputData"
        @handle-conversion-options="handleConversionOptions"
        @handle-font-size-input="handleFontSizeInput" 
        @handle-global-input-data="handleGlobalInputData"
        @add-form-row="addFormRow"
        @delete-form-row="deleteFormRow"
        @save-form-data="saveFormData"

        />
        <div class="flex justify-around">
          <pre class="text-black">
            <code>
              {{ fieldData }}
              {{ baseFontSize }}
              {{ maxScreenWidth }}
            </code>
          </pre>
          <pre class="text-black">
            <code>
              {{ styleData }}
            </code>
          </pre>
        </div>
  </div>
</template>