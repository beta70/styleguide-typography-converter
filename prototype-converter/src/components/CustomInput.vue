<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'
import CustomSelect from './CustomSelect.vue';

</script>

<template>
    <div>
        <div class="flex gap-16">
            <div class="flex flex-col gap-4">
                <label class="block text-sm tracking-wider text-white">{{ field.name }}</label>
                <div v-if="this.field.range">
                    <label class="block text-sm tracking-wider text-white">min</label>
                    <input 
                    :placeholder="this.field.placeholder" 
                    @change="$emit('handleFontSizeInput','min',this.field.name,value.replace(/\D/g,''))"
                    v-model="value"
                    class="block w-full rounded-md p-3 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                    />
                    <label class="block text-sm tracking-wider text-white">max</label>
                    <input 
                    :placeholder="this.field.placeholder" 
                    @change="$emit('handleFontSizeInput','max',this.field.name,value.replace(/\D/g,''))"
                    v-model="value"
                    class="block w-full rounded-md p-3 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                    />
                </div>
                <input 
                    v-if="!this.field.range"
                    :placeholder="this.field.placeholder" 
                    v-model="value"
                    @change="handleInputData(this.field.name,value)"
                    class="block w-full rounded-md p-3 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                />
            </div>
            <CustomSelect 
                v-if="field.conversionOptions"
                :field="field"
                @handle-conversion-options="(property,value) => $emit('handleConversionOptions',property,value)" 
            />
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
            }
        },
        props: ['field'],
        methods: {
            handleInputData(fieldName,value) {
                value = this.field.dataType === 'string' ? value : value.replace(/\D/g,'')
                this.$emit('handleInputData',fieldName,value)
            },
        },
        computed: {
        },
        emits: {
            handleFontSizeInput: null,
            handleInputData(property,value) {
                return (value.length > 1)
            },
        },
        mounted() {
        },
        components: { CustomSelect }
    }

</script>