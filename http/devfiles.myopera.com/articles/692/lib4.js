/*
 * © 2009 ROBO Design
 * http://www.robodesign.ro
 *
 * $Date: 2009-04-22 15:39:50 +0300 $
 */

/**
 * @author <a lang="ro" href="http://www.robodesign.ro/mihai">Mihai Şucan</a>
 * @fileOverview Minimal JavaScript library which provides functionality for 
 * cross-browser compatibility support.
 */

/**
 * @namespace Holds methods and properties necessary throughout the entire 
 * application.
 */
var lib = {};

/**
 * This function extends objects.
 *
 * @example
 * <code>var <var>obj1</var> = {a: 'a1', b: 'b1', d: 'd1'},
 *     <var>obj2</var> = {a: 'a2', b: 'b2', c: 'c2'};
 * 
 * lib.extend(<var>obj1</var>, <var>obj2</var>);</code>
 * 
 * // Now <var>obj1.c == 'c2'</var>, while <var>obj1.a</var>, <var>obj1.b</var>
 * // and <var>obj1.d</var> remain the same.
 *
 * // If <code>lib.extend(true, <var>obj1</var>, <var>obj2</var>)</code> is
 * // called, then <var>obj1.a</var>, <var>obj1.b</var>, <var>obj1.c</var>
 * // become all the same as in <var>obj2</var>.
 *
 * @example
 * <code>var <var>obj1</var> = {a: 'a1', b: 'b1', extend: lib.extend};
 * <var>obj1</var>.extend({c: 'c1', d: 'd1'});</code>
 *
 * // In this case the destination object which is to be extend is
 * // <var>obj1</var>.
 *
 * @param {Boolean} [overwrite=false] If the first argument is a boolean, then 
 * it will be considered as a boolean flag for overwriting (or not) any existing 
 * methods and properties in the destination object. Thus, any method and 
 * property from the source object will take over those in the destination. The 
 * argument is optional, and if it's omitted, then no method/property will be 
 * overwritten.
 *
 * @param {Object} [destination=this] The second argument is the optional 
 * destination object: the object which will be extended. By default, the 
 * <var>this</var> object will be extended.
 *
 * @param {Object} source The third argument must provide list of methods and 
 * properties which will be added to the destination object.
 */
lib.extend = function () {
  var i = 0,
      len = arguments.length,
      name, src, sval, dval;

  if (typeof arguments[0] == 'boolean') {
    force = arguments[0];
    dest  = arguments[1];
    src   = arguments[2];
  } else {
    force = false;
    dest  = arguments[0];
    src   = arguments[1];
  }

  if (typeof src == 'undefined') {
    src = dest;
    dest = this;
  }

  if (typeof dest == 'undefined') {
    return;
  }

  for (name in src) {
    sval = src[name];
    dval = dest[name];
    if (force || typeof dval == 'undefined') {
      dest[name] = sval;
    }
  }
};

/**
 * @namespace Holds browser information.
 */
lib.browser = {};

(function () {
var ua = '';

if (window.navigator && window.navigator.userAgent) {
  ua = window.navigator.userAgent.toLowerCase();
}

/**
 * @type Boolean
 */
lib.browser.opera = window.opera ? true : /\bopera\b/.test(ua);

/**
 * Webkit is the render engine used primarily by Safari. It's also used by 
 * Google Chrome and GNOME Epiphany.
 *
 * @type Boolean
 */
lib.browser.webkit = /\b(applewebkit|webkit)\b/.test(ua);

/**
 * Firefox uses the Gecko render engine.
 *
 * @type Boolean
 */
// In some variations of the User Agent strings provided by Opera, Firefox is 
// mentioned.
lib.browser.firefox = /\bfirefox\b/.test(ua) && !lib.browser.opera;

/**
 * Gecko is the render engine used by Firefox and related products.
 *
 * @type Boolean
 */
// Typically, the user agent string of WebKit also mentions Gecko. Additionally, 
// Opera mentions Gecko for tricking some sites.
lib.browser.gecko = /\bgecko\b/.test(ua) && !lib.browser.opera && !lib.browser.webkit;

/**
 * Microsoft Internet Explorer. The future of computing.
 *
 * @type Boolean
 */
// Again, Opera allows users to easily fake the UA.
lib.browser.msie = /\bmsie\b/.test(ua) && !lib.browser.opera;

/**
 * Presto is the render engine used by Opera.
 *
 * @type Boolean
 */
// Older versions of Opera did not mention Presto in the UA string.
lib.browser.presto = /\bpresto\b/.test(ua) || lib.browser.opera;


/**
 * Browser operating system
 *
 * @type String
 */
lib.browser.os = (ua.match(/\b(windows|linux)\b/) || [])[1];

delete ua;
})();


/**
 * @namespace Holds methods and properties necessary for DOM manipulation.
 */
lib.dom = {};

/**
 * @namespace Holds the list of virtual key identifiers and a few characters, 
 * each being associated to a key code commonly used by Web browsers.
 *
 * @private
 */
lib.dom.keyNames = {
  Help:          6,
  Backspace:     8,
  Tab:           9,
  Clear:         12,
  Enter:         13,
  Shift:         16,
  Control:       17,
  Alt:           18,
  Pause:         19,
  CapsLock:      20,
  Cancel:        24,
  'Escape':      27,
  Space:         32,
  PageUp:        33,
  PageDown:      34,
  End:           35,
  Home:          36,
  Left:          37,
  Up:            38,
  Right:         39,
  Down:          40,
  PrintScreen:   44,
  Insert:        45,
  'Delete':      46,
  Win:           91,
  ContextMenu:   93,
  '*':           106,
  '+':           107,
  F1:            112,
  F2:            113,
  F3:            114,
  F4:            115,
  F5:            116,
  F6:            117,
  F7:            118,
  F8:            119,
  F9:            120,
  F10:           121,
  F11:           122,
  F12:           123,
  NumLock:       144,
  ';':           186,
  '=':           187,
  ',':           188,
  '-':           189,
  '.':           190,
  '/':           191,
  '`':           192,
  '[':           219,
  '\\':          220,
  ']':           221,
  "'":           222
};

/**
 * @namespace Holds the list of codes, each being associated to a virtual key 
 * identifier.
 *
 * @private
 */
