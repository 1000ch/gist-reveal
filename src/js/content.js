(function() {

  var forEach = [].forEach;
  var slice = [].slice;
  var rxIdSelector = /^#([\w\-]+)$/,
      rxClassSelector = /^\.([\w\-]+)$/,
      rxTagSelector = /^[\w\-]+$/,
      rxNameSelector = /^\[name=["']?([\w\-]+)["']?\]$/;

  /**
   * querySelector alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {Node}
   */
  var qs = function(selector, context) {
    var m;
    if(!context || !context.querySelector) {
      context = document;
    }
    if((m = rxIdSelector.exec(selector))) {
      return document.getElementById(m[1]);
    } else {
      return context.querySelector(selector);
    }
  };

  /**
   * document.querySelectorAll alias
   * @param {string} selector
   * @param {HTMLElement} context
   * @returns {NodeList}
   */
  var qsa = function(selector, context) {
    var m;
    var result = [];
    if(!context || !context.querySelectorAll) {
      context = document;
    }
    if((m = rxIdSelector.exec(selector))) {
      var buffer = document.getElementById(m[1]);
      if(buffer) {
        result.push(buffer);
      }
    } else if((m = rxClassSelector.exec(selector))) {
      result = context.getElementsByClassName(m[1]);
    } else if((m = rxTagSelector.exec(selector))) {
      result = context.getElementsByTagName(m[0]);
    } else if((m = rxNameSelector.exec(selector))) {
      result = context.getElementsByName(m[1]);
    } else {
      result = context.querySelectorAll(selector);
    }
    return slice.call(result);
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

  //listen message
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if(!Reveal) {
      return;
    }

    var markdownBody = qs(".markdown-body");
    var header1 = qsa("h1", markdownBody);
    var header2 = qsa("h2", markdownBody);

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

    var slides = qsa(".js-section", markdownBody);
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
    var revealSlides = createNode("div", {class: "slides"});
    var sections = qsa(".js-section");

    forEach.call(sections, function(section) {
      moveNode(section, revealSlides);
    });

    reveal.appendChild(revealSlides);
    document.body.appendChild(reveal);

    removeNode(qs("#wrapper"));
    removeNode(qs("#ajax-error-message"));
    removeNode(qs("footer"));
    removeNode(qs(".js-task-list-field"));

    Reveal.initialize({
      controls: true,
      progress: true,
      history: true,
      center: true,

      theme: Reveal.getQueryHash().theme,
      transition: Reveal.getQueryHash().transition || 'default',

      // Optional libraries used to extend on reveal.js
      dependencies: []
    });
  });

})();