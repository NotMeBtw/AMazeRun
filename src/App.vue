<template>
  <div id="app">
    <div v-if="user">
      <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <div class="navbar-item">
            <h1 class="title has-text-white">A-Maze Run</h1>
          </div>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <img class="img" :src="user.photoURL" alt="Avatar">
              <b>{{user.displayName}}</b>
            </div>
            <div class="navbar-item">
              <button class="button" @click="signOut()">
                <span class="icon">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Game :user="user"/>
    </div>
    <div v-else>
      <section class="hero is-primary is-fullheight has-text-centered">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-1">A-Maze Run</h1>
            <h2 class="subtitle is-4">Run through mazes</h2>
            <button class="button is-medium" @click="login()">
              <span class="icon">
                <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
              </span>
              <span>Login</span>
            </button>
          </div>
        </div>
      </section>
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
.img {
  border-radius: 100%;
  margin-right: 0.5rem;
}
</style>
