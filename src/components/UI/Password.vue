
<template>
    <FormField
        v-slot="{ error }"
        class="w-full flex flex-col gap-2"
        :name="name"
        initialValue=""
    >
        <label :for="name">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <Password
            v-model="value"
            class="p-password-fluid"
            :id="id"
            :disabled="disabled"
            :invalid="!!error"
            :name="name"
            :aria-describedby="`${name}-help`"
            :placeholder="placeholder"
            :feedback="false"
            fuild
        />
        <small
            v-if="error"
            :id="`${name}-help`"
            class="text-red-500"
        >
            {{ error.message }}
        </small>
    </FormField>
</template>

<script setup lang="ts">
import Password from 'primevue/password';
import { FormField } from '@primevue/forms';


const { name } = defineProps({
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
    disabled: {
        type: Boolean,
        default: false,
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
