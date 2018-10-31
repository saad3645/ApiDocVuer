<template>
  <div class="menu-group">
    <md-list :md-expand-single="true">
      <md-list-item>
        <span class="md-list-item-text">{{title || name}}</span>
      </md-list-item>
      <MenuResource v-for="resource in resources" :name="resource.name" :title="resource.title" :path="resource.path" :endpoints="resource.endpoints" :key="resource.key"></MenuResource>
    </md-list>
  </div>
</template>

<script>
import MenuResource from '@/components/MenuResource'
export default {
  name: 'MenuResourceGroup',
  components: {MenuResource},
  props: ['name', 'title', 'resources'],
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
</style>
