<template>
  <div class="api-resource">
    <div class="resource-info">
      <h1 v-if="title" class="md-primary resource-title">{{title || path}}</h1>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
    </div>
    <div v-for="endpoint in endpoints" :key="endpoint.operationId">
      <md-divider></md-divider>
      <ApiEndpoint  :operationId="endpoint.operationId" :method="endpoint.method" :path="endpoint.path" :summary="endpoint.summary" :description="endpoint.description" :parameters="endpoint.parameters" :requestBody="endpoint.requestBody" :responses="endpoint.responses" :deprecated="endpoint.deprecated" :security="endpoint.security" :servers="endpoint.servers"></ApiEndpoint>
    </div>
  </div>
</template>

<script>
import ApiEndpoint from '@/components/Content/ApiEndpoint'
export default {
  name: 'ApiResource',
  components: {ApiEndpoint},
  props: ['name', 'title', 'path', 'description', 'endpoints'],

  data: () => ({
  }),

  created() {
    // console.log(this.endpoints)
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
    color: #3232a0;
  }
</style>
