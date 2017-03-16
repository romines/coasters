<template>
  <div class="login" >

    <div v-show="!wantsToSignUp" class="login-header">
      <slot name="title">
        <h2 class='title'>Login</h2>
      </slot>

      <slot name="message">

      </slot>
    </div>

    <div v-show="wantsToSignUp" class="sign-up-header">
      <h2 class="title">Sign Up</h2>
      <p>Create Coasters account and login</p>
    </div>

    <div class="login-form">

      <div v-show="!authState.user" class="no-user">

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
          <button @click="logIn" class="button is-primary">Login</button>
          <button type="button" v-on:click="wantsToSignUp = true" class="button">Sign up</button>
        </div>
        <div v-show="wantsToSignUp">
          <button @click="signUp" class="button is-primary">Sign up</button>
          <button type="button" v-on:click="wantsToSignUp = false" class="button">Login</button>
        </div>
      </div>

      <button v-show="authState.user" @click="logOut" class="button">Log out</button>

      <div v-if="authError" class="auth-error">{{authError}}</div>
    </div>

    <hr>
    <div class="social-providers">
      <span @click="startFacebookLogin"><i class="fa fa-facebook-square" aria-hidden="true"></i></span>
      <div class="is-small">Login/sign-up with Facebook . . .</div>
    </div>
  </div>
</template>
<script>

  export default {
    created () {
    },
    computed : {
      authState () { return this.$store.state.authState },
      authError () { return this.authState.error }
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
      logIn () {
        let user = {email: this.email, password: this.password}

        this.$store.dispatch('logInUser', user)

      },
      signUp () {
        this.$store.dispatch('signUpUser', {email: this.email, password: this.password, displayName: this.displayName})
      },
      logOut () {
        this.$store.dispatch('logOutUser')
      },
      startFacebookLogin () {
        this.$store.dispatch('logInWithFacebook')
      }
    }
  }
</script>
<style lang="scss">
  .login {
    .login-form {
      margin-top: .8em;
    }
    .auth-error {
      margin-top: .7em;
      color: red;
    }
    h2 {
      margin-bottom: .5em;
    }

    .button {
      margin-top: .5em;
    }

  }
</style>
