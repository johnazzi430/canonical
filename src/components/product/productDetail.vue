<template>
  <div class="view-product">
    <h1 style="color:red" v-if="draft === true && reviewing === false">
      DRAFT
      <v-btn
      variant="outlined"
      color="teal accent-4"
      @click="openDraftCompare()" >
        Open Draft Compare
      </v-btn>
    </h1>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-if="draft === true && reviewing === false"
        v-model="draftName"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Draft Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-text-field
        v-model="product.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
      class="text-body-2"
        v-model="product.data.description"
        :rules="[rules.required]"
        label="Description"
        :disabled="!editing"
        required
      ></v-textarea>

      <!-- <v-row>
        <v-col cols="12" sm="4">
          Version:
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="product.data.version.major"
            :disabled="!editing"
            label="Major"
            single-line
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="product.data.version.minor"
            :disabled="!editing"
            label="Minor"
            single-line
            type="number"
          ></v-text-field>
        </v-col>
      </v-row> -->

      <v-select
        v-model="product.data.lifesCycleStage"
        :items="lifesCycleStageOptions"
        label="Life Cycle Stage"
        :disabled="!editing"
      ></v-select>

      <v-text-field
        v-model="product.data.githubLink"
        label="Github Link"
        :rules="[rules.url]"
        :disabled="!editing"
      ></v-text-field>

      <v-text-field
        v-model="product.data.url"
        label="Home Link"
        :rules="[rules.url]"
        :disabled="!editing"
      ></v-text-field>

      <h4>User Segments</h4>
      <div>
        <v-btn @click='personaNeedMap.push({persona: null,needs:[]})'>add row</v-btn>
        <v-row
            no-gutters
            v-for="(personaNeedItem, index) in personaNeedMap"
            v-bind:key='personaNeedItem'>
          <v-col cols="12" sm="4">
            <h4>Users</h4>
            <VueMultiselect
              v-model="personaNeedItem.persona"
              :options="$store.state.personas.map(doc => ({ id:doc.id, name:doc.data.name}))"
              track-by="id"
              label="name"></VueMultiselect>
          </v-col>
          <v-col cols="12" sm="6">
            <h4>Who Need To</h4>
            <VueMultiselect
              v-model="personaNeedItem.needs"
              :options="$store.state.needs.map(doc => ({ id:doc.id, name:doc.data.name}))"
              :multiple='true'
              track-by="id"
              label="name"></VueMultiselect>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn @click='personaNeedMap.splice(index,1)' icon="mdi-minus"></v-btn>
          </v-col>
        </v-row>
      </div>

      <br>
      <h4>Features</h4>
      <VueMultiselect
        v-model="features"
        :options="featureOptions.map(doc => ({ id:doc.id, name:doc.data.name}))"
        :multiple="true"
        track-by="id"
        label="name"></VueMultiselect>

      <br>
      <h4>Ideas</h4>
      <VueMultiselect
        v-model="ideas"
        :options="$store.state.ideas.map(doc => ({ id:doc.id, name:doc.data.idea}))"
        :multiple="true"
        track-by="id"
        label="name"></VueMultiselect>

      <br>
      <h4>Goals</h4>
      <VueMultiselect
        v-model="goals"
        :options="$store.state.goals.map(doc => ({ id:doc.id, name:doc.data.name}))"
        :multiple="true"
        track-by="id"
        label="name"></VueMultiselect>

      <br>
      <h4>Risks</h4>
      <VueMultiselect
          v-model="risks"
          :options="$store.state.risks.map(doc => ({ id:doc.id, name:doc.data.name}))"
          :multiple="true"
          track-by="id"
          label="name"></VueMultiselect>

      <br>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            SWOT Analysis (optional)
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.strengths"
                  label="Strengths"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.weakness"
                  label="Weakeness"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.opportunities"
                  label="Opportunities"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.threats"
                  label="Threats"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            Business Canvas (optional)
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.partners"
                  label="partners"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.customerEngagementModel"
                  label="Customer Engagement Model"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.businessModel"
                  label="Business Model"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="product.data.economicModel"
                  label="Economic Model"
                  :disabled="!editing"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <hr>

      <div v-if="id === null && reviewing === false">
        <v-btn
          color="success"
          class="mr-4"
          @click="addProduct()"
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
      <div v-if="editing === false && reviewing === false">
        <v-btn
          v-if="id != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
      <div v-if="id != null && editing === true && draft === false && reviewing === false">
        <!-- <v-btn
          color="success"
          class="mr-4"
          @click="updateProduct()"
        >Update Main
        </v-btn> -->
        <v-btn
          color="success"
          class="mr-4"
          @click="createDraft()"
        >Create Draft
        </v-btn>
        <v-text-field
          v-model="draftName"
          :counter="20"
          label="Draft Name"
          required
        />
        <v-btn
          color="info"
          class="mr-4"
          @click="editing = false; this.$store.commit('closeDetail')"
        >Cancel
        </v-btn>
        <v-btn
          color="error"
          class="mr-4"
          @click="deleteProduct()"
        >Delete
        </v-btn>
      </div>
      <div v-if="id != null && editing === true && draft === true && reviewing === false">
        <!-- <v-btn
          color="success"
          class="mr-4"
          @click="updateProduct()"
        >Update Main
        </v-btn> -->
        <v-row class="detail-row">
          Version change:
          <v-radio-group v-model="draftChangeType">
            <v-radio value='minor' label='minor'></v-radio>
            <v-radio value='major' label='major'></v-radio>
          </v-radio-group>
          <div v-if="draftChangeType==='major'">New Version = {{product.data.version.major+1}}.{{product.data.version.minor}}</div>
          <div v-else>New Version = {{product.data.version.major}}.{{product.data.version.minor+1}}</div>
        </v-row>
        <v-row class="detail-row">
          <v-btn
            color="success"
            class="mr-4"
            @click="updateDraft()"
          >Update Draft
          </v-btn>
          <!-- <v-btn
            color="success"
            class="mr-4"
            @click="updateProduct()"
          >Update Product with Draft
          </v-btn> -->

          <approvalComponent :approvalParentDocId='id'/>
        </v-row>
      </div>
    </v-form>

    <div v-if="draft===false">
      <h4>Drafts:</h4>
      <v-chip-group
        active-class="primary--text"
        column
      >
        <v-chip
          v-for="draft in drafts"
          :key="draft"
          @click="$emit('selectDraft', {index:draft.id, source:'product',draft:true})"
        >
          {{draft.draftName}}
        </v-chip>
      </v-chip-group>
    </div>

  </div>
