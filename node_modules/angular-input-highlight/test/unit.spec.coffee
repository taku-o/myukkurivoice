
describe 'angular-input-highlight', ->
  el       = null
  el2      = null
  scope    = null
  markers  = []

  beforeEach module 'input-highlight'
  beforeEach inject ($compile, $rootScope) ->
    scope    = $rootScope.$new()
    scope.text   = '123 abc 123'
    scope.format = '#f00': /\d+/g
    scope.list   = ($markers) -> markers = $markers
    
    textarea = angular.element '<textarea ng-model="text" highlight="format" highlight-onchange="list($markers)"></textarea>'
    angular.element(document.body).append textarea
    el = $compile(textarea)(scope)
  
  # --------------------------------------
  
  it 'Sets the background image', ->
    scope.$digest()
    expect el.css 'background-image'
      .to.match /data:image\/png;base64/

  # --------------------------------------
  
  it 'Returns highlighted fragments', ->
    scope.$digest()
    expect markers.length
      .to.be.eq 2

  # --------------------------------------
 
  it 'Reacts on ng-model changes', ->
    scope.$digest()
    expect markers.length
      .to.be.eq 2

    prevImg = el.css 'background-image'
    
    scope.text = '123 abc'
    scope.$digest()

    expect markers.length
      .to.be.eq 1
    
    expect prevImg
      .to.be.not.eq el.css 'background-image'

  # --------------------------------------

  it 'Reacts on matchers changes', ->
    scope.$digest()
    expect markers.length
      .to.be.eq 2

    scope.format = 'red': /[a-z]+/g
    scope.$digest()

    expect markers.length
      .to.be.eq 1

  # --------------------------------------

  it 'Returns fragments with certain structure', ->
    scope.$digest()
    
    expect markers[0]
      .to.be.an 'object'

    expect markers[0].color
      .to.be.eq '#f00'

    for prop, type of (
      rects  : 'array'
      color  : 'string'
      text   : 'string'
    ) 
      expect markers[0][prop]
        .to.be.a type
      
    for prop, type of (
      x      : 'number'
      y      : 'number'
      width  : 'number'
      height : 'number'
    )
      expect markers[0].rects[0][prop]
        .to.be.a type

  # --------------------------------------

  it 'Handles multiple matchers', ->
    scope.format = 
      'red'   : /\d+/g
      'green' : /[a-z]+/ig

    scope.$digest()
    expect markers.length
      .to.be.eq 3

  # --------------------------------------

  it 'Handles textarea with no ng-model', ->
    scope.$digest()
    
    expect markers.length
      .to.be.eq 2

    e = document.createEvent 'Event'
    e.initEvent 'change', true, true
    
    el[0].value = '123 abc'
    el[0].dispatchEvent e

    expect markers.length
      .to.be.eq 1






