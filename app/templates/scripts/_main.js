requirejs.config({
    urlArgs: "rand=" + (new Date()).getTime(), //only for development ！！！
    baseUrl: "/scripts",
    paths: {
        //packages
        jQuery: "../bower_components/jquery/jquery",   //需要时使用
        angular: "../bower_components/angular/angular",
        ngResource: "../bower_components/angular-resource/angular-resource",
        ngRoute: "../bower_components/angular-route/angular-route",
        ngCookies: "../bower_components/angular-cookies/angular-cookies",
        ngSanitize: "../bower_components/angular-sanitize/angular-sanitize",
        json3: "../bower_components/json3/lib/json3",
        config: "config"
    },
    shim: {
        "jQuery": {exports: "jQuery"},
        "json3": {exports: "json3"},
        "angular": {deps: ["json3"], exports: "angular"},
        "ngResource": {deps: ["angular"], exports: "ngResource"},
        "ngRoute": {deps: ["angular"], exports: "ngRoute"},
        "ngCookies": {deps: ["angular"], exports: "ngCookies"},
        "ngSanitize": {deps: ["angular"], exports: "ngSanitize"}
    }
});
