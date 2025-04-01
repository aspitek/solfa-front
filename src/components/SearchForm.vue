<template>
    <form @submit.prevent="handleSearch" class="search-form">
        <input v-model="query" @input="onInputChange" type="text" placeholder="Rechercher..." class="search-input" />
        <button type="submit" class="search-button">Rechercher</button>
    </form>
</template>

<script lang="ts">
import { useSearchStore } from '../stores/searchStore';

export default {
    name: 'SearchForm',
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
            if (this.query.trim()) {
                // Annuler le précédent timeout si l'utilisateur tape rapidement
                clearTimeout(this.debounceTimeout);
                // Délai avant d'envoyer la requête
                this.debounceTimeout = setTimeout(() => {
                    const searchStore = useSearchStore();
                    searchStore.fetchResults(this.query);
                }, 500); // Délai de 500 ms avant d'envoyer la requête
            }else if (this.query === '') {
                // Si l'input est vide, on peut choisir de ne rien faire ou de vider les résultats
                const searchStore = useSearchStore();
                searchStore.clearResults();
            }
        },
    },
};
</script>

<style scoped>
.search-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.search-input {
    width: 500px;
    max-width: 90vw;
    padding: 0.9rem 1.2rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 24px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: box-shadow 0.2s;
}

.search-input:focus {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.search-button {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
    background-color: #C4827A;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.search-button:hover {
    background-color: #c1351f;
}
</style>