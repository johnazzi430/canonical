<template>
  <div>
    <v-dialog
      v-model="modal"
      persistent
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          dark
          v-bind="props"
        >
          Request Approvals
        </v-btn>
      </template>
      <v-card
      style="width:500px"
      class ="approvals">
        <v-card-title class="text-h5">
          Add approvals to you change
        </v-card-title>

        <div>
          <v-btn @click='approvers.push({approver: null,required:true})'>add row</v-btn>
          <v-row
            style="height: 60px"
            no-gutters
            v-for="(approver, index) in approvers"
            v-bind:key='approver'>
            <v-col cols="12" sm="7">
              <v-select
                v-model="approver.approver"
                :items="$store.state.users.map(d => d.displayName)"
                label="approver"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch label="required" color="primary" v-model="approver.required"/>
            </v-col>
            <v-col cols="12" sm="2">
              <v-btn @click='approvers.splice(index,1)' icon="mdi-minus"></v-btn>
            </v-col>
          </v-row>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="createApprovalRecord"
          >
            Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script type="text/javascript">
import {Approval,Draft} from "../../services/firebaseDataService";

export default {
  props: {
        approvalParentDocId:{
          default: "",
          type: String
        },
        approvalId:{
          default: "",
          type: String
        },
  },
  data: () => ({
    modal: false,
    approvers:[],
    valid: false
  }),
  async beforeMount(){
    this.$store.commit('getUsers')
  },
  methods:{
    async getApprovals () {

    },
    async createApprovalRecord () {
      //// TODO:  check if valid
      //
      //create Approval Record
      const approvalDoc = await new Approval({
            docID:this.approvalParentDocId,
            docType:'product',
            approvals:this.approvers
          })
          .createApprovalRecord()
      //UpdateDraft
      await Draft.updateDraftApproval(this.approvalParentDocId, approvalDoc)
    },
    async closeApprovalModal () {

    },
  }
}
</script>

<style>

/* .v-dialog{
  max-width: 100vw !important;
} */

/* .approvals{
  width: 750px;
} */

</style>
