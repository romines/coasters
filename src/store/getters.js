

const myCoasters = (state) => {
  return state.coasters
}

const commenting = (state) => {
  return state.commenting && (!state.route.path.includes('history')) // state.detailShowing
}

const detailKey = (state) => {
  return state.route.params.id
}

const detailCoaster = (state) => {
  if (!state.route.params.id) return

  let id = state.route.params.id
  return state.coasters.filter((coaster) => {
    return coaster.key === id
  })[0]

}

export { myCoasters
  , commenting
  , detailKey
  , detailCoaster
 }
