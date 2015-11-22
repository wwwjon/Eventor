define(['app/model/event'], function(Event) {
	'use strict';

	var EventAddController = function($scope, $location, EventRepository) {


		this.scope = $scope;
		this.scope.hours = this.createNumberSerie(0,1,23,2);
		this.scope.minutes = this.createNumberSerie(0,5,59,2);
		this.scope.event = new Event();
		this.scope.mindate = new Date();

		this.scope.add = function(newEvent) {
			/*newEvent.times.begin = new Date(
				newEvent.times.begin.date.getFullYear(),
				newEvent.times.begin.date.getMonth(),
				newEvent.times.begin.date.getDate(),
				newEvent.times.begin.time.hours,
				newEvent.times.begin.time.minutes,
				0
			);
			newEvent.times.end = new Date(
				newEvent.times.end.date.getFullYear(),
				newEvent.times.end.date.getMonth(),
				newEvent.times.end.date.getDate(),
				newEvent.times.end.time.hours,
				newEvent.times.end.time.minutes,
				0
			); */

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
