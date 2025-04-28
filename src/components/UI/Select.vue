<template>
  <FormField
      v-slot="$field"
      class="w-full flex flex-col gap-2"
      :name="name"
      :initialValue
  >
        <label :for="name">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
      <Select
        v-model="selected"
        :name
        :optionLabel
        :optionValue
        :options
        :invalid="!!$field.error"
        :placeholder
      >
        <template #value="slotProps">
          <div
            v-if="slotProps.value"
            class="flex items-center text-black"
          >
            <span>{{ slotProps.value }}</span>
          </div>
          <span v-else>
              {{ slotProps.placeholder }}
          </span>
        </template>
      </Select>
        <small
            v-if="$field.error"
            :id="`${name}-help`"
            class="text-red-500 mb-2"
        >
            {{ $field.error.message }}
        </small>
  </FormField>
</template>

<script setup lang="ts">
import Select from 'primevue/select';

import { FormField } from '@primevue/forms';
import { onMounted, ref, watch } from 'vue';
const { name, options, optionLabel, optionValue, initialValue } = defineProps({
  placeholder: {
      type: String,
      default: 'Selectionnez une valeur',
  },
  options: {
      type: Array,
      required: true,
  },
    name: {
        type: String,
        required: true,
    },
    initialValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    },
    maxSelectedLabels: {
        type: Number,
        default: 1,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    optionLabel: {
        type: String,
        default: 'label',
    },
    optionValue: {
        type: String,
        default: 'value',
    },
})

const selected = defineModel()

</script>

