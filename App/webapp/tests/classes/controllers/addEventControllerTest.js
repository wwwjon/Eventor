define(['app/controllers/event/listController', 'app/controllers/event/addController', 'frameworks/angular', 'libraries/angularMocks', 'app/repository/EventRepository', 'tests/factories/eventStorageFactory', 'tests/factories/eventFactory'],
    function (EventListController,EventAddController, Angular, AngularMocks, EventRepository, EventStorageFactory, EventFactory) {
    'use strict';

    var eventRepository, event, events,location, scope, $httpBackend;

    beforeEach(AngularMocks.inject(function ($injector) {
        scope = $injector.get('$rootScope').$new();

        events = EventStorageFactory.createEventStorage();
        event = EventFactory.createEvent();


        eventRepository = {
            all: function(successCallback) {
                successCallback(events);
            },
            add: function(addEvent, successCallback, errorCallback) {
                events.push(addEvent);
                successCallback(addEvent);
            }
        };

        location = {
            path: function(text) {
                console.log(text);
            }
        };

    }));

    describe('EventAddController', function() {
        describe('add Event', function() {
            it('array size incremented', function() {
                var size = events.length;
                var eventAddController = new EventAddController(scope, location, eventRepository);
                eventAddController.scope.event = event;
                eventAddController.scope.add(eventAddController.scope.event);
                expect(events.length).toBe(size + 1);
            });
        });
    });
});