import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {product,feature,idea,goal} from '../services/firebaseDataService'

const store = createStore({
  state () {
    return {
      personas: [],
      features: [],
      ideas: [],
      goals: [],
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

    async getFeatures (state) {
      state.features = await new feature().getAll()
    },

    async getIdeas (state) {
      state.ideas = await new idea().getAll()
    },

    async getGoals (state) {
      state.goals = await new goal().getAll()
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
