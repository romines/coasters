<template>
  <form class="auth-form" >

    <div v-show="!myProps.authState.user" class="no-user">
      <h2>{{wantsToSignUp ? 'Sign up' : 'Sign in'}}</h2>
      <p class="control has-icon">
        <input class="input" type="email" placeholder="Email">
        <i class="fa fa-envelope"></i>
      </p>
      <p class="control has-icon">
        <input class="input" type="password" placeholder="Password">
        <i class="fa fa-lock"></i>
      </p>
      <div v-show="wantsToSignUp">
        <p class="control has-icon">
          <input class="input" type="password" placeholder="Confirm Password">
          <i class="fa fa-lock"></i>
        </p>
      </div>
      <div v-show="!wantsToSignUp" class="clearfix btn-group">
        <button @click="signIn" class="button">Sign in</button>
        <button type="button" v-on:click="wantsToSignUp = true" class="button">Sign up</button>
      </div>
      <div v-show="wantsToSignUp">
        <button @click="signUp" class="button">Sign up</button>
      </div>

    </div>

    <button v-show="myProps.authState.user" @click="logOut" class="button">Log out</button>
    <hr>
    <div class="social-providers">
      <a href="#"><i class="fa fa-facebook-square" aria-hidden="true"></i></a>
      <a href="#"><i class="fa fa-twitter-square" aria-hidden="true"></i></a>
      <a href="#"><i class="fa fa-google-plus-square" aria-hidden="true"></i></a>
      <a href="#"><i class="fa fa-github-square" aria-hidden="true"></i></a>
    </div>
  </form>
</template>
<script>
  import bus from '../bus'
  export default {
    props: ['myProps'],
    created () {
      console.log(this.myProps);
    },
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        wantsToSignUp: false
      }
    },
    methods: {
      signIn () {
        bus.$emit('msg', {
          type: bus.SIGN_IN,
          payload: {email: this.email, password: this.password}
        })
      },
      signUp () {
        bus.$emit('msg', {
          type: bus.CREATE_USER,
          payload: {email: this.email, password: this.password}
        })
      },
      logOut () {
        bus.$emit('msg', {
          type: bus.LOG_OUT_USER,
          payload: {}
        })
      }
    }
  }
</script>
<style>

</style>
