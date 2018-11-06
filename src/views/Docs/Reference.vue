<template>
  <div>
    <md-progress-bar md-mode="indeterminate" v-if="loading" />
    <div v-if="openapi" class="api-reference-wrap">
      <md-toolbar md-elevation="0">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">{{openapi.info.title}}</h3>
          <span class="md-subheader">Version {{openapi.info.version}}</span>
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
          <MenuContent :tree="tree"></MenuContent>
        </md-drawer>
        <md-content>
          <code>{{JSON.stringify(openapi)}}</code>
        </md-content>
      </md-content>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MenuContent from '@/components/Menu/MenuContent'

const REST_METHOD_REGEX = /^(get|post|put|patch|delete|options|head)$/i

export default {
  name: 'Reference',
  components: {MenuContent},
  data: () => ({
    appId: null,
    docId: null,
    version: null,
    openapi: null,
    openapiSpecVersion: null,
    tree: null,
    loading: false
  }),

  async created() {
    this.appId = this.$route.params.appId
    this.docId = this.$route.params.docId
    this.version = this.$route.params.version
    this.openapi = await this.getOpenApi(this.appId, this.docId, this.version)
    // validate this source object with openapi specification
    this.openapiSpecVersion = this.openapi.openapi
    this.tree = this.buildResourceTree(this.openapi)
  },

  methods: {
    async getOpenApi(appId, docId, version) {
      if (!localStorage.token || !localStorage.token_expires_at || Math.ceil(Date.now() / 1000) >= localStorage.token_expires_at) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + 'openapis/' + appId + '/' + docId + '/' + version
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
            this.snackbarMessage = 'Api Reference not found'
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
    },

    buildResourceTree(openapi) {
      const tagMap = {}
      const pathMap = {}

      Object.keys(openapi.paths).forEach(path => {
        pathMap[path] = {
          key: path,
          path: path,
          summary: openapi.paths[path].summary,
          description: openapi.paths[path].description,
          servers: openapi.paths[path].servers,
          endpoints: []
        }

        Object.keys(openapi.paths[path]).filter(item => REST_METHOD_REGEX.test(item)).forEach(op => {
          const endpoint = Object.assign(
            {
              key: (op + '-' + path),
              path: path,
              method: op,
              summary: openapi.paths[path].summary,
              description: openapi.paths[path].description,
              servers: openapi.paths[path].servers,
              operationId: (op + '-' + path.replace(/\//g, '-'))
            }, openapi.paths[path][op]
          )

          if (openapi.paths[path][op].tags) {
            openapi.paths[path][op].tags.forEach(tag => {
              if (!tagMap[tag]) {
                tagMap[tag] = {
                  key: tag.name,
                  path: path,
                  summary: openapi.paths[path].summary,
                  description: openapi.paths[path].description,
                  endpoints: [endpoint]
                }
              }
              else {
                tagMap[tag].endpoints.push(endpoint)
              }
            })
          }

          pathMap[path].endpoints.push(endpoint)
        })
      })

      console.log(tagMap)

      if (openapi['x-tagGroups']) {
        return openapi['x-tagGroups'].map(tgroup => Object.assign(tgroup, {key: tgroup.name, resources: tgroup.tags.map(tag => Object.assign(tag, tagMap[tag.name]))}))
      }
      else {
        const tree = [{key: 'root', menuTitle: (openapi['x-menuRoot'] && openapi['x-menuRoot'].title ? openapi['x-menuRoot'].title : null)}]
        if (openapi.tags) {
          tree[0].resources = openapi.tags.map(tag => Object.assign(tag, tagMap[tag.name]))
        }
        else {
          tree[0].resources = Object.keys(pathMap).map(path => pathMap[path])
        }
        return tree
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
