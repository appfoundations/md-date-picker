;(function(angular, window) {
'use strict';

/*
* 
*/
(function () {
    angular.module('md-date-picker', []);
})();
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {

  controller.$inject = ["$scope", "$filter", "$element", "$mdMenu"];
  var template = '\n    <md-menu md-offset="0 -6px">\n      <div class="md-date-picker__input-container" role="button" ng-click="openMenuHandler($mdMenu, $event)" layout>\n        <input\n          flex\n          flex-order="2"\n          type="text"\n          ng-value="model ? (model | date : format) : null"\n          ng-disabled="ngDisabled"\n          ng-required="ngRequired"\n          ng-focus="openOnFocus ? openMenuHandler($mdMenu, $event) : null"\n          ng-keypress="keypressMenuHandler($mdMenu, $event)"\n          ng-keydown="keydownMenuHandler($mdMenu, $event)"\n        />\n        <md-icon flex-order="5" ng-if="showIcon" style="display:inline-block;" aria-label="md-calendar" md-svg-src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3eiIvPjwvc3ZnPg==" role="img"></md-icon>\n      </div>\n      <md-menu-content class="md-date-picker__md-menu-content">\n        <div class="md-date-picker__calendar-container">\n          <div layout class="md-date-picker__calendar-header">\n            <span flex ng-bind="model ? (model | date : format) : placeholder"></span>\n            <button md-prevent-menu-close ng-click="changeMonthHandler(-1)">&lt;</button>\n            <span class="md-date-picker__calendar-month-name" ng-bind="months[month]"></span>\n            <span class="md-date-picker__calendar-month-name" ng-bind="year"></span>\n            <button md-prevent-menu-close ng-click="changeMonthHandler(1)">&gt;</button>\n          </div>\n          <div class="md-date-picker__calendar-names">\n            <span ng-repeat="(k,v) in days" ng-bind="::v"></span>\n          </div>\n          <div class="md-date-picker__calendar" ng-class="{\n            \'md-date-picker__calendar-current-month-only\': currentMonthViewDatesOnly,\n            \'md-date-picker__calendar-loading\': loading === true,\n          }">\n            <button \n              ng-repeat="d in dates" \n              ng-disabled="dateFilter(d.object) === false"\n              ng-class="{\n                \'md-date-picker__calendar-date-selected\' : date === d.date,\n                \'md-date-picker__calendar-month-day\' : month === d.month,\n                \'md-date-picker__calendar-today\': TODAY === d.date,\n              }" \n              title="{{dateClass[d.date].title}}"\n              ng-click="selectDateHandler(d)"\n            ><span ng-bind="::d.day" ng-class="dateClass[d.date].class || dateClass[d.date]"></span></button> \n            <div class="md-date-picker__calendar-loading-overlay" ng-if="loading === true">\n              <md-progress-linear md-mode="query"></md-progress-linear>\n            </div>\n          </div>\n        </div>\n      </md-menu-content>\n    </md-menu>\n  ';

  /* @ngInject */
  function controller($scope, $filter, $element, $mdMenu) {
    var _this = this;

    var date = new Date();
    var dateFilter = $filter('date');

    // Set deault view to current date, this model use as current calendar month view
    $scope.month = date.getMonth();

    // This model use as current calendar year view
    $scope.year = date.getFullYear();

    // const: Today local date string as reference of current date, should not change
    $scope.TODAY = date.toLocaleDateString();

    // handlers

    // Open menu handler
    $scope.openMenuHandler = function (menu, e) {
      if ($scope.ngDisabled) return e.preventDefault();
      menu.open(e);
    };

    $scope.selectDateHandler = function (date) {
      _this.onChange({ $date: date ? date.object : null });
    };

    $scope.keypressMenuHandler = function (menu, e) {
      return e.which === 13 && menu.open(e);
    };
    $scope.keydownMenuHandler = function (menu, e) {
      [9, 27].includes(e.which) && menu.close(e);
      [46, 8].includes(e.which) && _this.onChange({ $date: null });
      [90].includes(e.which) && e.ctrlKey && e.preventDefault();
    };

    $scope.rebuildCalendar = function () {
      $scope.dates = buildCalendar($scope.month, $scope.year);
      _this.onRender({ $month: $scope.month, $year: $scope.year, $dates: $scope.dates });
    };

    // On change month(prev/next) button click
    $scope.changeMonthHandler = function (month) {
      if (month > 0) {
        if ($scope.month + month > 11) {
          $scope.year += 1;
        }
        $scope.month = ($scope.month + month) % 12;
      } else {
        if ($scope.month + month < 0) {
          $scope.year -= 1;
        }
        $scope.month = ($scope.month + 12 + month) % 12;
      }
      $scope.rebuildCalendar();
    };

    // models

    // Placeholder
    $scope.format = 'shortDate';

    // events on changes one way bindings
    this.$onInit = function () {
      $element.find('input').on('keypress paste', function (e) {
        return e.preventDefault();
      });
      // Get days of week names using angular date filter `EEE`
      $scope.days = buildDayNames(dateFilter);
      // Get month names using angular date filter `MMM`
      $scope.months = buildMonthNames(dateFilter);
      // Build dates on current calendar view
      $scope.rebuildCalendar();
    };

    this.$onChanges = function (c) {
      if (c.currentMonthViewDatesOnly) $scope.currentMonthViewDatesOnly = c.currentMonthViewDatesOnly.currentValue;
      if (c.placeholder) $element.find('input').attr('placeholder', c.placeholder.currentValue);
      if (c.format) $scope.format = c.format.currentValue || 'shortDate';
      if (c.dateFilter) $scope.dateFilter = c.dateFilter.currentValue || angular.noop;
      if (c.loading) $scope.loading = c.loading.currentValue;
      if (c.dateClass) $scope.dateClass = c.dateClass.currentValue || {};
      if (c.showIcon) $scope.showIcon = c.showIcon.currentValue || false;
      if (c.openOnFocus) $scope.openOnFocus = c.openOnFocus.currentValue || false;
      if (c.ngDisabled) $scope.ngDisabled = c.ngDisabled.currentValue || false;
      if (c.ngRequired) $scope.ngRequired = c.ngRequired.currentValue || false;
      if (c.ngModel) {
        var _date = c.ngModel.currentValue;
        $scope.model = _date;
        if (_date) {
          var shouldRender = $scope.month !== _date.getMonth() || $scope.year !== _date.getFullYear();
          $scope.month = _date.getMonth();
          $scope.year = _date.getFullYear();
          $scope.date = _date.toLocaleDateString();
          shouldRender && $scope.rebuildCalendar();
        }
      }
    };

    // Utils
  }

  function buildCalendar(month, year) {
    var date = new Date(year, month, 1);
    var firstDay = date.getDay();
    var dates = [];
    var ctr = 0; // are you sure you will not go infinite? 
    date.setDate(date.getDate() - firstDay);
    while (date.getMonth() <= month && date.getFullYear() === year || date.getMonth() === 11 && date.getFullYear() < year || (date.getMonth() > month || date.getMonth() === 0 && date.getFullYear() === year + 1) && date.getDay() !== 0) {
      dates.push({
        object: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
        date: date.toLocaleDateString(),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
      date.setDate(date.getDate() + 1);
      ctr += 1;
      if (ctr > 42) break; // You shall not pass
    }
    return dates;
  }

  function buildDayNames(dateFilter) {
    var w = new Date(2017, 0, 1); // Use year 2017 100% January 1 is Sunday
    var days = {};
    for (var i = 0; i < 7; i++) {
      w.setDate(i + 1);
      days = _extends(_defineProperty({}, i, dateFilter(w, 'EEE')), days);
    }
    return days;
  }

  function buildMonthNames(dateFilter) {
    var m = new Date();
    var months = {};
    for (var i = 0; i < 12; i++) {
      m.setMonth(i);
      months = _extends(_defineProperty({}, i, dateFilter(m, 'MMM')), months);
    }
    return months;
  }

  var component = {
    bindings: {
      ngModel: '<',
      ngDisabled: '<',
      ngRequired: '<',
      openOnFocus: '<',
      showIcon: '<',
      format: '@',
      placeholder: '@',
      loading: '<',
      dateFilter: '<',
      dateClass: '<',
      currentMonthViewDatesOnly: '@',
      onChange: '&',
      onRender: '&'
    },
    template: template,
    controller: controller
  };

  angular.module('md-date-picker').component('mdDatePicker', component);
})();
})(angular, window);