"use strict";
//var remote = require('electron').remote;
//var app = require('electron').remote.app;
//var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
//var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
//var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
//
//var homeDir = app.getPath('home');
//
//// env
//var DEBUG = process.env.DEBUG != null;
//
//// source-map-support
//if (DEBUG) {
//  try {
//    require('source-map-support').install();
//  } catch(e) {
//    log().error('source-map-support or devtron is not installed.');
//  }
//}
// help app
angular.module('helpApp', ['IncludeDirectives'])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    //.factory('$exceptionHandler', () => {
    //  return (exception, cause) => {
    //    log().warn('help:catch angularjs exception: %s, cause:%s', exception, cause);
    //  };
    //})
    .controller('HelpController', ['$scope', '$timeout', '$location', '$window',
    function ($scope, $timeout, $location, $window) {
        var menuList = [
            'about',
            'voicecode',
            'trouble',
            'update',
            'uninstall',
            'backup',
            'license',
            'contact',
            'funclist',
            'play',
            'tuna',
            'writing',
            'dataconfig',
            'dragout',
            'multivoice',
            'dictionary',
            'history',
            'shortcut',
            'help',
            'expand',
        ];
        // init
        var ctrl = this;
        $scope.$location = $location;
        $scope.searchVisibled = false;
        $scope.searchText = '';
        // event url hash changed
        $scope.$on('$locationChangeSuccess', function (event) {
            // fix broken url
            if ($location.url().startsWith('/%23')) {
                $window.location.href = $location.absUrl().replace('%23', '#');
                return;
            }
            var hash = $location.hash();
            if (menuList.includes(hash)) {
                $scope.display = hash;
            }
            else {
                $scope.display = 'about';
            }
            $timeout(function () { $scope.$apply(); });
        });
        //// shortcut
        //ipcRenderer().on('shortcut', (event, action) => {
        //  switch (action) {
        //    case 'moveToPreviousHelp':
        //      moveToPreviousHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'moveToNextHelp':
        //      moveToNextHelp();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'openSearchForm':
        //      ctrl.openSearchForm();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //    case 'closeSearchForm':
        //      ctrl.closeSearchForm();
        //      $timeout(() => { $scope.$apply(); });
        //      break;
        //  }
        //});
        //function moveToPreviousHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index - 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved < 0) {
        //    $location.hash(menuList[menuList.length - 1]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        //function moveToNextHelp(): void {
        //  const index = menuList.indexOf($scope.display);
        //  const moved = index + 1;
        //  if (index < 0) {
        //    $location.hash(menuList[0]);
        //  } else if (moved >= menuList.length) {
        //    $location.hash(menuList[0]);
        //  } else {
        //    $location.hash(menuList[moved]);
        //  }
        //}
        // action
        //ctrl.searchInPage = function(): void {
        //  if ($scope.searchText) {
        //    remote.getCurrentWebContents().findInPage($scope.searchText);
        //  } else {
        //    remote.getCurrentWebContents().stopFindInPage('clearSelection');
        //  }
        //};
        //ctrl.searchInHelp = function(): void {
        //  if ($scope.searchText) {
        //    $location.hash('expand');
        //    remote.getCurrentWebContents().findInPage($scope.searchText);
        //  } else {
        //    remote.getCurrentWebContents().stopFindInPage('clearSelection');
        //  }
        //};
        //ctrl.openSearchForm = function(): void {
        //  $scope.searchVisibled = !$scope.searchVisibled;
        //  if ($scope.searchVisibled) {
        //    $timeout(() => {
        //      $scope.$apply();
        //      document.getElementById('search-text').focus();
        //    });
        //  } else {
        //    $scope.searchText = '';
        //    remote.getCurrentWebContents().stopFindInPage('clearSelection');
        //  }
        //};
        //ctrl.closeSearchForm = function(): void {
        //  $scope.searchVisibled = false;
        //  $scope.searchText = '';
        //  remote.getCurrentWebContents().stopFindInPage('clearSelection');
        //};
        ctrl.browser = function (url) {
            //shell().openExternal(url);
            $window.open(url);
        };
        ctrl.showItemInFolder = function (path) {
            //const expanded = path.replace('$HOME', homeDir);
            //shell().showItemInFolder(expanded);
        };
        ctrl.showSystemWindow = function () {
            //ipcRenderer().send('showSystemWindow', 'system');
        };
    }]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY3MvYXNzZXRzL2pzL2FwcHMuaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTBDO0FBQzFDLDJDQUEyQztBQUMzQyxpSUFBaUk7QUFDakkseUdBQXlHO0FBQ3pHLGlHQUFpRztBQUNqRyxFQUFFO0FBQ0Ysb0NBQW9DO0FBQ3BDLEVBQUU7QUFDRixRQUFRO0FBQ1Isd0NBQXdDO0FBQ3hDLEVBQUU7QUFDRix1QkFBdUI7QUFDdkIsY0FBYztBQUNkLFNBQVM7QUFDVCw4Q0FBOEM7QUFDOUMsZ0JBQWdCO0FBQ2hCLHFFQUFxRTtBQUNyRSxLQUFLO0FBQ0wsR0FBRztBQUNILFdBQVc7QUFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDN0MsTUFBTSxDQUFDLENBQUMsWUFBWSxFQUFFLFVBQUMsVUFBVTtRQUNoQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDSCx1Q0FBdUM7SUFDdkMsa0NBQWtDO0lBQ2xDLG1GQUFtRjtJQUNuRixNQUFNO0lBQ04sSUFBSTtLQUNILFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVM7SUFDM0UsVUFBUyxNQUF1QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUU1RCxJQUFNLFFBQVEsR0FBRztZQUNmLE9BQU87WUFDUCxXQUFXO1lBQ1gsU0FBUztZQUNULFFBQVE7WUFDUixXQUFXO1lBQ1gsUUFBUTtZQUNSLFNBQVM7WUFDVCxTQUFTO1lBQ1QsVUFBVTtZQUNWLE1BQU07WUFDTixNQUFNO1lBQ04sU0FBUztZQUNULFlBQVk7WUFDWixTQUFTO1lBQ1QsWUFBWTtZQUNaLFlBQVk7WUFDWixTQUFTO1lBQ1QsVUFBVTtZQUNWLE1BQU07WUFDTixRQUFRO1NBQ1QsQ0FBQztRQUVGLE9BQU87UUFDUCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDOUIsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFdkIseUJBQXlCO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsVUFBQyxLQUFLO1lBQ3pDLGlCQUFpQjtZQUNqQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMvRCxPQUFPO2FBQ1I7WUFFRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUN2QjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzthQUMxQjtZQUNELFFBQVEsQ0FBQyxjQUFRLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNiLG1EQUFtRDtRQUNuRCxxQkFBcUI7UUFDckIsZ0NBQWdDO1FBQ2hDLDZCQUE2QjtRQUM3Qiw2Q0FBNkM7UUFDN0MsY0FBYztRQUNkLDRCQUE0QjtRQUM1Qix5QkFBeUI7UUFDekIsNkNBQTZDO1FBQzdDLGNBQWM7UUFDZCw0QkFBNEI7UUFDNUIsOEJBQThCO1FBQzlCLDZDQUE2QztRQUM3QyxjQUFjO1FBQ2QsNkJBQTZCO1FBQzdCLCtCQUErQjtRQUMvQiw2Q0FBNkM7UUFDN0MsY0FBYztRQUNkLEtBQUs7UUFDTCxLQUFLO1FBQ0wsdUNBQXVDO1FBQ3ZDLG1EQUFtRDtRQUNuRCw0QkFBNEI7UUFDNUIsb0JBQW9CO1FBQ3BCLGtDQUFrQztRQUNsQywyQkFBMkI7UUFDM0Isb0RBQW9EO1FBQ3BELFlBQVk7UUFDWixzQ0FBc0M7UUFDdEMsS0FBSztRQUNMLEdBQUc7UUFDSCxtQ0FBbUM7UUFDbkMsbURBQW1EO1FBQ25ELDRCQUE0QjtRQUM1QixvQkFBb0I7UUFDcEIsa0NBQWtDO1FBQ2xDLDBDQUEwQztRQUMxQyxrQ0FBa0M7UUFDbEMsWUFBWTtRQUNaLHNDQUFzQztRQUN0QyxLQUFLO1FBQ0wsR0FBRztRQUVILFNBQVM7UUFDVCx3Q0FBd0M7UUFDeEMsNEJBQTRCO1FBQzVCLG1FQUFtRTtRQUNuRSxZQUFZO1FBQ1osc0VBQXNFO1FBQ3RFLEtBQUs7UUFDTCxJQUFJO1FBQ0osd0NBQXdDO1FBQ3hDLDRCQUE0QjtRQUM1QiwrQkFBK0I7UUFDL0IsbUVBQW1FO1FBQ25FLFlBQVk7UUFDWixzRUFBc0U7UUFDdEUsS0FBSztRQUNMLElBQUk7UUFDSiwwQ0FBMEM7UUFDMUMsbURBQW1EO1FBQ25ELGdDQUFnQztRQUNoQyxzQkFBc0I7UUFDdEIsd0JBQXdCO1FBQ3hCLHVEQUF1RDtRQUN2RCxTQUFTO1FBQ1QsWUFBWTtRQUNaLDZCQUE2QjtRQUM3QixzRUFBc0U7UUFDdEUsS0FBSztRQUNMLElBQUk7UUFDSiwyQ0FBMkM7UUFDM0Msa0NBQWtDO1FBQ2xDLDJCQUEyQjtRQUMzQixvRUFBb0U7UUFDcEUsSUFBSTtRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHO1lBQ3pCLDRCQUE0QjtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFTLElBQUk7WUFDbkMsa0RBQWtEO1lBQ2xELHFDQUFxQztRQUN2QyxDQUFDLENBQUM7UUFDRixJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdEIsbURBQW1EO1FBQ3JELENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZG9jcy9hc3NldHMvanMvYXBwcy5oZWxwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy92YXIgcmVtb3RlID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGU7XG4vL3ZhciBhcHAgPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5hcHA7XG4vL3ZhciBfaXBjUmVuZGVyZXIsIGlwY1JlbmRlcmVyID0gKCkgPT4geyBfaXBjUmVuZGVyZXIgPSBfaXBjUmVuZGVyZXIgfHwgcmVxdWlyZSgnZWxlY3Ryb24nKS5pcGNSZW5kZXJlcjsgcmV0dXJuIF9pcGNSZW5kZXJlcjsgfTtcbi8vdmFyIF9zaGVsbCwgc2hlbGwgICAgICAgICAgICAgPSAoKSA9PiB7IF9zaGVsbCA9IF9zaGVsbCB8fCByZXF1aXJlKCdlbGVjdHJvbicpLnNoZWxsOyByZXR1cm4gX3NoZWxsOyB9O1xuLy92YXIgX2xvZywgbG9nICAgICAgICAgICAgICAgICA9ICgpID0+IHsgX2xvZyA9IF9sb2cgfHwgcmVxdWlyZSgnZWxlY3Ryb24tbG9nJyk7IHJldHVybiBfbG9nOyB9O1xuLy9cbi8vdmFyIGhvbWVEaXIgPSBhcHAuZ2V0UGF0aCgnaG9tZScpO1xuLy9cbi8vLy8gZW52XG4vL3ZhciBERUJVRyA9IHByb2Nlc3MuZW52LkRFQlVHICE9IG51bGw7XG4vL1xuLy8vLyBzb3VyY2UtbWFwLXN1cHBvcnRcbi8vaWYgKERFQlVHKSB7XG4vLyAgdHJ5IHtcbi8vICAgIHJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcbi8vICB9IGNhdGNoKGUpIHtcbi8vICAgIGxvZygpLmVycm9yKCdzb3VyY2UtbWFwLXN1cHBvcnQgb3IgZGV2dHJvbiBpcyBub3QgaW5zdGFsbGVkLicpO1xuLy8gIH1cbi8vfVxuLy8gaGVscCBhcHBcbmFuZ3VsYXIubW9kdWxlKCdoZWxwQXBwJywgWydJbmNsdWRlRGlyZWN0aXZlcyddKVxuICAuY29uZmlnKFsnJHFQcm92aWRlcicsICgkcVByb3ZpZGVyKSA9PiB7XG4gICAgJHFQcm92aWRlci5lcnJvck9uVW5oYW5kbGVkUmVqZWN0aW9ucyhmYWxzZSk7XG4gIH1dKVxuICAvLy5mYWN0b3J5KCckZXhjZXB0aW9uSGFuZGxlcicsICgpID0+IHtcbiAgLy8gIHJldHVybiAoZXhjZXB0aW9uLCBjYXVzZSkgPT4ge1xuICAvLyAgICBsb2coKS53YXJuKCdoZWxwOmNhdGNoIGFuZ3VsYXJqcyBleGNlcHRpb246ICVzLCBjYXVzZTolcycsIGV4Y2VwdGlvbiwgY2F1c2UpO1xuICAvLyAgfTtcbiAgLy99KVxuICAuY29udHJvbGxlcignSGVscENvbnRyb2xsZXInLCBbJyRzY29wZScsICckdGltZW91dCcsICckbG9jYXRpb24nLCAnJHdpbmRvdycsXG4gIGZ1bmN0aW9uKCRzY29wZTogeXViby5JSGVscFNjb3BlLCAkdGltZW91dCwgJGxvY2F0aW9uLCAkd2luZG93KSB7XG5cbiAgICBjb25zdCBtZW51TGlzdCA9IFtcbiAgICAgICdhYm91dCcsXG4gICAgICAndm9pY2Vjb2RlJyxcbiAgICAgICd0cm91YmxlJyxcbiAgICAgICd1cGRhdGUnLFxuICAgICAgJ3VuaW5zdGFsbCcsXG4gICAgICAnYmFja3VwJyxcbiAgICAgICdsaWNlbnNlJyxcbiAgICAgICdjb250YWN0JyxcbiAgICAgICdmdW5jbGlzdCcsXG4gICAgICAncGxheScsXG4gICAgICAndHVuYScsXG4gICAgICAnd3JpdGluZycsXG4gICAgICAnZGF0YWNvbmZpZycsXG4gICAgICAnZHJhZ291dCcsXG4gICAgICAnbXVsdGl2b2ljZScsXG4gICAgICAnZGljdGlvbmFyeScsXG4gICAgICAnaGlzdG9yeScsXG4gICAgICAnc2hvcnRjdXQnLFxuICAgICAgJ2hlbHAnLFxuICAgICAgJ2V4cGFuZCcsXG4gICAgXTtcblxuICAgIC8vIGluaXRcbiAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICRzY29wZS5zZWFyY2hWaXNpYmxlZCA9IGZhbHNlO1xuICAgICRzY29wZS5zZWFyY2hUZXh0ID0gJyc7XG5cbiAgICAvLyBldmVudCB1cmwgaGFzaCBjaGFuZ2VkXG4gICAgJHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIChldmVudCkgPT4ge1xuICAgICAgLy8gZml4IGJyb2tlbiB1cmxcbiAgICAgIGlmICgkbG9jYXRpb24udXJsKCkuc3RhcnRzV2l0aCgnLyUyMycpKSB7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICRsb2NhdGlvbi5hYnNVcmwoKS5yZXBsYWNlKCclMjMnLCAnIycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGhhc2ggPSAkbG9jYXRpb24uaGFzaCgpO1xuICAgICAgaWYgKG1lbnVMaXN0LmluY2x1ZGVzKGhhc2gpKSB7XG4gICAgICAgICRzY29wZS5kaXNwbGF5ID0gaGFzaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5kaXNwbGF5ID0gJ2Fib3V0JztcbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KCgpID0+IHsgJHNjb3BlLiRhcHBseSgpOyB9KTtcbiAgICB9KTtcblxuICAgIC8vLy8gc2hvcnRjdXRcbiAgICAvL2lwY1JlbmRlcmVyKCkub24oJ3Nob3J0Y3V0JywgKGV2ZW50LCBhY3Rpb24pID0+IHtcbiAgICAvLyAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAvLyAgICBjYXNlICdtb3ZlVG9QcmV2aW91c0hlbHAnOlxuICAgIC8vICAgICAgbW92ZVRvUHJldmlvdXNIZWxwKCk7XG4gICAgLy8gICAgICAkdGltZW91dCgoKSA9PiB7ICRzY29wZS4kYXBwbHkoKTsgfSk7XG4gICAgLy8gICAgICBicmVhaztcbiAgICAvLyAgICBjYXNlICdtb3ZlVG9OZXh0SGVscCc6XG4gICAgLy8gICAgICBtb3ZlVG9OZXh0SGVscCgpO1xuICAgIC8vICAgICAgJHRpbWVvdXQoKCkgPT4geyAkc2NvcGUuJGFwcGx5KCk7IH0pO1xuICAgIC8vICAgICAgYnJlYWs7XG4gICAgLy8gICAgY2FzZSAnb3BlblNlYXJjaEZvcm0nOlxuICAgIC8vICAgICAgY3RybC5vcGVuU2VhcmNoRm9ybSgpO1xuICAgIC8vICAgICAgJHRpbWVvdXQoKCkgPT4geyAkc2NvcGUuJGFwcGx5KCk7IH0pO1xuICAgIC8vICAgICAgYnJlYWs7XG4gICAgLy8gICAgY2FzZSAnY2xvc2VTZWFyY2hGb3JtJzpcbiAgICAvLyAgICAgIGN0cmwuY2xvc2VTZWFyY2hGb3JtKCk7XG4gICAgLy8gICAgICAkdGltZW91dCgoKSA9PiB7ICRzY29wZS4kYXBwbHkoKTsgfSk7XG4gICAgLy8gICAgICBicmVhaztcbiAgICAvLyAgfVxuICAgIC8vfSk7XG4gICAgLy9mdW5jdGlvbiBtb3ZlVG9QcmV2aW91c0hlbHAoKTogdm9pZCB7XG4gICAgLy8gIGNvbnN0IGluZGV4ID0gbWVudUxpc3QuaW5kZXhPZigkc2NvcGUuZGlzcGxheSk7XG4gICAgLy8gIGNvbnN0IG1vdmVkID0gaW5kZXggLSAxO1xuICAgIC8vICBpZiAoaW5kZXggPCAwKSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbMF0pO1xuICAgIC8vICB9IGVsc2UgaWYgKG1vdmVkIDwgMCkge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0W21lbnVMaXN0Lmxlbmd0aCAtIDFdKTtcbiAgICAvLyAgfSBlbHNlIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFttb3ZlZF0pO1xuICAgIC8vICB9XG4gICAgLy99XG4gICAgLy9mdW5jdGlvbiBtb3ZlVG9OZXh0SGVscCgpOiB2b2lkIHtcbiAgICAvLyAgY29uc3QgaW5kZXggPSBtZW51TGlzdC5pbmRleE9mKCRzY29wZS5kaXNwbGF5KTtcbiAgICAvLyAgY29uc3QgbW92ZWQgPSBpbmRleCArIDE7XG4gICAgLy8gIGlmIChpbmRleCA8IDApIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFswXSk7XG4gICAgLy8gIH0gZWxzZSBpZiAobW92ZWQgPj0gbWVudUxpc3QubGVuZ3RoKSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbMF0pO1xuICAgIC8vICB9IGVsc2Uge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0W21vdmVkXSk7XG4gICAgLy8gIH1cbiAgICAvL31cblxuICAgIC8vIGFjdGlvblxuICAgIC8vY3RybC5zZWFyY2hJblBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAvLyAgaWYgKCRzY29wZS5zZWFyY2hUZXh0KSB7XG4gICAgLy8gICAgcmVtb3RlLmdldEN1cnJlbnRXZWJDb250ZW50cygpLmZpbmRJblBhZ2UoJHNjb3BlLnNlYXJjaFRleHQpO1xuICAgIC8vICB9IGVsc2Uge1xuICAgIC8vICAgIHJlbW90ZS5nZXRDdXJyZW50V2ViQ29udGVudHMoKS5zdG9wRmluZEluUGFnZSgnY2xlYXJTZWxlY3Rpb24nKTtcbiAgICAvLyAgfVxuICAgIC8vfTtcbiAgICAvL2N0cmwuc2VhcmNoSW5IZWxwID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gIGlmICgkc2NvcGUuc2VhcmNoVGV4dCkge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKCdleHBhbmQnKTtcbiAgICAvLyAgICByZW1vdGUuZ2V0Q3VycmVudFdlYkNvbnRlbnRzKCkuZmluZEluUGFnZSgkc2NvcGUuc2VhcmNoVGV4dCk7XG4gICAgLy8gIH0gZWxzZSB7XG4gICAgLy8gICAgcmVtb3RlLmdldEN1cnJlbnRXZWJDb250ZW50cygpLnN0b3BGaW5kSW5QYWdlKCdjbGVhclNlbGVjdGlvbicpO1xuICAgIC8vICB9XG4gICAgLy99O1xuICAgIC8vY3RybC5vcGVuU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgIC8vICAkc2NvcGUuc2VhcmNoVmlzaWJsZWQgPSAhJHNjb3BlLnNlYXJjaFZpc2libGVkO1xuICAgIC8vICBpZiAoJHNjb3BlLnNlYXJjaFZpc2libGVkKSB7XG4gICAgLy8gICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgIC8vICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgIC8vICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC10ZXh0JykuZm9jdXMoKTtcbiAgICAvLyAgICB9KTtcbiAgICAvLyAgfSBlbHNlIHtcbiAgICAvLyAgICAkc2NvcGUuc2VhcmNoVGV4dCA9ICcnO1xuICAgIC8vICAgIHJlbW90ZS5nZXRDdXJyZW50V2ViQ29udGVudHMoKS5zdG9wRmluZEluUGFnZSgnY2xlYXJTZWxlY3Rpb24nKTtcbiAgICAvLyAgfVxuICAgIC8vfTtcbiAgICAvL2N0cmwuY2xvc2VTZWFyY2hGb3JtID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gICRzY29wZS5zZWFyY2hWaXNpYmxlZCA9IGZhbHNlO1xuICAgIC8vICAkc2NvcGUuc2VhcmNoVGV4dCA9ICcnO1xuICAgIC8vICByZW1vdGUuZ2V0Q3VycmVudFdlYkNvbnRlbnRzKCkuc3RvcEZpbmRJblBhZ2UoJ2NsZWFyU2VsZWN0aW9uJyk7XG4gICAgLy99O1xuICAgIGN0cmwuYnJvd3NlciA9IGZ1bmN0aW9uKHVybCk6IHZvaWQge1xuICAgICAgLy9zaGVsbCgpLm9wZW5FeHRlcm5hbCh1cmwpO1xuICAgICAgJHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfTtcbiAgICBjdHJsLnNob3dJdGVtSW5Gb2xkZXIgPSBmdW5jdGlvbihwYXRoKTogdm9pZCB7XG4gICAgICAvL2NvbnN0IGV4cGFuZGVkID0gcGF0aC5yZXBsYWNlKCckSE9NRScsIGhvbWVEaXIpO1xuICAgICAgLy9zaGVsbCgpLnNob3dJdGVtSW5Gb2xkZXIoZXhwYW5kZWQpO1xuICAgIH07XG4gICAgY3RybC5zaG93U3lzdGVtV2luZG93ID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAvL2lwY1JlbmRlcmVyKCkuc2VuZCgnc2hvd1N5c3RlbVdpbmRvdycsICdzeXN0ZW0nKTtcbiAgICB9O1xuICB9XSk7XG5cbiJdfQ==
