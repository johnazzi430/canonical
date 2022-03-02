import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {Product,Feature,Idea,Goal,Risk,Persona} from '../services/firebaseDataService'

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
      const products = await Product.getAll()
      state.products = products
    },

    async getFeatures (state) {
      state.features = await Feature.getAll()
    },

    async getIdeas (state) {
      state.ideas = await Idea.getAll()
    },

    async getGoals (state) {
      state.goals = await Goal.getAll()
    },

    async getRisks (state) {
      state.risks = await Risk.getAll()
    },

    async getPersona (state) {
      state.personas = await Persona.getAll()
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