lib.dom.keyCodes = {
  /*
   * For almost each key code, these comments give the key name, the 
   * keyIdentifier from the DOM 3 Events spec and the Unicode character 
   * information (if you would use the decimal code for direct conversion to 
   * a character, e.g. String.fromCharCode()). Obviously, the Unicode character 
   * information is not to be used, since these are only virtual key codes (not 
   * really char codes) associated to key names.
   *
   * Each key name in here tries to follow the same style as the defined 
   * keyIdentifiers from the DOM 3 Events. Thus for the Page Down button, 
   * 'PageDown' is used (not other variations like 'pag-up'), and so on.
   *
   * Multiple key codes might be associated to the same key - it's not an error.
   *
   * Note that this list is not an exhaustive key codes list. This means that 
   * for key A or for key 0, the script will do String.fromCharCode(keyCode), to 
   * determine the key. For the case of alpha-numeric keys, this works fine.
   */

  /*
   * Key: Enter
   * Unicode: U+0003 [End of text]
   *
   * Note 1: This keyCode is only used in Safari 2 (older Webkit) for the Enter 
   * key.
   *
   * Note 2: In Gecko this keyCode is used for the Cancel key (see 
   * DOM_VK_CANCEL).
   */
  3: 'Enter',

  /*
   * Key: Help
   * Unicode: U+0006 [Acknowledge]
   *
   * Note: Taken from Gecko (DOM_VK_HELP).
   */
  6: 'Help',

  /*
   * Key: Backspace
   * Unicode: U+0008 [Backspace]
   * keyIdentifier: U+0008
   */
  8: 'Backspace',

  /*
   * Key: Tab
   * Unicode: U+0009 [Horizontal tab]
   * keyIdentifier: U+0009
   */
  9: 'Tab',

  /*
   * Key: Enter
   * Unicode: U+0010 [Line feed (LF) / New line (NL) / End of line (EOL)]
   *
   * Note: Taken from the Unicode characters list. If it ends up as a keyCode in 
   * some event, it's simply considered as being the Enter key.
   */
  10: 'Enter',

  /*
   * Key: NumPad_Center
   * Unicode: U+000C [Form feed]
   * keyIdentifier: Clear
   *
   * Note 1: This keyCode is used when NumLock is off, and the user pressed the 
   * 5 key on the numeric pad.
   *
   * Note 2: Safari 2 (older Webkit) assigns this keyCode to the NumLock key 
   * itself.
   */
  12: 'Clear',

  /*
   * Key: Enter
   * Unicode: U+000D [Carriage return (CR)]
   * keyIdentifier: Enter
   *
   * Note 1: This is the keyCode used by most of the Web browsers when the Enter 
   * key is pressed.
   *
   * Note 2: Gecko associates the DOM_VK_RETURN to this keyCode.
   */
  13: 'Enter',

  /*
   * Key: Enter
   * Unicode: U+000E [Shift out]
   *
   * Note: Taken from Gecko (DOM_VK_ENTER).
   */
  14: 'Enter',

  /*
   * Key: Shift
   * Unicode: U+0010 [Data link escape]
   * keyIdentifier: Shift
   *
   * Note: In older Safari (Webkit) versions Shift+Tab is assigned a different 
   * keyCode: keyCode 25.
   */
  16: 'Shift',

  /*
   * Key: Control
   * Unicode: U+0011 [Device control one]
   * keyIdentifier: Control
   */
  17: 'Control',

  /*
   * Key: Alt
   * Unicode: U+0012 [Device control two]
   * keyIdentifier: Alt
   */
  18: 'Alt',

  /*
   * Key: Pause
   * Unicode: U+0013 [Device control three]
   * keyIdentifier: Pause
   */
  19: 'Pause',

  /*
   * Key: CapsLock
   * Unicode: U+0014 [Device control four]
   * keyIdentifier: CapsLock
   */
  20: 'CapsLock',

  /*
   * Key: Cancel
   * Unicode: U+0018 [Cancel]
   * keyIdentifier: U+0018
   */
  24: 'Cancel',

  /*
   * Key: Escape
   * Unicode: U+001B [Escape]
   * keyIdentifier: U+001B
   */
  27: 'Escape',

  /*
   * Key: Space
   * Unicode: U+0020 [Space]
   * keyIdentifier: U+0020
   */
  32: 'Space',

  /*
   * Key: PageUp or NumPad_North_East
   * Unicode: U+0021 ! [Exclamation mark]
   * keyIdentifier: PageUp
   */
  33: 'PageUp',

  /*
   * Key: PageDown or NumPad_South_East
   * Unicode: U+0022 " [Quotation mark]
   * keyIdentifier: PageDown
   */
  34: 'PageDown',

  /*
   * Key: End or NumPad_South_West
   * Unicode: U+0023 # [Number sign]
   * keyIdentifier: PageDown
   */
  35: 'End',

  /*
   * Key: Home or NumPad_North_West
   * Unicode: U+0024 $ [Dollar sign]
   * keyIdentifier: Home
   */
  36: 'Home',

  /*
   * Key: Left or NumPad_West
   * Unicode: U+0025 % [Percent sign]
   * keyIdentifier: Left
   */
  37: 'Left',

  /*
   * Key: Up or NumPad_North
   * Unicode: U+0026 & [Ampersand]
   * keyIdentifier: Up
   */
  38: 'Up',

  /*
   * Key: Right or NumPad_East
   * Unicode: U+0027 ' [Apostrophe]
   * keyIdentifier: Right
   */
  39: 'Right',

  /*
   * Key: Down or NumPad_South
   * Unicode: U+0028 ( [Left parenthesis]
   * keyIdentifier: Down
   */
  40: 'Down',

  /*
   * Key: PrintScreen
   * Unicode: U+002C , [Comma]
   * keyIdentifier: PrintScreen
   */
  //44: 'PrintScreen',

  /*
   * Key: Insert or NumPad_Insert
   * Unicode: U+002D - [Hyphen-Minus]
   * keyIdentifier: Insert
   */
  45: 'Insert',

  /*
   * Key: Delete or NumPad_Delete
   * Unicode: U+002E . [Full stop / period]
   * keyIdentifier: U+007F
   */
  46: 'Delete',

  /*
   * Key: WinLeft
   * Unicode: U+005B [ [Left square bracket]
   * keyIdentifier: Win
   *
   * Disabled: rarely needed.
   */
  //91: 'Win',

  /*
   * Key: WinRight
   * Unicode: U+005C \ [Reverse solidus / Backslash]
   * keyIdentifier: Win
   */
  //92: 'Win',

  /*
   * Key: Menu/ContextMenu
   * Unicode: U+005D ] [Right square bracket]
   * keyIdentifier: ...
   *
   * Disabled: Is it Meta? Is it Menu, ContextMenu, what? Too much mess.
   */
  //93: 'ContextMenu',

  /*
   * Key: NumPad_0
   * Unicode: U+0060 ` [Grave accent]
   * keyIdentifier: 0
   */
  96: '0',

  /*
   * Key: NumPad_1
   * Unicode: U+0061 a [Latin small letter a]
   * keyIdentifier: 1
   */
  97: '1',

  /*
   * Key: NumPad_2
   * Unicode: U+0062 b [Latin small letter b]
   * keyIdentifier: 2
   */
  98: '2',

  /*
   * Key: NumPad_3
   * Unicode: U+0063 c [Latin small letter c]
   * keyIdentifier: 3
   */
  99: '3',

  /*
   * Key: NumPad_4
   * Unicode: U+0064 d [Latin small letter d]
   * keyIdentifier: 4
   */
  100: '4',

  /*
   * Key: NumPad_5
   * Unicode: U+0065 e [Latin small letter e]
   * keyIdentifier: 5
   */
  101: '5',

  /*
   * Key: NumPad_6
   * Unicode: U+0066 f [Latin small letter f]
   * keyIdentifier: 6
   */
  102: '6',

  /*
   * Key: NumPad_7
   * Unicode: U+0067 g [Latin small letter g]
   * keyIdentifier: 7
   */
  103: '7',

  /*
   * Key: NumPad_8
   * Unicode: U+0068 h [Latin small letter h]
   * keyIdentifier: 8
   */
  104: '8',

  /*
   * Key: NumPad_9
   * Unicode: U+0069 i [Latin small letter i]
   * keyIdentifier: 9
   */
  105: '9',

  /*
   * Key: NumPad_Multiply
   * Unicode: U+0070 j [Latin small letter j]
   * keyIdentifier: U+002A * [Asterisk / Star]
   */
  106: '*',

  /*
   * Key: NumPad_Plus
   * Unicode: U+0071 k [Latin small letter k]
   * keyIdentifier: U+002B + [Plus]
   */
  107: '+',

  /*
   * Key: NumPad_Minus
   * Unicode: U+0073 m [Latin small letter m]
   * keyIdentifier: U+002D + [Hyphen / Minus]
   */
  109: '-',

  /*
   * Key: NumPad_Period
   * Unicode: U+0074 n [Latin small letter n]
   * keyIdentifier: U+002E . [Period]
   */
  110: '.',

  /*
   * Key: NumPad_Division
   * Unicode: U+0075 o [Latin small letter o]
   * keyIdentifier: U+002F / [Solidus / Slash]
   */
  111: '/',

  112: 'F1',                // p
  113: 'F2',                // q
  114: 'F3',                // r
  115: 'F4',                // s
  116: 'F5',                // t
  117: 'F6',                // u
  118: 'F7',                // v
  119: 'F8',                // w
  120: 'F9',                // x
  121: 'F10',               // y
  122: 'F11',               // z
  123: 'F12',               // {

  /*
   * Key: Delete
   * Unicode: U+007F [Delete]
   * keyIdentifier: U+007F
   */
  127: 'Delete',

  /*
   * Key: NumLock
   * Unicode: U+0090 [Device control string]
   * keyIdentifier: NumLock
   */
  144: 'NumLock',

  186: ';',                 // º (Masculine ordinal indicator)
  187: '=',                 // »
  188: ',',                 // ¼
  189: '-',                 // ½
  190: '.',                 // ¾
  191: '/',                 // ¿
  192: '`',                 // À
  219: '[',                 // Û
  220: '\\',                // Ü
  221: ']',                 // Ý
  222: "'"                  // Þ (Latin capital letter thorn)

  //224: 'Win',               // à
  //229: 'WinIME',            // å or WinIME or something else in Webkit
  //255: 'NumLock',           // ÿ, Gecko and Chrome, Windows XP in VirtualBox
  //376: 'NumLock'            // Ÿ, Opera, Windows XP in VirtualBox
};

