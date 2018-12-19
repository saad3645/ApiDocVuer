<template>
  <div class="parameters">
    <div class="parameters-heading">
      <h4 class="title">{{paramsType}} Parameters</h4>
    </div>
    <md-divider></md-divider>
    <md-table>
      <md-table-row class="md-layout">
        <md-table-head class="md-layout-item md-size-30">Parameter</md-table-head>
        <md-table-head class="md-layout-item md-size-20">Type</md-table-head>
        <md-table-head class="md-layout-item">Description</md-table-head>
      </md-table-row>
      <ParameterItem v-for="param in params" v-if="!param.parent || param.parent.display.expanded" :key="param.name" :name="param.name" :required="param.required" :level="param.level || 0" :schema="param.schema" :display="param.display"></ParameterItem>
    </md-table>
  </div>
</template>

<script>
import ParameterItem from '@/components/Content/ParameterItem'
export default {
  name: 'Parameters',
  components: {ParameterItem},
  props: ['paramsType', 'parameters'],

  data: () => ({
  }),

  created() {
    this.params = this.flatMap(this.parameters)
  },

  methods: {
    flatMap(parameters) {
      return parameters.reduce((params, p) => {
        const param = Object.assign({level: 0, display: {expanded: false}}, p)
        params.push(param)

        if (param.schema && param.schema.type === 'object') {
          const params2 = this.flattenParameters(param.schema, param, 1)
          return params.concat(params2)
        }
        else {
          return params
        }
      }, [])
    },

    flattenParameters(node, parent, level) {
      return Object.keys(node.properties).reduce((props, name) => {
        const param = {
          name: name,
          parent: parent,
          required: (node.required && Array.isArray(node.required) && node.required.indexOf(name) !== -1),
          level: level,
          schema: node.properties[name],
          display: {expanded: false}
        }

        props.push(param)

        if (node.properties[name].type === 'object' && level < 2) {
          const props2 = this.flattenParameters(node.properties[name], param, (level + 1))
          return props.concat(props2)
        }
        else {
          return props
        }
      }, [])
    }
  }
}
</script>

<style lang="scss" scoped>
  .parameters {
    padding: 20px 0px 20px;
  }

  .heading-divider {
    margin-bottom: 15px;
  }

  .parameters-heading .title {
    font-size: 16px;
    font-weight: 400;
    color: #263238;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    text-transform: uppercase;
  }
</style>