</template>

<script>
import {Product,Draft} from "../../services/firebaseDataService";
import approvalComponent from "../approvals/approvalComponent";
import VueMultiselect from 'vue-multiselect';
import _ from 'lodash';

export default {
  components: {
    approvalComponent,
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
      editing: false,
      valid: true,
      loading:true,
      isDraft: false,
      waitingForApproval:false,
      personaNeedMap:[],
      product:{
        id: null,
        data : {
          name:'',
          description:'Value Proposition:',
          archived : false,
          businessModel: "",
          createDate: null,
          createdBy:"",
          updatedDate:"",
          githubLink:"",
          url:"",
          version:{
            major:0,
            minor:1
          },
          lifesCycleStag: "POC",
          partners: "",
          customerEngagementModel:"",
          economicModel:"",
          weaknesses:"",
          strengths: "",
          threats:"",
          opportunities:'',
          features: [],
          personaNeedMap: [],
          ideas:[],
          goals:[],
          risks:[],
        }
      },
      features:[],
      ideas:[],
      goals:[],
      risks:[],
      draftChangeType:"minor",
      drafts:[],
      draftName:"",
      draftData: {},
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          // eslint-disable-next-line
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      },
      lifesCycleStageOptions: ["POC","MVP","Growth","Scale","Monetization","Decline"],
      select: null,
      checkbox: false,
    }),
    async beforeMount(){
      this.$store.commit('getPersonas')
      this.$store.commit('getNeeds')
    },
    methods: {

      async modifyRelationalFields(id){
        if (this.featuresChanged) {await Product.updateDocField(id,'features',this.features)}
        if (this.personaNeedMapChanged ){ await Product.updateDocField(id,'personaNeedMap',this.personaNeedMap)}
        if (this.ideasChanged ){ await Product.updateDocField(id,'ideas',this.ideas)}
        if (this.goalsChanged ){ await Product.updateDocField(id,'goals',this.goals)}
        if (this.risksChanged ){ await Product.updateDocField(id,'risks',this.risks)}
      },

      async addProduct () {
        await this.$refs.form.validate();
        if (this.valid ){
          const newProduct = await Product.create(this.product.data)
          await this.modifyRelationalFields(newProduct.id)
          this.$store.commit('closeDetail')
          this.$store.commit('getProducts')
        }
      },
      async createDraft(){
        await this.$refs.form.validate();
        if(!this.valid){console.warn('invalid'); return}
        const draftData = {
          draftName: this.draftName != '' ? this.draftName : this.product.data.name + ' v:' +this.product.data.version.major +'.'+this.product.data.version.minor+ ' draft',
          parentID: this.product.id,
          parentType:'products',
          parentVersion:{
            major: this.product.data.version.major,
            minor: this.product.data.version.minor
          },
          docData:{
              ...this.product.data,
              personaNeedMap:this.personaNeedMap,
              features:this.features,
              ideas:this.ideas,
              goals:this.goals,
              risks:this.risks,
          }
        }
        const draft = await new Draft(draftData).create()
        this.$emit('selectDraft', {index:draft.id,source:'product',draft:true})
        this.$store.commit('selectItem',{index:draft.id,source:'product'})
      },
      async updateDraft () {
        await this.$refs.form.validate();
        this.valid ? await Draft.updateDoc(this.id, this.product,this.draftName) : console.warn('not valid');
        // this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },
      async updateProduct () {
        await this.$refs.form.validate();
        this.valid ? await Product.updateDoc(this.product.id, this.product.data) : console.warn('not valid');
        await this.modifyRelationalFields(this.product.id)
        this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },
      async deleteProduct () {
        await Product.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },

      resetForm () {
        this.$refs.form.reset()
      },

      openDraftCompare(){
        this.$router.push({
            path:'/draft',
            query: {
              draft:this.product.id,
              parent:this.draftData.parentID,
              docType:this.draftData.parentType
            }
          })
      }
    },
    computed:{
      featureOptions(){
        return this.$store.state.features;
      },

      selected() {
        return this.$store.state.selected
      },

      featuresChanged(){
        return !_.isEqual(this.features , this.product.data.features)
      },

      personaNeedMapChanged(){
        return !_.isEqual(this.personaNeedMap , typeof this.product.data.personaNeedMap != 'undefined' ? this.product.data.personaNeedMap : [])
      },

      ideasChanged(){
        return !_.isEqual(this.ideas , typeof this.product.data.ideas != 'undefined' ? this.product.data.ideas : [])
      },

      goalsChanged(){
        return !_.isEqual(this.goals , typeof this.product.data.goals != 'undefined' ? this.product.data.goals : [])
      },

      risksChanged(){
        return !_.isEqual(this.risks , typeof this.product.data.risks != 'undefined' ? this.product.data.risks : [])
      },

      //Need to check if data fields change before validating in relational stuff
    },
    watch:{
      id: {
        immediate: true,
        async handler(){
          if (this.draft === false && this.id != null) {
            const selectedData = await Product.getDocById(this.id)
            if(typeof selectedData.data === 'undefined'){
              this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
              return
            }
            this.product = JSON.parse(JSON.stringify(selectedData));
            this.drafts = await Draft.getDocByParentId(this.id)
            this.loading = false;
          } else if (this.draft === true) {
            const selectedData = await Draft.getDocById(this.id)
            this.product = {
              id: this.id,
              data: selectedData.data.docData,
            }
            this.draftData = {
              parentID: selectedData.data.parentID,
              parentType:'products',
              parentVersion:{
                major: selectedData.data.parentVersion.major,
                minor: selectedData.data.parentVersion.minor
              },
            }
            this.draftName = selectedData.data.draftName,
            this.isDraft = true;
            this.loading = false;
            // this.respondToRouteChanges = false;
            // this.$router.replace({query: { draft:true}})
            //     .finally(() => {this.respondToRouteChanges = true});
          } else {
            this.editing = true
          }
        }
      },

      'product.data.features'(){
        this.features = this.product.data.features
      },

      'product.data.personaNeedMap'(){
        this.personaNeedMap = typeof this.product.data.personaNeedMap != 'undefined' ? this.product.data.personaNeedMap : []
      },

      'product.data.ideas'(){
        this.ideas = typeof this.product.data.ideas != 'undefined' ? this.product.data.ideas : []
      },

      'product.data.goals'(){
        this.goals = typeof this.product.data.goals != 'undefined' ? this.product.data.goals : []
      },

      'product.data.risks'(){
        this.risks = typeof this.product.data.risks != 'undefined' ? this.product.data.risks : []
      },

      'product.draftName'(){
        this.draftName = typeof this.product.draftName != 'undefined' ? this.product.draftName : ""
      },
    }
  }
</script>

<style lang="scss">

.view-product{
  .v-input{
    margin-bottom:-30px;
  }

  .v-field{
      font-size: 14px !important;
  }
}

.detail-row{
  margin: 4px;
}
</style>
