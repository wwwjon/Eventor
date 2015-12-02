define(['app/model/event'], function(Event) {
	'use strict';

	var EventEditController = function($scope, $location, $routeParams,GuestRepository) {


		this.scope = $scope;
		this.scope.eventId = $routeParams.eventId;

		GuestRepository.get(
			{ id: $routeParams.eventId },
			{ id: $routeParams.guestId },
			function(guest) {
				this.scope.guest = guest;
			}.bind(this),
			function() {
				$location.path('/events/' + $routeParams.eventId);
			}
		);


		this.scope.add = function(newGuest) {

			GuestRepository.update(
				{ id: $routeParams.eventId },
				newGuest,
				function(data) {
					$location.path('/events/'+ $routeParams.eventId);
				},
				function() {
					$location.path('/events/');
				}
			);
		};
	};

	return EventEditController;
});
