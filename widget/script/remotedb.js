 var now = Date.now();
 var appid = "A6916013433226";
 var appKey = SHA1(appid + "UZ" + "C44C7DDE-D48B-9E2F-3555-74C7FB2A4990" + "UZ" + now) + "." + now;

 var shopTypes = ['婚庆', 'KTV', '电影', '宠物', '购物', '家装', '酒店', '丽人', '美食', '面包甜点', '亲子', '外卖', '运动', '周边游', '足疗'];

 function fnGet(path, where, skip, limit, callback) {
     if (!path) {
         path = 'shop';
     }

     if (!where) {
         where = {};
     }

     api.showProgress({
         title: '通信中',
         modal: false
     });

     api.ajax({
         url: 'https://d.apicloud.com/mcm/api/' + path + '?filter={"where":' + JSON.stringify(where) + ',"skip":' + skip + ',"limit":' + LIMIT + '}',
         method: 'get',
         timeout: 5,
         dataType: 'json',
         headers: {
             "X-APICloud-AppId": appid,
             "X-APICloud-AppKey": appKey
         }
     }, function(ret, err) {
         api.refreshHeaderLoadDone();
         api.hideProgress();
         callback(ret, err);
     });
 };

 function fnPost(path, data, contentType, isLogin, isPut, callback) {
     var headers = {
         "X-APICloud-AppId": appid,
         "X-APICloud-AppKey": appKey
     };

     if (contentType) {
         headers["Content-Type"] = contentType
     }

     if (isLogin) {
         if (!$api.getStorage('loginInfo')) {
             api.openWin({
                 name: 'login',
                 url: 'widget://html/login.html'
             });
             return;
         }

         var accessToken = $api.getStorage('loginInfo').id;

         headers["authorization"] = accessToken;
     }

     api.showProgress({
         title: '通信中',
         modal: false
     });


     api.ajax({
         url: 'https://d.apicloud.com/mcm/api/' + path,
         method: isPut ? 'put' : 'post',
         timeout: 5,
         dataType: 'json',
         returnAll: false,
         headers: headers,
         data: data
     }, function(ret, err) {
         api.refreshHeaderLoadDone();
         api.hideProgress();
         callback(ret, err);
     });
 };
