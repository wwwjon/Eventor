define(['app/controllers/event/listController', 'frameworks/angular', 'libraries/angularMocks', 'app/repository/EventRepository', 'tests/factories/eventStorageFactory'],
    function (EventListController, Angular, AngularMocks, EventRepository, EventStorageFactory) {
    'use strict';

    var eventRepository, scope, $httpBackend;

    beforeEach(AngularMocks.inject(function ($injector) {
        scope = $injector.get('$rootScope').$new();

        var events = EventStorageFactory.createEventStorage();

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