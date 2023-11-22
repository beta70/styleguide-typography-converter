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
        <!-- <div class="flex items-center gap-12 mb-20">
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
        </div> -->
        <div class="border-b-2 border-ttt-lilac">
            <div 
                v-for="field in fields.filter(field => field.range)"
                :key="field"
                class="relative grid grid-cols-2"
            >
                <div class="col-span-2 p-8 pb-12 border-r-2 lg:col-span-1 border-ttt-lilac">
                    <Input 
                        :field="{
                            name: field.name,
                            placeholder: field.placeholder,
                            range: 'min'
                        }"
                        :formRowId="formRowId"
                    />
                </div>
                <div class="col-span-2 p-8 pb-12 border-l-2 lg:col-span-1 border-ttt-lilac">
                    <Input 
                        :field="{
                            name: field.name,
                            placeholder: field.placeholder,
                            range: 'max'
                        }"
                        :formRowId="formRowId"
                    />
                </div>
            </div>
        </div>


        <div 
            class="grid w-full gap-12 p-8 pt-12 border-t-2 grid-auto-fit border-ttt-lilac"
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