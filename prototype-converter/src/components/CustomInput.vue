<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import CustomTabs from './CustomTabs.vue';

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
                :style="{ 'background': this.textColor }"
            >
            </div>
            <div 
                v-if="this.field.range"
                class="flex gap-4"
            >
                <div class="flex flex-col relative">
                    <input 
                    :placeholder="this.field.placeholder" 
                    @change="handleFontSizeInput('min',this.field.name,value)"
                    v-model="value"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="block absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                        :class="[this.showFontSizeRange ? 'visible' : 'invisible']"
                    >
                        min 
                    </label>
                </div>
                <div class="flex flex-col relative">
                    <input 
                    :placeholder="this.field.placeholder" 
                    @change="handleFontSizeInput('max',this.field.name,value)"
                    v-model="value"
                    :class="[this.showFontSizeRange ? 'visible' : 'invisible']"
                    class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
                    />
                    <label 
                        class="absolute -bottom-6 text-xs tracking-wider text-white uppercase mt-2"
                        :class="[this.showFontSizeRange ? 'visible' : 'invisible']"
                    >
                        max
                    </label>
                </div>
            </div>
            <input 
                v-if="!this.field.range"
                :placeholder="this.field.placeholder" 
                v-model="value"
                @change="handleInputData(this.field.name,value)"
                class="block w-full py-3 bg-transparent border-white border-b text-gray-200 sm:text-xl font-thin placeholder-gray-200/50 focus:outline-none" 
            />
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                textColor: '',
                showFontSizeRange: false,
            }
        },
        props: ['field'],
        methods: {
            handleInputData(fieldName,value) {
                if (fieldName === 'color') {
                    if (!value) {
                        this.textColor = '#292524'
                        return
                    }
                    value = value.startsWith('#') ? value : `#${value}`
                    this.textColor = value 
                }
                this.$emit('handleInputData',fieldName,value)
            },
            handleFontSizeInput(range,fieldName,value) {
                this.$emit('handleFontSizeInput',range,fieldName,value)
            },
            handleConversionOptions(property,value) {
                this.showFontSizeRange = value === 'clamp()' ? true : false
                this.$emit('handleConversionOptions',property,value)
            },
        },
        computed: {
            textColor() {
                return this.textColor 
            }
        },
        emits: {
            handleFontSizeInput: null,
            handleInputData(property,value) {
                return (value.length > 1)
            },
        },
        mounted() {
        },
        components: { CustomTabs }
    }

</script>