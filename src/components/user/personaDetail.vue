<template>
  <div class="">

    <div v-if="!editing">
      <h2>{{persona.data.name}}</h2>
      <br>
      <p>{{persona.data.description}}</p>
      <br>
      <h3>Gains</h3>
      <p>{{persona.data.gains}}</p>
      <br>
      <h3>Pains</h3>
      <p>{{persona.data.pains}}</p>
      <v-switch
        v-model="persona.data.validated"
        color="primary"
        :label="`Validated: ${persona.data.validated}`"
      ></v-switch>

      <br>
      <h4 v-if="insights.length > 0">Insights</h4>
      <v-chip size="small" v-for="insight in insights" :key="insight.id">{{insight.name}}</v-chip>

      <h4 v-if="needs.length > 0">Needs</h4>
      <v-chip size="small" v-for="need in needs" :key="need.id">{{need.name}}</v-chip>

      <h4 v-if="journeys.length > 0">Journeys</h4>
      <v-chip size="small" v-for="journey in journeys" :key="journey.id">{{journey.name}}</v-chip>

      <h4 v-if="jobsToBeDone.length > 0">Jobs To Be Done</h4>
      <v-chip size="small" v-for="jobToBeDone in jobsToBeDone" :key="jobToBeDone.id">{{jobToBeDone.name}}</v-chip>

      <h4 v-if="interviews.length > 0">Interviews</h4>
      <v-chip size="small" v-for="interview in interviews" :key="interview.id">{{interview.name}}</v-chip>
      <br>
      <hr>
      <br>
      <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
      </v-btn>
    </div>
    <div v-else>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="persona.data.name"
          :counter="20"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="persona.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        <v-textarea
          v-model="persona.data.gains"
          label="Gains"
          :disabled="!editing"
        ></v-textarea>

        <v-textarea
          v-model="persona.data.pains"
          label="Pains"
          :disabled="!editing"
        ></v-textarea>

        <v-switch
          v-model="persona.data.validated"
          color="primary"
          :label="`Validated: ${persona.data.validated}`"
        ></v-switch>

        <br>
        <h4>Insights</h4>
        <VueMultiselect
          v-model="insights"
          :options="$store.state.insights.map(doc => ({ id:doc.id, name:doc.data.name}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>

        <br>
        <h4>Needs</h4>
        <VueMultiselect
          v-model="needs"
          :options="$store.state.needs.map(doc => ({ id:doc.id, name:doc.data.name}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>

        <br>
        <h4>Journeys</h4>
        <VueMultiselect
          v-model="journeys"
          :options="$store.state.journeys.map(doc => ({ id:doc.id, name:doc.data.name}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>

        <br>
        <h4>Jobs To Be Done</h4>
        <VueMultiselect
          v-model="jobsToBeDone"
          :options="$store.state.jobsToBeDone.map(doc => ({ id:doc.id, name:doc.data.name}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>

        <br>
        <h4>Interviews</h4>
        <VueMultiselect
          v-model="interviews"
          :options="$store.state.interviews.map(doc => ({ id:doc.id, name:doc.data.interviewee}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>
        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addPersona()"
          >
            Add
          </v-btn>
          <v-btn
            color="info"
            class="mr-4"
            @click="resetForm()"
          >
            Clear
          </v-btn>
        </div>
        <div v-if="selected.index != null && editing === true">
          <v-btn
            color="success"
            class="mr-4"
            @click="updatePersona()"
          >Confirm
          </v-btn>
          <v-btn
            color="info"
            class="mr-4"
            @click="editing = false; this.$store.commit('closeDetail')"
          >Cancel
          </v-btn>
          <v-btn
            color="error"
            class="mr-4"
            @click="deletePersona()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>


  </div>
</template>

<script>
import {Persona,Draft} from "../../services/firebaseDataService";
import VueMultiselect from 'vue-multiselect';
import _ from 'lodash';

