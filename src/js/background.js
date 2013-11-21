(function() {

  var storageKey = {
    themeKey: "gistreveal_theme_key"
  };

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for(var key in changes) {
      var storageChange = changes[key];
      console.log(
        'Storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".',
        key, namespace, storageChange.oldValue, storageChange.newValue);
    }
  });

  //when a tab is activated,
  //update contentScript settings.
  chrome.tabs.onActivated.addListener(function(activeInfo) {});

  //when the icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab) {
      return;
    }

    var fonteot = chrome.extension.getURL("/reveal.js/lib/font/league_gothic-webfont.eot");
    var fonteotiefix = chrome.extension.getURL("/reveal.js/lib/font/league_gothic-webfont.eot?#iefix");
    var fontwoff = chrome.extension.getURL("/reveal.js/lib/font/league_gothic-webfont.woff");
    var fontttf = chrome.extension.getURL("/reveal.js/lib/font/league_gothic-webfont.ttf");
    var fontsvg = chrome.extension.getURL("/reveal.js/lib/font/league_gothic-webfont.svg#LeagueGothicRegular");

    var fontDefinition =
      '@font-face {' +
        'font-family: "League Gothic";' +
        'src: url("' + fonteot + '");' +
        'src: url("' + fonteotiefix + '") format("embedded-opentype"), url("' + fontwoff + '") format("woff"), url("' + fontttf + '") format("truetype"), url("' + fontsvg + '") format("svg");' +
        'font-weight: normal;' +
        'font-style: normal;' +
      '}';

    chrome.storage.sync.get(storageKey.themeKey, function(items) {
      var theme = "default";
      if(items[storageKey.themeKey]) {
        theme = items[storageKey.themeKey];
      }

      //insert css
      chrome.tabs.insertCSS(tab.id, {file: "/reveal.js/css/reveal.min.css"});
      chrome.tabs.insertCSS(tab.id, {file: "/reveal.js/css/theme/" + theme + ".css"});
      chrome.tabs.insertCSS(tab.id, {code: fontDefinition});

      //if it need to load css of chrome-extension schema
      //use cssFile string for loading
      //cssFile: chrome.extension.getURL("/reveal.js/css/reveal.min.css")
      sendMessage(tab.id, {
        theme: theme
      }, noop);
    });
  });

  /**
   * send message to tab
   * @param {Number} tabId
   * @param {Object} message
   * @param {Function} callback
   */
  function sendMessage(tabId, message, callback) {
    try {
      chrome.tabs.sendMessage(tabId, message, callback);
    } catch(e) {
      console.log(e);
    }
  }

  /**
   * noop function
   */
  function noop() {}

})();