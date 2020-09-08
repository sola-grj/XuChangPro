/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define(function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , laytpl = layui.laytpl
        , setter = layui.setter
        , view = layui.view
        , admin = layui.admin

    //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
    //……


    //退出
    admin.events.logout = function () {
        layui.data('layuiAdmin', {
            key: 'Authorization'
            , remove: true
        });
        // window.location()
        alert("删除之后" + layui.data('layuiAdmin').Authorization)
        // location.hash = 'http://10.0.23.97:8094/auth/oauth/authorize?response_type=token&client_id=client_1&redirect_uri=http://localhost:63342/XuChangFont/start/index.html?_ijt=r8gamlt0o96j6ai6l1hpsfut19#/home/home'
        //执行退出接口
        // admin.req({
        //     // url: './json/user/logout.js'
        //     url: 'http://10.0.23.97:8094/auth/oauth/authorize?response_type=token&client_id=client_1&redirect_uri=http://localhost:63342/XuChangFont/start/index.html?_ijt=r8gamlt0o96j6ai6l1hpsfut19#/home/home'
        //     , type: 'get'
        //     , data: {}
        //     , done: function (res) { //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
        //
        //         //清空本地记录的 token，并跳转到登入页
        //         admin.exit();
        //     }
        // });
    };


    //对外暴露的接口
    exports('common', {});
});