export default {
  components: {
//    approvalComponent,
    VueMultiselect,
  },
  emits: ["selectDraft"],
  props: {
        draft:{
          default: false,
          type: Boolean
        },
        id:{
          default: null,
          type:String
        },
        reviewing:{
          default: false,
          type: Boolean
        }
  },
  data: () => ({
      editing: true,
      valid: true,
      persona:{
        id: null,
        data : {
          description:"",
          name:"",
          pains:"",
          gains:"",
          validated:false
        }
      },
      needs:[],
      insights:[],
      journeys:[],
      jobsToBeDone:[],
      interviews:[],
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      },
      select: null,
      checkbox: false,
    }),
    async beforeMount(){
      if (this.selected.index != null){
        const selectedData = await Persona.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.persona = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async updateRel (id){
        if (this.needsChanged) {await Persona.updateField(id,'needs',this.needs)}
        if (this.insightsChanged) {await Persona.updateField(id,'insights',this.insights)}
        if (this.journeysChanged) {await Persona.updateField(id,'journeys',this.journeys)}
        if (this.jobsToBeDoneChanged) {await Persona.updateField(id,'jobsToBeDone',this.jobsToBeDone)}
        if (this.interviewsChanged) {await Persona.updateField(id,'interviews',this.interviews)}
      },

      async addPersona () {
        await this.$refs.form.validate();
        if (this.valid ){
          var newPersona = await Persona.create(this.persona.data)
          await this.updateRel(newPersona.id)
          this.$store.commit('getPersonas')
          this.$store.commit('closeDetail')
        }
      },
      async updatePersona () {
        await this.$refs.form.validate();
        if(this.valid){
          await Persona.updateDoc(this.persona.id,this.persona.data)
        } else {
          console.log('not valid');
          return
        }
        await this.updateRel(this.persona.id)
        this.$store.commit('getPersonas')
        this.$refs.form.resetValidation();
      },
      async deletePersona () {
        Persona.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getPersonas')
        this.$refs.form.resetValidation();
      },
      resetForm () {
        this.$refs.form.reset()
      },
    },
    computed:{
      selected() {
        return this.$store.state.selected
      },

      needsChanged(){
        return !_.isEqual(this.needs , this.persona.data.needs)
      },

      insightsChanged(){
        return !_.isEqual(this.insights , this.persona.data.insights)
      },

      journeysChanged(){
        return !_.isEqual(this.journeys , this.persona.data.journeys)
      },

      jobsToBeDoneChanged(){
        return !_.isEqual(this.jobsToBeDone , this.persona.data.jobsToBeDone)
      },

      interviewsChanged(){
        return !_.isEqual(this.interviews , this.persona.data.interviews)
      },

    },
    watch:{
      id: {
        immediate: true,
        async handler(){
          if (this.draft === false && this.id != null) {
            const selectedData = await Persona.getById(this.id)
            this.persona = JSON.parse(JSON.stringify(selectedData));
            this.drafts = await Draft.getDraftByParentId(this.id)
            this.loading=false;
          } else if (this.draft === true) {
            const selectedData = await Draft.getDraftById(this.id)
            this.persona = {
              id: this.id,
              data: selectedData.data.docData,
            }
            this.isDraft = true;
            this.loading=false;
          } else {
            this.editing = true
          }
        }
      },

      'persona.data.needs'(){
        this.needs = typeof this.persona.data.needs != 'undefined' ? this.persona.data.needs : []
      },
      'persona.data.insights'(){
        this.insights = typeof this.persona.data.insights != 'undefined' ? this.persona.data.insights : []
      },
      'persona.data.journeys'(){
        this.journeys = typeof this.persona.data.journeys != 'undefined' ? this.persona.data.journeys : []
      },
      'persona.data.jobsToBeDone'(){
        this.jobsToBeDone = typeof this.persona.data.jobsToBeDone != 'undefined' ? this.persona.data.jobsToBeDone : []
      },
      'persona.data.interviews'(){
        this.interviews = typeof this.persona.data.interviews != 'undefined' ? this.persona.data.interviews : []
      },
    }
  }
</script>
