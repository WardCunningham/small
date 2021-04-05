// https://deno.com/deploy/docs/hello-world

import { page, item } from "./page.js"

let count = {}

let routes = {
  "/favicon.ico": flag,
  "/favicon.png": flag,
  "/wind-river.json": wind_river,
  "/page-counter.json": page_counter,
  "/system/sitemap.json": sitemap,
  "/": home
}

let headers = { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }

addEventListener("fetch", (event) => event.respondWith(handle(event.request)))

function handle(request) {
  let { pathname, search, origin } = new URL(request.url)
  let counter = count[pathname] = count[pathname] || [0]
  counter[0]++
  try {
    return routes[pathname](search, origin)
  } catch (err) {
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
  let text = `<h1><img width=32px src=/favicon.ico> Federated Wiki</h1>
    <p>Static Edge Pages. <a href=http://small.fed.wiki/static-edge-pages.html> page </a></p>
    <p>Experimental Rendering. <a href=http://small.fed.wiki/assets/exp/node.html#wind-river@small.deno.dev> site </a></p>
    <p>Traditional Rendering. <a href=https://eu.wiki.org/small.deno.dev/wind-river> site </a></p>`
  return new Response(text, { headers: { "content-type": "text/html" } })
}

function sitemap() {
  let date = Date.now()
  let synopsis = "A page constructed by a foreign federated server."
  let json = [
    {"slug": "wind-river", "title": "Wind River", date, synopsis},
    {"slug": "page-counter", "title": "Page Counter", date, synopsis},
  ]
  return new Response(JSON.stringify(json,null,2), { headers })
}

function wind_river() {
  let json = page("Wind River", [
    "A lat/lon confluence near Mt. Saint Helens.",
    item('map', {text:'46,-122', zoom:10}),
    "See [[Aerial Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}

function page_counter() {
  let rows = Object.keys(count).map(k => `<tr><td>${k}<td>${count[k]}`).join("")
  let json = page("Page Counter", [
    "The server counts each time it serves any content. We are most interested in when this count resets.",
    item('html', {text:`<table>${rows}</table>`}),
    "See [[Aerial Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}