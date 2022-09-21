<template>
  <div>
    <v-card-title>點餐</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-select
            v-model="selectGroupFoodOrder"
            :items="groupFoodOrders"
            item-text="text"
            item-value="value"
            label="選擇團購單"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="menusTableHeaders"
            :items="menuItemList"
            class="elevation-1"
          >
            <template v-slot:[`item.amount`]="{ item }">
              <v-text-field
                value="0"
                @change="addNewItem($event, item)"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-col>
        <v-col>
          <v-card class="elevation-12">
            <div>
              <v-card-title>餐點明細</v-card-title>
              <v-card-text>
                <template
                  v-for="(orderItemDS, index) in orderDS.orderItemDSList"
                >
                  <v-row :key="index + '-orderItemDS'">
                    <v-col>
                      {{ orderItemDS.name }}
                    </v-col>
                    <v-col>
                      {{ orderItemDS.price }}
                    </v-col>
                    <v-col>
                      {{ orderItemDS.amount }}
                    </v-col>
                  </v-row>
                </template>
                <v-row>
                  <v-col>
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    {{ "總金額" }}
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    {{ totalAmount }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="orderDS.username"
                      label="姓名"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn @click="createOrder">提交</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>
<script>
import orderAPI from '@/apis/order'
import menuAPI from '@/apis/menu'

export default {
  name: 'GroupFoodOrder',
  data () {
    return {
      selectGroupFoodOrder: null,
      groupFoodOrders: [
        { text: '菜單1', value: 1 },
        { text: '菜單2', value: 2 },
        { text: '菜單3', value: 3 }
      ],
      menusTableHeaders: [
        { text: 'ID', value: 'id' },
        { text: '品項', value: 'name' },
        { text: '價格', value: 'price' },
        { text: '數量', value: 'amount', sortable: false }
      ],
      menuItemList: [],
      totalAmount: 0,

      orderDS: {
        username: '',
        orderItemDSList: []
      }
    }
  },
  mounted () {
    this.readAllGroupFoodOrder()
  },
  watch: {
    selectGroupFoodOrder: function (newData, oldData) {
      if (newData) {
        this.orderDS = {
          username: '',
          orderItemDSList: []
        }
        this.totalAmount = 0
        this.readMenu(newData.value.menuID)
      }
    }
  },
  methods: {
    addNewItem (event, item) {
      const isItemInOrderingResult = this.isItemInOrdering(item.name)
      if (isItemInOrderingResult > -1) {
        if (parseInt(event, 10) === 0) {
          this.orderDS.orderItemDSList.splice(isItemInOrderingResult, 1)
        } else {
          this.orderDS.orderItemDSList[isItemInOrderingResult].amount = event
        }
      } else {
        this.orderDS.orderItemDSList.push({
          name: item.name,
          price: item.price,
          amount: event
        })
      }
      this.totalAmount = this.countAmount()
    },
    isItemInOrdering (itemName) {
      for (let i = 0; i < this.orderDS.orderItemDSList.length; i++) {
        if (this.orderDS.orderItemDSList[i].name === itemName) {
          return i
        }
      }
      return -1
    },
    countAmount () {
      let total = 0
      for (let i = 0; i < this.orderDS.orderItemDSList.length; i++) {
        total +=
          this.orderDS.orderItemDSList[i].price *
          this.orderDS.orderItemDSList[i].amount
      }
      return total
    },
    clear () {
      this.selectGroupFoodOrder = null
      this.readAllGroupFoodOrder()
      this.menuItemList = []
      this.totalAmount = 0

      this.orderDS = {
        username: '',
        orderItemDSList: []
      }
    },

    readAllGroupFoodOrder () {
      orderAPI.readAllGroupFoodOrder().then((response) => {
        const data = response.data
        this.groupFoodOrders = data
          .filter(
            (groupFoodOrder) => Date.parse(groupFoodOrder.endTime) > new Date()
          )
          .map((groupFoodOrder) => {
            return {
              text: `${groupFoodOrder.id} - ${groupFoodOrder.endTime}`,
              value: groupFoodOrder
            }
          })
      })
    },
    readMenu (menuID) {
      menuAPI.readMenu(menuID).then((response) => {
        this.menuItemList = response.data.menuItemDSList
      })
    },
    createOrder () {
      orderAPI
        .createOrder(this.selectGroupFoodOrder.value.id, this.orderDS)
        .then((response) => {
          this.clear()
        })
    }
  }
}
</script>
