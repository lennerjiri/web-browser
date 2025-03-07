"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const readline = require('readline');
const { Crawler } = require('./crawler');
const { Indexer } = require('./indexer');
const indexer = new Indexer();
const crawler = new Crawler();
let promptStop = false;
let counter = 1;
let milestone = 10;
let greenFlag = false;
const askPrompt = () => __awaiter(void 0, void 0, void 0, function* () {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const name = (yield new Promise((resolve) => {
        rl.question('Enter command ( SEARCH: [word] AND/OR [word] | CONTINUE: [number] ): ', resolve);
    }));
    if (name.startsWith('SEARCH:')) {
        let search = name.split(' ');
        search.shift();
        console.log('Searching for: ' + search.join(' '));
        // run search operation
        const searchResults = indexer.search(search);
        if (typeof searchResults === 'undefined' || searchResults.length === 0) {
            console.log('No results');
        }
        else {
            for (const result of searchResults) {
                console.log(result);
            }
        }
        rl.close();
        askPrompt();
        return;
    }
    else if (name.startsWith('CONTINUE:')) {
        milestone = parseInt(name.split(' ')[1]);
        counter = 0;
        console.log('Crawling next: ' + milestone + ' pages');
        rl.close();
        promptStop = false;
        return;
    }
    else {
        console.log('Invalid command');
        rl.close();
        askPrompt();
        return;
    }
});
// Initial Crawl - Alza.cz
const crawl = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Crawling ' + milestone + ' pages');
    console.log('Crawling: ' + 'https://alza.cz');
    const items = (yield crawler.crawl('https://alza.cz'));
    console.log('Indexing: ' + 'https://alza.cz');
    indexer.addWaitLink('https://alza.cz');
    // add links
    for (const link of items[0]) {
        indexer.addActiveLink(link);
    }
    // add words
    for (const word of items[1]) {
        indexer.addWord(word, 'https://alza.cz');
    }
});
crawl();
// Crawling cycle -> for each link added to active front - cycle
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if (promptStop || greenFlag) {
        return;
    }
    greenFlag = true;
    const nextLink = indexer.getNext();
    if (nextLink) {
        console.log('Crawling: ' + nextLink);
        counter += 1;
        if (counter === milestone) {
            promptStop = true;
        }
        yield crawler.crawl(nextLink).then((items) => {
            console.log('Indexing: ' + nextLink);
            // Add any new links
            for (const link of items[0]) {
                indexer.addActiveLink(link);
            }
            // add words
            for (const word of items[1]) {
                indexer.addWord(word, nextLink);
            }
        });
        if (counter === milestone) {
            askPrompt();
        }
        greenFlag = false;
    }
}), 1500);
