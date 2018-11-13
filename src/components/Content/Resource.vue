<template>
  <div class="resource">
    <div class="resource-info">
      <h1 v-if="title" class="md-primary resource-title">{{title || path}}</h1>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
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
  .resource-info {
    padding: 40px;
    text-align: left;
  }

  .resource-title {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 28px;
  }

  .md-primary.resource-title {
    color: rgb(50, 50, 159);
  }
</style>
