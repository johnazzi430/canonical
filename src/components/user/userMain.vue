<template id="">
      <v-layout>
        <v-navigation-drawer
        theme="dark"
        expand-on-hover
        rail
        permanent
        >
          <v-list nav color="transparent">
            <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Personas" value="persona"></v-list-item>
            <v-list-item prepend-icon="mdi-fire" title="Needs" value="needs"></v-list-item>
            <v-list-item prepend-icon="mdi-binoculars" title="insights" value="insights"></v-list-item>
            <v-list-item prepend-icon="mdi-wrench" title="Jobs to be done" value="jobsToBeDone"></v-list-item>
            <v-list-item prepend-icon="mdi-account-convert" title="Interviews" value="interviews"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="
          margin:16px;
          overflow-x:hidden;
          ">
          <v-row>
            <v-btn
              @click="search = ''; $store.commit('filter','')"
              v-if="search.length > 0"
              icon="mdi-close"/>
            <v-text-field
              style="width:500px"
              v-model="search"
              @input="$store.commit('filter',search.trim())"
              variant="underlined"
            ></v-text-field>
          </v-row>
          <h3 class="text-medium-emphasis">Personas <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("persona")'>Add Persona +</v-btn></h3>
          <v-row
              no-gutters
              align-content="start"
              style="height: 200px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="persona in $store.getters.filteredPersonas"
              v-bind:key="persona"
              class="rounded-0 persona-card"
              width="400"
              height="200"
              elevation="3"
              variant ="outlined"
              @click='expandDetail(persona.id,"persona")'
              >
                <v-card-header><v-icon>mdi-account</v-icon> {{persona.data.name}}</v-card-header>
                <v-card-text>{{persona.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Needs <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("need")'>Add Needs +</v-btn></h3>
            <v-row
              no-gutters
              align-content="start"
              style="height: 150px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
                v-for="need in $store.getters.filteredNeeds"
                v-bind:key="need"
                density ="compact"
                class="rounded-0"
                width="200"
                height="150"
                elevation="3"
                variant ="outlined"
                @click='expandDetail(need.id,"need")'
                :ripple = 'true'>
              <v-card-header><v-icon>mdi-fire</v-icon> {{need.data.name}}</v-card-header>
              <v-card-text>{{need.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Insights <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("insight")'>Add Insights +</v-btn></h3>
            <v-row
              align-content="start"
              no-gutters
              style="height: 150px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="insight in $store.getters.filteredInsights"
              v-bind:key="insight"
              :class="insight.data.vector"
              class="rounded-0 insightCard"
              width="300"
              height="150"
              elevation="3"
              variant ="outlined"
              @click='expandDetail(insight.id,"insight")'
              >
                <v-card-header><v-icon>mdi-binoculars</v-icon> {{insight.data.name}}</v-card-header>
                <v-card-text>{{insight.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <!-- <h3 class="text-medium-emphasis">Journeys <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("journey")'>Add Journey +</v-btn></h3>
            <v-row
              no-gutters
              align-content="start"
              style="height: 158px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="journey in $store.getters.filteredJourneys"
              v-bind:key="journey"
              class="rounded-0"
              width="200"
              height="150"
              elevation="3"
              variant ="outlined"
              @click="search=journey.id , $store.commit('filter',search.trim()) "
              >
                <v-card-header>{{journey.data.name}}</v-card-header>
                <v-card-text>{{journey.data.description}}</v-card-text>

                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="blue"
                    v-on:click.stop='expandDetail(journey.id,"journey")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row> -->
            <h3 class="text-medium-emphasis">JobsToBeDone <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("jobToBeDone")'>Add JobsToBeDone +</v-btn></h3>
            <v-row
              no-gutters
              align-content="start"
              style="height: 150px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="jobToBeDone in $store.getters.filteredJobsToBeDone"
              v-bind:key="jobToBeDone"
              class="rounded-0"
              width="200"
              height="150"
              elevation="3"
              variant ="outlined"
              @click='expandDetail(jobToBeDone.id,"jobToBeDone")'
              >
                <v-card-header><v-icon>mdi-wrench</v-icon> {{jobToBeDone.data.name}}</v-card-header>
                <v-card-text>{{jobToBeDone.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Interviews <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("interview")'>Add Interviews +</v-btn></h3>
            <v-row
              no-gutters
              align-content="start"
              style="height: 150px;
                    overflow-x:scroll;
                    white-space: nowrap;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    overflow-x: auto;">
              <v-card
              v-for="interview in $store.getters.filteredInterviews"
              class="rounded-0"
              v-bind:key="interview"
              width="200"
              height="130"
              elevation="3"
              variant ="outlined"
              @click='expandDetail(interview.id,"interview")'
              >
                <v-card-header><v-icon>mdi-account-convert</v-icon> {{interview.data.interviewee}}</v-card-header>
                <v-card-text>{{interview.data.details}}</v-card-text>
              </v-card>
            </v-row>
        </v-main>
        <div id="right-sidepanel" class="sidepanel-right">
          <h1 class="panel-content" style="text-transform:uppercase">
            {{$store.state.selected.source}}
            <v-btn
              style="{right:0;position:absolute}"
              icon
              variant="text"
              class="closebtn"
              @click="closeDetail(); ">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn
              style="{right:0;position:absolute}"
              v-if="!detailExpandedLarge"
              icon
              variant="text"
              @click='expandDetailLarge()'>
              <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
            </v-btn>
            <v-btn
              style="{right:0;position:absolute}"
              v-else
              icon
              variant="text"
              @click='expandDetailSmall()'>
              <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
            </v-btn>
          </h1>
          <div class="flex-container">
            <div class="panel-content" v-if='$store.state.selected.source === "persona"'>
              <personaDetail :key='$store.state.selected.index' />
            </div>
            <div class="panel-content" v-else-if='$store.state.selected.source ==="insight"'>
              <insightDetail :key='$store.state.selected.index'/>
            </div>
            <div class="panel-content" v-else-if='$store.state.selected.source ==="need"'>
              <needDetail :key='$store.state.selected.index'/>
            </div>
            <div class="panel-content" v-else-if='$store.state.selected.source ==="journey"'>
              <journeyDetail :key='$store.state.selected.index'/>
            </div>
            <div class="panel-content" v-else-if='$store.state.selected.source ==="jobToBeDone"'>
              <jobToBeDoneDetail :key='$store.state.selected.index'/>
            </div>
            <div class="panel-content" v-else-if='$store.state.selected.source ==="interview"'>
              <interviewDetail :key='$store.state.selected.index'/>
            </div>
            <div class="panel-content" v-if='$store.state.selected.index !== null'>
              <comment
                v-if='$store.state.selected.index != null'
                :doc-id='$store.state.selected.index'
                :doc-type='$store.state.selected.source'
                :key="$store.state.selected.index+draft+'comment'"/>
              <assumption
                  v-if='$store.state.selected.index != null'
                  :doc-id='$store.state.selected.index'
                  :doc-type='"products"'
                  :key="$store.state.selected.index+'assumption'"
                    />
              <change
                v-if='$store.state.selected.index != null'
                :doc-id='$store.state.selected.index'
                :doc-type='"products"'
                :key="$store.state.selected.index+'change'"
                  />
            </div>
          </div>
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
import comment from "../comment/comment";
import change from '../changes/changeComponent'
import assumption from '../assumptions/assumptionComponent'

export default {
  name: 'persona-panel',
  components: {
     personaDetail,
     insightDetail,
     needDetail,
     journeyDetail,
     jobToBeDoneDetail,
     interviewDetail,
     assumption,
     comment,
    change
  },
  data() {
    return {
      search:"",
      draft: false,
      detailExpandedLarge:false,
   }
  },
  async beforeMount() {
    this.search = this.$store.state.filter
  },
  mounted(){
    if(this.$store.state.selected.index != null){document.getElementById("right-sidepanel").style.width = "400px";}
  },
  watch:{
    closeDetail_(){
      document.getElementById("right-sidepanel").style.width = "0px";
    },

    $route:{
      immediate:true,
      handler(){
        this.$store.commit('selectItem',{index:this.$route.params.id,source:this.$route.path.split("/")[2]})
      }
    }
  },
  computed: {
    closeDetail_(){
      return this.$store.state.detailClose
    }
  },
  methods: {
    expandDetail(index,source) {
      this.search=index
      this.$store.commit('filter',index.trim())
      this.$store.commit('selectItem',{index,source})
      document.getElementById("right-sidepanel").style.width = "400px";
      this.$router.push('/user/'+source+'/' + index )
    },

    addItem(source) {
      this.$store.commit('selectItem',{index:null, source})
      document.getElementById("right-sidepanel").style.width = "400px";
    },

    closeDetail() {
      document.getElementById("right-sidepanel").style.width = "0px";
      this.search=""
      this.$store.commit('filter',"")
      // EventBus.$emit('selection-changed',this.selectedRow = null);
    },

    closeNav() {
      document.getElementById("right-sidepanel").style.width = "0px";
      this.$store.commit('filter','')
      this.search = ''
    },

    onSelectDraft(event){
      this.$store.commit('selectItem',{index:event.index,source:event.source})
      document.getElementById("right-sidepanel").style.width = "400px";
      this.draft=true
    },

    expandDetailLarge(){
            document.getElementById("right-sidepanel").style.width = "850px";
            this.detailExpandedLarge = true;
    },

    expandDetailSmall(){
      document.getElementById("right-sidepanel").style.width = "400px";
      this.detailExpandedLarge = false;
    }

  }
}

</script>

<style lang="scss" scoped>

.v-card{
  margin: 4px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px lightgrey solid;

  &:hover{
      background: #E5E5E5;
    }

  &:active {
      background: #D9D9D9;
    }
}

.persona-card{
  border: 0px;
  border-top-style: solid;
  border-top-width: medium;
  border-image: linear-gradient(to right,#7799FF,purple) 1;

  &:hover{
      background: #E5E5E5;
    }

  &:active {
      background: #D9D9D9;
    }
}

.insightCard{
  border-left-style: solid;
  border-left-width: thick;
}

.insightCard.negative{
  border-left-color: red;
}

.insightCard.positive{
  border-left-color: green;
}

.insightCard.neutral{
  border-left-color: grey;
}


.v-card-actions{
  position: absolute;
  bottom: 0;
}

.v-card-text{
  white-space: normal !important;
  height:4em;
  overflow-y: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1em;
  padding-top:0;
}

.sidepanel-right{
  height: 100%; /* Specify a height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  top: 0 ;
  z-index: 905; /* Stay on top */
  right: -0px;
  background-color: #FFFFFF; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 88px; /* Place content 60px from the top */
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 88px;
  transition: 0.4s; /* 0.5 second transition effect to slide in the sidepanel */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  &.expanded-large{
    width: 800px;
  }

  .flex-container{
    display: flex;
    flex-wrap: wrap;
  }

  .panel-content{
    width: 384px;
    margin: 16px;
  }
}

.v-field__input {
  font-size: 14px !important;
}

</style>
