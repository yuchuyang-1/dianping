function fnReady() {
    fnReadyKeyback();
    fnReadyOpenWin();
    fnReadyHeader();
    fnReadyNav();
    fnReadyFooter();
};

function fnReadyKeyback() {
    var keybacks = $api.domAll('.event-back');
    for (var i = 0; i < keybacks.length; i++) {
        $api.attr(keybacks[i], 'tapmode', 'highlight');
        keybacks[i].onclick = function() {
            api.closeWin();
        };
    }

    api.parseTapmode();
};

function fnReadyOpenWin() {
    var buttons = $api.domAll('.open-win');
    for (var i = 0; i < buttons.length; i++) {
        $api.attr(buttons[i], 'tapmode', 'highlight');
        buttons[i].onclick = function() {
            var target = $api.closest(event.target, '.open-win');
            var winName = $api.attr(target, 'win'),
                isNeedLogin = $api.attr(target, 'login'),
                param = $api.attr(target, 'param');

            if (isNeedLogin && !$api.getStorage('accessToken')) {
                winName = 'login';
            }

            if (param) {
                param = JSON.parse(param);
            }

            api.openWin({
                name: winName.replace('html/', ''),
                url: './' + winName + '.html',
                pageParam: param
            });
        };
    }
    api.parseTapmode();
};

var header, headerHeight = 0;

function fnReadyHeader() {
    header = $api.byId('header');
    if (header) {
        $api.fixIos7Bar(header);
        headerHeight = $api.offset(header).h;
    }
};

var nav, navHeight = 0;

function fnReadyNav() {
    nav = $api.byId('nav');
    if (nav) {
        navHeight = $api.offset(nav).h;
    }
};

var footer, footerHeight = 0;

function fnReadyFooter() {
    footer = $api.byId('footer');
    if (footer) {
        footerHeight = $api.offset(footer).h;
    }
};

function fnReadyFrame() {
    var frameName = api.winName + '_frame';
    api.openFrame({
        name: frameName,
        url: './' + frameName + '.html',
        bounces: true,
        bgColor: '#f0f0f0',
        rect: {
            x: 0,
            y: headerHeight + navHeight,
            w: 'auto',
            h: api.winHeight - headerHeight - footerHeight - navHeight
        },
        pageParam: api.pageParam
    });
};
