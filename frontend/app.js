var app = angular.module('orderTool', []);

app.factory('orders', [function(){
	var o = {
		orders : []
	};
	return o;
}]);

const connectionString = 'http://localhost:3000';

app.controller('MainCtrl', [
	'$scope',
	'$http',
	'orders',
	function($scope, $http, orders){

	  $scope.addOrder = function(){
	  	if(!$scope.selectedFood || $scope.selectedFood === '') { return; }
	  	if(!$scope.title || $scope.title === '') { return; }

	  	console.log($scope.selectedFood);
	  	var sentData = {
	  		name: $scope.title, 
	  		foodType : $scope.selectedFood.name, 
	  		hasSalad : $scope.hasSalad, 
	  		hasDrink : $scope.hasDrink
	  	};

	  	$http.post(connectionString + '/users/createOrder', sentData)
	  		.then(function(response){
	  			orders.orders.push(response.data);
	  		});

	  	$scope.title = '';
	  }

	  var initSearch = function(){
	  	$http.get(connectionString + '/users/foodTypes')
	  		.success(function (data, status, headers, config) {
                $scope.foodTypes = data;
            }).error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<br />status: " + status +
                    "<br />headers: " + header +
                    "<br />config: " + config;
            });
        orders.orders = [];
        $http.get(connectionString + '/users/getOrders')
	  		.success(function (data, status, headers, config) {
	  			for (var i in data) {
	  				orders.orders.push(data[i]);
	  			}
            }).error(function (data, status, header, config) {
                $scope.ResponseDetails = "Data: " + data +
                    "<br />status: " + status +
                    "<br />headers: " + header +
                    "<br />config: " + config;
            });
	  }

	  initSearch();

	  $scope.orders = orders.orders;

}]);