/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2020.3.8

一个支持更换 Live2D 模型的 Typecho 插件。

本代码为奇趣保罗原创，并遵守 GPL 2.0 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var Paul_Pio = function (prop) {
    this.prop = prop;
    var current = {
        idol: 0,
        menu: document.querySelector(".pio-container .pio-action"),
        canvas: document.getElementById("pio"),
        body: document.querySelector(".pio-container"),
        // root: document.location.protocol +'//' + document.location.hostname +'/'
        root: "https://www.luokuans.com"
    };

    /* - 方法 */
    var modules = {
        // 更换模型
        idol: function () {
            current.idol < (prop.model.length - 1) ? current.idol++ : current.idol = 0;
            return current.idol;
        },
        // 创建内容
        create: function (tag, prop) {
            var e = document.createElement(tag);
            if(prop.class) e.className = prop.class;
            return e;
        },
        // 随机内容
        rand: function (arr) {
            return arr[Math.floor(Math.random() * arr.length + 1) - 1];
        },
        // 创建对话框方法
        render: function (text) {
            if(text.constructor === Array){
                dialog.innerText = modules.rand(text);
            }
            else if(text.constructor === String){
                dialog.innerText = text;
            }
            else{
                dialog.innerText = "输入内容出现问题了 X_X";
            }

            dialog.classList.add("active");

            clearTimeout(this.t);
            this.t = setTimeout(function () {
                dialog.classList.remove("active");
            }, 3000);
        },
        // 移除方法
        destroy: function () {
            current.body.parentNode.removeChild(current.body);
            localStorage.setItem("posterGirl", 0);
        },
        // 是否为移动设备
        isMobile: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            ua = ua.indexOf("mobi") || ua.indexOf("android") || ua.indexOf("ios");

            return window.innerWidth < 500 || ua !== -1;
        }
    };

    var elements = {
        home: modules.create("span", {class: "pio-home"}),
        skin: modules.create("span", {class: "pio-skin"}),
        info: modules.create("span", {class: "pio-info"}),
        night: modules.create("span", {class: "pio-night"}),
        close: modules.create("span", {class: "pio-close"})
    };

    var dialog = modules.create("div", {class: "pio-dialog"});
    current.body.appendChild(dialog);

    /* - 提示操作 */
    var action = {
        // 欢迎
        welcome: function () {
            if(document.referrer !== "" && document.referrer.indexOf(current.root) === -1){
                var referrer = document.createElement('a');
                referrer.href = document.referrer;
                prop.content.referer ? modules.render(prop.content.referer.replace(/%t/, "“" + referrer.hostname + "”")) : modules.render("欢迎来自 “" + referrer.hostname + "” 的朋友！");
            }
            else if(prop.tips){
                var text, hour = new Date().getHours();

                if (hour > 22 || hour <= 5) {
                    text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
                }
                else if (hour > 5 && hour <= 8) {
                    text = '早上好！';
                }
                else if (hour > 8 && hour <= 11) {
                    text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
                }
                else if (hour > 11 && hour <= 14) {
                    text = '中午了，工作了一个上午，现在是午餐时间！';
                }
                else if (hour > 14 && hour <= 17) {
                    text = '午后很容易犯困呢，今天的运动目标完成了吗？';
                }
                else if (hour > 17 && hour <= 19) {
                    text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
                }
                else if (hour > 19 && hour <= 21) {
                    text = '晚上好，今天过得怎么样？';
                }
                else if (hour > 21 && hour <= 23) {
                    text = '已经这么晚了呀，早点休息吧，晚安~';
                }
                else{
                    text = "奇趣保罗说：这个是无法被触发的吧，哈哈";
                }

                modules.render(text);
            }
            else{
                modules.render(prop.content.welcome || "欢迎来到本站！");
            }
        },
        // 触摸
        touch: function () {
            current.canvas.onclick = function () {
                modules.render(prop.content.touch || ["你在干什么？", "再摸我就报警了！", "Hentai!", "不可以这样欺负我啦！"]);
            };
        },
        // 右侧按钮
        buttons: function () {
            // 返回首页
            elements.home.onclick = function () {
                location.href = current.root;
            };
            elements.home.onmouseover = function () {
                modules.render(prop.content.home || "点击这里回到首页！");
            };
            current.menu.appendChild(elements.home);

            // 更换模型
            elements.skin.onclick = function () {
                loadlive2d("pio", prop.model[modules.idol()]);
                prop.content.skin && prop.content.skin[1] ? modules.render(prop.content.skin[1]) : modules.render("新衣服真漂亮~");
            };
            elements.skin.onmouseover = function () {
                prop.content.skin && prop.content.skin[0] ? modules.render(prop.content.skin[0]) : modules.render("想看看我的新衣服吗？");
            };
            if(prop.model.length > 1) current.menu.appendChild(elements.skin);

            // 关于我
            elements.info.onclick = function () {
                window.open(prop.content.link || "www.luokuans.com");
            };
            elements.info.onmouseover = function () {
                modules.render("想了解更多关于我的信息吗？");
            };
            current.menu.appendChild(elements.info);

            // 夜间模式
            if(prop.night){
                elements.night.onclick = function () {
                    eval(prop.night);
                };
                elements.night.onmouseover = function () {
                    modules.render("夜间点击这里可以保护眼睛呢");
                };
                current.menu.appendChild(elements.night);
            }

            // 关闭看板娘
            elements.close.onclick = function () {
                modules.destroy();
            };
            elements.close.onmouseover = function () {
                modules.render(prop.content.close || "QWQ 下次再见吧~");
            };
            current.menu.appendChild(elements.close);
        },
        custom: function () {
            prop.content.custom.forEach(function (t) {
                if(!t.type) t.type = "default";
                var e = document.querySelectorAll(t.selector);

                if(e.length){
                    for(var j = 0; j < e.length; j++){
                        if(t.type === "read"){
                            e[j].onmouseover = function () {
                                modules.render("想阅读 %t 吗？".replace(/%t/, "“" + this.innerText + "”"));
                            }
                        }
                        else if(t.type === "link"){
                            e[j].onmouseover = function () {
                                modules.render("想了解一下 %t 吗？".replace(/%t/, "“" + this.innerText + "”"));
                            }
                        }
                        else if(t.text){
                            e[j].onmouseover = function () {
                                modules.render(t.text);
                            }
                        }
                    }
                }
            });
        }
    };

    /* - 运行 */
    var begin = {
        static: function () {
            current.body.classList.add("static");
        },
        fixed: function () {
            action.touch(); action.buttons();
        },
        draggable: function () {
            action.touch(); action.buttons();

            var body = current.body;
            body.onmousedown = function (downEvent) {
                var location = {
                    x: downEvent.clientX - this.offsetLeft,
                    y: downEvent.clientY - this.offsetTop
                };

                function move(moveEvent) {
                    body.classList.add("active");
                    body.classList.remove("right");
                    body.style.left = (moveEvent.clientX - location.x) + 'px';
                    body.style.top  = (moveEvent.clientY - location.y) + 'px';
                    body.style.bottom = "auto";
                }

                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", function () {
                    body.classList.remove("active");
                    document.removeEventListener("mousemove", move);
                });
            };
        }
    };

    // 运行
    this.init = function (onlyText) {
        if(!(prop.hidden && modules.isMobile())){
            current.body.classList.add("loaded");

            if(!onlyText){
                action.welcome();
                loadlive2d("pio", prop.model[0]);
            }

            switch (prop.mode){
                case "static": begin.static(); break;
                case "fixed":  begin.fixed(); break;
                case "draggable": begin.draggable(); break;
            }

            if(prop.content.custom) action.custom();
        }
    };
    if(!localStorage.getItem("posterGirl")) this.init();
};

