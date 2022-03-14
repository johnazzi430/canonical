<template id="">
  <v-container class="flex-container">
    <div to="/product"
      x-large
      class="item"
      elevation="2"
      @click='$router.push("/product")'
      >
      <img class="center img" :src="require('@/assets/images/product.jpg')" alt=""/>
      <h1 class="center">Product</h1>
    </div>
    <div to="/user"
      x-large
      class="item"
      elevation="2"
      @click='$router.push("/user")'
      >
      <img class="center img" :src="require('@/assets/images/user.jpg')" alt=""/>
      <h1 class="center">Users</h1>
    </div>
  </v-container>
</template>

<script type="text/javascript">

</script>

<style scoped lang="scss">

.flex-container{
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: space-evenly;
}

.item{
  flex-grow: 1;
  width: 300px;
  height:  300px;
  padding: 50px;
  max-width: 300px;

  &:hover{
      border: 5px teal solid;
    }

  &:active {
      background: #D9D9D9;
    }

}

.img{
  height: 200px;
  width: 200px;
}

.center {
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
