
<script setup>
    import { nextTick, onMounted, ref, watchEffect, watch, watchPostEffect } from 'vue'
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()
    const props = defineProps(['code','id','heading', 'lang'])
    const codeOutput = ref('')
    const codeCopied = ref(false)

    watchEffect(async () => {
        if (props.code) {
            try {
                const highlighter = await shiki.getHighlighter({
                    theme: 'material-theme-palenight',
                    langs: ['json', 'js'],
                });
    
                const jsonString = JSON.stringify(props.code, null, 2);
    
                codeOutput.value = highlighter.codeToHtml(jsonString, { lang: props.lang });
                document.getElementById(props.id).innerHTML = codeOutput.value;
                await nextTick()
            } catch (error) {
                console.error(error);
            }
        }
    });

</script>

<template>
    <div>
        <h3 class="block mb-6 text-xs font-normal tracking-wide text-ttt-perlwinkle bg-darker-blue">{{ props.heading }}</h3>
        <button 
            class="relative w-full bg-black shadow-lg shadow-black group"
            @click="
                store.copyCode(props.code),
                codeCopied = true
            "
            @mouseleave="codeCopied = false"
        >
            <div 
                :id="props.id"
                class="flex justify-around w-full p-8 text-left cursor-pointer group"
            >
            </div>
            <div class="absolute flex items-center gap-4 top-4 lg:top-8 right-4 lg:right-8 text-gray-200/50">
                <span class="block tracking-wider text-md">{{ props.lang }}</span>
                <div
                    v-if="!codeCopied"
                    class="w-6 h-6 transition-all duration-200"
                >
                    <svg viewBox="0 0 76 88" xmlns="http://www.w3.org/2000/svg">
                        <path d="M56 0H8C3.6 0 0 3.6 0 8V64H8V8H56V0ZM68 16H24C19.6 16 16 19.6 16 24V80C16 84.4 19.6 88 24 88H68C72.4 88 76 84.4 76 80V24C76 19.6 72.4 16 68 16ZM68 80H24V24H68V80Z" fill="currentColor"/>
                    </svg>
                </div>
                <div
                    v-if="codeCopied"
                    class="w-6 h-6 transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </button>
    </div>
</template>


<style>

.shiki {
    width: 100%;
    background-color: transparent!important;
    overflow-x: scroll;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>