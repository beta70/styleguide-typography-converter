<script setup>

    import CustomInput from './CustomInput.vue';

    const props = defineProps({
        fields: Object,
        formRowId: Number
    })
    const emit = defineEmits(['deleteFormRow','handleFontSizeInput'])

</script>

<template>
    <div class="flex py-20 gap-16">
        <div
            v-for="field in fields" 
            :key="field"
        >
            <CustomInput 
                v-if="field.fieldType === 'input'"
                :field="field"
                @handle-input-data="(property,value) => $emit('handleInputData',property,value,formRowId)" 
                @handle-font-size-input="(range,property,value) => $emit('handleFontSizeInput',range,property,value,formRowId)" 
                @handle-conversion-options="(property,value) => $emit('handleConversionOptions',property,value,formRowId)" 
            />
        </div>
        <button 
            @click="$emit('deleteFormRow',formRowId)"
            type="button" 
            class="material-icons self-center text-rose-700 text-5xl font-medium hover:text-rose-600 transition-all duration-300"
        >
        cancel
        </button>
    </div>
</template>