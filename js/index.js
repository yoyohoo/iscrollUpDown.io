var data,
    myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

function pullDownAction() {
    var dataList = $('#news-lists .item');
    //本地测试，为了看到加载中效果故加上定时器
    setTimeout(function() {
        $('#news-lists').empty();
        $('#news-lists').append(dataList);
        myScroll.refresh();
    }, 1000);
    $.getJSON('/allData.json', function(data, state) {
        if (data && data.state == 1 && state == 'success') {
            dataList = data;
        }
    });
}

function pullUpAction() {
    var dataList = ['<div class="item">下拉' + ($('#news-lists .item').length + 1) + '</div>'];
    //本地测试，为了看到加载中效果故加上定时器
    setTimeout(function() {
        for (var i in dataList) {
            $('#news-lists').append(dataList[i]);
        }
        myScroll.refresh();
    }, 1000);
    $.getJSON('/nextPage.json', function(data, state) {
        if (data && data.state == 1 && state == 'success') {
            dataList = data;
        }
    });
}

//初始化绑定iScroll控件 
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);
document.addEventListener('DOMContentLoaded', loaded, false);

function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    /**
     * 初始化iScroll控件
     */
    myScroll = new iScroll('wrapper', {
        vScrollbar: false,
        topOffset: pullDownOffset,
        maxScrollY: -200,
        bottomOffset: pullUpOffset,
        onRefresh: function() {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function() {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
            }
        },
        onScrollEnd: function() {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();
            }
        }
    });
}
