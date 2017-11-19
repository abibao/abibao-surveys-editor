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
      <div class="content jumbotron">
        <div clas="article">
          <h2 class="light-blue-text">Campagnes</h2>
          <h4 v-if="isMobile===false">Bienvenue sur l'espace campagnes</h4>
        </div>
        <div>
          <button v-if="currentState==='STATE_LIST'" v-tooltip="'Créer une campagne'" v-on:click="changeState('campaigns?state=create', 'STATE_CREATE')" type="button" class="button create"><i class="fa fa-plus" aria-hidden="true"></i></button>
          <button v-if="currentState!=='STATE_LIST'" v-tooltip="'Retour'" v-on:click="changeState('campaigns', 'STATE_LIST')" type="button" class="button create"><i class="fa fa-close" aria-hidden="true"></i></button>
        </div>
      </div>
      <!-- STATE_LIST -->
      <div v-if="currentState==='STATE_LIST'" class="content row cards no-border">
        <div class="content card" v-for="campaign in data.campaigns.dataProvider">
          <img class="picture" src="https://platform.pprod.abibao.com/images/default/campaign.png" height="100">
          <h2 class="dark-blue-text">{{getCompanyName(campaign.company).name}}</h2>
          <h3>{{campaign.name}}</h3>
          <h6>Mise à jour <strong>{{Math.floor((Date.now() - Date.parse(campaign.updatedAt)) / 86400000)}} jour(s)</strong></h6>
        </div>
      </div>
      <!-- STATE_CREATE -->
      <div v-if="currentState==='STATE_CREATE'" class="content row">
        <h2 class="dark-red-text">Création</h2>
        <hr class="dark-red" />
        <br />
        <div class="form-field">
          <label>Nom <span>*</span></label>
          <input @keyup="e => updateNewCampaign('name', e.currentTarget.value)" type="text" class="border" placeholder="Même une campagne doit avoir un nom" />
        </div>
        <div class="form-field">
          <label>Compagnie <span>*</span></label>
          <v-select :on-change="updateNewCampaignEntity" :searchable="false" :options="data.entities.dataProvider" label="name" placeholder="Une campagne n'est rien sans attache."></v-select>
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea @keyup="e => updateNewCampaign('description', e.currentTarget.value)" rows="4" class="border" placeholder="Une bonne description est parfois nécessaire." />
        </div>
        <div>
          <button v-on:click="createCampaign" type="button" class="button orange">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
