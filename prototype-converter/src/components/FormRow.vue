<script setup>
import CustomInput from './CustomInput.vue';
</script>

<template>
    <div class="flex bg-black/10 p-8 rounded-2xl gap-16">
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
            class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Delete
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