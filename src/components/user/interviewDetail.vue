<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{interview.data.interviewee}}</h2>
      <br>
      <p style="white-space: pre-line">{{interview.data.details}}</p>
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
          v-model="interview.data.interviewee"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="Interview Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="interview.data.details"
          :rules="[rules.required]"
          label="Details"
          :disabled="!editing"
          required
        ></v-textarea>

        Interview owner: {{interview.data.owner}}

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addInterview()"
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
            @click="updateInterview()"
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
            @click="deleteInterview()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import {Interview} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      interview:{
        id: null,
        data : {
          details:"",
          interviewee:"",
          owner: null
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
        const selectedData = await Interview.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.interview = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addInterview () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Interview.create(this.interview.data)
          this.$store.commit('getInterviews')
          this.$store.commit('closeDetail')
        }
      },
      async updateInterview () {
        await this.$refs.form.validate();
        this.valid ? await Interview.updateDoc(this.interview.id,this.interview.data) : console.log('not valid');
        this.$store.commit('getInterviews')
        this.$refs.form.resetValidation();
      },
      async deleteInterview () {
        Interview.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getInterviews')
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
