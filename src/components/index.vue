<template lang="html">
  <div id="app">
    <!-- <router-link :to="{ path: '/ping' }">AddData</router-link> -->
    <!-- <button @click="logout">logout</button> -->
    <div class="main-container">
        <header class="block">
            <ul class="header-menu horizontal-list">
                <li style="padding-left: 30px;padding-top: 10px;" class="titular">
                    <a>Add Board<input type="text" v-model="searchKey" v-on:keyup.enter="addKey()"></a>
                </li>
            </ul>
            <div class="profile-menu">
                <a class="header-menu-tab" @click="logout"><span class="icon fontawesome-user scnd-font-color"></span>logout</a>
            </div>
        </header>

        <!-- LEFT-CONTAINER -->
        <div class="left-container container">
          <div class="profile block"> <!-- PROFILE (MIDDLE-CONTAINER) -->
              <br>
              <div class="profile-picture big-profile-picture clear">
                  <img width="150px" alt="Arunne Hathaway picture" :src="local.picture.data.url" >
              </div><!-- end profile-picture big-profile-picture clear -->
              <h1 class="user-name " >{{local.name}}</h1>
              <h2 class="user-name " >Email : {{local.email}}</h2>

          </div> <!-- end profile block-->
        </div><!-- end left-container container -->
        <!-- MIDDLE-CONTAINER -->
        <div class="middle-container container" style="
    width: 450px;">
          <h2 class="titular">My Project</h2>
          <div  v-for="(list, key) in project" v-if="checkTeam(list.keyCode)">
            <div class="join-newsletter block"> <!-- JOIN NEWSLETTER (RIGHT-CONTAINER) -->
              <a class="add-button" @click="deleteBorad(key)"><span class="icon entypo-plus scnd-font-color"></span></a>
                <h2 class="titular">Project : {{list.NameProject}} | Key : {{list.keyCode}}</h2>
                 <router-link class="subscribe button" :to="{ path: `/board/${key}` }">Board</router-link>
                 <!-- <button @click="deleteBorad(key)">Delete Board</button> -->
            </div>
          </div>

        </div><!-- end middle-container container -->

        <!-- RIGHT-CONTAINER -->
        <div class="right-container container">
            <div class="middle-newsletter block"> <!-- JOIN NEWSLETTER (RIGHT-CONTAINER) -->
                <h2 class="titular">Create Board</h2>
                <div class="input-container">
                    <input type="text" v-model="createProject" v-on:keyup.enter="addProject(createProject)">
                </div>
                <a class="middle-subscribe button" @click="addProject(createProject)">Create</a>
            </div>
          </div> <!-- end right-container -->
    </div> <!-- end main-container -->
 </div> <!-- end app  -->
</template>

