

export default {

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

  , isAdmin (state) {
    return state.authState.isAdmin
  }
}
