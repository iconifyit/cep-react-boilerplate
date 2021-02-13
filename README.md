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