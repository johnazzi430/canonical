<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{insight.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{insight.data.description}}</p>
      <br>
      <h4>Intensity</h4>
      <v-slider
        v-model="insight.data.intensity"
        step="1"
        max="5"
        show-ticks="always"
        label="Intensity"
        thumb-label="always"
        :disabled="true"
      ></v-slider>
      <br>
      <h4>Opportunity</h4>
      <p>{{insight.data.opportunity}}</p>
      <br>
      <label style="width:50%;" class="font-weight-light">Experience Vector: </label> <span style="width:50%;">{{insight.data.vector}}</span>
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
          v-model="insight.data.name"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="insight.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        <v-text-field
          v-model="insight.data.opportunity"
          label="Opportunity"
          :disabled="!editing"
        ></v-text-field>

        <v-select
          v-model="insight.data.vector"
          :items="['negative','neutral','positive']"
          label="Emotinal vector"
          :disabled="!editing"
        ></v-select>

        <h4>Intensity</h4>
        <v-slider
          v-model="insight.data.intensity"
          step="1"
          max="5"
          show-ticks="always"
          label="Intensity"
          thumb-label="always"
          :disabled="!editing"
        ></v-slider>

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addInsight()"
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
            @click="updateInsight()"
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
            @click="deleteInsight()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>

  </div>
</template>

<script>
import {Insight} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      insight:{
        id: null,
        data : {
          description:"",
          name:"",
          opportunity:"",
          Intensity:1,
          vector:'neutral'
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
        const selectedData = await Insight.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.insight = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addInsight () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Insight.create(this.insight.data)
          this.$store.commit('getInsights')
          this.$store.commit('closeDetail')
        }
      },
      async updateInsight () {
        await this.$refs.form.validate();
        this.valid ? await Insight.updateDoc(this.insight.id,this.insight.data)  : console.log('not valid');
        this.$store.commit('getInsights')
        this.$refs.form.resetValidation();
      },
      async deleteInsight () {
        Insight.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getInsights')
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
