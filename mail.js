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

function main() {
    var mailBodyPre = document.getElementsByTagName("pre")[0];
    var textContent = mailBodyPre.textContent;
    textContent = textContent.replace(/<(.*)>/g,"&lt;$1&gt;");
    var rawLines = textContent.split('\n');
    var newContentNode = document.createElement("DIV");
    var refNode = createRefNode(rawLines, 1);
    var replyNode = createReplyNode(rawLines);

    newContentNode.appendChild(refNode);
    newContentNode.appendChild(replyNode);

    var body = mailBodyPre.parentNode;
    if(mailBodyPre.nextSibling){
       body.insertBefore(newContentNode, mailBodyPre.nextSibling);
    }else {
        body.appendChild(newContentNode);
    }
    mailBodyPre.style.display = "none";
}

main();


