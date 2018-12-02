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
            $timeout($scope.$apply);
        });
        //// shortcut
        //ipcRenderer().on('shortcut', (event, action) => {
        //  switch (action) {
        //    case 'moveToPreviousHelp':
        //      moveToPreviousHelp();
        //      $timeout($scope.$apply);
        //      break;
        //    case 'moveToNextHelp':
        //      moveToNextHelp();
        //      $timeout($scope.$apply);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY3MvYXNzZXRzL2pzL2FwcHMuaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkNBQTJDO0FBQzNDLGlJQUFpSTtBQUNqSSx5R0FBeUc7QUFDekcsaUdBQWlHO0FBQ2pHLEVBQUU7QUFDRixvQ0FBb0M7QUFDcEMsRUFBRTtBQUNGLHVCQUF1QjtBQUN2QixrQ0FBa0M7QUFDbEMsNENBQTRDO0FBQzVDLEdBQUc7QUFDSCxFQUFFO0FBQ0YsNkJBQTZCO0FBQzdCLG1EQUFtRDtBQUNuRCxnREFBZ0Q7QUFDaEQscUJBQXFCO0FBQ3JCLDJCQUEyQjtBQUMzQixLQUFLO0FBRUwsV0FBVztBQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztLQUMxQixNQUFNLENBQUMsQ0FBQyxZQUFZLEVBQUUsVUFBQyxVQUFVO1FBQ2hDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztLQUNGLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVM7SUFDM0UsVUFBUyxNQUF1QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUU1RCxJQUFNLFFBQVEsR0FBRztZQUNmLE9BQU87WUFDUCxXQUFXO1lBQ1gsU0FBUztZQUNULFFBQVE7WUFDUixXQUFXO1lBQ1gsUUFBUTtZQUNSLFNBQVM7WUFDVCxTQUFTO1lBQ1QsVUFBVTtZQUNWLE1BQU07WUFDTixNQUFNO1lBQ04sU0FBUztZQUNULFlBQVk7WUFDWixTQUFTO1lBQ1QsWUFBWTtZQUNaLFlBQVk7WUFDWixVQUFVO1lBQ1YsTUFBTTtTQUNQLENBQUM7UUFFRixPQUFPO1FBQ1AsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTdCLHlCQUF5QjtRQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFVBQUMsS0FBSztZQUN6QyxpQkFBaUI7WUFDakIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN0QyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0QsT0FBTzthQUNSO1lBRUQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlCLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDMUI7WUFDRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNiLG1EQUFtRDtRQUNuRCxxQkFBcUI7UUFDckIsZ0NBQWdDO1FBQ2hDLDZCQUE2QjtRQUM3QixnQ0FBZ0M7UUFDaEMsY0FBYztRQUNkLDRCQUE0QjtRQUM1Qix5QkFBeUI7UUFDekIsZ0NBQWdDO1FBQ2hDLGNBQWM7UUFDZCxLQUFLO1FBQ0wsS0FBSztRQUNMLHVDQUF1QztRQUN2QyxtREFBbUQ7UUFDbkQsNEJBQTRCO1FBQzVCLG9CQUFvQjtRQUNwQixrQ0FBa0M7UUFDbEMsMkJBQTJCO1FBQzNCLG9EQUFvRDtRQUNwRCxZQUFZO1FBQ1osc0NBQXNDO1FBQ3RDLEtBQUs7UUFDTCxHQUFHO1FBQ0gsbUNBQW1DO1FBQ25DLG1EQUFtRDtRQUNuRCw0QkFBNEI7UUFDNUIsb0JBQW9CO1FBQ3BCLGtDQUFrQztRQUNsQywwQ0FBMEM7UUFDMUMsa0NBQWtDO1FBQ2xDLFlBQVk7UUFDWixzQ0FBc0M7UUFDdEMsS0FBSztRQUNMLEdBQUc7UUFFSCxTQUFTO1FBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFTLEdBQUc7WUFDekIsNEJBQTRCO1lBQzVCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVMsSUFBSTtZQUNuQyxrREFBa0Q7WUFDbEQscUNBQXFDO1FBQ3ZDLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN0QixtREFBbUQ7UUFDckQsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJkb2NzL2Fzc2V0cy9qcy9hcHBzLmhlbHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL3ZhciBhcHAgPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5hcHA7XG4vL3ZhciBfaXBjUmVuZGVyZXIsIGlwY1JlbmRlcmVyID0gKCkgPT4geyBfaXBjUmVuZGVyZXIgPSBfaXBjUmVuZGVyZXIgfHwgcmVxdWlyZSgnZWxlY3Ryb24nKS5pcGNSZW5kZXJlcjsgcmV0dXJuIF9pcGNSZW5kZXJlcjsgfTtcbi8vdmFyIF9zaGVsbCwgc2hlbGwgICAgICAgICAgICAgPSAoKSA9PiB7IF9zaGVsbCA9IF9zaGVsbCB8fCByZXF1aXJlKCdlbGVjdHJvbicpLnNoZWxsOyByZXR1cm4gX3NoZWxsOyB9O1xuLy92YXIgX2xvZywgbG9nICAgICAgICAgICAgICAgICA9ICgpID0+IHsgX2xvZyA9IF9sb2cgfHwgcmVxdWlyZSgnZWxlY3Ryb24tbG9nJyk7IHJldHVybiBfbG9nOyB9O1xuLy9cbi8vdmFyIGhvbWVEaXIgPSBhcHAuZ2V0UGF0aCgnaG9tZScpO1xuLy9cbi8vLy8gc291cmNlLW1hcC1zdXBwb3J0XG4vL2lmIChwcm9jZXNzLmVudi5ERUJVRyAhPSBudWxsKSB7XG4vLyAgcmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1xuLy99XG4vL1xuLy8vLyBoYW5kbGUgdW5jYXVnaHRFeGNlcHRpb25cbi8vcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCAoZXJyOiBFcnJvcikgPT4ge1xuLy8gIGxvZygpLmVycm9yKCdoZWxwOmV2ZW50OnVuY2F1Z2h0RXhjZXB0aW9uJyk7XG4vLyAgbG9nKCkuZXJyb3IoZXJyKTtcbi8vICBsb2coKS5lcnJvcihlcnIuc3RhY2spO1xuLy99KTtcblxuLy8gaGVscCBhcHBcbmFuZ3VsYXIubW9kdWxlKCdoZWxwQXBwJywgW10pXG4gIC5jb25maWcoWyckcVByb3ZpZGVyJywgKCRxUHJvdmlkZXIpID0+IHtcbiAgICAkcVByb3ZpZGVyLmVycm9yT25VbmhhbmRsZWRSZWplY3Rpb25zKGZhbHNlKTtcbiAgfV0pXG4gIC5jb250cm9sbGVyKCdIZWxwQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyR0aW1lb3V0JywgJyRsb2NhdGlvbicsICckd2luZG93JyxcbiAgZnVuY3Rpb24oJHNjb3BlOiB5dWJvLklIZWxwU2NvcGUsICR0aW1lb3V0LCAkbG9jYXRpb24sICR3aW5kb3cpIHtcblxuICAgIGNvbnN0IG1lbnVMaXN0ID0gW1xuICAgICAgJ2Fib3V0JyxcbiAgICAgICd2b2ljZWNvZGUnLFxuICAgICAgJ3Ryb3VibGUnLFxuICAgICAgJ3VwZGF0ZScsXG4gICAgICAndW5pbnN0YWxsJyxcbiAgICAgICdiYWNrdXAnLFxuICAgICAgJ2xpY2Vuc2UnLFxuICAgICAgJ2NvbnRhY3QnLFxuICAgICAgJ2Z1bmNsaXN0JyxcbiAgICAgICdwbGF5JyxcbiAgICAgICd0dW5hJyxcbiAgICAgICd3cml0aW5nJyxcbiAgICAgICdkYXRhY29uZmlnJyxcbiAgICAgICdkcmFnb3V0JyxcbiAgICAgICdtdWx0aXZvaWNlJyxcbiAgICAgICdkaWN0aW9uYXJ5JyxcbiAgICAgICdzaG9ydGN1dCcsXG4gICAgICAnaGVscCcsXG4gICAgXTtcblxuICAgIC8vIGluaXRcbiAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuXG4gICAgLy8gZXZlbnQgdXJsIGhhc2ggY2hhbmdlZFxuICAgICRzY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vIGZpeCBicm9rZW4gdXJsXG4gICAgICBpZiAoJGxvY2F0aW9uLnVybCgpLnN0YXJ0c1dpdGgoJy8lMjMnKSkge1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAkbG9jYXRpb24uYWJzVXJsKCkucmVwbGFjZSgnJTIzJywgJyMnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNoID0gJGxvY2F0aW9uLmhhc2goKTtcbiAgICAgIGlmIChtZW51TGlzdC5pbmNsdWRlcyhoYXNoKSkge1xuICAgICAgICAkc2NvcGUuZGlzcGxheSA9IGhhc2g7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUuZGlzcGxheSA9ICdhYm91dCc7XG4gICAgICB9XG4gICAgICAkdGltZW91dCgkc2NvcGUuJGFwcGx5KTtcbiAgICB9KTtcblxuICAgIC8vLy8gc2hvcnRjdXRcbiAgICAvL2lwY1JlbmRlcmVyKCkub24oJ3Nob3J0Y3V0JywgKGV2ZW50LCBhY3Rpb24pID0+IHtcbiAgICAvLyAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAvLyAgICBjYXNlICdtb3ZlVG9QcmV2aW91c0hlbHAnOlxuICAgIC8vICAgICAgbW92ZVRvUHJldmlvdXNIZWxwKCk7XG4gICAgLy8gICAgICAkdGltZW91dCgkc2NvcGUuJGFwcGx5KTtcbiAgICAvLyAgICAgIGJyZWFrO1xuICAgIC8vICAgIGNhc2UgJ21vdmVUb05leHRIZWxwJzpcbiAgICAvLyAgICAgIG1vdmVUb05leHRIZWxwKCk7XG4gICAgLy8gICAgICAkdGltZW91dCgkc2NvcGUuJGFwcGx5KTtcbiAgICAvLyAgICAgIGJyZWFrO1xuICAgIC8vICB9XG4gICAgLy99KTtcbiAgICAvL2Z1bmN0aW9uIG1vdmVUb1ByZXZpb3VzSGVscCgpOiB2b2lkIHtcbiAgICAvLyAgY29uc3QgaW5kZXggPSBtZW51TGlzdC5pbmRleE9mKCRzY29wZS5kaXNwbGF5KTtcbiAgICAvLyAgY29uc3QgbW92ZWQgPSBpbmRleCAtIDE7XG4gICAgLy8gIGlmIChpbmRleCA8IDApIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFswXSk7XG4gICAgLy8gIH0gZWxzZSBpZiAobW92ZWQgPCAwKSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbbWVudUxpc3QubGVuZ3RoIC0gMV0pO1xuICAgIC8vICB9IGVsc2Uge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0W21vdmVkXSk7XG4gICAgLy8gIH1cbiAgICAvL31cbiAgICAvL2Z1bmN0aW9uIG1vdmVUb05leHRIZWxwKCk6IHZvaWQge1xuICAgIC8vICBjb25zdCBpbmRleCA9IG1lbnVMaXN0LmluZGV4T2YoJHNjb3BlLmRpc3BsYXkpO1xuICAgIC8vICBjb25zdCBtb3ZlZCA9IGluZGV4ICsgMTtcbiAgICAvLyAgaWYgKGluZGV4IDwgMCkge1xuICAgIC8vICAgICRsb2NhdGlvbi5oYXNoKG1lbnVMaXN0WzBdKTtcbiAgICAvLyAgfSBlbHNlIGlmIChtb3ZlZCA+PSBtZW51TGlzdC5sZW5ndGgpIHtcbiAgICAvLyAgICAkbG9jYXRpb24uaGFzaChtZW51TGlzdFswXSk7XG4gICAgLy8gIH0gZWxzZSB7XG4gICAgLy8gICAgJGxvY2F0aW9uLmhhc2gobWVudUxpc3RbbW92ZWRdKTtcbiAgICAvLyAgfVxuICAgIC8vfVxuXG4gICAgLy8gYWN0aW9uXG4gICAgY3RybC5icm93c2VyID0gZnVuY3Rpb24odXJsKTogdm9pZCB7XG4gICAgICAvL3NoZWxsKCkub3BlbkV4dGVybmFsKHVybCk7XG4gICAgICAkd2luZG93Lm9wZW4odXJsKTtcbiAgICB9O1xuICAgIGN0cmwuc2hvd0l0ZW1JbkZvbGRlciA9IGZ1bmN0aW9uKHBhdGgpOiB2b2lkIHtcbiAgICAgIC8vY29uc3QgZXhwYW5kZWQgPSBwYXRoLnJlcGxhY2UoJyRIT01FJywgaG9tZURpcik7XG4gICAgICAvL3NoZWxsKCkuc2hvd0l0ZW1JbkZvbGRlcihleHBhbmRlZCk7XG4gICAgfTtcbiAgICBjdHJsLnNob3dTeXN0ZW1XaW5kb3cgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgIC8vaXBjUmVuZGVyZXIoKS5zZW5kKCdzaG93U3lzdGVtV2luZG93JywgJ3N5c3RlbScpO1xuICAgIH07XG4gIH1dKTtcblxuIl19
