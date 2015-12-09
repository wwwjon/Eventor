define(['tests/factories/eventFactory', 'tests/factories/eventStorageFactory','app/model/event', 'app/repository/EventRepository','libraries/angularMocks'],
    function (EventFactory, EventStorageFactory, Event, EventRepository, AngularMocks) {
    'use strict';

    describe('EventRepository', function() {
        var event, eventStorage, eventRepository, $http, $httpBackend;
        var eventId = 0;

        function createEvent(id, name, description, targetGroup, contributionsDescription, location, times, maximalAmountOfGuests){
            if(name && !findEvent(id)) {
                var event = {
                    id: (id) ? id : ++eventId,
                    name : name,
                    description : description,
                    targetGroup: targetGroup,
                    contributionsDescription: contributionsDescription,
                    location:location,
                    times : times,
                    maximalAmountOfGuests: maximalAmountOfGuests,
                    guests:[]
                };
                eventStorage.push(event);
                return event;
            } else {
                return null;
            }
        }

        function findEvent(id) {
            return eventStorage.filter(function(event) {
                return event.id == id;
            })[0];
        }

        // setup
        beforeEach(AngularMocks.inject(function($injector) {
            $http = $injector.get('$http');
            $httpBackend = $injector.get('$httpBackend');

            eventRepository = new EventRepository($http);
            event = EventFactory.createEvent();
            eventStorage = EventStorageFactory.createEventStorage();

            $httpBackend.when('GET', eventRepository.urls.all).respond({
                events: eventStorage
            });

            $httpBackend.when('GET', eventRepository.urls.byId.replace('{eventId}', "")).respond({
                events: eventStorage
            });

            $httpBackend.when('GET', /\/api\/events\/(\d*)/).respond(function(method, url, data, headers) {
                var getID = url.replace(eventRepository.urls.all + "/", "");
                var getEvent = findEvent(getID);
                if (getEvent) {
                    return [200, findEvent(getID)];
                } else {
                    return [404, 'Event (id '+ getID +') not found.'];
                }
            });

            $httpBackend.when('POST', eventRepository.urls.all).respond(function(method, url,data, headers) {
                data = JSON.parse(data);
                var newEvent = createEvent(
                    data.id,
                    data.name,
                    data.description,
                    data.targetGroup,
                    data.contributionsDescription,
                    data.location,
                    data.times,
                    data.maximalAmountOfGuests
                );
                if(newEvent) {
                    console.log("200");
                    return [200, newEvent];
                } else {
                    console.log("404");
                    return [404, 'Event data incomplete.'];
                }
            });

            $httpBackend.when('POST', /\/api\/events\/(\d*)/).respond(function(method, url, data, headers) {
                console.log("update POST");
                data = JSON.parse(data);
                var getID = url.replace(eventRepository.urls.all + "/", "");
                var newEvent = findEvent(getID);
                if (newEvent) {
                    if(data.name && data.name != newEvent.name) {
                        newEvent.name = data.name;
                    }
                    if(data.description && data.description != newEvent.description) {
                        newEvent.description = data.description;
                    }
                    if(data.targetGroup && newEvent.targetGroup != data.targetGroup) {
                        newEvent.targetGroup = data.targetGroup;
                    }
                    if(data.contributionsDescription && newEvent.contributionsDescription != data.contributionsDescription) {
                        newEvent.contributionsDescription = data.contributionsDescription;
                    }
                    if(data.location && newEvent.location != data.location) {
                        newEvent.location = data.location;
                    }
                    if(data.times && newEvent.times != data.times) {
                        newEvent.times = data.times;
                        newEvent.times.begin = new Date(newEvent.times.begin);
                        newEvent.times.end = new Date(newEvent.times.end);
                    }
                    if(data.maximalAmountOfGuests && newEvent.maximalAmountOfGuests != data.maximalAmountOfGuests) {
                        newEvent.maximalAmountOfGuests = data.maximalAmountOfGuests;
                    }
                    return [200, newEvent];
                } else {
                    console.log("404");
                    return [404, 'Event (id '+getID+') not found.'];
                }
            });

        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('all()', function() {
            it('returns an Array', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events).toEqual(jasmine.any(Array));
            });

            it('returns 3 events', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events.length).toEqual(3);
            });

            it('returns real javascript objects', function() {
                $httpBackend.expectGET(eventRepository.urls.all);
                var events = null;
                eventRepository.all(function(eventList) {
                    events = eventList;
                });
                $httpBackend.flush();
                expect(events[0]).toEqual(jasmine.any(Object));
                expect(events[1]).toEqual(jasmine.any(Object));
            });
        });

        describe('get()', function() {

            describe('by object id', function() {
                it('returns the object', function() {
                    eventStorage.push(event);
                    $httpBackend.expectGET(eventRepository.urls.byId.replace('{eventId}', event.id));
                    var getEvent = null;
                    eventRepository.get(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(getEvent).toEqual(event);
                });
            });


            describe('by null object', function() {
                it('returns null', function() {
                    var getEvent = 1;
                    eventRepository.get(null, function(data) {
                        getEvent = data;
                    }, function() {});
                    expect(getEvent).toBeNull();
                });
            });

            describe('by inexistent object id', function() {
                var failEvent = { id: "xxxxx" };
                it('returns 404', function() {
                    $httpBackend.expectGET(eventRepository.urls.byId.replace('{eventId}', failEvent.id));
                    var getEvent = 1;
                    eventRepository.get(failEvent, function(data) {
                        getEvent = data;
                    }, function(error) {
                        console.log(error);
                        getEvent = null;
                    });
                    $httpBackend.flush();
                    expect(getEvent).toBeNull();
                });
            });
        });

        describe('add()', function() {

            describe('insert valid event', function() {
                it('returns inserted event', function() {
                    var addedEvent = null;
                    $httpBackend.expectPOST(eventRepository.urls.all);
                    eventRepository.add(event, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function() {
                            console.log("failed");
                        }
                    );
                    $httpBackend.flush();
                    expect(event).toEqual(addedEvent);
                });

                it('array size incremented', function() {
                    var size = eventStorage.length;
                    var addedEvent = null;
                    $httpBackend.expectPOST(eventRepository.urls.all);
                    eventRepository.add(event, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function() {
                            console.log("failed");
                        }
                    );
                    $httpBackend.flush();
                    expect(size + 1).toEqual(eventStorage.length);
                });
            });

            describe('insert null event', function() {
                it('returns null', function() {
                    var addedEvent = null;
                    eventRepository.add(null, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function(error) {
                            console.log(error);
                        }
                    );
                    expect(null).toEqual(addedEvent);
                });

                it('array size not affected', function() {
                    var size = eventStorage.length;
                    var addedEvent = null;
                    eventRepository.add(null, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function(error) {
                            console.log(error);
                        }
                    );
                    expect(size).toEqual(eventStorage.length);
                });
            });

            describe('same element again', function() {

                beforeEach(function() {
                    eventStorage.push(event);
                });

                it('returns null', function() {
                    var addedEvent = null;
                    $httpBackend.expectPOST(eventRepository.urls.all);
                    eventRepository.add(event, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function(error) {
                            console.log(error);
                        }
                    );
                    $httpBackend.flush();
                    expect(null).toEqual(addedEvent);
                });

                it('array size not affected', function() {
                    var size = eventStorage.length;
                    var addedEvent = null;
                    $httpBackend.expectPOST(eventRepository.urls.all);
                    eventRepository.add(event, function(newEvent) {
                            addedEvent = newEvent;
                        },
                        function(error) {
                            console.log(error);
                        }
                    );
                    $httpBackend.flush();
                    expect(size).toEqual(eventStorage.length);
                });
            });


        });

        describe('update()', function() {

            beforeEach(function() {
                eventStorage.push(event);
            });

            describe('update properties', function() {
                it('update name', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.name = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.name);
                });
                it('update description', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.description = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.description);
                });
                it('update target group', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.targetGroup = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.targetGroup);
                });
                it('update max guests', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.maximalAmountOfGuests = 9999;
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(9999).toEqual(getEvent.maximalAmountOfGuests);
                });
                it('update contribution', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.contributionsDescription = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.contributionsDescription);
                });
                it('update location name', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.location.name = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.location.name);
                });
                it('update location street', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.location.street = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.location.street);
                });
                it('update location zip', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.location.zipCode = 1000;
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(1000).toEqual(getEvent.location.zipCode);
                });
                it('update location city', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.location.city = "Test";
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect("Test").toEqual(getEvent.location.city);
                });
                it('update event begin', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.times.begin = new Date('2018-11-11T12:00:00.000Z');
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(new Date('2018-11-11T12:00:00.000Z')).toEqual(getEvent.times.begin);
                });
                it('update event end', function() {
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', event.id));
                    event.times.end = new Date('2018-11-11T12:00:00.000Z');
                    var getEvent = null;
                    eventRepository.update(event, function(data) {
                        getEvent = data;
                    }, function() {});
                    $httpBackend.flush();
                    expect(new Date('2018-11-11T12:00:00.000Z')).toEqual(getEvent.times.end);
                });
            });


            describe('by null object', function() {
                it('returns null', function() {
                    var getEvent = 1;
                    eventRepository.update(null, function(data) {
                        getEvent = data;
                    }, function() {});
                    expect(getEvent).toBeNull();
                });
            });

            describe('by inexistent object id', function() {
                it('returns 404', function() {
                    var failEvent = { id: "xxxxx" };
                    $httpBackend.expectPOST(eventRepository.urls.byId.replace('{eventId}', failEvent.id));
                    var getEvent = 1;
                    eventRepository.update(failEvent, function(data) {
                        getEvent = data;
                    }, function() {
                        getEvent = null;
                    });
                    $httpBackend.flush();
                    expect(getEvent).toBeNull();
                });
            });
        });


    });
});