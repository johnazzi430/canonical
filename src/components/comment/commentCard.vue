

<template id="">
  <v-card class="comment-card">
    <div v-if="editing === false">
      <div>
        <v-card-subtitle class="">
          {{comment.creator.displayName}} on {{new Date(comment.data.createDate).toISOString().split("T")[0]}}
          <v-btn
            v-if="$store.state.user.uid === comment.creator.id"
            variant="text"
            color="teal accent-4"
            @click="editing = true">edit comment
          </v-btn>
        </v-card-subtitle>
        <v-card-text style="margin:-4px" class="">{{comment.data.comment}}</v-card-text>
      </div>
    </div>
  <div v-if="editing === true">
      <v-list-item-subtitle class="">{{comment.creator.displayName}} on {{comment.data.createDate}}</v-list-item-subtitle>
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
