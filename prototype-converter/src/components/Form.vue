<script setup>
import CustomInput from './CustomInput.vue';
</script>

<template>
    <div>
        <div class="flex flex-col bg-black/10 p-20 rounded-2xl gap-16">
            <CustomInput 
                v-for="cssProperty in this.cssProperties" 
                :key="cssProperty"
                v-bind:css-property="cssProperty"
            />
        </div>
    </div>
</template>

<script>

    export default {
    data() {
        return {};
    },
    props: ["cssProperties"],
    methods: {},
    mounted() {
        console.log(this.cssProperties);
    },
    components: { CustomInput }
}

</script>