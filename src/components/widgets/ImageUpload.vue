<template lang="html">
  <div class="image-upload">
    <img v-if="user.photoURL" :src="user.photoURL" alt="">
    <span v-if="!user.photoURL" class="icon is-large">
      <i class="fa fa-user"></i>
    </span>
    <span v-show="!updating" @click="updating = !updating"><slot name="text">Click to add a photo</slot></span>
    <input v-show="updating" @change="onFileAdded" type="file" name="image-upload">
  </div>
</template>

<script>
import firebase from 'firebase'
const storageRef = firebase.storage().ref()

export default {
  data () {
    return {updating: false}
  },
  computed: {
    user () {
      return this.$store.state.authState.user ? this.$store.state.authState.user : {}
    },
  },
  methods: {
    onFileAdded (e) {

      let file = e.target.files[0];
      // Create the file metadata
      let metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      let uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
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
        this.$store.dispatch('updateUserPhotoURL', uploadTask.snapshot.downloadURL)
      });
    }
  }
}
</script>

<style lang="scss">
</style>