<script>
/* globals localStorage, firebase, swal */
import co from 'co'
export default {
  beforeRouteEnter (to, from, next) {
    let local = JSON.parse(localStorage.getItem('auth'))
    if (local && local.id) {
      next()
    } else {
      next('/login')
    }
  },
  data () {
    return {
      local: JSON.parse(localStorage.getItem('auth')),
      createProject: '',
      project: '',
      searchKey: '',
      meAccount: {},
      arrayKeyCode: [],
      databases: firebase.database().ref('users/inboard/board')
    }
  },
  methods: {
    deleteBorad (key) {
      console.log(key)
      swal({
        title: 'ยืนยัน',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then(() => {
        firebase.database().ref(`users/inboard/board/${key}`).remove()
        swal({
          title: 'ลบเรียบร้อย',
          type: 'success',
          showCancelButton: true
        })
      })
    },
    addKey () {
      let Vm = this
      firebase.database().ref(`users/inboard/board`).orderByChild(`keyCode`).equalTo(Vm.searchKey).once(`value`, (snapshot) => {
        if (snapshot.val() !== null) {
          let acceptVal = Object.keys(snapshot.val())[0]
          let adminId = snapshot.val()[acceptVal].uid
          if (adminId !== Vm.local.id) {
            // เช็คว่าต้องไม่มี Board นี้อยู่แล้ว
            firebase.database().ref(`users/inboard/user`).orderByChild(`uid`).equalTo(adminId).once(`value`, (snapshot) => {
              if (snapshot.val() !== null) {
                let addKeyAdmin = Object.keys(snapshot.val())[0]
                let dataTmp = snapshot.val()[addKeyAdmin]
                if (dataTmp && dataTmp.accept) {
                  var checkAccept = Object.keys(dataTmp).map(item => dataTmp[item].keyCode)
                  if (!checkAccept.find((item) => item === Vm.searchKey)) {
                    firebase.database().ref(`users/inboard/user/${addKeyAdmin}`).child('accept').push({keyCode: Vm.searchKey, uid: Vm.local.id, status: true, time: new Date().getTime()})
                  }
                } else {
                  firebase.database().ref(`users/inboard/user/${addKeyAdmin}`).child('accept').push({keyCode: Vm.searchKey, uid: Vm.local.id, status: true, time: new Date().getTime()})
                }
              }
            })
          } else {
            // กรณี Board ซ้ำ
            swal({
              title: 'มีแล้ว',
              type: 'warning',
              showCancelButton: true
            })
          }
        } else {
          // กรณีหารหัส Board ไม่เจอ
          swal({
            title: 'ไม่มีรหัสนี้',
            type: 'warning',
            showCancelButton: true
          })
        }
      })
    },
    checkTeam (key) {
      if (key) {
        if (this.arrayKeyCode.find((item) => item === key)) {
          return true
        } else {
          return false
        }
      }
    },
    logout () {
      localStorage.clear('auth')
      this.$router.push('/login')
    },
    addProject (name) {
      console.log(name)
      let Vm = this
      if (this.NameProject !== '') {
        let GenCode = this.code()
        this.databases.push({NameProject: name, keyCode: GenCode, uid: Vm.local.id})
        firebase.database().ref(`users/inboard/user`).orderByChild(`uid`).equalTo(this.local.id).once(`value`, (snapshot) => {
          let objKeys = Object.keys(snapshot.val())
          let updateKey = firebase.database().ref('users/inboard/user').child(objKeys[0])
          updateKey.child(`keyCode`).push(GenCode)
        })
        this.createProject = ''
      }
    },
    code () {
      let text = ''
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    }
  },
  mounted () {
    // console.log(this)
    let vm = this
    vm.databases.on('value', function (snapshot, index) {
      if (snapshot.val() !== null) {
        vm.project = snapshot.val()
      }
    })
    firebase.database().ref(`users/inboard/user`).orderByChild(`uid`).equalTo(this.local.id).on(`value`, (snapshot) => {
      if (snapshot.val() !== null) {
        vm.meAccount = Object.assign(snapshot.val())
        let key = Object.keys(vm.meAccount)[0]
        this.arrayKeyCode = Object.keys(vm.meAccount[key].keyCode).map(keys => vm.meAccount[key].keyCode[keys])
      }
    })
    firebase.database().ref(`users/inboard/user`).on(`child_changed`, (snapshot) => {
      let keyAdmin = snapshot.val().uid
      firebase.database().ref(`users/inboard/board`).orderByChild(`keyCode`).equalTo(`${vm.searchKey}`).once(`value`, (snapshots) => {
        co(function *() {
          let valueSort = snapshot.val().accept
          let arrayIs = []
          // yield any promise
          yield Promise.resolve(Object.keys(valueSort).forEach((item) => {
            // console.log(valueSort[item])
            arrayIs.push(valueSort[item])
          }))
          let sortDate = yield Promise.resolve(arrayIs.sort((a, b) => (b.time - a.time)))
          return sortDate
        }).then((resoponse) => {
          console.log(resoponse)
          if (+keyAdmin === +vm.local.id) {
            console.log(true)
            swal({
              title: 'ยืนยัน',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, cancel!'
            }).then((res) => {
              console.log(resoponse)
              let addBoardUser = resoponse[0]
              firebase.database().ref(`users/inboard/user`).orderByChild(`uid`).equalTo(addBoardUser.uid).once(`value`, (resUser) => {
                if (snapshot.val() !== null) {
                  let key = Object.keys(resUser.val())[0]
                  console.log(key)
                  firebase.database().ref(`users/inboard/user/${key}`).child('keyCode').push(addBoardUser.keyCode)
                }
              })
            }).catch((error) => {
              console.log(error)
            })
          }
          console.log(resoponse)
        }).catch((onerror) => {
          console.log(onerror)
        })
      })
    })
  }
}
</script>


<style lang="css" >
/************************************ FONTS ************************************/
@import url(http://weloveiconfonts.com/api/?family=entypo|fontawesome|zocial);

[class*="fontawesome-"]:before {
  font-family: 'FontAwesome', sans-serif;
}
/************************************* END FONTS *************************************/

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
	background: #1f253d;
}

ul {
	list-style-type: none;
	margin: 0;
	padding-left: 0;
}

h1 {
	font-size: 23px;
}

h2 {
	font-size: 17px;
}

p {
	font-size: 15px;
}

a {
	text-decoration: none;
	font-size: 15px;
}

h1, h2, p, a, span{
	color: #fff;
}
  .scnd-font-color {
  color: #9099b7;
}
.input-container {
	position: relative;
  padding-top: 20px;
}
	input[type=text]{
		width: 260px;
		height: 50px;
		margin-left: 20px;
		margin-bottom: 20px;
		padding-left: 45px;
		background: #50597b;
		color: #fff;
		border: solid 1px #1f253d;
		border-radius: 5px;
	}
		input[type=text]::-webkit-input-placeholder { /* WebKit browsers */
	   		color: #fff;
	   	}
		input[type=text]:-moz-input-placeholder { /* Mozilla Firefox 4 to 18 */
	   		color: #fff;
	   	}
		input[type=text]::-moz-input-placeholder { /* Mozilla Firefox 19+ */
	   		color: #fff;
	   	}
		input[type=text]:-ms-input-placeholder { /* Internet Explorer 10+ */
	   		color: #fff;
	   	}
	   	input[type=text]:focus {
	   		outline: none; /* removes the default orange border when focus */
	   		border: 1px solid #11a8ab;
	   	}

.horizontal-list {
	margin: 0;
	padding: 0;
	list-style-type: none;
}
	.horizontal-list li {
		float: left;
	}

.clear {
	clear: both;
}

.icon {
	font-size: 25px;
}

.titular {
	display: block;
	line-height: 60px;
	margin: 0;
	text-align: center;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
  font-family: 'Exo', sans-serif;
}

.button {
	display: block;
	width: 175px;
	line-height: 50px;
	font-size: 16px;
	font-weight: 700;
	text-align: center;
	margin: 0 auto;
	border-radius: 5px;
	-webkit-transition: background .3s;
	transition: background .3s;
}

.arrow-btn-container {
	position: relative;
}
	.arrow-btn {
		position: absolute;
		display: block;
		width: 60px;
		height: 60px;
		-webkit-transition: background .3s;
		transition: background .3s;
	}
		.arrow-btn:hover {
			text-decoration: none;
		}
		.arrow-btn.left {
			border-top-left-radius: 5px;
		}
		.arrow-btn.right {
			border-top-right-radius: 5px;
			right: 0;
			top: 0;
		}
		.arrow-btn .icon {
			display: block;
			font-size: 18px;
			border: 2px solid #fff;
			border-radius: 100%;
			line-height: 17px;
			width: 21px;
			margin: 20px auto;
			text-align: center;
		}
			.arrow-btn.left .icon {
				padding-right: 2px;
			}
.profile-picture {
      	border-radius: 100%;
      	overflow: hidden;
      	-webkit-box-sizing: content-box;
        	-moz-box-sizing: content-box;
        	box-sizing: content-box;
      }
      	.big-profile-picture {
      		margin: 0 auto;
      		border: 5px solid #50597b;
      		width: 150px;
      		height: 150px;
      	}
      	.small-profile-picture {
      		border: 2px solid #50597b;
      		width: 40px;
      		height: 40px;
      	}
  /** MAIN CONTAINER **/
.main-container {
  /*font-family: 'Ubuntu', sans-serif;*/
  height: auto;
  margin: 6em auto;
  width: 1100px;
  margin-top: 0px
}
/*********************************************** HEADER ***********************************************/
header {
  height: 80px;
}
  .header-menu {
    font-size: 17px;
    line-height: 80px;
    font-family: -webkit-body;
  }
    .header-menu li {
      position: relative;
          -webkit-transform: translateZ(0); /** To avoid a flash when hover messages **/
    }
      .header-menu-tab {
        padding: 0 27px;
        display: block;
        line-height: 74px;
        font-size: 17px;
        -webkit-transition: background .3s;
        transition: background .3s;
        font-family: 'Exo', sans-serif;
      }
        .header-menu-tab:hover {
          background: #50597b;
          border-bottom: 4px solid #11a8ab;
          text-decoration: none;
        }
        .header-menu-tab .icon {
          padding-right: 15px;
        }
      .header-menu-number {
        position: absolute;
        line-height: 22px;
        padding: 0 6px;
        font-weight: 700;
        background: #e64c65;
        border-radius: 100%;
        top: 15px;
        right: 2px;
        -webkit-transition: all .3s linear;
        transition: all .3s linear;
      }
        .header-menu li:hover .header-menu-number {
          text-decoration: none;
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);

        }
  .profile-menu {
    float: right;
    height: 80px;
    /*padding-right: 20px;*/
  }
    .profile-menu p {
      font-size: 17px;
      display: inline-block;
      line-height: 76px;
      margin: 0;
      padding-right: 10px;
    }
      .profile-menu a {
        padding-left: 5px;
      }
        .profile-menu a:hover {
          text-decoration: none;
        }
    .small-profile-picture {
      display: inline-block;
      vertical-align: middle;
    }
  /** CONTAINERS **/
  .container {
    float: left;
    width: 300px;
  }
    .block {
      margin-bottom: 25px;
      background: #394264;
      border-radius: 5px;
    }
    /******************************************** LEFT CONTAINER *****************************************/
    .left-container {}
      .menu-box {
        height: 360px;
      }
    /************************************************** MIDDLE CONTAINER **********************************/
  	.middle-container {
  		margin: 0 25px;
  	}
      .middle-newsletter {
        height: 230px;
      }
      .middle-newsletter .titular {
        padding-top: 10px;
        background: #ce9d70;
      }
      .middle-subscribe.button {
        background: #11a8ab;
        font-family: 'Exo', sans-serif;
      }
      .middle-subscribe.button:hover {
          background: #0F9295;
          font-family: 'Exo', sans-serif;
      }
      .profile {
        height: 410px;
      }
      .add-button .icon {
        float: right;
        line-height: 18px;
        width: 23px;
        border: 2px solid;
        border-radius: 100%;
        font-size: 18px;
        text-align: center;
        margin: 10px;
      }
      .add-button .icon:hover {
        color: #e64c65;
        border-color: #e64c65;
        font-family: 'Exo', sans-serif;
      }
    .user-name {
      margin: 25px 0 16px;
      text-align: center;
      font-family: 'Exo', sans-serif;
    }
    .profile-description {
      width: 210px;
      margin: 0 auto;
      text-align: center;
    }
    /********************************************* RIGHT CONTAINER ****************************************/
		.right-container {}
			.join-newsletter {
				height: 150px;
			}
				.join-newsletter .titular {
					padding-top: 10px;
          background: #cc7373;
				}
				.subscribe.button {
					background: #11a8ab;
					margin-top: 10px;
          font-family: 'Exo', sans-serif;
				}
					.subscribe.button:hover {
						background: #0F9295;
					}
			.account {
				height: 390px;
			}
        .arrow-btn-container {
      	  position: relative;
        }
        	.arrow-btn {
      	  	position: absolute;
      	  	display: block;
      	  	width: 60px;
      	  	height: 60px;
      	  	-webkit-transition: background .3s;
      	  	transition: background .3s;
        	}
          .arrow-btn.left {
            border-top-left-radius: 5px;
          }
          .arrow-btn.right {
            border-top-right-radius: 5px;
            right: 0;
            top: 0;
          }

</style>
