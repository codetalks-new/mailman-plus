/**
 * Created by banxi on 12/25/16.
 */


function refDepth(line){
   var depth = 0;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
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
}

function createRefNode(lines, depth){
    var refNode = document.createElement("DIV");
    var innerRefLines = lines.filter(function (line) {
        return refDepth(line) === depth + 1;
    });
    if (innerRefLines.length > 0){
        var innerRefNode = createRefNode(lines, depth + 1);
        refNode.appendChild(innerRefNode);
    }
    refNode.className = "ref-node-"+depth;
    var refLines = lines.filter(function (line) {
        return refDepth(line) === depth;
    });

    refNode.innerHTML = refLines.join('<br/>');
    return refNode;
}

function createReplyNode(lines) {
    var replyLines = lines.filter(function (line) {
        return refDepth(line) === 0;
    });
    var replyNode = document.createElement("DIV");
    replyNode.innerHTML = replyLines.join("<br/>");
    replyNode.className = "reply";
    return replyNode;
}

function createNextPartNode(nextPart) {
    var nextPartNode = document.createElement("DIV");
    nextPartNode.className = "next-part";
    nextPartNode.innerHTML = nextPart.split("\n").join("<br/>");
    return nextPartNode;
}

function beautifyMailBody() {
    var mailBodyPre = document.getElementsByTagName("pre")[0];
    var textContent = mailBodyPre.textContent;
    textContent = textContent.replace(/<(.*)>/g,"&lt;$1&gt;");
    var flagLine = "-------------- next part --------------";
    var divideIndex = textContent.indexOf(flagLine);
    var nextPartContent = textContent.substr(divideIndex + flagLine.length);
    var mailBody = textContent.substring(0, divideIndex);
    var rawLines = mailBody.split('\n');
    var newContentNode = document.createElement("DIV");
    var refNode = createRefNode(rawLines, 1);
    var replyNode = createReplyNode(rawLines);

    newContentNode.appendChild(refNode);
    newContentNode.appendChild(replyNode);
    newContentNode.appendChild(createNextPartNode(nextPartContent));

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
}

function main() {
    beautifyMailBody();
    beatifyNavLinks()
}

main();


