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
        <div class="flex flex-col justify-between h-full gap-3 between">
            <label class="block font-semibold tracking-wider text-white text-md">{{ field.name }}</label>
            <CustomTabs 
                v-if="field.conversionOptions"
                :field="field"
                :formRowId="formRowId"
                @toggle-font-size-range="toggleFontSizeRange"
            />
            <div
                v-if="field.name === 'color'"
                class="w-full h-10"
                :style="{ 'background': inputTextColor }"
            >
            </div>
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
                        class="block w-full py-3 font-thin text-white bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="absolute block mt-2 text-xs tracking-wider text-white uppercase -bottom-6"
                        :class="[showFontSizeRange ? 'visible order-2' : 'invisible order-1']"
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
                        class="block w-full py-3 font-thin text-gray-200 bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="absolute mt-2 text-xs tracking-wider text-white uppercase -bottom-6"
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
                class="block w-full py-3 font-thin text-gray-200 bg-transparent border-b border-white sm:text-xl placeholder-gray-200/50 focus:outline-none" 
            />
        </div>
    </div>
</template>

