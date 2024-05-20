import { normalizeURL } from "./crawl.js";
import { getURLsFromHTML } from "./crawl.js";
import { argv } from 'node:process';


function main() {
    argv.forEach((val, index) => {
        console.log(`${index}: ${val}`)
    });
}

main();



