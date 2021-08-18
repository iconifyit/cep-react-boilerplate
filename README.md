# CEP Barebones

*NB: My apologies in advance for the Mac OS & Linux-centric nature of the documentation and code as well as the Adobe Illustrator focus of the panel. This codebase was created for my own needs first before I decided to share the code based on conversations with other developers who were struggling with implementing React & Webpack with CEP panels. I promise I will eventually update the code to be more OS-agnostic. Feel free to create a PR to submit improvements.*

This is meant to be a bare-bones boilerplate for creating CEP extensions for Adobe Creative Cloud apps. I tried to keep the boilterplate as unopinionated 
as possible but included some of my own preferences because I think they make certain tasks common to the JS -> JSX context communication easier. For instance, the use of [JSX.js](https://creative-scripts.com/jsx-js/), the `HostResponse` object, and the `host.(fn, callback)` technique. These are very easy to learn and have made development much faster and less error prone.

## Usage

I will eventually set this up as an NPM package but for now:

### Mac OS/Linux

- git clone https://github.com/iconifyit/cep-barebones.git
- cd cep-barebones
- npm install
- npm run dev
- source install-dev.sh

The commands above will:

- clone the code locally
- install the dependencies
- build the cep code
- create symlink from the dist folder to your extensions folder

If you find a bug, feel free to open an [issue](https://github.com/iconifyit/cep-barebones/issues) or submit a [pull request](https://github.com/iconifyit/cep-barebones/pulls) to contribute. All contributors will be credited.

## Build & Run

Build only the client context

```bash
cd cep-barebones
npm run client
```

Build only the host context

```bash
cd cep-barebones
npm run host
```

Development build (builds client & host contexts)

```bash
cd cep-barebones
npm run dev
```

Production build (builds client & host contexts & ZXP)

```bash
cd cep-barebones
npm run build
```

## Technologies Used
- React/Redux for the front-end architecture
- Ant Design for the UI
- Babel to transpile from ES6 to ES5
- Webpack for builds
- NodeJS
- require

## What You Should Know
First, I have used this boilerplate to create a handful of commercial, production extensions and have refined it over numerous personal and professional projects. I have tried to make this code as un-opinionated as possible but have included a few techniques that I think make the CEP dev process a lot easier or to handle very common use cases (such as custom FlyoutMenu  and ContextMenuRouter classes). I have also included some personal classes for Illustrator that I have used over-and-over (for instance, ArtboardIterator).

Next, you can write your JSX (ExtendScript) context code in ES6. When you run `npm run dev` babel will transpile the code to regular old JavaScript. That said, you should avoid using any of the really non-standard conventions that are included in JSX such as the `#include` directive.

Also, you will notice that the code uses `require` instead of `import`. I have found that using `import` in CEP is a lot more  error-prone. I think maybe it is due to the mixed-context nature of CEP but I have not verified that hypothesis. If you need to convert an `import` statement to `require` you can do so by changing the code like so:
```js
import React from 'react';
// Becomes
const React = require('react');
```

If you are importing specific classes or properties from a module, you can do this:

```js
import {Button} from 'react-bootstrap';

// Becomes

const Button = require('react-bootstrap').Button;

// Or

const {Button} = require('react-bootstrap');
```

To make life easier, I used some simple Regex to replace `import` statements with `require` statements. 

__Search__
```regex
import \{([a-zA-Z]+)\} from '([a-zA-Z-0-9]+)';
```

__Replace__
```regex
const {$1} = require('$2');
```


Use caution with trying to modify webpack.host.js. The config is pretty simple but it was necessary to add quite a few polyfills to allow the use of ES6. Babel does a pretty good job transpiling the code but there were some issues due to the fact that CEP uses an older version of JS. Things like Object.keys, Object.defineProperty, Function.call, Function.bind did not exist. I have not tested the JSX context implementation as thoroughly as you would want for a production build so be sure to test your code very well (and create a [Pull Request](https://github.com/iconifyit/cep-barebones/pulls) or submit an [issue](https://github.com/iconifyit/cep-barebones/issues) if you'd like to help improve CEP-barebones).

The front end code is as close to pure React/Redux as possible. You can build out the front end React/Redux app pretty much the way you normally would provided that you don't change anything above the last line of the `client/index.js` file. Feel free to modify the last line, which is a `ReactDOM.render()` call the same as any other React app. One thing I would like to do is add Redux to manage state and implement a Router class.

## Support
If you use this code for a commercial product, I'd love to hear about it and list them on this page. There is no need to attribute me but it would be a nice gesture. If you make money from the code, I'd love it if you make a nominal donation to any of the following: 
- Any animal welfare or rescue organization
- Access to clean water
- Education for at-risk youth
