var db;

function fnInitLocal() {
    db = api.require('db');
};

var DATABASE = 'database_o2o';

function fnOpenDatabase() {
    fnInitLocal();
    db.openDatabase({
        name: DATABASE
    }, function(ret, err) {
        fnCreateHistory(function() {
            fnCreateHistoryIndex();
        });

        fnCreateFavorite(function() {
            fnCreateFavoriteIndex();
        });
    });
};

var HISTORY = 'table_history';

function fnCreateHistory(callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE ' + HISTORY + '(id INTEGER PRIMARY KEY, shopId VARCHAR(64), visit DATETIME)'
    }, callback);
};

function fnCreateHistoryIndex(callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX INDEX_' + HISTORY + '_shopId ON ' + HISTORY + '(shopId)'
    }, callback);
};

function fnInsertHistory(shopId, callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'REPLACE INTO ' + HISTORY + '(shopId, visit) VALUES("' + shopId + '", DATETIME("now"))'
    }, callback);
};

function fnSelectHistory(callback) {
    db.selectSql({
        name: DATABASE,
        sql: 'SELECT id,shopId,visit FROM ' + HISTORY + ' ORDER BY visit'
    }, callback);
};

var FAVORITE = 'table_favorite';

function fnCreateFavorite(callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE TABLE ' + FAVORITE + '(id INTEGER PRIMARY KEY, shopId VARCHAR(64))'
    }, callback);
};

function fnCreateFavoriteIndex(callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'CREATE UNIQUE INDEX INDEX_' + FAVORITE + '_shopId ON ' + FAVORITE + '(shopId)'
    }, callback);
};

function fnInsertFavorite(shopId, callback) {
    db.executeSql({
        name: DATABASE,
        sql: 'REPLACE INTO ' + FAVORITE + '(shopId) VALUES("' + shopId + '")'
    }, callback);
};

function fnSelectFavorite(callback) {
    db.selectSql({
        name: DATABASE,
        sql: 'SELECT id,shopId FROM ' + FAVORITE
    }, callback);
};
