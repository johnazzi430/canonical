import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {Product,Feature,Idea,Goal,Risk,Persona,Insight,Need,Journey,JobToBeDone,Interview} from '../services/firebaseDataService'

function filterHelper(list,filter){
  return [...list].filter(function(item) {
    var justTheData = [];
    Object.keys(item.data).forEach(k => {
      justTheData.push(item.data[k])
    });
    Object.keys(item).forEach(k => {
      if(k != "data") {justTheData.push(item[k])}
    });
    let regex = new RegExp('(' + filter+ ')', 'i');
    return JSON.stringify({justTheData}).match(regex);
  })
}

const store = createStore({
  state () {
    return {
      user:{
        loggedIn: false,
        displayName: null,
        uid:null,
        email: null,
        project: 'nCHJGmd9sx9VuiiqKrFN' //hardcode to default projectID
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
      loading:{
        personas:{
          loaded:false,
          fetching:false
        }
      },
      selected:{
        isSelected: false,
        index: null,
        source: null
      },
      detailClose: 1,
      globalAlerts:[],
      filter: "",
    }
  },
  getters: {
    isUserLoggedIn (state) {
      return state.user.loggedIn
    },
    filteredProducts (state){
      return filterHelper(state.products,state.filter)
    },
    filteredFeatures (state){
      return filterHelper(state.features,state.filter)
    },
    filteredIdeas (state){
      return filterHelper(state.ideas,state.filter)
    },
    filteredGoals (state){
      return filterHelper(state.goals,state.filter)
    },
    filteredRisks (state){
      return filterHelper(state.risks,state.filter)
    },
    filteredPersonas (state){
      return filterHelper(state.personas,state.filter)
    },
    filteredInsights (state){
      return filterHelper(state.insights,state.filter)
    },
    filteredNeeds (state){
      return filterHelper(state.needs,state.filter)
    },
    filteredJourneys (state){
      return filterHelper(state.journeys,state.filter)
    },
    filteredJobsToBeDone(state){
      return filterHelper(state.jobsToBeDone,state.filter)
    },
    filteredInterviews (state){
      return filterHelper(state.interviews,state.filter)
    }
  },
  mutations: {

    login(state,payload){
      state.user.loggedIn = true;
      state.user.displayName = payload.displayName;
      state.user.uid = payload.id;
      state.user.email = payload.email;
      state.user.project = payload.project;
    },

    logout(state){
      state.user.loggedIn = false;
      state.user.displayName = "";
      state.user.uid = "";
      state.user.email = "";
      state.user.project= 'nCHJGmd9sx9VuiiqKrFN';
    },

    alert(state,payload){
      const alert = {
        time: Date.now(),
        show: false,
        type: payload.type,
        message: payload.message
      }
      this.globalAlerts.push(alert)
    },

    filter(state,payload){
      state.filter = payload
    },

    resetFilter(state){
      state.filter = null
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
