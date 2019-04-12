class MainStore implements yubo.MainStore {
  constructor(
  ) {}
  messageList: (yubo.IMessage | yubo.IRecordMessage | yubo.ISourceMessage)[] = [];
  generatedList: yubo.IRecordMessage[] = [];
}

angular.module('mainStores', [])
  .service('MainStore', [
    MainStore,
  ]);
