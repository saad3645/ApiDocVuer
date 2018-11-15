<template>
  <div class="api-reference-wrap">
    <md-progress-bar md-mode="indeterminate" v-if="loading" />
    <md-toolbar v-if="openapi" class="md-dense" md-elevation="2">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{openapi.info.title}}</h3>
        <md-menu md-size="medium" md-align-trigger>
          <md-button class="md-accent" md-menu-trigger>{{openapi.info['x-subtitle']}}</md-button>
          <md-menu-content>
            <md-menu-item v-for="doc in docs" :key="doc">{{doc}}</md-menu-item>
          </md-menu-content>
        </md-menu>
        <md-menu md-size="medium" md-align-trigger>
          <md-button class="md-accent" md-menu-trigger>v {{openapi.info.version}}</md-button>
          <md-menu-content>
            <md-menu-item v-for="version in docVersions[docId]" :key="version">{{version}}</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-primary md-icon-button">
          <md-icon>refresh</md-icon>
          <md-tooltip>Refresh</md-tooltip>
        </md-button>
        <md-button class="md-primary md-icon-button">
          <md-icon>save_alt</md-icon>
          <md-tooltip>Download OpenApi</md-tooltip>
        </md-button>
      </div>
    </md-toolbar>
    <div v-if="openapi" class="md-layout">
      <div class="md-layout-item menu-bar">
        <md-drawer md-fixed md-permanent="clipped" class="md-scrollbar">
          <MenuContent :tree="tree"></MenuContent>
        </md-drawer>
      </div>
      <div class="md-layout-item api-reference">
        <md-content class="api-content">
          <ContentGroup v-for="group in tree" :name="group.name" :title="group.title" :description="group.description" :resources="group.resources" :key="group.key"></ContentGroup>
        </md-content>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MenuContent from '@/components/Menu/MenuContent'
import ContentGroup from '@/components/Content/ContentGroup'

const REST_METHOD_REGEX = /^(get|post|put|patch|delete|options|head)$/i

export default {
  name: 'Reference',
  components: {MenuContent, ContentGroup},
  data: () => ({
    appId: null,
    docId: null,
    version: null,
    docs: null,
    docVersions: null,
    openapi: null,
    openapiSpecVersion: null,
    tree: null,
    loading: false
  }),

  async created() {
    this.appId = this.$route.params.appId
    this.docId = this.$route.params.docId
    this.version = this.$route.params.version
    this.docs = this.$route.params.docs
    this.docVersions = this.$route.params.docVersions
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

      const url = process.env.VUE_APP_API_BASE_URL + 'docs/openapi/' + appId + '/' + docId + '/' + version
      const authHeader = 'Bearer ' + localStorage.token

      try {
        this.loading = true
        const res = await axios.get(url, {headers: {Authorization: authHeader}})
        this.loading = false
        return res.data
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
        const endpoints = Object.keys(openapi.paths[path]).filter(item => REST_METHOD_REGEX.test(item)).map(op => {
          const endpoint = {
            key: (op + '-' + path),
            path: path,
            method: op,
            summary: (openapi.paths[path][op].summary || openapi.paths[path].summary),
            description: (openapi.paths[path][op].description || openapi.paths[path].description),
            operationId: (openapi.paths[path][op].operationId || (op + '-' + path.replace(/\//g, '-'))),
            'x-parameters': (openapi.paths[path][op]['x-parameters'] || openapi.paths[path]['x-parameters']),
            requestBody: openapi.paths[path][op].requestBody,
            responses: openapi.paths[path][op].responses,
            deprecated: openapi.paths[path].deprecated,
            servers: (openapi.paths[path][op].servers || openapi.paths[path].servers || openapi.servers)
          }

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

          return endpoint
        })

        pathMap[path] = {
          key: path,
          path: path,
          summary: openapi.paths[path].summary,
          description: openapi.paths[path].description,
          servers: openapi.paths[path].servers,
          endpoints: endpoints
        }
      })

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
  .md-layout-item.menu-bar {
    min-width: 250px;
    max-width: 250px;
  }

  .api-reference-wrap .md-toolbar h3.md-title {
    margin-right: 20px;
  }

  .md-drawer {
    min-width: 250px;
    max-width: 250px;
    background-color: #fafafa;
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: rgba(0,0,0,0.12);
    position: sticky;
    top: 0;
    height: calc(100vh - 96px);
  }
</style>
