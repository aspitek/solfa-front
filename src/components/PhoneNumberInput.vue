<script setup lang="ts">

import {computed, ref, onBeforeMount, useTemplateRef, onMounted} from 'vue'
import {VueTelInput} from 'vue-tel-input';

const phoneNumber = defineModel({ required: true })
const props = defineProps({
    phoneNumber: {
        type: String,
        default: '',
    },
    inline: Boolean,
    disabled: Boolean,
    editLimitReached: Boolean,
    inputTabIndex: {
        type: String,
        default: '',
    },
})
const emits = defineEmits(['phone-change', 'is-valid-phone']);
const telInput = useTemplateRef('tel-Input');
const isValidNumber =  ref<boolean>(false);

const showValidationMessage = computed(() => {
    return phoneNumber.value && !isValidNumber.value;
})

const bindProps = {
    defaultCountry: 'CI',
};

const updatePhone = (data) => {
    console.log(data)
    isValidNumber.value = data.valid;
    emits('is-valid-phone',data.valid);
};

</script>

<template>
    <div class="phone-number">
        <div class="d-flex input-height">
            <vue-tel-input
                ref="tel-input"
                v-model="phoneNumber"
                v-bind="bindProps"
                :disabled="disabled"
                :valid-characters-only="true"
                :input-options="{ tabindex: inputTabIndex, showDialCode: true }"
                :dropdown-options="{ showFlags: true, tabindex: inputTabIndex }"
                @validate="updatePhone"
            />
        </div>
        <div>
            <div v-if="showValidationMessage" class="text-danger text-center">
                {{ 'phone_number.wrong' }}
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
