<template>
  <div class="app-root">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Invariant Telecom</span>
        <NavbarContent :apidoc="apidoc"></NavbarContent>
      </md-app-toolbar>
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
  components: {NavbarContent},
  data: () => ({
    apidoc: null
  })
}
</script>

<style lang="scss" scoped>
  .md-app {
    height: 100vh;
  }
</style>
