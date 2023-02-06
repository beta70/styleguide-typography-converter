<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

</script>

<template>
    <div>
        <div class="flex gap-16">
            <div class="flex flex-col gap-4">
                <label for="email" class="block text-sm tracking-wider uppercase text-white">{{ this.unit.title }} in {{ this.unit.baseUnit }}</label>
                <input 
                    v-model.number="letterSpacingPx"
                    class="block w-full rounded-md p-6 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                    placeholder="0.75px" 
                />
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <!-- <p class="mt-2 text-sm text-gray-400" id="email-error">Your password must be less than 4 characters.</p> -->
            </div>
            
            <ArrowsRightLeftIcon class="relative w-8 text-white top-4" aria-hidden="true" />
            
            <div class="flex flex-col gap-4">
                <label for="email" class="block text-sm tracking-wider uppercase text-white ">{{ this.unit.title }} in {{ this.unit.convertedUnit }}</label>
                <input 
                    v-model.number="letterSpacingEm"
                    class="block w-full rounded-md p-6 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                    placeholder="0.75px" 
                />
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <!-- <p class="mt-2 text-sm text-gray-400" id="email-error">Your password must be less than 4 characters.</p> -->
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                letterSpacingPx: '',
            }
        },
        props: ['unit'],
        methods: {
        },
        computed: {
            // letterSpacingEm: {
            //     get() {
            //         if (this.letterSpacingPx === '') return ''
            //         if (this.letterSpacingPx === 'not a valid number') return 
            //         if (typeof this.letterSpacingPx !== 'number') return 'not a valid number'
            //         if (this.letterSpacingPx === 0) return 0

            //         return parseFloat(this.letterSpacingPx) / 16
            //     },
            //     set(value) {
            //         if (value === '') return this.letterSpacingPx = ''
            //         if (typeof value !== 'number') return this.letterSpacingPx = 'not a valid number'
            //         if (value === 0) return this.letterSpacingPx = 0

            //         this.letterSpacingPx = parseFloat(value) * 16
            //     }
            // }
        }
    }

</script>