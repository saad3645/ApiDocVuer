<template>
  <md-app-toolbar class="md-primary">
    <span class="md-title">Invariant Telecom</span>
    <div class="md-toolbar-section-end">
      <md-button class="md-primary">Create</md-button>
      <md-button class="md-primary" @click="gotoDocs">Docs</md-button>
      <md-button class="md-primary" @click="gotoCollections">Collections</md-button>
      <md-button class="md-primary" @click="gotoTeam">Team</md-button>
      <md-button class="md-icon-button"><md-icon>account_circle</md-icon></md-button>
    </div>
  </md-app-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    user: null
  }),

  methods: {
    gotoDocs() {
      console.log('goto docs')
    },
    gotoCollections() {
      console.log('goto collections')
    },
    gotoTeam() {
      console.log('goto team')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
