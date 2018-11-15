<template>
  <div class="app-main-layout">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary md-dense">
        <span class="md-title">Invariant Telecom</span>
        <div class="md-toolbar-section-end">
          <md-button v-if="superuser" class="md-primary">Create</md-button>
          <md-button v-if="currentRoute.name !== 'Apps'" class="md-primary">Apps</md-button>
          <md-button v-if="superuser" class="md-primary">Team</md-button>
          <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',

  data: () => ({
    currentRoute: null,
    superuser: false
  }),

  methods: {
  },

  created() {
    this.currentRoute = {path: this.$route.path, name: this.$route.name}
    this.superuser = false
  }
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
