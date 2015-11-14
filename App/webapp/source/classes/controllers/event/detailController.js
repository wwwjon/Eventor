define([], function() {
    'use strict';

    var EventDetailController = function($scope, $routeParams, EventRepository) {
        this.scope = $scope;
        EventRepository.get(
            { id: $routeParams.eventId },
            function(event) {
                this.scope.event = event;
            }.bind(this),
            function() {}
        );

    };

    return EventDetailController;
});
