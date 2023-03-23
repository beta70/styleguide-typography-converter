<script setup>
  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
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
              {{ this.fieldData }}
              {{ this.baseFontSize }}
              {{ this.maxScreenWidth }}
            </code>
          </pre>
          <pre class="text-black">
            <code>
              {{ this.styleData }}
            </code>
          </pre>
        </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      baseFontSize: '',
      maxScreenWidth: '',
      generatedStyles: [
        {}
      ],
      formRows: [
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
      ],
      styleData: [],
    }
  },
  components: {
    Form,
    Tabs
  },
  computed: {
    fieldData() {
      return this.formRows
    },
    styleData() {
      return this.styleData
    },
  },
  methods: {
    handleGlobalInputData(property,inputValue) {
      if (property === 'base font-size') this.baseFontSize = `${inputValue}px`
      if (property === 'max screen-width') this.maxScreenWidth = `${inputValue}px`
    },
    handleInputData(property,inputValue,id,key = 'value') {
      if (typeof inputValue === 'object') console.log('hallo test');
      const matchingFormRow = this.formRows.filter(formRow => formRow.id === id)[0]
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
    },
    handleConversionOptions(property,value,id) {
      this.handleInputData(property,value,id,'targetUnit')
    },
    handleFontSizeInput(range,property,value,id) {
      console.log(range,property,value,id);
      this.handleInputData(property,value,id,range)
    },
    deleteFormRow(id) {
      this.formRows = this.formRows.filter(formRow => formRow.id !== id)
      this.styleData = this.styleData.filter(data => data.id !== id)
    },
    addFormRow() {
      this.formRows.push(
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
    },
    // handleInputData(property,inputValue,id,givenUnit,key = 'value') {
    //   console.log(property,inputValue,id,givenUnit,key);
    //   const defaultUnit = this.getDefaultUnit(property,id,key) || ''
    //   const baseUnit = key === 'conversionUnit' ? inputValue : (givenUnit ? givenUnit : defaultUnit)
    //   const propertyValue = inputValue === 'color' ? inputValue : inputValue.replace(/\D/g,'')

    //   console.log(propertyValue,baseUnit);

    //   // check if style exists with id matching a form row
    //   if (!this.styleIdExists(id)) {
    //     // handle standard field input and create new property
    //     if (typeof key === 'string') {
    //       this.styleData.push({
    //         id: id,
    //         [property]: {
    //           [key]: `${propertyValue}${baseUnit}`,
    //         }
    //       })
    //     }
    //     // handle font size input as nested object and create new property
    //     if (typeof key === 'object') {
    //       this.styleData.push({
    //         id: id,
    //         [property]: {
    //           'value': {
    //             [key.range]: `${key.value}${baseUnit}`
    //           }
    //         }
    //       })
    //     }
    //     return
    //   } 

    //   const matchingStyle = this.styleData.filter(style => style.id === id)
    //   // add values to existing properties
    //   if (typeof key === 'string') {
    //     if (matchingStyle[0].hasOwnProperty([property])) {
    //       matchingStyle[0][property][key] = `${propertyValue}${baseUnit}`
    //       return
    //     }
    //     matchingStyle[0][property] = {
    //       'value': `${propertyValue}${baseUnit}`
    //     }
    //   }
    //   // handling font min and max
    //   if (typeof key === 'object') {
    //     if (matchingStyle[0].hasOwnProperty([property])) {
    //       if (matchingStyle[0][property].hasOwnProperty('value')) {
    //         matchingStyle[0][property]['value'][key.range] = `${key.value}${baseUnit}`
    //         return
    //       }
    //       matchingStyle[0][property]['value'] = {
    //         [key.range]: `${key.value}${baseUnit}`
    //       }
    //       return
    //     }
    //     matchingStyle[0][property] = {
    //       'value': {
    //         [key.range]: `${key.value}${baseUnit}`
    //       }
    //     }
    //   }
    // },
  },
  mounted() {
  }

}

</script>