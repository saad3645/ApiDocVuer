<template>
  <md-list-item class="menu-endpoint-item">
    <span class="endpoint-method" :class="method.toLowerCase()">{{method}}</span>
    <span class="md-list-item-text">{{summary || path}}</span>
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
  .endpoint-method {
    text-transform: uppercase;
    margin-right: 12px;
  }
  .endpoint-method.get {
    color: #2aa754;
  }
</style>
