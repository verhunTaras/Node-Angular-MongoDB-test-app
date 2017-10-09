var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/home.html',
            controller: 'homeCtrl',
            controllerAs: 'ctrl'
        })
//        .when('/cars', {
//            templateUrl: '/templates/cars.html',
//            controller: 'carsCtrl',
//            controllerAs: 'ctrl'
//        })
        .when('/cars/:shopId', {
            templateUrl: '/templates/cars.html',
            controller: 'carsCtrl',
            controllerAs: 'ctrl'
        })
        .when('/cars/:shopId/parts/:carId', {
            templateUrl: '/templates/parts.html',
            controller: 'partsCtrl',
            controllerAs: 'ctrl'
        })
        .when('/registration', {
        templateUrl:'/templates/registration.html',
        controller:'registrationCtrl',
        controllerAs:'ctrl'
        })
        .when('/login', {
        templateUrl:'/templates/login.html',
        controller:'loginCtrl',
        controllerAs:'ctrl'
    });
    //        $locationProvider.html5Mode(true);
});
app.controller('mainCtrl', function ($location) {
    var vm = this;
    vm.urls = {
        home: 'nav-item active',
        cars: 'nav-item',
        parts: 'nav-item',
        registration: 'nav-item',
        login: 'nav-item'
        
    };
    vm.changeActive = function (name) {
        for (var key in vm.urls) {
            vm.urls[key] = 'nav-item';
        }
        vm.urls[name] = 'nav-item active';
    }
    if ($location.url() != '/') {
        vm.changeActive($location.url().substring(1));
    }
});

app.filter('search', function () {
    return function (input, search) {
        if (!search) return input;
        search = search.toUpperCase()
        var filtered = [];
        for (var i = 0; i < input.length; i++) {
            var finded = false;
            for (var key in input[i]) {
                if (key != 'id' && (input[i][key] + '').toUpperCase().indexOf(search) > -1) {
                    finded = true;
                }
            }
            if (finded) filtered.push(input[i]);
        }
        return filtered;
    }
});

app.filter('UAH', function () {
    return function (input) {
        return input + ' UAH';
    }
});

app.filter('yearsOld', function () {
    return function (input) {
        return input + ' years old';
    }
});
