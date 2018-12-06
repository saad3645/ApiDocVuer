<template>
  <md-table-row class="md-layout">
    <md-table-cell class="md-layout-item md-size-30" :class="'level-' + level">
      <div class="parameter-name" :class="parameterClickableClass(schema)" @click="toggleChildren()">
        <span>{{name}}</span>
        <md-icon v-if="schema.type === 'object' || (schema.type === 'array' && schema.items && schema.items.type && schema.items.type === 'object')">{{display.expanded ? 'expand_less' : 'expand_more'}}</md-icon>
      </div>
      <div v-if="required" class="required">
        <span>required</span>
      </div>
    </md-table-cell>
    <md-table-cell class="md-layout-item md-size-20">
      <div class="type">
        <span>{{schema.type}}</span>
        <span v-if="schema.type === 'string' && schema.format"> ({{schema.format}})</span>
        <span v-if="schema.type === 'array' && schema.items && schema.items.type"> of {{schema.items.type}}</span>
        <span v-if="schema.type === 'object' && schema.title"> ({{schema.title}})</span>
      </div>
    </md-table-cell>
    <md-table-cell class="md-layout-item description">{{schema.description}}</md-table-cell>
  </md-table-row>
</template>

<script>
export default {
  name: 'ParameterItem',
  props: ['name', 'required', 'level', 'schema', 'display'],

  data: () => ({
  }),

  methods: {
    parameterClickableClass(schema) {
      if (schema.type === 'array' && schema.items && schema.items.type && schema.items.type === 'object') {
        return 'array-object'
      }
      else {
        return schema.type
      }
    },

    toggleChildren() {
      this.display.expanded = !this.display.expanded
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-table.md-theme-default .md-table-row:hover:not(.md-header-row) .md-table-cell {
    background-color: #ffffff;
  }

  .md-table-cell.level-1 {
    padding-left: 10px;
  }

  .md-table-cell.level-2 {
    padding-left: 20px;
  }

  .parameter-name {
    font-family: Courier, monospace;
    font-size: 13px;
  }

  .parameter-name.object:hover,
  .parameter-name.array-object:hover {
    cursor: pointer;
  }

  .parameter-name .md-icon {
    font-size: 15px !important;
    height: 15px;
    width: 15px;
  }

  .required {
    margin-top: 2px;
    color: #e53939;
  }

  .type {
    color: #808080;
  }
</style>
