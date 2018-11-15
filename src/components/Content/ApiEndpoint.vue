<template>
  <section class="api-endpoint">
    <div class="endpoint-info">
      <h2 v-if="summary" class="endpoint-summary">{{summary}}</h2>
      <div class="endpoint-definition" @click="toggleDefinitionExpand">
        <span class="endpoint-method" :class="method.toLowerCase()">{{method}}</span>
        <span class="endpoint-path">{{path}}</span>
        <md-icon>{{definitionExpandedIcon}}</md-icon>
      </div>
      <transition enter-class="rollInDownEnter" enter-active-class="rollInDownActive" leave-active-class="rollOutUpActive">
        <div v-if="definitionExpanded" class="endpoint-servers">
          <EndpointServer v-for="server in servers" :path="path" :url="server.url" :description="server.description" :key="server.url"></EndpointServer>
        </div>
      </transition>
      <div v-if="description" class="markdown">
        <p>{{description}}</p>
      </div>
    </div>
    <Parameters v-if="parameters && parameters.path" :paramsType="'path'" :params="parameters[path]"></Parameters>
    <Parameters v-if="parameters && parameters.header" :paramsType="'header'" :params="parameters[header]"></Parameters>
    <Parameters v-if="parameters && parameters.query" :paramsType="'query'" :params="parameters[query]"></Parameters>
    <RequestBody v-if="requestBody && (requestBody.description || requestBody.content)" :description="requestBody.description" :bodyContent="requestBody.content"></RequestBody>
    <Responses :responses="responses"></Responses>
  </section>
</template>

<script>
import EndpointServer from '@/components/Content/EndpointServer'
import Parameters from '@/components/Content/Parameters'
import RequestBody from '@/components/Content/RequestBody'
import Responses from '@/components/Content/Responses'
export default {
  name: 'ApiEndpoint',
  components: {EndpointServer, Parameters, RequestBody, Responses},
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
  .api-endpoint {
    padding: 0px 40px 40px;
    text-align: left;
  }

  .endpoint-info {
    position: relative;
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

  .endpoint-servers {
    background-color: #fafafa;
    position: absolute;
    width: calc(100% - 80px);
    box-shadow: rgba(0, 0, 0, 0.33) 0px 0px 6px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .rollInDownEnter {
    transform: translateY(-50%) scaleY(0);
  }

  .rollInDownActive {
    transition: all 0.5s ease-in-out;
  }

  .rollOutUpActive {
    transform: translateY(-50%) scaleY(0);
    transition: all 0.5s ease-in-out;
  }
</style>