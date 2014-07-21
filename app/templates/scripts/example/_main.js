require(
    [
        "angular",
        "jQuery",
        "json3",
        "ngResource",
        "ngRoute",
        "ngCookies",
        "ngSanitize",
        "config",
        "example/controllers/example"
    ],
    function (angular) {
        angular.bootstrap(document, ["exampleModule"]);
    },
    function (err) {
        console && console.log(err);
        var failedId = err.requireModules && err.requireModules[0];
        if (failedId/* && failedId === "jQuery"*/) {
            requirejs.undef(failedId); //在模块载入失败回调中使用undef函数移除模块的注册
        }
    }
);