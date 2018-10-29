<template>
  <div class="menu-content">
    <md-list>
      <md-list-item>
        <!--<md-icon>move_to_inbox</md-icon>-->
        <span class="md-list-item-text">Introduction</span>
      </md-list-item>
      <md-list-item>
        <!-- <md-icon>send</md-icon> -->
        <span class="md-list-item-text">Authentication</span>
      </md-list-item>
    </md-list>
    <MenuTagGroup v-for="group in tagGroups" :name="group.name" :isDefault="group.isDefault" :tags="group.tags" :key="group.key"></MenuTagGroup>
  </div>
</template>

<script>
import MenuTagGroup from '@/components/MenuTagGroup'
export default {
  name: 'MenuContent',
  components: {MenuTagGroup},
  data: () => ({
    tagGroups: [
      {
        key: 'group/users',
        name: 'Users',
        tags: [
          {
            name: 'Users',
            endpoints: [
              {method: 'GET', path: '/users'},
              {method: 'POST', path: '/users'},
              {method: 'PATCH', path: '/users'}
            ]
          }
        ]
      },
      {
        key: 'group/admins',
        name: 'Admins',
        tags: [
          {
            name: 'Super Admins',
            endpoints: [
              {method: 'get', path: '/superadmins'},
              {method: 'delete', path: '/superadmins'}
            ]
          },
          {
            name: 'Admins',
            endpoints: [
              {method: 'get', path: '/admins'},
              {method: 'post', path: '/admins'},
              {method: 'patch', path: '/admins'}
            ]
          }
        ]
      },
      {
        key: 'group/~default',
        name: '',
        isDefault: true,
        tags: [{name: '7'}, {name: '8'}, {name: '9'}]
      }
    ],
    treeOptions: {
      maxDepth: 3
    }
  })
}
</script>

<style lang="scss" scoped>
</style>
