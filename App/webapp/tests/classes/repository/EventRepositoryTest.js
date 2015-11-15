define(['tests/factories/eventFactory', 'app/model/event', 'app/repository/EventRepository', 'libraries/angularMocks'], function (EventFactory, Event, EventRepository, AngularMocks) {
    'use strict';

    describe('EventRepository', function() {
        var event, eventRepository, $http, $httpBackend;
        var eventStorage = [{id: 1, name: 'Party'},{id: 2, name: 'Concert'}];

        function findEvent(id) {
            return eventStorage.filter(function(event) {
                return event.id == id;
            })[0];
        }

        // setup
        beforeEach(AngularMocks.inject(function($injector) {
            $http = $injector.get('$http');
            $httpBackend = $injector.get('$httpBackend');

            eventRepository = new EventRepository($http);
            event = EventFactory.createEvent();

            $httpBackend.when('GET', eventRepository.urls.all).respond({
                events: eventStorage
            });

            $httpBackend.when('GET', eventRepository.urls.byId.replace('{eventId}', "")).respond({
                events: eventStorage
            });

            $httpBackend.when('GET', /\/api\/events\/(\d*)/).respond(function(method, url, data, headers) {
                var getID = url.replace(eventRepository.urls.all + "/", "");
                var getEvent = findEvent(getID);
                if (getEvent) {
                    return [200, findEvent(getID)];
                } else {
                    return [404, 'Event (id '+ getID +') not found.'];
                }
            });

        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('all()', function() {
            it('returns an Array', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events).toEqual(jasmine.any(Array));
            });

            it('returns two events', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events.length).toEqual(2);
            });

            it('returns real javascript objects', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events[0]).toEqual(jasmine.any(Object));
                expect(events[1]).toEqual(jasmine.any(Object));
            });
        });

        describe('get()', function() {

            describe('by object id', function() {
                it('returns the object', function() {
                    eventStorage.push(event);
                    $httpBackend.expectGET(eventRepository.urls.byId.replace('{eventId}', event.id));
                    var getEvent = null;
                    eventRepository.get(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(getEvent).toEqual(event);
                });
            });


            describe('by null object', function() {
                it('returns null', function() {
                    var getEvent = 1;
                    eventRepository.get(null, function(data) {
                        getEvent = data;
                    }, function() {});
                    expect(getEvent).toBeNull();
                });
            });

            describe('by inexistent object id', function() {
                var failEvent = { id: "xxxxx" };
                it('returns 404', function() {
                    $httpBackend.expectGET(eventRepository.urls.byId.replace('{eventId}', failEvent.id));
                    var getEvent = 1;
                    eventRepository.get(failEvent, function(data) {
                        getEvent = data;
                    }, function(error) {
                        console.log(error);
                        getEvent = null;
                    });
                    $httpBackend.flush();
                    expect(getEvent).toBeNull();
                });
            });
        });


    });
});