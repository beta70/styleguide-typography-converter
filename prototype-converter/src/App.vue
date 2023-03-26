<script setup>

  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
  import { computed,ref } from 'vue'
  import { useFormRowStore } from '../store/formRowStore'

  const store = useFormRowStore()



  const baseFontSize = ref('')
  const maxScreenWidth = ref('')
  function handleGlobalInputData(property,inputValue) {
    if (property === 'base font-size') baseFontSize.value = `${inputValue}px`
    if (property === 'max screen-width') maxScreenWidth.value = `${inputValue}px`
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
        :formRowId="store.formRowId" 
        :base-font-size="baseFontSize"
        :max-screen-width="maxScreenWidth"
        @handle-global-input-data="handleGlobalInputData"
        @delete-form-row="store.deleteFormRow()"
        @save-form-data="saveFormData"

        />
        <div class="flex justify-around">
          <pre class="text-black">
            <code>
              {{ store.fieldData }}
              {{ baseFontSize }}
              {{ maxScreenWidth }}
            </code>
          </pre>
          <pre class="text-black">
            <code>
            </code>
          </pre>
        </div>
  </div>
</template>