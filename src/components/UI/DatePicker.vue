<template>
  <div class="w-full flex flex-col gap-2">
    <div class="w-full flex justify-between">
      <label :for="name">
        <slot name="label">
          {{ label }}
        </slot>
      </label>

      <slot name="guide" />
    </div>
    <VueDatePicker
      v-model="value"
      class="w-full"
      :id="id"
      :disabled="disabled"
      :aria-describedby="`${name}-help`"
    />
    <small v-if="errors.length" :id="`${name}-help`" class="text-red-500">
      {{ errors[0] }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import VueDatePicker from '@vuepic/vue-datepicker'
import { computed } from 'vue'
import { SERVER_DATETIME_FORMAT } from '~/constants'
import { formatDate } from '~/utils'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const value = defineModel(/*{
  set(v: Date) {
    return dateFormat(v)
  },
  get(v: Date) {
    return dateFormat(v)
  },
}*/)

function dateFormat(date: Date) {
  return formatDate(date, props.format)
}
const errors = computed(() => usePage().props.errors?.[props.name] ?? [])
</script>
