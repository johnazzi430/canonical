<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="feature.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="feature.data.description"
        :rules="[rules.required]"
        label="Description"
        :disabled="!editing"
        required
      ></v-textarea>

      priority
      <v-slider
        v-model="feature.data.priority"
        step="1"
        max="5"
        show-ticks="always"
        label="Priority"
        thumb-label="always"
        :disabled="!editing"
      ></v-slider>

      <v-text-field
        v-model="feature.data.jiraLink"
        label="Github Link"
        :rules="[rules.url]"
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="feature.data.leadingIndicators"
        label="leading indicators"
        :disabled="!editing"
      ></v-textarea>

      <v-textarea
        v-model="feature.data.businessOutcomes"
        label="Business Outcomes"
        :disabled="!editing"
      ></v-textarea>

      <v-textarea
        v-model="feature.data.nonFunctionalRequirements"
        label="Non Functional Requirements"
        :disabled="!editing"
      ></v-textarea>

      <v-switch
        v-model="feature.data.delivered"
        :label="`delivered: ${feature.data.delivered}`"
      ></v-switch>

      <v-switch
        v-model="feature.data.validated"
        :label="`validated: ${feature.data.validated}`"
      ></v-switch>

      Feature owner: {{feature.data.owner}}

      <hr>

      <div v-if="selected.index === null">
        <v-btn
          color="success"
          class="mr-4"
          @click="addFeature()"
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
          v-if="selected.index != null"
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
          @click="updateFeature()"
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
          @click="deleteFeature()"
        >Delete
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {Feature} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      feature:{
        id: null,
        data : {
          businessOutcomes:"",
          delivered: false,
          description:"",
          jiraLink:"",
          leadingIndicators:"",
          name:"",
          nonFunctionalRequirements:"",
          owner:null,
          priority:1,
          validated:false
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
    beforeMount(){
      if (this.selected.index != null){
        const selectedData = this.$store.state.features.find(doc => doc.id === this.selected.index)
        this.editing = false;
        this.feature = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addFeature () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Feature.createFeature(this.feature.data)
          this.$store.commit('getFeatures')
          this.$store.commit('closeDetail')
        }
      },
      async updateFeature () {
        await this.$refs.form.validate();
        // let Product = new product()
        // this.valid ? await Product.createProduct(this.product.data) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async deleteFeature () {
        Feature.deleteFeature(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getFeatures')
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
