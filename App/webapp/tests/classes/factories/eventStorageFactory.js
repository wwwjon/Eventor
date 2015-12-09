define(['app/model/event'], function (Event) {
    'use strict';

    var EventFactory = {
        createEventStorage: function() {
            return[ new Event(
                'Walter birthday',
                'The greatest birthday party Walter ever had',
                'Friends of Walter',
                'drinks, cake, salad or snacks',
                {
                    name: 'v house',
                    street: 'Main street 7',
                    zipCode: 8001,
                    city: 'Zurich'
                },
                {
                    begin: new Date('2013-10-10T18:00:00.000Z'),
                    end: new Date('2013-10-11T02:00:00.000Z')
                },
                5,
                1,
				null
            ),

				new Event(
						'Dinner for One',
						'The greatest birthday party on silvester',
						'Friends and Butler',
						'drinks, drinks, drinks, ...',
						{
							name: 'Castle',
							street: 'Castle place 1',
							zipCode: 9000,
							city: 'St.Gallen'
						},
						{
							begin: new Date('2016-01-10T18:00:00.000Z'),
							end: new Date('2016-01-11T02:00:00.000Z')
						},
						5,
						1,
						null
				),
				new Event(
				'Peters Feier',
				'The greatest birthday party peter ever had',
				'Friends of Peter',
				'drinks, cake, salad or snacks',
				{
					name: 'Peter house',
					street: 'Main street 3',
					zipCode: 8001,
					city: 'Zurich1'
				},
				{
					begin: new Date('2014-10-10T18:00:00.000Z'),
					end: new Date('2014-10-11T02:00:00.000Z')
				},
				10,
				2,
				null
			)];
        }
    };

    return EventFactory;
});
