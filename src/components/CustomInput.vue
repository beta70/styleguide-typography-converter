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
    <div class="flex flex-col gap-16 h-full">
        <div class="flex flex-col justify-between gap-4 h-full">
            <label class="block text-sm tracking-wider text-white">{{ field.name }}</label>
            <CustomTabs 
                v-if="field.conversionOptions"
                :field="field"
                :formRowId="formRowId"
                @toggle-font-size-range="toggleFontSizeRange"
            />
            <div
                v-if="field.name === 'color'"
                class="w-full h-full"
                :style="{ 'background': inputTextColor }"
            >
            </div>
            <div 
                v-if="field.range"
                class="flex gap-4"
            >
                <div 
                    class="flex flex-col relative"
                    :class="[showFontSizeRange ? 'visible order-1' : 'invisible order-2']"
                    >
                    <input 
                    :placeholder="field.placeholder" 
                    @change="store.handleInputData(field.name,value,formRowId,'min')"
                    v-model="value"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                    class="block absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                    :class="[showFontSizeRange ? 'visible order-2' : 'invisible order-1']"
                    >
                    min 
                </label>
                </div>
                <div 
                    class="flex flex-col relative"
                    :class="[showFontSizeRange ? 'order-2' : 'order-1']"
                >
                    <input 
                    :placeholder="field.placeholder" 
                    @change="store.handleInputData(field.name,value,formRowId,'max')"
                    v-model="value"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                        :class="[showFontSizeRange ? 'visible order-2' : 'invisible order-1']"
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
                class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
            />
        </div>
    </div>
</template>

