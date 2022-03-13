<template>
  <div class="">

    <div v-if="!editing">
      <h2>{{feature.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{feature.data.description}}</p>
      <br>
      <h3>Priority</h3>
      <v-slider
        v-model="feature.data.priority"
        step="1"
        max="5"
        show-ticks="always"
        label="Priority"
        thumb-label="always"
        :disabled="true"
      ></v-slider>

      <v-chip v-if="feature.data.jiraLink.lenght>0" :href="feature.data.jiraLink" target="_blank">
        <v-icon>mdi-jira</v-icon>
      </v-chip>

      <h3 v-if="feature.data.leadingIndicators.length > 0">Leading Indicators</h3>
      <p>{{feature.data.leadingIndicators}}</p>
      <h3 v-if="feature.data.businessOutcomes.length > 0">Business Outcomes</h3>
      <p>{{feature.data.businessOutcomes}}</p>
      <h3 v-if="feature.data.nonFunctionalRequirements.length > 0">Non Functional Requirements (NFRs)</h3>
      <p>{{feature.data.nonFunctionalRequirements}}</p>

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
          v-model="feature.data.name"
          :counter="42"
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
          color="primary"
          :label="`delivered: ${feature.data.delivered}`"
        ></v-switch>

        <v-switch
          v-model="feature.data.validated"
          color="primary"
          :label="`validated: ${feature.data.validated}`"
        ></v-switch>

        <!-- <v-select
          :v-model="feature.product"
          :items="$store.state.products"
          return-object
          item-text='data.name'
          item-value='id'
          label="feature"
          required
        ></v-select> -->

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
  </div>
</template>

<script>
import {Feature,Product} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      feature:{
        id: null,
        product: {},
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
          validated:false,
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
        const selectedData = await Feature.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.feature = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addFeature () {
        await this.$refs.form.validate();
        if (!this.valid ){
          this.$store.commit('alert',{type:'error',message:'Invalid',autoClear:true})
          return
        }
        await Feature.create(this.feature.data)
        this.$store.commit('getFeatures')
        this.$store.commit('closeDetail')
      },
      async updateFeature () {
        await this.$refs.form.validate();
        if(!this.valid){
          this.$store.commit('alert',{type:'error',message:'Invalid',autoClear:true})
          return
        }
        await Feature.updateDoc(this.feature.id,this.feature.data)
        this.$store.commit('getFeatures')
        this.$refs.form.resetValidation();
      },
      async updateProductRel(){
//        await Product.updateProductRel('GDnNvXVDdFF7GPQH0hMt','features',[],[this.feature.id])
        await Product.updateProductRel('GDnNvXVDdFF7GPQH0hMt','features',['test'],['test feature'])
        return;
      },
      async deleteFeature () {
        Feature.deleteDoc(this.selected.index)
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
