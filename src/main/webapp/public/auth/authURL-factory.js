/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

 (function(){
 	"use strict";

 	angular.module("openlmis-auth")
 		.config(setAuthURL);

 	setAuthURL.$inject = ['$provide', 'OpenlmisServerURL', 'PathFactory'];
 	function setAuthURL($provide, OpenlmisServerURL, PathFactory){
		// The authUrl can be set with a grunt build argument
		// --AuthServiceURL=http://auth.service:location
		var authUrl = "@@AUTH_SERVICE_URL";
		if(authUrl.substr(0,2) == "@@"){
			authUrl = "";
		}

		if( authUrl.substr(0,4).toLowerCase() != 'http' && OpenlmisServerURL.substr(0,4).toLowerCase() == 'http' ){
			authUrl = PathFactory(OpenlmisServerURL, authUrl);
		}
		
		$provide.constant('AuthServiceURL', authUrl);
 	}

 	angular.module("openlmis-auth")
 		.factory("AuthURL", AuthURL);

 	AuthURL.$inject = ['AuthServiceURL', 'PathFactory'];
 	function AuthURL(AuthServiceURL, PathFactory){
 		return function(url){
 			return PathFactory(AuthServiceURL, url);
 		}
 	}

 })();