<script setup>
  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
</script>

<template>
  <div>
    <div>
      <!-- <Tabs/> -->
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
          <pre class="text-white">
            <code>
              {{ this.fieldData }}
              {{ this.baseFontSize }}
              {{ this.maxScreenWidth }}
            </code>
          </pre>
          <pre class="text-white">
            <code>
              {{ this.styles }}
            </code>
          </pre>
        </div>
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
              baseUnit: 'px',
              conversionOptions: ['rem','vw','clamp()'],
              range: true,
              dataType: 'number',
            },
            { 
              name: 'line-height',
              fieldType: 'input',
              placeholder: '24px',
              baseUnit: 'px',
              conversionOptions: ['num','rem'],
              dataType: 'number',
            },
            { 
              name: 'letter-spacing',
              fieldType: 'input',
              placeholder: '1px',
              baseUnit: 'px',
              conversionOptions: ['em','rem'],
              dataType: 'number',
            },
            { 
              name: 'font-weight',
              fieldType: 'input',
              placeholder: '400',
              dataType: 'number',
            },
            { 
              name: 'color',
              fieldType: 'input',
              placeholder: '#ACACAC',
              dataType: 'string',
            },
          ]
        }
      ],
      styles: [],
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
    styles() {
      return this.styles
    },
  },
  methods: {
    handleGlobalInputData(property,inputValue) {
      if (property === 'base font-size') this.baseFontSize = `${inputValue}px`
      if (property === 'max screen-width') this.maxScreenWidth = `${inputValue}px`
    },
    handleInputData(property,inputValue,id,key = 'value') {
      const baseUnit = this.getBaseUnit(property,id,key) || ''
      // check if style exists with id matching a form row
      if (!this.styleIdExists(id)) {
        // handle standard field input and create new property
        if (typeof key === 'string') {
          this.styles.push({
            id: id,
            [property]: {
              [key]: `${inputValue}${baseUnit}`,
            }
          })
        }
        // handle font size input as nested object and create new property
        if (typeof key === 'object') {
          this.styles.push({
            id: id,
            [property]: {
              'value': {
                [key.range]: `${key.value}${baseUnit}`
              }
            }
          })
        }
        return
      } 

      const matchingStyle = this.styles.filter(style => style.id === id)
      // add values to existing properties
      if (typeof key === 'string') {
        if (matchingStyle[0].hasOwnProperty([property])) {
          matchingStyle[0][property][key] = `${inputValue}${baseUnit}`
          return
        }
        matchingStyle[0][property] = {
          [key]: `${inputValue}${baseUnit}`
        }
      }
      if (typeof key === 'object') {
        if (matchingStyle[0].hasOwnProperty([property])) {
          matchingStyle[0][property]['value'][key.range] = `${key.value}${baseUnit}`
          return
        }
        matchingStyle[0][property] = {
          'value': {
            [key.range]: `${key.value}${baseUnit}`
          }
        }
      }
    },
    styleIdExists(id) {
      return this.styles.filter(style => style.id === id).length
    },
    getBaseUnit(property,id,key) {
      if (key === 'conversionUnit') return
      
      return this.formRows
        .filter(formRow => formRow.id === id)[0].fields
        .filter(field => field.name === property)[0].baseUnit
    },
    handleConversionOptions(property,value,id) {
      this.handleInputData(property,value,id,'conversionUnit')
    },
    handleFontSizeInput(range,property,value,id) {
      this.handleInputData(property,value,id,{ range: [range], value })
    },
    deleteFormRow(id) {
      this.formRows = this.formRows.filter(formRow => formRow.id !== id)
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
              baseUnit: 'px',
              conversionOptions: ['rem','vw','clamp()'],
              range: true,
              dataType: 'number',
            },
            { 
              name: 'line-height',
              fieldType: 'input',
              placeholder: '24px',
              baseUnit: 'px',
              conversionOptions: ['num','rem'],
              dataType: 'number',
            },
            { 
              name: 'letter-spacing',
              fieldType: 'input',
              placeholder: '1px',
              baseUnit: 'px',
              conversionOptions: ['em','rem'],
              dataType: 'number',
            },
            { 
              name: 'font-weight',
              fieldType: 'input',
              placeholder: '400',
              dataType: 'number',
            },
            { 
              name: 'color',
              fieldType: 'input',
              placeholder: '#ACACAC',
              dataType: 'string',
            },
          ]
        }
      )
    }
  },
  mounted() {
  }

}

</script>