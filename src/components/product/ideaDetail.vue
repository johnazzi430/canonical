<template>
  <div class="">
    <div v-if="!editing">
      <h2>{{idea.data.idea}}</h2>
      <br>
      <p style="white-space: pre-line">{{idea.data.description}}</p>
      <br>
      priority
      <v-slider
        v-model="idea.data.priority"
        step="1"
        max="5"
        show-ticks="always"
        label="Priority"
        thumb-label="always"
        :disabled="!editing"
      ></v-slider>

      Idea owner: {{idea.data.owner}}

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
          v-model="idea.data.idea"
          :counter="42"
          :rules="[rules.required,rules.counter]"
          label="idea"
          required
          :disabled="!editing"
        ></v-text-field>

        <v-textarea
          v-model="idea.data.description"
          :rules="[rules.required]"
          label="Description"
          :disabled="!editing"
          required
        ></v-textarea>

        priority
        <v-slider
          v-model="idea.data.priority"
          step="1"
          max="5"
          show-ticks="always"
          label="Priority"
          thumb-label="always"
          :disabled="!editing"
        ></v-slider>

        Idea owner: {{idea.data.owner}}

        <hr>

        <div v-if="selected.index === null">
          <v-btn
            color="success"
            class="mr-4"
            @click="addIdea()"
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
            @click="updateIdea()"
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
            @click="deleteIdea()"
          >Delete
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import {Idea} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      idea:{
        id: null,
        data : {
          description:"",
          idea:"",
          priority:1
        }
      },
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
        const selectedData = await Idea.getDocById(this.selected.index)
        if(typeof selectedData.data === 'undefined'){
          this.$store.commit('alert',{type:'error',message:`${this.id} not found`})
          return
        }
        this.editing = false;
        this.idea = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addIdea () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Idea.create(this.idea.data);
          this.$store.commit('getIdeas')
          this.$store.commit('closeDetail')
        }
      },
      async updateIdea () {
        await this.$refs.form.validate();
        this.valid ? await Idea.updateDoc(this.idea.id,this.idea.data) : console.log('not valid');
        this.$store.commit('getIdeas')
        this.$refs.form.resetValidation();
      },
      async deleteIdea () {
        await Idea.deleteDoc(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getIdeas')
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
