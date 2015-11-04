define([], function() {
    'use strict';

    var UUIDService = {};
    // see https://en.wikipedia.org/wiki/Universally_unique_identifier

    // Version 4
    UUIDService.getRandomUuid = function() {
        // source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        var uuidScheme = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var timestamp = new Date().getTime();

        return uuidScheme.replace(/[xy]/g, function(character) {
            var randomNumber = (timestamp + Math.random()*16)%16 | 0;
            timestamp = Math.floor(timestamp/16);
            return (character == 'x' ? randomNumber : (randomNumber&0x3|0x8)).toString(16);
        });
    };

    return UUIDService;
});
