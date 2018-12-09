<template>
  <div class="api-reference-wrap">
    <md-progress-bar md-mode="indeterminate" v-if="loading" />
    <div v-if="openapi" class="md-layout">
      <div class="md-layout-item menu-bar">
        <md-drawer md-fixed md-permanent="clipped" class="md-scrollbar">
          <md-list>
            <md-list-item>
              <span class="md-list-item-text">Introduction</span>
            </md-list-item>
          </md-list>
          <MenuGroup v-for="group in contentTree" :name="group.name" :title="group.title || group.menuTitle" :resources="group.resources" :key="group.key"></MenuGroup>
        </md-drawer>
      </div>
      <div class="md-layout-item api-reference">
        <md-content id="api-content" class="api-content">
          <ContentGroup v-for="group in contentTree" :name="group.name" :title="group.title" :description="group.description" :resources="group.resources" :key="group.key"></ContentGroup>
        </md-content>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MenuGroup from '@/components/Menu/MenuGroup'
import ContentGroup from '@/components/Content/ContentGroup'
import Ajv from 'ajv'

import schemaDefSchema from '../../assets/schemas/openapi_3.0.x/schema_def.schema.json'
import serversSchema from '../../assets/schemas/openapi_3.0.x/servers.schema.json'
import parametersSchema from '../../assets/schemas/openapi_3.0.x/parameters.schema.json'
import contentSchema from '../../assets/schemas/openapi_3.0.x/content.schema.json'
import tagsSchema from '../../assets/schemas/openapi_3.0.x/tags.schema.json'
import openapiSchema from '../../assets/schemas/openapi_3.0.x/openapi.schema.json'

const ajv = new Ajv()
const REST_METHOD_REGEX = /^(get|post|put|patch|delete|options|head)$/i

export default {
  name: 'Reference',
  components: {MenuGroup, ContentGroup},
  data: () => ({
    appId: null,
    docId: null,
    version: null,
    docs: null,
    collections: null,
    openapi: null,
    openapiSpecVersion: null,
    contentTree: null,
    loading: false
  }),

  async created() {
    this.appId = this.$route.params.appId
    this.docId = this.$route.params.docId
    this.version = this.$route.params.version
    this.branch = this.$route.params.branch ? this.$route.params.branch : 'master'
    this.docs = this.$route.params.docs

    this.openapi = await this.getOpenApi(this.appId, this.docId, this.version, this.branch)
    const validate = ajv.addSchema([schemaDefSchema, serversSchema, parametersSchema, contentSchema, tagsSchema]).compile(openapiSchema)
    if (validate(this.openapi)) {
      this.openapiSpecVersion = this.openapi.openapi
      this.contentTree = this.buildContentTree(this.openapi)
    }
    else {
      console.log(validate.errors)
    }

    this.collections = this.getCollections
  },

  methods: {
    async getOpenApi(appId, docId, version, branch) {
      if (!localStorage.token || !localStorage.token_expires_at || Math.ceil(Date.now() / 1000) >= localStorage.token_expires_at) {
        this.$router.push({name: 'Login'})
        return
      }

      const url = process.env.VUE_APP_API_BASE_URL + 'docs/' + appId + '.' + docId + '?version=' + version + '&branch=' + branch
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

    mergeParameters(parameters) {
      if (parameters) {
        const cache = {}
        return parameters.reduce((obj, param) => {
          if (param && param.name && param.in && !cache[param.name + param.in]) {
            if (!obj[param.in]) {
              obj[param.in] = []
            }
            obj[param.in].push(param)
            cache[param.name + param.in] = true
          }
          return obj
        }, {})
      }
      else {
        return null
      }
    },

    mergeServers(servers) {
      if (servers) {
        const cache = {}
        return servers.filter((item) => {
          if (typeof item === 'object' && item !== null && !cache[item.url]) {
            cache[item.url] = true
            return true
          }
          else {
            return false
          }
        })
      }
      else {
        return null
      }
    },

    buildContentTree(openapi) {
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
            operationId: (openapi.paths[path][op].operationId || btoa(op + '-' + path).replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]{1,2}$/, '')),
            parameters: this.mergeParameters(openapi.paths[path].parameters ? openapi.paths[path].parameters.concat(openapi.paths[path][op].parameters) : openapi.paths[path][op].parameters),
            requestBody: openapi.paths[path][op].requestBody,
            responses: openapi.paths[path][op].responses,
            deprecated: openapi.paths[path][op].deprecated,
            servers: this.mergeServers(openapi.servers ? openapi.servers.concat(openapi.paths[path].servers, openapi.paths[path][op].servers) : (openapi.paths[path].servers ? openapi.paths[path].servers.concat(openapi.paths[path][op].servers) : openapi.paths[path][op].servers))
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
    height: calc(100vh - 64px);
  }

  .md-drawer .md-list {
    background-color: #fafafa;
  }
</style>
