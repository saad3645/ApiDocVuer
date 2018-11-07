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
    border-radius: 2px;
    font-size: 11px;
    padding: 2px 2px;
    text-transform: uppercase;
    margin-right: 12px;
    min-width: 45px;
    text-align: center;
  }

  .endpoint-method.get,
  .endpoint-method.GET {
    border-color: #c0e69a;
    color: #4f9c00;
  }

  .endpoint-method.post,
  .endpoint-method.POST {
    border-color: #FFBF92;
    color: #fe7f25;
  }

  .endpoint-method.put,
  .endpoint-method.PUT {
    border-color: #9ab1f8;
    color: #0030c0;
  }

  .endpoint-method.patch,
  .endpoint-method.PATCH {
    border-color: #a593f8;
    color: #5d00b9;
  }

  .endpoint-method.delete,
  .endpoint-method.DELETE {
    border-color: #f8b19a;
    color: #c03000;
  }

  .endpoint-method.options,
  .endpoint-method.OPTIONS {
    border-color: #d3ca12;
    color: #d3ca12;
  }

  .endpoint-summary {
    color: #5c666f;
  }

  .menu-endpoint-item:hover .endpoint-summary {
    color: rgba(0,0,0,.86);
  }
</style>
