define([], function() {
    'use strict';

    var EventDetailController = function($scope, $location, $routeParams, EventRepository, GuestRepository) {
        this.scope = $scope;
        EventRepository.get(
            { id: $routeParams.eventId },
            function(event) {
                this.scope.event = event;
            }.bind(this),
            function() {
                $location.path('/events/');
            }
        );

        this.scope.cancelGuest = function(guest) {

            guest.canceled = true;

            GuestRepository.update(
                { id: $routeParams.eventId },
                guest,
                function() {},
                function() {}
            );
        };

    };

    return EventDetailController;
});