"use strict";
//var app = require('electron').remote.app;
//var _ipcRenderer, ipcRenderer = () => { _ipcRenderer = _ipcRenderer || require('electron').ipcRenderer; return _ipcRenderer; };
//var _shell, shell             = () => { _shell = _shell || require('electron').shell; return _shell; };
//var _log, log                 = () => { _log = _log || require('electron-log'); return _log; };
//
//var homeDir = app.getPath('home');
//
//// source-map-support
//if (process.env.DEBUG != null) {
//  require('source-map-support').install();
//}
//
//// handle uncaughtException
//process.on('uncaughtException', (err: Error) => {
//  log().error('help:event:uncaughtException');
//  log().error(err);
//  log().error(err.stack);
//});
// help app
angular.module('helpApp', [])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
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
            'shortcut',
            'help',
        ];
        // init
        var ctrl = this;
        $scope.$location = $location;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY3MvYXNzZXRzL2pzL2FwcHMuaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkNBQTJDO0FBQzNDLGlJQUFpSTtBQUNqSSx5R0FBeUc7QUFDekcsaUdBQWlHO0FBQ2pHLEVBQUU7QUFDRixvQ0FBb0M7QUFDcEMsRUFBRTtBQUNGLHVCQUF1QjtBQUN2QixrQ0FBa0M7QUFDbEMsNENBQTRDO0FBQzVDLEdBQUc7QUFDSCxFQUFFO0FBQ0YsNkJBQTZCO0FBQzdCLG1EQUFtRDtBQUNuRCxnREFBZ0Q7QUFDaEQscUJBQXFCO0FBQ3JCLDJCQUEyQjtBQUMzQixLQUFLO0FBRUwsV0FBVztBQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztLQUMxQixNQUFNLENBQUMsQ0FBQyxZQUFZLEVBQUUsVUFBQyxVQUFVO1FBQ2hDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztLQUNGLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVM7SUFDM0UsVUFBUyxNQUF1QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUU1RCxJQUFNLFFBQVEsR0FBRztZQUNmLE9BQU87WUFDUCxXQUFXO1lBQ1gsU0FBUztZQUNULFFBQVE7WUFDUixXQUFXO1lBQ1gsUUFBUTtZQUNSLFNBQVM7WUFDVCxTQUFTO1lBQ1QsVUFBVTtZQUNWLE1BQU07WUFDTixNQUFNO1lBQ04sU0FBUztZQUNULFlBQVk7WUFDWixTQUFTO1lBQ1QsWUFBWTtZQUNaLFlBQVk7WUFDWixVQUFVO1lBQ1YsTUFBTTtTQUNQLENBQUM7UUFFRixPQUFPO1FBQ1AsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTdCLHlCQUF5QjtRQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFVBQUMsS0FBSztZQUN6QyxpQkFBaUI7WUFDakIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0QsT0FBTzthQUNSO1lBRUQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlCLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDMUI7WUFDRCxRQUFRLENBQUMsY0FBUSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILGFBQWE7UUFDYixtREFBbUQ7UUFDbkQscUJBQXFCO1FBQ3JCLGdDQUFnQztRQUNoQyw2QkFBNkI7UUFDN0IsNkNBQTZDO1FBQzdDLGNBQWM7UUFDZCw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLDZDQUE2QztRQUM3QyxjQUFjO1FBQ2QsS0FBSztRQUNMLEtBQUs7UUFDTCx1Q0FBdUM7UUFDdkMsbURBQW1EO1FBQ25ELDRCQUE0QjtRQUM1QixvQkFBb0I7UUFDcEIsa0NBQWtDO1FBQ2xDLDJCQUEyQjtRQUMzQixvREFBb0Q7UUFDcEQsWUFBWTtRQUNaLHNDQUFzQztRQUN0QyxLQUFLO1FBQ0wsR0FBRztRQUNILG1DQUFtQztRQUNuQyxtREFBbUQ7UUFDbkQsNEJBQTRCO1FBQzVCLG9CQUFvQjtRQUNwQixrQ0FBa0M7UUFDbEMsMENBQTBDO1FBQzFDLGtDQUFrQztRQUNsQyxZQUFZO1FBQ1osc0NBQXNDO1FBQ3RDLEtBQUs7UUFDTCxHQUFHO1FBRUgsU0FBUztRQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBUyxHQUFHO1lBQ3pCLDRCQUE0QjtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFTLElBQUk7WUFDbkMsa0RBQWtEO1lBQ2xELHFDQUFxQztRQUN2QyxDQUFDLENBQUM7UUFDRixJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdEIsbURBQW1EO1FBQ3JELENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZG9jcy9hc3NldHMvanMvYXBwcy5oZWxwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy92YXIgYXBwID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGUuYXBwO1xuLy92YXIgX2lwY1JlbmRlcmVyLCBpcGNSZW5kZXJlciA9ICgpID0+IHsgX2lwY1JlbmRlcmVyID0gX2lwY1JlbmRlcmVyIHx8IHJlcXVpcmUoJ2VsZWN0cm9uJykuaXBjUmVuZGVyZXI7IHJldHVybiBfaXBjUmVuZGVyZXI7IH07XG4vL3ZhciBfc2hlbGwsIHNoZWxsICAgICAgICAgICAgID0gKCkgPT4geyBfc2hlbGwgPSBfc2hlbGwgfHwgcmVxdWlyZSgnZWxlY3Ryb24nKS5zaGVsbDsgcmV0dXJuIF9zaGVsbDsgfTtcbi8vdmFyIF9sb2csIGxvZyAgICAgICAgICAgICAgICAgPSAoKSA9PiB7IF9sb2cgPSBfbG9nIHx8IHJlcXVpcmUoJ2VsZWN0cm9uLWxvZycpOyByZXR1cm4gX2xvZzsgfTtcbi8vXG4vL3ZhciBob21lRGlyID0gYXBwLmdldFBhdGgoJ2hvbWUnKTtcbi8vXG4vLy8vIHNvdXJjZS1tYXAtc3VwcG9ydFxuLy9pZiAocHJvY2Vzcy5lbnYuREVCVUcgIT0gbnVsbCkge1xuLy8gIHJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcbi8vfVxuLy9cbi8vLy8gaGFuZGxlIHVuY2F1Z2h0RXhjZXB0aW9uXG4vL3Byb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgKGVycjogRXJyb3IpID0+IHtcbi8vICBsb2coKS5lcnJvcignaGVscDpldmVudDp1bmNhdWdodEV4Y2VwdGlvbicpO1xuLy8gIGxvZygpLmVycm9yKGVycik7XG4vLyAgbG9nKCkuZXJyb3IoZXJyLnN0YWNrKTtcbi8vfSk7XG5cbi8vIGhlbHAgYXBwXG5hbmd1bGFyLm1vZHVsZSgnaGVscEFwcCcsIFtdKVxuICAuY29uZmlnKFsnJHFQcm92aWRlcicsICgkcVByb3ZpZGVyKSA9PiB7XG4gICAgJHFQcm92aWRlci5lcnJvck9uVW5oYW5kbGVkUmVqZWN0aW9ucyhmYWxzZSk7XG4gIH1dKVxuICAuY29udHJvbGxlcignSGVscENvbnRyb2xsZXInLCBbJyRzY29wZScsICckdGltZW91dCcsICckbG9jYXRpb24nLCAnJHdpbmRvdycsXG4gIGZ1bmN0aW9uKCRzY29wZTogeXViby5JSGVscFNjb3BlLCAkdGltZW91dCwgJGxvY2F0aW9uLCAkd2luZG93KSB7XG5cbiAgICBjb25zdCBtZW51TGlzdCA9IFtcbiAgICAgICdhYm91dCcsXG4gICAgICAndm9pY2Vjb2RlJyxcbiAgICAgICd0cm91YmxlJyxcbiAgICAgICd1cGRhdGUnLFxuICAgICAgJ3VuaW5zdGFsbCcsXG4gICAgICAnYmFja3VwJyxcbiAgICAgICdsaWNlbnNlJyxcbiAgICAgICdjb250YWN0JyxcbiAgICAgICdmdW5jbGlzdCcsXG4gICAgICAncGxheScsXG4gICAgICAndHVuYScsXG4gICAgICAnd3JpdGluZycsXG4gICAgICAnZGF0YWNvbmZpZycsXG4gICAgICAnZHJhZ291dCcsXG4gICAgICAnbXVsdGl2b2ljZScsXG4gICAgICAnZGljdGlvbmFyeScsXG4gICAgICAnc2hvcnRjdXQnLFxuICAgICAgJ2hlbHAnLFxuICAgIF07XG5cbiAgICAvLyBpbml0XG4gICAgY29uc3QgY3RybCA9IHRoaXM7XG4gICAgJHNjb3BlLiRsb2NhdGlvbiA9ICRsb2NhdGlvbjtcblxuICAgIC8vIGV2ZW50IHVybCBoYXNoIGNoYW5nZWRcbiAgICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgKGV2ZW50KSA9PiB7XG4gICAgICAvLyBmaXggYnJva2VuIHVybFxuICAgICAgaWYgKCRsb2NhdGlvbi51cmwoKS5zdGFydHNXaXRoKCcvJTIzJykpIHtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJGxvY2F0aW9uLmFic1VybCgpLnJlcGxhY2UoJyUyMycsICcjJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaGFzaCA9ICRsb2NhdGlvbi5oYXNoKCk7XG4gICAgICBpZiAobWVudUxpc3QuaW5jbHVkZXMoaGFzaCkpIHtcbiAgICAgICAgJHNjb3BlLmRpc3BsYXkgPSBoYXNoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmRpc3BsYXkgPSAnYWJvdXQnO1xuICAgICAgfVxuICAgICAgJHRpbWVvdXQoKCkgPT4geyAkc2NvcGUuJGFwcGx5KCk7IH0pO1xuICAgIH0pO1xuXG4gICAgLy8vLyBzaG9ydGN1dFxuICAgIC8vaXBjUmVuZGVyZXIoKS5vbignc2hvcnRjdXQnLCAoZXZlbnQsIGFjdGlvbikgPT4ge1xuICAgIC8vICBzd2l0Y2ggKGFjdGlvbikge1xuICAgIC8vICAgIGNhc2UgJ21vdmVUb1ByZXZpb3VzSGVscCc6XG4gICAgLy8gICAgICBtb3ZlVG9QcmV2aW91c0hlbHAoKTtcbiAgICAvLyAgICAgICR0aW1lb3V0KCgpID0+IHsgJHNjb3BlLiRhcHBseSgpOyB9KTtcbiAgICAvLyAgICAgIGJyZWFrO1xuICAgIC8vICAgIGNhc2UgJ21vdmVUb05leHRIZWxwJzpcbiAgICAvLyAgICAgIG1vdmVUb05leHRIZWxwKCk7XG4gICAgLy8gICAgICAkdGltZW91dCgoKSA9PiB7ICRzY29wZS4kYXBwbHkoKTsgfSk7XG4gICAgLy8gICAgICBicmVhaztcbiAgICAvLyAgfVxuICAgIC8vfSk7XG4gICAgLy9mdW5jdGlvbiBtb3ZlVG9QcmV2aW91c0hlbHAoKTogdm9pZCB7XG4gICAgLy8gIGNvbnN0IGluZGV4ID0gbWVudUxpc3QuaW5kZXhPZigkc2NvcGUuZGlzcGxheSk7XG4gICAgLy8gIGNvbnN0IG1vdmVkID0gaW5kZXggLSAxO1xuICAgIC8vICBpZiAoaW5kZXggPCAwKSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbMF0pO1xuICAgIC8vICB9IGVsc2UgaWYgKG1vdmVkIDwgMCkge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0W21lbnVMaXN0Lmxlbmd0aCAtIDFdKTtcbiAgICAvLyAgfSBlbHNlIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFttb3ZlZF0pO1xuICAgIC8vICB9XG4gICAgLy99XG4gICAgLy9mdW5jdGlvbiBtb3ZlVG9OZXh0SGVscCgpOiB2b2lkIHtcbiAgICAvLyAgY29uc3QgaW5kZXggPSBtZW51TGlzdC5pbmRleE9mKCRzY29wZS5kaXNwbGF5KTtcbiAgICAvLyAgY29uc3QgbW92ZWQgPSBpbmRleCArIDE7XG4gICAgLy8gIGlmIChpbmRleCA8IDApIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFswXSk7XG4gICAgLy8gIH0gZWxzZSBpZiAobW92ZWQgPj0gbWVudUxpc3QubGVuZ3RoKSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbMF0pO1xuICAgIC8vICB9IGVsc2Uge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0W21vdmVkXSk7XG4gICAgLy8gIH1cbiAgICAvL31cblxuICAgIC8vIGFjdGlvblxuICAgIGN0cmwuYnJvd3NlciA9IGZ1bmN0aW9uKHVybCk6IHZvaWQge1xuICAgICAgLy9zaGVsbCgpLm9wZW5FeHRlcm5hbCh1cmwpO1xuICAgICAgJHdpbmRvdy5vcGVuKHVybCk7XG4gICAgfTtcbiAgICBjdHJsLnNob3dJdGVtSW5Gb2xkZXIgPSBmdW5jdGlvbihwYXRoKTogdm9pZCB7XG4gICAgICAvL2NvbnN0IGV4cGFuZGVkID0gcGF0aC5yZXBsYWNlKCckSE9NRScsIGhvbWVEaXIpO1xuICAgICAgLy9zaGVsbCgpLnNob3dJdGVtSW5Gb2xkZXIoZXhwYW5kZWQpO1xuICAgIH07XG4gICAgY3RybC5zaG93U3lzdGVtV2luZG93ID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAvL2lwY1JlbmRlcmVyKCkuc2VuZCgnc2hvd1N5c3RlbVdpbmRvdycsICdzeXN0ZW0nKTtcbiAgICB9O1xuICB9XSk7XG5cbiJdfQ==
