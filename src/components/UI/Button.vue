<template>
    <Button
        :class="[{'w-full py-3': fuild }]"
        :label
        :loading
        :disabled="disabled || (loading && fuild)"
        :type
        :rounded
        :severity
        @click="onClick"
    />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import type { PropType } from 'vue';


const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    fuild: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String as PropType<'button' | "submit" | "reset">,
        default: 'button',
    },
    severity: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['click'])


function onClick (event: any) {
    if (!props.disabled && !props.loading) {
        emit("click", event);
    }
}

</script>
