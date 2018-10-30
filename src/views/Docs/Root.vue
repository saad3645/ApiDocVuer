<template>
  <div class="app-root">
    <md-app md-mode="reveal">
      <NavbarContent slot="md-app-toolbar"></NavbarContent>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import NavbarContent from '@/components/NavbarContent'
export default {
  name: 'DocsRoot',
  components: {NavbarContent}
}
</script>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
  }

  .md-app-content {
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
