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
   * extend object
   * @param {Object} obj
   * @param {Object} src
   */
  function extend(obj, src) {
    for(var key in src) {
      if(src.hasOwnProperty(key)) {
        obj[key] = src[key];
      }
    }
    return obj;
  }

  /**
   * noop function
   */
  function noop() {}

})();