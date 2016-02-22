(function ($) {
    //定义配置参数
    var DEFAULT_SETTINGS = {
        position: {},
        url: '',
        myparam: {}
    };
    //a为触发操作的dom
    jQuery.fn.place = function (a) {
        var dom = this,
            options = Array.prototype.slice.call(arguments, 1),
            s = $.extend(DEFAULT_SETTINGS, options[0]);
        dom.parent().attr('style', ' position: relative');

        //加载模版引擎
        var tplFile = YOYO.PUBLIC + '/Static/template.js';
        $.getScript(tplFile,function(){
            //模版文件
            var tpl =
                '<div id="placeDialog" data-show="0">'
                + '<div class="placeDialog_nav">'
                + '<ul>'
                + '<% for (key in list) { %>'
                + '<li><a href="javascript:void(0)" class=""><%= key%></a></li>'
                + '<% } %>'
                + '</ul>'
                + '</div>'
                + '<% for (key in list) { %>'
                + '<div class="placeDialog_list">'
                + '<ul>'
                + '<% for (var j = 0; j < list[key].length; j ++) { %>'
                + '<li><i class="hide search-key"><%= list[key][j].name %>|<%= list[key][j].pinyin %>|<%= list[key][j].ename %></i>' +
                '<a href="javascript:; " data-href="' + YOYO.ROOT + '/place/<%= list[key][j].idn %>"><%= list[key][j].name %></a>' +
                '</li>'
                + '<% } %>'
                + '</ul>'
                + '</div>'
                + '<% } %>'
                + '</div>';


            //请求数据
            $.ajax({
                type: "GET",
                url:s.url,
                data:s.myparam,
                dataType:"jsonp",
                success:function (data) {
                    var html, render = template.compile(tpl);
                    html = render({list: data});
                    dom.append(html);
                    //tab初始化
                    $("#placeDialog .placeDialog_nav").tabs(".placeDialog_list > ul", {
                        event: 'click',
                        effect: 'fade'
                    });
                    $('#placeDialog').css(s.postion)
                    $('#placeInput').val('').removeAttr('disabled').attr('placeholder','选择或输入目的地国家').placeholder();
                }
            })

            //输入事件
            var resultHtml = '<div id="placeSearchBox" style="position:absolute"><ul></ul></div>';
            dom.append(resultHtml);
            dom.on('keyup', a, function (e) {
                var $this = $(this),
                    key = $this.val(),
                    resultLi = '',
                    result = '', resultLiHtml = '', resultLi = new Array(),elem = $('.search-key').filter(function () {
                        return $(this).html().toLowerCase().indexOf(key) >= 0;
                    }),
                    result = elem.closest('li');;

                if ('' == key) {
                    $('#placeDialog,#placeSearchBox').hide()
                } else {
                    if(0==result.length){
                        resultLiHtml='<li><a>没有找到<font color="red">'+key+'</font>相关的国家</a></li>';
                    }else{
                        $.each(result, function (i, n) {
                            5 < i ? true : resultLi[n.outerHTML] = n.outerHTML
                        });
                        for (k in resultLi) {
                            resultLiHtml += resultLi[k]
                        }
                    }

                    $('#placeSearchBox').show().find('ul').html(resultLiHtml);
                    $('#placeDialog').hide();
                }

            })

            //点击事件
            $(a).on('click', function () {
                //todo 首先弹出一个加载层
                var p = $('#placeDialog');
                if (1 == p.length) {
                    if (p.is(':hidden') && 0 == p.data('show')) {
                        p.attr('data-show', 1).slideDown(150);
                    }
                    return false;
                }
            })
            dom.on('mouseover', "#placeDialog",function () {
                $(this).attr('data-show', 1);
            }).on('mouseout', "#placeDialog", function () {
                $(this).attr('data-show', 0);
            })
            $('html').on('click', '#placeDialog,#placeDialog a,#placeSearchBox a',function () {
                var url = $(this).data('href');
                if (!isEmpty(url))window.location.href = url
                return false
            }).on('click', function () {
                var p = $('#placeDialog');
                if (p.is(':visible') && 0 == p.data('show')) {
                    $('#placeDialog').slideUp(150);
                }
                ;
            })

        });


    }

}(jQuery));


