

export default {

  // this does not belong in app state
  // , commenting (state) {
  //   return state.commenting && (!state.route.path.includes('history')) // state.detailShowing
  // }

  detailKey (state) {
    return state.route.params.id
  }

  , detailCoaster (state) {
    if (!state.route.params.id) return

    let id = state.route.params.id
    return state.coasters.filter((coaster) => {
      return coaster.key === id
    })[0]

  }
}
