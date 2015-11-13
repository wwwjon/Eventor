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
        }
	};

	return eventRepository;
});