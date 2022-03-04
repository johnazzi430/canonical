<template id="">
      <v-layout>
        <v-navigation-drawer
          theme="dark"
          expand-on-hover
          rail
          permanent>
          <v-list nav color="transparent">
            <v-list-item prepend-icon="mdi-semantic-web" title="Products" value="products"></v-list-item>
            <v-list-item prepend-icon="mdi-application" title="Features" value="Features"></v-list-item>
            <v-list-item prepend-icon="mdi-lightbulb" title="Ideas" value="ideas"></v-list-item>
            <v-list-item prepend-icon="mdi-chart-areaspline" title="Goals" value="goals"></v-list-item>
            <v-list-item prepend-icon="mdi-flag" title="Risks" value="risks"></v-list-item>
            <!-- <v-list-item prepend-icon="mdi-desktop-classic" title="Architecture" value="architecture"></v-list-item> -->
          </v-list>
        </v-navigation-drawer>
        <v-main style="
        margin:16px;
        overflow-x:hidden;
        ">
            <v-row>
              <v-text-field
                v-model="search"
                @input="$store.commit('filter',search.trim())"
                variant="underlined"
              ></v-text-field>
            </v-row>
            <h3 class="text-medium-emphasis">Products  <v-btn variant="contained-text" color="success" v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("product")'>Add product +</v-btn></h3>
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
              v-for="product in $store.state.products"
              v-bind:key="product"
              class="rounded-0 product-card"
              width="300"
              height="200"
              elevation="3"
              variant ="contained-text"
              >
                <v-card-header>{{product.data.name}}</v-card-header>
                <v-card-text class="text-wrap">{{product.data.description}}</v-card-text>

                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="orange"
                    v-on:click='expandDetail(product.id,"product")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
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
              variant ="contained-text"
              >
                <v-card-header>{{feature.data.name}}</v-card-header>
                <v-card-text>{{feature.data.description}}</v-card-text>
                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(feature.id,"feature")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
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
              v-for="idea in $store.state.ideas"
              v-bind:key="idea"
              class="rounded-0"
              width="200"
              height="150"
              elevation="3"
              variant ="contained-text"
              >
                <v-card-header>{{idea.data.idea}}</v-card-header>
                <v-card-text>{{idea.data.description}}</v-card-text>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    text
                    v-on:click='expandDetail(idea.id,"idea")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
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
              v-for="goal in $store.state.goals"
              v-bind:key="goal"
              class="rounded-0"
              width="280"
              height="150"
              elevation="3"
              variant ="contained-text"
              >
                <v-card-header>{{goal.data.name}}{{goal.data.description}}</v-card-header>
                <v-card-text>{{goal.data.description}}</v-card-text>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(goal.id,"goal")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
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
              v-for="risk in $store.state.risks"
              v-bind:key="risk"
              class="rounded-0 product-risk-card"
              :class='"r"+risk.data.impact'
              width="200"
              height="150"
              elevation="3"
              variant ="contained-text"
              >
                <v-card-header>{{risk.data.name}}</v-card-header>
                <v-card-text>{{risk.data.description}}</v-card-text>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(risk.id,"risk")'
                  >
                    Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
        </v-main>
        <div id="right-sidepanel" class="sidepanel-right">
          <h1><a href="javascript:void(0)"
            class="closebtn" @click="closeDetail(); ">&times;</a></h1>
            <h1 style="text-transform:uppercase">{{$store.state.selected.source}}</h1>
            <div v-if='$store.state.selected.source === "product"'><productDetail :key='$store.state.selected.index' /></div>
            <div v-else-if='$store.state.selected.source ==="feature"'><featureDetail :key='$store.state.selected.index'/></div>
            <div v-else-if='$store.state.selected.source ==="idea"'><ideaDetail :key='$store.state.selected.index'/></div>
            <div v-else-if='$store.state.selected.source ==="goal"'><goalDetail :key='$store.state.selected.index'/></div>
            <div v-else-if='$store.state.selected.source ==="risk"'><riskDetail :key='$store.state.selected.index'/></div>
        </div>
      </v-layout>
</template>

<script type="text/javascript">
import productDetail from "./productDetail";
import featureDetail from "./featureDetail";
import ideaDetail from "./ideaDetail";
import goalDetail from "./goalDetail";
import riskDetail from "./riskDetail";

export default {
  name: 'product-panel',
  components: {
    productDetail,
    featureDetail,
    ideaDetail,
    goalDetail,
    riskDetail
  },
  data() {
    return {
      search:""
   }
  },
  async beforeMount() {
    this.$store.commit('getProducts')
    this.$store.commit('getFeatures')
    this.$store.commit('getIdeas')
    this.$store.commit('getGoals')
    this.$store.commit('getRisks')
  },
  watch:{
    closeDetail_(){
      document.getElementById("right-sidepanel").style.width = "0px";
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

.v-card{
  margin: 4px;
  white-space: nowrap;
  overflow: hidden;

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
