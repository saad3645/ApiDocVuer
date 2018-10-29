<template>
  <div class="documents">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Invariant Telecom</span>
        <div class="md-toolbar-section-end">
            <md-tabs class="md-primary" md-alignment="right">
            <md-tab id="tab-home" md-label="Docs"></md-tab>
            <md-tab id="tab-pages" md-label="Collections" :md-disabled="!collectionsTab"></md-tab>
            <md-tab id="tab-favorites" md-label="Reference" :md-disabled="!apiReferenceTab" to="/docs/a/reference"></md-tab>
            <md-tab id="tab-posts" md-label="Team" :md-disabled="!teamsTab"></md-tab>
          </md-tabs>
          <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
        </div>
      </md-app-toolbar>
      <NavHeader></NavHeader>
    </md-app>
  </div>
</template>

<script>
import axios from 'axios'
import NavHeader from '../components/NavHeader'

const DOCS_LIST_URL = process.env.VUE_APP_API_BASE_URL + '/docs'

export default {
  name: 'DocList',
  components: {NavHeader},
  data: () => ({
    user: null,
    token: null,
    docs: [],
    collectionsTab: false,
    apiReferenceTab: false,
    teamsTab: true,
    snackbarMessage: 'Hello World',
    showSnackbar: false
  }),
  mounted() {
    // if (localStorage.user && localStorage.token) {
    //   this.user = localStorage.user
    //   this.token = localStorage.token
    //   this.getDocs(this.user, this.token, this.docs)
    // }
  },
  methods: {
    async getDocs(user, token, docs) {
      try {
        const res = await axios.get(DOCS_LIST_URL + '?user=' + user + '&token=' + token)
        res.data.data.forEach(item => {docs.push(item)})
      }
      catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          if (error.response.status !== 401 && error.response.status !== 403) {
            console.log('Error', error.response.data.errors)
          }
          this.snackbarMessage = error.response.data.errors[0].detail
        }
        else {
          console.log('Error', error.message)
          this.snackbarMessage = error.message
        }
        this.showSnackbar = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // .api-document {
  //   height: 100vh;
  // }
  // .md-app {
  //   height: 100vh;
  // }
  // .md-drawer {
  //   width: 250px;
  //   max-width: calc(100vw - 125px);
  // }
</style>
