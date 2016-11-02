<template>
  <div id="app">
    <ul>
      <li class="user" v-for="(user, key) in users" transition>
        <span>{{user.NameProject}} - {{user.status}}</span>
        <button v-on:click="removeData(user)">Delete</button>
        <button @click="editData(user, key)">Edit</button>
      </li>
    </ul>
    <div v-show="editMode === true ">
      <input v-model="edit.NameProject">
      <input v-model="edit.status">
      <button @click="successEdit(edit)"></button>
    </div>
    <form id="form" v-on:submit.prevent="addUser">
      <input v-model="newUser.NameProject">
      <input v-model="newUser.status">
      <input type="submit" value="Add User">
    </form>
  </div>
</template>

<script>
var firebase = require('firebase')
var config = {
  apiKey: 'AIzaSyDVwE2n3_YH-j5OLm-OJKx18fhkzM50-f4',
  authDomain: 'assignment-a022c.firebaseapp.com',
  databaseURL: 'https://assignment-a022c.firebaseio.com',
  storageBucket: 'assignment-a022c.appspot.com',
  messagingSenderId: '358496802319'
}
firebase.initializeApp(config)
var Users = firebase.database().ref('users')
export default {
  data () {
    return {
      users: [],
      newUser: {
        NameProject: '',
        status: ''
      },
      editMode: false,
      edit: {},
      editKey: ''
    }
  },
  mounted () {
    let vm = this
    Users.on('child_added', function (snapshot) {
      var item = snapshot.val()
      item.id = snapshot.key
      vm.users.push(item)
    })
    Users.on('child_removed', function (snapshot) {
      var id = snapshot.key
      let index = vm.users.findIndex(user => user.id === id)
      vm.users.splice(index, 1)
    })
    Users.on('child_changed', function (snapshot, index) {
      let edit = vm.users.findIndex(user => user.id === index)
      vm.users.splice(edit, 1)
      let editValue = snapshot.val()
      vm.users.push(editValue)
      console.log(editValue)
    })
  },
  computed: {
    validation: function () {
      return {
        NameProject: !!this.newUser.NameProject.trim()
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },
  methods: {
    addUser: function () {
      if (this.isValid) {
        Users.push(this.newUser)
        this.newUser.NameProject = ''
        this.newUser.status = ''
      }
    },
    removeData: function (user) {
      firebase.database().ref('users/' + user.id).remove()
    },
    editData: function (user, id) {
      console.log(user.id)
      this.editMode = true
      this.editKey = user.id
      this.edit.NameProject = user.NameProject
      this.edit.status = user.status
    },
    successEdit (edit) {
      let data = {
        NameProject: edit.NameProject,
        id: this.editKey,
        status: edit.status
      }
      firebase.database().ref('users/' + this.editKey).update(data)
      this.editKey = ''
      this.edit.NameProject = ''
      this.edit.status = ''
    }
  }
}
</script>
