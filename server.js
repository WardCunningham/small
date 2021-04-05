// https://deno.com/deploy/docs/hello-world

import { page, item } from "./page.js"

addEventListener("fetch", (event) => event.respondWith(handle(event.request)))

function handle(request) {
  let routes = {
    "/favicon.ico": flag,
    "/wind-river.json": wind_river,
    "/": home
  }
  let { pathname, search, origin } = new URL(request.url)
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
    <p>Traditional Rendering. <a href=http://fed.wiki/view/small.deno.dev/wind-river> site </a></p>`
  return new Response(text, { headers: { "content-type": "text/html" } })
}

function wind_river() {
  let json = page("Wind River", [
    "A lat/lon confluence near Mt. Saint Helens.",
    item('map', {text:'46,-122', zoom:10}),
    "See [[Aerial Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*"}})
}