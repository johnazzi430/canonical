<template>
  <div class="">
    <h1 style="color:red" v-if="draft === true">DRAFT</h1>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="product.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="product.data.description"
        :rules="[rules.required]"
        label="Description"
        :disabled="!editing"
        required
      ></v-textarea>

      <v-row>
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
      </v-row>

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
            style="height: 60px;"
            no-gutters
            v-for="(personaNeedItem, index) in personaNeedMap"
            v-bind:key='personaNeedItem'>
          <v-col cols="12" sm="4">
            <v-select
              dense
              v-model="personaNeedItem.persona"
              :items="$store.state.personas.map(d => d.data.name)"
              attach
              chips
              label="User Segment"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              dense
              v-model="personaNeedItem.needs"
              :items="$store.state.needs.map(d => d.data.name)"
              attach
              chips
              label="Needs"
              multiple
            ></v-select>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn @click='personaNeedMap.splice(index,1)' icon="mdi-minus"></v-btn>
          </v-col>
        </v-row>
      </div>

      <h4>Features</h4>
      <v-select
            v-model="product.data.features"
            :items="featureOptions"
            label="Select"
            single-line
            multiple>
      </v-select>

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

      <div v-if="selected.index === null">
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
      <div v-if="editing === false">
        <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
      <div v-if="selected.index != null && editing === true && draft === false">
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
      <div v-if="selected.index != null && editing === true && draft === true">
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
          @click="$emit('selectDraft', {index:draft.id,source:'product',draft:true})"
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

export default {
  components: {
    approvalComponent,
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
        }
    },
    data: () => ({
      editing: true,
      valid: true,
      loading:true,
      isDraft: false,
      waitingForApproval:false,
      personaNeedMap:[],
      product:{
        id: null,
        personas:[],
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
        }
      },
      draftChangeType:"minor",
      drafts:[],
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
      if (this.selected.index != null){
        this.$store.commit('getPersonas')
        this.$store.commit('getNeeds')
        this.drafts = await Draft.getDraftByParentId(this.id)
        if (this.draft === false && this.id != null) {
          const selectedData = await Product.getProductById(this.id)
          this.product = JSON.parse(JSON.stringify(selectedData));
          this.loading=false;
        } else if (this.draft === true) {
          const selectedData = await Draft.getDraftById(this.id)
          this.product = {
            id: this.id,
            data: selectedData.data.docData,
            product: []
          }
          this.isDraft = true;
          this.loading=false;
        }
      }
    },
    methods: {
      async addProduct () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Product.createProduct(this.product.data)
          this.$store.commit('closeDetail')
          this.$store.commit('getProducts')
        }
      },
      async createDraft(){
        await this.$refs.form.validate();
        if(!this.valid){console.warn('invalid'); return}
        const draftData = {
          draftName: this.product.data.name + ' v:' +this.product.data.version.major +'.'+this.product.data.version.minor+ ' draft',
          parentID: this.product.id,
          parentType:'products',
          parentVersion:{
            major: this.product.data.version.major,
            minor: this.product.data.version.minor
          },
          docData:this.product
        }
        const draft = await new Draft(draftData).createDraft()
        this.$store.commit('selectItem',{index:draft.id,source:'product'})
      },
      async updateDraft () {
        await this.$refs.form.validate();
        this.valid ? await Draft.updateDraft(this.id, this.product.data) : console.warn('not valid');
        // this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },
      async updateProduct () {
        await this.$refs.form.validate();
        this.valid ? await Product.updateProduct(this.product.id, this.product.data) : console.warn('not valid');
        this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },
      async deleteProduct () {
        await Product.deleteProduct(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getProducts')
        this.$refs.form.resetValidation();
      },
      resetForm () {
        this.$refs.form.reset()
      },
    },
    computed:{
      featureOptions(){
//        return [{id:'test',name:'test'}]
        return this.$store.state.features.map(doc => (doc.data.name));
      },

      selected() {
        return this.$store.state.selected
      },

      //Need to check if data fields change before validating in relational stuff
    },
  }
</script>

<style scoped>

.detail-row{
  margin: 4px;
}
</style>
