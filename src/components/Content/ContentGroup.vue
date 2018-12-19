<template>
  <md-content class="content-group">
    <div v-if="title || description" class="group-info">
      <h1 v-if="title" class="md-primary group-title">{{title}}</h1>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
    </div>
    <div v-if="description">
      <p>{{description}}</p>
    </div>
    <div v-for="resource in resources" :key="resource.key">
      <md-divider></md-divider>
      <ApiResource :name="resource.name" :title="resource.title || resource['x-title']" :path="resource.path" :description="resource.description" :endpoints="resource.endpoints"></ApiResource>
    </div>
  </md-content>
</template>

<script>
import ApiResource from '@/components/Content/ApiResource'

export default {
  name: 'ContentGroup',
  components: {ApiResource},
  props: ['name', 'title', 'description', 'resources'],

  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
  .group-info {
    padding: 40px 40px 10px;
    text-align: left;
  }

  .group-title {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 28px;
    text-transform: uppercase;
  }

  .md-primary.group-title {
    color: #999999;
  }
</style>
