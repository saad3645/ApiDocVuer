<template>
  <div class="app-main-layout">
    <md-app md-mode="reveal">
      <Navbar slot="md-app-toolbar"></Navbar>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'MainLayout',
  components: {Navbar}
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
