<template id="">
      <v-layout>
        <v-navigation-drawer
          theme="dark"
          expand-on-hover
          rail
          permanent>
          <v-list nav color="transparent">
            <v-list-item prepend-icon="mdi-semantic-web" title="Products" value="products" v-on:click='addItem("product"); draft=false'></v-list-item>
            <v-list-item prepend-icon="mdi-application" title="Features" value="Features" v-on:click='addItem("feature"); draft=false'></v-list-item>
            <v-list-item prepend-icon="mdi-lightbulb" title="Ideas" value="ideas" v-on:click='addItem("idea"); draft=false'></v-list-item>
            <v-list-item prepend-icon="mdi-chart-areaspline" title="Goals" value="goals" v-on:click='addItem("goal"); draft=false'></v-list-item>
            <v-list-item prepend-icon="mdi-flag" title="Risks" value="risks" v-on:click='addItem("risk"); draft=false'></v-list-item>
            <!-- <v-list-item prepend-icon="mdi-desktop-classic" title="Architecture" value="architecture"></v-list-item> -->
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
            <h3 class="text-medium-emphasis">Products  <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("product"); draft=false'>Add product +</v-btn></h3>
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
                v-for="product in $store.getters.filteredProducts"
                v-bind:key="product"
                class="rounded-0 product-card"
                width="300"
                height="200"
                elevation="3"
                variant ="outlined"
                @click="expandDetail(product.id,'product')"
                >
                <v-card-header><v-icon>mdi-semantic-web</v-icon> {{product.data.name}}</v-card-header>
                <v-card-text class="text-wrap">{{product.data.description}}</v-card-text>
                <v-card-text>
                  <v-chip v-for="user in product.data.personaNeedMap" :key="user">{{user.persona.name}}</v-chip>
                </v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Features  <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("feature")'>Add Feature +</v-btn></h3>
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
              v-for="feature in $store.getters.filteredFeatures"
              v-bind:key="feature"
              class="rounded-0"
              width="200"
              height="150"
              elevation="3"
              variant ="outlined"
              @click="expandDetail(feature.id,'feature')"
              >
                <v-card-header><v-icon>mdi-application</v-icon> {{feature.data.name}}</v-card-header>
                <v-card-text>{{feature.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Ideas <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("idea")'>Add Idea +</v-btn></h3>
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
              v-for="idea in $store.getters.filteredIdeas"
              v-bind:key="idea"
              class="rounded-0"
              width="200"
              height="150"
              elevation="3"
              variant ="outlined"
              @click="expandDetail(idea.id,'idea')"
              >
                <v-card-header><v-icon>mdi-lightbulb</v-icon> {{idea.data.idea}}</v-card-header>
                <v-card-text>{{idea.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Goals<v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("goal")'>Add Goal +</v-btn></h3>
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
              v-for="goal in $store.getters.filteredGoals"
              v-bind:key="goal"
              class="rounded-0"
              width="280"
              height="150"
              elevation="3"
              variant ="outlined"
              @click="expandDetail(goal.id,'goal')"
              >
                <v-card-header>
                  <v-icon>mdi-chart-areaspline</v-icon>
                  {{goal.data.name}}
                  <v-chip>{{goal.data.goalType}}</v-chip>
                </v-card-header>
                <v-card-text>{{goal.data.description}}</v-card-text>
              </v-card>
            </v-row>
            <h3 class="text-medium-emphasis">Risks<v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("risk")'>Add Risk +</v-btn></h3>
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
              v-for="risk in $store.getters.filteredRisks"
              v-bind:key="risk"
              class="rounded-0 product-risk-card"
              :class='"r"+risk.data.impact'
              width="200"
              height="150"
              elevation="3"
              variant ="outlined"
              @click="expandDetail(risk.id,'risk')"
              >
                <v-card-header><v-icon>mdi-flag</v-icon> {{risk.data.name}}</v-card-header>
                <v-card-text>{{risk.data.description}}</v-card-text>
              </v-card>
            </v-row>
        </v-main>
        <div id="right-sidepanel" class="sidepanel-right">
            <v-row style="margin:16px">
              <h1 style="text-transform:uppercase">
                {{$store.state.selected.source}}
                <v-btn-group class="panel-controls">
                  <v-btn
                    icon
                    variant="text"
                    class="closebtn"
                    @click="closeDetail(); ">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-spacer/>
                  <v-btn
                    v-if="!detailExpandedLarge"
                    icon
                    variant="text"
                    @click='expandDetailLarge()'>
                    <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    icon
                    variant="text"
                    @click='expandDetailSmall()'>
                    <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
                  </v-btn>
                </v-btn-group>
              </h1>
            </v-row>
            <div class="flex-container">
              <div class="panel-content" v-if='$store.state.selected.source === "product"'>
                <productDetail
                @selectDraft="onSelectDraft"
                :draft='draft'
                :id='$store.state.selected.index'
                :key='$store.state.selected.index+draft'/>
              </div>
              <div class="panel-content" v-else-if='$store.state.selected.source ==="feature"'>
                <featureDetail :key='$store.state.selected.index'/>
              </div>
              <div class="panel-content" v-else-if='$store.state.selected.source ==="idea"'>
                <ideaDetail :key='$store.state.selected.index'/>
              </div>
              <div class="panel-content" v-else-if='$store.state.selected.source ==="goal"'>
                <goalDetail :key='$store.state.selected.index'/>
              </div>
              <div class="panel-content" v-else-if='$store.state.selected.source ==="risk"'>
                <riskDetail :key='$store.state.selected.index'/>
              </div>
              <div class="panel-content" v-if='$store.state.selected.index !== null'>
                <hr style="margin: 8px 0px">
                <comment
                  v-if='$store.state.selected.index != null'
                  :doc-id='$store.state.selected.index'
                  :doc-type='$store.state.selected.source'
                  :key="$store.state.selected.index+draft+'comment'"/>
                <hr style="margin: 8px 0px">
                <assumption
                    v-if='$store.state.selected.index != null'
                    :doc-id='$store.state.selected.index'
                    :doc-type='"products"'
                    :key="$store.state.selected.index+'assumption'"
                      />
                <hr style="margin: 8px 0px">
                <change
                  v-if='$store.state.selected.index != null'
                  :doc-id='$store.state.selected.index'
                  :doc-type='"products"'
                  :key="$store.state.selected.index+'change'"
                    />
                <hr>
              </div>
            </div>
        </div>
      </v-layout>
</template>

<script type="text/javascript">
import productDetail from "./productDetail";
import featureDetail from "./featureDetail";
import ideaDetail from "./ideaDetail";
import goalDetail from "./goalDetail";
import riskDetail from "./riskDetail";
import comment from "../comment/comment";
import change from '../changes/changeComponent'
import assumption from '../assumptions/assumptionComponent'

export default {
  name: 'product-panel',

  components: {
    productDetail,
    featureDetail,
    ideaDetail,
    goalDetail,
    riskDetail,
    comment,
    change,
    assumption
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
        if(this.$route.query.draft == 'true'){ this.draft=true } else {this.draft=false}
      }
    }
  },
  computed: {
    products() {
      return this.$store.state.products
    },
    closeDetail_(){
      return this.$store.state.detailClose
    }
  },
  methods: {
    expandDetail(index,source,draft=false) {
      this.search=index
      this.$store.commit('filter',index.trim()),
      this.$store.commit('selectItem',{index,source})
      document.getElementById("right-sidepanel").style.width = "400px";
      this.draft=draft
      this.$router.push('/product/'+source+'/' + index )
    },

    expandDraftDetail(index,source) {
      this.$store.commit('selectItem',{index,source})
      document.getElementById("right-sidepanel").style.width = "400px";
    },

    addItem(source) {
      this.$store.commit('selectItem',{index:null, source})
      document.getElementById("right-sidepanel").style.width = "400px";
    },

    closeDetail() {
      document.getElementById("right-sidepanel").style.width = "0px";
      this.$store.commit('filter','')
      this.search = ''
      // EventBus.$emit('selection-changed',this.selectedRow = null);
    },

    closeNav() {
      document.getElementById("right-sidepanel").style.width = "0px";
    },

    onSelectDraft(event){
      this.$store.commit('selectItem',{index:event.index,source:event.source})
      document.getElementById("right-sidepanel").style.width = "400px";
      this.draft=true
      this.$router.push( {path:'/product/'+event.source+'/' + event.index , query:{draft:true}})
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

.product-card{
  border: 0px;
  border-top-style: solid;
  border-top-width: medium;
  border-image: linear-gradient(to right,gold,green) 1;
}

.product-risk-card{
  border-left-style: solid;
  border-left-width: thick;

  &.r0{
    border-left-color: green;
  }

  &.r4{
    border-left-color: yellow;
  }
  &.r5{
    border-left-color: red;
  }
}

.v-card-actions{
  position: absolute;
  bottom: 0;
}

.v-card-text{
  white-space: normal !important;
  word-break: break-word;
  -moz-white-space: pre-wrap;
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

.panel-controls{
  right: 0px;
  position: absolute;
}

.v-field__input {
  font-size: 14px !important;
}

</style>
