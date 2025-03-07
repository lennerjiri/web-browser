'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.Crawler = void 0;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
class Crawler {
	crawl(url) {
		return __awaiter(this, void 0, void 0, function* () {
			const dom = yield JSDOM.fromURL(url);
			const elements = [];
			for (const element of dom.window.document.body.getElementsByTagName(
				'*'
			)) {
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
						.map((word) => {
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
					if (typeof treatedWords[0] !== 'undefined')
						elements.push(treatedWords);
				}
			}
			// Elements containing clear text
			const allWords = [];
			for (const element of elements) {
				for (const word of element) {
					allWords.push(word);
				}
			}
			// links
			const links = [];
			dom.window.document.querySelectorAll('a').forEach((link) => {
				if (
					link.href.startsWith('https://') ||
					link.href.startsWith('http://')
				) {
					links.push(link.href);
				}
			});
			return [links, allWords];
		});
	}
}
exports.Crawler = Crawler;
