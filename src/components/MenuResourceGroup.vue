<template>
  <md-list md-expand-single class="menu-group">
    <md-list-item v-if="title || name">
      <span class="md-list-item-text">{{displayName}}</span>
    </md-list-item>
    <MenuResource v-for="resource in resources" :name="resource.name" :title="resource.title" :path="resource.path" :endpoints="resource.endpoints" :key="resource.key"></MenuResource>
  </md-list>
</template>

<script>
import MenuResource from '@/components/MenuResource'
export default {
  name: 'MenuResourceGroup',
  components: {MenuResource},
  props: ['name', 'title', 'resources'],

  data: () => ({
  }),

  created() {
    // console.log(this.resources)
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
