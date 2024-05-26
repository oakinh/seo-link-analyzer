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

async function fetchHTML(url) {
  let response
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Network error: ${err.message}`)
  }
  if (response.status >= 400 && response.status <= 499) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
  }
  const contentType = response.headers.get('content-type')
  if (!contentType.includes('text/html')) {
    throw new Error(`Error, non-HTML response: ${contentType}`)
}
return response.text()
}


async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  const currentURLObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL)

  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages;
  }
    
  const normalizedCurrentURL = normalizeURL(currentURL)
  console.log('Normalized Current URL:', normalizedCurrentURL)

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++
    return pages;
  }
  pages[normalizedCurrentURL] = 1;

  console.log(`Crawling ${currentURL}`)
  let html = ''
  try {
    html = await fetchHTML(currentURL)
  } catch (error) {
    console.log(`${error.message}`)
    return pages
  }
  const nextURLs = getURLsFromHTML(html, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }
  return pages
}

export { normalizeURL };
export { getURLsFromHTML };
export { crawlPage };