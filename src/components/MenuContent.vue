<template>
  <div class="menu-content">
    <md-list>
      <md-list-item>
        <!--<md-icon>move_to_inbox</md-icon>-->
        <span class="md-list-item-text">Introduction</span>
      </md-list-item>
      <md-list-item>
        <!-- <md-icon>send</md-icon> -->
        <span class="md-list-item-text">Authentication</span>
      </md-list-item>
    </md-list>
    <MenuResourceGroup v-for="group in tree" :name="group.name" :title="group.title || group.menuTitle" :resources="group.resources" :key="group.key"></MenuResourceGroup>
  </div>
</template>

<script>
import MenuResourceGroup from '@/components/MenuResourceGroup'
export default {
  name: 'MenuContent',
  components: {MenuResourceGroup},
  props: ['tree'],

  created() {
    // console.log(this.tree)
  }
}
</script>

<style lang="scss" scoped>
</style>
