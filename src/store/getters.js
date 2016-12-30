import _ from 'underscore'

const hundreds = (state) => {
  return state.count * 100
}

const myCoasters = (state) => {
  return state.coasters
}

const commenting = (state) => {
  return state.commenting && (!state.route.path.includes('history')) // state.detailShowing
}

const detailShowing = (state) => {

  function isDetail() {
    // return !state.route.path.includes('history')
    return true
  }

  return isDetail()
}

const detailKey = (state) => {
  return state.route.params.id
}

const detailCoaster = (state) => {
  if (!state.route.params.id) return

  // let getCoasterByKey = (key) => {
  //   let obj = {}
  //   obj['key'] = key
  //   return _.where(state.coasters, obj)[0]
  // }

  let myCoaster
  state.coasters.forEach((coaster) => {
    console.log(coaster.key, state.route.params.id, (coaster.key === state.route.params.id))
    if (coaster.key === state.route.params.id) myCoaster = coaster
  })

  // return getCoasterByKey(state.route.params.id)
  // let myCoaster = state.coasters.find((coaster) => {
  //   return coaster.key === state.route.params.id
  // })
  console.log(myCoaster);
  return myCoaster

}

export { hundreds
  , myCoasters
  , commenting
  , detailShowing
  , detailKey
  , detailCoaster
 }
