<template>
  <form class="auth-form" >

    <div v-show="!authState.user" class="no-user">
      <h2 class='title'>{{wantsToSignUp ? 'Sign up' : 'Login'}}</h2>
      <p v-show="wantsToSignUp" class="control has-icon">
        <input v-model="displayName" class="input" placeholder="Enter your full name">
        <i class="fa fa-user"></i>
      </p>
      <p class="control has-icon">
        <input v-model="email" class="input" type="email" placeholder="Email">
        <i class="fa fa-envelope"></i>
      </p>
      <p class="control has-icon">
        <input v-model="password" class="input" type="password" placeholder="Password">
        <i class="fa fa-lock"></i>
      </p>
      <div v-show="wantsToSignUp">
        <p class="control has-icon">
          <input v-model="confirmPassword" class="input" type="password" placeholder="Confirm Password">
          <i class="fa fa-lock"></i>
        </p>
      </div>
      <div v-show="!wantsToSignUp" class="clearfix btn-group">
        <button @click="signIn" class="button">Login</button>
        <button type="button" v-on:click="wantsToSignUp = true" class="button">Sign up</button>
      </div>
      <div v-show="wantsToSignUp">
        <button type="button" v-on:click="wantsToSignUp = false" class="button">Login</button>
        <button @click="signUp" class="button">Sign up</button>
      </div>
    </div>

    <button v-show="authState.user" @click="logOut" class="button">Log out</button>
    <hr>
    <div class="social-providers">
      <a href="#"><i class="fa fa-facebook-square" aria-hidden="true"></i></a>
      <a href="#"><i class="fa fa-twitter-square" aria-hidden="true"></i></a>
    </div>
  </form>
</template>
<script>
  import bus from '../bus'
  export default {
    created () {
    },
    computed : {
      authState () { return this.$store.state.authState }
    },
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        wantsToSignUp: false
      }
    },
    methods: {
      signIn () {
        this.$store.dispatch('logInUser', {email: this.email, password: this.password})
      },
      signUp () {
        console.log(this.email, this.password);
        this.$store.dispatch('signUpUser', {email: this.email, password: this.password, displayName: this.displayName})
      },
      logOut () {
        this.$store.dispatch('logOutUser')
      }
    }
  }
</script>
<style lang="scss">
  .auth-form {

    h2 {
      margin-bottom: .5em;
    }

    .button {
      margin-top: .5em;
    }

  }
</style>
