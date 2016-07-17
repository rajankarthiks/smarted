//var svc = "http://msrsplat.cloudapp.net/SplatServiceJson.svc";
var svc = window.applicationRoot + "/Demo/SPLATDemo";
var email = "89839f78-e146-48c6-8e55-96de0b30057a";
var req = null;
var resultKey = null;
var formData = {};
var AnalyzerData;
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
function convertToHtml(par, key, value) {
    if (key == "Tokens") {
        var toplist = $("<ol>");
        for (var i = 0, len = value.length; i < len; ++i) {
            var sent = value[i];
            var list = $("<li>");
            for (var j = 0, len2 = sent.Tokens.length; j < len2; ++j) {
                list.append(sent.Tokens[j].NormalizedToken + ' ');
            }
            toplist.append(list);
        }
        par.append(toplist.html());
        return;
    }
    if (key == "Constituency tree") {
        var root = new Treenode('PARA');
        for (var i = 0, len = value.length; i < len; ++i) {
            var pt = parseCnfTree(value[i]);
            root.children.push(pt);
        }
        var can = $("<canvas>")[0];
        par.append(can);
        var ctx = can.getContext("2d");
        drawConstituentTree(can, ctx, root);
        return;
    }
    if (key == "Dependency tree") {
        if (value.length == 0) { return; }
        var words = [], tags = [], parents = [];
        var offset = 0;
        for (var i = 0, len = value.length; i < len; ++i) {
            var nextOffset = offset;
            if (value[i] == null) break;
            for (var j = 0, len = value[i].length; j < len; ++j) {
                ++nextOffset;
                var t = value[i][j];
                words.push(t.Word);
                tags.push(t.Tag);
                parents.push(t.Parent == 0 ? -1 : t.Parent - 1 + offset);
            }
            offset = nextOffset;
        }
        var can = $("<canvas>")[0];
        par.append(can);
        var ctx = can.getContext("2d");
        drawDependencyTree(can, ctx, words, tags, parents);
        return;
    }
    par.append(JSON.stringify(value));
    return;
}
function addAnalysisResult(resp, key, value) {
    var res = $(
        '<div class="result">' +
        //'<div class="panel panel-default">' +
            //'<div class="panel-heading">' +
                '<h3 class="result-title text--semibold text--sm">' + key + '</h3>' +
            //'</div>' +
            //'<div class="panel-body">' +
            '<div class="result-body text--reg text--sm">' +
            '</div>' +
        '</div>');
    resp.append(res);
    convertToHtml(res.children(".result-body"), key, value);
    //res.children(".result-body").append(convertToHtml(key, value));
}

function updateAnalysis() {
    var analyzers = [];
    var list = $("#analyzers").children();
    for (var i = 0, len = list.length; i < len; ++i) {
        var child = list[i].children[0];
        if (child.checked) {
            analyzers.push(child.attributes['kind'].value);
        }
    }

    var anlist = analyzers.join();
    var inputText = $("#nlInput").val();
    if (!inputText) return;
    var key = anlist + " " + inputText;

    if (resultKey == key) return;

    formData.language = "en";
    formData.analyzerIds = anlist;
    formData.text = inputText;

    $("#status").addClass("working");
    delay(function () {
        if (req != null) req.abort();
        if (inputText != $("#nlInput").val()) return;
        req = $.postAntiForgery(svc + "/Analyze", formData, function (result) {
            var data = JSON.parse(result);
            var resp = $("#response");
            resp.empty();
            for (var i = 0, len = data.length; i < len; ++i) {
                var pair = data[i];
                var kind = "";
                for (var j = 0; j < AnalyzerData.length; j++) {
                    if (AnalyzerData[j].id == data[i].analyzerId) {
                        kind = AnalyzerData[j].kind;
                    }
                }

                var kindPart = kind.split('-')[0].split('_');
                var newTitle = kindPart[0];
                for (var j = 1; j < kindPart.length; j++) {
                    newTitle += " " + kindPart[j].toLowerCase();
                }

                addAnalysisResult(resp, newTitle, pair['result']);
            }

            req = null;
            resultKey = key;
            if (inputText == $("#nlInput").val()) {
                $("#status").removeClass("working");
            }
        });
    }, 100);
}


function shouldChecked(kind) {
    switch (kind) {
        case 'POS_Tags':
        case 'Constituency_Tree':
        case 'Tokens':
            return 'checked="checked"';
    }
}

$.postAntiForgery(svc + "/Analyzers", null, function (result) {
    AnalyzerData = JSON.parse(result);
    var list = $("#analyzers");
    for (var i = 0, len = AnalyzerData.length; i < len; ++i) {
        var tempData = AnalyzerData[i]

        var fullname = tempData.kind + "-" + tempData.specification + "-" + tempData.implementation;
        list.append("<div><input type='checkbox' class='kindToggle' " + shouldChecked(tempData.kind) + " fullname='" + fullname + "' kind='" + tempData.id + "'>" + tempData.kind + "</input></div>");

    }
    var countToggled = 0;
    var tree = null;
    $("input.kindToggle").each(function () {
        var cookie = $.cookie($(this).attr('kind'));
        if (cookie && cookie == "true") {
            ++countToggled;
            $(this).prop('checked', cookie);
        }
        if ($(this).attr('kind') == "Constituency_Tree") {
            tree = $(this);
        }
    });
    if (countToggled == 0 && tree != null) {
        tree.prop('checked', 'true');
    }
    $("input.kindToggle").change(function () {
        $.cookie($(this).attr('kind'), $(this).prop('checked'));
        updateAnalysis();
    });
});

$("#nlInput").keyup(updateAnalysis);