if (lib.browser.gecko) {
  lib.dom.keyCodes[3] = 'Cancel'; // DOM_VK_CANCEL
}

/**
 * @namespace Holds a list of common wrong key codes in Web browsers.
 *
 * @private
 */
lib.dom.keyCodes_fixes = {
  42:   lib.dom.keyNames['*'],          // char * to key *
  47:   lib.dom.keyNames['/'],          // char / to key /
  59:   lib.dom.keyNames[';'],          // char ; to key ;
  61:   lib.dom.keyNames['='],          // char = to key =
  96:   48,                             // NumPad_0 to char 0
  97:   49,                             // NumPad_1 to char 1
  98:   50,                             // NumPad_2 to char 2
  99:   51,                             // NumPad_3 to char 3
  100:  52,                             // NumPad_4 to char 4
  101:  53,                             // NumPad_5 to char 5
  102:  54,                             // NumPad_6 to char 6
  103:  55,                             // NumPad_7 to char 7
  104:  56,                             // NumPad_8 to char 8
  105:  57,                             // NumPad_9 to char 9
  //106:  56,                           // NumPad_Multiply to char 8
  //107:  187,                          // NumPad_Plus to key =
  109:  lib.dom.keyNames['-'],          // NumPad_Minus to key -
  110:  lib.dom.keyNames['.'],          // NumPad_Period to key .
  111:  lib.dom.keyNames['/']           // NumPad_Division to key /
};

/**
 * @namespace Holds the list of broken key codes generated by older Webkit 
 * (Safari 2).
 *
 * @private
 */
