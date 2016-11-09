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
      <button @click="successEdit(edit)">Save</button>
    </div>
    <form id="form" v-on:submit.prevent="addUser">
      <input v-model="newUser.NameProject">
      <input v-model="newUser.status">
      <input type="submit" value="Add User">
    </form>
  </div>
</template>

<script>
/* globals localStorage, firebase */
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
      users: [],
      newUser: {
        NameProject: '',
        status: ''
      },
      editMode: false,
      edit: {},
      editKey: '',
      databases: firebase.database().ref('users')
    }
  },
  mounted () {
    let vm = this
    vm.databases.on('child_added', function (snapshot) {
      var item = snapshot.val()
      item.id = snapshot.key
      vm.users.push(item)
    })
    vm.databases.on('child_removed', function (snapshot) {
      var id = snapshot.key
      let index = vm.users.findIndex(user => user.id === id)
      vm.users.splice(index, 1)
    })
    vm.databases.on('child_changed', function (snapshot, index) {
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
        this.databases.push(this.newUser)
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
      let update = this.databases.child(this.editKey)
      update.update(data)
      this.editMode = false
      this.editKey = ''
      this.edit.NameProject = ''
      this.edit.status = ''
    }
  }
}
</script>
