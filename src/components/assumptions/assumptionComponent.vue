<template>
  <div class="">
    <v-card
      class="assumption-card"
      v-for="(assumptionItem, index) in assumptions"
      :key="assumptionItem"
      density="compact">
      <div v-if="assumptionItem.editing===false">
        <v-card-subtitle class="">{{assumptionItem.data.createdBy}} on {{assumptionItem.data.createDate}}</v-card-subtitle>
        <v-card-title>{{assumptionItem.data.name}}</v-card-title>
        <v-card-text style="white-space: pre-line">{{assumptionItem.data.details}}</v-card-text>
        <v-card-actions>
          <v-btn
            variant="text"
            color="teal accent-4"
            @click="editAssumption(index)"
          >
            Edit
          </v-btn>
          <v-btn
            variant="text"
            color="red accent-4"
            @click="closeAssumption(index)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </div>
      <div v-else>
        <v-card-subtitle class="">{{assumptionItem.data.createdBy}} on {{assumptionItem.data.createDate}}</v-card-subtitle>
        <v-text-field
          style ="margin: 0px 0px -25px 0px"
          v-model="assumptionItem.data.name"
          :counter="30"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
          density="compact"
        />
        <v-textarea
          style ="margin: -25px 0px"
          v-model="assumptionItem.data.details"
          :rules="[rules.required]"
          label="Description"
          required
          rows="3"
          density="compact"
        />
        <v-card-actions>
          <v-btn
            variant="text"
            color="teal accent-4"
            @click="submitAssumptionEdit(index)"
          >
            Submit
          </v-btn>
          <v-btn
            variant="text"
            color="red accent-4"
            @click="cancelEditAssumption(index)"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </div>


      <!-- //TODO: editing and deleting assumptions -->
    </v-card>
    <v-btn
      v-if="addingAssumption === false"
      color="success"
      class="mr-4"
      @click="addingAssumption = !addingAssumption"
    >
      Add Assumption
    </v-btn>
    <v-card v-if="addingAssumption === true" class = "assumption-card">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        v-if="$store.getters.isUserLoggedIn"
      >

        <v-text-field
          style ="margin: 0px 0px -25px 0px"
          v-model="newAssumption.name"
          :counter="30"
          :rules="[rules.required,rules.counter]"
          label="Name"
          required
        ></v-text-field>

        <v-textarea
          style ="margin: -25px 0px"
          rows="3"
          density="compact"
          v-model="newAssumption.details"
          :counter="50"
          :rules="[rules.required,rules.counter]"
          required
        ></v-textarea>

        <div>
          <v-btn
            color="success"
            class="mr-4"
            @click="addAssumption()"
          >
            Add Assumption
          </v-btn>
          <v-btn
            color="success"
            class="mr-4"
            @click="addingAssumption = !addingAssumption"
          >
            Cancel
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {Assumption} from "../../services/firebaseDataService";

export default {
  props: {
    docId:{type: String},
    docType:{type: String},
  },
    data: () => ({
      valid: true,
      assumptions: [],
      addingAssumption: false,
      newAssumption: {
        name:"",
        details:"Given:\nWhen:\nThen:",
        score:0
      },
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 250 || 'Max 250 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      }
    }),
    async mounted(){
      this.assumptions = await Assumption.getByDocID(this.docType,this.docId)
      this.assumptions = this.assumptions.reverse()
      this.assumptions.forEach((item) => {
        item.editing = false;
      });

    },
    methods: {
      async addAssumption () {
        await this.$refs.form.validate();
        if (this.valid ){
          const assumptionPayload = {
            docID: this.docId,
            docType: this.docType,
            assumption: this.newAssumption
          }
          await new Assumption(assumptionPayload).create()
          this.assumptions = await Assumption.getByDocID(this.docType,this.docId)
          this.addingAssumption = false;
        }
      },
      editAssumption (index) {
        this.assumptions[index].editing = true;
      },
      cancelEditAssumption (index) {
        this.assumptions[index].editing = false;
      },
      async submitAssumptionEdit (id,updatedAssumption) {
        await this.$refs.form.validate();
        this.valid ? await Assumption.updateDoc(id,updatedAssumption) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async closeAssumption (id) {
        Assumption.deletedoc(id)
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

<style scoped>

.assumption-card{
  margin:4px;
  padding:4px;
  border:1px lightgrey solid;
  border-left: 10px teal solid;
}

</style>
