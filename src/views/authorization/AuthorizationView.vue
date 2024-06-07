<template>
  <h2>Authorization</h2>
  <div class="auth-box">
    <div class="login-box">
      Username
      <input type="text" v-model="username">
    </div>
    <div class="password-box">
      Password
      <input type="password" v-model="password">
    </div>
    <button type="submit" class="submit-button" @click="authRequest">Login</button>
    <button type="submit" class="submit-button" @click="authCheck">Auth check</button>
  </div>
</template>

<script>
export default {
  name: "AuthorizationView",
  data() {
    return {
      username: null,
      password: null,
    }
  },
  methods: {
    authRequest() {
     let { username, password } = this

     this.$store.dispatch('authorizationModule/authRequest', { username, password })
    },
    authCheck() {
      this.$store.dispatch('authorizationModule/getUser')
    }
  }
}
</script>

<style scoped>
.auth-box{
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
}
.login-box{
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.password-box{
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.submit-button{
  cursor: pointer;
  user-select: none;
  border: solid var(--border-color) 1px;
  padding: 4px 16px;
}
.submit-button:hover{
  background-color: var(--additional-color);
}
</style>