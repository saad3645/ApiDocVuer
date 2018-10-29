<template>
  <div class="md-toolbar-section-end">
    <md-tabs md-sync-route class="md-primary" md-alignment="right">
      <md-tab id="tab-docs" md-label="Docs" :md-disabled="!docsTab"></md-tab>
      <md-tab id="tab-collections" md-label="Collections" :to="{name: 'Collections', params: {apidoc: apidoc}}" :md-disabled="!collectionsTab"></md-tab>
      <md-tab id="tab-reference" md-label="Reference" :to="{name: 'ApiReference', params: {apidoc: apidoc}}" :md-disabled="!referenceTab"></md-tab>
      <md-tab id="tab-teams" md-label="Team" :md-disabled="!teamsTab"></md-tab>
    </md-tabs>
    <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
  </div>
</template>

<script>
export default {
  name: 'NavbarContent',
  props: {
    docsTab: {
      type: Boolean,
      default: true
    },
    collectionsTab: {
      type: Boolean,
      default: false
    },
    referenceTab: {
      type: Boolean,
      default: false
    },
    teamsTab: {
      type: Boolean,
      default: true
    },
    user: Object,
    apidoc: String
  },
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
</style>
