<template>
  <div class="endpoint-definition">
    <div class="operation" @click="toggleDefinitionExpand">
      <span class="operation-method" :class="method.toLowerCase()">{{method}}</span>
      <span class="operation-path"><span v-for="(p, i) in pathTokens" :key="i"><span v-if="!p.class || p.class==='path'">/</span><span :class="p.class">{{p.token}}</span></span></span>
      <md-icon>{{definitionExpandedIcon}}</md-icon>
    </div>
    <transition enter-class="rollInDownEnter" enter-active-class="rollInDownActive" leave-active-class="rollOutUpActive">
      <div v-if="definitionExpanded" class="endpoint-servers">
        <EndpointServer v-for="server in servers" :path="path" :url="server.url" :description="server.description" :key="server.url"></EndpointServer>
      </div>
    </transition>
  </div>
</template>

<script>
import EndpointServer from '@/components/Content/EndpointServer'
const PATH_CONS_REGEX = /^\/(([a-zA-Z0-9~@%_][a-zA-Z0-9~@%_-]*)|(\{[a-zA-Z0-9~@%_][a-zA-Z0-9~@%_-]*\}))((\/[a-zA-Z0-9~@%{_][a-zA-Z0-9~@%{}_-]*)+)?$/
export default {
  name: 'EndpointDefinition',
  components: {EndpointServer},

  props: ['method', 'path', 'servers'],

  data: () => ({
    pathTokens: null,
    definitionExpanded: false
  }),

  created() {
    try {
      this.pathTokens = this.splitPath(this.path)
    }
    catch (error) {
      // do nothing
    }
  },

  computed: {
    definitionExpandedIcon() {
      return (this.definitionExpanded ? 'expand_less' : 'expand_more')
    }
  },

  methods: {
    splitPath(path) {
      if (!path || path.trim().length === 0 || path.trim() === '/') {
        return []
      }

      const consMatch = path.match(PATH_CONS_REGEX)
      if (consMatch) {
        const first = {
          token: consMatch[1],
          class: consMatch[2] ? undefined : consMatch[3] ? 'path' : 'query'
        }
        const rest = consMatch[4] ? this.splitPath(consMatch[4]) : []
        return [first].concat(rest)
      }
      else {
        throw new Error('Invalid Path')
      }
    },

    toggleDefinitionExpand() {
      this.definitionExpanded = !this.definitionExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
  .operation {
    background-color: #f0f0f0;
    padding: 14px 20px;
    display: flex;
    align-items: center;
  }

  .operation:hover {
    cursor: pointer;
  }

  .operation .operation-method {
    font-family: Montserrat, sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    padding: 3px 10px;
    vertical-align: middle;
    text-transform: uppercase;
  }

  .operation .operation-path {
    font-family: Montserrat, sans-serif;
    line-height: 1.5;
    margin-left: 15px;
    vertical-align: middle;
    flex: 1;
  }

  .operation .operation-path .path {
    background-color: #F8DFD6;
    color: #571800;
  }

  .operation .operation-path .query {
    color: #0067ff;
    /*background-color: #cce1ff;*/
  }

  .operation .operation-method.get,
  .operation .operation-method.GET {
    background-color: #61c000;
  }

  .operation .operation-method.post,
  .operation .operation-method.POST {
    background-color: #003bed;
  }

  .operation .operation-method.put,
  .operation .operation-method.PUT {
    background-color: #FE8F40;
  }

  .operation .operation-method.patch,
  .operation .operation-method.PATCH {
    background-color: #7300ed;
  }

  .operation .operation-method.delete,
  .operation .operation-method.DELETE {
    background-color: #ed3b00;
  }

  .endpoint-servers {
    background-color: #fafafa;
    position: absolute;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.33) 0px 0px 5px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 10;
  }

  .rollInDownEnter {
    transform: translateY(-50%) scaleY(0);
  }

  .rollInDownActive {
    transition: all 0.3s ease-in-out;
  }

  .rollOutUpActive {
    transform: translateY(-50%) scaleY(0);
    transition: all 0.3s ease-in-out;
  }
</style>
