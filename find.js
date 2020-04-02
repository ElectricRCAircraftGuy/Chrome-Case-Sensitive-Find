// Copied & modified from: https://gist.github.com/borisdiakur/9f9d751b4c9cf5acafa2
// Use this tool to remove line breaks and paragraph breaks: https://www.textfixer.com/tools/remove-line-breaks.php

(function () {
'use strict';

    var body = document.body,
        html = document.documentElement;

    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    var findingColor = 'limegreen';
   
    var text = window.prompt('Search:', '');
    
    var spans = document.getElementsByClassName('diakur-case-sensitive-serarch-finding');
    var gutter = document.getElementsByClassName('diakur-case-sensitive-serarch-gutter')[0];

    (function clearEverything() {
        for (var i = spans.length; i--;) {
            for (var j = spans[i].childNodes.length; j--;) {
                spans[i].parentNode.replaceChild(spans[i].childNodes[j], spans[i]);
                spans[i] = null;
            }
        }
        if (gutter) {
            body.removeChild(gutter); gutter = null;
        }
    })();

    if (text === null || text.length === 0) { return; }

    gutter = document.createElement('span');
    gutter.style.backgroundColor = 'rgba(105,105,105,0.75)';
    gutter.style.position = 'fixed';
    gutter.style.right = 0;
    gutter.style.top = 0;
    gutter.style.width = '12px';
    gutter.style.height = '100%';
    gutter.style.zIndex = 1e6;
    gutter.setAttribute('class', 'diakur-case-sensitive-serarch-gutter');
    body.appendChild(gutter);

    function getTopPos(el) {
        for (var topPos = 0; el !== null;) {
            topPos += el.offsetTop;
            el = el.offsetParent;
        }
        return topPos;
    }

    function searchWithinNode(node, te, len) {
        var pos, skip, spannode, middlebit, endbit, middleclone;
        skip = 0;
        if (node.nodeType === 3) {
            pos = node.data.indexOf(te);
            if (pos >= 0) {
                spannode = document.createElement('span');
                spannode.setAttribute('data-title', node.data);
                spannode.setAttribute('class', 'diakur-case-sensitive-serarch-finding');
                spannode.style.backgroundColor = findingColor;
                middlebit = node.splitText(pos);
                endbit = middlebit.splitText(len);
                middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                spannode.setAttribute('data-top', getTopPos(spannode));
                skip = 1;
            }
        } else if (node.nodeType === 1 && node.childNodes && node.tagName.toLowerCase() !== 'script' && node.tagName.toLowerCase() !== 'style') {
            for (var child = 0; child < node.childNodes.length; ++child) {
                child = child + searchWithinNode(node.childNodes[child], te, len);
            }
        }
        return skip;
    }
    searchWithinNode(document.body, text, text.length);

    spans = document.getElementsByClassName('diakur-case-sensitive-serarch-finding');

    var scrollToFinding = function () {
        window.scroll(0, this.getAttribute('data-top'));
    };
    for (var i = spans.length; i--;) {
        var finding = document.createElement('a');
        var top = getTopPos(spans[i]);
        finding.style.width = '100%';
        finding.style.height = '5px';
        finding.style.backgroundColor = findingColor;
        finding.style.cursor = 'pointer';
        finding.style.position = 'absolute';
        finding.style.left = 0;
        finding.style.top = top / docHeight * 100 + '%';
        finding.setAttribute('title', spans[i].getAttribute('data-title'));
        finding.setAttribute('data-top', top);
        finding.addEventListener('click', scrollToFinding, false);
        gutter.appendChild(finding);
    }

    if (spans[0]) {
        spans[0].scrollIntoView();
    } else {
        body.removeChild(gutter); gutter = null;
    }
})();