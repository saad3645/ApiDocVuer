<template>
  <div class="api-reference-wrap">
    <md-toolbar md-elevation="0">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">No Elevation</h3>
        <span class="md-subheader">Version 1</span>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-dense md-primary md-icon-button">
          <md-icon>refresh</md-icon>
        </md-button>
        <md-button class="md-dense md-primary">Export</md-button>
      </div>
    </md-toolbar>
    <md-content class="api-reference-container">
      <md-drawer md-permanent="clipped">
        <MenuContent></MenuContent>
      </md-drawer>
      <md-content>
        <code>{{JSON.stringify(source)}}</code>
      </md-content>
    </md-content>
  </div>
</template>

<script>
import axios from 'axios'
import MenuContent from '@/components/MenuContent'

export default {
  name: 'ApiDoc',
  components: {MenuContent},
  data: () => ({
    docId: null,
    docName: null,
    doc: null,
    source: null
  }),

  created() {
    this.docId = this.$route.params.docId
    this.docName = this.$route.params.docName
    this.doc = this.$route.params.doc
    this.getOpenApi(this.docId)
  },

  methods: {
    async getOpenApi(docId) {
      if (!localStorage.token) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/d/' + docId + '/openapi'
      const token = localStorage.token
      const authHeader = 'Bearer ' + token

      try {
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        this.source = res.data
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .api-reference-wrap {
    height: 100vh;
  }
  .api-reference-container {
    display: inline-flex;
  }
  .md-drawer {
    min-width: 250px;
    max-width: 250px;
  }
</style>
