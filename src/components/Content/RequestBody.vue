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
    <md-divider></md-divider>
    <md-table>
      <md-table-row class="md-layout">
        <md-table-head class="md-layout-item md-size-30">Parameter</md-table-head>
        <md-table-head class="md-layout-item md-size-20">Type</md-table-head>
        <md-table-head class="md-layout-item">Description</md-table-head>
      </md-table-row>
      <ParameterItem v-for="param in schema[selectedMediaType]" v-if="!param.parent || param.parent.display.expanded" :key="param.name" :name="param.name" :required="param.required" :level="param.level" :schema="param.schema" :display="param.display"></ParameterItem>
    </md-table>
  </div>
</template>

<script>
import ParameterItem from '@/components/Content/ParameterItem'
export default {
  name: 'RequestBody',
  components: {ParameterItem},
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

    flattenProperties(node, parent, level) {
      return Object.keys(node.properties).reduce((props, name) => {
        const prop = {
          name: name,
          parent: parent,
          required: (node.required && Array.isArray(node.required) && node.required.indexOf(name) !== -1),
          level: level,
          schema: node.properties[name],
          display: {expanded: false}
        }

        props.push(prop)

        if (node.properties[name].type === 'object' && level < 2) {
          const props2 = this.flattenProperties(node.properties[name], prop, (level + 1))
          return props.concat(props2)
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
    padding: 20px 0px 20px;
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
</style>
