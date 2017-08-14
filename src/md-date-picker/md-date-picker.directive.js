(function () {

  const template = `
    <md-menu md-offset="0 -6px">
      <div class="md-date-picker__input-container" role="button" ng-click="openMenuHandler($mdMenu, $event)" layout>
        <input
          flex
          flex-order="2"
          type="text"
          ng-value="model ? (model | date : format) : null"
          ng-disabled="ngDisabled"
          ng-required="ngRequired"
          ng-focus="openOnFocus ? openMenuHandler($mdMenu, $event) : null"
          ng-keypress="keypressMenuHandler($mdMenu, $event)"
          ng-keydown="keydownMenuHandler($mdMenu, $event)"
        />
        <md-icon flex-order="5" ng-if="showIcon" style="display:inline-block;" aria-label="md-calendar" md-svg-src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3eiIvPjwvc3ZnPg==" role="img"></md-icon>
      </div>
      <md-menu-content class="md-date-picker__md-menu-content">
        <div class="md-date-picker__calendar-container">
          <div layout class="md-date-picker__calendar-header">
            <span flex ng-bind="model ? (model | date : format) : placeholder"></span>
            <button md-prevent-menu-close ng-click="changeMonthHandler(-1)">&lt;</button>
            <span class="md-date-picker__calendar-month-name" ng-bind="months[month]"></span>
            <span class="md-date-picker__calendar-month-name" ng-bind="year"></span>
            <button md-prevent-menu-close ng-click="changeMonthHandler(1)">&gt;</button>
          </div>
          <div class="md-date-picker__calendar-names">
            <span ng-repeat="(k,v) in days" ng-bind="::v"></span>
          </div>
          <div class="md-date-picker__calendar" ng-class="{
            'md-date-picker__calendar-current-month-only': currentMonthViewDatesOnly,
            'md-date-picker__calendar-loading': loading === true,
          }">
            <button 
              ng-repeat="d in dates" 
              ng-disabled="dateFilter(d.object) === false"
              ng-class="{
                'md-date-picker__calendar-date-selected' : date === d.date,
                'md-date-picker__calendar-month-day' : month === d.month,
                'md-date-picker__calendar-today': TODAY === d.date,
              }" 
              title="{{dateClass[d.date].title}}"
              ng-click="selectDateHandler(d)"
            ><span ng-bind="::d.day" ng-class="dateClass[d.date].class || dateClass[d.date]"></span></button> 
            <div class="md-date-picker__calendar-loading-overlay" ng-if="loading === true">
              <md-progress-linear md-mode="query"></md-progress-linear>
            </div>
          </div>
        </div>
      </md-menu-content>
    </md-menu>
  `;

  /* @ngInject */
  function controller($scope, $filter, $element, $mdMenu) {
    const date = new Date();
    const dateFilter = $filter('date');

    // Set deault view to current date, this model use as current calendar month view
    $scope.month = date.getMonth();

    // This model use as current calendar year view
    $scope.year = date.getFullYear();

    // const: Today local date string as reference of current date, should not change
    $scope.TODAY = date.toLocaleDateString();

    // handlers

    // Open menu handler
    $scope.openMenuHandler = (menu, e) => {
      if ($scope.ngDisabled) return e.preventDefault();
      menu.open(e);
    }

    $scope.selectDateHandler = (date) => {
      this.onChange({ $date: date ? date.object : null });
    }

    $scope.keypressMenuHandler = (menu, e) => e.which === 13 && menu.open(e);
    $scope.keydownMenuHandler = (menu, e) => {
      [9, 27].includes(e.which) && menu.close(e);
      [46, 8].includes(e.which) && this.onChange({ $date: null });
      [90].includes(e.which) && e.ctrlKey && e.preventDefault();
    }

    $scope.rebuildCalendar = () => {
      $scope.dates = buildCalendar($scope.month, $scope.year);
      this.onRender({ $month: $scope.month, $year: $scope.year, $dates: $scope.dates });
    }

    // On change month(prev/next) button click
    $scope.changeMonthHandler = (month) => {
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
    }

    // models

    // Placeholder
    $scope.format = 'shortDate';

    // events on changes one way bindings
    this.$onInit = () => {
      $element.find('input').on('keypress paste', (e) => e.preventDefault());
      // Get days of week names using angular date filter `EEE`
      $scope.days = buildDayNames(dateFilter);
      // Get month names using angular date filter `MMM`
      $scope.months = buildMonthNames(dateFilter);
      // Build dates on current calendar view
      $scope.rebuildCalendar();
    }

    this.$onChanges = (c) => {
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
        const date = c.ngModel.currentValue;
        $scope.model = date;
        if (date) {
          const shouldRender = $scope.month !== date.getMonth() || $scope.year !== date.getFullYear();
          $scope.month = date.getMonth();
          $scope.year = date.getFullYear();
          $scope.date = date.toLocaleDateString();
          shouldRender && $scope.rebuildCalendar();
        }
      }
    }

    // Utils
  }

  function buildCalendar(month, year) {
    const date = new Date(year, month, 1);
    const firstDay = date.getDay();
    const dates = [];
    let ctr = 0; // are you sure you will not go infinite? 
    date.setDate(date.getDate() - firstDay);
    while (
      (
        (
          date.getMonth() <= month
          &&
          date.getFullYear() === year
        )
        ||
        (
          date.getMonth() === 11
          &&
          date.getFullYear() < year
        )
      )
      ||
      (
        date.getMonth() > month
        ||
        (
          date.getMonth() === 0
          &&
          date.getFullYear() === year + 1
        )
      )
      &&
      date.getDay() !== 0
    ) {
      dates.push({
        object: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
        date: date.toLocaleDateString(),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
      date.setDate(date.getDate() + 1);
      ctr += 1;
      if (ctr > 42) break; // You shall not pass
    }
    return dates;
  }

  function buildDayNames(dateFilter) {
    const w = new Date(2017, 0, 1); // Use year 2017 100% January 1 is Sunday
    let days = {};
    for (let i = 0; i < 7; i++) {
      w.setDate(i + 1);
      days = {
        [i]: dateFilter(w, 'EEE'),
        ...days,
      };
    }
    return days;
  }

  function buildMonthNames(dateFilter) {
    const m = new Date();
    let months = {};
    for (let i = 0; i < 12; i++) {
      m.setMonth(i);
      months = {
        [i]: dateFilter(m, 'MMM'),
        ...months,
      };
    }
    return months;
  }

  const component = {
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
      onRender: '&',
    },
    template,
    controller,
  }

  angular
    .module('md-date-picker')
    .component('mdDatePicker', component);
}())