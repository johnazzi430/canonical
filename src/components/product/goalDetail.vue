<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="goal.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="goal.data.description"
        :rules="[rules.required]"
        label="Description"
        :disabled="!editing"
        required
      ></v-textarea>

      <v-switch
        v-model="goal.data.completed"
        :label="`completed: ${goal.data.completed}`"
      ></v-switch>

      Goal owner: {{goal.data.owner}}

      <hr>

      <div v-if="selected.index === null">
        <v-btn
          color="success"
          class="mr-4"
          @click="addGoal()"
        >
          Add
        </v-btn>
        <v-btn
          color="info"
          class="mr-4"
          @click="resetForm()"
        >
          Clear
        </v-btn>
      </div>
      <div v-if="editing === false">
        <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
      <div v-if="selected.index != null && editing === true">
        <v-btn
          color="success"
          class="mr-4"
          @click="updateGoal()"
        >Confirm
        </v-btn>
        <v-btn
          color="info"
          class="mr-4"
          @click="editing = false; this.$store.commit('closeDetail')"
        >Cancel
        </v-btn>
        <v-btn
          color="error"
          class="mr-4"
          @click="deleteGoal()"
        >Delete
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {Goal} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      goal:{
        id: null,
        data : {
          description:"",
          goal:"",
          name:"",
          completed:false
        }
      },
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      },
      select: null,
      checkbox: false,
    }),
    beforeMount(){
      if (this.selected.index != null){
        const selectedData = this.$store.state.goals.find(doc => doc.id === this.selected.index)
        this.editing = false;
        this.goal = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addGoal () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Goal.createGoal(this.goal.data);
          this.$store.commit('getGoals');
          this.$store.commit('closeDetail');
        }
      },
      async updateGoal () {
        await this.$refs.form.validate();
        // let Product = new product()
        // this.valid ? await Product.createProduct(this.product.data) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async deleteGoal () {
        await Goal.deleteGoal(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getGoals')
        this.$refs.form.resetValidation();
      },
      resetForm () {
        this.$refs.form.reset()
      },
    },
    computed:{
      selected() {
        return this.$store.state.selected
      }
    },
  }
</script>
