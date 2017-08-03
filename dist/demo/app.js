var app = angular.module('app', ['ngMaterial', 'md-date-picker']);

app.controller('MainCtrl', function ($scope, $q, $timeout) {
  $scope.date = new Date();
  $scope.custom = new Date(2017, 6, 5);
  $scope.text = 'This is text';
  $scope.isFutureDate = function (d) {
    return d.getTime() > Date.now();
  }
  $scope.isWeekDays = function (d) {
    return [0, 6].indexOf(d.getDay()) == -1;
  }
  $scope.onRenderDatePicker = function ($month, $year) {
    $scope.loading = true;
    console.log('loading...');
    $scope.specialDaysClass = {};


    $timeout(function () {
      const date = new Date($year, $month);
      // Color all weekend Sat = blue, Sun = red
      while (date.getMonth() === $month) {
        if (date.getDay() === 6) {
          // We use toLocaleDateString as key
          $scope.specialDaysClass[date.toLocaleDateString()] = 'blue-day';
        }
        // Sundays
        if (date.getDay() === 0) $scope.specialDaysClass[date.toLocaleDateString()] = 'red-day';
        // New year
        if (date.getMonth() === 0 && date.getDate() === 1) $scope.specialDaysClass[date.toLocaleDateString()] = {
          class: 'red-day',
          title: 'New Year',
        };
        // All Birthday
        if (date.getMonth() === 4 && date.getDate() === 1) $scope.specialDaysClass[date.toLocaleDateString()] =  {
          class: 'red-day',
          title: 'Labor Day',
        };
        // All Birthday
        if (date.getMonth() === 8 && date.getDate() === 22) $scope.specialDaysClass[date.toLocaleDateString()] =  {
          class: 'red-day',
          title: 'Birth Day',
        };
        // All Holloween
        if (date.getMonth() === 9 && date.getDate() === 31) $scope.specialDaysClass[date.toLocaleDateString()] = {
          class: 'red-day',
          title: 'Holloween',
        };
        // All Souls Day
        if (date.getMonth() === 10 && date.getDate() === 1) $scope.specialDaysClass[date.toLocaleDateString()] =  {
          class: 'red-day',
          title: 'All Souls Day',
        };
        // Xmass
        if (date.getMonth() === 11 && date.getDate() === 25) $scope.specialDaysClass[date.toLocaleDateString()] ={
          class: 'red-day',
          title: 'Xmass Day',
        };
        date.setDate(date.getDate() + 1);
      }
      console.log($scope.specialDaysClass);
      $scope.loading = false;
      console.log('loading done after 1000ms');
    }, 1000)
  }
});
