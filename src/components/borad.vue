<template lang="html">
  <div id="app">
    <div class="main-container">
    <header class="block">
        <ul class="header-menu horizontal-list">
          <a class="header-menu" >Name : {{Project.NameProject}}  </a>
          <a class="header-menu" >Key : {{Project.keyCode}}</a>
          <a class="header-menu-tab" ><span class="icon fontawesome-user scnd-font-color"><router-link to="{path: `/`}">BackHome</router-link></span></a>
        </ul>
    <!-- <button><router-link to="{path: `/`}">backHome</router-link></button> -->
    </header>
<div class="main-board">
  <input type="text" v-model="nameBorad">
  <button @click="createboard(nameBorad)">Create</button>
  <div v-for="(item, key) in board">
    <p>{{item.nameBorad}} <button @click="editBoard(key, item)">Edit</button><br>
      <div v-for="(list, keytask) in item.task">
        {{list}}
        <button @click="deleteTask(key, keytask)">Delete</button>
        <button @click="updateTask(key, keytask, list)">Edit</button>
      </div>
      <input type="text" v-model="item.tasktmp"><br>
      <button @click="addListTast(key, item.tasktmp)">Add Task</button>
      <button @click="DeleteHeader(key)">Delete Task</button>
    </p>

  </div>
</div>
</div>
  </div>
</template>
<script>
/* globals firebase, swal */
export default {
  data () {
    return {
      boardNow: firebase.database().ref(`users/inboard/board/${this.$route.params.keyId}`),
      board: '',
      nameBorad: '',
      keys: '',
      Project: ''
    }
  },
  mounted () {
    let vm = this
    vm.boardNow.child('detailboard').on('value', function (snapshot, index) {
      vm.board = snapshot.val()
    })
    vm.boardNow.on('value', function (snapshot, index) {
      vm.Project = snapshot.val()
    })
  },
  methods: {
    editBoard (key, item) {
      let Vm = this
      swal({
        title: 'dasdsad',
        input: 'textarea',
        inputValue: item.nameBorad,
        showCancelButton: true
      }).then(function (text) {
        swal(text)
        Vm.boardNow.child(`detailboard/${key}`).update({nameBorad: text})
      })
    },
    updateTask (key, keytask, data) {
      let Vm = this
      swal({
        title: 'dasdsad',
        input: 'textarea',
        inputValue: data,
        showCancelButton: true
      }).then(function (text) {
        if (text) {
          swal(text)
          let updates = {}
          updates[`users/inboard/board/${Vm.$route.params.keyId}/detailboard/${key}/task/${keytask}`] = text
          // console.log(firebase.database().ref(`users/inboard/board/${Vm.$route.params.keyId}/detailboard/${key}/task`).child())
          console.log(updates)
          firebase.database().ref().update(updates)
        }
      })
    },
    DeleteHeader (key) {
      swal({
        title: 'ยืนยัน',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then(() => {
        firebase.database().ref(`users/inboard/board/${this.$route.params.keyId}/detailboard/${key}`).remove()
        swal({
          title: 'ลบเรียบร้อย',
          type: 'success',
          showCancelButton: true
        })
      })
    },
    deleteTask (key, keyTask) {
      swal({
        title: 'ยืนยัน',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then(() => {
        firebase.database().ref(`users/inboard/board/${this.$route.params.keyId}/detailboard/${key}/task/${keyTask}`).remove()
        swal({
          title: 'ลบเรียบร้อย',
          type: 'success',
          showCancelButton: true
        })
      })
    },
    createboard (nameBorad) {
      this.boardNow.child('detailboard').push({nameBorad: nameBorad, tasktmp: ''})
    },
    addListTast (key, task) {
      firebase.database().ref(`users/inboard/board/${this.$route.params.keyId}/detailboard/${key}/task`).push(task)
    }
  }
}

</script>

<style lang="css" scoped>
.container {
  float: left;
  width: 300px;
}
  .block {
    margin-bottom: 25px;
    background: #394264;
    border-radius: 5px;
  }
header {
  height: 80px;
}
  .header-menu {
    font-size: 17px;
    line-height: 80px;
    font-family: 'Exo', sans-serif;
    padding-left: 30px
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
        font-family: -webkit-body;
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
.main-container {
  /*font-family: 'Ubuntu', sans-serif;*/
  height: auto;
  margin: 6em auto;
  width: 1400px;
  margin-top: 10px
}
.main-board {
  width: 1400px;
  height: 293px;
}




</style>
