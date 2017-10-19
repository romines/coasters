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

    <form class="login-form" @submit.prevent="submit">

      <p v-show="wantsToSignUp" class="control has-icon">
        <input v-model="displayName" class="name input" name="name" placeholder="Enter your full name">
        <i class="fa fa-user"></i>
      </p>
      <p class="control has-icon">
        <input v-model="email" class="input" type="email" name="email" placeholder="Email">
        <i class="fa fa-envelope"></i>
      </p>
      <p class="control has-icon">
        <input v-model="password" class="input" type="password" name="password" placeholder="Password">
        <i class="fa fa-lock"></i>
      </p>
      <div v-show="wantsToSignUp">
        <p class="control has-icon">
          <input v-model="confirmPassword" @focus="confirmFocused = true" @blur="confirmFocused = false" class="input" type="password" name="confirm-password" placeholder="Confirm Password">
          <i class="fa fa-lock"></i>
        </p>
      </div>

      <div v-show="!wantsToSignUp" class="clearfix btn-group">
        <input type="submit" value="Login" class="button is-primary">
        <span class="or">&nbsp;&mdash;&nbsp;OR&nbsp;&mdash;&nbsp;</span>
        <button type="button" v-on:click="wantsToSignUp = true" class="button">Sign up</button>
      </div>

      <div v-show="wantsToSignUp" class="clearfix btn-group">
        <input @click="signUp" type="submit" value="Sign up" :disabled="notReadyForSubmit" class="button is-primary">
        <span class="or">&nbsp;&mdash;&nbsp;OR&nbsp;&mdash;&nbsp;</span>
        <button type="button" v-on:click="wantsToSignUp = false" class="button">Login</button>
      </div>

      <div class="forgot">
        <span @click="onForgotPasswordClick" class="target">Forgot Password</span>
      </div>

      <div v-if="authError" class="auth-error">{{authError}}</div>
      <div v-if="passwordMismatch && !confirmFocused" class="auth-error password-mismatch">Your passwords do not match</div>

    </form>

    <div class="social-providers">
      <span @click="startFacebookLogin"><i class="fa fa-facebook-square" aria-hidden="true"></i></span>
    </div>
  </div>
</template>
<script>

  export default {
    created () {
    },
    computed : {
      authState () { return this.$store.state.authState },
      authError () { return this.authState.error },
      passwordMismatch () {
        if (!this.confirmPassword.length) return false
        return this.password !== this.confirmPassword
      },
      notReadyForSubmit () { return !this.email.length || !this.displayName.length || !this.confirmPassword.length || this.passwordMismatch}
    },
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        wantsToSignUp: false,
        confirmFocused: false
      }
    },
    methods: {
      submit () {
        if (this.wantsToSignUp) {
          this.signUp()
        } else {
          this.logIn()
        }
      },
      logIn () {
        let user = {email: this.email, password: this.password}

        this.$store.dispatch('logInUser', user)

      },
      signUp () {
        this.$store.dispatch('signUpUser', {
          email: this.email, 
          password: this.password, 
          displayName: this.displayName
        })
      },
      logOut () {
        this.$store.dispatch('logOutUser')
      },
      onForgotPasswordClick () {
        this.$store.commit('SHOW_MODAL', {component: 'ForgotPassword'})
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

    .btn-group {
      display: flex;
      align-items: center;
    }

    .or {
      line-height: 55px;
      & > * { vertical-align: middle; }
    }

    .password-mismatch {
      margin-bottom: .7em;
    }

    .forgot {
      font-size: .9em;
      padding: .6em 0;
    }

  }
</style>
