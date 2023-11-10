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
            class="flex"
        >
            <Tab
                v-for="option in field.conversionOptions" 
                :key="option"
                :value="option" 
                v-slot="{ selected }"
                as="button"
                class="min-w-[5rem] col-span-1"
                @click="handleOptionToggle(option)"
            >
                <div
                    :class="[
                        selected ? 'bg-dark-blue text-white' : 'bg-purple', 
                        'text-xs w-full p-3 transition duration-200'
                    ] "
                >
                    {{ option }}
                </div>
            </Tab>
        </TabList>
    </TabGroup>
</template>


