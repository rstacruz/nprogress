## Testing

```sh
npm install
npm test
```

## Website

The website is on the [gh-pages](https://github.com/rstacruz/nprogress/tree/gh-pages) branch.

````sh
git clone https://github.com/rstacruz/nprogress.git nprogress-pages -b gh-pages
```

## Releasing

```sh
$ npm test
$ bump *.json nprogress.js          # bump version numbers
$ git release 0.1.1                 # release to bower/github
$ npm publish                       # release to npm
$ git push origin master:gh-pages   # update the site
````
