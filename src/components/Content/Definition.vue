<template>
  <section class="definition">
    <span class="md-display-2">Display 2</span>
    <div v-if="description">
      <p>{{description}}</p>
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
