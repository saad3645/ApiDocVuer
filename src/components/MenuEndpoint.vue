<template>
  <md-list-item md-expand class="menu-endpoint-item">
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
  name: 'MenuEndpoint',
  props: ['operationId', 'method', 'path', 'summary'],
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
</style>
