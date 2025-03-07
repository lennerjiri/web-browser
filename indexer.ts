import { type } from 'os';
class Indexer {
	private activeFront: string[] = [];
	private waitFront: { inputUrl: string; timer: number }[] = [];

	// word -> [url1, url2, url3]
	private booleanIndex: { [key: string]: string[] }[] = [];

	constructor() {
		this.clock();
	}

	// Remove link
	public removeActiveLink(url: string): void {
		// remove from activeFront
		this.activeFront = this.activeFront.filter((url) => url !== url);
	}

	public removeWaitLink(url: string): void {
		// remove from activeFront
		this.waitFront = this.waitFront.filter((link) => link.inputUrl !== url);
	}

	// Add link
	public addActiveLink(inputUrl: string): void {
		// add to activeFront
		// check if url is already in active or wait front, if yes, return

		if (this.activeFront.find((link) => link === inputUrl)) {
			return;
		} else if (this.waitFront.find((link) => link.inputUrl === inputUrl)) {
			return;
		} else {
			this.activeFront.push(inputUrl);
		}
	}

	// Search
	public search(words: string[]): string[] | undefined {
		// create an array of words
		const patchedWords = words.map((word) => {
			if (word === 'AND') {
				return 'AND';
			} else if (word === 'OR') {
				return 'OR';
			} else {
				return word.trim().toLocaleLowerCase();
			}
		});

		// One word option
		if (patchedWords.length === 1) {
			const word = patchedWords[0];

			if (this.booleanIndex.find((wordObj) => wordObj[word])) {
				const searchResult = this.booleanIndex.find(
					(wordObj) => wordObj[word]
				) as { [key: string]: string[] };

				return searchResult[word]; // This returns the links
			} else {
				return undefined;
			}
		}

		// Multiple words option with OR and AND operators
		const searchStack: Array<string[] | 'AND' | 'OR'> = [];

		for (const word of patchedWords) {
			if (word === 'AND') {
				searchStack.push('AND');
			} else if (word === 'OR') {
				searchStack.push('OR');
			} else {
				// Perform search for word and push result onto stack
				const searchResult = this.booleanIndex.find((wordObj) => wordObj[word]);
				if (searchResult) {
					searchStack.push(searchResult[word]);
				} else {
					searchStack.push([]);
				}
			}
		}

		let combinedResult: string[] = [];

		while (searchStack.length > 0) {
			const item = searchStack.pop();
			if (item === 'AND') {
				const currentResult = searchStack.pop();
				combinedResult = combinedResult.filter((word) => {
					if (currentResult) {
						return currentResult.includes(word);
					}
				});
			} else if (item === 'OR') {
				const currentResult = searchStack.pop();

				if (currentResult && typeof currentResult === 'object') {
					combinedResult = combinedResult.concat(
						currentResult.filter((word) => !combinedResult.includes(word))
					);
				}
			} else {
				if (typeof item === 'object') {
					combinedResult = item;
				}
			}
		}

		return combinedResult;
	}

	public addWaitLink(inputUrl: string): void {
		// add to waitFront
		// check if url is already in active or wait front

		if (this.activeFront.find((url) => url === inputUrl)) {
			return;
		} else if (this.waitFront.find((link) => link.inputUrl === inputUrl)) {
			return;
		} else {
			this.waitFront.push({ inputUrl, timer: new Date().getTime() });
		}
	}

	// Add word
	public addWord(word: string, url: string): void {
		// check if word is already in booleanIndex

		const foundWord = this.booleanIndex.find((wordObj) => {
			if (wordObj[word]) {
				return true;
			}
		});

		if (foundWord) {
			if (foundWord[word].find((link) => link === url)) {
				return;
			} else {
				foundWord[word].push(url);
			}
		} else {
			this.booleanIndex.push({ [word]: [url] });
		}
	}

	// Get next for crowler
	public getNext(): string | undefined {
		const nextLink = this.activeFront.shift();

		// Add to wait front
		if (nextLink) {
			this.addWaitLink(nextLink);
		}

		return nextLink;
	}

	private getTimeDifference(h1: number, h2: number): number {
		let difference: number = (h1 - h2) / 1000;

		difference /= 60; // minutes

		return Math.abs(Math.floor(difference));
	}

	private clock(): void {
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

	public listActiveFront(): string[] {
		return this.activeFront;
	}
	public listWaitFront(): string[] {
		return this.waitFront.map((link) => link.inputUrl);
	}

	public listBooleanIndex(): { [key: string]: string[] }[] {
		return this.booleanIndex;
	}
}

export { Indexer };
