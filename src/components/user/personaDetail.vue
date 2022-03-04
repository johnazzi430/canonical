<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="persona.data.name"
        :counter="20"
        :rules="[rules.required,rules.counter]"
        label="Name"
        required
        :disabled="!editing"
      ></v-text-field>

      <v-textarea
        v-model="persona.data.description"
        :rules="[rules.required]"
        label="Description"
        :disabled="!editing"
        required
      ></v-textarea>

      <v-textarea
        v-model="persona.data.gains"
        label="Gains"
        :disabled="!editing"
      ></v-textarea>

      <v-textarea
        v-model="persona.data.pains"
        label="Pains"
        :disabled="!editing"
      ></v-textarea>

      <v-switch
        v-model="persona.data.validated"
        color="primary"
        :label="`Validated: ${persona.data.validated}`"
      ></v-switch>

      <hr>

      <div v-if="selected.index === null">
        <v-btn
          color="success"
          class="mr-4"
          @click="addPersona()"
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
          @click="updatePersona()"
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
          @click="deletePersona()"
        >Delete
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {Persona} from "../../services/firebaseDataService";

export default {
    data: () => ({
      editing: true,
      valid: true,
      persona:{
        id: null,
        data : {
          description:"",
          name:"",
          pains:"",
          gains:"",
          validated:false
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
        const selectedData = this.$store.state.personas.find(doc => doc.id === this.selected.index)
        this.editing = false;
        this.persona = JSON.parse(JSON.stringify(selectedData));
      }
    },
    methods: {
      async addPersona () {
        await this.$refs.form.validate();
        if (this.valid ){
          await Persona.createPersona(this.persona.data)
          this.$store.commit('getPersonas')
          this.$store.commit('closeDetail')
        }
      },
      async updatePersona () {
        await this.$refs.form.validate();
        this.valid ? await Persona.updateProduct(this.persona.id,this.persona.data) : console.log('not valid');
        this.$store.commit('getPersonas')
        this.$refs.form.resetValidation();
      },
      async deletePersona () {
        Persona.deletePersona(this.selected.index)
        this.$store.commit('closeDetail')
        this.$store.commit('getPersonas')
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
