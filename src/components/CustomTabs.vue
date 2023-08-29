<script setup>
    
    import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
    import { ref } from 'vue'
    import { useFormRowStore } from '../stores/formRowStore'

    const store = useFormRowStore()

    const props = defineProps({
        field: Object,
        formRowId: Number
    })

    const emit = defineEmits(['toggleFontSizeRange'])

    function toggleFontSizeRange(value) {
        emit('toggleFontSizeRange', value === 'clamp()' ? true : false)
    }
    function handleOptionToggle(option,event) {
        if (props.field.name === 'font-size') toggleFontSizeRange(option)
        store.handleInputData(props.field.name,option,props.formRowId,'targetUnit')
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
                @click="handleOptionToggle(option)"
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


