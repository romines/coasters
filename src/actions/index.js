import authActions from './auth/authActions'
import shiftActions from './coasters/shiftActions'

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
