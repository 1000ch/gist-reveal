(function() {

  var forEach = [].forEach;
  var slice = [].slice;
  var filter = [].filter;

  /**
   * querySelector alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {Node}
   */
  var qs = function(selector, context) {
    return (context || document).querySelector(selector);
  };

  /**
   * document.querySelectorAll alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {NodeList}
   */
  var qsa = function(selector, context) {
    return (context || document).querySelectorAll(selector);
  };

  /**
   * document.getElementById alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {NodeList}
   */
  var byId = function(id) {
    return document.getElementById(id);
  };

  /**
   * getElementsByClassName alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {Node}
   */
  var byClass = function(className, context) {
    return (context || document).getElementsByClassName(className);
  };

  /**
   * getElementsByTagName alias
   * @param {string} tagName
   * @param {HTMLElement} context
   * @returns {Node}
   */
  var byTag = function(tagName, context) {
    return (context || document).getElementsByTagName(tagName);
  };

  /**
   * create node
   * @param {string} tagName
   * @param {object} param
   * @returns {HTMLElement}
   */
  function createNode(tagName, param) {
    var node = document.createElement(tagName);
    var key;
    for(key in param) {
      node.setAttribute(key, param[key]);
    }
    return node;
  }

  /**
   * wrap node
   * @param {HTMLElement} targetNode
   * @param {HTMLElement} destNode
   */
  function wrapNode(targetNode, destNode) {
    //append clone of targetNode to wrapNode
    destNode.appendChild(targetNode.cloneNode(true));
    //append cloned node and remove before node
    var parentNode = targetNode.parentNode;
    parentNode.insertBefore(destNode, targetNode);
    parentNode.removeChild(targetNode);
  }

  /**
   * move node
   * @param {HTMLElement} targetNode
   * @param {HTMLElement} destNode
   */
  function moveNode(targetNode, destNode) {
    //append clone of targetNode to destNode
    destNode.appendChild(targetNode.cloneNode(true));
    //remove itself
    removeNode(targetNode);
  }

  /**
   * remove node
   * @param {HTMLElement} targetNode
   */
  function removeNode(targetNode) {
    if(targetNode && targetNode.parentNode) {
      targetNode.parentNode.removeChild(targetNode);
    }
  }

  /**
   * get sibling
   * @param {HTMLElement} targetNode
   * @returns {HTMLElement}
   */
  function getSibling(targetNode) {
    var node = targetNode;
    while ((node = node.nextSibling) && node.nodeType !== 1) {}
    return node;
  }

  /**
   * add class to node
   * @param {HTMLElement} targetNode
   * @param {string} className
   */
  function addClass(targetNode, className) {
    if(targetNode) {
      var classArray = className.split(" ");
      forEach.call(classArray, function(name) {
        targetNode.classList.add(name);
      });
    }
  }

  /**
   * remove class from node
   * @param {HTMLElement} targetNode
   * @param {string} className
   */
  function removeClass(targetNode, className) {
    if(targetNode) {
      var classArray = className.split(" ");
      forEach.call(classArray, function(name) {
        targetNode.classList.remove(name);
      });
    }
  }

  //listen message
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("message has received.");

    //add .gs-slide to article.markdown-body
    addClass(qs(".markdown-body"), "gs-slide");

    //remove classes
    removeClass(qs(".gs-slide"), "markdown-body js-file js-task-list-container is-task-list-enabled");

    //move article.markdown-body to body
    moveNode(qs(".gs-slide"), document.body);

    //hide elements
    addClass(byId("wrapper"), "is-hidden");
    addClass(byId("ajax-error-message"), "is-hidden");
    addClass(qs(".js-task-list-field"), "is-hidden");
    addClass(qs("footer"), "is-hidden");

    //get headers under .gs-slide
    var slideParent = qs(".tmp-container");
    var header1 = slice.call(byTag('h1', slideParent));
    var header2 = slice.call(byTag('h2', slideParent));
    var headers = header1.concat(header2);
    //filter element which has secret class
    headers = filter.call(headers, function(header) {
      return !header.classList.contains("secret");
    });

    //wrap headers with section.tmp-slide
    forEach.call(headers, function(header) {
      //wrap header with section.tmp-slide
      wrapNode(header, createNode("section", {
        class: "tmp-slide"
      }));
    });

    //move following elements to section.tmp-slide
    var slideSections = byClass("tmp-slide", qs(".tmp-container"));
    forEach.call(slideSections, function(slide) {
      var moveNodeList = [];
      var element = getSibling(slide);
      while(element && !element.classList.contains("tmp-slide")) {
        moveNodeList.push(element);
        element = getSibling(element);
      }
      forEach.call(moveNodeList, function(node) {
        moveNode(node, slide);
      });
    });

    var reveal = createNode("div", {class: "reveal"});
    var slides = createNode("div", {class: "slides"});
    var sections = byClass("tmp-slide");
    forEach.call(sections, function(section) {
      slides.appendChild(section);
    });
    reveal.appendChild(slides);
    document.body.appendChild(reveal);

    console.log(Reveal);
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