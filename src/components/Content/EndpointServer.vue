<template>
  <div class="server-item">
    <div class="server-description">
      <span>{{description}}</span>
    </div>
    <div class="server-url">
      <span>{{fullUrl}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EndpointServer',
  props: ['path', 'url', 'description'],
  data: () => ({
  }),

  computed: {
    fullUrl() {
      return (this.url + this.path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .server-item {
    padding: 10px 10px;
  }

  .server-description {
    line-height: 1.5;
  }

  .server-url {
    border-style: solid;
    border-width: 1px;
    border-color: #cccccc;
    background-color: #ffffff;
    padding: 7px 7px;
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
