<template>
    <form @submit.prevent="handleSearch" class="w-full search-form rounded-xl">
      <InputGroup class="w-full rounded-lg">
        <InputText
          name="search"
          v-model="query"
          @input="onInputChange"
          type="text"
          placeholder="Rechercher..."
          class="h-16 rounded-xl"
        />
        <Button
          type="submit"
          icon="pi pi-search"
          label="Rechercher"
        />
      </InputGroup>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchStore } from '../stores/searchStore';
import Button from '@/components/UI/Button.vue';
import { InputGroup, InputText } from 'primevue';

export default defineComponent({
    name: 'SearchForm',
    components: {
        Button,
        InputText,
        InputGroup
    },
    data() {
        return {
            query: '',
            debounceTimeout: undefined as number | undefined, // Variable pour gérer le timeout
        };
    },
    methods: {
        // Méthode pour la recherche lorsque le formulaire est soumis
        handleSearch() {
            if (this.query.trim()) {
                const searchStore = useSearchStore();
                searchStore.fetchResults(this.query);
            }
        },

        // Méthode appelée à chaque changement de l'input
        onInputChange() {
            // Annuler le précédent timeout si l'utilisateur tape rapidement
            if (this.debounceTimeout !== undefined) {
                clearTimeout(this.debounceTimeout);
            }

            if (this.query.trim()) {
                // Délai avant d'envoyer la requête
                this.debounceTimeout = setTimeout(() => {
                    const searchStore = useSearchStore();
                    // Vérifier à nouveau si query est non vide avant d'envoyer la requête
                    if (this.query.trim()) {
                        searchStore.fetchResults(this.query);
                    }
                }, 500); // Délai de 500 ms avant d'envoyer la requête
            } else {
                // Si l'input est vide, vider les résultats immédiatement
                const searchStore = useSearchStore();
                searchStore.clearResults();
            }
        },
    },
});
</script>

<style scoped lang="scss">
.search-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    .p-inputtext {

    }
}


.search-input:focus {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.search-button:hover {
    background-color: #c1351f;
}
</style>
