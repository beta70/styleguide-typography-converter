<script setup>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

</script>

<template>
    <Listbox as="div" v-model="selected">
        <ListboxLabel class="block text-sm tracking-wider text-white">unit converison options</ListboxLabel>
        <div class="relative mt-1">
        <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
            <span class="inline-flex w-full truncate">
            <span class="truncate">{{ activeOption }}</span>
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
        </ListboxButton>

        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption 
                as="template" 
                v-for="option in this.field.conversionOptions" 
                :key="option"
                :value="option" 
                v-slot="{ active, selected }"
                @click="toggleOption(option)"
            >
            
                <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                <div class="flex">
                    <span 
                        :class="[selected ? 'font-semibold' : 'font-normal', 'truncate']"
                    >
                        {{ option }}
                    </span>
                </div>

                <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
                </li>
            </ListboxOption>
            </ListboxOptions>
        </transition>
        </div>
    </Listbox>
</template>

<script>

export default {

    data() {
        return {
            activeOption: '',
        }
    },
    props: ['field'],
    methods: {
        toggleOption(option) {
            this.activeOption = option
            console.log(this.field,option);
            this.$emit('handleConversionOptions',this.field.name,option)
        },
    },
    computed: {
        activeOption() {
            const activeOption = this.field.conversionOptions.filter(option => option === this.activeOption)[0]
            return activeOption ? activeOption : this.field.conversionOptions[0]
        }
    },
    mounted() {
    }
}

</script>

