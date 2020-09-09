/**
 * 穿梭框
 */
(function ($) {
    /* 入口函数 */
    $.fn.transfer = function ($this, options) {
        //初始化调用
        function transfer($this, options) {
            transfer.prototype.init($this, options)
        }

        //当前对象
        var _thisgrid = $this;
        //获取表格参数
        var _thisOptions = options ? options : "";
        if (!_thisOptions) {
            layer.alert("请设置参数数据!")
            return
        }
        //获取默认展示数据id;
        var tabDefaultId = "";
        //默认数据展现形式(默认树形展示)
        var DefaultShowType = "tree";
        //左侧待穿梭数据集合
        var notSelectData = [];
        //左侧待穿梭数据唯一索引
        var notSelectDataId = [];
        //回显数据集合
        var selectedValue = [];
        //回显数据索引
        var selectedValueId = [];
        //右侧选中数据
        var rightSelectValue = [];
        //右侧选中索引数据
        var rightSelectValueId = [];
        //已选数据是否单选
        var isSelectedRadio = "false";
        transfer.prototype = {
            init: function ($this, options) {
                //当前对象
                var $grid = $this;
                //获取表格参数
                cyProps = options ? options : "";
                if (!cyProps) {
                    return
                }
                //宽高
                var _thisWidth = cyProps.width ? cyProps.width : '500';
                //宽高
                var _thisHeight = cyProps.height ? cyProps.height : '500';

                selectedValue = cyProps.selectedValue ? cyProps.selectedValue : [];
                //获取数据的地址，只能通过表码或url，如果两个都写，默认是url
                isSelectedRadio = cyProps.isSelectedRadio ? cyProps.isSelectedRadio : 'false';
                //从后台获取数据
                var url = cyProps.dataUrl ? cyProps.dataUrl : "";
                var R = "";
                // if (isShowTab && tabData.length > 0 && (!tabData)) {
                //     R = checkboxTool.getTabData(cyProps.dataUrl)
                // }else
                if (url != undefined && url != "") {
                    //如果是从后台获取数据
                    R = checkboxTool.getDataByUrl(cyProps.dataUrl);
                } else {
                    layer.alert("请设置数据加载路径!");
                    return
                }
                checkboxTool.renderData(R, $grid, cyProps);
            }

        }

        /*默认配置*/
        var cyProps = {};

        /*方法对象*/
        var checkboxTool = {
            /**通过url获取数据 by chenyi 2017/7/5*/
            getDataByUrl: function (url) {
                console.log(url)
                var data;
                $.ajax({
                    url: url,
                    async: false,
                    type: 'get',
                    dataType: "json",
                    success: function (R) {
                        if (R.code == 0) {
                            console.log("拿到的数据==" + JSON.stringify(R))
                            data = R;
                        } else {
                            data = {};
                            // alert(R.msg);
                        }

                    }
                });
                return data;

            },
            /**渲染数据 by chenyi 2017/6/21*/
            renderData: function (R, $grid, cyProps) {
                var _grid = $grid;
                //获取下拉控件的name(后续可以变活)
                var _name = "province";
                if (_name.indexOf("[") == -1) {
                    _name += "[]";
                }
                // $(_grid).removeAttr("name");
                // $(_grid).removeAttr("value");
                //获取监控标识
                // var filter = cyProps.filter || "";
                //宽高
                _thisWidth = cyProps.width ? cyProps.width : '500';
                //宽高
                _thisHeight = cyProps.height ? cyProps.height : '500';
                //是否开启级联(如果是数据源必须指定为url)
                // var isShowTab = cyProps.isShowTab ? cyProps.isShowTab : "false";
                //是否开启tab签切换
                var isShowTab = cyProps.isShowTab ? cyProps.isShowTab : "false";
                //tab签数据切换属性
                var tabData = cyProps.tabData ? cyProps.tabData : [];
                //查询款/级联父级
                var _searchHtml = "";
                //如果开启级联
                if ((isShowTab == "true") && tabData.length > 0) {
                    if (!cyProps.dataUrl) {
                        layer.open("页签模式下,请将数据源配置为url");
                    } else {
                        _searchHtml = [
                            '<div class="transfer-panel transfer-panel-left" style="width:' + (_thisWidth - 70) / 2 + 'px;height:' + (_thisHeight - 100) + 'px;">',
                            '<div class="layui-tab" lay-filter="transferTab"><ul class="layui-tab-title" id="transferNavTab">',
                            '</ul><div class="layui-tab-content" id="transferNavTabContent" style="padding:0;height:' + (_thisHeight - 170) + 'px;">',
                            '</div></div>'
                        ].join("");
                    }
                    // //默认显示数据Id赋值
                    // tabDefaultId = tabData[0].tabId ? cyProps.isShowTab : "";
                    // DefaultShowType = tabData[0].tabId ? cyProps.isShowTab : "tree";
                } else if (isShowTab === "false") {
                    _searchHtml = [
                        '<div class="transfer-panel transfer-panel-left" style="width:' + (_thisWidth - 70) / 2 + 'px;height:' + (_thisHeight - 100) + 'px;">',
                        '<dd lay-value="" class="transfer-search-div">',
                        // '<i class="layui-icon  drop-search-btn"></i>',
                        // '<input class="layui-input search_condition" placeholder="关键字搜索">',
                        '<span  class="transfer-title" style="margin-left: 0px" >权限列表</span>',
                        '<i class="layui-icon  clear-btn search-clear-btn">&#x1006;</i>',
                        '</dd><div class="transfer-div" id="leftListContent">',
                        //左侧数据位置区域
                        '</div>',
                    ].join("");
                    //默认显示数据Id赋值
                    tabDefaultId = "leftListContent";
                }
                /** 渲染结果**/
                var outHtml =
                    _grid.html([
                        '<div class="transfer-content" style="width: ' + _thisWidth + 'px;height: ' + _thisHeight + 'px;position: relative">',
                        _searchHtml,
                        '</div>',
                        '<div class="transfer-btn transfer-to-right" style="left:' + parseInt((_thisWidth - 50) / 2 + parseInt(10)) + 'px;top:' + (_thisHeight - 180) / 2 + 'px;">',
                        '<button title="右移" lay-name="' + _name +
                        '" class="layui-btn layui-btn-normal layui-btn-sm layui-btn-disabled"><i class="layui-icon">&#xe65b;</i></button>',
                        '</div>',
                        '<div class="transfer-btn  transfer-to-left" style="left:' + parseInt((_thisWidth - 50) / 2 + parseInt(10)) + 'px;top:' + parseInt((_thisHeight - 100) / 2 + parseInt(40)) + 'px;">',
                        '<button title="左移" lay-name="' + _name +
                        '"  class="layui-btn layui-btn-normal layui-btn-sm layui-btn-disabled"><i class="layui-icon">&#xe65a;</i></button>',
                        '</div>',
                        '<div class="transfer-panel transfer-panel-right" style="width:' + (_thisWidth - 70) / 2 + 'px;height:' + (_thisHeight - 80) + 'px;">',
                        '<dd lay-value="" class="transfer-search-div">',
                        '<span  class="transfer-title" style="margin-left: 0px" >',
                        ' 已选列表',
                        '</span>',
                        '</dd>',
                        '<div class="transfer-div" id="rightListContent">',
                        // rightList右侧数据渲染区域
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(""));
                _grid.append(outHtml);
                //是否开启tab签切换
                if (isShowTab && tabData.length > 0) {
                    if (!cyProps.dataUrl) {
                        layer.open("页签模式下,请将数据源配置为url");
                    } else {
                        for (var i = 0; i < tabData.length; i++) {
                            if (tabData[i].isDefault) {
                                //默认展示数据id赋值;
                                tabDefaultId = tabData[i].tabId ? tabData[i].tabId : "";
                                //默认数据展现形式(默认树形展示)
                                DefaultShowType = tabData[i].showType ? tabData[i].showType : "";
                            }
                            addransferTab(tabData[i])
                        }
                    }
                }
                checkboxTool.contentRenderData(R, _grid, cyProps, tabDefaultId, DefaultShowType);

            },
            contentRenderData: function (R, $grid, cyProps, $tabId, showType) {
                var _grid = $grid;
                //获取下拉控件的默认值
                // var _value = R;
                //已选数据回显操作
                var _values = cyProps.selectedValue ? cyProps.selectedValue : [];
                //获取复选框禁用的值(区别部门和机构的设计)
                var _disabled = "";
                var _disableds = _disabled.split(",");
                var data = R.data;
                //未选中列表
                var leftList = "";
                //选中列表
                var rightList = "";

                //是否开启tab签切换
                var isShowTab = cyProps.isShowTab ? cyProps.isShowTab : "false";
                //tab签数据切换属性
                var tabData = cyProps.tabData ? cyProps.tabData : [];
                // debugger
                //开启tab签切换
                if (isShowTab == "true" && tabData.length > 0) {
                    var treeId = "";
                    //判断自定展示形式
                    switch (showType) {
                        case "tree":
                            treeId = $tabId + "Content";
                            var tabDefaulHtml = ['<div id="' + treeId + '"></div>',].join("");
                            $("#" + $tabId).find(".leftContent").html(tabDefaulHtml);
                            //树结构信息加载
                            if (treeId) {
                                // window.zTreeUpload(R,treeId)
                                layui.tree.render({
                                    elem: '#' + treeId,
                                    data: data,
                                    showCheckbox: true,
                                    id: "transferLeftTreeChecked",
                                    click: function (node, a) {
                                        console.log(node);
                                    },
                                    oncheck: function (obj) {
                                        var treeIdAll = '#' + treeId;
                                        //获取选中节点
                                        var checkData = layui.tree.getChecked("transferLeftTreeChecked");
                                        //已选数据添加及删除
                                        selectTreeChecked(obj.data, obj.checked, obj.elem, checkData)
                                        // console.log(obj.data); //得到当前点击的节点数据
                                        // console.log(obj.checked); //得到当前节点的展开状态：open、close、normal
                                        // console.log(obj.elem); //得到当前节点元素

                                    },
                                    ondbclick: function (node, a) {
                                        //alert(2222)
                                    }
                                });
                            }
                            break;
                        case "list":
                            if (data !== undefined) {
                                for (var i = 0; i < data.length; i++) {
                                    //设置默认值(向右侧插入元素)
                                    if (_values.indexOf(data[i].id) == -1) {
                                        var _input = '<dd lay-value="' + data[i].id + '" lay-title="' + data[i].title +
                                            '"><input type="checkbox" lay-filter="transferLeftChecked" title="' + data[i].title +
                                            '" lay-skin="primary"></dd>';
                                        //设置禁用
                                        if (_disableds.indexOf(data[i].id) != -1) {
                                            _input = _input.replace("<input", "<input disabled ")
                                        }
                                        leftList += _input;
                                    }
                                    //像左侧插入元素
                                    else {
                                        var _input = '<dd lay-value="' + data[i].id + '"  lay-title="' + data[i].title +
                                            '"><input type="hidden" name="" value="' + data[i].id +
                                            '"><input lay-filter="transferRightChecked"   type="checkbox"  title="' + data[i].title +
                                            '" lay-skin="primary"></dd>';
                                        //设置禁用
                                        if (_disableds.indexOf(data[i].id) != -1) {
                                            _input = _input.replace("<input", "<input disabled ")
                                        }
                                        rightList += _input;
                                    }
                                }
                            }
                            /** 渲染结果**/
                            $("#" + $tabId).find(".leftContent").html(leftList);
                            // $(_grid).find("#rightListContent").html(rightList);
                            //复选框重新渲染
                            layui.use('form', function () {
                                var form = layui.form;
                                form.render('checkbox');
                            });
                            break;
                        default:
                            layer.alert("无效展示参数形式!")
                            break;
                    }

                } else {
                    //默认树结构加载
                    layui.tree.render({
                        elem: '#leftListContent',
                        data: data,
                        showCheckbox: true,
                        id: "transferLeftTreeChecked",
                        click: function (node, a) {
                            console.log(node);
                        },
                        oncheck: function (obj) {
                            var treeIdAll = '#' + treeId;
                            console.log("treeid是啥====" + treeIdAll)
                            //获取选中节点
                            var checkData = layui.tree.getChecked("transferLeftTreeChecked");
                            console.log(obj.data);
                            console.log(obj.checked);
                            console.log(obj.elem);
                            console.log(checkData);
                            //已选数据添加及删除
                            selectTreeChecked(obj.data, obj.checked, obj.elem, checkData)
                        },
                        ondbclick: function (node, a) {
                            alert(2222)
                        }
                    });

                }
            }
            // nchange:function(obj, index){
            // 	layer.alert(JSON.stringify(obj));//穿梭数据
            // },

        };

        layui.use(['tree', 'element', 'form'], function () {
            var form = layui.form;
            var element = layui.element;
            var tree = layui.tree;
            //穿梭框选中监听
            //左侧选中
            form.on('checkbox(transferLeftChecked)', function (data) {
                var $this = $(data.othis);
                var _parent = $this.parents(".transfer-content")
                var _listObj = {};
                //当前选中数据
                var $thisCheck = $this.parents("dd").find("input[type='checkbox']");
                console.log("====当前选中" + JSON.stringify($thisCheck))
                //选中数据id值
                var _value = $this.parents("dd").attr("lay-value");
                //选中数据tatle值
                var _title = $this.parents("dd").attr("lay-title");
                //是否为单选
                if (isSelectedRadio == "true") {
                    //是否选中当前数据
                    if ($thisCheck.is(':checked')) {
                        _listObj.id = _value;
                        _listObj.title = _title;
                        notSelectData[0] = _listObj;
                    } else {
                        //删除已选数据
                        notSelectDataId = [];
                        notSelectData = [];
                    }
                } else {
                    //是否选中当前数据
                    if ($thisCheck.is(':checked')) {
                        if (notSelectDataId.indexOf(_value) == -1) {
                            _listObj.id = _value;
                            _listObj.title = _title;
                            notSelectData.push(_listObj);
                        } else {
                            alert("已选数据已存在")
                        }
                    } else {
                        //删除已选数据
                        notSelectDataId.splice($.inArray(_value, notSelectDataId), 1);
                        notSelectData.forEach(function (v) {
                            if (v.id == _value) {
                                //删除已选数据
                                notSelectData.splice(jQuery.inArray(v, notSelectData), 1);
                            }
                        });
                    }
                }

                if (notSelectData.length === 0) {
                    _parent.find(".transfer-to-right button").addClass("layui-btn-disabled");
                } else {
                    _parent.find(".transfer-to-right button").removeClass("layui-btn-disabled");
                }
                ;

                console.log(notSelectData)
            });
            //右侧选中
            form.on('checkbox(transferRightChecked)', function (data) {
                var $this = $(data.othis);
                var _parent = $this.parents(".transfer-content");
                var $thisCheck = $this.parents("dd").find("input[type='checkbox']");
                var _listObj = {};
                //选中数据id值
                var _value = $this.parents("dd").attr("lay-value");
                //选中数据tatle值
                var _title = $this.parents("dd").attr("lay-title");
                //是否选中当前数据
                if ($thisCheck.is(':checked')) {
                    if (rightSelectValueId.indexOf(_value) == -1) {
                        _listObj.id = _value;
                        _listObj.title = _title;
                        rightSelectValue.push(_listObj);
                    } else {
                        alert("已选数据已存在")
                    }
                } else {
                    //删除已选数据
                    rightSelectValueId.splice($.inArray(_value, rightSelectValueId), 1);
                    rightSelectValue.forEach(function (v) {
                        if (v.id == _value) {
                            //删除已选数据
                            rightSelectValue.splice(jQuery.inArray(v, rightSelectValue), 1);
                        }
                    });
                }
                if (rightSelectValue.length === 0) {
                    _parent.find(".transfer-to-left button").addClass("layui-btn-disabled");
                } else {
                    _parent.find(".transfer-to-left button").removeClass("layui-btn-disabled");
                }
                ;

                console.log(rightSelectValue)

            });
            //tab切换事件监听
            element.on('tab(transferTab)', function () {
                //页签索引标识
                var _thisId = $(this).attr("data-id") || "";
                //数据加载路径
                var _thisDataUrl = $(this).attr("data-url") || "";
                //是否开启搜索框
                var isSearch = $(this).attr("data-search") || false;
                //存储当前数据
                var _thisData = $("#" + _thisId).attr("data-tabData") || new Array();
                //展现类型
                var _showType = $(this).attr("data-type");
                // debugger
                //添加搜索框及判断搜索框状态
                if (isSearch == "true" && ($("#" + _thisId).find(".transfer-search-div").length === 0)) {
                    var _searchHtml = [
                        '<div class="SearchStyle">',
                        '<dd lay-value="" class="transfer-search-div">',
                        // '<i class="layui-icon  drop-search-btn"></i>',
                        // '<input class="layui-input search_condition" placeholder="关键字搜索">',
                        '<span  class="transfer-title" style="margin-left: 0px">权限列表</span>',
                        '<i class="layui-icon  clear-btn search-clear-btn">&#x1006;</i>',
                        '</dd></div><div class="transfer-div leftContent"></div>'
                    ].join("");
                    $("#" + _thisId).append(_searchHtml);
                } else {
                    var _searchHtml = [
                        '<div class="transfer-div leftContent"></div>'
                    ].join("");
                    $("#" + _thisId).append(_searchHtml);
                }
                //判断是否为初次加载
                if (_thisDataUrl != undefined && _thisDataUrl != "" && _thisData.length === 0) {
                    //如果是从后台获取数据
                    // debugger
                    _thisData = checkboxTool.getDataByUrl(_thisDataUrl);
                    if (_thisData != "{}") {
                        //存储当前数据
                        $("#" + _thisId).attr("data-tabData", _thisData)

                        checkboxTool.contentRenderData(_thisData, _thisgrid, _thisOptions, _thisId, _showType);
                    }


                }
                // alert(isSearch)
            });
            form.on('submit(onreload)', function (_thisgrid, cyProps) {
                new transfer($this, options)
                return false;
            });
            form.on('submit(ongetData)', function (_data, index) {
                cyProps.ongetData(selectedValue, $this);
            });
        });

        //右移监听
        $(document).on("click", ".transfer-to-right", function () {
            var $this = $(this);
            var _name = $this.attr("lay-name") || "";
            var $parent = $this.parents(".transfer-content");
            var _thisSelectValue = [];
            console.log("右移监听中的==" + JSON.stringify(notSelectData))
            // if (notSelectData.length) {
            //     notSelectData.forEach(function (v) {
            //         var _value = v.id, _title = v.title;
            //         //是否为单选数据
            //         if (isSelectedRadio == "true") {
            //             selectedValue[0] = v;
            //             selectedValueId[0] = _value;
            //             $(".transfer-panel-left").find("input[type='checkbox']").attr("checked", false);
            //         } else {
            //             if (selectedValueId.indexOf(_value) == -1) {
            //                 selectedValueId.push(_value);
            //                 selectedValue.push(v);
            //                 _thisSelectValue.push(v);
            //                 // $("input[value='"+ _value +"']").attr('checked', false);
            //                 // $(".transfer-panel-left").find(".transfer-div").find("input[value='"+ _value +"']").attr("disabled","disabled")
            //             }
            //         }
            //     });
            // }

            myfunc(notSelectData);
            // rightListLoad($parent, _name, selectedValue, selectedValueId)
            cyProps.onchange(_thisSelectValue, $this)
            //重置按钮禁用
            $parent.find(".transfer-to-right button").addClass("layui-btn-disabled");
            layui.use('form', function () {
                var form = layui.form;
                form.render('checkbox');
            });
        });

        //左移监听
        $(document).on("click", ".transfer-to-left", function () {

            var $this = $(this);
            var _name = $this.attr("lay-name") || "";
            var $parent = $this.parents(".transfer-content");
            console.log("左移监听中的==" + JSON.stringify(rightSelectValue))
            if (rightSelectValue.length) {
                rightSelectValue.forEach(function (v) {
                    var _value = v.id, _title = v.title;
                    //删除已选数据
                    selectedValueId.splice($.inArray(_value, selectedValueId), 1);
                    selectedValue.forEach(function (v) {
                        if (v.id == _value) {
                            //删除已选数据
                            selectedValue.splice(jQuery.inArray(v, selectedValue), 1);
                        }
                    });
                    $("input[value='" + _value + "']").parents("dd").remove();
                });
            }
            cyProps.onchange(rightSelectValue, $this)
            // layer.alert(JSON.stringify(rightSelectValue));
            rightSelectValueId = [];
            rightSelectValue = [];
            //重置按钮禁用
            $parent.find(".transfer-to-left button").addClass("layui-btn-disabled");
            layui.use('form', function () {
                var form = layui.form;
                form.render('checkbox');
            });
        });

        /**搜索监听  **/
        $(document).on("keypress", " .transfer-search-div .search_condition", function (e) {
            e.stopPropagation();
            //是否为Enter键
            if (/^13$/.test(e.keyCode)) {
                debugger
                searchData($(this));
            }

        });
        /**清空搜索条件**/
        $(document).on("click", ".transfer-search-div .search-clear-btn", function (event) {
            $(this).prev().val("");
            searchData($(this));
        });

        function myfunc(checkdata) {
            layui.tree.render({
                elem: '#rightListContent',
                data: checkdata,
                edit: ['add', 'update', 'del'],
                showCheckbox: true,
                id: "transferRightTreeChecked",
                click: function (node, a) {
                    console.log(node);
                },
                oncheck: function (obj) {
                    var _checkData = obj.data,//当前数据
                        _checktype = obj.checked,//勾选状态
                        _checkElem = obj.elem;//当前节点
                    var $this = $(_checkElem);
                    var $parent = $this.parents(".transfer-content");

                    // var treeIdAll = '#' + treeId;
                    //获取选中节点
                    var checkData = layui.tree.getChecked("transferRightTreeChecked");
                    rightSelectValue = checkData
                    if (checkData) {
                        $parent.find(".transfer-to-left button").removeClass("layui-btn-disabled");
                    }else {
                        $parent.find(".transfer-to-left button").addClass("layui-btn-disabled");
                    }
                    console.log(checkData);
                    //已选数据添加及删除
                    // selectTreeChecked(obj.data, obj.checked, obj.elem, checkData)
                },
                ondbclick: function (node, a) {
                    alert(2222)
                }
            });

        }

        /**获取搜索后的数据  **/
        function searchData($this) {
            var value = $($this).val();
            var $parent = $this.parents(".transfer-content");
            // var dds = $parent.find(".transfer-panel-left .transfer-div").find("dd");
            var dds = $parent.find(".transfer-panel-left").find("dd");
            //显示搜索结果菜单
            var k = value;
            var patt = new RegExp(k);
            for (var i = 0; i < dds.length; i++) {
                if (k == "") {
                    $(dds[i]).show();
                } else if (patt.test($(dds[i]).attr("lay-title"))) {
                    $(dds[i]).show();
                } else {
                    $(dds[i]).hide();
                }
            }

        }

        /* tab页签数据渲染方法 */
        function addransferTab(obj) {
            //判断该页面是否已存在
            var _li = "",
                _tabCon = "";
            //是否默认选中
            if (obj.isDefault) {
                _li = ['<li class="layui-this" data-type="' + obj.showType + '" data-id="' + obj.tabId + '" data-search="' + obj
                    .isSearch + '" data-index="' + obj.tabindex + '" data-url="' + obj.tabDataUrl + '">' + obj.tabTitle + '</li>'
                ].join("");
                if (obj.isSearch) {
                    _tabCon = ['<div class="layui-tab-item layui-show" id="' + obj.tabId + '" data-tabData="' + obj.tabData + '">',
                        '<div class="SearchStyle">',
                        '<dd lay-value="" class="transfer-search-div">',
                        // '<i class="layui-icon  drop-search-btn"></i>',
                        // '<input class="layui-input search_condition" placeholder="关键字搜索">',
                        '<span  class="transfer-title" style="margin-left: 0px">权限列表</span>',
                        '<i class="layui-icon  clear-btn search-clear-btn">&#x1006;</i>',
                        '</dd></div><div class="transfer-div leftContent" style="height:' + (_thisHeight - 80) + 'px;"></div>',
                        '</div>'
                    ].join("");
                } else {
                    _tabCon = ['<div class="layui-tab-item layui-show" id="' + obj.tabId + '" data-tabData="' + obj.tabData +
                    '"><div class="transfer-div leftContent" style="height:' + (_thisHeight - 80) + 'px;"></div></div>'
                    ].join("");
                }
            } else {
                _li = ['<li data-type="' + obj.showType + '" data-id="' + obj.tabId + '"  data-search="' + obj.isSearch +
                '" data-index="' + obj.tabindex + '" data-url="' + obj.tabDataUrl + '">' + obj.tabTitle + '</li>'
                ].join("");
                _tabCon = ['<div class="layui-tab-item" id="' + obj.tabId + '" data-tabData="' + obj.tabData + '"></div>'].join(
                    "");
            }
            //新增tab页
            $(parent.document).find("#transferNavTab").append(_li);
            $(parent.document).find("#transferNavTabContent").append(_tabCon);
        };

        /* 树节点选择数据 */
        function selectTreeChecked(_data, _check, _elem, _checkAll) {
            var _checkData = _data,//当前数据
                _checktype = _check,//勾选状态
                _checkElem = _elem;//当前节点
            var $this = $(_checkElem);
            var $parent = $this.parents(".transfer-content");
            var _arrCheckData = [];
            if (isSelectedRadio == "true") {
                _arrCheckData = [];
                if (_data.children) {
                    layer.alert("单选时请选择子节点!")
                    $(".transfer-panel-left").find("input[type='checkbox']").attr("checked", false)
                } else {
                    _arrCheckData[0] = _data;
                    notSelectDataId[0] = _data.id;
                }
                layui.use('form', function () {
                    var form = layui.form;
                    form.render('checkbox');
                });
            } else {

                // for (var i = 0; i < _checkAll.length; i++) {
                // 	_checkAll[i].children.forEach(function(v) {
                // 		_arrCheckData.push(v);//选中数据集合
                // 		notSelectDataId.push(v.id);//选中数据唯一索引集合
                // 	});
                // }
                for (var i = 0; i < _checkAll.length; i++) {
                    let level1Node = _checkAll[i].children
                    if (level1Node.length > 0) {
                        for (var j = 0; j < level1Node.length; j++) {
                            let level2Node = level1Node[j].children
                            level2Node.forEach(function (v) {
                                _arrCheckData.push(v);//选中数据集合
                                notSelectDataId.push(v.id);//选中数据唯一索引集合
                            });

                        }


                    } else {
                        _checkAll[i].children.forEach(function (v) {
                            _arrCheckData.push(v);//选中数据集合
                            notSelectDataId.push(v.id);//选中数据唯一索引集合
                        });
                    }
                    // _checkAll[i].children
                }
                console.log("_arrCheckData==" + JSON.stringify(_arrCheckData))
            }

            // notSelectData = _arrCheckData;
            notSelectData = _checkAll;
            if (_checktype && notSelectData.length) {
                $parent.find(".transfer-to-right button").removeClass("layui-btn-disabled");
            } else {

                if (notSelectData.length === 0) {
                    //重置按钮禁用
                    $parent.find(".transfer-to-right button").addClass("layui-btn-disabled");
                }

            }
            console.log(notSelectData)
        }

        /* 已选列表数据渲染 */
        function rightListLoad($parent, _name, _data, _dataId) {
            $parent.find(".transfer-panel-right .transfer-div").html("");
            _data.forEach(function (v) {
                var _value = v.id, _title = v.title;
                var _input = ['<dd lay-value="' + _value + '" lay-title="' + _title + '"><input type="hidden" name="' + _name +
                '" value="' + _value + '">',
                    '<input lay-filter="transferRightChecked"  ',
                    ' type="checkbox"  title="' + _title + '" lay-skin="primary"></dd>'
                ].join("");
                _value && _title && $parent.find(".transfer-panel-right .transfer-div").append(_input);
            });
        }

        new transfer($this, options)
    };

})(jQuery);

