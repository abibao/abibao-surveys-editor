<template>
  <div class="page" v-if="initialized">
    <ui-appbar />
    <div class="content no-border subheader">
      <label>Bienvenue, {{user.displayName}}</label>
    </div>
    <div class="content no-border body">
      <div class="content jumbotron">
        <div clas="article">
          <h2 class="light-blue-text">Media</h2>
        </div>
      </div>
      <v-uploader :uploader="uploader">
        <h2 class="light-blue-text">Zone de larguage...</h2>
      </v-uploader>
    </div>
  </div>
</template>

<script src="./script.js" />
<style scoped src="./style.css" />
