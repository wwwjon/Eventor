define(['tests/factories/eventFactory', 'app/repository/EventRepository'], function (EventFactory, EventRepository) {
    'use strict';

    describe('EventStorageService test suite', function() {
        var event, StorageService;

        // setup
        beforeEach(function() {
            StorageService = new EventRepository();
            event = EventFactory.createEvent();
        });

        describe('get()', function() {
            beforeEach(function() {
                // TODO
            });

            describe('by object id', function() {
                it('returns the object', function() {
                    // TODO
                });
            });

            describe('by inexistent object id', function() {
                it('returns null', function() {
                    // TODO
                });
            });
        });


        describe('all()', function() {
            it('returns an Array', function() {
                // TODO
            });
        });

        describe('add()', function() {
            it('inserts element', function() {
                // TODO
            });

            describe('same element again', function() {
                // TODO

                beforeEach(function() {
                    // TODO
                });

                it('doesn\'t affect repository size', function() {
                    // TODO
                });

                it('returns false', function() {
                    // TODO
                });
            });
        });
    });
});