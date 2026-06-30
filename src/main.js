import 'hover-tilt/web-component' // registers <hover-tilt> (used by ?engine=hovertilt)
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
