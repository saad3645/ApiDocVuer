<template>
  <div class="login">
    <md-app>
      <md-app-content class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-alignment-center-center md-size-33 md-xlarge-size-30 md-small-size-75 md-xsmall-size-100">
          <form novalidate @submit.prevent="validateUser">
            <img class="logo" src="https://vuematerial.io/assets/logo-color.png">
            <md-card class="login-card">
              <md-card-header>
                <div class="md-title">Login</div>
              </md-card-header>
              <md-card-content>
                <md-field :class="getValidationClass('username')">
                  <label for="username">Username</label>
                  <md-input type="text" name="username" id="username" v-model="form.username" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.username.required">Username is required</span>
                </md-field>
                <md-field :class="getValidationClass('password')">
                  <label for="password">Password</label>
                  <md-input type="password" name="password" id="password" v-model="form.password" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
                </md-field>
                <md-progress-bar md-mode="indeterminate" v-if="sending" />
              </md-card-content>
              <md-card-actions class="md-layout md-alignment-center">
                <md-button type="submit" class="md-raised md-primary" :disabled="sending">Login</md-button>
              </md-card-actions>
            </md-card>

            <md-button class="" :disabled="sending">Reset Password</md-button>
          </form>
        </div>
        <md-snackbar :md-active.sync="showSnackbar">
          <span>{{snackbarMessage}}</span>
          <md-button class="md-primary" @click="!showSnackbar">Dismiss</md-button>
        </md-snackbar>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import axios from 'axios'

const LOGIN_URL = process.env.VUE_APP_API_BASE_URL + 'login'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data: () => ({
    form: {
      username: null,
      password: null
    },
    sending: false,
    snackbarMessage: 'Hello World',
    showSnackbar: false
  }),
  validations: {
    form: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },

    async login() {
      try {
        this.sending = true
        const res = await axios.post(LOGIN_URL, this.form)
        localStorage.setItem('user', this.form.username)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('token_expires_at', (Math.floor(Date.now() / 1000) + res.data.ttl - 30))
        this.sending = false
        this.$router.push({path: '/apps'})
      }
      catch (error) {
        this.sending = false
        if (error.response && error.response.data && error.response.data.errors) {
          if (error.response.status !== 401 && error.response.status !== 403) {
            console.log('Error', error.response.data.errors)
          }
          this.snackbarMessage = error.response.data.errors[0].detail
        }
        else {
          console.log('Error', error.message)
          this.snackbarMessage = error.message
        }
        this.showSnackbar = true
      }
    },

    validateUser() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  .login {
    height: 100vh;
  }

  .login .md-app {
    height: 100vh;
  }

  img.logo {
    max-height: 80px;
    margin: 0px 0px 20px;
  }

  .login .login-card {
    padding-left: 40px;
    padding-right: 40px;
  }

  .login .md-card-actions {
    padding-top: 30px;
    padding-bottom: 30px;
  }
</style>
