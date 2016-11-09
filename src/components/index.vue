<template lang="html">
  <div id="app">
    <router-link :to="{ path: '/ping' }">AddData</router-link>
    <button @click="logout">logout</button>
  </div>
</template>

<script>
/* globals localStorage */
export default {
  beforeRouteEnter (to, from, next) {
    let local = JSON.parse(localStorage.getItem('auth'))
    if (local && local.id) {
      next()
    } else {
      next('/login')
    }
  },
  methods: {
    logout () {
      localStorage.clear('auth')
      this.$router.push('/login')
    }
  },
  mounted () {
    // console.log(this)
  }
}
</script>

<style lang="css">
</style>
