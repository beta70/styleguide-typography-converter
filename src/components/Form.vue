<script setup>
    import { onMounted } from 'vue';
    import FormRow from './FormRow.vue';
    import CustomInput from './CustomInput.vue';
    import Input from './Input.vue';
    import GlobalInput from './GlobalInput.vue';
    import CodeOutput from './CodeOutput.vue';
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        bodyFontSize: String,
        minScreenWidth: String,
        maxScreenWidth: String,
        formRowId: Number,
    })

</script>

<template>
    <div class="flex flex-col gap-12 p-6 mx-auto sm:p-8 lg:p-20 max-w-9xl">
        <div class="grid grid-cols-12 gap-4 lg:gap-12">
            <div class="col-span-12">
                <div class="relative grid grid-cols-2 transition-all duration-300 border-8 rounded-lg border-ttt-lilac form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">Document styles</h2>
                    </div>

                    <div class="col-span-1 p-6 border-r-2 lg:p-8 border-ttt-lilac">
                        <GlobalInput 
                            :field="{
                                name: 'minScreenWidth',
                                label: 'min screen width',
                                placeholder: '320px',
                            }"
                        />
                        </div>
                        <div class="col-span-1 p-6 border-l-2 lg:p-8 border-ttt-lilac">

                        <GlobalInput 
                            :field="{
                                name: 'maxScreenWidth',
                                label: 'max screen width',
                                placeholder: '1920px',
                            }"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-4 lg:gap-12">
            <div class="flex flex-col col-span-12 gap-12">
                <div class="relative grid grid-cols-2 gap-2 transition-all duration-300 border-8 rounded-lg border-ttt-violet form__panel">
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
                        :class="[
                            formRow.active ? 'block' : 'hidden',
                            'col-span-2'
                        ]"
                    />
                </div>
            </div>
            <div class="flex flex-col items-start col-span-12">
                <div class="relative flex flex-col w-full transition-all duration-300 border-8 rounded-lg border-ttt-violet form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">style preview</h2>
                    </div>
                    <div class="border-b-2 border-ttt-violet">
                        <div class="flex flex-col gap-4 p-6 lg:p-8">
                            <div
                                v-for="(formRow,index) in store.getSortedFormRows"
                                :key="formRow"
                                :formRowId="formRow.id"
                                :index="index"
                                @delete-form-row="(id) => $emit('deleteFormRow',id)"
                                class="flex items-center gap-12"
                            >
                                <button
                                    @click="store.showActiveFormRow(formRow.id)"
                                    :class="[
                                        'flex gap-2 items-center shrink-0 text-md font-bold tracking-widest text-ttt-perlwinkle bg-darker-blue',
                                        formRow.active ? 'text-ttt-perlwinkle' : 'text-ttt-perlwinkle/30'
                                    ]"
                                >
                                    <div 
                                        v-if="formRow.baseStyle"
                                        class="w-5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" fill="currentColor"/></svg>
                                    </div>
                                    <span 
                                        class="line-clamp-1 shrink-0"
                                        :style="Object.entries(formRow.inlineStyle).map(inlineStyle => inlineStyle.join(':')).join(';')"
                                    >
                                        style {{ formRow.indexTitle }}
                                    </span>
                                </button>
                                <button 
                                    @click="
                                        store.deleteFormRow(formRow.id),
                                        store.showActiveFormRow(store.getSortedFormRows[store.getSortedFormRows.length - 1].id)
                                    "
                                    type="button" 
                                    class="flex items-center shrink-0"
                                    v-if="formRow.active && store.getSortedFormRows.length > 1"
                                >
                                    <img 
                                        src="../assets/images/close.svg" 
                                        alt=""
                                        class="w-4"
                                    >
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t-2 lg:p-8 border-ttt-violet">
                        <div class="flex items-center">
                            <button 
                                @click="store.addFormRow()"
                                type="button" 
                                class="flex items-center justify-between gap-4 text-lg font-medium underline transition-all duration-300 text-ttt-perlwinkle"
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
            </div>
        </div>
        <div class="grid grid-cols-12">
            <div class="col-span-12 gap-4 lg:gap-12">
                <div class="relative flex flex-col gap-8 p-6 transition-all duration-300 border-8 rounded-lg lg:p-12 border-ttt-murrey form__panel">
                    <div class="absolute z-10 px-2 -translate-y-1/2 -top-1 left-8 bg-darker-blue">
                        <h2 class="text-lg font-bold lowercase text-papaya">code output</h2>
                    </div>
                    <!-- <CodeOutput 
                        :code="store.formRows" 
                        :lang="'js'"
                        :id="'testing'"
                        :heading="'tailwind.config.js theme extension:'" 
                        class="mb-8"
                    /> -->
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
