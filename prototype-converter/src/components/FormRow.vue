<script setup>

    import CustomInput from './CustomInput.vue';
    import { useFormRowStore } from '../../store/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        fields: Object,
        formRowId: Number
    })

</script>

<template>
    <div class="flex py-20 gap-16">
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