app.controller('registrationCtrl', function($http, $location){
    var vm = this;
    vm.user = {};
    vm.registration = function(){
        $http.post('/registration', vm.user).then(
            ()=>{
                $location.url('/login');
                console.log('Ok');
            },
            (err)=>console.log(err)
        );
    }
});