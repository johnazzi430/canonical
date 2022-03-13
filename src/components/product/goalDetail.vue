<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{goal.data.name}}</h2>
      <br>
      <p style="white-space: pre-line">{{goal.data.description}}</p>
      <br>

      <div v-if="editing === false">
        <v-btn
          v-if="selected.index != null && $store.getters.isUserLoggedIn"
          color="success"
          class="mr-4"
          @click="editing = true"
        >Edit
        </v-btn>
      </div>
    </div>
    <div v-else>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="goal.data.name"
          :counter="42"
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

        <v-select
          v-model="goal.data.goalType"
          :items="goalTypeOptions"
          label="Goal Type"
          :disabled="!editing"
        ></v-select>

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
          completed:false,
          goalType:""
        }
      },
      goalTypeOptions: ['Vision',"strategy","Target","Product","Metric"],
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 42 || 'Max 42 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      },
      select: null,
      checkbox: false,
    }),
    async beforeMount(){
      if (this.selected.index != null){
        const selectedData = await Goal.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.goal = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addGoal () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Goal.create(this.goal.data);
          this.$store.commit('getGoals');
          this.$store.commit('closeDetail');
        }
      },
      async updateGoal () {
        await this.$refs.form.validate();
        this.valid ? await Goal.updateDoc(this.goal.id,this.goal.data) : console.log('not valid');
        this.$store.commit('getGoals')
        this.$refs.form.resetValidation();
      },
      async deleteGoal () {
        await Goal.deleteDoc(this.selected.index)
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
