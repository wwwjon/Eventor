define(['frameworks/angular', 'app/controllers/eventListController'],
    function (Angular, EventListController) {
        'use strict';

        var Eventor = Angular.module('eventor', []);
        Eventor.controller('EventListController', EventListController);
        EventListController.$inject = ['$scope'];

        return Eventor;
	});