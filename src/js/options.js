(function() {

  /**
   * DOMContentLoaded
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

  ready(function() {
    chrome.storage.sync.get("gistreveal_theme_key", function(items) {
      var theme = "default";
      if(items.hasOwnProperty("gistreveal_theme_key")) {
        theme = items["gistreveal_theme_key"];
      }
      var select = document.getElementById("js-themes");
      select.value = theme;
      select.addEventListener("change", function(e) {
        chrome.storage.sync.set({
          "gistreveal_theme_key": select.options[select.selectedIndex].value
        });
      });
    });
  });

})();