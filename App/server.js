/**
 * Server configuration
 */
var express = require('express');
var bodyParser = require('body-parser');

var allowCrossDomain = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};


/**
 * Event / guest storage
 */
var eventId = 0;
var guestId = 0;
var events = [];

function createEvent(id, name, description, targetGroup, contributionsDescription, location, times){
    if(name) {
        var event = {
            id: (id) ? id : ++eventId,
            name : name,
            description : description,
            targetGroup: targetGroup,
            contributionsDescription: contributionsDescription,
            location:location,
            times : times,
            guests:[]
        };
        events.push(event);
        return event;
    } else {
        return null;
    }
}

function findEvent(id) {
    return events.filter(function(event) {
        return event.id == id
    })[0];
}

function createGuest(event, id, name, contribution, comment){
    if(event && event.guests) {
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

function findGuest(event, guestId) {
	return event.guests.filter(function(guest) {
		return guest.id == guestId
	})[0];
}


/**
 * Dummy data
 */
var event1 = createEvent(
    null,
    "HSR-Party",
    "Party an der HSR",
    "Studenten",
    "Kuchen",
    {
        name: "HSR",
        street: "Oberseestrasse",
        plz: 8640,
        city: "Rapperswil"
    },
    {
        begin: new Date('2015-11-15T19:00:00'),
        end: new Date('2011-11-16T03:00:00')
    }
);
createGuest(event1, null, "Michael", "Schoggi-Kuchen", "Bin sicher zu früh" );
createGuest(event1, null, "Hans", "Hotdog-Cake", null );

var event2 = createEvent(
    null,
    "Dinner",
    "Mitarbeiterdinner der HSR",
    "HSR Mitarbeiter",
    null,
    {
        name: "HSR",
        street: "Oberseestrasse",
        plz: 8640,
        city: "Rapperswil"
    },
    {
        begin: new Date('2015-11-20T18:00:00'),
        end: new Date('2011-11-20T21:00:00')
    }
);

createGuest(event2, null, "F. Meier", null, null );


/**
 * Basic server
 */
var app = express();
app.use(allowCrossDomain);
app.use(bodyParser.json())
app.use('/api', express.static(__dirname + '/api'));
app.use('/', express.static(__dirname + '/webapp/source'));
// tests, remove this for production
app.use('/tests', express.static(__dirname + '/webapp/tests'));
app.use('/source', express.static(__dirname + '/webapp/source'));


/**
 * API routes
 */
app.get('/api/events', function(request, response) {
    response.json({ events: events });
});

app.post('/api/events', function(request, response) {
    var event = createEvent(
       request.body.id,
       request.body.name,
       request.body.description,
       request.body.targetGroup,
       request.body.contributionsDescription,
       request.body.location,
       request.body.times
   );
   if(event) {
       response.json(event);
   } else {
       response.status(400).send('Event data incomplete.');
   }
});

app.get('/api/events/:id', function(request, response) {
    var event = findEvent(request.params.id);
    if (event) {
        response.json(event);
    } else {
        response.status(404).send('Event (id '+request.params.id+') not found.')
    }
});

app.post('/api/events/:id', function(request, response) {
	var event = findEvent(request.params.id);
	if (event) {
		if(request.body.name && request.body.name != event.name) {
			event.name = request.body.name;
		}
		if(request.body.description && request.body.description != event.description) {
			event.description = request.body.description;
		}
		if(request.body.targetGroup && event.targetGroup != request.body.targetGroup) {
			event.targetGroup = request.body.targetGroup;
		}
		if(request.body.contributionsDescription && event.contributionsDescription != request.body.contributionsDescription) {
			event.contributionsDescription = request.body.contributionsDescription;
		}
		if(request.body.location && event.location != request.body.location) {
			event.location = request.body.location;
		}
		if(request.body.times && event.times != request.body.times) {
			event.times = request.body.times;
		}		
		response.json(event);
	} else {
		response.status(404).send('Event (id '+request.params.id+') not found.')
	}
});

app.get('/api/events/:id/guests', function(request, response) {
    var event = findEvent(request.params.id);
    if(event){
        response.json({ guests: event.guests });
    } else{
        response.status(404).send('Event (id '+request.params.id+') not found.')
    }
});

app.post('/api/events/:id/guests', function(request, response) {
    var event = findEvent(request.params.id);
    if(event){
        response.json(createGuest(
            event,
			request.body.id,
			request.body.name,
            request.body.contribution,
            request.body.comment
        ));
    } else{
        response.status(404).send('Event (id '+request.params.id+') not found.')
    }
});

app.get('/api/events/:eventId/guests/:guestId', function(request, response) {
	var event = findEvent(request.params.eventId);
	if(event){
		var guest = findGuest(event, request.params.guestId);
		if(guest) {
			response.json(guest);
		} else {
			response.status(404).send('Guest (id '+request.params.guestId+') not found.')
		}
	} else{
		response.status(404).send('Event (id '+request.params.eventId+') not found.')
	}
});

app.post('/api/events/:eventId/guests/:guestId', function(request, response) {
	var event = findEvent(request.params.eventId);
	if(event){
		var guest = findGuest(event, request.params.guestId);
		if(guest) {
			if(request.body.name && request.body.name != guest.name) {
				guest.name = request.body.name;
			}
			if(request.body.contribution && request.body.contribution != guest.contribution) {
				guest.contribution = request.body.contribution;
			}
			if(request.body.comment && request.body.comment != guest.comment) {
				guest.comment = request.body.comment;
			}
			if(request.body.canceled && request.body.canceled != guest.canceled) {
				guest.canceled = request.body.canceled;
			}
			
			response.json(guest);
		} else {
			response.status(404).send('Guest (id '+request.params.guestId+') not found.')
		}
	} else{
		response.status(404).send('Event (id '+request.params.eventId+') not found.')
	}
});


/**
 * Server start
 */
var appPort = 8080;
app.listen(appPort);
console.log('Server running on port '+appPort);
