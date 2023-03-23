<script setup>
    import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
</script>

<template>
    <TabGroup>
        <TabList
            :class="[this.field.conversionOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3', 'grid justify-items-start']"
        >
            <Tab
                v-for="option in this.field.conversionOptions" 
                :key="option"
                :value="option" 
                v-slot="{ selected }"
                as="button"
                class="col-span-1 w-full"
                @click="toggleOption(option,$event)"
            >
                <div
                    :class="[selected ? 'bg-white text-stone-800' : 'bg-stone-700 text-white', 'uppercase tracking-wider text-xs w-full p-3 transition duration-200'] "
                >
                    {{ option }}
                </div>
            </Tab>
        </TabList>
    </TabGroup>
</template>

<script>

export default {

    data() {
        return {
            active: '',
        }
    },
    props: ['field'],
    methods: {
        toggleOption(option,event) {
            this.activeOption = option
            this.showFontSizeRange = option === 'clamp()' ? true : false
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


