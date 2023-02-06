<script setup>
  import Form from './components/Form.vue'
  import Tabs from './components/Tabs.vue'
</script>

<template>
  <div>
    <div>
      <!-- <Tabs/> -->
      <Form 
        v-bind:css-properties="cssProperties" 
      />
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      cssProperties: [
        { 
          name: 'font-size',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'font-weight',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'color',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'line-height',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'letter-spacing',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'text-decoration',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
        { 
          name: 'text-shadow',
          placeholder: '',
          baseUnit: 'px',
          convertedUnit: 'em'
        },
      ]
    }
  },
  components: {
    Form,
    Tabs
  }

}

</script>