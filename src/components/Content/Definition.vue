<template>
  <section class="resource-endpoint">
    <div class="endpoint-info">
      <h2 v-if="summary" class="endpoint-summary">{{summary}}</h2>
      <div class="endpoint-definition" @click="toggleDefinitionExpand">
        <span class="endpoint-method" :class="method.toLowerCase()">{{method}}</span>
        <span class="endpoint-path">{{path}}</span>
        <md-icon>{{definitionExpandedIcon}}</md-icon>
      </div>
      <div v-if="definitionExpanded">
        <EndpointServer v-for="server in servers" :url="server.url" :description="server.description" :key="server.url"></EndpointServer>
      </div>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
    </div>
    <Parameters v-if="parameters && parameters.path" :paramsType="'path'" :params="parameters[path]"></Parameters>
    <Parameters v-if="parameters && parameters.header" :paramsType="'header'" :params="parameters[header]"></Parameters>
    <Parameters v-if="parameters && parameters.query" :paramsType="'query'" :params="parameters[query]"></Parameters>
    <RequestBody v-if="requestBody && (requestBody.description || requestBody.content)" :description="requestBody.description" :content="requestBody.content"></RequestBody>
    <Responses :responses="responses"></Responses>
  </section>
</template>

<script>
import Parameters from '@/components/Content/Parameters'
import RequestBody from '@/components/Content/RequestBody'
import Responses from '@/components/Content/Responses'
export default {
  name: 'MenuEndpoint',
  components: {Parameters, RequestBody, Responses},
  props: ['operationId', 'method', 'path', 'summary', 'description', 'parameters', 'requestBody', 'responses', 'deprecated', 'security', 'servers'],
  data: () => ({
    definitionExpanded: false
  }),

  computed: {
    definitionExpandedIcon() {
      return (this.definitionExpanded ? 'expand_less' : 'expand_more')
    }
  },

  methods: {
    toggleDefinitionExpand() {
      this.definitionExpanded = !this.definitionExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
  .endpoint-info {
    padding: 0px 40px 40px;
    text-align: left;
  }

  .endpoint-summary {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 22px;
  }

  .endpoint-definition {
    background-color: #f0f0f0;
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }

  .endpoint-definition:hover {
    cursor: pointer;
  }

  .endpoint-definition .endpoint-method {
    font-family: Montserrat, sans-serif;
    font-size: 13px;
    font-weight: 400;
    padding: 3px 10px;
    vertical-align: middle;
    text-transform: uppercase;
  }

  .endpoint-definition .endpoint-path {
    font-family: Montserrat, sans-serif;
    line-height: 1.5;
    margin-left: 15px;
    vertical-align: middle;
    flex: 1;
  }

  .endpoint-definition .endpoint-method.get,
  .endpoint-definition .endpoint-method.GET {
    background-color: #61c000;
    color: #ffffff;
  }

  .endpoint-definition .endpoint-method.post,
  .endpoint-definition .endpoint-method.POST {
    background-color: #fe7f25;
    color: #ffffff;
  }
</style>
