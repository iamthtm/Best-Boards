<template lang="html">
  <div id="app">
    <p class="">{{Project.NameProject}}</p>
    <p class="">{{Project.keyCode}}</p>
    <input type="text" v-model="nameBorad">
    <button @click="createboard(nameBorad)">Create</button>
    <div v-for="(item, key) in board">
      <p>{{item.nameBorad}} {{item.keyCode}}
        <input type="text" v-model="item.tasktmp">
        <button @click="addListTast(key, item.tasktmp)">Add Task</button>
        <button @click="DeleteHeader(key)">Delete Task</button>
      </p>
      <div v-for="(list, keytask) in item.task">
        {{list}} <button @click="deleteTask(key, keytask)">Delete</button>
        <button @click="updateTask(key, keytask, list)">Edit</button>
      </div>
    </div>
    <button><router-link to="{path: `/`}">backHome</router-link></button>
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

<style lang="css">
</style>
