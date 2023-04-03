<script setup>

    import CustomInput from './CustomInput.vue';
    import { useFormRowStore } from '../stores/formRowStore'
    import { ref } from 'vue';

    const store = useFormRowStore()

    const props = defineProps({
        fields: Object,
        formRowId: Number,
        index: Number,
    })

</script>

<template>
    <div class="flex py-20 gap-16">
        <div 
            class="flex items-center"
        >
            <input 
                :id="formRowId" 
                name="base font-size" 
                type="radio" 
                @change="store.setBaseStyle(formRowId)"
                class="h-4 w-4 border-gray-300 text-stone-600 focus:ring-white-600"
            >
            <label 
                :for="formRowId" 
                class="ml-3 block text-xs tracking-wider text-white uppercase"
            >
                base
            </label>
        </div>
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
        <button 
            @click="store.deleteFormRow(formRowId)"
            type="button" 
            class="material-icons self-center text-rose-700 text-5xl font-medium hover:text-rose-600 transition-all duration-300"
        >
        cancel
        </button>
    </div>
</template>