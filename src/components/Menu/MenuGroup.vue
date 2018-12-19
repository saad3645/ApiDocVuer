<template>
  <md-list md-expand-single class="menu-group">
    <md-list-item v-if="title || name" class="group-heading">
      <span class="md-list-item-text group-title">{{displayName}}</span>
    </md-list-item>
    <MenuResource v-for="resource in resourceList" :name="resource.name" :title="resource.title || resource['x-title']" :path="resource.path" :endpoints="resource.endpoints" :key="resource.key"></MenuResource>
  </md-list>
</template>

<script>
import MenuResource from '@/components/Menu/MenuResource'
export default {
  name: 'MenuResourceGroup',
  components: {MenuResource},
  props: ['name', 'title', 'resources'],

  data: () => ({
    resourceList: null
  }),

  created() {
    this.resourceList = this.resources.filter(r => r.endpoints && r.endpoints.length > 0)
  },

  computed: {
    displayName() {
      return (this.title || this.name)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-group .group-title {
    font-family: Montserrat, sans-serif;
    font-size: 13px;
    color: #999999;
    text-transform: uppercase;
  }
</style>

<style>
  .group-heading .md-list-item-content.md-disabled {
    min-height: 22px;
  }
</style>
