import axios from 'axios'
import serverIP from './common'

const menuURL = '/menu'

const menuAPI = {
  createMenu: menuDS => (axios.post(`${serverIP.backEndServer}${menuURL}`, menuDS)),
  readMenu: menuID => (axios.get(`${serverIP.backEndServer}${menuURL}/${menuID}`)),
  readAllMenu: () => (axios.get(`${serverIP.backEndServer}${menuURL}`))
}

export default menuAPI
