<template id="">
      <v-layout>
        <v-navigation-drawer
          theme="dark"
          width="250px"
          permanent>
          <v-list nav color="transparent">
            <v-list-item prepend-icon="mdi-email" title="Products" value="products"></v-list-item>
            <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Ideas" value="ideas"></v-list-item>
            <v-list-item prepend-icon="mdi-clock-start" title="Goals" value="goals"></v-list-item>
            <v-list-item prepend-icon="mdi-clock-start" title="Risks" value="risks"></v-list-item>
            <v-list-item prepend-icon="mdi-clock-start" title="Architecture" value="architecture"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 100vh; margin-left:100px">
          <v-container style="margin-left:100px">
            <h3>Products  <v-btn type="button" name="button" v-on:click='expandDetail'>Add product</v-btn></h3>
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
              v-for="product in products"
              v-bind:key="product"
              max-width="344"
              variant="outlined"
              >
                <v-card-header>
                  <div>
                    <div class="text-overline mb-1">
                      {{product.name}}
                    </div>
                    <div class="text-caption">{{product.description}}</div>
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
            <h3>Ideas<v-btn type="button" name="button" v-on:click='expandDetail'>Add Idea</v-btn></h3>
            <v-row               no-gutters
                          style="height: 200px;
                                overflow-x:scroll;
                                white-space: nowrap;
                                display: flex;
                                flex-wrap: wrap;
                                flex-direction: column;
                                overflow-x: auto;"></v-row>
            <h3>Goals<v-btn type="button" name="button" v-on:click='expandDetail'>Add Goal</v-btn></h3>
            <v-row               no-gutters
                          style="height: 200px;
                                overflow-x:scroll;
                                white-space: nowrap;
                                display: flex;
                                flex-wrap: wrap;
                                flex-direction: column;
                                overflow-x: auto;"></v-row>
            <h3>Risks<v-btn type="button" name="button" v-on:click='expandDetail'>Add Risk</v-btn></h3>
            <v-row               no-gutters
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
            <productAdd/>
        </div>
      </v-layout>
</template>

<script type="text/javascript">
import productAdd from "./productAdd";
import {product} from "../../services/firebaseDataService";

export default {
  name: 'product-panel',
  components: {
    productAdd
  },
  data() {
    return {
      products:[]
   }
  },
  async beforeMount() {
    const data = await new product().getAll()
    this.products = data
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
