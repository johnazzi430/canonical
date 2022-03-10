<template>
  <div class="">
    <commentCard
      class="comment-card"
      v-for="commentItem in comments"
      :key="commentItem"
      :comment='commentItem'/>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-if="$store.getters.isUserLoggedIn"
    >
      <v-textarea
        v-model="newComment"
        :counter="250"
        :rules="[rules.required,rules.counter]"
        required
        rows="3"
        density="compact"
      ></v-textarea>

      <div>
        <v-btn
          color="success"
          class="mr-4"
          @click="addComment()"
        >
          Add Comment
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {Comment} from "../../services/firebaseDataService";
import commentCard from "./commentCard"

export default {
  components: {
    commentCard
  },
    props: {
      docId: String,
      docType: String
    },
    data: () => ({
      valid: true,
      comments: [],
      newComment: "",
      rules:{
        required: value => !!value || 'Required.',
        counter: value => value.length <= 250 || 'Max 250 characters',
        url: value => {
          // eslint-disable-next-line
          const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
          return (pattern.test(value) || value.length == 0) || 'Invalid url.'
        }
      }
    }),
    async mounted(){
      this.comments = await Comment.getCommentsByDocID(this.docType,this.docId)
      this.comments = this.comments.reverse()
    },
    methods: {
      async addComment () {
        await this.$refs.form.validate();
        if (this.valid ){
          const commentPayload = {
            docID: this.docId,
            docType: this.docType,
            comment: this.newComment
          }
          await new Comment(commentPayload).createComment()
          this.comments = await Comment.getCommentsByDocID(this.docType,this.docId)
        }
      },
      async editComment (id,updatedComment) {
        await this.$refs.form.validate();
        this.valid ? await Comment.updateComment(id,updatedComment) : console.log('not valid');
        this.$refs.form.resetValidation();
      },
      async deleteComment (id) {
        Comment.deleteComment(id)
        this.$refs.form.resetValidation();
      },
      resetForm () {
        this.$refs.form.reset()
      },
      resetCommentEdit () {
        this.$refs['commentItem'].reset()
      },
    },
  }
</script>

<style scoped>

.comment-card{
  margin:4px;
  padding:4px;
  border:1px lightgrey solid;
}

</style>
