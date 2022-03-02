import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {product,feature,idea,goal,risk,persona} from '../services/firebaseDataService'

const store = createStore({
  state () {
    return {
      personas: [],
      features: [],
      ideas: [],
      goals: [],
      risks: [],
      products: [],
      selected:{
        isSelected: false,
        index: null,
        source: null
      },
      detailClose: 1
    }
  },
  mutations: {

    closeDetail(state){
      state.detailClose = state.detailClose + 1;
    },

    async getProducts (state) {
      const products = await new product().getAll()
      state.products = products
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

    async getRisks (state) {
      state.risks = await new risk().getAll()
    },

    async getPersona (state) {
      state.personas = await new persona().getAll()
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
