import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {Product,Feature,Idea,Goal,Risk,Persona,Insight,Need,Journey,JobToBeDone,Interview} from '../services/firebaseDataService'

const store = createStore({
  state () {
    return {
      user:{
        loggedIn: false,
        displayName: "",
        uid:"",
        email: "",
        group: ""
      },
      personas: [],
      features: [],
      ideas: [],
      goals: [],
      risks: [],
      products: [],
      insights:[],
      needs:[],
      journeys:[],
      jobsToBeDone:[],
      interviews:[],
      selected:{
        isSelected: false,
        index: null,
        source: null
      },
      detailClose: 1
    }
  },
  getters: {
    isUserLoggedIn (state) {
      return state.user.loggedIn
    }
  },
  mutations: {

    login(state,payload){
      state.user.loggedIn = true;
      state.user.displayName = payload.displayName;
      state.user.uid = payload.id;
      state.user.email = payload.email;
      state.user.group = payload.group;
    },

    logout(state){
      state.user.loggedIn = false;
      state.user.displayName = "";
      state.user.uid = "";
      state.user.email = "";
      state.user.group = "";
    },

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

    async getPersonas (state) {
      state.personas = await Persona.getAll()
    },

    async getInsights (state) {
      state.insights = await Insight.getAll()
    },

    async getNeeds (state) {
      state.needs = await Need.getAll()
    },

    async getJourneys (state) {
      state.journeys = await Journey.getAll()
    },

    async getJobsToBeDone (state) {
      state.jobsToBeDone = await JobToBeDone.getAll()
    },

    async getInterviews (state) {
      state.interviews = await Interview.getAll()
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
