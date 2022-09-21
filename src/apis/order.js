import axios from 'axios'
import serverIP from './common'

const orderURL = '/order'

const orderAPI = {
  createGroupFoodOrder: groupFoodOrderDS => (axios.post(`${serverIP.backEndServer}${orderURL}/createGroupFoodOrder`, groupFoodOrderDS)),
  createOrder: (groupFoodOrderID, orderDS) => (axios.post(`${serverIP.backEndServer}${orderURL}/createOrder/${groupFoodOrderID}`, orderDS)),
  readGroupFoodOrder: groupFoodOrderID => (axios.get(`${serverIP.backEndServer}${orderURL}/${groupFoodOrderID}`)),
  readAllGroupFoodOrder: () => (axios.get(`${serverIP.backEndServer}${orderURL}`))
}

export default orderAPI
