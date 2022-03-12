

<template id="">
  <v-card class="comment-card">
    <div v-if="editing === false">
      <div>
        <v-card-subtitle class="">
          <p class='font-weight-black'>{{comment.creator.displayName}}
          </p>&nbsp;on&nbsp;
          <p class='font-weight-black'>{{new Date(comment.data.createDate).toISOString().split("T")[0]}}</p>
        </v-card-subtitle>
        <v-card-text
          class="text-body-2"
          style="margin:-8px 0px"
          >{{comment.data.comment}}
        </v-card-text>
        <v-card-actions
        style="margin:-16px 0px"
        v-if="$store.state.user.uid === comment.creator.id">
          <v-btn
            variant="text"
            color="teal accent-4"
            @click="editing = true">edit comment
          </v-btn>
        </v-card-actions>
      </div>
    </div>
    <div v-if="editing === true">
      <v-card-subtitle class="">
        <p class='font-weight-black'>{{comment.creator.displayName}}
        </p>&nbsp;on&nbsp;
        <p class='font-weight-black'>{{new Date(comment.data.createDate).toISOString().split("T")[0]}}</p>
      </v-card-subtitle>
      <v-textarea
              type="text"
              v-model="newComment"
          />
      <v-btn class="mr-4" @click="resetForm()">cancel</v-btn>
      <v-btn class="mr-4" @click="updateComment(comment.id,comment.data.comment)">submit</v-btn>
      <v-btn class="mr-4" @click="deleteComment(comment.id)">delete</v-btn>
    </div>
  </v-card>
</template>

<script type="text/javascript">
import {Comment} from "../../services/firebaseDataService";

export default {
  props: {
    comment: Object,
  },
  data:() => ({
      newComment: "",
      editing: false
  }),
  mounted(){
    this.newComment = {...this.comment.data}.comment
  },
  methods:{
    resetForm () {
      this.newComment = {...this.comment.data}.comment
      this.editing = false
    },

    async updateComment (id,updatedComment) {
      await this.$refs.form.validate();
      this.valid ? await Comment.updateComment(id,updatedComment) : console.log('not valid');
      this.$refs.form.resetValidation();
    },
    async deleteComment (id) {
      Comment.deleteComment(id)
      this.$refs.form.resetValidation();
    },
  }
}
</script>

<style lang="scss">

.comment-card{
  .v-field{
      font-size: 14px !important;
  }
}

</style>
