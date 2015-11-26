define(['app/model/event'], function(Event) {
	'use strict';

	var GuestAddController = function($scope, $location, $routeParams, GuestRepository) {


		this.scope = $scope;
		this.scope.eventId = $routeParams.eventId;

		this.scope.add = function(newGuest) {
			GuestRepository.add(
				{ id: $routeParams.eventId },
				newGuest,
				function(data) {
					$location.path('/events/'+ $routeParams.eventId);
				},
				function(error) {
					console.log(error);
					this.scope.error = error;
				}.bind(this)
			);
		}.bind(this);
	};

	return GuestAddController;
});
