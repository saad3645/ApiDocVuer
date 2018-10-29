<template>
  <md-list-item md-expand class="menu-tag-item">
    <span class="md-list-item-text">{{name}}</span>
    <md-list slot="md-expand">
      <md-list-item v-for="endpoint in endpoints" class="md-inset" :key="endpoint.operationId">
        <span class="md-list-item-text">{{endpoint.method}}</span>
        <span class="md-list-item-text">{{endpoint.path}}</span>
      </md-list-item>
    </md-list>
  </md-list-item>
</template>

<script>

export default {
  name: 'MenuGroup',
  props: {
    name: String,
    endpoints: Array
  },
  data: () => ({
    source: {
      openapi: '3.0.0',
      info: {
        title: 'GrabX',
        version: '1.1.0'
      }
    },
    treeOptions: {
      maxDepth: 3
    }
  })
}
</script>

<style lang="scss" scoped>
</style>
