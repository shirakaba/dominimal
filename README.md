# dominimal

A minimal subset of jsdom, focusing on DOM (and omitting wider Web APIs).

## Installation

```sh
npm install dominimal
```

## Usage

```js
// dominimal exports all the same modules as jsdom.
const dominimal = require('dominimal');
const { JSDOM } = dominimal;

const jsdom = new JSDOM('', { pretendToBeVisual: true });
const { document } = jsdom.window;
const body = document.createElement('body');
document.documentElement.appendChild(body);

console.log(jsdom.serialize());
```
