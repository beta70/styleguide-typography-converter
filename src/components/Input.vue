<script setup>
    import { ref } from 'vue';
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        field: Object,
        formRowId: Number
    })
</script>

<template>
    <div class="flex flex-col h-full gap-16">
        <div class="flex flex-col h-full gap-4">
            <label class="block text-xs font-bold tracking-widest text-ttt-perlwinkle bg-darker-blue">{{ field.label }}</label>
            <input 
                :placeholder="field.placeholder" 
                v-model="value"
                @change="store.handleInputData(field.name,value,formRowId,field.range)"
                class="block w-full max-w-xs p-2 py-3 font-bold text-gray-200 bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-white/30 focus:outline-none" 
            />
        </div>
    </div>
</template>

