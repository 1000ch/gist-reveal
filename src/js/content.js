(function() {

  var forEach = [].forEach;
  var slice = [].slice;

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
    //clone
    var clone = targetNode.cloneNode(true);
    //remove itself
    removeNode(targetNode);
    //append clone of targetNode to destNode
    destNode.appendChild(clone);
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

    //var head = qs("head");
    //var revealcss = createNode("link", {
    //  rel: "stylesheet",
    //  href: message.cssFile
    //});
    //head.appendChild(revealcss);

    var markdownBody = qs(".markdown-body");
    var header1 = byTag("h1", markdownBody);
    var header2 = byTag("h2", markdownBody);

    forEach.call(header1, function(header) {
      wrapNode(header, createNode("section", {
        class: "js-section"
      }));
    });

    forEach.call(header2, function(header) {
      wrapNode(header, createNode("section", {
        class: "js-section"
      }));
    });

    var slides = byClass("js-section", markdownBody);
    forEach.call(slides, function(slide) {
      var moveNodeList = [];
      var element = getSibling(slide);
      while(element && !element.classList.contains("js-section")) {
        moveNodeList.push(element);
        element = getSibling(element);
      }
      forEach.call(moveNodeList, function(node) {
        moveNode(node, slide);
      });
    });

    var reveal = createNode("div", {class: "reveal"});
    var slides = createNode("div", {class: "slides"});
    var sections = slice.call(byClass("js-section"));

    forEach.call(sections, function(section) {
      moveNode(section, slides);
    });

    reveal.appendChild(slides);
    document.body.appendChild(reveal);

    removeNode(byId("wrapper"));
    removeNode(byId("ajax-error-message"));
    removeNode(qs("footer"));

    Reveal.initialize();
  });

})();