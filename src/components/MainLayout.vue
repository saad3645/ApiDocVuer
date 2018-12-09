<template>
  <div class="app-main-layout">
    <md-app md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="branding">
          <span class="md-title">{{heading}}</span>
        </div>
        <span class="md-subheader">{{subheading}}</span>
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
    heading: process.env.VUE_APP_DEFAULT_HEADING,
    currentRoute: null,
    superuser: false
  }),

  created() {
    this.currentRoute = {path: this.$route.path, name: this.$route.name}
    this.superuser = false
  },

  computed: {
    subheading() {
      return this.$route.params.appId && this.$route.params.docId ? this.$route.params.appId + '/' + this.$route.params.docId : ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
  }

  .branding {
    width: calc(250px - 16px);
    text-align: left;
  }

  .md-app-toolbar .md-subheader {
    font-size: 16px;
  }

  .md-app-content {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
