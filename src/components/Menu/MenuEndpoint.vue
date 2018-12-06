<template>
  <md-list-item class="menu-endpoint-item" @click="go()">
    <span class="endpoint-method" :class="method.toLowerCase()"><span>{{method}}</span></span>
    <span class="md-list-item-text endpoint-summary">{{summary || path}}</span>
  </md-list-item>
</template>

<script>
export default {
  name: 'MenuEndpoint',
  props: ['operationId', 'method', 'path', 'summary'],
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
    padding: 1px 3px;
    text-transform: uppercase;
  }

  .endpoint-method.get span,
  .endpoint-method.GET span {
    background-color: #61c000;
    border-color: #61c000;
  }

  .endpoint-method.post span,
  .endpoint-method.POST span {
    background-color: #003bed;
    border-color: #003bed;
  }

  .endpoint-method.put span,
  .endpoint-method.PUT span {
    /*border-color: #9ab1f8;*/
    background-color: #FE8F40;
    border-color: #FE8F40;
  }

  .endpoint-method.patch span,
  .endpoint-method.PATCH span {
    background-color: #5d00b9;
    border-color: #5d00b9;
  }

  .endpoint-method.delete span,
  .endpoint-method.DELETE span {
    background-color: #ed3b00;
    border-color: #ed3b00;
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
