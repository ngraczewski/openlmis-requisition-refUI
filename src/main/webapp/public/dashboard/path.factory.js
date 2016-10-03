(function(){
    "use strict";

     angular.module("openlmis-core")
        .constant('PathFactory', PathFactory);

    function PathFactory(){
        var parts = [];
        angular.forEach(arguments, function(arg, index){
            var uri = '';
            if(arg){
                var uri = arg.slice(0); // clone argument to prevent changing original values
            }
            if(uri[uri.length-1] == '/') uri = uri.substr(0, uri.length-1);
            if(index != 0 && uri[0] == '/') uri = uri.substr(1, uri.length);
            parts.push(uri);
        });
        var URL = parts.join('/');
        return URL;
    }

})();