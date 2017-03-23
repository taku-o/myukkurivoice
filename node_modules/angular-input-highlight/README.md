# angular-input-highlight

This directive allows to highlight a text in `textarea` by regular expression or substring.

Additionaly it tracks position of all highlighter fragments. So you can use it for positioning other overlay elements like tooltips.

- **No external dependencies**
- **No extra markup (uses background image)**
- **No stylesheets**

Please [see demo](http://yavorskiy.github.io/angular-input-highlight/)

### Installation

Get it with Bower `bower i angular-input-highlight` or with npm `npm i angular-input-highlight`

### Usage

```html
<textarea ng-model="..."
  highlight="format"
  highlight-onchange="list($markers)"></textarea>
```

where `matches` is a map of Color - RegExp/String pairs. Color string should be whatever suites CSS color value, e.g.

```javascript
format = {
   'red'             : /\d+/g,
   '#00ff00'         : /@[a-z0-9]/ig,
   'rgba(0,0,1,0.5)' : 'hello'
}
```

### Limitations

- You can apply it only to `textarea`. In some cases `input[type=text]` could work but there is no way to track text scrolling inside it
- If target `textarea` is resizable then horizontal resizing will be disabled by directive
- **IE9+**, also you may need to explicitly define `font-family` style property for `textarea` in IE.

### Contibuting

Fill free to suggest improvements.
Run `npm start` to mess with the code.
