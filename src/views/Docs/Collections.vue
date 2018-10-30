<template>
  <div class="collections md-layout md-alignment-center-center">
    <div class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
      <h1 class="md-display-4">Collections</h1>
      <div class="md-layout md-alignment-center-center">
        <md-card v-for="collection in doc.collections" :key="collection.id" md-with-hover class="md-layout-item">
          <md-card-header>
            <div class="md-title">{{collection.name}}</div>
            <!--<div class="md-subhead">It also have a ripple</div>-->
          </md-card-header>
          <md-card-content>{{collection.description}}</md-card-content>
          <md-card-actions>
            <md-button :to="{name: 'Reference', params: {docName: docName, collectionId: collection.id, docId: doc.bin, doc: doc}}">View</md-button>
          </md-card-actions>
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
    docName: null,
    doc: null,
    snackbarMessage: 'Hello World',
    showSnackbar: false
  }),

  created() {
    this.docName = this.$route.params.docName
    this.doc = this.$route.params.doc
  },

  methods: {
    async getCollections(document, collections, user) {
      if (!localStorage.token) {
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/' + document + '/c'
      const token = localStorage.token
      const authHeader = 'Bearer ' + token
      try {
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        res.data.data.forEach(item => {collections.push(item)})
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
  .md-display-4 {
    font-size: 32px;
  }

  .md-card {
    min-width: 240px;
    max-width: 300px;
    margin-bottom: 16px;
  }
</style>
