<!-- src/components/Logo.vue -->
<template>
    <div class="logo">
        <svg width="400" height="350" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <!-- Texte SOLFA avec chaque lettre d'une couleur spécifique -->
            <text x="40" y="100" font-family="Arial" font-size="40" font-weight="bold">
                <tspan x="5" fill="#A7B5A3">S</tspan>
                <tspan x="45" fill="#F9C5B5">O</tspan>
                <tspan x="90" fill="#C4827A">L</tspan>
                <tspan x="125" fill="#A7B5A3">F</tspan>
                <tspan x="160" fill="#F9C5B5">A</tspan>
            </text>
        </svg>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Logo',
};
</script>

<style scoped>
.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    /* Ajuste la hauteur selon tes besoins */
    margin-bottom: 2rem;
    /* Espace entre le logo et le formulaire de recherche */
}
</style>