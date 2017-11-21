<template>
  <div class="page" v-if="initialized">
    <header>
      <div class="content header">
        <div class="logo">
          <h1 class="header dark-red-text">Abibao</h1>
          <h4 class="header black-text">Surveys Platform</h4>
        </div>
        <button v-on:click="logout" type="button" class="button logout">Logout</button>
      </div>
    </header>
    <div class="content no-border subheader">
      <label>Bienvenue, {{user.displayName}}</label>
    </div>
    <div class="content no-border body">
      <div class="statistic">
        <div class="header">
          <h2 class="dark-blue-text">Campagnes</h2>
          <router-link to="campaigns"><i class="fa fa-cog fa-2x" aria-hidden="true"></i></router-link>
        </div>
        <hr />
        <h4>Gestion des campagnes de sondages.</h4>
        <label>{{data.campaigns.total}} campagnes en cours.</label>
      </div>
      <div class="statistic">
        <h2 class="dark-blue-text">Styles</h2>
        <hr />
        <h4>Gestion des styles des lecteurs de sondages</h4>
        <label>{{data.styles.total}} styles en cours</label>
      </div>
      <div class="statistic">
        <div class="header">
          <h2 class="dark-blue-text">Media</h2>
          <router-link to="media"><i class="fa fa-cog fa-2x" aria-hidden="true"></i></router-link>
        </div>
        <hr />
        <h4>Gestion des media de la plateforme</h4>
        <label>{{data.media.total}} media en cours</label>
      </div>
      <div class="statistic">
        <h2 class="dark-blue-text">CRM</h2>
        <hr />
        <h4>Gestion des emailings</h4>
        <label>{{data.emailings.total}} emailings en cours</label>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
