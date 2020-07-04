javascript:

/*

Paul Sweate's version he placed on Stack Overflow on 13 Apr. 2013:
https://superuser.com/questions/192437/case-sensitive-searches-in-google-chrome/582280#582280

*/

var searches = searches || 0;

(function () {
var count = 0,
    text;
text = prompt('Search:', '');
if (text == null || text.length === 0) return;

function searchWithinNode(node, re) {
    var pos, skip, acronym, middlebit, endbit, middleclone;
    skip = 0;
    if (node.nodeType === 3) {
        pos = node.data.search(re);
        if (pos >= 0) {
            acronym = document.createElement('ACRONYM');
            acronym.title = 'Search ' + (searches + 1) + ': ' + re.toString();
            acronym.style.backgroundColor = backColor;
            acronym.style.borderTop = '1px solid ' + borderColor;
            acronym.style.borderBottom = '1px solid ' + borderColor;
            acronym.style.fontWeight = 'bold';
            acronym.style.color = borderColor;
            middlebit = node.splitText(pos);
            endbit = middlebit.splitText(RegExp.lastMatch.length);
            middleclone = middlebit.cloneNode(true);
            acronym.appendChild(middleclone);
            middlebit.parentNode.replaceChild(acronym, middlebit);
            count++;
            skip = 1;
        }
    } else if (node.nodeType == 1 && node.childNodes && node.tagName.toUpperCase() != 'SCRIPT' && node.tagName.toUpperCase != 'STYLE') for (var child = 0; child < node.childNodes.length; ++child) child = child + searchWithinNode(node.childNodes[child], re);
    return skip;
}

var borderColor = '#' + (searches + 8).toString(2).substr(-3).replace(/0/g, '3').replace(/1/g, '6');
var backColor = borderColor.replace(/3/g, 'c').replace(/6/g, 'f');
if (searches % 16 / 8 >= 1) {
    var tempColor = borderColor;
    borderColor = backColor;
    backColor = tempColor;
}

searchWithinNode(document.body, text);
window.status = 'Found ' + count + ' match' + (count == 1 ? '' : 'es') + ' for ' + text + '.';
if (count > 0) searches++;
})();