# GistReveal [![Build Status](https://travis-ci.org/1000ch/GistReveal.png?branch=master)](https://travis-ci.org/1000ch/GistReveal)

## About

This is chrome extension to use reveal.js for [gist](http://gist.github.com/).  
Make your gist presentation with reveal.js.  

## Note

```json
{
  "permissions": [
    "tabs",
    "*://*/*"
  ]
}
```

`tabs` is need to use `chrome.tabs.*` API.  
`*://*/*` is need to refer to css of `chrome-extension://` schema at `chrome.tabs.insertCSS`.  

```json
{
  "web_accessible_resources": [
    "/reveal.js/css/reveal.min.css"
  ]
}
```

If it need to load css of `chrome-extension://` schema,  
Add `<link>` node at `content.js`.  

## Problem?

Please report [issues](https://github.com/1000ch/GistReveal/issues).

## Lisence

Copyright 1000ch  

This extension is made with following resource.  
These lisence equivalent distribution.  
Other resources are lisenced under the GPL Lisence version 3.  

+ [hakimel/reveal.js](https://github.com/hakimel/reveal.js/)