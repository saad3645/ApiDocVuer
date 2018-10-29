<template>
  <div class="menu-group">
    <md-list :md-expand-single="true">
      <md-list-item v-if="!isDefault">
        <span class="md-list-item-text">{{name}}</span>
      </md-list-item>
      <MenuTagItem v-for="tag in tags" :name="tag.name" :endpoints="tag.endpoints" :key="tag.key"></MenuTagItem>
    </md-list>
  </div>
</template>

<script>
import MenuTagItem from '@/components/MenuTagItem'
export default {
  name: 'MenuGroup',
  components: {MenuTagItem},
  props: {
    name: String,
    isDefault: Boolean,
    tags: Array
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