lib.dom.keyCodes_Safari2 = {
  63232: lib.dom.keyNames.Up,               // 38
  63233: lib.dom.keyNames.Down,             // 40
  63234: lib.dom.keyNames.Left,             // 37
  63235: lib.dom.keyNames.Right,            // 39
  63236: lib.dom.keyNames.F1,               // 112
  63237: lib.dom.keyNames.F2,               // 113
  63238: lib.dom.keyNames.F3,               // 114
  63239: lib.dom.keyNames.F4,               // 115
  63240: lib.dom.keyNames.F5,               // 116
  63241: lib.dom.keyNames.F6,               // 117
  63242: lib.dom.keyNames.F7,               // 118
  63243: lib.dom.keyNames.F8,               // 119
  63244: lib.dom.keyNames.F9,               // 120
  63245: lib.dom.keyNames.F10,              // 121
  63246: lib.dom.keyNames.F11,              // 122
  63247: lib.dom.keyNames.F12,              // 123
  63248: lib.dom.keyNames.PrintScreen,      // 44
  63272: lib.dom.keyNames['Delete'],        // 46
  63273: lib.dom.keyNames.Home,             // 36
  63275: lib.dom.keyNames.End,              // 35
  63276: lib.dom.keyNames.PageUp,           // 33
  63277: lib.dom.keyNames.PageDown,         // 34
  63289: lib.dom.keyNames.NumLock,          // 144
  63302: lib.dom.keyNames.Insert            // 45
};


/**
 * A complete keyboard events cross-browser compatibility layer.
 *
 * <p>Unfortunately, due to the important differences across Web browsers, 
 * simply using the available properties in a single keyboard event is not 
 * enough to accurately determine the key the user pressed. Thus, one needs to 
 * have event handlers for all keyboard-related events <code>keydown</code>, 
 * <code>keypress</code> and <code>keyup</code>.
 *
 * <p>This class provides a complete keyboard event compatibility layer. For any 
 * new instance you provide the DOM element you want to listen events for, and 
 * the event handlers for any of the three events <code>keydown</code> 
 * / <code>keypress</code> / <code>keyup</code>.
 *
 * <p>Your event handlers will receive the original DOM Event object, with 
 * several new properties defined:
 *
 * <ul>
 *   <li><var>event.keyCode_</var> holds the correct code for event key.
 *
 *   <li><var>event.key_</var> holds the key the user pressed. It can be either 
 *   a key name like "PageDown", "Delete", "Enter", or it is a character like 
 *   "A", "1", or "[".
 *
 *   <li><var>event.charCode_</var> holds the Unicode character decimal code.
 *
 *   <li><var>event.char_</var> holds the character generated by the event.
 *
 *   <li><var>event.repeat_</var> is a boolean property telling if the 
 *   <code>keypress</code> event is repeated - the user is holding down the key 
 *   for a long-enough period of time to generate multiple events.
 * </ul>
 *
 * <p>The character-related properties, <var>charCode_</var> and 
 * <var>char_</var> are only available in the <code>keypress</code> and 
 * <code>keyup</code> event objects.
 *
 * <p>This class will ensure that the <code>keypress</code> event is always 
 * fired in Webkit and MSIE for all keys, except modifiers. For modifier keys 
 * like <kbd>Shift</kbd>, <kbd>Control</kbd>, and <kbd>Alt</kbd>, the 
 * <code>keypress</code> event will not be fired, even if the Web browser does 
 * it.
 *
 * <p>Some user agents like Webkit repeat the <code>keydown</code> event while 
 * the user holds down a key. This class will ensure that only the 
 * <code>keypress</code> event is repeated.
 *
 * <p>If you want to prevent the default action for an event, you should prevent 
 * it on <code>keypress</code>. This class will prevent the default action for 
 * <code>keydown</code> if need (in MSIE).
 *
 * @example
 * <code>var <var>klogger</var> = function (<var>ev</var>) {
 *   console.log(<var>ev</var>.type +
 *     ' keyCode_ ' + <var>ev</var>.keyCode_ +
 *     ' key_ ' + <var>ev</var>.key_ +
 *     ' charCode_ ' + <var>ev</var>.charCode_ +
 *     ' char_ ' + <var>ev</var>.char_ +
 *     ' repeat_ ' + <var>ev</var>.repeat_);
 * };
 *
 * var <var>kbListener</var> = new lib.dom.KeyboardEventListener(window,
 *               {keydown: <var>klogger</var>,
 *                keypress: <var>klogger</var>,
 *                keyup: <var>klogger</var>});</code>
 *
 * // later when you're done...
 * <code><var>kbListener</var>.detach();</code>
 *
 * @class A complete keyboard events cross-browser compatibility layer.
 *
 * @param {Element} elem_ The DOM Element you want to listen events for.
 *
 * @param {Object} handlers_ The object holding the list of event handlers 
 * associated to the name of each keyboard event you want to listen. To listen 
 * for all the three keyboard events use <code>{keydown: <var>fn1</var>, 
 * keypress: <var>fn2</var>, keyup: <var>fn3</var>}</code>.
 *
 * @throws {TypeError} If the <var>handlers_</var> object does not contain any 
 * event handler.
 */
