<template>
  <div class="response-wrap">
    <div class="response" :class="statusClass">
      <md-icon class="expand-button">{{responseExpandedIcon}}</md-icon>
      <span class="status-code">{{statusCode}}</span>
      <span class="description">{{description}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Response',
  props: ['statusCode', 'description', 'headers', 'responseContent'],

  data: () => ({
    responseExpanded: false
  }),

  computed: {
    statusClass() {
      const s = this.statusCode >> 6
      if (s === 3) {
        return 'success'
      }
      if (s === 4) {
        return 'redirect'
      }
      if (s === 6) {
        return 'client-error'
      }
      if (s === 7) {
        return 'server-error'
      }
    },

    responseExpandedIcon() {
      return ((this.headers || this.responseContent) && this.responseExpanded ? 'expand_less' : ((this.headers || this.responseContent) && !this.responseExpanded ? 'expand_more' : 'remove'))
    }
  },

  methods: {
    go() {
      console.log('go')
    }
  }
}
</script>

<style lang="scss" scoped>
  .response {
    padding: 10px 10px;
    margin-top: 5px;
  }

  .response.success {
    background-color: rgba(0, 170, 19, 0.1);
    color: rgb(0, 170, 19)
  }

  .response.client-error {
    background-color: rgba(229, 57, 53, 0.1);
    color: rgb(229, 57, 53);
  }

  .response .md-icon.expand-button {
    margin-right: 10px;
  }

  .response .status-code {
    font-family: Courier, monospace;
    font-weight: 600;
    margin-right: 5px;
  }
</style>
