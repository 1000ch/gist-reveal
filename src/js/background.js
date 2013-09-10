(function() {

  //when a tab is activated,
  //update contentScript settings.
  chrome.tabs.onActivated.addListener(function(activeInfo) {
  });

  //when the icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab) {
      return;
    }

    //insert css
    chrome.tabs.insertCSS(tab.id, {file: "/reveal.js/css/reveal.min.css"});
    chrome.tabs.insertCSS(tab.id, {file: "/reveal.js/css/theme/default.css"});

    //if it need to load css of chrome-extension schema
    //use cssFile string for loading
    //cssFile: chrome.extension.getURL("/reveal.js/css/reveal.min.css")
    sendMessage(tab.id, {}, noop);
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