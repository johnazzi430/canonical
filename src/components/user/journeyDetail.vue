<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="journey.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="journey.data.inputs"
        :rules="[rules.required]"
        label="Inputs"
        :disabled="!editing"
        required
      ></v-textarea>

      <v-textarea
        v-model="journey.data.outputs"
        :rules="[rules.required]"
        label="Outputs"
        :disabled="!editing"
        required
      ></v-textarea>

      <hr>

      <div v-if="selected.index === null">
        <v-btn
          color="success"
          class="mr-4"
          @click="addJourney()"
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
      <div v-if="editing === false">
        <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
      <div v-if="selected.index != null && editing === true">
        <v-btn
          color="success"
          class="mr-4"
          @click="updateJourney()"
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
          @click="deleteJourney()"
        >Delete
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {Journey} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      journey:{
        id: null,
        data : {
          name:"",
          inputs:"",
          outputs:"",
          jobs:[]
        }
      },
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
        const selectedData = await Journey.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.journey = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addJourney () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Journey.create(this.journey.data)
          this.$store.commit('getJourneys')
          this.$store.commit('closeDetail')
        }
      },
      async updateJourney () {
        await this.$refs.form.validate();
        this.valid ? await Journey.updateDoc(this.journey.id,this.journey.data) : console.log('not valid');
        this.$store.commit('getJourneys')
        this.$refs.form.resetValidation();
      },
      async deleteJourney () {
        Journey.deleteJourney(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getJourneys')
        this.$refs.form.resetDoc();
      },
      resetForm () {
        this.$refs.form.reset()
      },
    },
    computed:{
      selected() {
        return this.$store.state.selected
      }
    },
  }
</script>
