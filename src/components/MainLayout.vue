<template>
  <div class="app-main-layout">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Invariant Telecom</span>
        <div class="md-toolbar-section-end">
          <md-button class="md-primary">Create</md-button>
          <md-button class="md-primary" @click="gotoDocs">Docs</md-button>
          <md-button class="md-primary" @click="gotoCollections">Collections</md-button>
          <md-button class="md-primary" @click="gotoTeam">Team</md-button>
          <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
        </div>
      </md-app-toolbar>
      <!--<Navbar slot="md-app-toolbar"></Navbar>-->
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
// import Navbar from '@/components/Navbar'
export default {
  name: 'MainLayout',
  // components: {Navbar}
}
</script>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
  }

  .md-app-content {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
