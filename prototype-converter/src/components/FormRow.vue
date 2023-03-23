<script setup>
import CustomInput from './CustomInput.vue';
</script>

<template>
    <div class="flex py-20 gap-16">
        <div
            v-for="field in this.fields" 
            :key="field"
        >
            <CustomInput 
                v-if="field.fieldType === 'input'"
                :field="field"
                @handle-input-data="(property,value) => $emit('handleInputData',property,value,this.formRowId)" 
                @handle-font-size-input="(range,property,value) => $emit('handleFontSizeInput',range,property,value,this.formRowId)" 
                @handle-conversion-options="(property,value) => $emit('handleConversionOptions',property,value,this.formRowId)" 
            />
        </div>
        <button 
            @click="$emit('deleteFormRow',this.formRowId)"
            type="button" 
            class="material-icons self-center text-rose-700 text-5xl font-medium hover:text-rose-600 transition-all duration-300"
        >
        cancel
        </button>
    </div>
</template>

<script>

export default {
    data() {
        return {};
    },
    props: {
        fields: Object,
        formRowId: Number,
    },
    methods: {
        addFormRow() {
            
        }
    },
    emits: ['deleteFormRow','handleFontSizeInput'],
    mounted() {
    },
    components: { CustomInput }
}

</script>