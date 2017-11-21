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
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
