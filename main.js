import { normalizeURL } from "./crawl.js";
import { getURLsFromHTML } from "./crawl.js";
import { crawlPage } from "./crawl.js";
import process from 'node:process';
const { argv } = process;

function main() {
    if (argv.length > 3) {
        console.log(`Error: Too many CLI arguments`)
    }
    else if (argv.length < 3) {
        console.log(`Error: Not enough CLI arguments`)
    }
    else {
        const baseURL = argv[2];
        crawlPage(baseURL);
        console.log(`Crawling has begun at ${baseURL}`);
    }
}
main();



