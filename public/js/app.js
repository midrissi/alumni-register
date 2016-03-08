'use strict';

(function(app) {
	app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
		$scope.ready = true;

		var p;

		var mailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		$scope.dRPoptions = {
			locale: {
				cancelLabel: 'Annuler',
				applyLabel: 'Valider'
			},
			separator: ':'
		};

		$scope.today = moment(new Date()).format('YYYY-MM-DD');
		$scope.years = [1979];

		while ($scope.years[0] < (new Date()).getFullYear()) {
			$scope.years.unshift($scope.years[0] + 1);
		}

		var views = $scope.views = [{
			view: 'views/step1.html',
			title: 'Infos Générales',
			subTitle: 'Vos informations basique',
			validate: function(p) {
				if (!p.title) {
					this.messages.push({
						message: 'La civilité est obligatoire',
						type: 'danger'
					});
				}

				if (!p.name) {
					this.messages.push({
						message: 'Le nom est obligatoire',
						type: 'danger'
					});
				}

				if (!p.year) {
					this.messages.push({
						message: 'La promotion est obligatoire',
						type: 'danger'
					});
				}

				if (!p.email) {
					this.messages.push({
						message: "L'adresse mail est obligatoire",
						type: 'danger'
					});
				} else if (!mailRegex.test(p.email)) {
					this.messages.push({
						message: "L'adresse mail est invalide",
						type: 'danger'
					});
				}

				if (this.messages.length > 0) {
					return false;
				}

				return true;
			}
		}, {
			view: 'views/step2.html',
			title: 'Infos Professionnelles',
			subTitle: 'Votre Travail Actuel'
		}, {
			view: 'views/step3.html',
			title: 'Activités Extraprofessionnelles',
			subTitle: 'Vos Activités Extraprofessionnelles'
		}, {
			view: 'views/step4.html',
			title: 'Expériences Professionnelles',
			subTitle: 'Vos Expériences Professionnelles'
		}];

		var finishView = {
			view: 'views/finish.html'
		};

		views.map(function(v, index) {
			v.index = index;
			v.messages = [];
		});

		($scope.startOver = function() {
			p = $scope.person = {
				activities: [],
				experience: [],
				country: 'Maroc',
				year: $scope.years[1] + ""
			};

			views.current = views[0];
		})();

		function lookFor(obj, arr) {
			if (!Array.isArray(arr)) {
				return -1;
			}

			for (var i = arr.length - 1; i >= 0; i--) {
				if (arr[i] === obj) {
					return i;
				}
			};

			return -1;
		}

		$scope.next = function() {
			var cIndex = lookFor(views.current, views);

			if (cIndex < views.length - 1) {
				views.current.messages = [];

				if (typeof views.current.validate === 'function') {
					if (views.current.validate(p)) {
						views.current = views[cIndex + 1];
					}
					return;
				}

				views.current = views[cIndex + 1];
			}
		};

		$scope.previous = function() {
			var cIndex = lookFor(views.current, views);

			if (cIndex > 0) {
				views.current = views[cIndex - 1];
			}
		};

		$scope.ok = function() {
			$scope.disabled = true;
			$http.post('/api/v1/people', p).then(function() {
				$scope.disabled = false;
				$scope.views.current = finishView;
			}, function() {
				$scope.disabled = false;
				alert('Une erreur est survenu. Merci de réessayer.');
			});
		};
	}]);

	app.directive('messages', function() {
		return {
			templateUrl: 'views/messages.html',
			restrict: 'E',
			replace: true,
			scope: {
				items: '='
			}
		};
	});
})(angular.module('a', ['ngAnimate', 'daterangepicker']))