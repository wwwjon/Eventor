define([], function() {
    'use strict';

    var EventDetailController = function($scope, $location, $routeParams, EventRepository) {
        this.scope = $scope;
        EventRepository.get(
            { id: $routeParams.eventId },
            function(event) {
                console.log(event);
                this.scope.event = event;
            }.bind(this),
            function() {
                $location.path('/events/');
            }
        );

    };

    return EventDetailController;
});