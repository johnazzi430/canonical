<template>
  <div class="">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="product.name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field>

      <v-textarea
        v-model="product.description"
        :rules="descriptionRules"
        label="Description"
        required
      ></v-textarea>

      <!-- <v-select
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Item is required']"
        label="Item"
        required
      ></v-select> -->

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Add
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Clear
      </v-btn>

    </v-form>
  </div>
</template>

<script>
  export default {
    data: () => ({
      valid: true,
      product:{
        name:'',
        description:''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      descriptionRules: [
        v => !!v || 'Description is required',
        v => (v && v.length <= 250) || 'Name must be less than 250 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
