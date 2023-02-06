<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import { ArrowsRightLeftIcon } from '@heroicons/vue/20/solid'

</script>

<template>
    <div>
        <div class="flex gap-16">
            <div class="flex flex-col gap-4">
                <label class="block text-sm tracking-wider text-white">{{ cssProperty.name }}</label>
                <input 
                    class="block w-full rounded-md p-6 bg-gray-400/10 border-transparent text-gray-200 sm:text-xl font-thin placeholder-gray-600 focus:border-black focus:outline-transparent focus:ring-purple-900 transition-all duration-300 ease-in-out" 
                    placeholder="16 px" 
                />
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
            }
        },
        props: ['cssProperty'],
        methods: {
        },
        computed: {
        }
    }

</script>