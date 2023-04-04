<script setup>

  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
  import { computed,ref } from 'vue'
  import { useFormRowStore } from './stores/formRowStore'

  const store = useFormRowStore()

</script>

<template>
  <div>
      <Form 
        v-bind:form-rows="formRows" 
        :formRowId="store.formRowId" 
        :base-font-size="baseFontSize"
        :max-screen-width="maxScreenWidth"

        />
        <div class="flex justify-around">
          <pre class="text-black">
            <code>
              {{ store.getCSS }}
              {{ store.getFieldData }}
              <!-- {{ store.getStyleData }} -->
            </code>
          </pre>
          <pre class="text-black block whitespace-pre-wrap">
            <code>
              {{ store.getTailwindConfigJs }}
            </code>
          </pre>
        </div>
  </div>
</template>