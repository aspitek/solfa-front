<script setup lang="ts">
import Button from 'primevue/button';


const props = defineProps({
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
  block: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})

const emit = defineEmits(['click'])


function onClick (event: any) {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
}

</script>

<template>
  <Button
    v-slot="slotProps"
    label="Small"
    :loading="loading"
    :disabled="disabled || (loading && block)"
    :type="type"
    @click="onClick"
    :class="[{'w-full': block}]"
  >
    <slot v-bind="slotProps" />
  </Button>
</template>
