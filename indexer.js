"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexer = void 0;
class Indexer {
    constructor() {
        this.activeFront = [];
        this.waitFront = [];
        // word -> [url1, url2, url3]
        this.booleanIndex = [];
        this.clock();
    }
    // Remove link
    removeActiveLink(url) {
        // remove from activeFront
        this.activeFront = this.activeFront.filter((url) => url !== url);
    }
    removeWaitLink(url) {
        // remove from activeFront
        this.waitFront = this.waitFront.filter((link) => link.inputUrl !== url);
    }
    // Add link
    addActiveLink(inputUrl) {
        // add to activeFront
        // check if url is already in active or wait front, if yes, return
        if (this.activeFront.find((link) => link === inputUrl)) {
            return;
        }
        else if (this.waitFront.find((link) => link.inputUrl === inputUrl)) {
            return;
        }
        else {
            this.activeFront.push(inputUrl);
        }
    }
    // Search
    search(words) {
        // create an array of words
        const patchedWords = words.map((word) => {
            if (word === 'AND') {
                return 'AND';
            }
            else if (word === 'OR') {
                return 'OR';
            }
            else {
                return word.trim().toLocaleLowerCase();
            }
        });
        // One word option
        if (patchedWords.length === 1) {
            const word = patchedWords[0];
            if (this.booleanIndex.find((wordObj) => wordObj[word])) {
                const searchResult = this.booleanIndex.find((wordObj) => wordObj[word]);
                return searchResult[word]; // This returns the links
            }
            else {
                return undefined;
            }
        }
        // Multiple words option with OR and AND operators
        const searchStack = [];
        for (const word of patchedWords) {
            if (word === 'AND') {
                searchStack.push('AND');
            }
            else if (word === 'OR') {
                searchStack.push('OR');
            }
            else {
                // Perform search for word and push result onto stack
                const searchResult = this.booleanIndex.find((wordObj) => wordObj[word]);
                if (searchResult) {
                    searchStack.push(searchResult[word]);
                }
                else {
                    searchStack.push([]);
                }
            }
        }
        let combinedResult = [];
        while (searchStack.length > 0) {
            const item = searchStack.pop();
            if (item === 'AND') {
                const currentResult = searchStack.pop();
                combinedResult = combinedResult.filter((word) => {
                    if (currentResult) {
                        return currentResult.includes(word);
                    }
                });
            }
            else if (item === 'OR') {
                const currentResult = searchStack.pop();
                if (currentResult && typeof currentResult === 'object') {
                    combinedResult = combinedResult.concat(currentResult.filter((word) => !combinedResult.includes(word)));
                }
            }
            else {
                if (typeof item === 'object') {
                    combinedResult = item;
                }
            }
        }
        return combinedResult;
    }
    addWaitLink(inputUrl) {
        // add to waitFront
        // check if url is already in active or wait front
        if (this.activeFront.find((url) => url === inputUrl)) {
            return;
        }
        else if (this.waitFront.find((link) => link.inputUrl === inputUrl)) {
            return;
        }
        else {
            this.waitFront.push({ inputUrl, timer: new Date().getTime() });
        }
    }
    // Add word
    addWord(word, url) {
        // check if word is already in booleanIndex
        const foundWord = this.booleanIndex.find((wordObj) => {
            if (wordObj[word]) {
                return true;
            }
        });
        if (foundWord) {
            if (foundWord[word].find((link) => link === url)) {
                return;
            }
            else {
                foundWord[word].push(url);
            }
        }
        else {
            this.booleanIndex.push({ [word]: [url] });
        }
    }
    // Get next for crowler
    getNext() {
        const nextLink = this.activeFront.shift();
        // Add to wait front
        if (nextLink) {
            this.addWaitLink(nextLink);
        }
        return nextLink;
    }
    getTimeDifference(h1, h2) {
        let difference = (h1 - h2) / 1000;
        difference /= 60; // minutes
        return Math.abs(Math.floor(difference));
    }
    clock() {
        setInterval(() => {
            for (const url of this.waitFront) {
                if (this.getTimeDifference(new Date().getTime(), url.timer) === 60) {
                    // add to active front
                    this.addActiveLink(url.inputUrl);
                    // remove from wait front
                    this.removeWaitLink(url.inputUrl);
                }
            }
        }, 1000);
    }
    listActiveFront() {
        return this.activeFront;
    }
    listWaitFront() {
        return this.waitFront.map((link) => link.inputUrl);
    }
    listBooleanIndex() {
        return this.booleanIndex;
    }
}
exports.Indexer = Indexer;
