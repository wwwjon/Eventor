
// declare dependency to angular (similar to import in java)
define(['frameworks/angular', 'app/controllers/event/listController', 'app/controllers/event/detailController', 'app/controllers/event/addController', 'app/controllers/event/editController','app/repository/EventRepository', 'libraries/angularRoute'],
    function (Angular, EventListController, EventDetailController, EventAddController, EventEditController, EventRepository) {
    'use strict';

	var Eventor = Angular.module('eventor', ['ngRoute']);

    EventRepository.$inject = ['$http'];
    Eventor.service('EventRepository', EventRepository);

	EventListController.$inject = ['$scope', 'EventRepository'];
	Eventor.controller('EventListController', EventListController);

    EventDetailController.$inject = ['$scope', '$routeParams', 'EventRepository'];
    Eventor.controller('EventDetailController', EventDetailController);

	EventAddController.$inject = ['$scope', '$location', 'EventRepository'];
	Eventor.controller('EventAddController', EventAddController);

	EventEditController.$inject = ['$scope', '$location', '$routeParams', 'EventRepository'];
	Eventor.controller('EventEditController', EventEditController);

    Eventor.config(function($routeProvider) {
        $routeProvider.when('/list', {
            controller: 'EventListController',
            templateUrl: './views/event/list.html'
        })
		.when('/events/new', {
			controller: 'EventAddController',
			templateUrl: './views/event/edit.html'
		})
		.when('/events/:eventId/edit', {
			controller: 'EventEditController',
			templateUrl: './views/event/edit.html'
		})
        .when('/events/:eventId', {
            controller: 'EventDetailController',
            templateUrl: './views/event/detail.html'
        })
        .otherwise({
            redirectTo: '/list'
        });
    });

	return Eventor;
});