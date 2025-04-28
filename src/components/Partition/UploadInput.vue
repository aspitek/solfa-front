
<template>
    <div class="w-full h-full">
        <FileUpload
          name="partition_file"
          customUpload
          :multiple="false"
          accept="application/pdf"
          :maxFileize="1000000"
          @select="onSelectedFile"
        >
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button
                          @click="chooseCallback()"
                          :icon="PrimeIcons.FILE"
                          :disabled="files && !!files.length"
                          rounded
                          outlined
                          severity="info"
                        />
                        <Button
                          @click="clearCallback()"
                          icon="pi pi-times"
                          rounded
                          outlined
                          severity="danger"
                          :disabled="!files || files.length === 0"
                        />
                    </div>


                    <Button
                      @click="onUpload(uploadCallback)"
                      :icon="PrimeIcons.ARROW_RIGHT"
                      iconPos="right"
                      outlined
                      label="Suivant"
                      :disabled="!files || files.length !== 1"
                    />
                </div>
            </template>
            <template #content="{ files }">
                <div class="h-full flex flex-col gap-8 pt-4">
                    <div v-if="files.length > 0">
                        <div class="flex flex-col gap-4">
                            <div v-for="file of files" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                              <!-- <VPdfViewer
                                :src="file"
                              /> -->
                              {{ file.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="h-full flex items-center justify-center flex-col">
                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                    <p class="mt-6 mb-0">Glissez-Deposez ou Selectionnez le fichier a televerser.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "primevue/usetoast";
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';
import Button from '@/components/UI/Button.vue';
import { PrimeIcons } from '@primevue/core/api';

const toast = useToast();

const emits = defineEmits(['file-uploaded']);

const selectedFile = ref(undefined);


const onSelectedFile = (event: FileUploadSelectEvent) => {
  console.log("Selected file:", event);
  selectedFile.value = event.files[0];
};



const onUpload = (uploadCallback: () => void) => {
    if (!selectedFile.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No file selected', life: 3000 });
        return;
    }

    emits('file-uploaded', selectedFile.value);
    selectedFile.value = undefined;
    uploadCallback();
};

</script>
