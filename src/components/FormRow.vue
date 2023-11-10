<script setup>

    import CustomInput from './CustomInput.vue';
    import { useFormRowStore } from '../stores/formRowStore'
    import { ref } from 'vue';

    const store = useFormRowStore()

    const props = defineProps({
        fields: Object,
        formRowId: Number,
        index: Number,
        title: String,
    })

</script>

<template>
    <div class="flex flex-col w-full">
        <div class="flex items-center gap-12 mb-20">
            <div class="flex items-center gap-4 mt-2">
                <input 
                    :id="formRowId" 
                    name="base font-size" 
                    type="radio" 
                    @change="store.setBaseStyle(formRowId)"
                    class="w-6 h-6 border-gray-300 focus:ring-white-600 bg-darker-blue"
                >
                <label 
                    :for="formRowId" 
                    class="block font-semibold tracking-wider text-white text-md"
                >
                    main text font-size 
                </label>
            </div>
        </div>
        <div class="grid w-full gap-x-12 gap-y-20 grid-auto-fit">
            <div
                v-for="field in fields" 
                :key="field"
            >
                <CustomInput 
                    v-if="field.fieldType === 'input'"
                    :formRowId="formRowId" 
                    :field="field"
                />
            </div>
        </div>
        </div>
</template>

