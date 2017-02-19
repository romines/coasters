<template lang="html">
  <div v-if="user" class="user">
    <h1 class="title header">My Coasters</h1>

    <div class="media">
      <div class="media-left">
        <figure class="user">
          <img v-if="user.photoURL" :src="user.photoURL" alt="">
          <span v-if="!user.photoURL" class="icon is-large">
            <i class="fa fa-user"></i>
          </span>
          <div class="change-image">
            <label for="image-upload">Change Image</label>
            <input @change="onFileAdded" type="file" name="image-upload">
          </div>
        </figure>
      </div>

      <div class="media-content">
        <ul>
          <li>{{user.displayName}}</li>
          <li>{{user.email}}</li>
          <li><a @click="logOut">Log out</a></li>
        </ul>
      </div>
    </div>

    <section class="posted-shifts">
      <span class="title is-5">Posted Shifts</span>
      <ul>
        <coaster :options="{}" v-for="coaster in myPostedCoasters" :coaster="coaster">
      </ul>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Shifts I'm Covering</span>
      <ul>
        <coaster :options="{}" v-for="coaster in myPickedUpCoasters" :coaster="coaster">
      </ul>
    </section>

  </div>
</template>

<script>
import List from '../List.vue'
import Coaster from '../Coaster/Coaster.vue'
import router from '../../router'
import firebase from 'firebase'

const storageRef = firebase.storage().ref()

export default {
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.authState.user
    },

    myPostedCoasters () {
      return this.$store.state.coasters.filter((coaster) => {
        return coaster.postedBy.uid === this.user.uid
      })
    },

    myPickedUpCoasters () {

      return this.$store.state.coasters
      .filter((coaster) => {
        return coaster.coasterHistory
      })
      .filter((coaster) => {
        let history = coaster.coasterHistory
        let lastPickup
        for(var item in history) {
            lastPickup = history[item]
        }

        return lastPickup.pickedUpBy.uid === this.user.uid

      })

    }
  },
  components: {
    Coaster
  },

  methods: {
    logOut () {
      router.push('/')
      this.$store.dispatch('logOutUser')
    },
    onFileAdded (e) {

      var file = e.target.files[0];
      // Create the file metadata
      var metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

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
  },
  created () {
    if (this.$store.state.coasters.length < 1) this.$store.dispatch('getCoasters')
  }
}
</script>

<style lang="scss">
.user {
  .media img {
    width: 74px;
    height: 74px;
    object-fit: cover;
  }
  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
