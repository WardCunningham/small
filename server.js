// https://deno.com/deploy/docs/hello-world

import { page, item } from "./page.js"

let count = {}

let routes = {
  "/favicon.ico": flag,
  "/favicon.png": flag,
  "/wind-river.json": wind_river,
  "/page-counter.json": page_counter,
  "/hello-chicago.json": chicago,
  "/hello-portland.json": portland,
  "/system/sitemap.json": sitemap,
  "/system/countmap.json": countmap,
  "/": home
}

let headers = { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }

addEventListener("fetch", (event) => event.respondWith(handle(event.request)))

function handle(request) {
  let { pathname, search, origin } = new URL(request.url)
  count[pathname] = count[pathname] || 0
  count[pathname]++
  try {
    return routes[pathname](search, origin)
  } catch (err) {
    console.log(pathname)
    console.log(err)
    return new Response(`<pre>${err}</pre>`, {status:500})
  }
}

// https://css-tricks.com/emojis-as-favicons/
// https://unicode.org/emoji/charts/full-emoji-list.html

function flag() {
  let text = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎅</text></svg>`
  return new Response(text, { headers: { "content-type": "image/svg+xml", "Access-Control-Allow-Origin": "*" } })
}

function home() {
  const link = (label, site) => `<p>${label}. <a href=${site} target=_blank> site </a></p>`
  let text = `<h1><img width=32px src=/favicon.ico> Federated Wiki</h1>
    ${link('Static Edge Pages','http://small.fed.wiki/static-edge-pages.html')}
    ${link('Experimental Rendering','http://small.fed.wiki/assets/exp/node.html#wind-river@small.deno.dev')}
    ${link('Traditional Rendering','https://eu.wiki.org/view/recent-changes/small.deno.dev/wind-river')}
  `
  return new Response(text, { headers: { "content-type": "text/html" } })
}

function sitemap() {
  let date = Date.now()
  let synopsis = "A page constructed by a foreign federated server."
  let json = [
    {"slug": "wind-river", "title": "Wind River", date, synopsis},
    {"slug": "page-counter", "title": "Page Counter", date, synopsis},
    {"slug": "hello-chicago", "title": "Hello, Chicago", date, synopsis},
    {"slug": "hello-portland", "title": "Hello, Portland", date, synopsis},
  ]
  return new Response(JSON.stringify(json,null,2), { headers })
}

function countmap() {
  return new Response(JSON.stringify(count,null,2), { headers })
}

function wind_river() {
  let json = page("Wind River", [
    "A lat/lon confluence near Mt. Saint Helens.",
    item('map', {text:'46,-122', zoom:10}),
    "See [[Aerial Map]], [[Topo Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}

function page_counter() {
  let rows = Object.keys(count).map(k => `<tr><td>${count[k]}<td>${k}`).join("")
  let json = page("Page Counter", [
    "The server counts each time it serves any content. We are most interested in when this count resets.",
    item('html', {text:`<table>${rows}</table>`})
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}

function chicago() {
  const latlon = () => [41.6 + Math.random()/2, -88.14 + Math.random()/2].join(",")
  let json = page("Hello, Chicago", [
    "We choose a suburban locaction at random.",
    item('map', {text:latlon(), zoom:12}),
    "More [[Hello, Chicago]]",
    "See [[Aerial Map]], [[Topo Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}

// 45.4769396, -122.7457809
// 45.5428628, -122.6105118

function portland() {
  const rn = (lo,hi) => lo + Math.random()*(hi-lo)
  let text = [rn(45.477, 45.543),rn(-122.75, -122.61)].join(',')
  let json = page("Hello, Portland", [
    "We choose a suburban locaction at random.",
    item('map', {text, zoom:12}),
    "More [[Hello, Portland]]",
    "See [[Aerial Map]], [[Topo Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}
