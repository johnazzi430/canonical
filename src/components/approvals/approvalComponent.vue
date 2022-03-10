<template>
  <div>
    <v-dialog
      v-model="modal"
      persistent
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="!loggedInUserIsApprover"
          color="primary"
          dark
          v-bind="props"
        >
          Request Approvals
        </v-btn>
        <v-btn
          v-else
          color="primary"
          dark
          v-bind="props"
        >
          Approve
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
              <VueMultiselect
                v-model="approver.approver"
                :options="$store.state.users.map(doc => ({ id:doc.id, displayName:doc.displayName}))"
                track-by="id"
                label="displayName"></VueMultiselect>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch
                label="required"
                color="primary"
                :disabled="loggedInUserIsApprover"
                v-model="approver.required"/>
            </v-col>
            <v-col cols="12" sm="2" v-if="!loggedInUserIsApprover">
              <v-btn @click='approvers.splice(index,1)' icon="mdi-minus"></v-btn>
            </v-col>
            <v-col cols="12" sm="2" v-else>
              <v-btn
                v-if="approvers.splice(index,1).id === $store.state.users.uid"
                @click='approvers.splice(index,1)'
                >approve
              </v-btn>
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
//import {Approval,Draft} from "../../services/firebaseDataService";
import {Approval} from "../../services/firebaseDataService";
import VueMultiselect from 'vue-multiselect';

export default {
  components: {
    VueMultiselect,
  },
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
    approvalExists: false,
    loggedInUserIsApprover: false,
    modal: false,
    valid: false,
    approvers:[],
    approval: undefined
  }),
  async beforeMount(){
    this.$store.commit('getUsers')
    const approvalRec = await Approval.getByDoc(this.approvalParentDocId)
    if (approvalRec != undefined){
      this.approvalExists = true
      this.approval = approvalRec
      this.approvers = approvalRec.approvals
      if(approvalRec.approvals.filter(i => i.approver.id === this.$store.state.user.uid).length > 0 ) {
        this.loggedInUserIsApprover = true
      }
    }
  },
  methods:{
    async createApprovalRecord () {
      //// TODO:  check if valid
      //
      //create Approval Record
      const approvalDoc = await new Approval({
            docID:this.approvalParentDocId,
            docType:'product',
            approvals:this.approvers
          })
          .create()
      console.log(approvalDoc)
      //UpdateDraft
      // await Draft.updateDraftApproval(this.approvalParentDocId, approvalDoc)
    },
    async modifyApproverRecords () {
      //// TODO:  check if valid
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
