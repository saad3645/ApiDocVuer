<template>
  <div class="app-list md-layout md-alignment-center-center">
    <div v-if="apps" class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
      <h1 class="md-display-4">Applications</h1>
      <div class="md-layout md-alignment-center-center">
        <md-card v-for="app in apps" :key="app.name" md-with-hover class="md-layout-item">
          <md-card-header>
            <div class="md-title">{{app.title}}</div>
          </md-card-header>
          <md-card-content>
            {{app.description}}
          </md-card-content>
          <md-card-actions>
            <md-menu v-if="selectedVersion[app.name]" md-size="small" md-align-trigger>
              <md-button md-menu-trigger>Version {{selectedVersion[app.name]}}</md-button>
              <md-menu-content>
                <md-menu-item v-for="version in app.versions" :key="version" @click="selectedVersion[app.name] = version">{{version}}</md-menu-item>
                <!-- <md-menu-item>My Item 2</md-menu-item>
                <md-menu-item>My Item 3</md-menu-item> -->
              </md-menu-content>
            </md-menu>
            <md-button class="md-icon-button" :disabled="!selectedVersion[app.name]" @click="getCollections(app)">
              <md-icon>code</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <md-snackbar :md-active.sync="showSnackbar">
      <span>{{snackbarMessage}}</span>
      <md-button class="md-primary" @click="!showSnackbar">Dismiss</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'apps',

  data: () => ({
    apps: null,
    selectedVersion: null,
    loading: false,
    snackbarMessage: null,
    showSnackbar: false
  }),

  async created() {
    this.apps = await this.getAppList()
    this.selectedVersion = this.apps.reduce((result, app) => {
      if (app.versions && app.versions.length > 0) {
        result[app.name] = app.versions[0]
      }
      return result
    }, {})
  },

  methods: {
    async getAppList() {
      if (!localStorage.token || !localStorage.token_expires_at || Math.ceil(Date.now() / 1000) >= localStorage.token_expires_at) {
        this.$router.push({name: 'Login'})
        return null
      }

      const url = process.env.VUE_APP_API_BASE_URL + 'apps'
      const authHeader = 'Bearer ' + localStorage.token

      try {
        this.loading = true
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        this.loading = false
        return res.data.data
      }
      catch (error) {
        this.loading = false
        if (error.response && error.response.data && error.response.data.errors) {
          if (error.response.status === 404) {
            this.snackbarMessage = 'App list not found'
          }
          if (error.response.status !== 401 && error.response.status !== 403) {
            console.log('Error', error.response.data.errors)
          }
          else {
            this.snackbarMessage = error.response.data.errors[0].detail
          }
        }
        else if (error.message) {
          console.log('Error', error.message)
          this.snackbarMessage = error.message
        }
        else {
          console.log('Error', error)
          this.snackbarMessage = error
        }
        this.showSnackbar = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-display-4 {
    font-size: 32px;
  }

  .md-card {
    min-width: 240px;
    max-width: 300px;
    margin-bottom: 16px;
  }
</style>
