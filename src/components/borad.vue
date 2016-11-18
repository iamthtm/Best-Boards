<template lang="html">
  <div id="app">
    <input type="text" v-model="nameBorad">
    <button @click="createboard(nameBorad)">Create</button>
    <div v-for="(item, key) in board">
      <p>{{item.nameBorad}} {{item.keyCode}}
        <input type="text" v-model="item.tasktmp">
        <button @click="addListTast(key, item.tasktmp)">Add Task</button>
      </p>
      <div v-for="(list, keytask) in item.task">
        {{list}} <button @click="deleteTask(key, keytask)">Delete</button>
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
      keys: ''
    }
  },
  mounted () {
    let vm = this
    vm.boardNow.child('detailboard').on('value', function (snapshot, index) {
      vm.board = snapshot.val()
    })
    swal(
      'Oops...',
      'Something went wrong!',
      'error'
    )
  },
  methods: {
    deleteTask (key, keyTask) {
      firebase.database().ref(`users/inboard/board/${this.$route.params.keyId}/detailboard/${key}/task/${keyTask}`).remove()
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
