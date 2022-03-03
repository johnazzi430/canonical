<template id="">
      <v-layout>
        <v-navigation-drawer
          theme="dark"
          width="250px"
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
        height: 100%;
        margin-left:100px;
        overflow-x:hidden;
        ">
          <v-container style="margin-left:100px">
            <h3>Products  <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("product")'>Add product</v-btn></h3>
            <h3>Products  <v-btn type="button" name="button" v-on:click='addItem("product")'>Add product</v-btn></h3>
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
              v-for="product in $store.state.products"
              v-bind:key="product"
              width="400"
              height="200"
              elevation="3"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{product.data.name}}
                    </div>
                    <div class="text-caption">{{product.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="orange"
                    v-on:click='expandDetail(product.id,"product")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Features  <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("feature")'>Add Feature</v-btn></h3>
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
              v-for="feature in $store.state.features"
              v-bind:key="feature"
              width="200"
              height="120"
              elevation="3"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{feature.data.name}}
                    </div>
                    <div class="text-caption">{{feature.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(feature.id,"feature")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Ideas <v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("idea")'>Add Idea</v-btn></h3>
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
              v-for="idea in $store.state.ideas"
              v-bind:key="idea"
              width="200"
              height="120"
              elevation="3"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{idea.data.idea}}
                    </div>
                    <div class="text-caption">{{idea.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    text
                    v-on:click='expandDetail(idea.id,"idea")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Goals<v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("goal")'>Add Goal</v-btn></h3>
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
              v-for="goal in $store.state.goals"
              v-bind:key="goal"
              width="200"
              height="120"
              elevation="3"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{goal.data.name}}
                    </div>
                    <div class="text-caption">{{goal.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(goal.id,"goal")'
                  >
                    Button
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <h3>Risks<v-btn v-if='$store.getters.isUserLoggedIn' type="button" name="button" v-on:click='addItem("risk")'>Add Risk</v-btn></h3>
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
              v-for="risk in $store.state.risks"
              v-bind:key="risk"
              width="200"
              height="120"
              elevation="3"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{risk.data.name}}
                    </div>
                    <div class="text-caption">{{risk.data.description}}</div>
                  </div>
                </v-card-header>

                <v-card-actions>
                  <v-btn
                  variant="text"
                  color="orange"
                    v-on:click='expandDetail(risk.id,"risk")'
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
      // products:[]
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
