class MainStore implements yubo.MainStore {
  constructor(
  ) {}

  //yinput:              yubo.YInput;
  //yvoice:              yubo.YVoice;
  //yvoiceList:          yubo.YVoice[];
  //phontList:           yubo.YPhont[];
  //appCfg:              AppCfg;
  duration: number;
  //lastWavFile:         yubo.IRecordMessage;
  //encodedHighlight:    {[key: string]: string};
  //sourceHighlight:     {[key: string]: string};
  //aq10BasList:         {name: string, id: number}[];
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
