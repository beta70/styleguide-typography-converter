<script setup>

  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
  import { computed,ref,onMounted } from 'vue'
  import { useFormRowStore } from './stores/formRowStore'

  const store = useFormRowStore()

</script>

<template>
  <div class="bg-darker-blue font-martian">
      <Form 
        v-bind:form-rows="formRows" 
        :formRowId="store.formRowId" 
        :base-font-size="baseFontSize"
        :max-screen-width="maxScreenWidth"

        />
        
  </div>
</template>

<style>

    .grid-auto-fit {
        grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
    }

</style>