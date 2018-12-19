<template>
  <div>
    <md-progress-bar md-mode="indeterminate" v-if="loading" />
    <div class="doc-list md-layout md-alignment-center-center">
      <div v-if="docs" class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
        <h1 class="md-display-4">Products</h1>
        <div class="md-layout md-alignment-center-center">
          <md-card v-for="doc in docs" :key="doc.name" md-with-hover class="md-layout-item" @click="getDoc(doc.name)">
            <md-card-header>
              <div class="md-title">{{doc.title}}</div>
              <!-- <div class="md-subhead">{{doc.summary}}</div> -->
            </md-card-header>
            <md-card-content>{{doc.description}}</md-card-content>
            <md-card-actions>
              <md-button v-if="doc.overview" class="md-icon-button" :to="{name: 'Overview', params: {appId: appId, version: version, docId: doc.name}}">
                <md-icon>description</md-icon>
                <md-tooltip>View Overview</md-tooltip>
              </md-button>
              <md-button v-if="doc.reference" class="md-icon-button" :to="{name: 'Reference', params: {appId: appId, version: version, docId: doc.name}}">
                <md-icon>explore</md-icon>
                <md-tooltip>View Reference</md-tooltip>
              </md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AppDocs',
  data: () => ({
    appId: null,
    version: null,
    docs: null,
    loading: false,
    snackbarMessage: null,
    showSnackbar: false
  }),

  async created() {
    this.appId = this.$route.params.appId
    this.version = this.$route.params.version
    this.docs = await this.getDocs(this.appId)
  },

  methods: {
    async getDocs(appId) {
      if (!localStorage.token || !localStorage.token_expires_at || Math.ceil(Date.now() / 1000) >= localStorage.token_expires_at) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + 'apps/' + appId + '/docs'
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
            this.snackbarMessage = 'Product list not found'
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
    min-height: 200px;
    margin-bottom: 16px;
  }

  .md-card .md-card-content {
    min-height: 72px;
  }
</style>
