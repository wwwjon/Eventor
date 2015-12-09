define(['app/model/event'], function(Event) {
	'use strict';

	var guestRepository = function($http) {
        this.urls = {
            all: '/api/events/{eventId}/guests',
            byId: '/api/events/{eventId}/guests/{guestId}',
            add: '/api/events/{eventId}/guests'
        };

        this.get = function(event, guest, successCallback, errorCallback) {
            if (!event || !event.hasOwnProperty('id') || !guest || !guest.hasOwnProperty('id')) {
                successCallback(null);
            } else {
                $http.get(this.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id))
                    .success(function(data) {
                        successCallback(data);
                    })
                    .error(errorCallback);
            }
        };


        this.add = function(event, guest, successCallback, errorCallback) {
            if (!event || !event.hasOwnProperty('id') || !guest || !guest.hasOwnProperty('id')) {
                successCallback(null);
            } else {
                $http.post(this.urls.add.replace('{eventId}', event.id), guest)
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(errorCallback);
            }
        };

		this.update = function(event, guest, successCallback, errorCallback) {
            if (!event || !event.hasOwnProperty('id') || !guest || !guest.hasOwnProperty('id')) {
				successCallback(null);
			} else {
				$http.post(this.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id), guest)
					.success(function(data) {
						successCallback(data);
					})
					.error(errorCallback);
			}
		};
	};

	return guestRepository;
});