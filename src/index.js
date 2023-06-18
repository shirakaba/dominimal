const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('', { pretendToBeVisual: true });
const { document } = jsdom.window;
const body = document.createElement('body');
document.documentElement.appendChild(body);

console.log(jsdom.serialize());
