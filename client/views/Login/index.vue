<template>
  <div v-if="initialized" class="content full center no-border">
    <h1 class="dark-red-text">Abibao</h1>
    <h3>Surveys Platform</h3>
    <div class="content login">
      <h3 class="dark-red-text">Vous êtes un étranger</h3>
      <p>Nous n’avons trouvé aucune trace de votre passage.</p>
      <button v-on:click="authGoogle" class="button dark-red">Google +</button>
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
