// angular command service
angular.module('yvoiceCommandService', ['yvoiceMessageService', 'yvoiceModel'])
    .factory('CommandService', ['MessageService', 'YCommandInput', function (MessageService, YCommandInput) {
        return {
            containsCommand: function (input, yvoiceList) {
                // command name list
                var nameList = [];
                angular.forEach(yvoiceList, function (voice) {
                    nameList.push(voice.name);
                });
                // loop and command name check.
                var re = new RegExp('^(.+?)＞', 'gm');
                var hasCommand = false;
                var matched = re.exec(input);
                while (matched) {
                    var name = matched[1];
                    // error, unknown command name
                    if (nameList.indexOf(name) < 0) {
                        MessageService.error('マルチボイスに未知の名前が指定されました。name:' + name);
                        return false;
                    }
                    hasCommand = true;
                    matched = re.exec(input);
                }
                return hasCommand;
            },
            parseInput: function (input, yvoiceList, currentYvoice) {
                var parsed = [];
                var lines = input.split(/\n/);
                // parse lines
                angular.forEach(lines, function (line) {
                    var re = new RegExp('^(.+?)＞(.*)$');
                    var matched = re.exec(line);
                    // command line
                    if (matched) {
                        var ycinput = angular.copy(YCommandInput);
                        ycinput.name = matched[1];
                        ycinput.text = matched[2];
                        parsed.push(ycinput);
                        // not a command line
                    }
                    else {
                        if (parsed.length < 1) {
                            var ycinput = angular.copy(YCommandInput);
                            ycinput.name = currentYvoice.name;
                            ycinput.text = line;
                            parsed.push(ycinput);
                        }
                        else {
                            // append to last item
                            var last = parsed[parsed.length - 1];
                            last.text += ("\n" + line);
                        }
                    }
                });
                return parsed;
            },
            detectVoiceConfig: function (commandInput, yvoiceList) {
                for (var i = 0; i < yvoiceList.length; i++) {
                    if (yvoiceList[i].name == commandInput.name) {
                        return yvoiceList[i];
                    }
                }
                return null;
            },
            toString: function (commandInputList) {
                var result = '';
                angular.forEach(commandInputList, function (cinput) {
                    result += cinput.name + '＞' + cinput.text + "\n";
                });
                return result;
            }
        };
    }]);
