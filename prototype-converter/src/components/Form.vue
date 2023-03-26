<script setup>

    import FormRow from './FormRow.vue';
    import CustomInput from './CustomInput.vue';
    import { useFormRowStore } from '../../store/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        baseFontSize: String,
        maxScreenWidth: String,
        formRowId: Number,
    })
    const emit = defineEmits({
        handleGlobalInputData: (property,inputValue) => {
            return (inputValue.length > 1)
        }
    })

</script>

<template>
    <form class="">
        <div class="flex flex-col items-center bg-stone-800 p-8 rounded-b-2xl">
            <div class="flex justify-start w-full pb-20 gap-16 border-b border-stone-500">
                <div>
                    <CustomInput 
                        v-bind:field="{ name: 'base font-size', placeholder: '16px' }"
                        @handle-input-data="(property,value) => $emit('handleGlobalInputData',property,value.replace(/\D/g,''))" 
                    />
                </div>
                <div>
                    <CustomInput 
                        v-bind:field="{ name: 'max screen-width', placeholder: '1920px' }"
                        @handle-input-data="(property,value) => $emit('handleGlobalInputData',property,value.replace(/\D/g,''))" 
                    />
                </div>
            </div>
            <FormRow
                v-for="(formRow,index) in store.formRows"
                :key="formRow"
                v-bind:fields="formRow.fields"
                v-bind:formRowId="formRow.id"
                @delete-form-row="(id) => $emit('deleteFormRow',id)"
                :class="[index !== 0 ? 'border-t border-stone-500' : '']"
            />
            <div class="flex gap-4 mt-12">
                <button 
                    @click="store.addFormRow()"
                    type="button" 
                    class="material-icons self-center text-white text-5xl font-medium hover:text-stone-200 transition-all duration-300"
                >
                    add_circle
                </button>
                <button 
                    @click="$emit('saveFormData')"
                    type="button" 
                    class="material-icons self-center text-green-700 text-5xl font-medium hover:text-green-600 transition-all duration-300"
                >
                    check_circle
                </button>
            </div>
        </div>
    </form>
</template>
