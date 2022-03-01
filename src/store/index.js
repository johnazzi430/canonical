import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {product} from '../services/firebaseDataService'

const store = createStore({
  state () {
    return {
      personas: [],
      products: [],
      selected:{
        isSelected: false,
        index: null,
        source: null
      }

    }
  },
  mutations: {
    async getProducts (state) {
      state.products = await new product().getAll()
    },

    selectItem (state, {index, source}) {
      state.selected.isSelected = true;
      state.selected.index = index;
      state.selected.source = source;
    },

    increment (state) {
      state.count++
    }
  }
})

export default store
