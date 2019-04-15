class MainStore implements yubo.MainStore {
  constructor(
  ) {}

  //yinput:              yubo.YInput;
  //yvoice:              yubo.YVoice;
  //yvoiceList:          yubo.YVoice[];
  //appCfg:              AppCfg;
  duration: number;
  lastWavFile: yubo.IRecordMessage = null;
  //encodedHighlight:    {[key: string]: string};
  //sourceHighlight:     {[key: string]: string};
  display: string = 'main';
  alwaysOnTop: boolean = false;
  showTypeMessageList: boolean = true;
  messageList: (yubo.IMessage | yubo.IRecordMessage | yubo.ISourceMessage)[] = [];
  generatedList: yubo.IRecordMessage[] = [];
}

angular.module('mainStores', [])
  .service('MainStore', [
    MainStore,
  ]);
