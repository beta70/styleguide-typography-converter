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
    <div class="flex flex-col gap-20 p-20 mx-auto max-w-9xl">
        <div class="grid grid-cols-12">
            <div class="col-span-12">
                <div class="relative p-12 transition-all duration-300 border rounded-lg border-papaya form__panel">
                    <div class="absolute top-0 z-10 px-2 -translate-y-1/2 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold text-white lowercase">Document styles</h2>
                    </div>
                    <div class="flex justify-start w-full gap-16">
                        <div class="flex flex-col h-full gap-16">
                            <label class="block font-semibold tracking-wider text-white text-md">body font-size</label>
                            <input 
                                :placeholder="'16px'" 
                                @change="store.handleGlobalStyleInput('bodyFontSize',value)"
                                v-model="value"
                                class="block w-full py-3 font-thin text-white bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                        <div class="flex flex-col h-full gap-16">
                            <label class="block font-semibold tracking-wider text-white text-md">max screen-width</label>
                            <input 
                                :placeholder="'1920px'" 
                                @change="store.handleGlobalStyleInput('maxScreenWidth',value)"
                                v-model="value"
                                class="block w-full py-3 font-thin text-white bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="flex flex-col items-start col-span-12 gap-20 xl:col-span-3">
                <div class="relative w-full p-12 transition-all duration-300 border rounded-lg border-purple form__panel">

                    <div class="absolute top-0 z-10 px-2 -translate-y-1/2 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold text-white lowercase">typographic styles</h2>
                    </div>
                    <div
                        v-for="(formRow,index) in store.getSortedFormRows"
                        :key="formRow"
                        v-bind:fields="formRow.fields"
                        v-bind:formRowId="formRow.id"
                        :index="index"
                        @delete-form-row="(id) => $emit('deleteFormRow',id)"
                        class="flex items-center gap-12"
                    >
                        <button
                            @click="store.showActiveFormRow(formRow.id)"
                            :class="[
                                'text-lg tracking-wider flex gap-2 items-center relative',
                                formRow.active ? 'text-white' : 'text-stone-200/50'
                            ]"
                        >
                            <div 
                                v-if="formRow.baseStyle"
                                :class="[formRow.active ? 'text-white' : 'text-stone-200/50', 'w-5 absolute -left-8']"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" fill="currentColor"/></svg>
                            </div>
                            Style {{ formRow.indexTitle }}
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
                    <button 
                        @click="store.addFormRow()"
                        type="button" 
                        class="flex items-center justify-between gap-4 px-4 py-2 mt-8 text-lg font-medium text-black transition-all duration-300 bg-light-green"
                    >
                        <span>add style</span>
                        <img 
                            src="../assets/images/add.svg" 
                            alt=""
                            class="w-4 h-4"
                        >
                    </button>
                </div>
            </div>
            <div class="flex flex-col col-span-12 gap-12 xl:col-span-9">
                <div class="relative p-12 transition-all duration-300 border rounded-lg border-purple form__panel">
                    <div class="absolute top-0 z-10 px-2 -translate-y-1/2 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold text-white lowercase">properties</h2>
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
                <div class="relative flex flex-col gap-8 p-12 transition-all duration-300 border rounded-lg border-pink form__panel">
                    <div class="absolute top-0 z-10 px-2 -translate-y-1/2 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold text-white lowercase">code output</h2>
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
