function loginDlgOrExit() {
    if ($("#loginbtn").text() === "登录") {
        var html = "<form name='form_login' method='post' action='' id='form_login'>" +
                "<div id='loginContent' style='margin:0px;'>" +
                "<ul id='loginUl' style='list-style-type: none;'>" +
                "<li>用户名：<input type='text' name='username' style='width:120px;margin-top:15px;' onkeydown='if(event.keyCode==13){this.form.pwd.focus();}'></li>" +
                "<li>密&nbsp;&nbsp;&nbsp;码：<input type='password' name='pwd'  style='width:120px;margin-top:15px;' onkeydown='if(event.keyCode==13){loginSubmit(this.form)}'>&nbsp;&nbsp;<a href='#'>忘记密码？</a></li>" +
                "<li style='padding-left:48px;margin-top:15px;'>" +
                "<input name='Submit' type='button'  onclick='loginSubmit(this.form)' value='登录'>&nbsp;&nbsp;&nbsp;" +
                "<input name='Submit2' type='button' value='关闭' onClick='closeLoginDlg()'></li>" +
                "<li style='float:right;margin-right:10px;'><a href='#'>立即注册</a></li>" +
                "</ul></div></form>";
        $.dialog({
            id:'logindlg',
            width: '310px',
            height: '190px',
            title: "用户登录",
            content: html,
            lock: true,
            drag: false,
            resize: false,
            max: false,
            min: false
        });
    }
    else{
        $.dialog.confirm('确定要退出登录吗？', function() {
            //var param = "username=" + form.username.value + "&pwd=" + form.pwd.value;
            var loader = new net.AjaxRequest("UserServlet?action=exit", deal_exit, onerror, "POST", null);
        }, function() {
            
        });
    }
}

function closeLoginDlg(){
    $.dialog({id:'logindlg'}).close();
}

function loginSubmit(form) {
    if (form.username.value === "") {
        alert("请输入用户名！");
        form.username.focus();
        return false;
    }
    if (form.pwd.value === "") {
        alert("请输入密码！");
        form.pwd.focus();
        return false;
    }
    var param = "username=" + form.username.value + "&pwd=" + form.pwd.value;
    var loader = new net.AjaxRequest("UserServlet?action=login", deal_login, onerror, "POST", encodeURI(param));
}

function onerror() {
    alert("您的操作有误");
}
function deal_login() {
    var text = this.req.responseText;
    text = text.replace(/\s/g, "");	//去除字符串中的Unicode空白
    if (text !== "fail") {
        //window.location.href="DiaryServlet?action=listAllDiary";
        $("#loginbtn").text("退出");
        $("#welcometext").text("欢迎您，" + text);
        $.dialog({id:'logindlg'}).close();
    } else {
        //form.username.value="";//清空用户名文本框 
        //form.pwd.value="";//清空密码文本框
        //form.username.focus();//让用户名文本框获得焦点
        alert("您输入的用户名或密码错误，请重新输入！");
    }
}

function deal_exit(){
    $("#welcometext").text("");
    $("#loginbtn").text("登录");
}
