"use strict";
// angular directive
angular.module('IncludeDirectives', [])
    // static-include
    .directive('staticInclude', function () {
    return {
        restrict: 'AE',
        templateUrl: function (element, attrs) {
            return attrs.templatePath;
        }
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY3MvYXNzZXRzL2pzL2RpcmVjdGl2ZS5pbmNsdWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFDcEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUM7SUFDckMsaUJBQWlCO0tBQ2hCLFNBQVMsQ0FBQyxlQUFlLEVBQUU7SUFDMUIsT0FBTztRQUNMLFFBQVEsRUFBRSxJQUFJO1FBQ2QsV0FBVyxFQUFFLFVBQUMsT0FBTyxFQUFFLEtBQUs7WUFDMUIsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQzVCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZG9jcy9hc3NldHMvanMvZGlyZWN0aXZlLmluY2x1ZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhbmd1bGFyIGRpcmVjdGl2ZVxuYW5ndWxhci5tb2R1bGUoJ0luY2x1ZGVEaXJlY3RpdmVzJywgW10pXG4gIC8vIHN0YXRpYy1pbmNsdWRlXG4gIC5kaXJlY3RpdmUoJ3N0YXRpY0luY2x1ZGUnLCAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgdGVtcGxhdGVVcmw6IChlbGVtZW50LCBhdHRycykgPT4ge1xuICAgICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVQYXRoO1xuICAgICAgfSxcbiAgICB9O1xuICB9KTtcbiJdfQ==
