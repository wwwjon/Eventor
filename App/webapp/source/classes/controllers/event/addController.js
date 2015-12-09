define(['app/model/event'], function(Event) {
	'use strict';

	var EventAddController = function($scope, $location, EventRepository) {

		this.scope = $scope;
		this.scope.event = { times: {} };
		this.scope.minDate = new Date();
		this.scope.event.times.begin = new Date();
		this.scope.event.times.begin.setMilliseconds(0);
		this.scope.event.times.begin.setSeconds(0);
		this.scope.event.times.end = new Date();
		this.scope.event.times.end.setMilliseconds(0);
		this.scope.event.times.end.setSeconds(0);

		this.scope.add = function(newEvent) {

			newEvent.times.begin = new Date(newEvent.times.begin);
			newEvent.times.end = new Date(newEvent.times.end);

			EventRepository.add(
				newEvent,
				function(event) {
					$location.path('/events/'+event.id);
				},
				function() {}
			);
		};
	};
	EventAddController.prototype.createNumberSerie = function(start, step, end, digits) {
		digits = digits || 3;
		var serie = [];
		for(var i = start; i <= end; i+=step) {
			var digit = (1e10 + i + "").slice(-digits);
			serie.push(digit);
		}
		return serie;
	};

	return EventAddController;
});