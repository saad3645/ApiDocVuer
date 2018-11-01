<template>
  <div v-if="source" class="api-reference-wrap">
    <md-toolbar md-elevation="0">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{source.info.title}}</h3>
        <span class="md-subheader">Version {{source.info.version}}</span>
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
        <MenuContent :resourceGroups="tree.resourceGroups" :resources="tree.resources"></MenuContent>
      </md-drawer>
      <md-content>
        <code>{{JSON.stringify(source)}}</code>
      </md-content>
    </md-content>
  </div>
</template>

<script>
import axios from 'axios'
import MD5 from 'md5.js'
import MenuContent from '@/components/MenuContent'

const REST_METHOD_REGEX = /^(get|post|put|patch|delete|options|head)$/i
const COLLECTION_TAG_REGEX = /^(collection:([a-zA-Z0-9._-]+))$/

export default {
  name: 'ApiDoc',
  components: {MenuContent},
  data: () => ({
    docId: null,
    docName: null,
    doc: null,
    source: null,
    openapiVersion: null,
    tree: null
  }),

  async created() {
    this.docId = this.$route.params.docId
    this.docName = this.$route.params.docName
    this.doc = this.$route.params.doc
    this.source = await this.getOpenApi(this.docId)
    // validate this source object with openapi specification
    this.openapiVersion = this.source.openapi
    this.tree = this.buildTree(this.source)
  },

  methods: {
    async getOpenApi(docId) {
      if (!localStorage.token) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + '/d/' + '5bd84af251e8b664f2c4dfc8/openapi' // docId + '/openapi'
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
          this.snackbarMessage = error.response.data.errors[0].detail
        }
        else {
          console.log('Error', error.message)
          this.snackbarMessage = error.message
        }
      }
    },

    buildTree(source) {
      const tree = {resources: []}
      const resourceGroups = {}

      if (source['x-tagGroups']) {
        tree.resourceGroups = source['x-tagGroups'].map(tg => {
          const group = Object.assign({resources: []}, tg)
          resourceGroups[group.name] = group
          return group
        })
      }

      const resources = {}

      if (source['tags']) {
        source['tags'].forEach(tag => {
          const resource = Object.assign({key: new MD5().update(tag.name).digest('hex'), title: tag['x-title'], endpoints: []}, tag)
          if (tag['x-tagGroup'] && resourceGroups[tag['x-tagGroup']]) {
            resourceGroups[tag['x-tagGroup']].resources.push(resource)
          }
          else if (!source['x-tagGroups']) {
            tree.resources.push(resource)
          }
          resources[tag.name] = resource
        })
      }

      Object.keys(source.paths).forEach(path => {
        Object.keys(source.paths[path]).filter(item => REST_METHOD_REGEX.test(item)).forEach(op => {
          const endpoint = Object.assign(
            {
              path: path,
              method: op,
              summary: source.paths[path].summary,
              description: source.paths[path].description,
              servers: source.paths[path].servers,
              operationId: (op + '-' + path.replace(/\//g, '-'))
            }, source.paths[path][op])
          if (op.tags) {
            op.tags.forEach(t => {
              if (!COLLECTION_TAG_REGEX.test(t)) {
                resources[t].endpoints.push(endpoint)
              }
            })
          }
          else {
            if (!resources[path]) {
              const resource = {key: new MD5().update(path).digest('hex'), title: path, endpoints: []}
              tree.resources.push(resource)
              resources[path] = resource
            }
            resources[path].endpoints.push(endpoint)
          }
        })
      })

      return tree
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
