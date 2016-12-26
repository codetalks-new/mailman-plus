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
    // 查找同级引用级别的所有连续行
    var refLines = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if(line.refDepth() === depth){
            refLines.push(line);
        }else{
            if(refLines.length > 0){
                break;
            }
        }
    }
    return refLines;
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

    refNode.innerHTML = refLines.join('<br/>');
    return refNode;
}

function createReplyTextNode(lines) {
    var p = document.createElement("P");
    p.innerHTML = lines.join('<br/>');
    p.className = "reply-text";
    return p;
}

function createFragmentRefNode(lines) {
    var p = document.createElement("P");
    p.className = "ref-fragment";
    p.innerHTML = lines.join('<br/>');
    return p;
}

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
                replyNode.appendChild(createFragmentRefNode(refLines));
                refLines = [];
            }
        }
    }
    if(refLines.length > 0){
        replyNode.appendChild(createFragmentRefNode(refLines));
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
    var nextPartContent = textContent.substr(divideIndex + flagLine.length);
    var mailBody = textContent.substring(0, divideIndex);
    var rawLines = mailBody.split('\n');
    var refLines = [];
    for (var i = 0; i < rawLines.length; i++) {
        var line = rawLines[i];
        if(line.isRefLine()){
            refLines.push(line);
        }else{
            break;
        }

    }
    var replyPartLines = rawLines.slice(refLines.length);
    return {
        nextPart: nextPartContent,
        refPartLines:refLines,
        replyPartLines:replyPartLines
    }
}

function beautifyMailBody() {
    var mailBodyPre = document.getElementsByTagName("pre")[0];
    var mailInfo = parseMailRawContent(mailBodyPre.textContent);
    var newContentNode = document.createElement("DIV");
    if(mailInfo.refPartLines.length > 0){
        var refNode = createRefNode(mailInfo.refPartLines, 1);
        newContentNode.appendChild(refNode);
    }

    var replyNode = createReplyNode(mailInfo.replyPartLines);
    newContentNode.appendChild(replyNode);
    newContentNode.appendChild(createNextPartNode(mailInfo.nextPart));

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

function main() {
    beautifyMailBody();
    beatifyNavLinks()
}

main();


