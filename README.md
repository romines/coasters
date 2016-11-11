# to-vuex-fire

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

Forked from [webpack-simple](https://github.com/vuejs-templates/webpack-simple).

To create your own webpack simple fire, add some firebase credentials to src/firebase.js

```javascript
import firebase from 'firebase'

let config = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "bucket.appspot.com"
  };

eexport default firebase.initializeApp(config)
```
