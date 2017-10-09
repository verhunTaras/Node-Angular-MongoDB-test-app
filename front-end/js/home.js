app.controller('homeCtrl', function ($http, $location) {

    var vm = this;
    vm.shops = [];
    vm.currentShop = {};
    vm.currentView = 'table';
    vm.refresh = function () {
        $http.get('/shops').then(resp => vm.shops = resp.data)
    };
    vm.refresh();
    vm.add = function () {
        vm.currentView = 'form';
    };
    vm.cancel = function () {
        vm.currentShop = {};
        vm.currentView = 'table';
    };
    vm.update = function (shop) {
        vm.currentShop = shop;
        vm.add();
    }
    vm.save = function () {
        if (vm.currentShop._id) {
            $http.put('/shops/' + vm.currentShop._id, vm.currentShop).then(() => {
                vm.refresh();
                vm.cancel();
            })
        } else {
            $http.post('/shops', vm.currentShop).then(() => {
                vm.cancel();
                vm.refresh();
            });
        }
    };
    vm.delete = function (id) {
        $http.delete('/shops/' + id).then(vm.refresh);
    }
    vm.move = function (id) {
        $location.url('/cars/' + id);
        
    }
});
