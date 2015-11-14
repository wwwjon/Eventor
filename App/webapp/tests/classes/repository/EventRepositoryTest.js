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
                //console.log(events[0]);
                //console.log(Event);
                expect(events[0]).toEqual(jasmine.any(Object));
                expect(events[1]).toEqual(jasmine.any(Object));
            });
        });

        describe('get()', function() {
            beforeEach(function() {
                eventStorage.push(event);
            });

            /*
            describe('by object id', function() {
                it('returns the object', function() {

                    $httpBackend.expectGET(eventRepository.urls.byId.replace('{eventId}', event.id));
                    var getEvent = null;
                    eventRepository.get(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(eventRepository.get(event)).toEqual(event);
                });
            });


            describe('by inexistent object id', function() {
                it('returns null', function() {
                    expect(eventRepository.get(null)).toEqual(null);
                    expect(eventRepository.get('klasjf')).toEqual(null);
                });
            }); */
        });


    });
});