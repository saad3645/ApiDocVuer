<template>
  <md-list md-expand-single class="menu-group">
    <md-list-item v-if="title || name">
      <span class="md-list-item-text">{{displayName}}</span>
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
</style>
