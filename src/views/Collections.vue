<template>
  <div class="collections">
    <md-table v-model="collections">
      <md-table-toolbar>
        <h1 class="md-title">Collections</h1>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" md-selectable="single">
        <md-table-cell md-label="ID" md-sort-by="id">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Description">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Permission">{{ item.gender }}</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-head md-numeric>SL</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head>Permission</md-table-head>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>1</md-table-cell>
        <md-table-cell>Admin</md-table-cell>
        <md-table-cell>Finance</md-table-cell>
        <md-table-cell>Sales Support</md-table-cell>
        <md-table-cell @click="alert">Distributor</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>2</md-table-cell>
        <md-table-cell>Odette Demageard</md-table-cell>
        <md-table-cell>odemageard1@spotify.com</md-table-cell>
        <md-table-cell>Female</md-table-cell>
        <md-table-cell>Account Coordinator</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell md-numeric>3</md-table-cell>
        <md-table-cell>Vera Taleworth</md-table-cell>
        <md-table-cell>vtaleworth2@google.ca</md-table-cell>
        <md-table-cell>Male</md-table-cell>
        <md-table-cell>Community Outreach Specialist</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Collections',
  props: {
    doc: String,
    user: String
  },
  data: () => ({
    collections: [],
    grid: [],
    snackbarMessage: 'Hello World',
    showSnackbar: false
  }),
  computed: {
    documentName() {
      return this.doc.toUpperCase()
    }
  },
  mounted() {
    this.collections.push({id: 1, name: 'Super Admin'}, {id: 2, name: 'Admin'}, {id: 3, name: 'Finance'}, {id: 4, name: 'Sales Support'}, {id: 5, name: 'Distributor'})
    // this.getCollections(this.document, this.collections, this.user)
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
  .collections, .collections .md-app {
    height: 100vh;
  }

  .md-table .md-table-cell {
    text-align: left;
  }
</style>
