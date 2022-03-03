<template id="">
      <v-layout>
        <v-navigation-drawer
        theme="dark"
        width="250px"
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
            <h3>Personas <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("persona")'>Add Persona</v-btn></h3>
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
              v-for="persona in $store.state.personas"
              v-bind:key="persona"
              width="200"
              height="120"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{persona.data.name}}
                    </div>
                    <div class="text-caption">{{persona.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="orange"
                    v-on:click='expandDetail(persona.id,"persona")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Insights <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("insight")'>Add Insights</v-btn></h3>
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
              v-for="insight in $store.state.insights"
              v-bind:key="insight"
              width="200"
              height="120"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{insight.data.name}}
                    </div>
                    <div class="text-caption">{{insight.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail(insight.id,"insight")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Needs <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("need")'>Add Needs</v-btn></h3>
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
              v-for="need in $store.state.needs"
              v-bind:key="need"
              width="200"
              height="120"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{need.data.name}}
                    </div>
                    <div class="text-caption">{{need.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail(need.id,"need")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Journeys <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("journey")'>Add Journey</v-btn></h3>
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
              v-for="journey in $store.state.journeys"
              v-bind:key="journey"
              width="200"
              height="120"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{journey.data.name}}
                    </div>
                    <div class="text-caption">{{journey.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail(journey.id,"journey")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>JobsToBeDone <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("JobsToBeDone")'>Add JobsToBeDone</v-btn></h3>
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
              v-for="jobToBeDone in $store.state.jobToBeDones"
              v-bind:key="jobToBeDone"
              width="200"
              height="120"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{jobToBeDone.data.name}}
                    </div>
                    <div class="text-caption">{{jobToBeDone.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail(jobToBeDone.id,"jobToBeDone")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Interviews <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("intervie")'>Add Interviews</v-btn></h3>
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
              v-for="interview in $store.state.interviews"
              v-bind:key="interview"
              max-width="344"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{interview.data.name}}
                    </div>
                    <div class="text-caption">{{interview.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="outlined"
                    rounded
                    text
                    v-on:click='expandDetail(interview.id,"interview")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-container>
        </v-main>
        <div id="right-sidepanel" class="sidepanel-right">
          <h1><a href="javascript:void(0)"
            class="closebtn" @click="closeDetail(); ">&times;</a></h1>
          <h1 style="text-transform:uppercase">{{$store.state.selected.source}}</h1>
          <div v-if='$store.state.selected.source === "persona"'><personaDetail :key='$store.state.selected.index' /></div>
          <div v-else-if='$store.state.selected.source ==="insight"'><insightDetail :key='$store.state.selected.index'/></div>
          <div v-else-if='$store.state.selected.source ==="need"'><needDetail :key='$store.state.selected.index'/></div>
          <div v-else-if='$store.state.selected.source ==="journey"'><journeyDetail :key='$store.state.selected.index'/></div>
          <div v-else-if='$store.state.selected.source ==="jobToBeDone"'><jobToBeDoneDetail :key='$store.state.selected.index'/></div>
          <div v-else-if='$store.state.selected.source ==="interview"'><interviewDetail :key='$store.state.selected.index'/></div>
        </div>
      </v-layout>
</template>

<script type="text/javascript">
import personaDetail from "./personaDetail";
import insightDetail from "./insightDetail";
import needDetail from "./needDetail";
import journeyDetail from "./journeyDetail";
import jobToBeDoneDetail from "./jobToBeDoneDetail";
import interviewDetail from "./interviewDetail";

export default {
  name: 'persona-panel',
  components: {
     personaDetail,
     insightDetail,
     needDetail,
     journeyDetail,
     jobToBeDoneDetail,
     interviewDetail,
  },
  data() {
    return {
      personas:[]
   }
  },
  async beforeMount() {
    this.$store.commit('getPersonas')
    this.$store.commit('getInsights')
    this.$store.commit('getNeeds')
    this.$store.commit('getJourneys')
    this.$store.commit('getJobsToBeDone')
    this.$store.commit('getInterviews')
  },
  watch:{
    closeDetail_(){
      document.getElementById("right-sidepanel").style.width = "0px";
    }
  },
  computed: {
    closeDetail_(){
      return this.$store.state.detailClose
    }
  },
  methods: {
    expandDetail(index,source) {
      this.$store.commit('selectItem',{index,source})
      document.getElementById("right-sidepanel").style.width = "40%";
    },

    addItem(source) {
      this.$store.commit('selectItem',{index:null, source})
      document.getElementById("right-sidepanel").style.width = "40%";
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
  right: -48px;
  background-color: #FFFFFF; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 88px; /* Place content 60px from the top */
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 88px;
  transition: 0.4s; /* 0.5 second transition effect to slide in the sidepanel */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

</style>
