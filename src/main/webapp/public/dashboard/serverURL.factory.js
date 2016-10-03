(function(){
    "use strict";

    angular.module("openlmis-core")
        .constant("OpenlmisServerURL", function(){
            // The serverURL can be set with a grunt build argument
            // --serverURL=http://openlmis.server:location
            var serverURL = "@@OPENLMIS_SERVER_URL";
            if(serverURL.substr(0,2) == "@@"){
                return "/";
            } else {
                return serverURL;
            }
        }());

})();