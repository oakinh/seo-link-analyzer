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
    const currentURLObj = new URL(currentURL);
    const baseURLObj = new URL(baseURL)

    if (currentURLObj.hostname !== baseURLObj.hostname) {
      return pages;
    }
    const response = await fetch(currentURL);
    const contentType = response.headers.get('content-type');
    console.log('response.status =', response.status);
    
    if (response.status >= 400 && response.status <= 499) {
      console.log(`400 error: ${response.status}`)
      return pages;
    }
    else if (!contentType.includes('text/html')) {
      console.log(`Error, wrong content-type header: ${contentType}`)
      return pages;
    }
    else {
      
      const normalizedCurrentURL = normalizeURL(currentURL.toString())
      console.log('Normalized Current URL:', normalizedCurrentURL)

      if (normalizedCurrentURL in pages) {
        pages[normalizedCurrentURL] += 1
        return pages;
      }
      else {
        pages[normalizedCurrentURL] = 1;
      }

      async function getHTML(response) {
        const htmlText = await response.text();
        const dom = new JSDOM(htmlText);
        return dom.window.document.body.innerHTML;
      }

      const HTML = await getHTML(response);
      // console.log('HTML Content:', HTML);
      const URLs = getURLsFromHTML(HTML, baseURL)

      for (const url of URLs) {
        try {
          console.log(`Crawling URL: ${url}`);

          pages = await crawlPage(baseURL, url, pages);
        }
        catch (innerErr) {
          console.log(`Error while crawling ${url}: ${innerErr}`);
        }
      }

    }
  } catch(err) {
    console.log(`Error crawling page: ${err}`)
  }
  console.log(pages);
  return pages;
  
}

export { normalizeURL };
export { getURLsFromHTML };
export { crawlPage };