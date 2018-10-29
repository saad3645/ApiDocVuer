<template>
  <div class="md-toolbar-section-end">
    <md-tabs md-sync-route class="md-primary" md-alignment="right">
      <md-tab id="tab-reference" md-label="Reference" :md-disabled="!docsTab"></md-tab>
      <md-tab id="tab-collections" md-label="Collections" :md-disabled="!docsTab"></md-tab>
    </md-tabs>
    <md-button class="md-primary">Create</md-button>
    <md-button class="md-primary" @click="gotoDocs">Docs</md-button>
    <md-button class="md-primary">Team</md-button>
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
    }
  },
  data: () => ({
    user: null
  }),

  methods: {
    gotoDocs() {
      this.docsTab = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
