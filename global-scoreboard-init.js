var espn = espn || {};
espn.bookmarklets = espn.bookmarklets || {};

(function($, scoreboard, espnSB, console) {

	var id = 'global-scoreboard',
		FAV_COLOR = '#d4af37',
		_loaded = espn.bookmarklets[id] === true;

	function _debug() {

		console.group('GLOBAL SCOREBOARD');

		if(scoreboard && scoreboard.leagues) {
			scoreboard.leagues.each(function(league) {
				console.groupCollapsed('league ' + league.get('abbreviation') + ' (' + league.get('id') + ')');
				console.log(league.toJSON());

				// debug schedules
				league.get('schedules').each(function(schedule) {
					console.group('schedule ' + (schedule.get('scoDate') || schedule.get('scoWeek')));
					console.log(schedule.toJSON());

					// debug events
					var games = schedule.get('games');
					var events = schedule.get('events');
					var draft = schedule.get('draft');

					if(games && games.length > 0) {
						games.each(function(game) {

							var teams = [];
							game.get('teams').each(function(team) {
								teams.push(team.get('name'));
							});

							var isFavorite = game.get('isFavorite') === true,
							    	isTopEvent = game.get('isTopEvent') === true,
							    	star = isFavorite ? ' \u2605' : '',
							    	top = isTopEvent ? ' \u25B2' : '',
								color = isFavorite ? FAV_COLOR : '';

							var str = '%cgame ' + teams.join(' vs ') + ' (' + game.get('id') + ')' + star + top;

							console.groupCollapsed(str, 'color:' + color + ';');
							console.log(game.toJSON());
							// debug teams
							game.get('teams').each(function(team) {
								var isFavorite = team.get('isFavorite') === true,
								    	star = isFavorite ? ' \u2605' : '',
									color = isFavorite ? FAV_COLOR : '';

								console.groupCollapsed('%cteam ' + team.get('name') + ' (' + team.get('id') + ')' + star, 'color:' + color + ';');
								console.log(team.toJSON());
								console.groupEnd();
							});

							console.groupEnd();
						});
					}

					if(events && events.length > 0) {
						events.each(function(evnt) {
							console.group('event ' + evnt.get('name') + ' (' + evnt.get('id') + ')');
							console.log(evnt.toJSON());
							// go straight to competitions
							evnt.get('competitions').each(function(competition) {
								console.group('competition ' + competition.get('name') + ' (' + competition.get('id') + ')');
								console.log(competition.toJSON());
								console.log('backbone obj: ', competition);
								// debug athletes
								competition.get('athletes').each(function(athlete) {
									console.groupCollapsed('athlete ' + athlete.get('shortName'));

									console.log(athlete.toJSON());

									console.groupEnd();
								});
								console.groupEnd();
							});
							console.groupEnd();
						});
					}

					if(draft) {
						console.group('draft ' + draft.get('name'));
						console.log(draft.toJSON());

						if(draft.get('rounds')) {
							draft.get('rounds').each(function(rnd) {
								console.group('round ' + rnd.get('name') + ' (' + rnd.get('id') + ')');
								console.log(rnd.toJSON());
								// go straight to competitions
								rnd.get('picks').each(function(pick) {
									console.groupCollapsed('pick ' + pick.get('name') + ' (' + pick.get('id') + ')');
									console.log(pick.toJSON());
									console.groupEnd();
								});
								console.groupEnd();
							});
						}

						console.groupEnd();
					}

					console.groupEnd();
				});

				console.groupEnd();
			});
		}

		console.groupEnd();
	}

	// init
	if(_loaded === false) {
		_debug();
		espn.bookmarklets[id] = true;

		if(espnSB !== undefined) {
			espnSB.on('resetSB', function() {
				console.clear();
				_debug();
			});
		}

	} else {
		console.clear();
		_debug();
	}
})(window.jQuery, window.espn.scoreboard, window.espnSB, window.console);
