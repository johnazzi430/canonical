<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{risk.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{risk.data.description}}</p>
      <br>
      <h3>Impact</h3>
      <v-slider
        v-model="risk.data.impact"
        step="1"
        max="5"
        show-ticks="always"
        label="Impact"
        thumb-label="always"
        :disabled="!editing"
      ></v-slider>
      <h3>Uncertainty</h3>
      <v-slider
        v-model="risk.data.uncertainty"
        step="1"
        max="5"
        show-ticks="always"
        label="Uncertainty"
        thumb-label="always"
        :disabled="!editing"
      ></v-slider>
      risk owner: {{risk.data.owner}}
      <div v-if="editing === false">
        <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
    </div>
    <div v-else>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="risk.data.name"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="risk.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        Impact
        <v-slider
          v-model="risk.data.impact"
          step="1"
          max="5"
          show-ticks="always"
          label="Impact"
          thumb-label="always"
          :disabled="!editing"
        ></v-slider>

        Uncertainty
        <v-slider
          v-model="risk.data.uncertainty"
          step="1"
          max="5"
          show-ticks="always"
          label="Impact"
          thumb-label="always"
          :disabled="!editing"
        ></v-slider>

        Risk owner: {{risk.data.owner}}

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addRisk()"
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
            @click="updateRisk()"
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
            @click="deleteRisk()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import {Risk} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      risk:{
        id: null,
        data : {
          description:"",
          name:"",
          impact:3,
          uncertainty:3
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
        const selectedData = await Risk.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.risk = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addRisk () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Risk.create(this.risk.data)
          this.$store.commit('getRisks')
          this.$store.commit('closeDetail')
        }
      },
      async updateRisk () {
        await this.$refs.form.validate();
        this.valid ? await Risk.updateDoc(this.risk.id,this.risk.data)  : console.log('not valid');
        this.editing = false;
        this.$store.commit('getRisks')
        this.$refs.form.resetValidation();
      },
      async deleteRisk () {
        Risk.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getRisks')
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
