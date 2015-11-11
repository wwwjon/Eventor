define(['app/controllers/event/listController', 'frameworks/angular', 'libraries/angularMocks', 'app/repository/EventRepository'], function (EventListController, Angular, AngularMocks, EventRepository) {
    'use strict';

    var eventListController;

    beforeEach(AngularMocks.inject(function ($rootScope) {
        var scope = $rootScope.$new();
        var StorageService = new EventRepository();
        eventListController = new EventListController(scope, EventRepository);
    }));

    describe('EventListController', function() {
        describe('property scope', function() {
            it('contains 3 events', function() {
                expect(3).toBe(eventListController.scope.events.length);
            });
        });
    });
});