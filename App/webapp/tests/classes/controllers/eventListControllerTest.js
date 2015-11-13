define(['app/controllers/event/listController', 'frameworks/angular', 'libraries/angularMocks', 'app/repository/EventRepository'], function (EventListController, Angular, AngularMocks, EventRepository) {
    'use strict';

    var eventRepository, scope, $httpBackend;

    beforeEach(AngularMocks.inject(function ($injector) {
        scope = $injector.get('$rootScope').$new();

        var events = [{id: 1, name: 'Dinner'},{id: 2, name: 'Lunch'},{id: 3, name: 'Brunch'}];

        eventRepository = {
            all: function(successCallback) {
                successCallback(events);
            }
        };

    }));

    describe('EventListController', function() {
        describe('property scope', function() {
            it('contains 3 events', function() {
                var eventListController = new EventListController(scope, eventRepository);
                expect(3).toBe(eventListController.scope.events.length);
            });
        });
    });
});