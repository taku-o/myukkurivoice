_countScrollbar = null  
countScrollbar = ->
  return _countScrollbar if _countScrollbar != null
  t = document.createElement('textarea');
  t.style.width   = '50px';
  t.style.height  = '50px';
  t.style.border  = 'none';
  t.style.padding = '0';

  document.body.appendChild(t);
  _countScrollbar = t.clientWidth != window.getComputedStyle(t).width
  document.body.removeChild(t)

  _countScrollbar

angular.module 'input-highlight', []
  .directive 'highlight', ['$parse', ($parse) ->
    restrict   : 'A'
    link       : (scope, el, attrs) ->
      input = el[0]
      return unless input.tagName is 'TEXTAREA'

      spread    = 2
      mirror    = angular.element('<div style="position:relative"></div>')[0]
      container = angular.element('<div style="position:absolute;width:0px;height:0px;overflow:hidden;"></div>')[0]
      sizeProps = ['width', 
        'font-size', 'font-family', 'font-style', 'font-weight', 'font-variant', 'font-stretch',
        'line-height', 'vertical-align', 'word-spacing', 'text-align', 'letter-spacing', 'text-rendering'
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'box-sizing']

      sizeProps.push 'overflow-y' if countScrollbar()

      document.body.appendChild container
      container.appendChild mirror

      el.css
        'background-position' : '0 0'
        'background-repeat'   : 'no-repeat'

      style = window.getComputedStyle input
      mirror.style['white-space'] = 'pre-wrap'
      mirror.style['width']

      for prop in sizeProps
        mirror.style[prop] = style[prop]

      el.css 'resize', 'vertical' if style['resize'] is 'both'
      el.css 'resize', 'none'     if style['resize'] is 'horizontal'

      formatting = scope[attrs.highlight] or {}

      onChange = angular.noop
      if attrs.highlightOnchange
        onChange = do ->
          fn = $parse attrs.highlightOnchange
          (markers) -> fn scope, $markers: markers

      canvas = document.createElement('canvas')
      ctx    = canvas.getContext('2d')

      render = (text) ->
        markers      = []
        originalText = text

        mirror.innerHTML = text
        mirror.style.width = style.width;
        canvas.width  = mirror.clientWidth
        canvas.height = mirror.clientHeight

        for color, re of formatting
          mirror.innerHTML = text.replace re, (s) ->
            "<span style=\"position:relative;background:red;\" data-marker=\"#{color}\">#{s}</span>"

          containerRect = mirror.getClientRects()[0]
          offsetX = containerRect.left
          offsetY = containerRect.top

          for marker in mirror.querySelectorAll 'span[data-marker]'
            data =
              text   : marker.innerHTML
              color  : marker.getAttribute 'data-marker'

            rects = []

            for rect in marker.getClientRects()
              coords =
                x      : rect.left - offsetX - spread
                y      : rect.top - offsetY
                width  : rect.width  + 2 * spread - 1
                height : rect.height + 1

              ctx.fillStyle = color
              ctx.fillRect coords.x, coords.y, coords.width, coords.height

              rects.push coords

            data.rects = rects
            markers.push data

        el.css 'background-image', "url(#{canvas.toDataURL()})"
        onChange markers

      if attrs.ngModel
        scope.$watch attrs.ngModel, render
      else
        render input.value
        anguar.element input
          .on 'change', -> render this.value

      scope.$watch attrs.highlight, (_formatting) ->
        formatting = _formatting or {}
        render input.value
      , true

      scope.$on '$destroy', ->
        container.parentNode.removeChild container

      el.on 'scroll', ->
        el.css 'background-position', "0 -#{input.scrollTop}px"
  ]

