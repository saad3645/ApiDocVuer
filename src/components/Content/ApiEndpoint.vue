<template>
  <section :id="operationId" class="api-endpoint">
    <div class="endpoint-info">
      <h2 v-if="summary" class="endpoint-summary">{{summary}}</h2>
      <EndpointDefinition :method="method" :path="path" :servers="servers"></EndpointDefinition>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
    </div>
    <Parameters v-if="parameters && parameters.path" :paramsType="'path'" :parameters="parameters.path"></Parameters>
    <Parameters v-if="parameters && parameters.header" :paramsType="'header'" :parameters="parameters.header"></Parameters>
    <Parameters v-if="parameters && parameters.query" :paramsType="'query'" :parameters="parameters.query"></Parameters>
    <RequestBody v-if="requestBody && (requestBody.description || requestBody.content)" :description="requestBody.description" :bodyContent="requestBody.content"></RequestBody>
    <div class="responses">
      <div class="responses-heading">
        <h4 class="title">Responses</h4>
      </div>
      <Response v-for="response in responseList" :key="response.statusCode" :statusCode="response.statusCode" :description="response.description" :headers="response.headers" :responseContent="response.content"></Response>
    </div>
  </section>
</template>

<script>
import EndpointDefinition from '@/components/Content/EndpointDefinition'
import Parameters from '@/components/Content/Parameters'
import RequestBody from '@/components/Content/RequestBody'
import Response from '@/components/Content/Response'
export default {
  name: 'ApiEndpoint',
  components: {EndpointDefinition, Parameters, RequestBody, Response},
  props: ['operationId', 'method', 'path', 'summary', 'description', 'parameters', 'requestBody', 'responses', 'deprecated', 'security', 'servers'],
  data: () => ({
    responseList: null,
    definitionExpanded: false
  }),

  created() {
    this.responseList = this.flattenResponses(this.responses)
  },

  computed: {
    definitionExpandedIcon() {
      return (this.definitionExpanded ? 'expand_less' : 'expand_more')
    }
  },

  methods: {
    flattenResponses(responses) {
      return Object.keys(responses).map(statusCode => {
        return Object.assign({statusCode: statusCode}, responses[statusCode])
      })
    },

    toggleDefinitionExpand() {
      this.definitionExpanded = !this.definitionExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
  .api-endpoint {
    padding: 20px 40px 20px;
    text-align: left;
  }

  .endpoint-info {
    position: relative;
    padding-bottom: 20px;
  }

  .endpoint-summary {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 22px;
  }

  .responses {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .responses .responses-heading {
    padding-bottom: 15px;
  }

  .responses h4.title {
    font-size: 16px;
    font-weight: 400;
    color: #263238;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    text-transform: uppercase;
  }
</style>
