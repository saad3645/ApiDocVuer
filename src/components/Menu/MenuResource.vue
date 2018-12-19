<template>
  <md-list-item md-expand class="menu-resource-item">
    <span class="md-list-item-text resource-heading">{{displayName}}</span>
    <md-list slot="md-expand">
      <MenuEndpoint v-for="endpoint in endpoints" :operationId="endpoint.operationId" :method="endpoint.method" :path="endpoint.path" :summary="endpoint.summary" :key="endpoint.operationId"></MenuEndpoint>
    </md-list>
  </md-list-item>
</template>

<script>
import MenuEndpoint from '@/components/Menu/MenuEndpoint'
export default {
  name: 'MenuResource',
  components: {MenuEndpoint},
  props: ['name', 'title', 'path', 'endpoints'],

  data: () => ({
  }),

  created() {
    // console.log(this.endpoints)
  },

  computed: {
    displayName() {
      return (this.title || this.name || this.path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-resource-item {
    background-color: #fafafa;
  }

  .md-list {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .md-list-item-expand {
    border-top: none;
    border-bottom: none;
  }

  .resource-heading {
    font-family: Montserrat, sans-serif;
    font-size: 13px;
  }

  .resource-heading:hover {
    color: #3232a0;
  }
</style>
