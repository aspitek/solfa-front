
<template>
    <FormField
        v-slot="$field"
        class="w-full flex flex-col gap-2"
        :name="name"
        initialValue=""
    >
        <label v-if="label" :for="name">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <InputGroup>
            <slot name="left" />
            <InputText
                v-model="value"
                class="w-full"
                :class="inputClass"
                :id="id"
                :disabled="disabled"
                :invalid="!!$field.error"
                :name="name"
                :aria-describedby="`${name}-help`"
                :placeholder="placeholder"
            />
            <slot name="right" />
        </InputGroup>
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
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import { FormField } from '@primevue/forms';
import type { PropType } from 'vue';


const { name } = defineProps({
    type: {
        type: String as PropType<'text'|'password'|'number'|'email'>,
        default: 'text',
    },
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
    placeholder: {
        type: String,
        default: '',
    },
    errorMessage: {
        type: String,
        default: '',
    },
    isPassword: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    numeric: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    inputClass: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'keyup',
    'keypress',
    'paste',
    'change',
    'input',
    'update:value'
])

const value = defineModel({default: ''})

</script>
