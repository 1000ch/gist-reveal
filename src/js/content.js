(function() {

  //listen message
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("message has received.");
  });

  /**
   * listen DOMContentLoaded
   * @param {Function} callback
   */
  function ready(callback) {
    if(["complete", "loaded", "interactive"].indexOf(document.readyState) !== -1) {
      callback.call(document);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        callback.call(document);
      });
    }
  }
})();