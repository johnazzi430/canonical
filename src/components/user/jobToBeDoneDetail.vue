<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{jobToBeDone.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{jobToBeDone.data.description}}</p>
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
          v-model="jobToBeDone.data.name"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="jobToBeDone.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addJobToBeDone()"
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
            @click="updateJobToBeDone()"
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
            @click="deleteJobToBeDone()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import {JobToBeDone} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      jobToBeDone:{
        id: null,
        data : {
          description:"",
          name:"",
          pains:"",
          gains:"",
        }
      },
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 42 || 'Max 42 characters',
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
          const selectedData = await JobToBeDone.getDocById(this.selected.index)
          if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.jobToBeDone = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addJobToBeDone () {
        await this.$refs.form.validate();
        if (this.valid ){
          await JobToBeDone.create(this.jobToBeDone.data)
          this.$store.commit('getJobsToBeDone')
          this.$store.commit('closeDetail')
        }
      },
      async updateJobToBeDone () {
        await this.$refs.form.validate();
        this.valid ? await JobToBeDone.updateDoc(this.jobToBeDone.id,this.jobToBeDone.data) : console.log('not valid');
        this.$store.commit('getJobsToBeDone')
        this.$refs.form.resetValidation();
      },
      async deleteJobToBeDone () {
        JobToBeDone.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getJobsToBeDone')
        this.$refs.form.resetValidation();
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
