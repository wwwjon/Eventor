define(['tests/factories/eventFactory', 'tests/factories/eventStorageFactory','app/model/event', 'app/repository/EventRepository', 'app/repository/GuestRepository','libraries/angularMocks'],
    function (EventFactory, EventStorageFactory, Event, EventRepository, GuestRepository, AngularMocks) {
        'use strict';

        describe('GuestRepository', function() {
            var event, guest, guest2, eventStorage, eventRepository, guestRepository, $http, $httpBackend;
            var eventId = 0;
            var guestId = 0;

            function findEvent(id) {
                return eventStorage.filter(function(event) {
                    return event.id == id;
                })[0];
            }

            function findGuest(event, guestId) {
                return event.guests.filter(function(guest) {
                    return guest.id == guestId
                })[0];
            }

            function createGuest(event, id, name, contribution, comment){
                if(event && event.guests && !findGuest(event, id)) {
                    var guest = {
                        id: (id) ? id : ++guestId,
                        name : name,
                        contribution: contribution,
                        comment: comment,
                        canceled: false
                    };
                    event.guests.push(guest);
                    return guest;
                } else {
                    return null;
                }
            }

            function getGuestByIdAPI(eventId, url) {
                var getID = url.replace(guestRepository.urls.all.replace("{eventId}", eventId) + "/", "");
                var getEvent = findEvent(eventId);
                if (getEvent) {
                    var guest = findGuest(getEvent, getID);
                    if (guest) {
                        return [200, guest];
                    } else {
                        return [404, 'Guest (id ' + getID + ') not found.'];
                    }
                } else {
                    return [404, 'Event (id ' + eventId + ') not found.'];
                }
            }
            function addGuestAPI(eventId, data) {
                data = JSON.parse(data);
                var getEvent = findEvent(eventId);
                if(getEvent){
                    var countGuests = getEvent.guests.filter(function (guest) {
                        return !guest.canceled;
                    }).length;
                    if (countGuests < getEvent.maximalAmountOfGuests) {
                        var createdGuest = createGuest(
                            getEvent,
                            data.id,
                            data.name,
                            data.contribution,
                            data.comment
                        );
                        console.log(createdGuest);
                        return [200, createdGuest ];
                    } else {
                        return [404, 'Max count of guests achieved.'];
                    }
                } else{
                    return [404, 'Event (id ' + eventId + ') not found.'];
                }
            }
            function updateGuestAPI(eventId, url, data) {
                var getID = url.replace(guestRepository.urls.all.replace("{eventId}", eventId) + "/", "");
                var getEvent = findEvent(eventId);
                if(getEvent){
                    var guest = findGuest(getEvent, getID);
                    if(guest) {
                        if(data.name && data.name != guest.name) {
                            guest.name = data.name;
                        }
                        if(data.contribution && data.contribution != guest.contribution) {
                            guest.contribution = data.contribution;
                        }
                        if(data.comment && data.comment != guest.comment) {
                            guest.comment = data.comment;
                        }
                        if(data.canceled && data.canceled != guest.canceled) {
                            guest.canceled = data.canceled;
                        }

                        return [200, guest];
                    } else {
                        return [404, 'Guest (id ' + getID + ') not found.'];
                    }
                } else{
                    return [404, 'Event (id ' + eventId + ') not found.'];
                }
            }

            // setup
            beforeEach(AngularMocks.inject(function($injector) {
                $http = $injector.get('$http');
                $httpBackend = $injector.get('$httpBackend');

                eventRepository = new EventRepository($http);
                guestRepository = new GuestRepository($http);

                eventStorage = EventStorageFactory.createEventStorage();
                event = EventFactory.createEvent();
                event.id = 999;
                guest = createGuest(event, null, "Michael", "Schoggi-Kuchen", "Bin sicher zu früh" );
                guest2 = createGuest(eventStorage[0], null, "Hans", "Salat", "komme später" );


                //GetByID
                $httpBackend.when('GET', /\/api\/events\/999\/guests\/(\d*)/).respond(function(method, url, data, headers) {
                    return getGuestByIdAPI(999, url);
                });

                $httpBackend.when('GET', /\/api\/events\/111\/guests\/(\d*)/).respond(function(method, url, data, headers) {
                    return getGuestByIdAPI(111, url);
                });

                //update
                $httpBackend.when('POST', /\/api\/events\/999\/guests\/(\d*)/).respond(function(method, url, data, headers) {
                    console.log(url);
                    return updateGuestAPI(999, url, data);
                });

                $httpBackend.when('POST', /\/api\/events\/111\/guests\/(\d*)/).respond(function(method, url, data, headers) {
                    return updateGuestAPI(111, url, data);
                });

                //add
                $httpBackend.when('POST', /\/api\/events\/(\d*)\/guests/).respond(function(method, url, data, headers) {
                    var getID = url.replace(eventRepository.urls.all + "/", "");
                    getID = getID.replace("/guests", "");
                    return addGuestAPI(getID, data);
                });

            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe('get()', function() {

                describe('by object id', function() {
                    it('returns the object', function() {
                        eventStorage.push(event);
                        $httpBackend.expectGET(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        var getGuest = null;
                        guestRepository.get(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect(getGuest).toEqual(guest);
                    });
                });


                describe('by null guest object', function() {
                    it('returns null', function() {
                        var getGuest = 1;
                        guestRepository.get(event, null, function(data) {
                            getGuest = data;
                        }, function() {
                        });
                        expect(getGuest).toBeNull();
                    });
                });

                describe('by null event object', function() {
                    it('returns null', function() {
                        var getGuest = 1;
                        guestRepository.get(null, guest, function(data) {
                            getGuest = data;
                        }, function() {
                        });
                        expect(getGuest).toBeNull();
                    });
                });

                describe('by inexistent guest id', function() {
                    it('returns 404', function() {
                        eventStorage.push(event);
                        var failGuest = { id: "xxxxx" };
                        $httpBackend.expectGET(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', failGuest.id));
                        var getGuest = 1;
                        guestRepository.get(event, failGuest, function(data) {
                            getGuest = data;
                        }, function(error) {
                            getGuest = error;
                        });
                        $httpBackend.flush();
                        expect(getGuest).toEqual('Guest (id xxxxx) not found.');
                    });
                });

                describe('by inexistent event id', function() {
                    it('returns 404', function() {
                        var failEvent = { id: 111 };
                        $httpBackend.expectGET(guestRepository.urls.byId.replace('{eventId}', failEvent.id).replace('{guestId}', guest.id));
                        var getGuest = null;
                        guestRepository.get(failEvent, guest, function(data) {
                            getGuest = data;
                        }, function(error) {
                            getGuest = error;
                        });
                        $httpBackend.flush();
                        expect(getGuest).toEqual('Event (id 111) not found.');
                    });
                });
            });

            describe('add()', function() {

                describe('insert valid guest', function() {

                    it('returns inserted guest', function() {
                        eventStorage.push(event);
                        var addedGuest = null;
                        $httpBackend.expectPOST(guestRepository.urls.all.replace("{eventId}", event.id));
                        guestRepository.add(event, guest2, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        $httpBackend.flush();
                        expect(guest2).toEqual(addedGuest);
                    });

                    it('array size incremented', function() {
                        eventStorage.push(event);
                        event.guests.splice(1);
                        var size = event.guests.length;
                        var addedGuest = null;
                        $httpBackend.expectPOST(guestRepository.urls.all.replace("{eventId}", event.id));
                        guestRepository.add(event, guest2, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        $httpBackend.flush();
                        expect(size + 1).toEqual(event.guests.length);
                    });
                });

                describe('insert null guest', function() {
                    it('returns null', function() {
                        eventStorage.push(event);
                        var addedGuest = null;
                        guestRepository.add(event, null, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        expect(addedGuest).toBeNull();
                    });

                    it('array size not affected', function() {
                        eventStorage.push(event);
                        event.guests.splice(1);
                        var size = event.guests.length;
                        var addedGuest = null;
                        guestRepository.add(event, null, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        expect(size).toEqual(event.guests.length);
                    });
                });

                describe('same element again', function() {

                    beforeEach(function() {
                        event.guests.push(guest2);
                        eventStorage.push(event);
                    });

                    it('returns null', function() {
                        var addedGuest = null;
                        $httpBackend.expectPOST(guestRepository.urls.all.replace("{eventId}", event.id));
                        guestRepository.add(event, guest2, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        $httpBackend.flush();
                        expect(addedGuest).toBeNull();
                    });

                    it('array size not affected', function() {
                        var size = event.guests.length;
                        var addedGuest = null;
                        $httpBackend.expectPOST(guestRepository.urls.all.replace("{eventId}", event.id));
                        guestRepository.add(event, guest2, function(newGuest) {
                                addedGuest = newGuest;
                            },
                            function() {
                                console.log("failed");
                            }
                        );
                        $httpBackend.flush();
                        expect(addedGuest).toBeNull();
                        expect(size).toEqual(event.guests.length);
                    });
                });


            });

            describe('update()', function() {

                beforeEach(function() {
                    eventStorage.push(event);
                });

                describe('update properties', function() {
                    it('update name', function() {
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        guest.name = "Test";
                        var getGuest = null;
                        guestRepository.update(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect("Test").toEqual(getGuest.name);
                    });
                    it('update contribution', function() {
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        guest.contribution = "Test";
                        var getGuest = null;
                        guestRepository.update(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect("Test").toEqual(getGuest.contribution);
                    });
                    it('update comment', function() {
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        guest.comment = "Test";
                        var getGuest = null;
                        guestRepository.update(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect("Test").toEqual(getGuest.comment);
                    });
                    it('update canceled true', function() {
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        guest.canceled = true;
                        var getGuest = null;
                        guestRepository.update(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect(true).toEqual(getGuest.canceled);
                    });
                    it('update canceled false', function() {
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', guest.id));
                        guest.canceled = false;
                        var getGuest = null;
                        guestRepository.update(event, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        $httpBackend.flush();
                        expect(false).toEqual(getGuest.canceled);
                    });
                });


                describe('by null event object', function() {
                    it('returns null', function() {
                        var getGuest = 1;
                        guestRepository.update(null, guest, function(data) {
                            getGuest = data;
                        }, function() {});
                        expect(getGuest).toBeNull();
                    });
                });

                describe('by null guest object', function() {
                    it('returns null', function() {
                        var getGuest = 1;
                        guestRepository.update(event, null, function(data) {
                            getGuest = data;
                        }, function() {});
                        expect(getGuest).toBeNull();
                    });
                });

                describe('by inexistent guest id', function() {
                    it('returns 404', function() {
                        eventStorage.push(event);
                        var failGuest = { id: "xxxxx" };
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', event.id).replace('{guestId}', failGuest.id));
                        var getGuest = 1;
                        guestRepository.update(event, failGuest, function(data) {
                            getGuest = data;
                        }, function(error) {
                            getGuest = error;
                        });
                        $httpBackend.flush();
                        expect(getGuest).toEqual('Guest (id xxxxx) not found.');
                    });
                });

                describe('by inexistent event id', function() {
                    it('returns 404', function() {
                        var failEvent = { id: 111 };
                        $httpBackend.expectPOST(guestRepository.urls.byId.replace('{eventId}', failEvent.id).replace('{guestId}', guest.id));
                        var getGuest = 1;
                        guestRepository.update(failEvent, guest, function(data) {
                            getGuest = data;
                        }, function(error) {
                            getGuest = error;
                        });
                        $httpBackend.flush();
                        expect(getGuest).toEqual('Event (id 111) not found.');
                    });
                });
            });


        });
    });