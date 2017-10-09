app.controller('carsCtrl', function ($http, $routeParams, $location) {
//    console.log($routeParams.shopid)
    var vm = this;
    vm.cars = [];
    vm.currentCar = {};
    vm.currentView = 'table';
    vm.refresh = function () {
        $http.get('/cars/'+$routeParams.shopId).then(resp => vm.cars = resp.data)
    };
    vm.refresh();
    vm.add = function () {
        vm.currentView = 'form';
    };
    vm.cancel = function () {
        vm.currentCar = {};
        vm.currentView = 'table';
    };
    vm.t=10;
    vm.update = function (car) {
        vm.currentCar = car;
        vm.add();
    }
    vm.save = function () {
        if (vm.currentCar._id) {
            $http.put('/cars/' + vm.currentCar._id, vm.currentCar).then(() => {
                vm.refresh();
                vm.cancel();
            })
        } else {
            vm.currentCar.shopId=$routeParams.shopId;
            $http.post('/cars', vm.currentCar).then(() => {
                vm.cancel();
                vm.refresh();
            });
        }
    };
    vm.delete = function (id,) {
        $http.delete('/cars/' + id).then(vm.refresh);
    };
    vm.move = function (shopId, carId) {
        $location.url('/cars/' + shopId+ '/parts/' + carId);
        
    }
});
