export default {
  created: function () {
  },
  methods: {
		loadSvg (imgName) {
			return require('./assets/' + imgName + '.svg')
		}
  }
}
