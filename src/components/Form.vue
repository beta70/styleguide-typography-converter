<script setup>
    import { onMounted } from 'vue';
    import FormRow from './FormRow.vue';
    import CustomInput from './CustomInput.vue';
    import CodeOutput from './CodeOutput.vue';
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        bodyFontSize: String,
        maxScreenWidth: String,
        formRowId: Number,
    })

</script>

<template>
    <div class="flex flex-col gap-12 p-20 mx-auto max-w-9xl">
        <div class="grid grid-cols-12">
            <div class="col-span-12">
                <div class="relative p-10 transition-all duration-300 border-8 rounded-lg border-ttt-lilac form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">Document styles</h2>
                    </div>
                    <div class="flex justify-start w-full gap-16">
                        <div class="relative flex flex-col h-full gap-4">
                            <label class="block text-xs font-normal tracking-wider text-ttt-thistle bg-darker-blue">body font-size</label>
                            <input 
                                :placeholder="'16px'" 
                                @change="store.handleGlobalStyleInput('bodyFontSize',value)"
                                v-model="value"
                                class="block w-full p-2 py-3 font-thin text-white bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                        <div class="relative flex flex-col h-full gap-4">
                            <label class="block text-xs font-normal tracking-wider text-ttt-thistle bg-darker-blue">max screen-width</label>
                            <input 
                                :placeholder="'1920px'" 
                                @change="store.handleGlobalStyleInput('maxScreenWidth',value)"
                                v-model="value"
                                class="block w-full p-2 py-3 font-thin text-white bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-12">
            <div class="flex flex-col items-start col-span-12 xl:col-span-3">
                <div class="relative w-full py-10 transition-all duration-300 border-8 rounded-lg border-ttt-violet form__panel">

                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">typographic styles</h2>
                    </div>
                    <div class="relative pl-[4.25rem] pr-10">
                        <div
                            v-for="(formRow,index) in store.getSortedFormRows"
                            :key="formRow"
                            v-bind:fields="formRow.fields"
                            v-bind:formRowId="formRow.id"
                            :index="index"
                            @delete-form-row="(id) => $emit('deleteFormRow',id)"
                            class="flex items-center gap-12 mb-2"
                        >
                            <button
                                @click="store.showActiveFormRow(formRow.id)"
                                :class="[
                                    'text-lg tracking-wider flex gap-2 items-center relative',
                                    formRow.active ? 'text-ttt-perlwinkle' : 'text-ttt-perlwinkle/30'
                                ]"
                            >
                                <div 
                                    v-if="formRow.baseStyle"
                                    class="absolute w-5 -left-8"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" fill="currentColor"/></svg>
                                </div>
                                style {{ formRow.indexTitle }}
                            </button>
                            <button 
                                @click="store.deleteFormRow(formRow.id)"
                                type="button" 
                                class="flex items-center"
                                v-if="formRow.active"
                            >
                                <img 
                                    src="../assets/images/close.svg" 
                                    alt=""
                                    class="w-4"
                                >
                            </button>
                        </div>
                        <div class="absolute left-0 w-full h-2 mx-auto -bottom-7 bg-ttt-violet"></div>
                    </div>
                    <div class="flex items-center pl-[4.25rem]">
                        <button 
                            @click="store.addFormRow()"
                            type="button" 
                            class="flex items-center justify-between gap-4 mt-12 text-lg font-medium underline transition-all duration-300 text-ttt-perlwinkle"
                        >
                            <span>add style</span>
                            <div class="w-4 h-4 text-ttt-perlwinkle">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.1658 7.26351H9.29093V0.388603H6.9993V7.26351H0.12439V9.55515H6.9993V16.4301H9.29093V9.55515H16.1658V7.26351Z"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col col-span-12 gap-12 xl:col-span-9">
                <div class="relative p-10 transition-all duration-300 border-8 rounded-lg border-ttt-violet form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">properties</h2>
                    </div>
                    <FormRow
                        v-for="(formRow,index) in store.formRows"
                        :key="formRow"
                        v-bind:fields="formRow.fields"
                        v-bind:formRowId="formRow.id"
                        :index="index"
                        :title="formRow.title"
                        @delete-form-row="(id) => $emit('deleteFormRow',id)"
                        :class="[formRow.active ? 'block' : 'hidden']"
                    />
                </div>
    
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="col-span-12 gap-12">
                <div class="relative flex flex-col gap-8 p-12 transition-all duration-300 border-8 rounded-lg border-ttt-murrey form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">code output</h2>
                    </div>
                    <CodeOutput 
                        :code="store.getTailwindConfigJs" 
                        :lang="'js'"
                        :id="'tailwind'" 
                        :heading="'tailwind.config.js theme extension:'" 
                        class="mb-8"
                    />
                    <CodeOutput 
                        :code="store.getCSS" 
                        :lang="'js'"
                        :id="'css'" 
                        :heading="'tailwind.config.js prose styles:'" 
                        class="mb-8"
                    />
                    <CodeOutput 
                        :lang="'json'"
                        :code="store.getGeneratedStyleVariables" 
                        :id="'style-variables'"
                        :heading="'json with stylevariables:'" 
                    />
                </div>
            </div>
        </div>
    </div>


</template>
