<script setup>

    import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
    import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
    import CustomTabs from './CustomTabs.vue';
    import { ref } from 'vue';
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        field: Object,
        formRowId: Number
    })

    const inputTextColor = ref('')
    function setTextColor(property,color) {
        if (property !== 'color') return
        inputTextColor.value = color.startsWith('#') ? color : `#${color}`
    }

    const showFontSizeRange = ref(false)
    function toggleFontSizeRange(value) {
        showFontSizeRange.value = value
    }

</script>

<template>
    <div class="flex flex-col h-full gap-16">
        <div :class="[
            field.name === 'color' ? 'gap-8' : 'flex-col',
            'relative flex'
        ]">
            <div class="flex flex-col h-full gap-4">
                <label class="block text-xs font-bold tracking-widest text-ttt-perlwinkle bg-darker-blue">{{ field.name }}</label>
                <div 
                    v-if="field.range"
                    class="flex gap-4"
                >
                    <div 
                        class="relative flex flex-col"
                        :class="[showFontSizeRange ? 'block order-1' : 'hidden order-2']"
                    >
                        <input 
                            :placeholder="field.placeholder" 
                            @change="store.handleInputData(field.name,value,formRowId,'min')"
                            v-model="value"
                            class="block w-full p-2 py-3 font-thin text-white bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-white/30 focus:outline-none" 
                        />
                        <label 
                            :class="[
                                showFontSizeRange ? 'visible order-2' : 'invisible order-1',
                                'absolute bottom-0 right-2 z-10 block py-1 px-2 text-xs font-bold tracking-wide text-ttt-perlwinkle translate-y-1/2 bg-darker-blue'
                            ]"
                        >
                            min 
                        </label>
                    </div>
                    <div 
                        class="relative flex flex-col"
                        :class="[showFontSizeRange ? 'order-2' : 'order-1']"
                    >
                        <input 
                            :placeholder="field.placeholder" 
                            @change="store.handleInputData(field.name,value,formRowId,'max')"
                            v-model="value"
                            class="block w-full px-2 py-3 font-normal text-gray-200 bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-white/30 focus:outline-none" 
                        />
                        <label 
                            :class="[
                                showFontSizeRange ? 'visible order-2' : 'invisible order-1',
                                'absolute bottom-0 right-2 z-10 block py-1 px-2 text-xs font-normal tracking-wide text-ttt-perlwinkle translate-y-1/2 bg-darker-blue'
                            ]"
                        >
                            max
                        </label>
                    </div>
                </div>
                <input 
                    v-if="!field.range"
                    :placeholder="field.placeholder" 
                    v-model="value"
                    @change="store.handleInputData(field.name,value,formRowId); setTextColor(field.name,value)"
                    class="block w-full p-2 py-3 font-bold text-gray-200 bg-transparent border border-ttt-perlwinkle sm:text-xl placeholder-white/30 focus:outline-none" 
                />
                <CustomTabs 
                    v-if="field.conversionOptions"
                    :field="field"
                    :formRowId="formRowId"
                    @toggle-font-size-range="toggleFontSizeRange"
                    class="mt-4"
                />

            </div>
            <div
                v-if="field.name === 'color'" 
                class="flex flex-col w-full gap-4"
            >
                <label class="block text-xs font-normal tracking-wide text-ttt-perlwinkle bg-darker-blue">
                    preview
                </label>
                <div
                    v-if="field.name === 'color'"
                    class="border border-dashed h-14 aspect-square border-ttt-perlwinkle"
                    :style="{ 'background': inputTextColor }"
                >
                </div>
            </div>
        </div>
    </div>
</template>

