<template>
  <div class="doc-list md-layout md-alignment-center-center">
    <div v-if="docs" class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
      <h1 class="md-display-4">Projects</h1>
      <div class="md-layout md-alignment-center-center">
        <md-card v-for="doc in docs" :key="doc.id" md-with-hover class="md-layout-item">
          <md-card-header>
            <div class="md-title">{{doc.title}}</div>
          </md-card-header>
          <md-card-content>{{doc.short_description}}</md-card-content>
          <md-card-actions>
            <md-button class="md-icon-button" @click="getCollections(doc)">
              <md-icon>code</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Docs',

  data: () => ({
    docs: null,
    errors: null,
    showSnackbar: false
  }),

  async created() {
    this.docs = await this.getDocList()
  },

  methods: {
    async getDocList() {
      if (!localStorage.token) {
        this.$router.push({name: 'Login'})
        return null
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/d'
      const token = localStorage.token
      const authHeader = 'Bearer ' + token

      try {
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        return res.data
      }
      catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          if (error.response.status !== 401 && error.response.status !== 403) {
            console.log('Error', error.response.data.errors)
          }
          this.errors = error.response.data.errors
        }
        else {
          console.log('Error', error.message)
          this.errors = error.message
        }
        this.showSnackbar = true
      }
    },

    getCollections(doc) {
      console.log('CLicked')
      this.$router.push({name: 'Collections', params: {doc: doc.name, docId: doc.id, collections: doc.collections, docObject: doc}})
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
