<template>
  <div class="resource">
    <span v-if="title" class="md-display-3">{{title}}</span>
    <div v-if="description">
      <p>{{description}}</p>
    </div>
    <Definition v-for="endpoint in endpoints" :operationId="endpoint.operationId" :method="endpoint.method" :path="endpoint.path" :summary="endpoint.summary" :description="endpoint.description" :parameters="{path: endpoint['x-pathParameters'], header: endpoint['x-headerParameters'], query: endpoint['x-queryParameters']}" :requestBody="endpoint.requestBody" :responses="endpoint.responses" :deprecated="endpoint.deprecated" :security="endpoint.security" :servers="endpoint.servers" :key="endpoint.operationId"></Definition>
  </div>
</template>

<script>
import Definition from '@/components/Content/Definition'
export default {
  name: 'Resource',
  components: {Definition},
  props: ['name', 'title', 'path', 'description', 'endpoints'],

  data: () => ({
  }),

  created() {
    // console.log(this.endpoints)
  },

  computed: {
    displayName() {
      return (this.title || this.name || this.path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-list {
    padding-top: 0px;
  }
</style>
