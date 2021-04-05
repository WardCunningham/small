export { page, item }

// from http://js.ward.asia.wiki.org/create-items-and-pages.html

function id() {
  let rand = Math.floor(2**48*Math.random())
  return rand.toString(16)
}

// Items and Actions are objects with type and properties, some of which are generated automatically. mdn 

function item (type, props) {
  return Object.assign({type, id:id()}, props)
}

function action (type, props) {
  let date = Date.now()
  return Object.assign({type, date}, props)
}

// A Story is made from Items or strings turned to items. A Page adds a Title and Journal to the story.

function story (items) {
  return items.map(each =>
    typeof each == typeof "" ?
      item('paragraph', {text:each}) :
      each
  )
}

function page (title, items) {
  let page = {title, story:story(items)}
  let item = JSON.parse(JSON.stringify(page))
  page.journal = [action('create',{item})]
  return page
}

// Many pages start with an empty create action but for bulk generated pages we include most of the page as the item being created, once carefully copied.

page("Wind River", [
  "A lat/lon confluence near Mt. Saint Helens.",
  item('map', {text:'46,-122', zoom:10}),
  "See [[Aerial Map]]"
])