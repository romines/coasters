export default {
  created: function () {
  },
  methods: {
		loadSvg (imgName) {
			return require('./assets/' + imgName + '.svg')
    },
    sortByDate (a, b) {

      if (a.date + '' < b.date + '') {
        return -1
      }
      if (a.date + '' > b.date + '') {
        return 1
      }
      return 0
    },
    sortByTime (a, b) {
      if (a.time < b.time) {
        return -1
      }
      if (a.time > b.time) {
        return 1
      }
      return 0
    }
  }
}
