// angular command service
class CommandService implements yubo.CommandService {
  constructor(
    private MessageService: yubo.MessageService,
    private YCommandInput: yubo.YCommandInput
  ) {}

  containsCommand(input: string, yvoiceList: yubo.YVoice[]): boolean {
    // command name list
    const nameList: string[] = [];
    angular.forEach(yvoiceList, (voice) => {
      nameList.push(voice.name);
    });

    // loop and command name check.
    const re = new RegExp('^(.+?)＞', 'gm');
    let hasCommand = false;
    let matched = re.exec(input);
    while (matched) {
      const name = matched[1];
      // error, unknown command name
      if (nameList.indexOf(name) < 0) {
        this.MessageService.error(`${'マルチボイスに未知の名前が指定されました。name:'}${name}`);
        return false;
      }
      hasCommand = true;
      matched = re.exec(input);
    }
    return hasCommand;
  }

  parseInput(input: string, yvoiceList: yubo.YVoice[], currentYvoice: yubo.YVoice): yubo.YCommandInput[] {
    const parsed: yubo.YCommandInput[] = [];
    const lines = input.split(/\n/);

    // parse lines
    angular.forEach(lines, (line) => {
      const re = new RegExp('^(.+?)＞(.*)$');
      const matched = re.exec(line);

      // command line
      if (matched) {
        const ycinputForC = angular.copy(this.YCommandInput);
        ycinputForC.name = matched[1];
        ycinputForC.text = matched[2];
        parsed.push(ycinputForC);
      // not a command line
      } else {
        if (parsed.length < 1) {
          const ycinputForNotC = angular.copy(this.YCommandInput);
          ycinputForNotC.name = currentYvoice.name;
          ycinputForNotC.text = line;
          parsed.push(ycinputForNotC);
        } else {
          // append to last item
          const last = parsed[parsed.length - 1];
          last.text = `${last.text}\n${line}`;
        }
      }
    });
    return parsed;
  }

  detectVoiceConfig(commandInput: yubo.YCommandInput, yvoiceList: yubo.YVoice[]): yubo.YVoice | null {
    for (let i=0; i<yvoiceList.length; i++) {
      if (yvoiceList[i].name == commandInput.name) {
        return yvoiceList[i];
      }
    }
    return null;
  }

  toString(commandInputList: yubo.YCommandInput[]): string {
    let result = '';
    angular.forEach(commandInputList, (cinput) => {
      result = `${result}${cinput.name}${'＞'}${cinput.text}\n`;
    });
    return result;
  }
}

angular.module('CommandServices', ['MessageServices', 'mainModels'])
  .service('CommandService', [
    'MessageService',
    'YCommandInput',
    CommandService,
  ]);
