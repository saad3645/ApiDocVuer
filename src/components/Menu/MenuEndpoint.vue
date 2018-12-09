<template>
  <md-list-item class="menu-endpoint-item" @click="scrollTo(operationId)">
    <span class="endpoint-method" :class="method.toLowerCase()"><span>{{method}}</span></span>
    <span class="md-list-item-text endpoint-summary">{{summary || path}}</span>
  </md-list-item>
</template>

<script>
import VueScrollTo from 'vue-scrollto'
export default {
  name: 'MenuEndpoint',
  props: ['operationId', 'method', 'path', 'summary'],
  data: () => ({
  }),

  methods: {
    scrollTo(operationId) {
      const element = '#' + operationId
      VueScrollTo.scrollTo(element, 600, {container: '.md-app-scroller'})
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-endpoint-item {
    background-color: #fafafa;
  }

  .endpoint-method {
    min-width: 48px;
  }

  .endpoint-method span {
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;
    font-family: Montserrat, sans-serif;
    font-size: 10.5px;
    color: #ffffff;
    padding: 2px 2px;
    text-transform: uppercase;
  }

  .endpoint-method.get span,
  .endpoint-method.GET span {
    background-color: #c0e69a;
    border-color: #c0e69a;
    color: #4f9c00;
  }

  .endpoint-method.post span,
  .endpoint-method.POST span {
    background-color: #9ab1f8;
    border-color: #9ab1f8;
    color: #0030c0;
  }

  .endpoint-method.put span,
  .endpoint-method.PUT span {
    background-color: #ffe5d3;
    border-color: #ffe5d3;
    color: #fe7f25;
  }

  .endpoint-method.patch span,
  .endpoint-method.PATCH span {
    background-color: #a593f8;
    border-color: #a593f8;
    color: #5d00b9;
  }

  .endpoint-method.delete span,
  .endpoint-method.DELETE span {
    background-color: #f8b19a;
    border-color: #f8b19a;
    color: #c03000;
  }

  .endpoint-method.options,
  .endpoint-method.OPTIONS {
    background-color: #009c5a;
    border-color: #009c5a;
  }

  .endpoint-summary {
    font-family: Montserrat, sans-serif;
    font-size: 12.5px;
    color: #333333;
  }
</style>
