// logging is currently disabled.
function log(message) {
    //var e = document.getElementById("logElement");
    //e.appendChild(document.createTextNode(message));
    //e.appendChild(document.createElement("br"));
}

var font = "'Sorts Mill Goudy'";
var largeSize = "24px";
var smallSize = "13px";
var textheight = 20;
var between = 25;
var lineoffsettop = 8;
var lineoffsetbottom = -2;


// constructor for a treenode object, representing one node in a constituent tree.
function Treenode(label) {
    this.label = label;
    this.children = [];
    this.toString = function() {
        if (this.children.length == 0) {
            return this.label;
        }
        var pieces = ["(" + this.label];
        for (var i = 0; i < this.children.length; ++i) {
            pieces.push(" " + this.children[i].toString());
        }
        pieces.push(")");
        return pieces.join("");
    }
}

// constructor for a position reference object.  passes a position by reference,
// and checks for access beyond bounds
function PositionRef(max) {
    this.index = 0;
    this.maxpos = max;
    this.inc = function() {
        if (++this.index > this.maxpos)
            throw new exception("access beyond end of array");
        return this.index;
    }
    this.add = function(i) {
        this.index += i;
        if (this.index > this.maxpos)
            throw new exception("access beyond end of array");
        return this.index;
    }
}

function parseCnfTreeHelper(str, pos, maxpos) {
    //log("parsing at position " + pos.index + ": " + str.substr(pos.index));
    // skip past any initial whitespace.
    while (str.charAt(pos.index) == ' ') pos.inc();

    if (str.charAt(pos.index) == '(') {
        var labelstart = pos.inc();
        while (str.charAt(pos.index) != ' ') pos.inc();
        var n = new Treenode(str.substr(labelstart, pos.index - labelstart));
        while (true) {
            while (str.charAt(pos.index) == ' ') pos.inc();
            if (str.charAt(pos.index) == ')') {
                pos.inc();
                break;
            }
            var child = parseCnfTreeHelper(str, pos);
            //log("add child " + n.label + " ===/ " + child.label);
            n.children.push(child);
        }
        return n;
    }

    var st = pos.index;
    while (str.charAt(pos.index) != ' ' && str.charAt(pos.index) != ')') pos.inc();
    return new Treenode(str.substr(st, pos.index - st));
}

// parse a CNF-style tree representation into a tree of nodes.
function parseCnfTree(str) {
    return parseCnfTreeHelper(str, new PositionRef(str.length));
}

function distributeExtraWeight(n, extra) {
    n.right += extra;
    var kids = n.children.length;
    if (kids == 0) {
        return;
    }
    if (kids == 1) {
        distributeExtraWeight(n.children[0], extra);
        return;
    }
}


function layoutTree(n, ctx, pos) {
    n.left = pos.index;
    if (n.children.length == 0) {
        n.layer = 0;
        pos.add(ctx.measureText(n.label).width);
        pos.add(10);
        n.right = pos.index;
        return;
    }

    n.layer = 1;
    var totalWidth = 0;
    for (x in n.children) {
        var child = n.children[x];
        layoutTree(child, ctx, pos);
        if (child.layer >= n.layer) {
            n.layer = child.layer + 1;
        }
        totalWidth += child.right - child.left;
    }
    var mywidth = ctx.measureText(n.label).width + 10;
    if (mywidth > totalWidth) {
        var extra = mywidth - totalWidth;
        pos.add(extra);
        distributeExtraWeight(n, extra);
    }
    n.right = pos.index;
}
function layoutTreeFixLayer(n) {
    for (x in n.children) {
        var child = n.children[x];
        if (child.layer > 0 && child.layer < n.layer - 1) {
            child.layer = n.layer - 1
        }
        layoutTreeFixLayer(child);
    }
}
function layoutTreeFixMid(n) {
    if (n.children.length == 0)
    {
        n.mid = Math.round((n.left + n.right) / 2);
        return;
    }
    var sum = 0;
    var denom = 0;
    for (x in n.children) {
        var child = n.children[x];
        layoutTreeFixMid(child);
        var weight = 1 / (1 + child.layer);
        denom += weight;
        sum += child.mid * weight;
    }
    n.mid = Math.round(sum / denom);
}

function topY(layer, toplayer) {
    var l = toplayer - layer;
    return l * (textheight + between);
}

function bottomY(layer, toplayer) {
    var l = toplayer - layer;
    return textheight + l * (textheight + between);
}

