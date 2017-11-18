<template>
  <div class="page" v-if="initialized">
    <header>
      <div class="content header">
        <div class="logo">
          <h1 class="header dark-red-text">Abibao</h1>
          <h4 class="header black-text">Surveys Platform</h4>
        </div>
        <button type="button" class="button logout">Logout</button>
      </div>
    </header>
    <div class="content no-border subheader">
      <label>Bienvenue, {{user.displayName}}</label>
    </div>
    <div class="content no-border body">
      <div class="content jumbotron">
        <div clas="article">
          <h2 class="light-blue-text">Campagnes</h2>
          <h4 v-if="isMobile===false">Bienvenue sur l'espace campagnes</h4>
        </div>
        <div>
          <button v-if="currentState==='STATE_LIST'" v-tooltip="'Créer une campagne'" v-on:click="stateCreate" type="button" class="button create"><i class="fa fa-plus" aria-hidden="true"></i></button>
          <button v-if="currentState!=='STATE_LIST'" v-tooltip="'Retour'" v-on:click="stateList" type="button" class="button create"><i class="fa fa-close" aria-hidden="true"></i></button>
        </div>
      </div>
      <!-- create -->
      <div v-if="currentState==='STATE_CREATE'" class="content row">
        <h2 class="dark-red-text">Création</h2>
        <hr class="dark-red" />
        <div className="form-field">
          <label>Nom <span>*</span></label>
          <input type="text" class="border" placeholder="Modifiez-moi" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
