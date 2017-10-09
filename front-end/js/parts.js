app.controller('partsCtrl', function ($http, $routeParams) {
    console.log($routeParams.carId);
    console.log($routeParams.shopId);
    var vm = this;
    vm.parts = [];
    vm.currentPart = {};
    vm.currentView = 'table';
    vm.refresh = function () {
        $http.get('/cars/' + $routeParams.shopId + '/parts/' + $routeParams.carId).then(resp => {
            vm.parts = resp.data;
            console.log(vm.parts)
        });
    };
    vm.refresh();
    vm.add = function () {
        vm.currentView = 'form';
    };
    vm.cancel = function () {
        vm.currentPart = {};
        vm.currentView = 'table';
    };
    vm.update = function (part) {
        vm.currentPart = part;
        vm.add();
    }
    vm.save = function () {
        if (vm.currentPart._id) {
            $http.put('/parts/' + vm.currentPart._id, vm.currentPart).then(() => {
                vm.refresh();
                vm.cancel();
            })
        } else {
            vm.currentPart.carId = $routeParams.carId;
            vm.currentPart.shopId = $routeParams.shopId;

            $http.post('/parts', vm.currentPart).then(() => {
                vm.cancel();
                vm.refresh();
            });
        }
    };
    vm.delete = function (id) {
        $http.delete('/parts/' + id).then(vm.refresh);
    }
});
