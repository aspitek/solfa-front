<!-- src/views/UploadPartition.vue -->
<template>
    <div class="flex-1 flex justify-center items-center">
        <div class="pt-5 sm:px-8 flex bg-white w-full sm:w-[50vw] min-h-[95vh] sm:min-h-[80vh] rounded-xl shadow-md">
          <Stepper v-model:value="activeStep" class="flex flex-1">
              <StepPanels class="flex flex-col flex-1 px-5 sm:px-0">
                  <StepPanel class="h-full" :value="1">
                      <div class="h-full flex-col">
                          <UploadInput class="h-full" @file-uploaded="handleFileChange" />
                      </div>
                  </StepPanel>
                  <StepPanel class="flex flex-col items-center gap-2 flex-1" :value="2">
                    <div class="text-center">
                      <h1 class="text-2xl text-primary">Ajouter une Partition 🎶</h1>
                      <p class="">Partagez vos partitions préférées avec la communauté <span class="text-primary">Solfa</span> !</p>
                    </div>
                    <Form
                      v-slot="{loading}"
                      class="w-full h-full grid grid-cols-6 items-center"
                      :initialValues
                      :schema="createPartitionSchema"
                      @submit="handleUpload"
                    >
                      <Input
                        name="title"
                        label="Titre"
                        id="title"
                        class="col-span-full"
                      />
                      <Input
                        name="composer"
                        label="Compositeur"
                        id="composer"
                        class="col-span-full sm:col-span-4"
                      />
                      <FormField
                          v-slot="$field"
                          class="flex flex-col gap-2 col-span-full sm:col-span-2"
                          name="release_date"
                          initialValue=""
                      >
                        <label for="release_date">
                          Date de sortie
                        </label>
                        <DatePicker
                          :invalid="!!$field.error"
                          name="release_date"
                          showIcon
                          fluid
                        >
                          <template #inputicon="slotProps">
                              <i class="pi pi-clock" @click="slotProps.clickCallback" />
                          </template>
                        </DatePicker>
                        <small
                            v-if="$field.error"
                            :id="`release_date-help`"
                            class="text-red-500 mb-2"
                        >
                            {{ $field.error.message }}
                        </small>
                      </FormField>
                      <Select
                        name="genre"
                        label="Genre"
                        id="genre"
                        :options="partitionGenders"
                        optionLabel="label"
                        class="col-span-full sm:col-span-3"
                      />
                      <Select
                        name="category"
                        label="Catégorie"
                        id="category"
                        :options="partitionCategories"
                        optionLabel="label"
                        class="col-span-full sm:col-span-3"
                      />
                    <div class="flex col-span-full mt-5 justify-center">
                      <Button
                        class="self-end"
                        label="Televerser la Partition"
                        type="submit"
                        icon="pi pi-upload"
                        iconPos="right"
                        :loading
                      />
                    </div>
                  </Form>
                </StepPanel>
            </StepPanels>
        </Stepper>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Stepper from 'primevue/stepper';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import UploadInput from '@/components/Partition/UploadInput.vue';
import Form from '@/components/UI/Form.vue';
import Input from '@/components/UI/Input.vue';
import Button from '@/components/UI/Button.vue';
import Select from '@/components/UI/Select.vue';
import DatePicker from 'primevue/datepicker';
import { createPartitionSchema } from '@/schemas/partition';
import container from '@/container/inversify.config';
import type { IApiService } from '@/services/ApiService';
import { SYMBOLS } from '@/constants';
import { FormField } from '@primevue/forms';
import { useToast } from 'primevue/usetoast';


    const partitionFile = ref<File | null>(null);
    const activeStep = ref(1);
    const toast = useToast();

    const initialValues = {
        title: '',
        composer: '',
        genre: '',
        category: '',
        releaseDate: '',
    };

    const partitionGenders = [
      { label: "Classique", value: "Classique" },
      { label: "Liturgique", value: "Liturgique" },
      { label: "Recueil de chant", value: "Recueil de chant" },
      { label: "Animation | 4/4", value: "Animation | 4/4" },
      { label: "Gbegbe", value: "Gbegbe" },
      { label: "Apkongbô", value: "Apkongbô" },
      { label: "Gospel", value: "Gospel" },
      { label: "6/8", value: "6/8" },
      { label: "Traditionnel", value: "Traditionnel" },
      { label: "Hymne", value: "Hymne" },
      { label: "Highlife", value: "Highlife" },
      { label: "Agbadja", value: "Agbadja" },
      { label: "Abodan", value: "Abodan" },
      { label: "6/8 Ghana", value: "6/8 Ghana" },
      { label: "Mandingue", value: "Mandingue" },
      { label: "Autre", value: "Autre" },
    ];

    const partitionCategories = [
      { label: "Offertoire", value: "Offertoire" },
      { label: "Ordinaire", value: "Ordinaire" },
      { label: "PU", value: "PU" },
      { label: "Action de grâce", value: "Action de grâce" },
      { label: "Antienne d'ouverture", value: "Antienne d'ouverture" },
      { label: "Communion | Sainte Cène", value: "Communion | Sainte Cène" },
      { label: "Psaume", value: "Psaume" },
      { label: "Méditation", value: "Méditation" },
      { label: "Animation", value: "Animation" },
      { label: "Quête", value: "Quête" },
      { label: "Acclamation", value: "Acclamation" },
      { label: "Requiem", value: "Requiem" },
      { label: "Sacrement", value: "Sacrement" },
      { label: "Carême", value: "Carême" },
      { label: "Autre", value: "Autre" },
    ];

    const handleFileChange = (file: File) => {
      partitionFile.value = file;
    };

    const handleUpload = async (data: any) => {
      console.log("data", data);
        if (!partitionFile.value) {
            activeStep.value = 1;
            return;
        }

        const _apiService = container.get<IApiService>(SYMBOLS.IApiService)
        await _apiService.createPartition({
          ...data,
          partitionFile: partitionFile.value,
        })

        partitionFile.value = null;

        toast.add({
          severity: 'success',
          detail: 'Partistion Enregistrée avec succès',
          summary: 'telechargement terminé',
          life: 5000,
        })
    };

    watch(partitionFile, (value) => {
      if (!value) {
        activeStep.value = 1;

        return
      }

      activeStep.value++
    })

</script>
