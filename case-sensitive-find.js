javascript:

/* 
This file is part of Chrome-Case-Sensitive-Find: https://github.com/ElectricRCAircraftGuy/Chrome-Case-Sensitive-Find

By Gabriel Staples
www.ElectricRCAircraftGuy.com

I originally borrowed this script from Boris Diakur here: 
https://gist.github.com/borisdiakur/9f9d751b4c9cf5acafa2, and then I heavily modified it. Note 
that Boris borrowed heavily from Paul Sweatte here: 
https://superuser.com/questions/192437/case-sensitive-searches-in-google-chrome/582280#582280.
Paul Sweatte originally demoed the Javascript bookmarklet and wrote the search code, and then
Boris added a gutter to it to show where each word is found. I then cleaned it up and ________????
______??? fixed some bugs to make it work better.

Optional: Use this tool to remove line breaks and paragraph breaks: 
          https://www.textfixer.com/tools/remove-line-breaks.php
Update: not necessary! Just copy and paste the multi-line code right into the Chrome bookmark!

NB: Only the C-style multi-line comments are allowed inside Javascript Chrome bookmarks, NOT the
C++-style (`//`) ones!

References:
1. Paul Sweatte's answer here:
   https://superuser.com/questions/192437/case-sensitive-searches-in-google-chrome/582280#582280
1. Boris Diakur's GitHub gist here:
   https://gist.github.com/borisdiakur/9f9d751b4c9cf5acafa2
1. [MY OWN ANS!] *****https://stackoverflow.com/questions/9731965/is-there-a-way-to-create-and-run-javascript-in-chrome/62710098#62710098
1. Google search for "chrome javascript() in bookmark":
   https://www.google.com/search?sxsrf=ALeKk01KeIlvVi9w4OpbXzFPDGl4_C34NQ%3A1593758422516&ei=1tL-XviLH8vKswXgh7uACA&q=chrome+javascript%28%29+in+bookmark&oq=chrome+javascript%28%29+in+bookmark&gs_lcp=CgZwc3ktYWIQAzIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjoECAAQRzoICCEQFhAdEB5Qu4ABWIWWAWDYlwFoAHABeACAAfkHiAHnJ5IBDzAuNS4yLjEuMS4wLjIuMZgBAKABAaoBB2d3cy13aXo&sclient=psy-ab&ved=0ahUKEwj4zoblvLDqAhVL5awKHeDDDoAQ4dUDCAw&uact=5
1. https://helloacm.com/how-to-write-chrome-bookmark-scripts-step-by-step-tutorial-with-a-steemit-example/

*/

function clearEverything(spans, gutter, body) 
{
    /* debugging prints */
    window.alert("spans = \"" + spans + "\"\n"
        + "gutter = \"" + gutter + "\"\n"
        + "body = \"" + body + "\"\n"
        + "spans.length = " + spans.length + "\n"
        /* + "spans[0].childNodes.length = " + spans[0].childNodes.length + "\n" */
    ); 

    /*
    for (var i = 0; i < spans.length; i++) 
    {
        for (var j = 0; j < spans[i].childNodes.length; j++) 
        {
            /* debugging 
            window.alert("spans["+i+"].childNodes["+j+"].innerText = " + spans[i].childNodes[j].innerText);

            spans[i].parentNode.replaceChild(spans[i].childNodes[j], spans[i]);
            spans[i] = null;
        }
    }
    */

    if (gutter) 
    {
        body.removeChild(gutter); 
        gutter = null;
    }
}

/*
Get the distance, in pixels, from the input `element` to the top of the window. See:
1. https://www.w3schools.com/JSREF/prop_element_offsettop.asp
1. https://www.w3schools.com/JSREF/prop_element_offsetparent.asp
*/
function getDistanceToTop(element)
{
    var totalDistToTopPixels = 0;
    while (element !== null) 
    {
        /* NB: the `offsetTop` property is relative to the top of the offsetParent element, so we
        must recursively move up to the next offsetParent and sum the total offset until no 
        new offsetParent exists. */
        totalDistToTopPixels += element.offsetTop;
        element = element.offsetParent;
    }

    return totalDistToTopPixels;
}

