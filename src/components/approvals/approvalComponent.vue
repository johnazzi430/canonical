<template>
  <v-row justify="center">
    <v-dialog
      v-model="modal"
      persistent
      max-width="290"
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
      <v-card class ="approvals">
        <v-card-title class="text-h5">
          Add approvals to you change
        </v-card-title>

        <div>
          <v-btn @click='approvers.push({id: null,required:true})'>add row</v-btn>
          <v-row v-for="(approver, index) in approvers" v-bind:key='approver'>
            <v-col cols="12" sm="8">
              <v-select
                v-model="approver.id"
                :items="$store.state.users.map(d => d.displayName)"
                label="approver"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="2">
              <v-switch label="required" color="primary" v-model="approver.required"/>
            </v-col>
            <v-col cols="12" sm="2">
              <v-btn @click='approvers.splice(index,1)'>-</v-btn>
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
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>



<script type="text/javascript">
import {Approval} from "../../services/firebaseDataService";

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
    approvers:[]
  }),
  async beforeMount(){
    this.$store.commit('getUsers')
  },
  methods:{
    async getApprovals () {

    },
    async createApprovalRecord () {
        await new Approval().createApproval()
    },
    async closeApprovalModal () {

    },
  }
}
</script>

<style>

.v-dialog{
  max-width: 100vw !important;
}

.approvals{
  width: 750px;
}

</style>
