<template>
  <div class="">
    <hr>
    <v-card
      class="assumption-card"
      v-for="assumptionItem in assumptions"
      :key="assumptionItem">
      <v-list-item-subtitle class="">{{assumptionItem.creator.displayName}} on {{assumptionItem.data.createDate}}</v-list-item-subtitle>
      <v-card-text class="">{{assumptionItem.data.assumption}}</v-card-text>
      <!-- //TODO: editing and deleting assumptions -->
    </v-card>
    <hr>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-if="$store.getters.isUserLoggedIn"
    >
      <v-textarea
        v-model="newAssumption"
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
      </div>
    </v-form>
  </div>
</template>

<script>
import {Assumption} from "../../services/firebaseDataService";

export default {
    props: {
      docId: String,
      docType: String
    },
    data: () => ({
      valid: true,
      assumptions: [],
      newAssumption: "",
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 50 || 'Max 50 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      }
    }),
    async mounted(){
      this.assumptions = await Assumption.getAssumptionsByDocID(this.docType,this.docId)
      this.assumptions = this.assumptions.reverse()
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
          await new Assumption(assumptionPayload).createAssumption()
          this.assumptions = await Assumption.getAssumptionsByDocID(this.docType,this.docId)
        }
      },
      async editAssumption (id,updatedAssumption) {
        await this.$refs.form.validate();
        this.valid ? await Assumption.updateAssumption(id,updatedAssumption) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async deleteAssumption (id) {
        Assumption.deleteAssumption(id)
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
}

</style>
