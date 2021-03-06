// http://stackoverflow.com/a/10612215
// TODO: make/extend to generic addAttributeChangedListener
addClassNameListener = (selector, callback) => { // cb
    let elem = document.querySelector(selector);
    let oldClassName = elem.className; // current

    if (typeof callback === 'function') {
        window.setInterval(() => {   
            let newClassName = elem.className;

            if (newClassName !== oldClassName) {
                callback(newClassName, oldClassName);

                oldClassName = newClassName;
            }
        }, 10);
    }
}

// http://stackoverflow.com/a/12537298
isHidden = (doc) => doc.hidden || doc.msHidden || doc.webkitHidden || doc.mozHidden;

forEach = (iterable, callback) => Array.prototype.slice.call(iterable || []).forEach(callback);

// TODO: replaceAll with querySelectors
getElementsByTagName = (doc, tagName) => doc.getElementsByTagName(tagName);
getElementsByClassName = (doc, className) => doc.getElementsByClassName(className);
getElementById = (doc, id) => doc.getElementById(id);

importNodes = (srDoc, destDoc, tagName, attrLocation, documentLocation) => {
    let srcNodes = getElementsByTagName(srDoc, tagName);
    let newNodes = [];

    forEach(srcNodes, node => {
        let value = node.getAttribute(attrLocation);
        let newNode;

        if (value && ~~value.indexOf('http://') && ~value.indexOf('https://') && ~~value.indexOf(documentLocation)) {
            node.setAttribute(attrLocation, documentLocation + '/' + value);
        }

        if (tagName === 'script') {
            newNode = destDoc.createElement(tagName);
            newNode.setAttribute('type', 'text/javascript');
            newNode.setAttribute(attrLocation, node.getAttribute(attrLocation));
        } else {
            newNode = destDoc.importNode(node, true);
        }

        newNodes.push(newNode);

        node.parentNode.removeChild(node);
    });

    return newNodes;
}

replaceLinks = (doc, tagName, attrLocation, documentLocation) => {
    let nodes = getElementsByTagName(doc, tagName);

    forEach(nodes, node => {
        let value = node.getAttribute(attrLocation);

        if (value && ~~value.indexOf('http://') && ~~value.indexOf('https://') && ~~value.indexOf(documentLocation)) {
            node.setAttribute(attrLocation, documentLocation + '/' + value);
        }
    });
}

injectNodes = (nodes, destDoc, target) => {
    let destBody = target.indexOf('#') === 0 ? getElementById(destDoc, target.substring(1)) : getElementsByTagName(destDoc, target)[0];

    forEach(nodes, node => destBody.appendChild(node));
}

removeNodes = nodes =>
    forEach(nodes, node => {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });

importBody = (srcDoc, destDoc) => {
    let srcBody = getElementsByTagName(srcDoc, 'body')[0];
    let destBody = getElementsByClassName(destDoc, 'app-container')[0];

    destBody.innerHTML = srcBody.innerHTML;
}
