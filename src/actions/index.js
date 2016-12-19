import authActions from './authActions'
import shiftActions from './coasterActions'

export default {
  helloFromActions () {
    console.log('helloFromActions!');
  },
  secondHandShiftHi () {
    shiftActions.helloFromModule()
  },
  secondHandAuthHi () {
    authActions.helloFromModule()
  }

}
