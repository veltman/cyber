// Find text nodes, via http://stackoverflow.com/questions/5904914/javascript-regex-to-replace-text-not-in-html-attributes/5904945#5904945
function process(node) {

  switch (node.nodeType) {

    // 3 = text node
    case 3:

      cyberify(node,getFont(node.parentNode));
      break;

    // 1 = element, 9 = document, 11 = fragment
    case 1:
    case 9:
    case 11:

      var child = node.firstChild,
          next;

      while (child) {
        process(child);
        child = child.nextSibling;
      }

  }

}

// Get computed font as fallback for sites that don't allow external font-faces
function getFont(node) {

  var style;

  try {
    style = getComputedStyle(node.parentNode);
  } catch (e) {
    return "";
  }

  if (style && style.fontFamily) {
    return style.fontFamily.trim();
  }

  return "";

}

// Either starting the string or preceded by a space
var ex1 = /^cyber(?=(\s|-?[a-z]))/ig,
    ex2 = /[^a-z]cyber(?=(\s|-?[a-z]))/ig;

function cyberify(n,fallback) {

  var tx = n.nodeValue;

  if (tx.match(ex1) || tx.match(ex2)) {
    wrapMatches(n,fallback);
  }

}

// Along the lines of http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple/
function wrapMatches(textNode,fallback) {

  var temp = document.createElement("div");

  temp.innerHTML = textNode.nodeValue.replace(ex2,function(match){
                                       return mark(match,fallback,true);
                                     })
                                     .replace(ex1,function(match){
                                       return mark(match,fallback);
                                     });

  while (temp.firstChild) {
    textNode.parentNode.insertBefore(temp.firstChild,textNode);
  }

  textNode.parentNode.removeChild(textNode);

}

function mark(match,fallback,space) {

  var pre = space ? match[0] : "",
      inner = space ? match.slice(1) : match,
      font = fallback ? "Audiowide, " + fallback : "Audiowide";

  return pre + "<mark style=\"background-color: transparent; color: inherit; font-size: inherit; padding: 0; margin: 0; font-family: " + font + "\">" + inner + "</mark>";
}

// Add a stylesheet for the Audiowide font
var ss = document.createElement("link");
ss.type = "text/css";
ss.rel = "stylesheet";
ss.href = "//fonts.googleapis.com/css?family=Audiowide";
document.getElementsByTagName("head")[0].appendChild(ss);

process(document.body);
