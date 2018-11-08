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
  .endpoint-method {
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    font-family: Montserrat, sans-serif;
    font-size: 10.5px;
    padding: 1px 2px;
    text-transform: uppercase;
    margin-right: 12px;
    min-width: 42px;
    text-align: center;
  }

  .endpoint-method.get,
  .endpoint-method.GET {
    /*border-color: #c0e69a;*/
    background-color: #4f9c00;
    border-color: #4f9c00;
    color: #ffffff;
  }

  .endpoint-method.post,
  .endpoint-method.POST {
    /*border-color: #FFBF92;*/
    background-color: #fe964c;
    border-color: #fe964c;
    color: #ffffff;
  }

  .endpoint-method.put,
  .endpoint-method.PUT {
    /*border-color: #9ab1f8;*/
    background-color: #0090c0; /*#0030c0;*/
    border-color: #0090c0;
    color: #ffffff;
  }

  .endpoint-method.patch,
  .endpoint-method.PATCH {
    /*border-color: #a593f8;*/
    background-color: #5d00b9;
    color: #ffffff;
  }

  .endpoint-method.delete,
  .endpoint-method.DELETE {
    /*border-color: #f8b19a;*/
    background-color: #c03000;
    color: #ffffff;
  }

  .endpoint-method.options,
  .endpoint-method.OPTIONS {
    /*border-color: #d3ca12;*/
    background-color: #d3ca12;
    color: #ffffff;
  }

  .endpoint-summary {
    font-family: Montserrat, sans-serif;
    font-size: 13px;
    color: rgb(51, 51, 51);
  }
</style>
