import { createStore } from 'vuex'
//import {product, persona} from '../services/firebaseDataService'
import {User,Product,Feature,Idea,Goal,Risk,Persona,Insight,Need,Journey,JobToBeDone,Interview,Draft,Approval} from '../services/firebaseDataService'

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
        project: '' //hardcode to default projectID
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
      users:[],
      approvals:[],
      drafts:[],
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

    async getAllData(state){
      state.products = await Product.getAll()
      state.features = await Feature.getAll()
      state.ideas = await Idea.getAll()
      state.goals = await Goal.getAll()
      state.risks = await Risk.getAll()
      state.personas = await Persona.getAll()
      state.insights = await Insight.getAll()
      state.needs = await Need.getAll()
      state.journeys = await Journey.getAll()
      state.jobsToBeDone = await JobToBeDone.getAll()
      state.interviews = await Interview.getAll()
      state.users = await User.getUsersByProject()
      state.approvals = await Approval.getAll()
      state.drafts  = await Draft.getAll()
    },

    async enter(){
      await User.getUserAuth()
      var project = await User.getDefaultProject()
      store.state.user.project = project[0].id
      store.commit('getAllData')
    },

    login(state,payload){
      if (!payload.project) {
        console.warn("no user record exists")
        return
      } else {
        state.user.loggedIn = true;
        state.user.displayName = payload.displayName;
        state.user.uid = payload.id;
        state.user.email = payload.email;
        state.user.project = payload.project;
        store.commit('getAllData')
      }
    },

    logout(state){
      state.user.loggedIn = false;
      state.user.displayName = "";
      state.user.uid = "";
      state.user.email = "";
      state.user.project= 'nCHJGmd9sx9VuiiqKrFN';
      store.commit('getAllData')
    },

    alert(state,payload){
      //   $store.commit('alert',{type:'info',message:'HI!',autoClear:true})
      const alert = {
        time: Date.now(),
        show: true,
        type: payload.type,
        message: payload.message,
      }
      //setTimeout((...state) => {
      const index = state.globalAlerts.length
      if(payload.autoClear === true ){setTimeout(() => {state.globalAlerts[index].show = false;}, 2000)}
      state.globalAlerts.push(alert)
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

    async getUsers (state) {
      state.users = await User.getUsersByProject()
    },

    async getApprovals(state){
      state.approvals = await Approval.getAll()
    },

    async getDrafts(state){
      state.drafts  = await Draft.getAll()
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