function caseSensitiveFind()
{
    /* Use "strict mode" to write cleaner code; see: https://www.w3schools.com/js/js_strict.asp */
    "use strict";

    var body = document.body;
    var html = document.documentElement;

    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, 
        html.scrollHeight, html.offsetHeight);

    /* Colors: https://www.w3schools.com/tags/ref_colornames.asp
    Ex: 'limegreen', 'yellow', etc. */
    var highlightColor = 'rgb(255,255,0';
   
    var text = window.prompt('Case-Sensitive Search:', 'search string');
    
    var spans = document.getElementsByClassName('diakur-case-sensitive-serarch-finding');
    var gutter = document.getElementsByClassName('diakur-case-sensitive-serarch-gutter')[0];

    clearEverything(spans, gutter, body);

    if (text === null || text.length === 0) 
    { 
        return; 
    }

    gutter = document.createElement('span');
    /* set the "text found bar"(gutter) color on right side; higher alpha values are more opaque */
    gutter.style.backgroundColor = 'rgba(105,105,105,0.55)';
    gutter.style.position = 'fixed';
    gutter.style.right = 0;
    gutter.style.top = 0;
    gutter.style.width = '12px';
    gutter.style.height = '100%';
    /* Use extremely high zIndex to ensure the gutter is always on top and visible. See: 
    https://www.w3schools.com/jsref/prop_style_zindex.asp */
    gutter.style.zIndex = 1e6;
    gutter.setAttribute('class', 'diakur-case-sensitive-serarch-gutter');
    body.appendChild(gutter);

    function searchWithinNode(node, te, len) 
    {
        var pos, skip, spannode, middlebit, endbit, middleclone;
        skip = 0;
        if (node.nodeType === 3) 
        {
            pos = node.data.indexOf(te);
            if (pos >= 0) 
            {
                spannode = document.createElement('span');
                spannode.setAttribute('data-title', node.data);
                spannode.setAttribute('class', 'diakur-case-sensitive-serarch-finding');
                spannode.style.backgroundColor = highlightColor;
                middlebit = node.splitText(pos);
                endbit = middlebit.splitText(len);
                middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                spannode.setAttribute('data-top', getDistanceToTop(spannode));
                skip = 1;
            }
        } 
        else if (node.nodeType === 1 && node.childNodes && node.tagName.toLowerCase() !== 'script' 
            && node.tagName.toLowerCase() !== 'style') 
        {
            for (var child = 0; child < node.childNodes.length; ++child) 
            {
                child = child + searchWithinNode(node.childNodes[child], te, len);
            }
        }
        return skip;
    }
    searchWithinNode(document.body, text, text.length);

    spans = document.getElementsByClassName('diakur-case-sensitive-serarch-finding');

    var scrollToFinding = function () 
    {
        window.scroll(0, this.getAttribute('data-top'));
    };

    for (var i = spans.length; i--;) 
    {
        var finding = document.createElement('a');
        var top = getDistanceToTop(spans[i]);
        finding.style.width = '100%';
        finding.style.height = '5px';
        finding.style.backgroundColor = highlightColor;
        finding.style.cursor = 'pointer';
        finding.style.position = 'absolute';
        finding.style.left = 0;
        finding.style.top = top / docHeight * 100 + '%';
        finding.setAttribute('title', spans[i].getAttribute('data-title'));
        finding.setAttribute('data-top', top);
        finding.addEventListener('click', scrollToFinding, false);
        gutter.appendChild(finding);
    }

    if (spans[0]) 
    {
        spans[0].scrollIntoView();
    } 
    else 
    {
        body.removeChild(gutter); gutter = null;
    }
}

/* Program entry point */
caseSensitiveFind();