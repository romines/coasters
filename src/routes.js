import App from './components/App.vue'
import New from './components/New.vue'
import List from './components/List.vue'

const Test = { template: '<h3>this is the test child route</h3>' }
const Bar = { template: '<div>the bar is: {{ $route.params.id }}</div>' }

export default [
  { path: '/coasters', component: App, alias: '/',
    children: [
      {
        path: '',
        component: List
      },
      {
        path: '/test',
        component: Test
      },
      {
        path: '/post',
        component: New
      }
    ]
 },
  { path: '/bar/:id', component: Bar }
]
