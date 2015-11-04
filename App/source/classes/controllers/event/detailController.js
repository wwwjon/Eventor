define([], function() {
    'use strict';

    var EventDetailController = function($scope, $routeParams, storageService) {
        this.scope = $scope;
        this.scope.event = storageService.events.get($routeParams.eventId);
    };

    return EventDetailController;
});
