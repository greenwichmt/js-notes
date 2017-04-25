http://stackoverflow.com/questions/111102/how-do-javascript-closures-work/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

$(document).ready(function () {
    setLevel1btn();
});
var LevelLast = "IfRepeatThenIgnore";
//T.LEVEL_1,
//T.LEVEL_2,
//T.REP_CODE,
/*设置二级按钮-第一级*/
function setLevel1btn() {
    $("#level1btn").empty();
    for (var i = 0; i < repButton.length; i++) {
        if (LevelLast == repButton[i].LEVEL_1) continue;
        LevelLast = repButton[i].LEVEL_1;
        (function (index) {
            //console.log(typeof repButton[index].LEVEL_2);
            if (repButton[index].LEVEL_2 == null || repButton[index].LEVEL_2 == '' || typeof repButton[index].LEVEL_2 == undefined) {
                $('<a href="#" class="float-left-btn"><svg class="icon" aria-hidden="true">'
                    + '<use xlink:href="' + repButton[index].LEVEL_1_BTN_CODE + '"></use></svg>'
                    + '<div>' + repButton[index].LEVEL_1 + '</div></a>').bind('tap', function () {
                        document.location.href = 'RepDetailFrm.aspx?repCode=' + repButton[index].REP_CODE
                    }).appendTo('#level1btn');
            } else {
                $('<a href="#dialogPage" data-rel="dialog" class="float-left-btn"><svg class="icon" aria-hidden="true">'
                    + '<use xlink:href="' + repButton[index].LEVEL_1_BTN_CODE + '"></use></svg>'
                    + '<div>' + repButton[index].LEVEL_1 + '</div></a>').bind('tap', setLevel2btn).appendTo('#level1btn');
                //console.log(index + repButton[index].LEVEL_1);
            }
        })(i)
    }
    $("#level1btn").trigger('create');
}
String.prototype.trim = function () { return this.replace(/(^\s)|(\s$)/g, '') }

/*设置二级按钮-第二级dialog*/
function setLevel2btn() {
    LevelLast = "IfRepeatThenIgnore";
    var header = this.text.trim();
    setHeader(header);
    //console.log(this.text.trim());
    $('#level2btn').empty();
    for (var i = 0; i < repButton.length; i++) {
        //父按钮不同或者已经出现过的二级按钮
        if (this.text.trim() != repButton[i].LEVEL_1 || LevelLast == repButton[i].LEVEL_2) continue;
        LevelLast = repButton[i].LEVEL_2;
        (function (index) {
            $('<a href="#" data-role="button" data-inline="true" data-mini="true">'
                + repButton[index].LEVEL_2 + '</a>').on('tap', function () {
                    document.location.href = 'RepDetailFrm.aspx?repCode=' + repButton[index].REP_CODE
                }).appendTo('#level2btn');
            //console.log(repButton[index].LEVEL_2 + '=' + repButton[index].REP_CODE);
        })(i)
    }
    $('#level2btn').trigger('create');
}
function setHeader(txt) {
    $('#dialogPage h1:eq(0)').text(txt);
}