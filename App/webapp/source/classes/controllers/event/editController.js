define(['app/model/event'], function(Event) {
	'use strict';

	var EventEditController = function($scope, $location, $routeParams, EventRepository) {


		this.scope = $scope;
		this.scope.hours = this.createNumberSerie(0,1,23,2);
		this.scope.minutes = this.createNumberSerie(0,5,59,2);

		EventRepository.get(
			{ id: $routeParams.eventId },
			function(event) {
				this.scope.event = event;
			}.bind(this),
			function() {}
		);

		this.scope.add = function(newEvent) {


			EventRepository.update(
				newEvent,
				function(event) {
					$location.path('/events/'+event.id);
				},
				function() {}
			);
		};
	};
	EventEditController.prototype.createNumberSerie = function(start, step, end, digits) {
		digits = digits || 3;
		var serie = [];
		for(var i = start; i <= end; i+=step) {
			var digit = (1e10 + i + "").slice(-digits);
			serie.push(digit);
		}
		return serie;
	};

	return EventEditController;
});