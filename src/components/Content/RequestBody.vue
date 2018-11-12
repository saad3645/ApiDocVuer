<template>
  <div class="request-body">
    <span class="md-headline">Request Body</span>
    <md-table>
      <md-table-row>
        <md-table-head>Parameter</md-table-head>
        <md-table-head>Type</md-table-head>
        <md-table-head>Description</md-table-head>
      </md-table-row>
      <md-table-row>
        <md-table-cell>1</md-table-cell>
        <md-table-cell>Shawna Dubbin</md-table-cell>
        <md-table-cell>sdubbin0@geocities.com</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>2</md-table-cell>
        <md-table-cell>Odette Demageard</md-table-cell>
        <md-table-cell>odemageard1@spotify.com</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>3</md-table-cell>
        <md-table-cell>Vera Taleworth</md-table-cell>
        <md-table-cell>vtaleworth2@google.ca</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Parameters from '@/components/Content/Parameters'
export default {
  name: 'MenuEndpoint',
  components: {Parameters},
  props: ['operationId', 'method', 'path', 'summary', 'description', 'parameters', 'requestBody', 'responses', 'deprecated', 'security', 'servers'],
  data: () => ({
  }),

  methods: {
    go() {
      console.log('go')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
