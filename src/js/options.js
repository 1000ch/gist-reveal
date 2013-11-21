(function() {

  var storageKey = {
    themeKey: "gistreveal_theme_key"
  };
  
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
    chrome.storage.sync.get(storageKey.themeKey, function(items) {
      var theme = "default";
      if(items.hasOwnProperty(storageKey.themeKey)) {
        theme = items[storageKey.themeKey];
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