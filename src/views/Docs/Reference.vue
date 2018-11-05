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
        <MenuContent :tree="tree"></MenuContent>
      </md-drawer>
      <md-content>
        <code>{{JSON.stringify(source)}}</code>
      </md-content>
    </md-content>
  </div>
</template>

<script>
// import axios from 'axios'
import MenuContent from '@/components/Menu/MenuContent'

const REST_METHOD_REGEX = /^(get|post|put|patch|delete|options|head)$/i

export default {
  name: 'ApiDoc',
  components: {MenuContent},
  data: () => ({
    doc: null,
    docId: null,
    collectionName: null,
    collectionId: null,
    openapi: null,
    openapiSpecVersion: null,
    tree: null
  }),

  async created() {
    this.doc = this.$route.params.doc
    this.docId = this.$route.params.docId
    this.collectionName = this.$router.params.collection
    this.collectionId = this.$route.params.collectionId
    this.openapi = this.$route.params.openapi
    // this.source = await this.getOpenApi(this.docId)
    // validate this source object with openapi specification
    this.openapiSpecVersion = this.openapi.openapi
    this.tree = this.buildResourceTree(this.source)
  },

  methods: {
    buildResourceTree(source) {
      const tagMap = {}
      const pathMap = {}

      Object.keys(source.paths).forEach(path => {
        pathMap[path] = {
          key: path,
          path: path,
          summary: source.paths[path].summary,
          description: source.paths[path].description,
          servers: source.paths[path].servers,
          endpoints: []
        }

        Object.keys(source.paths[path]).filter(item => REST_METHOD_REGEX.test(item)).forEach(op => {
          const endpoint = Object.assign(
            {
              key: (op + '-' + path),
              path: path,
              method: op,
              summary: source.paths[path].summary,
              description: source.paths[path].description,
              servers: source.paths[path].servers,
              operationId: (op + '-' + path.replace(/\//g, '-'))
            }, source.paths[path][op]
          )

          if (source.paths[path][op].tags) {
            source.paths[path][op].tags.forEach(tag => {
              if (!tagMap[tag]) {
                tagMap[tag] = {
                  key: tag.name,
                  path: path,
                  summary: source.paths[path].summary,
                  description: source.paths[path].description,
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

      if (source['x-tagGroups']) {
        return source['x-tagGroups'].map(tgroup => Object.assign(tgroup, {key: tgroup.name, resources: tgroup.tags.map(tag => Object.assign(tag, tagMap[tag.name]))}))
      }
      else {
        const tree = [{key: 'root', menuTitle: (source['x-menuRoot'] && source['x-menuRoot'].title ? source['x-menuRoot'].title : null)}]
        if (source.tags) {
          tree[0].resources = source.tags.map(tag => Object.assign(tag, tagMap[tag.name]))
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
