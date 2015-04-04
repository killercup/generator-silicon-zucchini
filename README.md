# Silicon Zucchini Generator

[![Build Status](https://travis-ci.org/killercup/generator-silicon-zucchini.svg?branch=master)](https://travis-ci.org/killercup/generator-silicon-zucchini)

> [SiliconZucchini](https://github.com/killercup/silicon-zucchini)

> [Yeoman](http://yeoman.io) generator


## Getting Started

Install yeoman:

```bash
$ npm install -g yo
```

Install this generator:

```bash
$ npm install -g killercup/generator-silicon-zucchini
```

Finally, initiate the generator:

```bash
yo silicon-zucchini
```

## Features

- Initiate folder structure and example files for Silicon Zucchini
  - Example pages with permalinks
  - Header, footer partials
  - Navigation partials
  - Automatic Styleguide (optional)
- Use SCSS for Stylesheets
  - Optionally includes [bourbon](http://bourbon.io/), [neat](http://neat.bourbon.io/) and [normalize-opentype](https://github.com/kennethormandy/normalize-opentype.css)
- Build using Gulp 4
  - Quick development with live reloading server (`npm start`)
  - Compile assets for production (`npm run compile`) including HTML/CSS minification and asset fingerprinting (add hash to filename and rewriting links to make assets infinitely cacheable)

## TODO

- Workflow for JS assets
- Image optimization (and embedding small images using base64)

## License

MIT
