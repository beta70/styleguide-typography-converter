<script setup>

    import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
    import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
    import CustomTabs from './CustomTabs.vue';
    import { ref } from 'vue';

    const props = defineProps({
        field: Object
    })
    const emit = defineEmits({
        handleFontSizeInput: null,
        handleConversionOptions: null,
        handleInputData: (property,value) => {
            return value.length > 1
        },
    })

    const textColor = ref('')
    function handleInputData(fieldName,value) {
        if (fieldName === 'color') {
            if (!value) {
                textColor.value = '#292524'
                return
            }
            value = value.startsWith('#') ? value : `#${value}`
            textColor.value = value 
        }
        emit('handleInputData',fieldName,value)
    }
    
    const showFontSizeRange = ref(false)
    function handleFontSizeInput(range,fieldName,value) {
        emit('handleFontSizeInput',range,fieldName,value)
    }

    function handleConversionOptions(property,value) {
        showFontSizeRange.value = value === 'clamp()' ? true : false
        emit('handleConversionOptions',property,value)
    }

</script>

<template>
    <div class="flex flex-col gap-16 h-full">
        <div class="flex flex-col justify-between gap-4 h-full">
            <label class="block text-sm tracking-wider text-white">{{ field.name }}</label>
            <CustomTabs 
                v-if="field.conversionOptions"
                :field="field"
                @handle-conversion-options="handleConversionOptions" 
            />
            <div
                v-if="field.name === 'color'"
                class="w-full h-full"
                :style="{ 'background': textColor }"
            >
            </div>
            <div 
                v-if="field.range"
                class="flex gap-4"
            >
                <div class="flex flex-col relative">
                    <input 
                    :placeholder="field.placeholder" 
                    @change="handleFontSizeInput('min',field.name,value)"
                    v-model="value"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="block absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                        :class="[showFontSizeRange ? 'visible' : 'invisible']"
                    >
                        min 
                    </label>
                </div>
                <div class="flex flex-col relative">
                    <input 
                    :placeholder="field.placeholder" 
                    @change="handleFontSizeInput('max',field.name,value)"
                    v-model="value"
                    :class="[showFontSizeRange ? 'visible' : 'invisible']"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                        :class="[showFontSizeRange ? 'visible' : 'invisible']"
                    >
                        max
                    </label>
                </div>
            </div>
            <input 
                v-if="!field.range"
                :placeholder="field.placeholder" 
                v-model="value"
                @change="handleInputData(field.name,value)"
                class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
            />
        </div>
    </div>
</template>