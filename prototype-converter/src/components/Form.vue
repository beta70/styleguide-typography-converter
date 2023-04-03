<script setup>

    import FormRow from './FormRow.vue';
    import CustomInput from './CustomInput.vue';
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        bodyFontSize: String,
        maxScreenWidth: String,
        formRowId: Number,
    })

</script>

<template>
    <form class="">
        <div class="flex flex-col items-center bg-stone-800 p-8 rounded-b-2xl">
            <div class="flex justify-start w-full pb-20 gap-16 border-b border-stone-500">
                <div class="flex flex-col gap-16 h-full">
                    <label class="block text-sm tracking-wider text-white">body font-size</label>
                    <input 
                        :placeholder="'16px'" 
                        @change="store.handleGlobalStyleInput('bodyFontSize',value)"
                        v-model="value"
                        class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                </div>
                <div class="flex flex-col gap-16 h-full">
                    <label class="block text-sm tracking-wider text-white">max screen-width</label>
                    <input 
                        :placeholder="'1920px'" 
                        @change="store.handleGlobalStyleInput('maxScreenWidth',value)"
                        v-model="value"
                        class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                </div>
            </div>
            <div class="flex">
                <fieldset class="flex flex-col justify-center">
                    <div class="flex-col">
                            <FormRow
                                v-for="(formRow,index) in store.formRows"
                                :key="formRow"
                                v-bind:fields="formRow.fields"
                                v-bind:formRowId="formRow.id"
                                :index="index"
                                @delete-form-row="(id) => $emit('deleteFormRow',id)"
                                :class="[index !== 0 ? 'border-t border-stone-500' : '']"
                            />
                            <div class="flex justify-center gap-4 mt-12">
                                <button 
                                    @click="store.addFormRow()"
                                    type="button" 
                                    class="material-icons self-center text-white text-5xl font-medium hover:text-stone-200 transition-all duration-300"
                                >
                                    add_circle
                                </button>
                                <button 
                                    @click="store.convertStyleData()"
                                    type="button" 
                                    class="material-icons self-center text-green-700 text-5xl font-medium hover:text-green-600 transition-all duration-300"
                                >
                                    check_circle
                                </button>
                            </div>
        
                        </div>
                </fieldset>
            </div>
        </div>
    </form>
</template>
