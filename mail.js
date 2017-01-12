/**
 * Created by banxi on 12/25/16.
 */

String.prototype.isRefLine = function () {
  var str = this.trim();
  return str.length > 0 && str[0] === '>'
};

String.prototype.refDepth = function () {
    var depth = 0;
    for (var i = 0; i < this.length; i++) {
        var ch = this[i];
        if(ch === ' '){
            continue;
        }
        if(ch === '>'){
            depth++;
        }else{
            break;
        }
    }
    return depth;
};

function linesOfRefDepth(lines,depth) {
    return lines.filter(function (line) {
        return line.refDepth() === depth;
    })
}

function createRefNode(lines, depth){
    var refNode = document.createElement("DIV");
    var innerRefLines = linesOfRefDepth(lines, depth + 1) ;
    if (innerRefLines.length > 0){
        var innerRefNode = createRefNode(lines, depth + 1);
        refNode.appendChild(innerRefNode);
    }
    refNode.className = "ref-node-"+depth;
    var refLines = linesOfRefDepth(lines, depth);

    var textNode = document.createElement("P");
    textNode.innerHTML = refLines.join('<br/>');
    refNode.appendChild(textNode);
    return refNode;
}

function createReplyTextNode(lines) {
    var p = document.createElement("P");
    p.innerHTML = lines.join('<br/>');
    p.className = "reply-text";
    return p;
}

// function createFragmentRefNode(lines) {
//     var p = document.createElement("P");
//     p.className = "ref-fragment";
//     p.innerHTML = lines.join('<br/>');
//     return p;
// }

function createReplyNode(lines) {
    var replyNode = document.createElement("DIV");
    var refLines = [];
    var replyLines = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if(line.isRefLine()){
            refLines.push(line);
            if(replyLines.length > 0){
                replyNode.appendChild(createReplyTextNode(replyLines));
                replyLines = [];
            }
        }else{
            replyLines.push(line);
            if(refLines.length > 0){
                replyNode.appendChild(createRefNode(refLines, 1));
                refLines = [];
            }
        }
    }
    if(refLines.length > 0){
        replyNode.appendChild(createRefNode(refLines, 1));
    }
    if(replyLines.length > 0){
        replyNode.appendChild(createReplyTextNode(replyLines));
    }
    replyNode.className = "reply";
    return replyNode;
}

function createNextPartNode(nextPart) {
    var nextPartNode = document.createElement("DIV");
    nextPartNode.className = "next-part";
    nextPartNode.innerHTML = nextPart.split("\n").join("<br/>");
    return nextPartNode;
}

function parseMailRawContent(rawContent){
    var textContent = rawContent.replace(/<(.*)>/g,"&lt;$1&gt;");
    var flagLine = "-------------- next part --------------";
    var divideIndex = textContent.indexOf(flagLine);
    if(divideIndex < 0){
        return {
            rawLines:textContent.split('\n')
        }
    }
    var nextPartContent = textContent.substr(divideIndex + flagLine.length);
    var mailBody = textContent.substring(0, divideIndex);
    var rawLines = mailBody.split('\n');
    return {
        nextPart: nextPartContent,
        rawLines:rawLines
    }
}

function beautifyMailBody() {
    var mailBodyPre = document.getElementsByTagName("pre")[0];
    var mailInfo = parseMailRawContent(mailBodyPre.textContent);
    var newContentNode = document.createElement("DIV");
    var replyNode = createReplyNode(mailInfo.rawLines);
    newContentNode.appendChild(replyNode);
    if(mailInfo.nextPart){
        newContentNode.appendChild(createNextPartNode(mailInfo.nextPart));
    }

    var body = mailBodyPre.parentNode;
    if(mailBodyPre.nextSibling){
        body.insertBefore(newContentNode, mailBodyPre.nextSibling);
    }else {
        body.appendChild(newContentNode);
    }
    mailBodyPre.style.display = "none";
}

function beatifyNavLinks() {
    var navs = document.getElementsByTagName("ul");
    Array.prototype.forEach.call(navs, function (nav) {
       nav.className += " nav"
    });
    navs[0].style.display = "none";
}

function isMailDetailPage() {
    var comps = location.pathname.split('/');
    var lastPath = comps[comps.length - 1];
    var resName = lastPath.split(".")[0];
    return /^\d+$/.test(resName);
}

function main() {
    if(isMailDetailPage()){
        beautifyMailBody();
        beatifyNavLinks()
    }
}

main();