lib.dom.KeyboardEventListener = function (elem_, handlers_) {
  /*
    Technical details:

    For the keyup and keydown events the keyCode provided is that of the virtual 
    key irrespective of other modifiers (e.g. Shift). Generally, during the 
    keypress event, the keyCode holds the Unicode value of the character 
    resulted from the key press, say an alphabetic upper/lower-case char, 
    depending on the actual intent of the user and depending on the currently 
    active keyboard layout.

    Examples:
    * Pressing p you get keyCode 80 in keyup/keydown, and keyCode 112 in 
    keypress.  String.fromCharCode(80) = 'P' and String.fromCharCode(112) = 'p'.
    * Pressing P you get keyCode 80 in all events.
    * Pressing F1 you get keyCode 112 in keyup, keydown and keypress.
    * Pressing 9 you get keyCode 57 in all events.
    * Pressing Shift+9 you get keyCode 57 in keyup/keydown, and keyCode 40 in 
    keypress. String.fromCharCode(57) = '9' and String.fromCharCode(40) = '('.

    * Using the Greek layout when you press v on an US keyboard you get the 
    output character ω. The keyup/keydown events hold keyCode 86 which is V.  
    This does make sense, since it's the virtual key code we are dealing with 
    - not the character code, not the result of pressing the key. The keypress 
    event will hold keyCode 969 (ω).

    * Pressing NumPad_Minus you get keyCode 109 in keyup/keydown and keyCode 45 
    in keypress. Again, this happens because in keyup/keydown you don't get the 
    character code, you get the key code, as indicated above. For
    your information: String.fromCharCode(109) = 'm' and String.fromCharCode(45) 
    = '-'.

    Therefore, we need to map all the codes of several keys, like F1-F12, 
    Escape, Enter, Tab, etc. This map is held by lib.dom.keyCodes. It associates, 
    for example, code 112 to F1, or 13 to Enter. This map is used to detect 
    virtual keys in all events.

    (This is only the general story, details about browser-specific differences 
    follow below.)

    If the code given by the browser doesn't appear in keyCode maps, it's used 
    as is.  The key_ returned is that of String.fromCharCode(keyCode).

    In all browsers we consider all events having keyCode <= 32, as being events  
    generated by a virtual key (not a character). As such, the keyCode value is 
    always searched in lib.dom.keyCodes.

    As you might notice from the above description, in the keypress event we 
    cannot tell the difference from say F1 and p, because both give the code 
    112. In Gecko and Webkit we can tell the difference because these UAs also 
    set the charCode event property when the key generates a character. If F1 is 
    pressed, or some other virtual key, charCode is never set.

    In Opera the charCode property is never set. However, the 'which' event 
    property is not set for several virtual keys. This means we can tell the 
    difference between a character and a virtual key. However, there's a catch: 
    not *all* virtual keys have the 'which' property unset. Known exceptions: 
    Backspace (8), Tab (9), Enter (13), Shift (16), Control (17), Alt (18), 
    Pause (19), Escape (27), End (35), Home (36), Insert (45), Delete (46) and 
    NumLock (144). Given we already consider any keyCode <= 32 being one of some 
    virtual key, fewer exceptions remain. We only have the End, Home, Insert, 
    Delete and the NumLock keys which cannot be 100% properly detected in the 
    keypress event, in Opera. To properly detect End/Home we can check if the 
    Shift modifier is active or not. If the user wants # instead of End, then 
    Shift must be active. The same goes for $ and Home. Thus we now only have 
    the '-' (Insert) and the '.' (Delete) characters incorrectly detected as 
    being Insert/Delete.
    
    The above brings us to one of the main visible difference, when comparing 
    the lib.dom.KeyboardEventListener class and the simple 
    lib.dom.KeyboardEvent.getKey() function. In getKey(), for the keypress event 
    we cannot accurately determine the exact key, because it requires checking
    the keyCode used for the keydown event. The KeyboardEventListener
    class monitors all the keyboard events, ensuring a more accurate key 
    detection.

    Different keyboard layouts and international characters are generally 
    supported. Tested and known to work with the Cyrillic alphabet (Greek 
    keyboard layout) and with the US Dvorak keyboard layouts.

    Opera does not fire the keyup event for international characters when 
    running on Linux. For example, this happens with the Greek keyboard layout, 
    when trying Cyrillic characters.

    Gecko gives no keyCode/charCode/which for international characters when 
    running on Linux, in the keyup/keydown events. Thus, all such keys remain 
    unidentified for these two events. For the keypress event there are no 
    issues with such characters.

    Webkit and Konqueror 4 also implement the keyIdentifier property from the 
    DOM 3 Events specification. In theory, this should be great, but it's not 
    without problems.  Sometimes keyCode/charCode/which are all 0, but 
    keyIdentifier is properly set. For several virtual keys the keyIdentifier 
    value is simply 'U+0000'. Thus, the keyIdentifier is used only if the value 
    is not 'Unidentified' / 'U+0000', and only when keyCode/charCode/which are 
    not available.

    Konqueror 4 does not use the 'U+XXXX' notation for Unicode characters. It 
    simply gives the character, directly.

    Additionally, Konqueror seems to have some problems with several keyCodes in 
    keydown/keyup. For example, the key '[' gives keyCode 91 instead of 219.  
    Thus, it effectively gives the Unicode for the character, not the key code.  
    This issue is visible with other key as well.

    NumPad_Clear is unidentified on Linux in all browsers, but it works on 
    Windows.

    In MSIE the keypress event is only fired for characters and for Escape, 
    Space and Enter. Similarly, Webkit only fires the keypress event for 
    characters. However, Webkit does not fire keypress for Escape.

    International characters and different keyboard layouts seem to work fine in 
    MSIE as well.

    As of MSIE 4.0, the keypress event fires for the following keys:
      * Letters: A - Z (uppercase and lowercase)
      * Numerals: 0 - 9
      * Symbols: ! @ # $ % ^ & * ( ) _ - + = < [ ] { } , . / ? \ | ' ` " ~
      * System: Escape (27), Space (32), Enter (13)

    Documentation about the keypress event:
    http://msdn.microsoft.com/en-us/library/ms536939(VS.85).aspx

    As of MSIE 4.0, the keydown event fires for the following keys:
      * Editing: Delete (46), Insert (45)
      * Function: F1 - F12
      * Letters: A - Z (uppercase and lowercase)
      * Navigation: Home, End, Left, Right, Up, Down
      * Numerals: 0 - 9
      * Symbols: ! @ # $ % ^ & * ( ) _ - + = < [ ] { } , . / ? \ | ' ` " ~
      * System: Escape (27), Space (32), Shift (16), Tab (9)

    As of MSIE 5, the event also fires for the following keys:
      * Editing: Backspace (8)
      * Navigation: PageUp (33), PageDown (34)
      * System: Shift+Tab (9)

    Documentation about the keydown event:
    http://msdn.microsoft.com/en-us/library/ms536938(VS.85).aspx

    As of MSIE 4.0, the keyup event fires for the following keys:
      * Editing: Delete, Insert
      * Function: F1 - F12
      * Letters: A - Z (uppercase and lowercase)
      * Navigation: Home (36), End (35), Left (37), Right (39), Up (38), Down (40)
      * Numerals: 0 - 9
      * Symbols: ! @ # $ % ^ & * ( ) _ - + = < [ ] { } , . / ? \ | ' ` " ~
      * System: Escape (27), Space (32), Shift (16), Tab (9)

    As of MSIE 5, the event also fires for the following keys:
      * Editing: Backspace (8)
      * Navigation: PageUp (33), PageDown (34)
      * System: Shift+Tab (9)

    Documentation about the keyup event:
    http://msdn.microsoft.com/en-us/library/ms536940(VS.85).aspx

    For further gory details and a different implementation see:
    http://code.google.com/p/doctype/source/browse/trunk/goog/events/keycodes.js
    http://code.google.com/p/doctype/source/browse/trunk/goog/events/keyhandler.js

    Opera keydown/keyup:
      These events fire for all keys, including for modifiers.
      keyCode is always set.
      charCode is never set.
      which is always set.
      keyIdentifier is always undefined.

    Opera keypress:
      This event fires for all keys, except for modifiers themselves.
      keyCode is always set.
      charCode is never set.
      which is set for all characters. which = 0 for several virtual keys.
      which is known to be set for: Backspace (8), Tab (9), Enter (13), Shift 
      (16), Control (17), Alt (18), Pause (19), Escape (27), End (35), Home 
      (36), Insert (45), Delete (46), NumLock (144).
      which is known to be unset for: F1 - F12, PageUp (33), PageDown (34), Left 
      (37), Up (38), Right (39), Down (40).
      keyIdentifier is always undefined.

    MSIE keyup/keypress/keydown:
      Event firing conditions are described above.
      keyCode is always set.
      charCode is never set.
      which is never set.
      keyIdentifier is always undefined.

    Webkit keydown/keyup:
      These events fires for all keys, including for modifiers.
      keyCode is always set.
      charCode is never set.
      which is always set.
      keyIdentifier is always set.

    Webkit keypress:
      This event fires for characters keys, similarly to MSIE (see above info).
      keyCode is always set.
      charCode is always set for all characters.
      which is always set.
      keyIdentifier is null.

    Gecko keydown/keyup:
      These events fire for all keys, including for modifiers.
      keyCode is always set.
      charCode is never set.
      which is always set.
      keyIdentifier is always undefined.

    Gecko keypress:
      This event fires for all keys, except for modifiers themselves.
      keyCode is only set for virtual keys, not for characters.
      charCode is always set for all characters.
      which is always set for all characters and for the Enter virtual key.
      keyIdentifier is always undefined.

    Another important difference between the KeyboardEventListener class and the 
    getKey() function is that the class tries to ensure that the keypress event 
    is fired for the handler, even if the Web browser does not do it natively.  
    Also, the class tries to provide a consistent approach to keyboard event 
    repetition when the user holds down a key for longer periods of time, by 
    repeating only the keypress event.

    On Linux, Opera, Firefox and Konqueror do not repeat the keydown event, only 
    keypress. On Windows, Opera, Firefox and MSIE do repeat the keydown and 
    keypress events while the user holds down the key. Webkit  repeats the 
    keydown and the keypress (when it fires) events on both systems.

    The default action can be prevented for during keydown in MSIE, and during 
    keypress for the other browsers. In Webkit when keypress doesn't fire, 
    keydown needs to be prevented.

    The KeyboardEventListener class tries to bring consistency. The keydown 
    event never repeats, only the keypress event repeats and it always fires for 
    all keys. The keypress event never fires for modifiers. Events should always 
    be prevented during keypress - the class deals with preventing the event 
    during keydown or keypress as needed in Webkit and MSIE.

    If no code/keyIdentifier is given by the browser, the getKey() function 
    returns null. In the case of the KeyboardEventListener class, keyCode_ 
    / key_ / charCode_ / char_ will be null or undefined.
   */

  /**
   * During a keyboard event flow, this holds the current key code, starting 
   * from the <code>keydown</code> event.
   *
   * @private
   * @type Number
   */
  var keyCode_ = null;

  /**
   * During a keyboard event flow, this holds the current key, starting from the 
   * <code>keydown</code> event.
   *
   * @private
   * @type String
   */
  var key_ = null;

  /**
   * During a keyboard event flow, this holds the current character code, 
   * starting from the <code>keypress</code> event.
   *
   * @private
   * @type Number
   */
  var charCode_ = null;

  /**
   * During a keyboard event flow, this holds the current character, starting 
   * from the <code>keypress</code> event.
   *
   * @private
   * @type String
   */
  var char_ = null;

  /**
   * True if the current keyboard event is repeating. This happens when the user 
   * holds down a key for longer periods of time.
   *
   * @private
   * @type Boolean
   */
  var repeat_ = false;


  if (!handlers_) {
    throw new TypeError('The first argument must be of type an object.');
  }

  if (!handlers_.keydown && !handlers_.keypress && !handlers_.keyup) {
    throw new TypeError('The provided handlers object has no keyboard event' +
        'handler.');
  }

  if (handlers_.keydown && typeof handlers_.keydown != 'function') {
    throw new TypeError('The keydown event handler is not a function!');
  }
  if (handlers_.keypress && typeof handlers_.keypress != 'function') {
    throw new TypeError('The keypress event handler is not a function!');
  }
  if (handlers_.keyup && typeof handlers_.keyup != 'function') {
    throw new TypeError('The keyup event handler is not a function!');
  }

  /**
   * Attach the keyboard event listeners to the current DOM element.
   */
  this.attach = function () {
    keyCode_ = null;
    key_ = null;
    charCode_ = null;
    char_ = null;
    repeat_ = false;

    // FIXME: I have some ideas for a solution to the problem of having multiple 
    // event handlers like these attached to the same element. Somehow, only one 
    // should do all the needed work.

    elem_.addEventListener('keydown',  keydown,  false);
    elem_.addEventListener('keypress', keypress, false);
    elem_.addEventListener('keyup',    keyup,    false);
  };

  /**
   * Detach the keyboard event listeners from the current DOM element.
   */
  this.detach = function () {
    elem_.removeEventListener('keydown',  keydown,  false);
    elem_.removeEventListener('keypress', keypress, false);
    elem_.removeEventListener('keyup',    keyup,    false);

    keyCode_ = null;
    key_ = null;
    charCode_ = null;
    char_ = null;
    repeat_ = false;
  };

  /**
   * Dispatch an event.
   *
   * <p>This function simply invokes the handler for the event of the given 
   * <var>type</var>. The handler receives the <var>ev</var> event.
   *
   * @private
   * @param {String} type The event type to dispatch.
   * @param {Event} ev The DOM Event object to dispatch to the handler.
   */
  function dispatch (type, ev) {
    if (!handlers_[type]) {
      return;
    }

    var handler = handlers_[type];

    if (type == ev.type) {
      handler.call(elem_, ev);

    } else {
      // This happens when the keydown event tries to dispatch a keypress event.

      // FIXME: I could use createEvent() ... food for thought for later
      var ev_new = {};
      lib.extend(ev_new, ev);
      ev_new.type = type;

      // Make sure preventDefault() is not borked...
      ev_new.preventDefault = function () {
        ev.preventDefault();
      };

      handler.call(elem_, ev_new);
    }
  };

  /**
   * The <code>keydown</code> event handler. This function determines the key 
   * pressed by the user, and checks if the <code>keypress</code> event will 
   * fire in the current Web browser, or not. If it does not, a synthetic 
   * <code>keypress</code> event will be fired.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   */
  function keydown (ev) {
    var prevKey = key_;

    charCode_ = null;
    char_ = null;

    findKeyCode(ev);

    ev.keyCode_ = keyCode_;
    ev.key_ = key_;
    ev.repeat_ = key_ && prevKey == key_ ? true : false;

    repeat_ = ev.repeat_;

    // When the user holds down a key for a longer period of time, the keypress 
    // event is generally repeated. However, in Webkit keydown is repeated (and 
    // keypress if it fires keypress for the key). As such, we do not dispatch 
    // the keydown event when a key event starts to be repeated.
    if (!repeat_) {
      dispatch('keydown', ev);
    }

    // MSIE and Webkit only fire the keypress event for characters 
    // (alpha-numeric and symbols).
    if (!isModifierKey(key_) && !firesKeyPress(ev)) {
      ev.type_ = 'keydown';
      keypress(ev);
    }
  };

  /**
   * The <code>keypress</code> event handler. This function determines the 
   * character generated by the keyboard event.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   */
  function keypress (ev) {
    // We reuse the keyCode_/key_ from the keydown event, because ev.keyCode 
    // generally holds the character code during the keypress event.
    // However, if keyCode_ is not available, try to determine the key for this 
    // event as well.
    if (!keyCode_) {
      findKeyCode(ev);
      repeat_ = false;
    }

    ev.keyCode_ = keyCode_;
    ev.key_ = key_;

    findCharCode(ev);

    ev.charCode_ = charCode_;
    ev.char_ = char_;

    // Any subsequent keypress event is considered a repeated keypress (the user 
    // is holding down the key).
    ev.repeat_ = repeat_;
    if (!repeat_) {
      repeat_ = true;
    }

    if (!isModifierKey(key_)) {
      dispatch('keypress', ev);
    }
  };

  /**
   * The <code>keyup</code> event handler.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   */
  function keyup (ev) {
    /*
     * Try to determine the keyCode_ for keyup again, even if we might already 
     * have it from keydown. This is needed because the user might press some 
     * key which only generates the keydown and keypress events, after which 
     * a sudden keyup event is fired for a completely different key.
     *
     * Example: in Opera press F2 then Escape. It will first generate two 
     * events, keydown and keypress, for the F2 key. When you press Escape to 
     * close the dialog box, the script receives keyup for Escape.
     */
    findKeyCode(ev);

    ev.keyCode_ = keyCode_;
    ev.key_ = key_;

    // Provide the character info from the keypress event in keyup as well.
    ev.charCode_ = charCode_;
    ev.char_ = char_;

    dispatch('keyup', ev);

    keyCode_ = null;
    key_ = null;
    charCode_ = null;
    char_ = null;
    repeat_ = false;
  };

  /**
   * Tells if the <var>key</var> is a modifier or not.
   *
   * @private
   * @param {String} key The key name.
   * @returns {Boolean} True if the <var>key</var> is a modifier, or false if 
   * not.
   */
  function isModifierKey (key) {
    switch (key) {
      case 'Shift':
      case 'Control':
      case 'Alt':
      case 'Meta':
      case 'Win':
        return true;
      default:
        return false;
    }
  };

  /**
   * Tells if the current Web browser will fire the <code>keypress</code> event 
   * for the current <code>keydown</code> event object.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   * @returns {Boolean} True if the Web browser will fire 
   * a <code>keypress</code> event, or false if not.
   */
  function firesKeyPress (ev) {
    if (!lib.browser.msie && !lib.browser.webkit) {
      return true;
    }

    // Check if the key is a character key, or not.
    // If it's not a character, then keypress will not fire.
    // Known exceptions: keypress fires for Space, Enter and Escape in MSIE.
    if (key_ && key_ != 'Space' && key_ != 'Enter' && key_ != 'Escape' && 
        key_.length != 1) {
      return false;
    }

    // Webkit doesn't fire keypress for Escape as well ...
    if (lib.browser.webkit && key_ == 'Escape') {
      return false;
    }

    // MSIE does not fire keypress if you hold Control / Alt down, while Shift 
    // is off. Albeit, based on testing I am not completely sure if Shift needs 
    // to be down or not. Sometimes MSIE won't fire keypress even if I hold 
    // Shift down, and sometimes it does. Eh.
    if (lib.browser.msie && !ev.shiftKey && (ev.ctrlKey || ev.altKey)) {
      return false;
    }

    return true;
  };

  /**
   * Determine the key and the key code for the current DOM Event object. This 
   * function updates the <var>keyCode_</var> and the <var>key_</var> variables 
   * to hold the result.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   */
  function findKeyCode (ev) {
    /*
     * If the event has no keyCode/which/keyIdentifier values, then simply do 
     * not overwrite any existing keyCode_/key_.
     */
    if (ev.type == 'keyup' && !ev.keyCode && !ev.which && (!ev.keyIdentifier || 
          ev.keyIdentifier == 'Unidentified' || ev.keyIdentifier == 'U+0000')) {
      return;
    }

    keyCode_ = null;
    key_ = null;

    // Try to use keyCode/which.
    if (ev.keyCode || ev.which) {
      keyCode_ = ev.keyCode || ev.which;

      // Fix Webkit quirks
      if (lib.browser.webkit) {
        // Old Webkit gives keyCode 25 when Shift+Tab is used.
        if (keyCode_ == 25 && this.shiftKey) {
          keyCode_ = lib.dom.keyNames.Tab;
        } else if (keyCode_ >= 63232 && keyCode_ in lib.dom.keyCodes_Safari2) {
          // Old Webkit gives wrong values for several keys.
          keyCode_ = lib.dom.keyCodes_Safari2[keyCode_];
        }
      }

      // Fix keyCode quirks in all browsers.
      if (keyCode_ in lib.dom.keyCodes_fixes) {
        keyCode_ = lib.dom.keyCodes_fixes[keyCode_];
      }

      key_ = lib.dom.keyCodes[keyCode_] || String.fromCharCode(keyCode_);

      return;
    }

    // Try to use ev.keyIdentifier. This is only available in Webkit and 
    // Konqueror 4, each having some quirks. Sometimes the property is needed, 
    // because keyCode/which are not always available.

    var key = null,
        keyCode = null,
        id = ev.keyIdentifier;

    if (!id || id == 'Unidentified' || id == 'U+0000') {
      return;
    }

    if (id.substr(0, 2) == 'U+') {
      // Webkit gives character codes using the 'U+XXXX' notation, as per spec.
      keyCode = parseInt(id.substr(2), 16);

    } else if (id.length == 1) {
      // Konqueror 4 implements keyIdentifier, and they provide the Unicode 
      // character directly, instead of using the 'U+XXXX' notation.
      keyCode = id.charCodeAt(0);
      key = id;

    } else {
      /*
       * Common keyIdentifiers like 'PageDown' are used as they are.
       * We determine the common keyCode used by Web browsers, from the 
       * lib.dom.keyNames object.
       */
      keyCode_ = lib.dom.keyNames[id] || null;
      key_ = id;

      return;
    }

    // Some keyIdentifiers like 'U+007F' (127: Delete) need to become key names.
    if (keyCode in lib.dom.keyCodes && (keyCode <= 32 || keyCode == 127 || keyCode 
          == 144)) {
      key_ = lib.dom.keyCodes[keyCode];
    } else {
      if (!key) {
        key = String.fromCharCode(keyCode);
      }

      // Konqueror gives lower-case chars
      key_ = key.toUpperCase();
      if (key != key_) {
        keyCode = key_.charCodeAt(0);
      }
    }

    // Correct the keyCode, make sure it's a common keyCode, not the Unicode 
    // decimal representation of the character.
    if (key_ == 'Delete' || key_.length == 1 && key_ in lib.dom.keyNames) {
      keyCode = lib.dom.keyNames[key_];
    }

    keyCode_ = keyCode;
  };

  /**
   * Determine the character and the character code for the current DOM Event 
   * object. This function updates the <var>charCode_</var> and the 
   * <var>char_</var> variables to hold the result.
   *
   * @private
   * @param {Event} ev The DOM Event object.
   */
  function findCharCode (ev) {
    charCode_ = null;
    char_ = null;

    // Webkit and Gecko implement ev.charCode.
    if (ev.charCode) {
      charCode_ = ev.charCode;
      char_ = String.fromCharCode(ev.charCode);

      return;
    }

    // Try the keyCode mess.
    if (ev.keyCode || ev.which) {
      var keyCode = ev.keyCode || ev.which;

      var force = false;

      // We accept some keyCodes.
      switch (keyCode) {
        case lib.dom.keyNames.Tab:
        case lib.dom.keyNames.Enter:
        case lib.dom.keyNames.Space:
          force = true;
      }

      // Do not consider the keyCode a character code, if during the keydown 
      // event it was determined the key does not generate a character, unless 
      // it's Tab, Enter or Space.
      if (!force && key_ && key_.length != 1) {
        return;
      }

      // If the keypress event at hand is synthetically dispatched by keydown, 
      // then special treatment is needed. This happens only in Webkit and MSIE.
      if (ev.type_ == 'keydown') {
        var key = lib.dom.keyCodes[keyCode];
        // Check if the keyCode points to a single character.
        // If it does, use it.
        if (key && key.length == 1) {
          charCode_ = key.charCodeAt(0); // keyCodes != charCodes
          char_ = key;
        }
      } else if (keyCode >= 32 || force) {
        // For normal keypress events, we are done.
        charCode_ = keyCode;
        char_ = String.fromCharCode(keyCode);
      }

      if (charCode_) {
        return;
      }
    }

    /*
     * Webkit and Konqueror do not provide a keyIdentifier in the keypress 
     * event, as per spec. However, in the unlikely case when the keyCode is 
     * missing, and the keyIdentifier is available, we use it.
     *
     * This property might be used when a synthetic keypress event is generated 
     * by the keydown event, and keyCode/charCode/which are all not available.
     */

    var c = null,
        charCode = null,
        id = ev.keyIdentifier;

    if (id && id != 'Unidentified' && id != 'U+0000' &&
        (id.substr(0, 2) == 'U+' || id.length == 1)) {

      // Characters in Konqueror...
      if (id.length == 1) {
        charCode = id.charCodeAt(0);
        c = id;

      } else {
        // Webkit uses the 'U+XXXX' notation as per spec.
        charCode = parseInt(id.substr(2), 16);
      }

      if (charCode == lib.dom.keyNames.Tab ||
          charCode == lib.dom.keyNames.Enter ||
          charCode >= 32 && charCode != 127 &&
          charCode != lib.dom.keyNames.NumLock) {

        charCode_ = charCode;
        char_ = c || String.fromCharCode(charCode);

        return;
      }
    }

    // Try to use the key determined from the previous keydown event, if it 
    // holds a character.
    if (key_ && key_.length == 1) {
      charCode_ = key_.charCodeAt(0);
      char_ = key_;
    }
  };

  this.attach();
};

// lib.dom.KeyboardEvent.getKey() is not included here. You can get it from the 
// libmacrame project: http://code.google.com/p/libmacrame.

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
