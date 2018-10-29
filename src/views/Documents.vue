<template>
  <div class="about">
    <h1>This is the document page</h1>
  </div>
</template>

<script>
import axios from 'axios'

const DOCS_LIST_URL = process.env.VUE_APP_API_BASE_URL + '/docs'

export default {
  name: 'DocList',
  data: () => ({
    user: null,
    token: null,
    docs: [],
    snackbarMessage: 'Hello World',
    showSnackbar: false
  }),
  mounted() {
    if (localStorage.user && localStorage.token) {
      this.user = localStorage.user
      this.token = localStorage.token
      this.getDocs(this.user, this.token, this.docs)
    }
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
