<template>
  <md-content class="content-group">
    <span v-if="title" class="md-display-3">{{title}}</span>
    <div v-if="description">
      <p>{{description}}</p>
    </div>
    <ApiResource v-for="resource in resources" :name="resource.name" :title="resource.title || resource['x-title']" :path="resource.path" :description="resource.description" :endpoints="resource.endpoints" :key="resource.key"></ApiResource>
  </md-content>
</template>

<script>
import ApiResource from '@/components/Content/ApiResource'

export default {
  name: 'ContentGroup',
  components: {ApiResource},

  props: ['name', 'title', 'description', 'resources'],

  data: () => ({
  }),

  created() {
    // console.log(this.resources)
  }
}
</script>

<style lang="scss" scoped>
  .md-layout-item.menu-bar {
    min-width: 250px;
    max-width: 250px;
  }

  .api-reference-wrap .md-toolbar h3.md-title {
    margin-right: 20px;
  }

  .md-drawer {
    min-width: 250px;
    max-width: 250px;
    background-color: #fafafa;
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: rgba(0,0,0,0.12);
    position: sticky;
    top: 0;
    height: calc(100vh - 112px);
  }
</style>
