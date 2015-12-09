define(['app/model/event'], function(Event) {
	'use strict';

	var eventRepository = function($http) {
        this.urls = {
            all: '/api/events',
            byId: '/api/events/{eventId}',
            add: '/api/events'
        };

        this.all = function(successCallback) {
            $http.get(this.urls.all)
                .success(function(data) {
                    var events = data.events.map(function(eventDTO) {
                        return Event.createDTO(eventDTO);
                    });
                    successCallback(data.events);
                });
        };

        this.get = function(event, successCallback, errorCallback) {
            if (!event || !event.hasOwnProperty('id')) {
                successCallback(null);
            } else {
                $http.get(this.urls.byId.replace('{eventId}', event.id))
                    .success(function(data) {
                        successCallback(Event.createDTO(data));
                    })
                    .error(errorCallback);
            }
        };

        this.add = function(event, successCallback, errorCallback) {
            if (!event || !event.hasOwnProperty('name')) {
                successCallback(null);
            } else {
                $http.post(this.urls.add, event)
                    .success(function(data) {
                        successCallback(Event.createDTO(data));
                    })
                    .error(errorCallback);
            }
        };

		this.update = function(event, successCallback, errorCallback) {
			if (!event || !event.hasOwnProperty('id')) {
				successCallback(null);
			} else {
				$http.post(this.urls.byId.replace('{eventId}', event.id), event)
					.success(function(data) {
						successCallback(Event.createDTO(data));
					})
					.error(errorCallback);
			}
		};
	};

	return eventRepository;
});
