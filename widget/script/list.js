var path, where;
var salesType = ['立减10元', '返1%'];
var shopTypes = ['婚庆', 'KTV', '电影', '宠物', '购物', '家装', '酒店', '丽人', '美食', '面包甜点', '亲子', '外卖', '运动', '周边游', '足疗'];


function fnInitList(path, where) {
    window.path = path;
    window.where = where || {};

    fnInitVar();
    fnInitPullRefresh();
    fnInitPushRefresh();
};

var list, dot, bmap, lbs;

function fnInitVar() {
    list = $api.byId('list');
    var template = $api.byId('template');
    if (template) {
        dot = doT.template(template.innerHTML);
    }

    bmap = api.require('bMap');
    lbs = $api.getStorage('LBS') || {
        status: false
    };
};

function fnInitPullRefresh() {
    // api.setCustomRefreshHeaderInfo({
    //     bgColor: '#f0f0f0',
    //     image: {
    //         pull: [
    //             'widget://image/pullrefresh/anim_00.png',
    //             'widget://image/pullrefresh/anim_01.png',
    //             'widget://image/pullrefresh/anim_02.png',
    //             'widget://image/pullrefresh/anim_03.png',
    //             'widget://image/pullrefresh/anim_04.png',
    //             'widget://image/pullrefresh/anim_05.png',
    //             'widget://image/pullrefresh/anim_06.png',
    //             'widget://image/pullrefresh/anim_07.png',
    //             'widget://image/pullrefresh/anim_08.png',
    //             'widget://image/pullrefresh/anim_09.png',
    //             'widget://image/pullrefresh/anim_10.png'
    //         ],
    //         load: [
    //             'widget://image/pullrefresh/loading_00.png',
    //             'widget://image/pullrefresh/loading_01.png',
    //             'widget://image/pullrefresh/loading_02.png'
    //         ]
    //     }
    // }, function() {
    //     fnGetList(true);
    // });

    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/refresh.png',
        bgColor: '#f0f0f0',
        textColor: '#888',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: false
    }, function(ret, err) {
        fnGetList(true);
    });
};

function fnInitPushRefresh() {
    api.addEventListener({
        name: 'scrolltobottom'
    }, function(ret, err) {
        fnGetList(false);
    });
};

var LIMIT = 8;
var skip = 0,
    isEnd = false,
    isLoading = false;

function fnGetList(isPull) {
    if (isPull) {
        skip = 0;
        isEnd = false;
    }

    if (isEnd || isLoading) {
        return;
    }

    isLoading = true;

    // api.showProgress({
    //     title: '读取中',
    //     modal: false
    // });

    fnGet(path, where, skip, LIMIT, function(ret, err) {
        // alert(JSON.stringify(ret)+','+JSON.stringify(err));
        isLoading = false;
        api.hideProgress();
        api.refreshHeaderLoadDone();
        if (!ret || ret.length < LIMIT) {
            isEnd = true;
        }

        skip += LIMIT;

        fnShowList(ret, isPull);

        fnCacheImage(ret, 0);

        fnCalculateDistance(ret, 0);
    });
};

function fnShowList(datas, isPull) {
    if (isPull) {
        list.innerHTML = dot(datas);
    } else {
        list.innerHTML += dot(datas);
    }

    fnReadyOpenWin();
};

function fnCacheImage(datas, index) {
    if (datas.length <= index) {
        return;
    }

    api.imageCache({
        url: datas[index].thumbnail.url
    }, function(ret, err) {
        var thumbnail = $api.byId('thumbnail_' + datas[index].id);
        if (thumbnail) {
            thumbnail.src = ret.url;
        }

        fnCacheImage(datas, index + 1);
    });
};

function fnCalculateDistance(datas, index) {
    if (datas.length <= index || false == lbs.status) {
        return;
    }

    bmap.getCoordsFromName({
        city: '北京',
        address: datas[index].address
    }, function(ret, err) {
        if (!ret.status) {
            fnCalculateDistance(datas, index + 1);
            return;
        }

        bmap.getDistance({
            start: lbs,
            end: ret
        }, function(ret) {
            if (ret.status) {
                var distance = $api.byId('distance_' + datas[index].id);
                if (distance) {
                    distance.innerHTML = 1000 < ret.distance ? parseInt(ret.distance / 10) / 100 + ' km' : parseInt(ret.distance) + ' m';
                }
            }

            fnCalculateDistance(datas, index + 1);
        });
    });
};
