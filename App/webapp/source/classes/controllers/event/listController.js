define(['app/model/event'], function(Event) {
    'use strict';

	var EventListController = function($scope, EventRepository) {

		this.scope = $scope;
        EventRepository.all(function(events) {
            this.scope.events = events;
        }.bind(this),
        function() {});

	};

	return EventListController;
});