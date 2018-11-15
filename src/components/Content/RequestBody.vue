<template>
  <div class="request-body">
    <div class="md-layout request-body-heading">
      <div class="md-layout-item rb-title"><h4 class="title">Request Body</h4></div>
      <div class="md-layout-item rb-media-type">
        <md-menu md-size="medium">
          <md-button md-menu-trigger class="md-dense">{{selectedMediaType}}</md-button>
          <md-menu-content>
            <md-menu-item v-for="mt in mediaTypes" :key="mt">{{mt}}</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </div>
    <md-divider class="heading-divider"></md-divider>
    <md-table>
      <md-table-row class="md-layout">
        <md-table-head class="md-layout-item md-size-30">Parameter</md-table-head>
        <md-table-head class="md-layout-item md-size-20">Type</md-table-head>
        <md-table-head class="md-layout-item">Description</md-table-head>
      </md-table-row>
      <md-table-row v-for="prop in schema[selectedMediaType]" :key="prop.name" v-if="prop.parent === null || schema[selectedMediaType][prop.parent].expanded" class="md-layout">
        <md-table-cell class="md-layout-item md-size-30 parameter-cell">{{prop.name}}</md-table-cell>
        <md-table-cell class="md-layout-item md-size-20">
          <div class="type-cell">{{prop.type}}</div>
          <div v-if="prop.format" class="format-cell">{{prop.format}}</div>
        </md-table-cell>
        <md-table-cell class="md-layout-item description-cell">{{prop.description}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Parameters from '@/components/Content/Parameters'
export default {
  name: 'RequestBody',
  components: {Parameters},
  props: ['description', 'bodyContent'],

  data: () => ({
    mediaTypes: null,
    selectedMediaType: null,
    schema: null
  }),

  created() {
    this.mediaTypes = Object.keys(this.bodyContent)
    this.selectedMediaType = this.mediaTypes[0]
    this.schema = this.buildContentSchema(this.mediaTypes, this.bodyContent)
  },

  methods: {
    buildContentSchema(mediaTypes, content) {
      return mediaTypes.reduce((schema, mediaType) => {
        schema[mediaType] = this.flattenProperties(content[mediaType].schema, null, 0)
        return schema
      }, {})
    },

    flattenProperties(node, nodeIndex, nodeLevel) {
      return Object.keys(node.properties).reduce((props, prop, index) => {
        props.push(Object.assign(
          {
            name: prop,
            parent: nodeIndex,
            expanded: false,
            isRequired: (node.required && Array.isArray(node.required) && node.required.indexOf(prop) !== -1)
          }, node.properties[prop]
        ))

        if (node.properties[prop].type === 'object' && nodeLevel < 2) {
          const propsArray = this.flattenProperties(node.properties[prop], (props.length - 1), (nodeLevel + 1))
          return props.concat(propsArray)
        }
        else {
          return props
        }
      }, [])
    },

    selectMediaType(mediaType) {
      this.selectedMediaType = mediaType
    }
  }
}
</script>

<style lang="scss" scoped>
  .request-body {
    padding: 40px 0px 40px;
  }

  .request-body-heading {
    align-items: center;
  }

  .heading-divider {
    margin-bottom: 15px;
  }

  .rb-title {
    flex: 0;
    min-width: 160px;
  }
  .request-body .title {
    font-size: 16px;
    font-weight: 400;
    color: #263238;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    text-transform: uppercase;
  }

  .md-table.md-theme-default .md-table-row:hover:not(.md-header-row) .md-table-cell {
    background-color: #ffffff;
  }

  .parameter-cell {
    font-family: Courier, monospace;
    font-size: 13px;
  }

  .type-cell {
    color: #808080;
  }
</style>
