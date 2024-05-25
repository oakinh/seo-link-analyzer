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

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  try {
    const response = await fetch(baseURL);
    const contentType = response.headers.get('content-type');
    console.log('response.status =', response.status);
    
    if (response.status >= 400 && response.status <= 499) {
      console.log(`400 error: ${response.status}`)
      return;
    }
    else if (!contentType.includes('text/html')) {
      console.log(`Error, wrong content-type header: ${contentType}`)
      return;
    }
    else {
      const htmlText = await response.text();
      const dom = new JSDOM(htmlText);
      console.log(dom.window.document.body.innerHTML)
    }
  } catch(err) {
    console.log(`Error crawling page: ${err}`)
  }
}

export { normalizeURL };
export { getURLsFromHTML };
export { crawlPage };