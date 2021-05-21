// Convert page json to javascript page function
// Usage: deno run --allow-net unpage.js http://small.fed.wiki/test-link-click.json

let url = Deno.args[0]
let [protocol, site, endpoint] = url.split(/\/+/)
let page = await fetch(url).then(res => res.json())
let code = `page("${page.title}",[
${page.story.map(item => `  "${item.text}"`).join(",\n")}
], "${site}")`
console.log(code)