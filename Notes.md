Version numbers
---------------

    $ bump package.json component.json nprogress.js

Testing
-------

    $ npm install
    $ npm test

or

    $ open test/index.html

Pushing
-------

    $ git push origin master

Releasing
---------

Tag and stuff (`git release`), then:

    $ git push origin master:gh-pages
