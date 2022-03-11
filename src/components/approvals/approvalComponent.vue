<template>
  <div v-if="!isApproved">
    <v-dialog
      v-model="modal"
      persistent
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="loggedInUserIsApprover"
          color="primary"
          dark
          v-bind="props"
        >
          Review and Approve
        </v-btn>
        <v-btn
          v-else-if="approvalExists"
          color="primary"
          dark
          v-bind="props"
        >
          Review Approvals
        </v-btn>
        <v-btn
          v-else
          color="primary"
          dark
          v-bind="props"
        >
          Add Approvers
        </v-btn>
      </template>
      <v-card
      style="width:800px"
      class ="approvals">

        <div v-if="loggedInUserIsApprover">
          <v-card-title class="text-h5">
            Review
          </v-card-title>
          <v-textarea
              type="text"
              v-model="newComment"
          />
        <v-card-actions>
          <v-btn outlined @click='approve()'>Reviewed and Approve</v-btn>
          <v-btn outlined @click='reviewAndComment()'>Reviewed with Comments</v-btn>
          <v-btn text @click="modal = false">cancel</v-btn>
        </v-card-actions>
        </div>
        <div v-else-if="approvalExists">
          Placeholder for reviewing existing approvals
        </div>
        <div v-else>
          <v-card-title class="text-h5">
            Add approvals to you change
          </v-card-title>
          <v-btn @click='approverRecords.push({approver: null,required:true})'>add row</v-btn>
          <v-row
            style="height: 60px"
            no-gutters
            v-for="(approverItem, index) in approverRecords"
            v-bind:key='index'>
            <v-col cols="12" sm="7">
              <VueMultiselect
                v-model="approverItem.approver"
                :options="$store.state.users.map(doc => ({ id:doc.id, displayName:doc.displayName}))"
                track-by="id"
                label="displayName"></VueMultiselect>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch
                label="required"
                color="primary"
                :disabled="loggedInUserIsApprover"
                v-model="approverItem.required"/>
            </v-col>
            <v-col cols="12" sm="2" v-if="!loggedInUserIsApprover">
              <v-btn @click='approverRecords.splice(index,1)' icon="mdi-minus"></v-btn>
            </v-col>
            <v-col cols="12" sm="2" v-else>
              <v-btn
                v-if="approverItem.approver.id === $store.state.user.uid"
                @click='approverRecords.splice(index,1)'
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
import {Approval,Comment} from "../../services/firebaseDataService";
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
        approvaldocType:{
          default: "",
          type: String
        },
  },
  data: () => ({
    approvalExists: false,
    loggedInUserIsApprover: false,
    modal: false,
    valid: false,
    approverRecords:[],
    approval: undefined,
    newComment:"",
    isApproved:false
  }),
  async beforeMount(){
    this.$store.commit('getUsers')
    const approvalRec = await Approval.getByDoc(this.approvalParentDocId)
    if (approvalRec != undefined){
      this.approvalExists = true
      this.approval = approvalRec
      this.approverRecords = approvalRec.approvals
      this.isApproved = approvalRec.isApproved
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
            docType:this.approvaldocType,
            approvals:this.approverRecords
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
    async addComment () {
      const commentPayload = {
          docID: this.approvalParentDocId,
          docType: this.approvaldocType,
          comment: this.newComment
        }
      await new Comment(commentPayload).createComment()
      return
    },

    async approve(){
      await this.addComment()
      await Approval.approve(this.approval.id)

    },
    async reviewAndComment(){
      await this.addComment()
      await Approval.review(this.approval.id)
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
