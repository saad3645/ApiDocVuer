<template>
  <div class="doc-list md-layout md-alignment-center-center">
    <div class="md-layout-item md-size-70 md-small-size-90 md-xsmall-size-100">
      <h1 class="md-display-4">Projects</h1>
      <div class="md-layout md-alignment-center-center">
        <md-card v-for="doc in docs" :key="doc.id" md-with-hover class="md-layout-item">
          <md-card-header>
            <div class="md-title">{{doc.title}}</div>
            <!--<div class="md-subhead">It also have a ripple</div>-->
          </md-card-header>
          <md-card-content>{{doc.short_description}}</md-card-content>
          <md-card-actions>
            <md-button @click="viewCollection(doc.id, doc.name)">View Collections</md-button>
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
    docs: []
  }),

  mounted() {
    // this.docs.push({name: 'wallet', heading: 'Wallet'}, {name: 'buddy', heading: 'Hey Buddy'})
    this.getDocs()
  },

  methods: {
    async getDocs() {
      if (!localStorage.token) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/d'
      const token = localStorage.token
      const authHeader = 'Bearer ' + token
      try {
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        res.data.data.forEach(item => {this.docs.push(item)})
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
    },

    viewCollection(docId, docName) {
      console.log(docId)
      console.log(docName)
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
  }
</style>