// 请保留版权说明
if (window.console && window.console.log) {
    console.log("%c Pio %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;","margin: 1em 0; padding: 5px 0; background: #efefef;");
}

var pio = new Paul_Pio({
    // static fixed draggable
    "mode": "draggable",
    "hidden": false,
    "tips":false,
    "link":["www.luokuans.com"],
    // "touch":["你这个绅士！", "别碰我！"]
    // "referer": "你通过 %t 来到了这里",
    "content": {
        "welcome": ["呐，你知道吗？听说樱花飘落的速度是秒速五厘米哦。", "低头呢喃 对你的偏爱太过明目张胆", "除非看见你 我才有好心情"],
        "custom": [
            {"selector": ".topbar .headMenu a", "text": "我与你相爱时 清白又勇敢"},
            {"selector": ".banner .carousel-inner", "text": "世间情动，不过盛夏白瓷梅子汤，碎冰撞壁叮当响。"},
            {"selector": ".music_mp3", "text": "点击播放 / 暂停音乐呀"},
            {"selector": ".tashuo .tashuo_content", "text": "春风十里，还是不如你呀"},
            {"selector": ".tashuo .tashuo_title", "text": "你笑起来真像好天气呀"},
            {"selector": ".you_title", "text": "我一扑向你，就感到无限温柔呀。"},
            {"selector": ".me .title-small", "text": "爱和自由 你和温柔"},
            {"selector": ".me #vedio_one", "text": "世界啊 这就是你说的青春吗？"},
            {"selector": ".me #vedio_two", "text": "清风月明"},
            {"selector": ".me .detail_one", "text": "我只不过未来储存足够的爱 足够的温柔和狡猾"},
            {"selector": ".me .detail_two", "text": "以防  万一 醒来就遇见你"},
            {"selector": ".ni .tab-pane", "text": "把每次偶遇的蓝色都送给你"},
            {"selector": ".ni .tabpage_one", "text": "你凤冠霞帔许我此不渝"},
            {"selector": ".ni .tabpage_two", "text": "我清风白露守你百岁无忧"},
            {"selector": "#footer a:nth-child(1)", "text": "Theme by : Canger"},
            {"selector": "#footer a:nth-child(2)", "text": "我还是一个小萌新呀"},
            {"selector": "#footer ul li:nth-child(1)", "text": "要看看我的Github吗？"},
            {"selector": ".cd-top", "text": "返回顶部呀"},
            {"selector": ".post-item a", "type": "read"},
            {"selector": ".post a, .post .else h3", "type": "link"},
            {"selector": ".topbar .topmenu a,.me .content-right a","type": "link"}
        ],
    },
    "night": "night()",
    "model": ["https://www.luokuans.com/ni/live2d/models/snow_miku/model.json","https://www.luokuans.com/ni/live2d/models/snow_miku/model.json/pio/model.json"]
});