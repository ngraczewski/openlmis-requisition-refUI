/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe("AuthURL", function () {

  var AuthURL;

  beforeEach(module('openlmis-auth'));

  beforeEach(module(function($provide){
    $provide.factory('OpenlmisURL', function(){
      return function(url){
        return '/' + url;
      }
    });
  }));

  beforeEach(inject(function (_AuthURL_) {
    AuthURL = _AuthURL_;
  }));

  it('should return string', function () {
    var url = AuthURL("/someURL");
    expect(typeof(url)).toBe("string");
  });

  it("should format relative and absolute urls the same", function(){
    var relativeURL = AuthURL("someURL");
    var absoluteURL = AuthURL("/someURL");

    expect(relativeURL).toEqual(absoluteURL);
  });

});