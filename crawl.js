import { JSDOM } from 'jsdom';

const myURL =
  new URL('https://blog.boot.dev/path/');



function normalizeURL(aURL) {
    const myURL = new URL(aURL);
    let newURL = myURL.hostname + myURL.pathname
    return newURL.replace(/\/$/, "")
}

function getURLsFromHTML(html, baseURL) {
  const urls = []
  const dom = new JSDOM(html)
  const anchors = dom.window.document.querySelectorAll('a')

  for (const anchor of anchors) {
    if (anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href')

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href
        urls.push(href)
      } catch(err) {
        console.log(`${err.message}: ${href}`)
      }
    }
  }

  return urls
}





export { normalizeURL };
export { getURLsFromHTML };