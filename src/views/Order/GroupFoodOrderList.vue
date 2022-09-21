<template>
  <div>
    <v-card-title>團購單總覽</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-data-table
            :headers="groupFoodOrderTableHeaders"
            :items="groupFoodOrderList"
            :sort-by="['endTime']"
            :sort-desc="[true]"
            class="elevation-1"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="readGroupFoodOrder(item.id)">查看</v-btn>
            </template>
          </v-data-table>
        </v-col>
        <v-col>
          <div>
            <v-btn class="mr-2" @click="toStep(1)">點餐用</v-btn>
            <v-btn class="mr-2" @click="toStep(2)">收費用</v-btn>
          </div>
          <br />
          <v-card class="elevation-12">
            <v-window v-model="step">
              <v-window-item :value="1">
                <div>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <template
                          v-for="(
                            orderItemDS, index
                          ) in orderDSListForOrder.orderItemDSList"
                        >
                          <v-row :key="index + '-orderItemDSA'">
                            <v-col>{{ orderItemDS.name }}</v-col>
                            <v-col>{{ orderItemDS.price }}</v-col>
                            <v-col>{{ orderItemDS.amount }}</v-col>
                          </v-row>
                        </template>
                        <v-row>
                          <v-col><v-divider></v-divider></v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            {{ "總金額" }}
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col>
                            {{ orderDSListForOrder.total }}
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </v-window-item>
              <v-window-item :value="2">
                <div>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <template v-for="(orderDS, index) in orderDSListForFee">
                          <v-row :key="index + '-orderDS'">
                            <v-col>
                              <v-row>
                                <v-col> {{ orderDS.username }} </v-col></v-row
                              >
                              <template
                                v-for="(
                                  orderItem, index
                                ) in orderDS.orderItemDSList"
                              >
                                <v-row :key="index + '-orderItemDSB'">
                                  <v-col>{{ orderItem.name }}</v-col>
                                  <v-col>{{ orderItem.price }}</v-col>
                                  <v-col>{{ orderItem.amount }}</v-col>
                                </v-row>
                              </template>
                            </v-col>
                          </v-row>
                          <v-row :key="index + '-orderDSTotal'">
                            <v-col>
                              {{ "總金額" }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col>
                              {{ orderDS.total }}
                            </v-col>
                          </v-row>
                          <v-row :key="index + '-orderDSDivider'">
                            <v-col><v-divider></v-divider></v-col>
                          </v-row>
                        </template>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>
<script>
import orderAPI from '@/apis/order'

export default {
  name: 'CreateGroupFoodOrderList',
  data () {
    return {
      groupFoodOrderTableHeaders: [
        { text: 'ID', value: 'id' },
        { text: '到期時間', value: 'endTime' },
        { text: '動作', value: 'actions', sortable: false }
      ],
      groupFoodOrderList: [],
      step: 1,
      orderDSListForOrder: {
        orderItemDSList: [],
        total: 0
      },
      orderDSListForFee: []
    }
  },
  mounted () {
    this.readAllGroupFoodOrder()
  },
  methods: {
    toStep (step) {
      this.step = step
    },

    readAllGroupFoodOrder () {
      orderAPI.readAllGroupFoodOrder().then((response) => {
        this.groupFoodOrderList = response.data
      })
    },
    readGroupFoodOrder (groupFoodOrderID) {
      orderAPI.readGroupFoodOrder(groupFoodOrderID).then((response) => {
        const data = response.data
        this.orderDSListForFee = data.orderDSList.map((orderDS) => {
          let tmpeTotal = 0
          for (let i = 0; i < orderDS.orderItemDSList.length; i++) {
            tmpeTotal +=
              orderDS.orderItemDSList[i].price *
              orderDS.orderItemDSList[i].amount
          }
          return {
            id: orderDS.id,
            username: orderDS.username,
            orderItemDSList: orderDS.orderItemDSList,
            total: tmpeTotal
          }
        })
        return data
      }).then((data) => {
        this.orderDSListForOrder.orderItemDSList = []
        for (let i = 0; i < data.orderDSList.length; i++) {
          const tempOrderDSList = data.orderDSList[i]
          for (let j = 0; j < tempOrderDSList.orderItemDSList.length; j++) {
            const tempOrderItemDSList = tempOrderDSList.orderItemDSList[j]
            const isItemInOrderingResult = this.isItemInOrdering(tempOrderItemDSList.name)
            if (isItemInOrderingResult > -1) {
              this.orderDSListForOrder.orderItemDSList[isItemInOrderingResult].amount += tempOrderItemDSList.amount
            } else {
              this.orderDSListForOrder.orderItemDSList.push({
                name: tempOrderItemDSList.name,
                price: tempOrderItemDSList.price,
                amount: tempOrderItemDSList.amount
              })
            }
          }
        }
        this.orderDSListForOrder.total = 0
        for (let i = 0; i < this.orderDSListForOrder.orderItemDSList.length; i++) {
          this.orderDSListForOrder.total +=
              this.orderDSListForOrder.orderItemDSList[i].price *
              this.orderDSListForOrder.orderItemDSList[i].amount
        }
      })
    },
    isItemInOrdering (itemName) {
      for (let i = 0; i < this.orderDSListForOrder.orderItemDSList.length; i++) {
        if (this.orderDSListForOrder.orderItemDSList[i].name === itemName) {
          return i
        }
      }
      return -1
    }
  }
}
</script>
