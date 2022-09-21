<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row class="fill-height">
          <v-col>
            <div>
              <v-btn class="mr-2" @click="toStep(1)">點餐</v-btn>
              <v-btn class="mr-2" @click="toStep(2)">團購單總覽</v-btn>
              <v-btn class="mr-2" @click="toStep(3)">新增團購單</v-btn>
              <v-btn class="mr-2" @click="toStep(4)">新增菜單</v-btn>
            </div>
            <br>
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <group-food-order v-if="step===1"></group-food-order>
                </v-window-item>
                <v-window-item :value="2">
                  <group-food-order-list v-if="step===2"></group-food-order-list>
                </v-window-item>
                <v-window-item :value="3">
                  <create-group-food-order v-if="step===3"></create-group-food-order>
                </v-window-item>
                <v-window-item :value="4">
                  <create-menu v-if="step===4"></create-menu>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer></v-footer>
  </v-app>
</template>

<script>
import GroupFoodOrder from './Order/GroupFoodOrder.vue'
import GroupFoodOrderList from './Order/GroupFoodOrderList.vue'
import CreateGroupFoodOrder from './Order/CreateGroupFoodOrder.vue'
import CreateMenu from './Menu/CreateMenu.vue'

export default {
  components: { GroupFoodOrder, GroupFoodOrderList, CreateGroupFoodOrder, CreateMenu },
  name: 'HomeView',
  data () {
    return {
      step: 1
    }
  },
  methods: {
    toStep (step) {
      this.step = step
    }
  }
}
</script>
