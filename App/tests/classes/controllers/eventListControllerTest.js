define(['app/controllers/event/listController', 'frameworks/angular', 'libraries/angularMocks', 'app/services/storageService'], function (EventListController, Angular, AngularMocks, storageService) {
    'use strict';

    var eventListController;

    beforeEach(AngularMocks.inject(function ($rootScope) {
        var scope = $rootScope.$new();
        var StorageService = new storageService();
        eventListController = new EventListController(scope, StorageService);
    }));

    describe('EventListController', function() {
        describe('property scope', function() {
            it('contains 3 events', function() {
                expect(3).toBe(eventListController.scope.events.length);
            });
        });
    });
});