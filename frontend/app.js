var app = angular.module('orderTool', []);

app.factory('orders', [function(){
	var o = {
		orders : []
	};
	return o;
}]);

app.factory('users', [function(){
	var u = {
		users : []
	};
	return u;
}])

const connectionString = 'http://localhost:3000';

app.controller('MainCtrl', [
	'$scope',
	'$http',
	'$window',
	'orders',
	function($scope, $http, $window, orders){

	  $scope.addOrder = function(){
	  	if(!$scope.selectedFood || $scope.selectedFood === '') { return; }
	  	if(!$scope.title || $scope.title === '') { return; }
	  	if(!$scope.currentuser) {return; }
	  	if(!$scope.orderQuant) {return; }

	  	console.log($scope.selectedFood);
	  	var sentData = {
	  		user: $scope.currentuser,
	  		name: $scope.title, 
	  		foodType : $scope.selectedFood.name, 
	  		hasSalad : $scope.hasSalad, 
	  		hasDrink : $scope.hasDrink,
	  		qty : $scope.orderQuant
	  	};

	  	$http.post(connectionString + '/users/createOrder', sentData)
	  		.then(function(response){
	  			orders.orders.push(response.data);
	  		});

	  	$scope.title = '';
	  }

	  $scope.deleteOrder = function(order){
	  	var sentData = {
	  		order_id : order._id,
	  		basket_id : $scope.currentuser.basket._id
	  	}
	  	console.log(sentData);
	  	$http.post(connectionString + '/users/deleteOrder', sentData)
	  		.then(function(response){
	  			orders.orders = orders.orders.filter(item => item._id != sentData.order_id);
	  			$scope.orders = orders.orders;
	  		});
	 	 }

	  $scope.changeUser = function(){
	  	if (!$scope.selectedUser) {return; }

	 	const user =  $http.get(connectionString + '/users/siteUsersGet/' + $scope.selectedUser._id)
			.success(function (data, status, headers, config) {
				$scope.currentuser = data;
				const basket = $http.get(connectionString + '/users/siteUsersOrder/' + $scope.currentuser.basket._id)
					.success(function (data, status, headers, config) {
					  	orders.orders = [];
					  	for (var i in data){
					  		orders.orders.push(data[i]);
					  	}
					  	$scope.orders = orders.orders;
					}).error(function (data, status, header, config) {
						$scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + header + "<br />config: " + config;
					});
			}).error(function (data, status, header, config) {
			$scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + header + "<br />config: " + config;
		});

	  }


	  $scope.makePurchase = function(){
	  	if (orders.orders.length == 0) {
	  		$scope.FundDetails = "No orders.";
	  		return;
	  	}
	  	if(!$scope.currentuser) {return; }
	  	const purchase = $http.post(connectionString + '/users/makePurchase', {id : $scope.currentuser._id})
					.success(function (data, status, headers, config) {
					  	$window.location.reload();
					}).error(function (data, status, header, config) {
						$scope.ResponseDetails = data;
					});
	  }

	  var initSearch = function(){
        $http.get(connectionString + '/users/foodTypes')
			.success(function (data, status, headers, config) {
				$scope.foodTypes = data;
			}).error(function (data, status, header, config) {
			$scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + header + "<br />config: " + config;
		});

        $http.get(connectionString + '/users/siteUsers')
			.success(function (data, status, headers, config) {
				$scope.users = data;
			}).error(function (data, status, header, config) {
			$scope.ResponseDetails = "Data: " + data + "<br />status: " + status + "<br />headers: " + header + "<br />config: " + config;
		});
	  }

	  initSearch();

	  $scope.orders = orders.orders;

}]);