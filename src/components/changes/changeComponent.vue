<template>
  <v-container class="">
    <v-expansion-panels>
      <v-expansion-panel v-for="change in changes" :key="change">
        <v-expansion-panel-title>
          {{change.id}} on {{new Date(change.data.createDate).toISOString().split("T")[0]}}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row style="margin:-4px 0px">
            <v-col>
              <h3>Field</h3>
            </v-col>
            <v-col>
              <h3>-></h3>
            </v-col>
          </v-row>
          <v-row style="margin:-4px 0px" v-for="setrow in Object.keys(change.data.set)" :key="setrow ">
            <v-col>
              <p>{{setrow}}</p>
            </v-col>
            <v-col class="change-data">
              <v-sheet>
                <p>(-) {{change.data.unset[setrow]}}</p>
              </v-sheet>
            </v-col>
            <v-col class="change-data">
              <v-sheet>
                <p>(+) {{change.data.set[setrow]}}</p>
              </v-sheet>
            </v-col>
          </v-row>
          <br style="margin:-4px 0px"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import {Change} from "../../services/firebaseDataService";

export default {
    props: {
      docId:{type: String},
      docType:{type: String},
    },
    data: () => ({
      changes: [],
    }),
    async mounted(){
      this.changes = await Change.getByDocID(this.docType,this.docId)
      this.changes.sort((a, b) => a.createDate - b.createDate);
      this.changes.forEach((item, i) => {
        if(item){""}
        this.changes[i].data.set = Object.assign(...this.changes[i].data.set)
        this.changes[i].data.unset = Object.assign(...this.changes[i].data.unset)
      });

      // this.changes sort by date
    },
    methods: {}
  }
</script>

<style scoped>

.change-data{
  border: 1px lightgrey solid;
  margin:4px 4px 4px 4px;
  padding:4px 4px 4px 4px;
  font-size: 14px;
}

.assumption-card{
  margin:4px;
  padding:4px;
}

</style>
