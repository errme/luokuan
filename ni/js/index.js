//代码如诗 , 如痴如醉 !

// 轮播图
$(function () {
    banner();
});

function banner() {
    var isMobile = false;
    var width = $(window).width();
    if (width <= 992) {
        isMobile = true;
    }

    var myData = new Array();
    myData[0] = { pc: "./images/banner_1.png", mb: "./images/banner_sm_1.png" };
    myData[1] = { pc: "./images/banner_2.png", mb: "./images/banner_sm_2.png" };
    myData[2] = { pc: "./images/banner_3.png", mb: "./images/banner_sm_3.png" };

    var templatePoint = _.template($("#template_point").html());
    var templateImage = _.template($("#template_image").html());
    var htmlPoint = templatePoint({ model: myData });
    var htmlImage = templateImage({ model: myData, isMobile: isMobile });

    $(".carousel-indicators").html(htmlPoint);
    $(".carousel-inner").html(htmlImage);

    $(window).on("resize", function () {
        banner();
    });
}

// tashu
(function ($) {
    $(document).ready(function () {
        //typed js
        $(".typed").typed({
            strings: ["TA说", "我与你相爱时", "清白又勇敢"],
            typeSpeed: 400,
            backDelay: 1000,
            // loop
            loop: true
        });
    });
})(jQuery);

// console
console.log("%c 如果你来访我 我不在 请和我门外的花坐一会儿 它们很温暖 ",
    "padding:5px 1px;margin: 1em 0;color: #fff; background-image: linear-gradient(90deg, rgb(47, 172, 178) 0%, rgb(45, 190, 96) 100%);");
console.log("%c Cnager " + "%c http://errr.me http://xgan.me",
    "color: #fff; background-image: linear-gradient(90deg, rgb(47, 172, 178) 0%, rgb(45, 190, 96) 100%); padding:5px 1px;",
    "margin: 1em 0; padding: 5px 0; background: #efefef;");


// 夜间模式 未完成
var night_num = 0;
function night() {

    night_num++;
    if (night_num % 2 == 0) {
        $('body').css('background-color', 'rgb(255,255,255,255)');
        $('img').css('opacity', '1');
    }
    else {
        $('body').css('background-color', 'rgb(0,0,0,0.1)');
        $('img').css('opacity', '0.7');
        var tipElem = document.createElement('div');
        tipElem.innerHTML = "夜间模式开启了 还在测试中";
        var body = document.getElementsByTagName('body')[0];
        tipElem.style.cssText = 'background-color:#3FA9FB !important;color:#fff !important;font-size:14px;height:20px;line-height:20px;position:fixed;left:0;top:0;text-align:center;width:100%;z-index:99999;';
        body.appendChild(tipElem);
        setTimeout(function () {
            body.removeChild(tipElem);
        }, 2000);
    }
}

$(function () {
    //视频
    jsModern.video("#video");
    //播放视频
    $(".VideoBtn").click(function () {
        var video = document.getElementById("videoShow");
        video.play();
        $('.VideoBtn').hide();
    })
    //监听视频的播放状态
    var video = document.getElementById("videoShow");
    video.oncanplay = function () {
        $(".VideoBtn").show();
        //$("#video").attr("poster","");
    }
    //视频播放事件
    video.onplay = function () {
        $("#videoShow").attr("poster", "");
        $(".VideoBtn").hide();
    };
    video.onplaying = function () {
        $(".VideoBtn").hide();
    };

    //视频暂停事件
    video.onpause = function () {
        $(".VideoBtn").show();
    };
    //点击视频周围暂停播放图片出现
    video.onclick = function () {
        if (video.paused) {
            $(".VideoBtn").hide();
            video.play();
        } else {
            $(".VideoBtn").show();
            video.pause();
        }
    };
});

$(function () {
    //视频
    jsModern.video("#video1");
    //播放视频
    $(".VideoBtn1").click(function () {
        var video = document.getElementById("videoShow1");
        video.play();
        $('.VideoBtn1').hide();
    })
    //监听视频的播放状态
    var video = document.getElementById("videoShow1");
    video.oncanplay = function () {
        $(".VideoBtn1").show();
        //$("#video").attr("poster","");
    }
    //视频播放事件
    video.onplay = function () {
        $("#videoShow1").attr("poster", "");
        $(".VideoBtn1").hide();
    };
    video.onplaying = function () {
        $(".VideoBtn1").hide();
    };

    //视频暂停事件
    video.onpause = function () {
        $(".VideoBtn1").show();
    };
    //点击视频周围暂停播放图片出现
    video.onclick = function () {
        if (video.paused) {
            $(".VideoBtn1").hide();
            video.play();
        } else {
            $(".VideoBtn1").show();
            video.pause();
        }
    };
});