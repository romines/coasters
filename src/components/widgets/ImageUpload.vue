<template lang="html">
  <div class="image-upload">

    <slot name="title" />
    <div class="message-text">
      <slot name="message" />
    </div>


    <div class="prompt" @click="updating = !updating">
      <div class="user-image">
        <img v-if="user.photoURL" class="user-photo":src="user.photoURL">
        <div v-if="!user.photoURL" class="icon user-icon is-large placeholder">
          <i class="fa fa-user" />
        </div>
      </div>

      <a v-show="!updating">
        <slot name="text" >{{user.photoURL ? 'Update your' : 'Add a'}} photo</slot>
      </a>
    </div>

    <input v-show="updating" type="file" name="image-upload" class="add-image" accept="image/*" @change="onFileAdded">
    <progress v-show="uploading" :value="uploadProgress" max="100" class="progress is-primary">0%</progress>

    <!-- <div v-show="updating" class="buttons">
      <button class="button is-primary">Save</button>
      <button class="button">
        <slot class="cancel-button-text">Cancel</slot>
      </button>
    </div> -->

  </div>
</template>

<script>
import firebase from 'firebase'
const storageRef = firebase.storage().ref()

export default {
  data () {
    return {
      updating: false,
      uploading: false,
      uploadProgress: 0
    }
  },
  computed: {
    user () {
      return this.$store.state.authState.user ? this.$store.state.authState.user : {}
    },
  },
  methods: {
    onFileAdded (e) {
      this.uploading = true
      let vm = this
      let file = e.target.files[0]
      // Create the file metadata
      let metadata = {
        contentType: 'image/jpeg'
      }

      let extension = file.name.split('.').pop()

      let uploadTask = storageRef.child('images/' + this.user.uid + '.' + extension).put(file, metadata)

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {

          vm.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused')
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running')
              break;
          }
        }, function(error) {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        this.uploading = false
        this.$store.dispatch('updateUserPhotoURL', uploadTask.snapshot.downloadURL)
        this.$store.commit('CLOSE_MODAL')
        this.updating = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  // .image-upload {
  //   max-width: 100px;
  // }
  .message-text {
    margin-bottom: .5em;
    background-color: transparent;
  }
  .user-image {

    text-align: center;
    margin-bottom: .3em;
    .user-photo {
      max-width: 230px;
    }
  }
  .prompt {
    margin: .5em 0;
    text-align: center;
  }
  .placeholder {
    text-align: center;
    border: 1px solid grey;
  }
  input.add-image {
    margin: .65em 0;
  }
</style>
