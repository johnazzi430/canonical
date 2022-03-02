<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="product.data.name"
        :counter="10"
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

      <v-text-field
        v-model="product.data.version"
        label="Version"
        :disabled="!editing"
      ></v-text-field>

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
          @click="updateProduct()"
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
          @click="deleteProduct()"
        >Delete
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {product} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      product:{
        id: null,
        data : {
          name:'',
          description:'',
          archived : false,
          businessModel: "",
          createDate: null,
          createdBy:"",
          updatedDate:"",
          githubLink:"",
          url:"",
          version:"",
          lifesCycleStag: "POC",
          partners: "",
          customerEngagementModel:"",
          economicModel:"",
          weaknesses:"",
          strengths: "",
          threats:"",
          opportunities:''
        }
      },
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
    beforeMount(){
      if (this.selected.index != null){
        const selectedData = this.$store.state.products.find(doc => doc.id === this.selected.index)
        this.editing = false;
        this.product = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addProduct () {
        await this.$refs.form.validate();
        let Product = new product()
        this.valid ? await Product.createProduct(this.product.data) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async updateProduct () {
        await this.$refs.form.validate();
        // let Product = new product()
        // this.valid ? await Product.createProduct(this.product.data) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async deleteProduct () {
        // await this.$refs.form.validate();
        // let Product = new product()
        // this.valid ? await Product.createProduct(this.product.data) : console.log('not valid');
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
