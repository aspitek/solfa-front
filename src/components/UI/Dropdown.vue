<script setup lang="ts">
import { ref } from 'vue';
import Button from './Button.vue';
import Menu from 'primevue/menu';

const menu = ref()


const toggle = (event: any) => {
    menu.value.toggle(event);
};

const model = defineModel<any[]>()
</script>

<template>
    <div
        role="button"
        @click="toggle"
    >
        <slot>
            <Button
                icon="pi pi-bars"
                severity="contrast"
                text
                aria-haspopup="true"
                aria-controls="overlay_menu"
            />
        </slot>
    </div>
    <Menu
        ref="menu"
        :model="model"
        :popup="true"
    >
        <template #item="{ item, props }">
            <slot
                v-if="item.slot"
                :name="item.slot"
                :item="item"
                :props="props"
            />
            <slot
                v-else
                name="item"
                :item="item"
                :props="props"
            />
        </template>
      <template #end>
        <slot name="end" />
      </template>
    </Menu>
</template>
