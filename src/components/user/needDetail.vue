<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{need.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{need.data.description}}</p>
      <br>
      <h4>Impact</h4>
      <v-slider
        v-model="need.data.impact"
        step="1"
        max="5"
        show-ticks="always"
        label="Intensity"
        thumb-label="always"
        :disabled="true"
      ></v-slider>
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
          v-model="need.data.name"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="need.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        Impact
        <v-slider
          v-model="need.data.impact"
          step="1"
          max="5"
          show-ticks="always"
          label="Impact"
          thumb-label="always"
          :disabled="!editing"
        ></v-slider>

        Need owner: {{need.data.owner}}

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addNeed()"
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
            @click="updateNeed()"
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
            @click="deleteNeed()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import {Need} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      need:{
        id: null,
        data : {
          description:"",
          name:"",
          impact:1
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
        const selectedData = await Need.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.need = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addNeed () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Need.create(this.need.data)
          this.$store.commit('getNeeds')
          this.$store.commit('closeDetail')
        }
      },
      async updateNeed () {
        await this.$refs.form.validate();
        this.valid ? await Need.updateDoc(this.need.id,this.need.data) : console.log('not valid');
        this.$store.commit('getNeeds')
        this.$refs.form.resetValidation();
      },
      async deleteNeed () {
        Need.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getNeeds')
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
