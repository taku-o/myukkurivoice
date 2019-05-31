class MainStore implements yubo.MainStore {
  constructor(
    YInput: yubo.YInput
  ) {
    this.yinput = angular.copy(YInput);
  }

  yinput: yubo.YInput;
  curYvoice: yubo.YVoice;
  yvoiceList: yubo.YVoice[];

  duration: number;
  lastWavFile: yubo.IRecordMessage = null;

  sourceHighlight: {[key: string]: string} = {
    '#619FFF' : '{{ sourceHighlight["#619FFF"] }}',
  };
  encodedHighlight: {[key: string]: string} = {
    '#619FFF' : '{{ encodedHighlight["#619FFF"] }}',
  };

  display: string = 'main';
  alwaysOnTop: boolean = false;
  showTypeMessageList: boolean = true;
  messageList: (yubo.IMessage | yubo.IRecordMessage | yubo.ISourceMessage)[] = [];
  generatedList: yubo.IRecordMessage[] = [];
}

angular.module('mainStores', ['mainModels'])
  .service('MainStore', [
    'YInput',
    MainStore,
  ]);
