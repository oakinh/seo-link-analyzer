function printReport(pages) {
    console.log(`SEO link report is starting...`)
    console.log('=============')
    console.log('REPORT')
    console.log('=============')
    const sortedPages = sortReport(pages);
    for (const [url, count] of Object.entries(sortedPages)) {
        console.log(`Found ${count} internal links to ${url}`)
    }
    console.log('=============')
    console.log('END REPORT')
    console.log('=============')
}

function sortReport(pages) {
    const sortable = Object.fromEntries(
        Object.entries(pages).sort(([,a],[,b]) => b-a)
    );
    return sortable;
}

export { printReport }