<template lang="html">
  <div class="app">
    <button type="button" name="button" @click="loginfacebook">facebook</button>
  </div>
</template>

<script>
/* globals FB, localStorage */
export default {
  beforeRouteEnter (to, from, next) {
    let local = JSON.parse(localStorage.getItem('auth'))
    if (local && local.id) {
      next('/')
    } else {
      next()
    }
  },
  methods: {
    loginfacebook () {
      let Vm = this
      FB.login((login) => {
        console.log(login)
        if (login.status === 'connected') {
          var token = login.authResponse.accessToken
          // var uid = login.authResponse.userID
          FB.api('/me?fields=id,name,email,birthday', 'get', {'access_token': token}, (res) => {
            localStorage.setItem('auth', JSON.stringify(res))
            Vm.$router.push({path: '/'})
            // Vm.$route
          })
        } // end FB.login
      }, { scope: 'publish_actions, user_location, user_birthday, email' })
    }
  }
}
</script>

<style lang="css">
</style>
