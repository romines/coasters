<template lang="html">
	<button @click="run" class="pill">
		Hi, I'm a button
	</button>
</template>

<script>
export default {
	props: ['onClick', 'ocArgs'],
	methods: {
		run () {
			if (this.ocArgs) {
				this.onClick(this.ocArgs)
			}
		}
	}
}
</script>

<style lang="scss">
.pill {
  background-color: #ffffff;
  border: none;
  border-bottom: 6px solid #029ebe;
  border-top: 6px solid #029ebe;
  color: #555;
  cursor: pointer;
  display: inline-block;
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 46px;
  letter-spacing: 3px;
  line-height: 34px;
  margin: 15px 40px;
  outline: none;
  padding: 0 10px;
  position: relative;
  text-transform: uppercase;
}

.pill:before,
.pill:after {
  box-sizing: border-box;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  background-color: #ffffff;
  border-radius: 50%;
  top: -6px;
  content: "";
  height: 46px;
  position: absolute;
  width: 46px;
  border: 6px solid #ddd;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  z-index: -1;
}

.pill:before {
  right: -23px;
  border-left-color: #029ebe;
  border-bottom-color: #029ebe;
}

.pill:after {
  left: -23px;
  border-right-color: #029ebe;
  border-top-color: #029ebe;
}

.pill:hover,
.pill.hover {
  background-color: #ffffff;
}

.pill:hover:before,
.pill.hover:before,
.pill:hover:after,
.pill.hover:after {
  -webkit-transform: rotate(225deg);
  transform: rotate(225deg);
}
</style>
