var headerData = [];        //列数组
var frozenHeaderData = [];  //固定列数组

$(function () {
    readRepInfo(repCode);
});

/*通过报表编码查询报表配置信息
  数据源、备注等*/
function readRepInfo(repCode) {
    try {
        //parent.showLoading('正在读取配置信息……');
    }
    catch (err) { }
    $.ajax({
        type: "post",
        url: "../Handlers/RepWebDetailQuery.ashx",
        dataType: 'json',
        data: { action: 'repInfo', repCode: repCode },
        error: function (xmlRequest, textStatus, error) {
            try {
                parent.hideLoading();
            }
            catch (err) { }
            alert('读取报表信息异常 - ' + textStatus);
        },
        success: function (data) {
            $('#divMemo').html(data.memo);  //设置备注
            $('#hTitle').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.title);  //设置报表标题
            $('#txtTimest').textbox('setValue', data.timest);   //设置报表时间
            try {
                fixColsCount = parseInt(data.fixColsCount); //固定列数
            }
            catch (err) { fixColsCount = 0; }
            try {
                parent.hideLoading();
            }
            catch (err) { }
            readColsInfo(repCode);  //读取报表列信息
        }
    });
}

/*读取报表列配置信息*/
function readColsInfo(repCode) {
    try {
        //parent.showLoading('正在读取字段信息……');
    }
    catch (err) { }
    $.ajax({
        type: "post",
        url: "../Handlers/RepWebDetailQuery.ashx",
        data: { action: 'cols', repCode: repCode },
        error: function (xmlRequest, textStatus, error) {
            try {
                parent.hideLoading();
            }
            catch (err) { }
            alert('读取列配置信息异常 - ' + textStatus);
        },
        success: function (data) {
            data = data.replace(/[\r\n]/gi, '');    //替换换行符，避免转换JSON出错
            var fieldData = eval('(' + data + ')'); //把数据转换为json
            var rowIdx;
            $.each(fieldData, function (idx, val) {
                //第一行 或 新开一行，新开数组
                if (rowIdx == null || rowIdx == undefined || rowIdx != parseInt(val.ROW_IDX)) {
                    headerData.push([]);
                    rowIdx = parseInt(val.ROW_IDX);
                }
                //datagrid列设置对象
                var colData = {
                    title: '<b>' + val.COL_NAME + '</b>',
                    width: (val.COL_WIDTH == '' || val.COL_WIDTH == '0') ? 80 : parseInt(val.COL_WIDTH),
                    styler: function (value, row, index) {
                        if (value == undefined || value == null)
                            return '';
                        //如果是百分号，那么>0显示红色，<0显示绿色
                        if (!isNaN(value.replace('%', ''))) {
                            var css = 'text-align:right; font-size:.8em; font-weight:bold;';
                            if (value.indexOf('%') != -1) {
                                if (parseFloat(value.replace('%', '')) > 0)
                                    css += 'color:Red;';
                                else if (parseFloat(value.replace('%', '')) < 0)
                                    css += 'color:Green;';
                            }
                            return css;
                        }
                    },
                    formatter: function (value, row, index) {
                        if (value == undefined || value == null) {
                            return '字段异常';
                        }
                        else
                            return value;
                    }
                };
                if (val.FIELD_NAME != '')
                    colData.field = val.FIELD_NAME.toUpperCase();
                if (rowIdx == 1 && fixColsCount != undefined &&
                    fixColsCount != null && fixColsCount > 0 &&
                    idx < fixColsCount) {
                    if (frozenHeaderData.length == 0)
                        frozenHeaderData.push([]);
                    frozenHeaderData[0].push(colData);
                }
                else {
                    if (val.COL_SPAN != '')
                        colData.colspan = parseInt(val.COL_SPAN);
                    if (val.ROW_SPAN != '')
                        colData.rowspan = parseInt(val.ROW_SPAN);
                    headerData[rowIdx - 1].push(colData);
                }
            });
            try {
                parent.hideLoading();
            }
            catch (err) { }
            readRepData(repCode);
        }
    });
}

/*读取报表数据源*/
function readRepData(repCode) {
    try {
        parent.showLoading('正在加载数据……');
    }
    catch (err) { }
    if (repCode == undefined || repCode == null)
        repCode = $('#hiddentRepCode').val();
    var timest = $('#txtTimest').textbox('getValue').replace(/-/g, '');
    $.ajax({
        type: "post",
        url: "../Handlers/RepWebDetailQuery.ashx",
        dataType: 'json',
        data: { action: 'getDatasource', repCode: repCode, repName: $('#hTitle').html(), timest: timest },
        error: function (xmlRequest, textStatus, error) {
            try {
                parent.hideLoading();
            }
            catch (err) { }
            alert('读取数据源异常 - ' + textStatus);
        },
        success: function (dataSource) {
            $('#divMemo').html(dataSource.memo);
            var memoDiv = null;
            if ($('#divMemo').html() != '')
                memoDiv = $('#divMemo');
            $('#dg').datagrid({
                frozenColumns: frozenHeaderData,
                columns: headerData,
                fit: true,
                data: dataSource.data,
                footer: memoDiv
            });
            try {
                parent.hideLoading();
                readTitleBtnInfo(repCode);
            }
            catch (err) { }
        }
    });
}

//读取相似报表按钮
function readTitleBtnInfo(repCode) {
    $.ajax({
        type: "post",
        url: "../Handlers/RepWebDetailQuery.ashx",
        dataType: 'json',
        data: { action: 'similarBtn', repCode: repCode },
        error: function (xmlRequest, textstatus, error) {
            alert('读取相似报表按钮出错 - ' + textstatus);
        },
        success: function (data) {
            //$("#headContainer >div").remove();
            $.each(data, function (idx, val) {
                //$adiv = $('<div class="m-right m-float-right"><a href="RepWebDetail.aspx?repCode=' + val.REP_CODE + '" target="_self" class="easyui-linkbutton m-next" plain="true" outline="true">' + val.SIMILAR_ALIAS + '</a></div>').insertAfter('#hTitle');;
                $adiv = $('<div class="m-right m-float-right"><a href="#" class="easyui-linkbutton m-next" plain="true" outline="true">' + val.SIMILAR_ALIAS + '</a></div>');
                $adiv.bind('click', function (event) {
                    $('#frmRpt', window.parent.document).attr('src', 'RepWebDetail.aspx?repCode=' + val.REP_CODE);
                    event.preventDefault();
                }).insertAfter('#hTitle');
            })
            $.parser.parse($('#headContainer'));
        }
    })
}