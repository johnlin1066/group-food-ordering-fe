<template>
  <div>
    <v-card-title>新增團購單</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <v-select
                v-model="selectMenu"
                :items="menus"
                item-text="text"
                item-value="value"
                label="選擇菜單"
                return-object
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="groupFoodOrderDS.endTime"
                label="到期時間 (格式: 2022-01-01T00:00:00)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="menusTableHeaders"
                :items="menuItemList"
                class="elevation-1"
              >
              </v-data-table>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn @click="createGroupFoodOrder">提交</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>
<script>
import orderAPI from '@/apis/order'
import menuAPI from '@/apis/menu'

export default {
  name: 'CreateGroupFoodOrder',
  data () {
    return {
      selectMenu: null,
      menus: [
        { text: '菜單1', value: 1 },
        { text: '菜單2', value: 2 },
        { text: '菜單3', value: 3 }
      ],
      menusTableHeaders: [
        { text: 'ID', value: 'id' },
        { text: '品項', value: 'name' },
        { text: '價格', value: 'price' }
      ],
      menuItemList: [],

      groupFoodOrderDS: {
        menuID: '',
        endTime: ''
      }
    }
  },
  mounted () {
    this.initTime()
    this.readAllMenu()
  },
  watch: {
    selectMenu: function (newData, oldData) {
      if (newData) {
        this.readMenu(newData.value)
      }
    }
  },
  methods: {
    clear () {
      this.selectMenu = null
      this.readAllMenu()
      this.groupFoodOrderDS = {
        menuID: '',
        endTime: ''
      }
      this.menuItemList = []
      this.initTime()
    },
    initTime () {
      const nowTime = new Date(Number(new Date()) + 8 * 3600 * 1000).toISOString()
      this.groupFoodOrderDS.endTime = nowTime.substring(0, nowTime.length - 5)
    },

    readAllMenu () {
      menuAPI.readAllMenu().then((response) => {
        const data = response.data
        this.menus = data.map((menu) => {
          return {
            text: menu.storeName,
            value: menu.id
          }
        })
      })
    },
    readMenu (menuID) {
      menuAPI.readMenu(menuID).then((response) => {
        this.menuItemList = response.data.menuItemDSList
      })
    },
    createGroupFoodOrder () {
      this.groupFoodOrderDS.menuID = this.selectMenu.value
      orderAPI.createGroupFoodOrder(this.groupFoodOrderDS).then((response) => {
        this.clear()
      })
    }
  }
}
</script>
