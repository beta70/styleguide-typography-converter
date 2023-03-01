<script setup>
import FormRow from './FormRow.vue';
import CustomInput from './CustomInput.vue';
</script>

<template>
    <form class="p-8">
        <div class="flex flex-col items-center bg-black/10 p-8 rounded-2xl gap-16">
            <!-- <div>
                <CustomInput 
                    v-bind:css-property="{ name: 'base font-size', placeholder: '16px' }"
                    @handle-input-data="(property,value) => $emit('handleGlobalInputData',property,value.replace(/\D/g,''))" 
                />
            </div>
            <div>
                <CustomInput 
                    v-bind:css-property="{ name: 'max screen-width', placeholder: '1920px' }"
                    @handle-input-data="(property,value) => $emit('handleGlobalInputData',property,value.replace(/\D/g,''))" 
                />
            </div> -->
            <FormRow
                v-for="formRow in this.formRows"
                :key="formRow"
                v-bind:fields="formRow.fields"
                v-bind:form-row-id="formRow.id"
                @delete-form-row="(id) => $emit('deleteFormRow',id)"
                @handle-input-data="(property,value,id) => $emit('handleInputData',property,value,id)"
                @handle-conversion-options="(property,value,id) => $emit('handleConversionOptions',property,value,id)" 
                @handle-font-size-input="(range,property,value,id) => $emit('handleFontSizeInput',range,property,value,id)" 
                class="flex flex-wrap"
            />
            <button 
                @click="$emit('addFormRow')"
                type="button" 
                class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            <button 
                @click="$emit('saveFormData')"
                type="button" 
                class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Generate styles
            </button>
        </div>
    </form>
</template>

<script>

    export default {
    data() {
        return {
        };
    },
    props: {
        baseFontSize: '',
        maxScreenWidth: '',
        formRows: Object,
    },
    methods: {
    },
    emits: {
        addFormRow: null,
        deleteFormRow: null,
        handleInputData: null, 
        handleFontSizeInput: null, 
        handleGlobalInputData(property,inputValue) {
            return (inputValue.length > 1)
        }
    },
    mounted() {
    },
    components: { FormRow }
}

</script>