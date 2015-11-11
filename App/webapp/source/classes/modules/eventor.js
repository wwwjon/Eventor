
// declare dependency to angular (similar to import in java)
define(['frameworks/angular', 'app/controllers/event/listController', 'app/controllers/event/detailController','app/services/storageService', 'libraries/angularRoute'],
    function (Angular, EventListController, EventDetailController, StorageService) {

	var Eventor = Angular.module('eventor', ['ngRoute']);

	Eventor.service('StorageService', StorageService);

	EventListController.$inject = ['$scope', 'StorageService'];
	Eventor.controller('EventListController', EventListController);

    EventDetailController.$inject = ['$scope', '$routeParams', 'StorageService'];
    Eventor.controller('EventDetailController', EventDetailController);

	//EventListController.$inject = ['$scope'];

    Eventor.config(function($routeProvider) {
        $routeProvider.when('/list', {
            controller: 'EventListController',
            templateUrl: './views/list.html'
        })
        .when('/events/:eventId', {
            controller: 'EventDetailController',
            templateUrl: './views/detail.html'
        })
        .otherwise({
            redirectTo: '/list'
        });
    });

	return Eventor;
});