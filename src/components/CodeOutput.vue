
<script setup>
    import { nextTick, onMounted, ref, watchEffect, watch, watchPostEffect } from 'vue'
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()
    const props = defineProps(['code','id','heading', 'lang'])
    const codeOutput = ref('')

    watchPostEffect(async () => {
        if (props.code) {
            try {
                const highlighter = await shiki.getHighlighter({
                    theme: 'material-theme-palenight',
                    langs: ['json', 'js'],
                });
    
                const jsonString = JSON.stringify(props.code, null, 2);
    
                codeOutput.value = highlighter.codeToHtml(jsonString, { lang: props.lang });
                document.getElementById(props.id).innerHTML = codeOutput.value;
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
            @click="store.copyCode(props.code)"
        >
        <div 
            :id="props.id"
            class="flex justify-around w-full m-4 text-left cursor-pointer group"
        >
        </div>
        <div class="absolute flex items-center gap-4 top-8 right-8 group-hover:opacity-100">
            <span class="block tracking-wider text-gray-200/50 text-md">{{ props.lang }}</span>
            <img 
                src="../assets/images/copy.svg" 
                alt=""
                class="w-6 h-6 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
        </div>
        </button>
    </div>
</template>


<style>

.shiki {
    padding: 2rem;
    width: 100%;
    background-color: transparent!important;
}

</style>