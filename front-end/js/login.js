app.controller('loginCtrl', function($http, $location){
    var vm = this;
    vm.message = '';
    vm.user = {};
    vm.login = function(){
        $http.post('/login', vm.user).then(
            ()=>$location.url('/'),
            (err)=>vm.message="Failed to authorize"
        );
    }
});