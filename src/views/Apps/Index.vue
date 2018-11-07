<template>
  <div>
    <md-progress-bar md-mode="indeterminate" v-if="loading" />
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
              <md-menu v-if="app.docs" md-size="small" md-align-trigger>
                <md-button class="md-primary" md-menu-trigger>{{selectedDoc[app.name]}}</md-button>
                <md-tooltip md-direction="top">Select Document</md-tooltip>
                <md-menu-content>
                  <md-menu-item v-for="doc in app.docs" :key="doc" @click="selectDoc(app.name, doc)">{{doc}}</md-menu-item>
                </md-menu-content>
              </md-menu>
              <md-menu v-if="app.docs && selectedDoc[app.name]" md-size="small" md-align-trigger>
                <md-button class="md-accent" md-menu-trigger>v {{selectedVersion[app.name]}}</md-button>
                <md-tooltip md-direction="top">Select Version</md-tooltip>
                <md-menu-content>
                  <md-menu-item v-for="version in app['@' + selectedDoc[app.name]]" :key="version" @click="selectVersion(app.name, version)">{{version}}</md-menu-item>
                </md-menu-content>
              </md-menu>
              <md-button v-if="app.docs && selectedDoc[app.name] && selectedVersion[app.name]" class="md-icon-button" :to="{name: 'Reference', params: {appId: app.name, docId: selectedDoc[app.name], version: selectedVersion[app.name], docs: app.docs, docVersions: docVersions[app.name]}}">
                <md-icon>explore</md-icon>
                <md-tooltip>View Api Reference</md-tooltip>
              </md-button>
              <md-button v-if="!app.docs" class="md-dense" disabled>No Doc Available</md-button>
            </md-card-actions>
          </md-card>
        </div>
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
  name: 'Apps',

  data: () => ({
    apps: null,
    docVersions: null,
    selectedDoc: null,
    selectedVersion: null,
    loading: false,
    snackbarMessage: null,
    showSnackbar: false
  }),

  async created() {
    this.apps = await this.getAppList()

    this.docVersions = this.apps.reduce((result, app) => {
      if (app.docs) {
        result[app.name] = app.docs.reduce((sub, doc) => {
          if (app['@' + doc]) {
            sub[doc] = app['@' + doc]
          }
          return sub
        }, {})
      }
      return result
    }, {})

    this.selectedDoc = this.apps.reduce((result, app) => {
      if (app.docs && app.docs.length > 0) {
        result[app.name] = app.docs[0]
      }
      return result
    }, {})

    const self = this
    this.selectedVersion = this.apps.reduce((result, app) => {
      if (self.selectedDoc[app.name]) {
        result[app.name] = app['@' + self.selectedDoc[app.name]][0]
      }
      return result
    }, {})
  },

  methods: {
    selectDoc(appName, doc) {
      this.selectedDoc[appName] = doc
      this.selectedVersion[appName] = this.docVersions[appName][doc][0]
    },

    selectVersion(appName, version) {
      this.selectedVersion[appName] = version
    },

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
    max-width: 350px;
    min-height: 200px;
    margin-bottom: 16px;
  }

  .md-card .md-card-content {
    min-height: 72px;
  }
</style>
