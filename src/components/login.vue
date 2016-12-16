<template lang="html">
  <div class="app">
    <div class="body"></div>
		<div class="header">
      <div class="content">
        <div>BEST BOARDS </div>
      </div>
		</div>
		<br>
		<div class="login">
				<input type="button" value="Login in with facebook" @click="loginfacebook">
		</div>
  </div>
</template>

<script>
/* globals FB, localStorage, firebase */
export default {
  beforeRouteEnter (to, from, next) {
    let local = JSON.parse(localStorage.getItem('auth'))
    if (local && local.id) {
      next('/')
    } else {
      next()
    }
  },
  data () {
    return {
      databases: firebase.database().ref(`users/inboard`)
    }
  },
  methods: {
    loginfacebook () {
      let Vm = this
      FB.login((login) => {
        console.log(login)
        if (login.status === 'connected') {
          var token = login.authResponse.accessToken
          FB.api('/me?fields=id,name,email,birthday,picture', 'get', {'access_token': token}, (res) => {
            Vm.databases.child(`user`).orderByChild(`uid`).equalTo(res.id).once(`value`, (snapshot) => {
              if (snapshot.val() === null) {
                Vm.databases.child(`user`).push({uid: res.id, FB_NAME: res.name, FB_EMAIL: res.email, status: `admin`})
              }
            })
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

<style lang="css" scoped>
@import url(http://fonts.googleapis.com/css?family=Exo:100,200,400);
@import url(http://fonts.googleapis.com/css?family=Source+Sans+Pro:700,400,300);

body{
	margin: 0;
	padding: 0;
	background: #fff;
	color: #fff;
	font-family: Arial;
	font-size: 12px;
}

.body{
	position: absolute;
	top: -20px;
	left: -20px;
	right: -40px;
	bottom: -40px;
	width: auto;
	height: auto;
  background-image: url(http://ginva.com/wp-content/uploads/2012/07/city-skyline-wallpapers-008.jpg);
	background-size: cover;
	-webkit-filter: blur(5px);
	z-index: 0;
  opacity: 0.6;
}

.header{
	position: absolute;
	top: calc(40% - 35px);
	left: calc(57.5% - 255px);
}

.header div{
	float: left;
	color: #fff;
	font-family: 'Exo', sans-serif;
	font-size: 40px;
	font-weight: 200;
}

.login{
	position: absolute;
	top: calc(50% - 75px);
	left: calc(40% - 40px);
	height: 150px;
	width: 350px;
	padding: 30px;
	z-index: 2;
}

.login input[type=button]{
	width: 260px;
	height: 35px;
	background: #49639F;
	border: 1px solid #fff;
	cursor: pointer;
	border-radius: 2px;
	color: #fff;
	font-family: 'Exo', sans-serif;
	font-size: 16px;
	font-weight: 400;
	padding: 6px;
	margin-top: 10px;
}

.login input[type=button]:hover{
	opacity: 0.8;
}

.login input[type=button]:active{
	opacity: 0.6;
}

.login input[type=button]:focus{
	outline: none;
}
</style>
