<template>
  <div class="menu-resource-item">
    <md-list :md-expand-single="true">
      <md-list-item v-if="!isDefault">
        <span class="md-list-item-text">{{name}}</span>
      </md-list-item>
      <MenuEndpoint v-for="endpoint in endpoints" :operationId="endpoint.operationId" :method="endpoint.method" :path="endpoint.path" :summary="endpoint.summary" :key="endpoint.operationId"></MenuEndpoint>
    </md-list>
  </div>
</template>

<script>
import MenuEndpoint from '@/components/MenuEndpoint'
export default {
  name: 'MenuResource',
  components: {MenuEndpoint},
  props: ['name', 'title', 'path', 'endpoints'],
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
</style>
