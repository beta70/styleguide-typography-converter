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
    <div class="flex flex-col mx-auto max-w-9xl">
        <div class="grid grid-cols-12">
            <div class="flex flex-col col-span-12 gap-2 p-20 xl:col-span-3">
                <h2 class="mb-20 text-3xl font-bold text-white ">Document styles</h2>
            </div>
            <div class="col-span-9 p-20">
                <div class="p-12  rounded-lg shadow-[12px_12px_0px_0px_#C3E88D] bg-black-blue mb-8">
                    <div class="flex justify-start w-full gap-16">
                        <div class="flex flex-col h-full gap-16">
                            <label class="block font-semibold tracking-wider text-white text-md">body font-size</label>
                            <input 
                                :placeholder="'16px'" 
                                @change="store.handleGlobalStyleInput('bodyFontSize',value)"
                                v-model="value"
                                class="block w-full py-3 font-thin bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                        <div class="flex flex-col h-full gap-16">
                            <label class="block font-semibold tracking-wider text-white text-md">max screen-width</label>
                            <input 
                                :placeholder="'1920px'" 
                                @change="store.handleGlobalStyleInput('maxScreenWidth',value)"
                                v-model="value"
                                class="block w-full py-3 font-thin bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="flex flex-col items-start col-span-12 gap-2 p-20 xl:col-span-3">
                <h2 class="mb-20 text-3xl font-bold text-white ">Typographic styles</h2>
                <div
                    v-for="(formRow,index) in store.getSortedFormRows"
                    :key="formRow"
                    v-bind:fields="formRow.fields"
                    v-bind:formRowId="formRow.id"
                    :index="index"
                    @delete-form-row="(id) => $emit('deleteFormRow',id)"
                    class="flex items-center gap-8"
                >
                    <button
                        @click="store.showActiveFormRow(formRow.id)"
                        :class="[
                            'block text-lg tracking-wider',
                            formRow.active ? 'text-white' : 'text-stone-200/50'
                        ]"
                    >
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
                    class="flex items-center justify-between gap-4 px-4 py-2 mt-8 text-lg font-medium text-black transition-all duration-300 rounded-xl bg-light-green"
                >
                    <span>add style</span>
                    <img 
                        src="../assets/images/add.svg" 
                        alt=""
                        class="w-4 h-4"
                    >
                </button>
            </div>
            <div class="flex flex-col col-span-12 gap-12 p-20 xl:col-span-9">
                <div class="p-12  rounded-lg shadow-[12px_12px_0px_0px_#C792EA] bg-black-blue mb-8">
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
            <div class="flex flex-col items-start col-span-12 gap-2 p-20 xl:col-span-3">
                <h2 class="mb-20 text-3xl font-bold text-white ">Generated code</h2>
            </div>
            <div class="col-span-12 gap-12 p-20 xl:col-span-9">
                <div class="flex flex-col gap-8 p-12 rounded-lg shadow-[12px_12px_0px_0px_#F07178] bg-black-blue">
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
                        v-if="store.getGeneratedStyleVariables"
                        :lang="'json'"
                        :code="store.getGeneratedStyleVariables || { 'hallo': 'test' }" 
                        :id="'style-variables'"
                        :heading="'json with stylevariables:'" 
                    />
                </div>
            </div>
        </div>
    </div>


</template>
