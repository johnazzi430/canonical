<template id="">
      <v-container>
        <v-row  style="height:100px">
          <v-btn v-if="draftSelected===true" @click="draftSelected = !draftSelected">Return
          </v-btn>
          <h1>Changes</h1>
        </v-row>
        <v-row style="margin:4px">
          <div v-if="draftSelected===false" class="view-drafts">
            <v-row style="margin:4px" class="approvals">
              <h2>Pending Approvals</h2>
              <table class="draft-table">
                <tr>
                  <th v-for="col in approvalHeaders" :key="col.text">
                    {{col.text}}
                  </th>
                </tr>
                <tr v-for="row in $store.state.approvals" :key="row.id">
                  <td v-for="col in approvalHeaders" :key="col.text">
                    {{row[col.value]}}
                  </td>
                </tr>
              </table>
            </v-row>
            <v-row style="margin:4px" class="drafts">
              <h2>Drafts</h2>
              <table class="draft-table">
                <tr>
                  <th></th>
                  <th v-for="col in draftHeaders" :key="col.text">
                    {{col.text}}
                  </th>
                </tr>
                <tr v-for="row in $store.state.drafts" :key="row.id">
                  <td>
                    <v-btn @click="openDraftCompare(row)">open</v-btn>
                  </td>
                  <td v-for="col in draftHeaders" :key="col.text">
                    {{col.function(row)}}
                  </td>
                </tr>
              </table>
            </v-row>
          </div>
          <div v-else class="view-changes">
            <v-row class="header">
            </v-row>
            <v-row class="changes">
              <v-col cols="12" sm="8">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-card outlined tile>
                      <v-card-title>
                        Current Version
                      </v-card-title>
                      <productDetail
                      :draft='false'
                      :reviewing = 'true'
                      :key='draftSelectedValues.parentID'
                      :id='draftSelectedValues.parentID'/>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card outlined tile>
                      <v-card-title>
                        Proposed Draft
                      </v-card-title>
                      <productDetail
                      :draft='true'
                      :reviewing ='true'
                      :key='draftSelectedValues.draftID'
                      :id='draftSelectedValues.draftID'/>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="4">
                <v-container v-if="draftSelectedValues.approvalRecords">
                  <v-btn @click="$router.push({
                      path:'/product/'+draftSelectedValues.parentType.slice(0, -1)+'/' + draftSelectedValues.draftID,
                      query:{draft:true}} )">Update Draft</v-btn>
                  <h2>approvals</h2>
                  <v-list
                    style="margin:-4px"
                    density="compact"
                    v-for="item in draftSelectedValues.approvalRecords.approvals"
                    :key="item"
                    >
                    <v-list-item>
                      <v-list-item-avatar left>
                        <v-avatar
                            size="32"
                            color="black">
                          <span
                            class="white--text text-h5">
                            {{item.approver.displayName[0].toUpperCase()}}</span>
                          </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-title>
                        {{item.approver.displayName}}
                      </v-list-item-title>
                      <v-list-item-avatar class="approval-record"
                        right v-if="item.approved">
                        <v-icon>mdi-checkbox-marked</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-avatar class="approval-record"
                        right v-else>
                        <v-icon>mdi-checkbox-blank-outline</v-icon>
                      </v-list-item-avatar>

                    </v-list-item>
                  </v-list>
                </v-container>
                <v-container>
                  <approvalComponent
                      :approvalParentDocId='draftSelectedValues.draftID'
                      :approvaldocType='draftSelectedValues.parentType'/>
                  <div v-if="draftSelectedValues.approvalRecords">
                    <v-btn v-if="draftSelectedValues.approvalRecords.isApproved"
                      > Merge </v-btn>
                  </div>
                </v-container>
                <v-container>
                  <h2>comments</h2>
                  <comment
                    v-if='draftSelectedValues.draftID != ""'
                    :doc-id='draftSelectedValues.draftID'
                    :doc-type='draftSelectedValues.parentType'
                    :key="draftSelectedValues.draftID"/>
                </v-container>
              </v-col>
            </v-row>
            <v-row class="comments">
            </v-row>
          </div>
        </v-row>
      </v-container>
</template>

<script type="text/javascript">
import productDetail from "../product/productDetail";
import {Approval} from "../../services/firebaseDataService";
// import featureDetail from "../product/featureDetail";
// import ideaDetail from "../product/ideaDetail";
// import goalDetail from "../product/goalDetail";
// import riskDetail from "../product/riskDetail";
import comment from "../comment/comment";
import approvalComponent from "../approvals/approvalComponent";

export default {
  name: 'draft-panel',

  components: {
    comment,
    approvalComponent,
    productDetail,
    // featureDetail,
    // ideaDetail,
    // goalDetail,
    // riskDetail,
    // comment
  },
  data() {
    return {
      draftSelected:false,
      draftSelectedValues:{
        draftID:'',
        parentID:'',
        approvalRecords:null,
        parentType:''
      },
      approvalHeaders:[
        {text: 'Approval', value: 'id' },
        {text: 'Document', value: 'docType' },
      ],
      draftHeaders:[]
   }
  },
  async beforeMount() {
    this.$store.commit('getApprovals')
    this.$store.commit('getDrafts')

    this.draftHeaders = [
      {text: 'Draft', function: (value) => {return value.draftName} },
      {text: 'DocType', function: (value) => {return value.parentType} },
      {text: 'Parent', function: (value) => {return value.parentType} }
    ]
  },
  watch:{
    $route:{
      immediate:true,
      handler(){
      //   this.draftSelected= true
      //   this.draftSelectedValues = this.$route.params.id
       }
    }
  },
  computed: {
  },
  methods: {
    async openDraftCompare(draft){
      this.draftSelectedValues.draftID = draft.id
      this.draftSelectedValues.parentID = draft.parentID
      this.draftSelectedValues.parentType = draft.parentType
      this.draftSelected = true
      const approvalRecord = await Approval.getByDoc(draft.id)
      this.draftSelectedValues.approvalRecords = approvalRecord
      return
    }
  },
  mounted () {}
}

</script>

<style lang="scss" scoped>

.approval-record{
  position:absolute;
  right:0px;
}

.view-changes{
  width:90vw;
  left:-5vw;
  position:relative;
}

.draft-table{
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;

  td,
  th{
    border: 1px solid #ddd;
    padding: 8px;
  }

  tr:nth-child(even){background-color: #f2f2f2;}
  tr:hover {background-color: #ddd;}

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
  }
}

</style>
