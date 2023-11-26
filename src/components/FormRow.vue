<script setup>

    import CustomInput from './CustomInput.vue';
    import Input from './Input.vue';
    import { useFormRowStore } from '../stores/formRowStore'
    import { ref,onMounted } from 'vue';

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
        <div class="flex items-center col-span-2 gap-4 p-6 border-b-2 border-ttt-lilac lg:p-8">
            <input 
                :id="formRowId" 
                name="base font-size" 
                type="radio" 
                @change="store.setBaseStyle(formRowId)"
                class="w-4 h-4 border-gray-300 text-stone-600 focus:ring-white-600"
            >
            <label 
                :for="formRowId" 
                :class="store.styles.inputLabel"
            >
                base
            </label>
        </div>
        <div class="border-b-2 border-ttt-lilac">
            <div 
                v-for="(field,index) in fields.filter(field => field.range)"
                :key="field"
                class="relative grid grid-cols-2"
            >
                <div 
                    :class="[
                        index === 0 ? 'pt-6 lg:pt-8 pb-4' : index === 2 ? 'pt-4 pb-6 lg:pt-6 lg:pb-12' : 'py-4',
                        'px-6 lg:px-8 border-r-2 col-span-1 border-ttt-lilac'
                    ]"
                >
                    <Input 
                        :field="{
                            name: field.name,
                            label: field.label,
                            placeholder: field.placeholder,
                            range: 'min'
                        }"
                        :formRowId="formRowId"
                    />
                </div>
                <div 
                    :class="[
                        index === 0 ? 'pt-6 lg:pt-8 pb-4' : index === 2 ? 'pt-4 pb-6 lg:pt-6 lg:pb-12' : 'py-4',
                        'px-6 lg:px-8 border-l-2 col-span-1 border-ttt-lilac'
                    ]"
                >
                    <Input 
                        :field="{
                            name: field.name,
                            label: field.label,
                            placeholder: field.placeholder,
                            range: 'max'
                        }"
                        :formRowId="formRowId"
                    />
                </div>
            </div>
        </div>
        <div 
            class="grid w-full gap-8 p-6 pt-8 border-t-2 lg:gap-12 lg:p-8 lg:pt-12 grid-auto-fit border-ttt-lilac"
        >
            <div
                v-for="field in fields.filter(field => !field.range)" 
                :key="field"
            >
                <Input 
                    :formRowId="formRowId" 
                    :field="field"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>

    .grid-auto-fit {
        grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
    }

</style>