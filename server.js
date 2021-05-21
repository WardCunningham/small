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
  "/test-link-click.json": test_link_click,
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
  let text = `<svg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g2" x1=".2" y1="0" x2=".8" y2="1">
      <stop offset="0%" stop-color="cornflowerblue"/>
      <stop offset="100%" stop-color="gold"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="32" height="32" fill="url(#g2)"/>
 </svg>`
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
    {"slug": "test-link-click", "title": "Test Link Click", date, synopsis},
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
    "We choose a suburban location at random.",
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
    "We choose a suburban location at random.",
    item('map', {text, zoom:12}),
    "More [[Hello, Portland]]",
    "See [[Aerial Map]], [[Topo Map]]"
  ])
  return new Response(JSON.stringify(json,null,2), { headers })
}

function test_link_click() {
  let json = page("Test Link Click",[
    "We explore the definition of functional tests in wiki pages where specific features can be present or invoked by pragmas that begin with ►.",
    "We click to browse starting with [[How To Wiki]].",
    "Sites have default pages that are always there if not part of the sitemap. Here we launch into standard documentation.",
    "► click How To Wiki",
    "We click through to newer documentation brought into the neighborhood with collaborative links.",
    "► click Field Guide to the Federation",
    "► click You're New Here",
    "Plugins provide about pages that are also hidden from the sitemap but available from the origin on every site with the plugin installed or from collaborators.",
    "► click About Flagmatic Plugin",
    "► show lineup",
    "Links from earlier panels replace to the right. Tests always click the rightmost of duplicated links.",
    "► click Welcome Your Community",
    "A link in a Reference is still resolved collaboratively with the referenced site in front of remote forks.",
    "[[Link Dynamics]] considers mechanisms required.",
    "► show 1 panel",
    "► click Chorus of Voices",
    "► show lineup",
    "Click pragmas must match the case of the link text they intend to click. Those with no match are ignored.",
    "► click how to wiki",
    "Link text referring to [[A Non-Existant Page]] can be found and will fail when clicked.",
    "► fail click A Non-Existant Page"
  ], "small.fed.wiki")
  return new Response(JSON.stringify(json,null,2), { headers })
}
