<template>
  <div>
    <v-card-title>新增菜單</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model="menuDS.storeName"
                label="商店名稱"
              ></v-text-field>
              <v-text-field
                v-model="menuDS.storePhone"
                label="商店電話"
              ></v-text-field>
            </v-col>
          </v-row>
          <template v-for="(menuItem, index) in menuDS.menuItemDSList">
            <v-row :key="index + '-menuItem'">
              <v-col>
                <v-text-field
                  v-model="menuItem.name"
                  label="品項"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="menuItem.price"
                  label="價格"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <v-row>
            <v-col>
              <v-btn class="mr-2" @click="addNewMenuItem">新增品項</v-btn>
              <v-btn class="mr-2" @click="reduceNewMenuItem">刪除品項</v-btn>
              <v-btn @click="createMenu">提交</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>
<script>
import menuAPI from '@/apis/menu'

export default {
  name: 'CreateMenu',
  data () {
    return {
      menuDS: {
        storeName: '',
        storePhone: '',
        menuItemDSList: [{ name: '', price: 0 }]
      }
    }
  },
  methods: {
    addNewMenuItem () {
      this.menuDS.menuItemDSList.push({ name: '', price: 0 })
    },
    reduceNewMenuItem () {
      this.menuDS.menuItemDSList.pop()
    },
    clear () {
      this.menuDS = {
        storeName: '',
        storePhone: '',
        menuItemDSList: [{ name: '', price: 0 }]
      }
    },

    createMenu () {
      menuAPI.createMenu(this.menuDS).then((response) => {
        this.clear()
      })
    }
  }
}
</script>
