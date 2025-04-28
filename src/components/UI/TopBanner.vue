<script setup lang="ts">
import { useTopBanner } from '~/composables/useTopBanner'
import TopBannerItem from '~/components/UI/TopBannerItem.vue'
import { computed, watch, ref, onMounted, onBeforeUnmount, onUpdated } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { FlashToastnterface, FlashToastOptionType } from '../../../src/types'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
import type User from '#models/user'

type FlashType = {
  id: string
  message: FlashToastnterface['message']
  options: Required<Omit<FlashToastnterface, 'message'>>
}

type MessageType = {
  severity: string;
  content: string;
  id: number
}

const toast = useToast()

const user = computed<User>(() => usePage().props.user as User)

const flashToasts = computed<Array<FlashType>>(
  () => usePage().props.flashToasts as Array<FlashType>
)
const flashMessages = computed<Array<FlashType>>(
  () => usePage().props.flashMessages as Array<FlashType>
)

const messages = ref<MessageType[]>([]);

let count = ref(0);

const addMessages = () => {
    messages.value = [
        { severity: 'info', content: 'Dynamic Info Message', id: count.value++ },
        { severity: 'success', content: 'Dynamic Success Message', id: count.value++ },
        { severity: 'warn', content: 'Dynamic Warn Message', id: count.value++ }
    ];
};

const dimissedFlashKays = ref<string[]>([])
/* const {
    messages,
    dimissMessage,
} = useTopBanner() */

watch(flashToasts, () => {
  flashToasts.value.forEach((flash) => {
    toast.add({
      detail: flash.message,
      life: flash.options.duration,
      closable: flash.options.closable,
      severity: getBannerSeverity(flash.options.type),
    })
  })
})

watch(flashMessages, () => {  
  messages.value = flashMessages.value.map((flash) => {
    return {
      severity: getBannerSeverity(flash.options.type),
      content: flash.message,
      id: count.value++,
    }
  })
}, { immediate: true })

function getBannerSeverity(
  type: FlashToastOptionType
): 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' {
  switch (type) {
    case FlashToastOptionType.WARNING:
      return 'warn'

    default:
      return type
  }
}

function addMessage(severity: string, content: string) {
  messages.value.push({ severity, content, id: count.value++ });
}
</script>
<template>
  <div class="flex flex-col">
    <transition-group name="p-message" tag="div" class="flex flex-col gap-1">
        <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity" class="flex flex-col text-center items-center">
          <p
            class="ml-2"
            v-html="msg.content"
          />          
        </Message>
    </transition-group>
  </div>
</template>
