<template id="">
      <v-layout>
        <v-navigation-drawer
        theme="dark"
        width="100%"
        permanent
        >
          <v-list nav color="transparent">
            <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Personas" value="persona"></v-list-item>
            <v-list-item prepend-icon="mdi-binoculars" title="insights" value="insights"></v-list-item>
            <v-list-item prepend-icon="mdi-fire" title="Needs" value="needs"></v-list-item>
            <v-list-item prepend-icon="mdi-account-convert" title="Journeys" value="journeys"></v-list-item>
            <v-list-item prepend-icon="mdi-wrench" title="Jobs to be done" value="jobsToBeDone"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 100%; margin-left:100px">

          <v-container style="margin-left:100px;">
            <h3>Personas  <v-btn type="button" name="button">Add Persona</v-btn></h3>
            <v-row
              no-gutters
              style="height: 200px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="persona in personas"
              v-bind:key="persona"
              max-width="344"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{persona.name}}
                    </div>
                    <div class="text-caption">{{persona.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Insights<v-btn type="button" name="button">Add Insights</v-btn></h3>
            <v-row               no-gutters
                          style="height: 200px;
                                overflow-x:scroll;
                                white-space: nowrap;
                                display: flex;
                                flex-wrap: wrap;
                                flex-direction: column;
                                overflow-x: auto;"></v-row>
            <h3>Journeys<v-btn type="button" name="button">Add Journey</v-btn></h3>
            <v-row               no-gutters
                          style="height: 200px;
                                overflow-x:scroll;
                                white-space: nowrap;
                                display: flex;
                                flex-wrap: wrap;
                                flex-direction: column;
                                overflow-x: auto;"></v-row>
            <h3>Jobs to be done<v-btn type="button" name="button">Add JTBD</v-btn></h3>
            <v-row               no-gutters
                          style="height: 200px;
                                overflow-x:scroll;
                                white-space: nowrap;
                                display: flex;
                                flex-wrap: wrap;
                                flex-direction: column;
                                overflow-x: auto;"></v-row>
            <h3>Interviews<v-btn type="button" name="button">Add interview</v-btn></h3>
            <v-row
              no-gutters
              style="height: 200px;
              overflow-x:scroll;
              white-space: nowrap;
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;
              overflow-x: auto;"></v-row>
          </v-container>
        </v-main>
        <div id="right-sidepanel" class="sidepanel-right">
          <h1><a href="javascript:void(0)"
            class="closebtn" @click="closeDetail(); ">&times;</a></h1>
        </div>
      </v-layout>
</template>

<script type="text/javascript">
import {persona} from "../../services/firebaseDataService";

export default {
  name: 'persona-panel',
  components: {
  },
  data() {
    return {
      personas:[]
   }
  },
  async beforeMount() {
    const data = await new persona().getAll()
    this.personas = data
  },
  methods: {

    expandDetail() {
      document.getElementById("right-sidepanel").style.width = "80%";
    },

    closeDetail() {
      document.getElementById("right-sidepanel").style.width = "0px";
      // EventBus.$emit('selection-changed',this.selectedRow = null);
    },

    closeNav() {
      document.getElementById("right-sidepanel").style.width = "0px";
    },

  },
  mounted () {}
}

</script>

<style lang="scss" scoped>

.sidepanel-right{
  height: 100%; /* Specify a height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  top: 0 ;
  z-index: 1; /* Stay on top */
  right: -16px;
  background-color: #FFFFFF; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 75px; /* Place content 60px from the top */
  padding-right: 15px;
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidepanel */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

</style>
