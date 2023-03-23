<script setup>
    
    import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
    import { ref } from 'vue'

    const props = defineProps({
        field: Object
    })
    const emit = defineEmits(['handleConversionOptions'])

    const active = ref('')
    function toggleOption(option,event) {
        emit('handleConversionOptions',props.field.name,option)
    }

</script>

<template>
    <TabGroup>
        <TabList
            :class="[field.conversionOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3', 'grid justify-items-start']"
        >
            <Tab
                v-for="option in field.conversionOptions" 
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


