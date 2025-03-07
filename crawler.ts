const jsdom = require('jsdom');

const { JSDOM } = jsdom;

interface Link {
	href: string;
}

class Crawler {
	public async crawl(url: string): Promise<[string[], string[]]> {
		const dom = await JSDOM.fromURL(url);

		const elements: string[][] = [];

		for (const element of dom.window.document.body.getElementsByTagName('*')) {
			if (
				element.tagName === 'P' ||
				element.tagName.startsWith('H') ||
				element.tagName === 'SPAN' ||
				element.tagName === 'DIV' ||
				element.tagName === 'PRE' ||
				element.tagName === 'CODE' ||
				element.tagName === 'EM' ||
				element.tagName === 'STRONG' ||
				element.tagName === 'SMALL' ||
				element.tagName === 'MARK' ||
				element.tagName === 'ABBR' ||
				element.tagName === 'DFN' ||
				element.tagName === 'I' ||
				element.tagName === 'B' ||
				element.tagName === 'S' ||
				element.tagName === 'U' ||
				element.tagName === 'SAMP' ||
				element.tagName === 'VAR' ||
				element.tagName === 'KBD' ||
				element.tagName === 'SUB' ||
				element.tagName === 'SUP' ||
				element.tagName === 'Q' ||
				element.tagName === 'CITE' ||
				element.tagName === 'BDO' ||
				element.tagName === 'BLOCKQUOTE' ||
				element.tagName === 'INS' ||
				element.tagName === 'DEL' ||
				element.tagName === 'DL' ||
				element.tagName === 'DT' ||
				element.tagName === 'DD' ||
				element.tagName === 'OL' ||
				element.tagName === 'UL' ||
				element.tagName === 'LI' ||
				element.tagName === 'TABLE' ||
				element.tagName === 'TBODY' ||
				element.tagName === 'THEAD' ||
				element.tagName === 'TFOOT' ||
				element.tagName === 'TR' ||
				element.tagName === 'TD' ||
				element.tagName === 'TH' ||
				element.tagName === 'FORM' ||
				element.tagName === 'FIELDSET' ||
				element.tagName === 'LEGEND' ||
				element.tagName === 'LABEL' ||
				element.tagName === 'INPUT' ||
				element.tagName === 'BUTTON' ||
				element.tagName === 'SELECT' ||
				element.tagName === 'OPTGROUP' ||
				element.tagName === 'OPTION' ||
				element.tagName === 'TEXTAREA' ||
				element.tagName === 'KEYGEN' ||
				element.tagName === 'OUTPUT' ||
				element.tagName === 'PROGRESS'
			) {
				const treatedWords = element.textContent
					.split(' ')
					.map((word: string) => {
						const lowerCase = word.toLowerCase();
						const trimmed = lowerCase.trim();
						const noSpecialChars = trimmed.replace(
							/[^a-zA-Zěščřžýáíéóúůďťň ]/g,
							''
						);

						if (
							typeof noSpecialChars === 'string' &&
							noSpecialChars.length > 0
						) {
							return noSpecialChars;
						}
					})
					.filter(Boolean);
				if (typeof treatedWords[0] !== 'undefined') elements.push(treatedWords);
			}
		}

		// Elements containing clear text
		const allWords: string[] = [];

		for (const element of elements) {
			for (const word of element) {
				allWords.push(word);
			}
		}

		// links
		const links: string[] = [];
		dom.window.document.querySelectorAll('a').forEach((link: Link) => {
			if (link.href.startsWith('https://') || link.href.startsWith('http://')) {
				links.push(link.href);
			}
		});
		return [links, allWords];
	}
}

export { Crawler };
