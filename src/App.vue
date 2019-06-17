<template>
  <div id="app">
    <div v-if="user">
      <Game :user="user"/>
      <button @click="signOut()">Logout</button>
    </div>
    <div v-else>
      <button @click="login()">Login</button>
    </div>
  </div>
</template>

<script>
import Game from "./Game";
import { auth, googleProvider } from "./firebase";

export default {
  name: "app",
  components: { Game },
  data() {
    return {
      user: null
    };
  },
  methods: {
    login() {
      auth.signInWithPopup(googleProvider).then(res => (this.user = res.user));
    },
    signOut() {
      auth.signOut().then(res => (this.user = null));
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
