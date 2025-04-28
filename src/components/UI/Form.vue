<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Form, type FormSubmitEvent } from '@primevue/forms';
import type { ZodObject } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';

const {
  initialValues,
  onSubmit,
  schema,
} = defineProps<{
  initialValues: Record<string, any>
  schema: ZodObject<Record<string, any>>
  onSubmit: (values: Record<string, any>, form: Omit<FormSubmitEvent, 'values'>) => void | Promise<void>,
}>()
const toast = useToast();

const emit = defineEmits(['submitted'])

const isRequesting = ref<boolean>(false)

const resolver = ref(zodResolver(schema))


const formRef = useTemplateRef('formRef')

const onError = (event: any) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function handleSubmit({
  values,
  ...form
}: FormSubmitEvent)
{
  console.log('handleSubmit', values, form)
    if (!form.valid || isRequesting.value) {
      console.log(form.valid, values);

      return
    }

    try {
      isRequesting.value = true;
      await onSubmit(values, form);
      emit('submitted');
      setTimeout('', 5000)
    } catch (error: any) {
      toast.add({
        summary: 'Erreur!',
        detail: error.message,
        severity: 'error',
        life: 5000,
      })
    } finally {
      isRequesting.value = false;
    }
}

</script>

<template>
  <Form
    v-slot="$form"
    ref="formRef"
    :initialValues
    :resolver
    @submit="handleSubmit"
  >
    <slot :loading="isRequesting" />
  </Form>
</template>
