define(['app/controllers/event/listController', 'app/controllers/event/addController', 'app/controllers/guest/addController', 'frameworks/angular', 'libraries/angularMocks', 'app/repository/EventRepository', 'tests/factories/eventStorageFactory', 'tests/factories/eventFactory'],
    function (EventListController,EventAddController, GuestAddController, Angular, AngularMocks, EventRepository, EventStorageFactory, EventFactory) {
    'use strict';

    var guestRepository, event, events, guest, location, scope, routeParams, $httpBackend;

    beforeEach(AngularMocks.inject(function ($injector) {
        scope = $injector.get('$rootScope').$new();

        events = EventStorageFactory.createEventStorage();
        event = EventFactory.createEvent(10);
        events.push(event);
        guest = {
            id: 99,
            name : "Hans",
            contribution: "Kuchen",
            comment: "Comment",
            canceled: false
        };


        guestRepository = {
            add: function(addEvent, addGuest, successCallback, errorCallback) {
                addEvent = events.filter(function(event) {
                    return event.id == addEvent.id ;
                })[0];
                addEvent.guests.push(addGuest);
                successCallback(addGuest);
            }
        };

        location = {
            path: function(text) {
                console.log(text);
            }
        };
        routeParams = { eventId : 10 };

    }));

    describe('GuestAddController', function() {
        describe('add Guest', function() {
            it('array size incremented', function() {
                var size = event.guests.length;
                var guestAddController = new GuestAddController(scope, location, routeParams, guestRepository);
                guestAddController.scope.guest = guest;
                guestAddController.scope.add(guestAddController.scope.guest);
                expect(event.guests.length).toBe(size + 1);
            });
        });
    });
});