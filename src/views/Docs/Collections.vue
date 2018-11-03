<template>
  <div class="collections md-layout md-alignment-center-center">
    <div class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
      <h1 class="md-display-4">Collections</h1>
      <div class="md-layout md-alignment-center-center">
        <md-card v-for="collection in collections" :key="collection.id" md-with-hover class="md-layout-item" @click="getCollection(collection)">
          <md-ripple>
            <md-card-header>
              <div class="md-title">{{collection.title}}</div>
              <div class="md-subhead">{{collection.summary}}</div>
            </md-card-header>
            <md-card-content>{{collection.description}}</md-card-content>
          </md-ripple>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Collections',
  data: () => ({
    doc: null,
    docId: null,
    collections: null,
    docObject: null,
    showSpinner: false,
    showSnackbar: false
  }),

  created() {
    this.doc = this.$route.params.doc
    this.docId = this.$route.params.docId
    this.collections = this.$route.params.collections
    this.docObject = this.$route.params.docObject
  },

  methods: {
    async getCollection(collection) {
      if (!localStorage.token) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/d/' + '5bd84af251e8b664f2c4dfc8/openapi' // collection.id + '/openapi'
      const token = localStorage.token
      const authHeader = 'Bearer ' + token

      try {
        this.showSpinner = true
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        this.showSpinner = false
        this.$router.push({name: 'Reference', params: {doc: this.doc, collection: collection.name, openapi: res.data, docId: this.docId, collectionId: collection.id}})
      }
      catch (error) {
        this.showSpinner = false
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
  .md-display-4 {
    font-size: 32px;
  }

  .md-card {
    min-width: 240px;
    max-width: 300px;
    margin-bottom: 16px;
  }
</style>