function drawTree(pt, ctx, toplayer) {
    ctx.textAlign = "center";
    var y = bottomY(pt.layer, toplayer);
    //log("filltext " + pt.label + " (" + pt.mid + ", " + y + ")");
    ctx.fillText(pt.label, pt.mid, y);
    y += lineoffsettop;
    for (var x in pt.children) {
        var color = "#b0b0b0";
        if (pt.children[x].label.indexOf('*') != -1)
            color = "red";
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(pt.mid, y);
        ctx.lineTo(pt.children[x].mid, topY(pt.children[x].layer, toplayer) + lineoffsetbottom);
        ctx.stroke();
        drawTree(pt.children[x], ctx, toplayer);
    }
}
// a rather inefficient but usable function for computing the arc heights in a dependency tree.
// gives non-crossing arcs for projective trees.
function compute_arcs(parents) {
    // default height of each between point is zero.
    var h = new Array(parents.length);
    for (var par = 0; par < parents.length; ++par) { h[par] = 0; }

    // empty set of arcs.
    var a = new Array(0); var c = 0;

    // go by arc len...
    for (var len = 1; len < parents.length; ++len) {
        var lensq = len * len;
        for (var pos = 0; pos < parents.length; ++pos) {
            var dist = (pos - parents[pos]);
            if (lensq == dist * dist) {
                if (parents[pos] == -1) { a[c++] = [pos, parents[pos], 1]; continue; }
                // got an arc of that length -- find min and max positions.
                var min = pos; var max = parents[pos]; if (max < min) { min = parents[pos]; max = pos; }

                // find max height between
                var height = 0;
                var x;
                for (x = min; x < max; ++x) {
                    if (h[x] > height) { height = h[x]; }
                }

                // our height is 1 + that.
                ++height;
                // add the arc
                a[c++] = [pos, parents[pos], height];

                // update everyone in between.
                for (x = min; x < max; ++x) { h[x] = height; }
            }
        }
    }
    return a;
}

var lastTree;

function drawConstituentTree(canvas, ctx, pt) {
    var p = new PositionRef(1000000);
    ctx.font = largeSize + " " + font;
    layoutTree(pt, ctx, p);
    layoutTreeFixLayer(pt);
    layoutTreeFixMid(pt);
    lastTree = pt;

    var computedHeight = textheight + pt.layer * (textheight + between);
    canvas.width = (p.index + 10) * 1;
    canvas.height = (computedHeight + 10) * 1;
    //canvas.style.width = p.index + 10;
    //canvas.style.height = computedHeight + 10;

    //ctx.scale(4,4);

    ctx.font = largeSize + " " + font;
    drawTree(pt, ctx, pt.layer);
}

function drawDependencyTree(canvas, ctx, words, tags, parents) {
    var arcs = compute_arcs(parents);
    log("got arcs");
    var mids = [];
    var edge = 20;
    var pos = 0;
    var word;
    log("about to set mid");
    for (x in words) {
        word = words[x];
        var tag = tags[x];

        ctx.font = "normal normal normal " + largeSize + " " + font;
        ctx.textAlign = "center";
        var width = ctx.measureText(word).width;
        ctx.font = "normal normal normal " + smallSize + " " + font;
        var twidth = ctx.measureText(tag).width;
        ctx.textAlign = "center";

        if (width < twidth) width = twidth;
        if (width < 10) width = 10;
        mids[pos++] = edge + width / 2;
        edge += width + 5;
    }
    canvas.width = edge + 40;
    log("computed mids");

    var maxheight = 0;
    for (x in arcs) {
        var arccur = arcs[x];
        var height = arccur[2];
        if (height > maxheight) {
            maxheight = height;
        }
    }
    canvas.height = maxheight * 20 + 60;

    var topLine = maxheight * 20 + 10;
    var acme = 10;
    var postagLine = topLine + 13;
    var wordLine = postagLine + 20;

    pos = 0;
    ctx.font = largeSize + " " + font;
    ctx.textAlign = "center";
    for (x in words) {
        word = words[x];
        ctx.fillText(word, mids[pos++], wordLine);
    }
    ctx.font = "normal normal normal " + smallSize + " " + font;
    ctx.textAlign = "center";
    pos = 0;
    for (x in words) {
        word = words[x];
        ctx.fillText(tags[x], mids[pos++], postagLine);
    }

    for (x in arcs) {
        var arc = arcs[x];
        var child = arc[0];
        var mother = arc[1];
        var height = arc[2];
        ctx.strokeStyle = "#808080";
        ctx.fillStyle = "#808080";
        ctx.beginPath();
        ctx.moveTo(mids[child] - 3, topLine - 6);
        ctx.lineTo(mids[child], topLine + 1);
        ctx.lineTo(mids[child] + 3, topLine - 6);
        ctx.lineTo(mids[child], topLine - 4);
        ctx.lineTo(mids[child] - 3, topLine - 6);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(mids[child], topLine - 5);
        if (mother == -1) {
            ctx.lineTo(mids[child], acme);
        }
        else {
            var offset = (mother < child ? 5 : -5);
            var myacme = topLine + (acme - topLine) * height / maxheight;
            var actPar = mids[mother] + offset;
            ctx.bezierCurveTo(mids[child], myacme, actPar + 2 * offset, myacme, actPar, topLine);
        }
        ctx.stroke();
    }
}
