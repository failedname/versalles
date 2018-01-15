/*!
 * vue-barcode v0.2.0
 * https://github.com/xkeshi/vue-barcode
 *
 * Copyright (c) 2017 Xkeshi
 * Released under the MIT license
 *
 * Date: 2017-09-25T08:14:37.396Z
 */
!function(t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? module.exports = e()
    : "function" == typeof define && define.amd
      ? define(e)
      : t.VueBarcode = e()
}(this, function() {
  "use strict";
  function t(t) {
    return e(r(t))
  }
  function e(t) {
    return D[t].toString(2)
  }
  function n(t) {
    return T[t]
  }
  function r(t) {
    return T.indexOf(t)
  }
  function i(t) {
    for (var e = 0, n = 0; n < t.length; n++) 
      e += r(t[n]);
    return e %= 43
  }
  function o(t, e) {
    var n = e
        ? J
        : q,
      r = t.match(new RegExp("^(" + n + "+?)(([0-9]{2}){2,})([^0-9]|$)"));
    if (r) 
      return r[1] + String.fromCharCode(204) + a(t.substring(r[1].length));
    var i = t.match(new RegExp("^" + n + "+"))[0];
    return i.length === t.length
      ? t
      : i + String.fromCharCode(
        e
        ? 205
        : 206) + o(t.substring(i.length), !e)
  }
  function a(t) {
    var e = tt(t),
      n = e.length;
    if (n === t.length) 
      return t;
    t = t.substring(n);
    var r = W(t) >= Y(t);
    return e + String.fromCharCode(
      r
      ? 206
      : 205) + o(t, r)
  }
  function s(t) {
    var e,
      n = 0;
    for (e = 0; e < 12; e += 2) 
      n += parseInt(t[e]);
    for (e = 1; e < 12; e += 2) 
      n += 3 * parseInt(t[e]);
    return (10 - n % 10) % 10
  }
  function u(t) {
    var e,
      n = 0;
    for (e = 0; e < 7; e += 2) 
      n += 3 * parseInt(t[e]);
    for (e = 1; e < 7; e += 2) 
      n += parseInt(t[e]);
    return (10 - n % 10) % 10
  }
  function h(t) {
    var e,
      n = 0;
    for (e = 1; e < 11; e += 2) 
      n += parseInt(t[e]);
    for (e = 0; e < 11; e += 2) 
      n += 3 * parseInt(t[e]);
    return (10 - n % 10) % 10
  }
  function c(t, e) {
    for (var n = parseInt(t[t.length - 1]), r = dt[n], i = "", o = 0, a = 0; a < r.length; a++) {
      var s = r[a];
      i += "X" === s
        ? t[o++]
        : s
    }
    return "" + (
    i = "" + e + i) + h(i)
  }
  function f(t) {
    for (var e = 0, n = 0; n < 13; n++) 
      e += parseInt(t[n]) * (3 - n % 2 * 2);
    return 10 * Math.ceil(e / 10) - e
  }
  function d(t, e) {
    for (var n = 0; n < e; n++) 
      t = "0" + t;
    return t
  }
  function l(t) {
    for (var e = 0, n = 0; n < t.length; n++) {
      var r = parseInt(t[n]);
      (n + t.length) % 2 == 0
        ? e += r
        : e += 2 * r % 10 + Math.floor(2 * r / 10)
    }
    return (10 - e % 10) % 10
  }
  function p(t) {
    for (var e = 0, n = [
      2,
      3,
      4,
      5,
      6,
      7
    ], r = 0; r < t.length; r++) {
      var i = parseInt(t[t.length - 1 - r]);
      e += n[r % n.length] * i
    }
    return (11 - e % 11) % 11
  }
  function g(t) {
    function e(t) {
      if (Array.isArray(t)) 
        for (var r = 0; r < t.length; r++) 
          e(t[r]);
    else 
        t.text = t.text || "",
        t.data = t.data || "",
        n.push(t)
    }
    var n = [];
    return e(t),
    n
  }
  function v(t) {
    return t.marginTop = t.marginTop || t.margin,
    t.marginBottom = t.marginBottom || t.margin,
    t.marginRight = t.marginRight || t.margin,
    t.marginLeft = t.marginLeft || t.margin,
    t
  }
  function y(t) {
    var e = [
      "width",
      "height",
      "textMargin",
      "fontSize",
      "margin",
      "marginTop",
      "marginBottom",
      "marginLeft",
      "marginRight"
    ];
    for (var n in e) 
      e.hasOwnProperty(n) && "string" == typeof t[n = e[n]] && (t[n] = parseInt(t[n], 10));
    return "string" == typeof t.displayValue && (t.displayValue = "false" != t.displayValue),
    t
  }
  function x(t) {
    var e = {};
    for (var n in bt) 
      bt.hasOwnProperty(n) && (t.hasAttribute("jsbarcode-" + n.toLowerCase()) && (e[n] = t.getAttribute("jsbarcode-" + n.toLowerCase())), t.hasAttribute("data-" + n.toLowerCase()) && (e[n] = t.getAttribute("data-" + n.toLowerCase())));
    return e.value = t.getAttribute("jsbarcode-value") || t.getAttribute("data-value"),
    e = y(e)
  }
  function m(t, e) {
    return e.height + (
      e.displayValue && t.text.length > 0
      ? e.fontSize + e.textMargin
      : 0) + e.marginTop + e.marginBottom
  }
  function b(t, e, n) {
    if (n.displayValue && e < t) {
      if ("center" == n.textAlign) 
        return Math.floor((t - e) / 2);
      if ("left" == n.textAlign) 
        return 0;
      if ("right" == n.textAlign) 
        return Math.floor(t - e)
    }
    return 0
  }
  function O(t, e, n) {
    for (var r = 0; r < t.length; r++) {
      var i,
        o = t[r],
        a = mt(e, o.options);
      i = a.displayValue
        ? w(o.text, a, n)
        : 0;
      var s = o.data.length * a.width;
      o.width = Math.ceil(Math.max(i, s)),
      o.height = m(o, a),
      o.barcodePadding = b(i, s, a)
    }
  }
  function _(t) {
    for (var e = 0, n = 0; n < t.length; n++) 
      e += t[n].width;
    return e
  }
  function E(t) {
    for (var e = 0, n = 0; n < t.length; n++) 
      t[n].height > e && (e = t[n].height);
    return e
  }
  function w(t, e, n) {
    var r;
    if (n) 
      r = n;
    else {
      if ("undefined" == typeof document) 
        return 0;
      r = document.createElement("canvas").getContext("2d")
    }
    return r.font = e.fontOptions + " " + e.fontSize + "px " + e.font,
    r.measureText(t).width
  }
  function L(t) {
    if ("string" == typeof t) 
      return S(t);
    if (Array.isArray(t)) {
      for (var e = [], n = 0; n < t.length; n++) 
        e.push(L(t[n]));
      return e
    }
    if ("undefined" != typeof HTMLCanvasElement && t instanceof HTMLImageElement) 
      return C(t);
    if (t && "svg" === t.nodeName || "undefined" != typeof SVGElement && t instanceof SVGElement) 
      return {element: t, options: x(t), renderer: _t.SVGRenderer};
    if ("undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement) 
      return {element: t, options: x(t), renderer: _t.CanvasRenderer};
    if (t && t.getContext) 
      return {element: t, renderer: _t.CanvasRenderer};
    if (t && "object" === (
      void 0 === t
      ? "undefined"
      : P(t)) && !t.nodeName) 
      return {element: t, renderer: _t.ObjectRenderer};
    throw new wt
  }
  function S(t) {
    var e = document.querySelectorAll(t);
    if (0 !== e.length) {
      for (var n = [], r = 0; r < e.length; r++) 
        n.push(L(e[r]));
      return n
    }
  }
  function C(t) {
    var e = document.createElement("canvas");
    return {
      element: e,
      options: x(t),
      renderer: _t.CanvasRenderer,
      afterRender: function() {
        t.setAttribute("src", e.toDataURL())
      }
    }
  }
  function k(t, e, n) {
    var r = new e(t = "" + t, n);
    if (!r.valid()) 
      throw new Et(r.constructor.name, t);
    var i = r.encode();
    i = g(i);
    for (var o = 0; o < i.length; o++) 
      i[o].options = mt(n, i[o].options);
    return i
  }
  function A() {
    return xt.CODE128
      ? "CODE128"
      : Object.keys(xt)[0]
  }
  function R(t, e, n) {
    e = g(e);
    for (var r = 0; r < e.length; r++) 
      e[r].options = mt(n, e[r].options),
      v(e[r].options);
    v(n),
    new(0, t.renderer)(t.element, e, n).render(),
    t.afterRender && t.afterRender()
  }
  var G,
    P = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function(t) {
        return typeof t
      }
      : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
          ? "symbol"
          : typeof t
      },
    j = (function() {
      function t(t) {
        this.value = t
      }
      function e(e) {
        function n(i, o) {
          try {
            var a = e[i](o),
              s = a.value;
            s instanceof t
              ? Promise.resolve(s.value).then(function(t) {
                n("next", t)
              }, function(t) {
                n("throw", t)
              })
              : r(
                a.done
                ? "return"
                : "normal",
              a.value)
          } catch (t) {
            r("throw", t)
          }
        }
        function r(t, e) {
          switch (t) {
            case "return":
              i.resolve({
                value: e,
                done: !0
              });
              break;
            case "throw":
              i.reject(e);
              break;
            default:
              i.resolve({
                value: e,
                done: !1
              })
          }(i = i.next)
            ? n(i.key, i.arg)
            : o = null
        }
        var i,
          o;
        this._invoke = function(t, e) {
          return new Promise(function(r, a) {
            var s = {
              key: t,
              arg: e,
              resolve: r,
              reject: a,
              next: null
            };
            o
              ? o = o.next = s
              : (i = o = s, n(t, e))
          })
        },
        "function" != typeof e.return && (this.return = void 0)
      }
      "function" == typeof Symbol && Symbol.asyncIterator && (e.prototype[Symbol.asyncIterator] = function() {
        return this
      }),
      e.prototype.next = function(t) {
        return this._invoke("next", t)
      },
      e.prototype.throw = function(t) {
        return this._invoke("throw", t)
      },
      e.prototype.return = function(t) {
        return this._invoke("return", t)
      }
    }(), function(t, e) {
      if (!(t instanceof e)) 
        throw new TypeError("Cannot call a class as a function")
    }),
    X = function() {
      function t(t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          r.enumerable = r.enumerable || !1,
          r.configurable = !0,
          "value" in r && (r.writable = !0),
          Object.defineProperty(t, r.key, r)
        }
      }
      return function(e, n, r) {
        return n && t(e.prototype, n),
        r && t(e, r),
        e
      }
    }(),
    z = function(t, e, n) {
      return e in t
        ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
        : t[e] = n,
      t
    },
    I = Object.assign || function(t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var r in n) 
          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
      }
      return t
    },
    V = function(t, e) {
      if ("function" != typeof e && null !== e) 
        throw new TypeError("Super expression must either be null or a function, not " + typeof e);
      t.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: t,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }),
      e && (
        Object.setPrototypeOf
        ? Object.setPrototypeOf(t, e)
        : t.__proto__ = e)
    },
    M = function(t, e) {
      if (!t) 
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return !e || "object" != typeof e && "function" != typeof e
        ? t
        : e
    },
    B = function t(e, n) {
      j(this, t),
      this.data = e,
      this.text = n.text || e,
      this.options = n
    },
    $ = function(e) {
      function r(t, e) {
        return j(this, r),
        t = t.toUpperCase(),
        e.mod43 && (t += n(i(t))),
        M(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, t, e))
      }
      return V(r, B),
      X(r, [
        {
          key: "encode",
          value: function() {
            for (var e = t("*"), n = 0; n < this.data.length; n++) 
              e += t(this.data[n]) + "0";
            return e += t("*"), {
              data: e,
              text: this.text
            }
          }
        }, {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/)
          }
        }
      ]),
      r
    }(),
    T = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "-",
      ".",
      " ",
      "$",
      "/",
      "+",
      "%",
      "*"
    ],
    D = [
      20957,
      29783,
      23639,
      30485,
      20951,
      29813,
      23669,
      20855,
      29789,
      23645,
      29975,
      23831,
      30533,
      22295,
      30149,
      24005,
      21623,
      29981,
      23837,
      22301,
      30023,
      23879,
      30545,
      22343,
      30161,
      24017,
      21959,
      30065,
      23921,
      22385,
      29015,
      18263,
      29141,
      17879,
      29045,
      18293,
      17783,
      29021,
      18269,
      17477,
      17489,
      17681,
      20753,
      35770
    ],
    H = (G = {}, z(G, 103, 0), z(G, 104, 1), z(G, 105, 2), G),
    N = {
      101: 0,
      100: 1,
      99: 2
    },
    U = String.fromCharCode(208),
    F = String.fromCharCode(209),
    Q = String.fromCharCode(210),
    J = "[\0-_È-Ï]",
    q = "[ -È-Ï]",
    Z = [
      11011001100,
      11001101100,
      11001100110,
      10010011e3,
      10010001100,
      10001001100,
      10011001e3,
      10011000100,
      10001100100,
      11001001e3,
      11001000100,
      11000100100,
      10110011100,
      10011011100,
      10011001110,
      10111001100,
      10011101100,
      10011100110,
      11001110010,
      11001011100,
      11001001110,
      11011100100,
      11001110100,
      11101101110,
      11101001100,
      11100101100,
      11100100110,
      11101100100,
      11100110100,
      11100110010,
      11011011e3,
      11011000110,
      11000110110,
      10100011e3,
      10001011e3,
      10001000110,
      10110001e3,
      10001101e3,
      10001100010,
      11010001e3,
      11000101e3,
      11000100010,
      10110111e3,
      10110001110,
      10001101110,
      10111011e3,
      10111000110,
      10001110110,
      11101110110,
      11010001110,
      11000101110,
      11011101e3,
      11011100010,
      11011101110,
      11101011e3,
      11101000110,
      11100010110,
      11101101e3,
      11101100010,
      11100011010,
      11101111010,
      11001000010,
      11110001010,
      1010011e4,
      10100001100,
      1001011e4,
      10010000110,
      10000101100,
      10000100110,
      1011001e4,
      10110000100,
      1001101e4,
      10011000010,
      10000110100,
      10000110010,
      11000010010,
      1100101e4,
      11110111010,
      11000010100,
      10001111010,
      10100111100,
      10010111100,
      10010011110,
      10111100100,
      10011110100,
      10011110010,
      11110100100,
      11110010100,
      11110010010,
      11011011110,
      11011110110,
      11110110110,
      10101111e3,
      10100011110,
      10001011110,
      10111101e3,
      10111100010,
      11110101e3,
      11110100010,
      10111011110,
      10111101110,
      11101011110,
      11110101110,
      11010000100,
      1101001e4,
      11010011100,
      1100011101011
    ],
    K = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t.substring(1), n));
        return r.bytes = t.split("").map(function(t) {
          return t.charCodeAt(0)
        }),
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data)
          }
        }, {
          key: "encode",
          value: function() {
            var t = this.bytes,
              n = t.shift() - 105,
              r = H[n];
            if (void 0 === r) 
              throw new RangeError("The encoding does not start with a start character.");
            var i = e.next(t, 1, r);
            return {
              text: this.text === this.data
                ? this.text.replace(/[^\x20-\x7E]/g, "")
                : this.text,
              data: e.getBar(n) + i.result + e.getBar((i.checksum + n) % 103) + e.getBar(106)
            }
          }
        }
      ], [
        {
          key: "getBar",
          value: function(t) {
            return Z[t]
              ? Z[t].toString()
              : ""
          }
        }, {
          key: "correctIndex",
          value: function(t, e) {
            if (0 === e) {
              var n = t.shift();
              return n < 32
                ? n + 64
                : n - 32
            }
            return 1 === e
              ? t.shift() - 32
              : 10 * (t.shift() - 48) + t.shift() - 48
          }
        }, {
          key: "next",
          value: function(t, n, r) {
            if (!t.length) 
              return {result: "", checksum: 0};
            var i = void 0,
              o = void 0;
            if (t[0] >= 200) {
              o = t.shift() - 105;
              var a = N[o];
              void 0 !== a
                ? i = e.next(t, n + 1, a)
                : (0 !== r && 1 !== r || 98 !== o || (
                  t[0] = 0 === r
                  ? t[0] > 95
                    ? t[0] - 96
                    : t[0]
                  : t[0] < 32
                    ? t[0] + 96
                    : t[0]), i = e.next(t, n + 1, r))
            } else 
              o = e.correctIndex(t, r),
              i = e.next(t, n + 1, r);
            var s = o * n;
            return {
              result: e.getBar(o) + i.result,
              checksum: s + i.checksum
            }
          }
        }
      ]),
      e
    }(),
    W = function(t) {
      return t.match(new RegExp("^" + J + "*"))[0].length
    },
    Y = function(t) {
      return t.match(new RegExp("^" + q + "*"))[0].length
    },
    tt = function(t) {
      return t.match(new RegExp("^(Ï*[0-9]{2}Ï*)*"))[0]
    },
    et = function(t) {
      var e = void 0;
      if (tt(t).length >= 2) 
        e = Q + a(t);
      else {
        var n = W(t) > Y(t);
        e = (
          n
          ? U
          : F) + o(t, n)
      }
      return e.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function(t, e) {
        return String.fromCharCode(203) + e
      })
    },
    nt = function(t) {
      function e(t, n) {
        if (j(this, e), /^[\x00-\x7F\xC8-\xD3]+$/.test(t)) 
          r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, et(t), n));
        else 
          var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return M(r)
      }
      return V(e, K),
      e
    }(),
    rt = function(t) {
      function e(t, n) {
        return j(this, e),
        M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, U + t, n))
      }
      return V(e, K),
      X(e, [
        {
          key: "valid",
          value: function() {
            return new RegExp("^" + J + "+$").test(this.data)
          }
        }
      ]),
      e
    }(),
    it = function(t) {
      function e(t, n) {
        return j(this, e),
        M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, F + t, n))
      }
      return V(e, K),
      X(e, [
        {
          key: "valid",
          value: function() {
            return new RegExp("^" + q + "+$").test(this.data)
          }
        }
      ]),
      e
    }(),
    ot = function(t) {
      function e(t, n) {
        return j(this, e),
        M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, Q + t, n))
      }
      return V(e, K),
      X(e, [
        {
          key: "valid",
          value: function() {
            return new RegExp("^(Ï*[0-9]{2}Ï*)+$").test(this.data)
          }
        }
      ]),
      e
    }(),
    at = function() {
      function t() {
        j(this, t),
        this.startBin = "101",
        this.endBin = "101",
        this.middleBin = "01010",
        this.binaries = {
          L: [
            "0001101",
            "0011001",
            "0010011",
            "0111101",
            "0100011",
            "0110001",
            "0101111",
            "0111011",
            "0110111",
            "0001011"
          ],
          G: [
            "0100111",
            "0110011",
            "0011011",
            "0100001",
            "0011101",
            "0111001",
            "0000101",
            "0010001",
            "0001001",
            "0010111"
          ],
          R: [
            "1110010",
            "1100110",
            "1101100",
            "1000010",
            "1011100",
            "1001110",
            "1010000",
            "1000100",
            "1001000",
            "1110100"
          ],
          O: [
            "0001101",
            "0011001",
            "0010011",
            "0111101",
            "0100011",
            "0110001",
            "0101111",
            "0111011",
            "0110111",
            "0001011"
          ],
          E: [
            "0100111",
            "0110011",
            "0011011",
            "0100001",
            "0011101",
            "0111001",
            "0000101",
            "0010001",
            "0001001",
            "0010111"
          ]
        }
      }
      return X(t, [
        {
          key: "encode",
          value: function(t, e, n) {
            var r = "";
            n = n || "";
            for (var i = 0; i < t.length; i++) {
              var o = this.binaries[e[i]];
              o && (r += o[t[i]]),
              i < t.length - 1 && (r += n)
            }
            return r
          }
        }
      ]),
      t
    }(),
    st = function(t) {
      function e(t, n) {
        j(this, e),
        -1 !== t.search(/^[0-9]{12}$/) && (t += s(t));
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return !n.flat && n.fontSize > 10 * n.width
          ? r.fontSize = 10 * n.width
          : r.fontSize = n.fontSize,
        r.guardHeight = n.height + r.fontSize / 2 + n.textMargin,
        r.lastChar = n.lastChar,
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{13}$/) && this.data[12] == s(this.data)
          }
        }, {
          key: "encode",
          value: function() {
            return this.options.flat
              ? this.flatEncoding()
              : this.guardedEncoding()
          }
        }, {
          key: "getStructure",
          value: function() {
            return [
              "LLLLLL",
              "LLGLGG",
              "LLGGLG",
              "LLGGGL",
              "LGLLGG",
              "LGGLLG",
              "LGGGLL",
              "LGLGLG",
              "LGLGGL",
              "LGGLGL"
            ]
          }
        }, {
          key: "guardedEncoding",
          value: function() {
            var t = new at,
              e = [],
              n = this.getStructure()[this.data[0]],
              r = this.data.substr(1, 6),
              i = this.data.substr(7, 6);
            return this.options.displayValue && e.push({
              data: "000000000000",
              text: this.text.substr(0, 1),
              options: {
                textAlign: "left",
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "101",
              options: {
                height: this.guardHeight
              }
            }),
            e.push({
              data: t.encode(r, n),
              text: this.text.substr(1, 6),
              options: {
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "01010",
              options: {
                height: this.guardHeight
              }
            }),
            e.push({
              data: t.encode(i, "RRRRRR"),
              text: this.text.substr(7, 6),
              options: {
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "101",
              options: {
                height: this.guardHeight
              }
            }),
            this.options.lastChar && this.options.displayValue && (e.push({data: "00"}), e.push({
              data: "00000",
              text: this.options.lastChar,
              options: {
                fontSize: this.fontSize
              }
            })),
            e
          }
        }, {
          key: "flatEncoding",
          value: function() {
            var t = new at,
              e = "",
              n = this.getStructure()[this.data[0]];
            return e += "101",
            e += t.encode(this.data.substr(1, 6), n),
            e += "01010",
            e += t.encode(this.data.substr(7, 6), "RRRRRR"),
            e += "101", {
              data: e,
              text: this.text
            }
          }
        }
      ]),
      e
    }(),
    ut = function(t) {
      function e(t, n) {
        return j(this, e),
        -1 !== t.search(/^[0-9]{7}$/) && (t += u(t)),
        M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{8}$/) && this.data[7] == u(this.data)
          }
        }, {
          key: "encode",
          value: function() {
            var t = new at,
              e = "",
              n = this.data.substr(0, 4),
              r = this.data.substr(4, 4);
            return e += t.startBin,
            e += t.encode(n, "LLLL"),
            e += t.middleBin,
            e += t.encode(r, "RRRR"),
            e += t.endBin, {
              data: e,
              text: this.text
            }
          }
        }
      ]),
      e
    }(),
    ht = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return r.structure = [
          "GGLLL",
          "GLGLL",
          "GLLGL",
          "GLLLG",
          "LGGLL",
          "LLGGL",
          "LLLGG",
          "LGLGL",
          "LGLLG",
          "LLGLG"
        ],
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{5}$/)
          }
        }, {
          key: "encode",
          value: function() {
            var t = new at,
              e = this.checksum(),
              n = "1011";
            return n += t.encode(this.data, this.structure[e], "01"), {
              data: n,
              text: this.text
            }
          }
        }, {
          key: "checksum",
          value: function() {
            var t = 0;
            return t += 3 * parseInt(this.data[0]),
            t += 9 * parseInt(this.data[1]),
            t += 3 * parseInt(this.data[2]),
            t += 9 * parseInt(this.data[3]),
            (t += 3 * parseInt(this.data[4])) % 10
          }
        }
      ]),
      e
    }(),
    ct = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return r.structure = [
          "LL", "LG", "GL", "GG"
        ],
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{2}$/)
          }
        }, {
          key: "encode",
          value: function() {
            var t = new at,
              e = this.structure[parseInt(this.data) % 4],
              n = "1011";
            return n += t.encode(this.data, e, "01"), {
              data: n,
              text: this.text
            }
          }
        }
      ]),
      e
    }(),
    ft = function(t) {
      function e(t, n) {
        j(this, e),
        -1 !== t.search(/^[0-9]{11}$/) && (t += h(t));
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return r.displayValue = n.displayValue,
        n.fontSize > 10 * n.width
          ? r.fontSize = 10 * n.width
          : r.fontSize = n.fontSize,
        r.guardHeight = n.height + r.fontSize / 2 + n.textMargin,
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{12}$/) && this.data[11] == h(this.data)
          }
        }, {
          key: "encode",
          value: function() {
            return this.options.flat
              ? this.flatEncoding()
              : this.guardedEncoding()
          }
        }, {
          key: "flatEncoding",
          value: function() {
            var t = new at,
              e = "";
            return e += "101",
            e += t.encode(this.data.substr(0, 6), "LLLLLL"),
            e += "01010",
            e += t.encode(this.data.substr(6, 6), "RRRRRR"),
            e += "101", {
              data: e,
              text: this.text
            }
          }
        }, {
          key: "guardedEncoding",
          value: function() {
            var t = new at,
              e = [];
            return this.displayValue && e.push({
              data: "00000000",
              text: this.text.substr(0, 1),
              options: {
                textAlign: "left",
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "101" + t.encode(this.data[0], "L"),
              options: {
                height: this.guardHeight
              }
            }),
            e.push({
              data: t.encode(this.data.substr(1, 5), "LLLLL"),
              text: this.text.substr(1, 5),
              options: {
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "01010",
              options: {
                height: this.guardHeight
              }
            }),
            e.push({
              data: t.encode(this.data.substr(6, 5), "RRRRR"),
              text: this.text.substr(6, 5),
              options: {
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: t.encode(this.data[11], "R") + "101",
              options: {
                height: this.guardHeight
              }
            }),
            this.displayValue && e.push({
              data: "00000000",
              text: this.text.substr(11, 1),
              options: {
                textAlign: "right",
                fontSize: this.fontSize
              }
            }),
            e
          }
        }
      ]),
      e
    }(),
    dt = [
      "XX00000XXX",
      "XX10000XXX",
      "XX20000XXX",
      "XXX00000XX",
      "XXXX00000X",
      "XXXXX00005",
      "XXXXX00006",
      "XXXXX00007",
      "XXXXX00008",
      "XXXXX00009"
    ],
    lt = [
      [
        "EEEOOO", "OOOEEE"
      ],
      [
        "EEOEOO", "OOEOEE"
      ],
      [
        "EEOOEO", "OOEEOE"
      ],
      [
        "EEOOOE", "OOEEEO"
      ],
      [
        "EOEEOO", "OEOOEE"
      ],
      [
        "EOOEEO", "OEEOOE"
      ],
      [
        "EOOOEE", "OEEEOO"
      ],
      [
        "EOEOEO", "OEOEOE"
      ],
      [
        "EOEOOE", "OEOEEO"
      ],
      [
        "EOOEOE", "OEEOEO"
      ]
    ],
    pt = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        if (r.isValid = !1, -1 !== t.search(/^[0-9]{6}$/)) 
          r.middleDigits = t,
          r.upcA = c(t, "0"),
          r.text = n.text || "" + r.upcA[0] + t + r.upcA[r.upcA.length - 1],
          r.isValid = !0;
        else {
          if (-1 === t.search(/^[01][0-9]{7}$/)) 
            return M(r);
          if (r.middleDigits = t.substring(1, t.length - 1), r.upcA = c(r.middleDigits, t[0]), r.upcA[r.upcA.length - 1] !== t[t.length - 1]) 
            return M(r);
          r.isValid = !0
        }
        return r.displayValue = n.displayValue,
        n.fontSize > 10 * n.width
          ? r.fontSize = 10 * n.width
          : r.fontSize = n.fontSize,
        r.guardHeight = n.height + r.fontSize / 2 + n.textMargin,
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return this.isValid
          }
        }, {
          key: "encode",
          value: function() {
            return this.options.flat
              ? this.flatEncoding()
              : this.guardedEncoding()
          }
        }, {
          key: "flatEncoding",
          value: function() {
            var t = new at,
              e = "";
            return e += "101",
            e += this.encodeMiddleDigits(t),
            e += "010101", {
              data: e,
              text: this.text
            }
          }
        }, {
          key: "guardedEncoding",
          value: function() {
            var t = new at,
              e = [];
            return this.displayValue && e.push({
              data: "00000000",
              text: this.text[0],
              options: {
                textAlign: "left",
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "101",
              options: {
                height: this.guardHeight
              }
            }),
            e.push({
              data: this.encodeMiddleDigits(t),
              text: this.text.substring(1, 7),
              options: {
                fontSize: this.fontSize
              }
            }),
            e.push({
              data: "010101",
              options: {
                height: this.guardHeight
              }
            }),
            this.displayValue && e.push({
              data: "00000000",
              text: this.text[7],
              options: {
                textAlign: "right",
                fontSize: this.fontSize
              }
            }),
            e
          }
        }, {
          key: "encodeMiddleDigits",
          value: function(t) {
            var e = this.upcA[0],
              n = this.upcA[this.upcA.length - 1],
              r = lt[parseInt(n)][parseInt(e)];
            return t.encode(this.middleDigits, r)
          }
        }
      ]),
      e
    }(),
    gt = function(t) {
      function e(t, n) {
        j(this, e),
        -1 !== t.search(/^[0-9]{13}$/) && (t += f(t));
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return r.binaryRepresentation = {
          0: "00110",
          1: "10001",
          2: "01001",
          3: "11000",
          4: "00101",
          5: "10100",
          6: "01100",
          7: "00011",
          8: "10010",
          9: "01010"
        },
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]{14}$/) && this.data[13] == f(this.data)
          }
        }, {
          key: "encode",
          value: function() {
            for (var t = "1010", e = 0; e < 14; e += 2) 
              t += this.calculatePair(this.data.substr(e, 2));
            return t += "11101", {
              data: t,
              text: this.text
            }
          }
        }, {
          key: "calculatePair",
          value: function(t) {
            for (var e = "", n = this.binaryRepresentation[t[0]], r = this.binaryRepresentation[t[1]], i = 0; i < 5; i++) 
              e += "1" == n[i]
                ? "111"
                : "1",
              e += "1" == r[i]
                ? "000"
                : "0";
            return e
          }
        }
      ]),
      e
    }(),
    vt = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
        return r.binaryRepresentation = {
          0: "00110",
          1: "10001",
          2: "01001",
          3: "11000",
          4: "00101",
          5: "10100",
          6: "01100",
          7: "00011",
          8: "10010",
          9: "01010"
        },
        r
      }
      return V(e, B),
      X(e, [
        {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^([0-9]{2})+$/)
          }
        }, {
          key: "encode",
          value: function() {
            for (var t = "1010", e = 0; e < this.data.length; e += 2) 
              t += this.calculatePair(this.data.substr(e, 2));
            return t += "11101", {
              data: t,
              text: this.text
            }
          }
        }, {
          key: "calculatePair",
          value: function(t) {
            for (var e = "", n = this.binaryRepresentation[t[0]], r = this.binaryRepresentation[t[1]], i = 0; i < 5; i++) 
              e += "1" == n[i]
                ? "111"
                : "1",
              e += "1" == r[i]
                ? "000"
                : "0";
            return e
          }
        }
      ]),
      e
    }(),
    yt = function(t) {
      function e(t, n) {
        return j(this, e),
        M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
      }
      return V(e, B),
      X(e, [
        {
          key: "encode",
          value: function() {
            for (var t = "110", e = 0; e < this.data.length; e++) {
              var n = parseInt(this.data[e]).toString(2);
              n = d(n, 4 - n.length);
              for (var r = 0; r < n.length; r++) 
                t += "0" == n[r]
                  ? "100"
                  : "110"
              }
            return t += "1001", {
              data: t,
              text: this.text
            }
          }
        }, {
          key: "valid",
          value: function() {
            return -1 !== this.data.search(/^[0-9]+$/)
          }
        }
      ]),
      e
    }(),
    xt = {
      CODE39: $,
      CODE128: nt,
      CODE128A: rt,
      CODE128B: it,
      CODE128C: ot,
      EAN13: st,
      EAN8: ut,
      EAN5: ht,
      EAN2: ct,
      UPC: ft,
      UPCE: pt,
      ITF14: gt,
      ITF: vt,
      MSI: yt,
      MSI10: function(t) {
        function e(t, n) {
          return j(this, e),
          M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t + l(t), n))
        }
        return V(e, yt),
        e
      }(),
      MSI11: function(t) {
        function e(t, n) {
          return j(this, e),
          M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t + p(t), n))
        }
        return V(e, yt),
        e
      }(),
      MSI1010: function(t) {
        function e(t, n) {
          return j(this, e),
          t += l(t),
          t += l(t),
          M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
        }
        return V(e, yt),
        e
      }(),
      MSI1110: function(t) {
        function e(t, n) {
          return j(this, e),
          t += p(t),
          t += l(t),
          M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
        }
        return V(e, yt),
        e
      }(),
      pharmacode: function(t) {
        function e(t, n) {
          j(this, e);
          var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
          return r.number = parseInt(t, 10),
          r
        }
        return V(e, B),
        X(e, [
          {
            key: "encode",
            value: function() {
              for (var t = this.number, e = ""; !isNaN(t) && 0 != t;) 
                t % 2 == 0
                  ? (e = "11100" + e, t = (t - 2) / 2)
                  : (e = "100" + e, t = (t - 1) / 2);
              return e = e.slice(0, -2), {
                data: e,
                text: this.text
              }
            }
          }, {
            key: "valid",
            value: function() {
              return this.number >= 3 && this.number <= 131070
            }
          }
        ]),
        e
      }(),
      codabar: function(t) {
        function e(t, n) {
          j(this, e),
          0 === t.search(/^[0-9\-\$\:\.\+\/]+$/) && (t = "A" + t + "A");
          var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t.toUpperCase(), n));
          return r.text = r.options.text || r.text.replace(/[A-D]/g, ""),
          r
        }
        return V(e, B),
        X(e, [
          {
            key: "valid",
            value: function() {
              return -1 !== this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/)
            }
          }, {
            key: "encode",
            value: function() {
              for (var t = [], e = this.getEncodings(), n = 0; n < this.data.length; n++) 
                t.push(e[this.data.charAt(n)]),
                n !== this.data.length - 1 && t.push("0");
              return {text: this.text, data: t.join("")}
            }
          }, {
            key: "getEncodings",
            value: function() {
              return {
                0: "101010011",
                1: "101011001",
                2: "101001011",
                3: "110010101",
                4: "101101001",
                5: "110101001",
                6: "100101011",
                7: "100101101",
                8: "100110101",
                9: "110100101",
                "-": "101001101",
                $: "101100101",
                ":": "1101011011",
                "/": "1101101011",
                ".": "1101101101",
                "+": "101100110011",
                A: "1011001001",
                B: "1010010011",
                C: "1001001011",
                D: "1010011001"
              }
            }
          }
        ]),
        e
      }(),
      GenericBarcode: function(t) {
        function e(t, n) {
          return j(this, e),
          M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n))
        }
        return V(e, B),
        X(e, [
          {
            key: "encode",
            value: function() {
              return {data: "10101010101010101010101010101010101010101", text: this.text}
            }
          }, {
            key: "valid",
            value: function() {
              return !0
            }
          }
        ]),
        e
      }()
    },
    mt = function(t, e) {
      return I({}, t, e)
    },
    bt = {
      width: .9,
      height: 30,
      format: "auto",
      displayValue: !0,
      fontOptions: "",
      font: "monospace",
      text: void 0,
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 2,
      fontSize: 20,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 10,
      marginTop: void 0,
      marginBottom: void 0,
      marginLeft: void 0,
      marginRight: void 0,
      valid: function() {}
    },
    Ot = "http://www.w3.org/2000/svg",
    _t = {
      CanvasRenderer: function() {
        function t(e, n, r) {
          j(this, t),
          this.canvas = e,
          this.encodings = n,
          this.options = r
        }
        return X(t, [
          {
            key: "render",
            value: function() {
              if (!this.canvas.getContext) 
                throw new Error("The browser does not support canvas.");
              this.prepareCanvas();
              for (var t = 0; t < this.encodings.length; t++) {
                var e = mt(this.options, this.encodings[t].options);
                this.drawCanvasBarcode(e, this.encodings[t]),
                this.drawCanvasText(e, this.encodings[t]),
                this.moveCanvasDrawing(this.encodings[t])
              }
              this.restoreCanvas()
            }
          }, {
            key: "prepareCanvas",
            value: function() {
              var t = this.canvas.getContext("2d");
              t.save(),
              O(this.encodings, this.options, t);
              var e = _(this.encodings),
                n = E(this.encodings);
              this.canvas.width = e + this.options.marginLeft + this.options.marginRight,
              this.canvas.height = n,
              t.clearRect(0, 0, this.canvas.width, this.canvas.height),
              this.options.background && (t.fillStyle = this.options.background, t.fillRect(0, 0, this.canvas.width, this.canvas.height)),
              t.translate(this.options.marginLeft, 0)
            }
          }, {
            key: "drawCanvasBarcode",
            value: function(t, e) {
              var n,
                r = this.canvas.getContext("2d"),
                i = e.data;
              n = "top" == t.textPosition
                ? t.marginTop + t.fontSize + t.textMargin
                : t.marginTop,
              r.fillStyle = t.lineColor;
              for (var o = 0; o < i.length; o++) {
                var a = o * t.width + e.barcodePadding;
                "1" === i[o]
                  ? r.fillRect(a, n, t.width, t.height)
                  : i[o] && r.fillRect(a, n, t.width, t.height * i[o])
              }
            }
          }, {
            key: "drawCanvasText",
            value: function(t, e) {
              var n = this.canvas.getContext("2d"),
                r = t.fontOptions + " " + t.fontSize + "px " + t.font;
              if (t.displayValue) {
                var i,
                  o;
                o = "top" == t.textPosition
                  ? t.marginTop + t.fontSize - t.textMargin
                  : t.height + t.textMargin + t.marginTop + t.fontSize,
                n.font = r,
                "left" == t.textAlign || e.barcodePadding > 0
                  ? (i = 0, n.textAlign = "left")
                  : "right" == t.textAlign
                    ? (i = e.width - 1, n.textAlign = "right")
                    : (i = e.width / 2, n.textAlign = "center"),
                n.fillText(e.text, i, o)
              }
            }
          }, {
            key: "moveCanvasDrawing",
            value: function(t) {
              this.canvas.getContext("2d").translate(t.width, 0)
            }
          }, {
            key: "restoreCanvas",
            value: function() {
              this.canvas.getContext("2d").restore()
            }
          }
        ]),
        t
      }(),
      SVGRenderer: function() {
        function t(e, n, r) {
          j(this, t),
          this.svg = e,
          this.encodings = n,
          this.options = r,
          this.document = r.xmlDocument || document
        }
        return X(t, [
          {
            key: "render",
            value: function() {
              var t = this.options.marginLeft;
              this.prepareSVG();
              for (var e = 0; e < this.encodings.length; e++) {
                var n = this.encodings[e],
                  r = mt(this.options, n.options),
                  i = this.createGroup(t, r.marginTop, this.svg);
                this.setGroupOptions(i, r),
                this.drawSvgBarcode(i, r, n),
                this.drawSVGText(i, r, n),
                t += n.width
              }
            }
          }, {
            key: "prepareSVG",
            value: function() {
              for (; this.svg.firstChild;) 
                this.svg.removeChild(this.svg.firstChild);
              O(this.encodings, this.options);
              var t = _(this.encodings),
                e = E(this.encodings),
                n = t + this.options.marginLeft + this.options.marginRight;
              this.setSvgAttributes(n, e),
              this.options.background && this.drawRect(0, 0, n, e, this.svg).setAttribute("style", "fill:" + this.options.background + ";")
            }
          }, {
            key: "drawSvgBarcode",
            value: function(t, e, n) {
              var r,
                i = n.data;
              r = "top" == e.textPosition
                ? e.fontSize + e.textMargin
                : 0;
              for (var o = 0, a = 0, s = 0; s < i.length; s++) 
                a = s * e.width + n.barcodePadding,
                "1" === i[s]
                  ? o++
                  : o > 0 && (this.drawRect(a - e.width * o, r, e.width * o, e.height, t), o = 0);
              o > 0 && this.drawRect(a - e.width * (o - 1), r, e.width * o, e.height, t)
            }
          }, {
            key: "drawSVGText",
            value: function(t, e, n) {
              var r = this.document.createElementNS(Ot, "text");
              if (e.displayValue) {
                var i,
                  o;
                r.setAttribute("style", "font:" + e.fontOptions + " " + e.fontSize + "px " + e.font),
                o = "top" == e.textPosition
                  ? e.fontSize - e.textMargin
                  : e.height + e.textMargin + e.fontSize,
                "left" == e.textAlign || n.barcodePadding > 0
                  ? (i = 0, r.setAttribute("text-anchor", "start"))
                  : "right" == e.textAlign
                    ? (i = n.width - 1, r.setAttribute("text-anchor", "end"))
                    : (i = n.width / 2, r.setAttribute("text-anchor", "middle")),
                r.setAttribute("x", i),
                r.setAttribute("y", o),
                r.appendChild(this.document.createTextNode(n.text)),
                t.appendChild(r)
              }
            }
          }, {
            key: "setSvgAttributes",
            value: function(t, e) {
              var n = this.svg;
              n.setAttribute("width", t + "px"),
              n.setAttribute("height", e + "px"),
              n.setAttribute("x", "0px"),
              n.setAttribute("y", "0px"),
              n.setAttribute("viewBox", "0 0 " + t + " " + e),
              n.setAttribute("xmlns", Ot),
              n.setAttribute("version", "1.1"),
              n.setAttribute("style", "transform: translate(0,0)")
            }
          }, {
            key: "createGroup",
            value: function(t, e, n) {
              var r = this.document.createElementNS(Ot, "g");
              return r.setAttribute("transform", "translate(" + t + ", " + e + ")"),
              n.appendChild(r),
              r
            }
          }, {
            key: "setGroupOptions",
            value: function(t, e) {
              t.setAttribute("style", "fill:" + e.lineColor + ";")
            }
          }, {
            key: "drawRect",
            value: function(t, e, n, r, i) {
              var o = this.document.createElementNS(Ot, "rect");
              return o.setAttribute("x", t),
              o.setAttribute("y", e),
              o.setAttribute("width", n),
              o.setAttribute("height", r),
              i.appendChild(o),
              o
            }
          }
        ]),
        t
      }(),
      ObjectRenderer: function() {
        function t(e, n, r) {
          j(this, t),
          this.object = e,
          this.encodings = n,
          this.options = r
        }
        return X(t, [
          {
            key: "render",
            value: function() {
              this.object.encodings = this.encodings
            }
          }
        ]),
        t
      }()
    },
    Et = function(t) {
      function e(t, n) {
        j(this, e);
        var r = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
        return r.name = "InvalidInputException",
        r.symbology = t,
        r.input = n,
        r.message = '"' + r.input + '" is not a valid input for ' + r.symbology,
        r
      }
      return V(e, t),
      e
    }(Error),
    wt = function(t) {
      function e() {
        j(this, e);
        var t = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
        return t.name = "InvalidElementException",
        t.message = "Not supported type to render on",
        t
      }
      return V(e, t),
      e
    }(Error),
    Lt = function(t) {
      function e() {
        j(this, e);
        var t = M(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
        return t.name = "NoElementException",
        t.message = "No element to render on.",
        t
      }
      return V(e, t),
      e
    }(Error),
    St = function() {
      function t(e) {
        j(this, t),
        this.api = e
      }
      return X(t, [
        {
          key: "handleCatch",
          value: function(t) {
            if ("InvalidInputException" !== t.name) 
              throw t;
            if (this.api._options.valid === this.api._defaults.valid) 
              throw t.message;
            this.api._options.valid(!1),
            this.api.render = function() {}
          }
        }, {
          key: "wrapBarcodeCall",
          value: function(t) {
            try {
              var e = t.apply(void 0, arguments);
              return this.api._options.valid(!0),
              e
            } catch (t) {
              return this.handleCatch(t),
              this.api
            }
          }
        }
      ]),
      t
    }(),
    Ct = function() {},
    kt = function(t, e, n) {
      var r = new Ct;
      if (void 0 === t) 
        throw Error("No element to render on was provided.");
      return r._renderProperties = L(t),
      r._encodings = [],
      r._options = bt,
      r._errorHandler = new St(r),
      void 0 !== e && ((n = n || {}).format || (n.format = A()), r.options(n)[n.format](e, n).render()),
      r
    };
  kt.getModule = function(t) {
    return xt[t]
  };
  for (var At in xt) 
    xt.hasOwnProperty(At) && function(t, e) {
      Ct.prototype[e] = Ct.prototype[e.toUpperCase()] = Ct.prototype[e.toLowerCase()] = function(n, r) {
        var i = this;
        return i._errorHandler.wrapBarcodeCall(function() {
          r.text = void 0 === r.text
            ? void 0
            : "" + r.text;
          var o = mt(i._options, r);
          o = y(o);
          var a = t[e],
            s = k(n, a, o);
          return i._encodings.push(s),
          i
        })
      }
    }
  (xt, At);
  return Ct.prototype.options = function(t) {
    return this._options = mt(this._options, t),
    this
  },
  Ct.prototype.blank = function(t) {
    var e = new Array(t + 1).join("0");
    return this._encodings.push({data: e}),
    this
  },
  Ct.prototype.init = function() {
    if (this._renderProperties) {
      Array.isArray(this._renderProperties) || (this._renderProperties = [this._renderProperties]);
      var t;
      for (var e in this._renderProperties) {
        t = this._renderProperties[e];
        var n = mt(this._options, t.options);
        "auto" == n.format && (n.format = A()),
        this._errorHandler.wrapBarcodeCall(function() {
          var e = k(n.value, xt[n.format.toUpperCase()], n);
          R(t, e, n)
        })
      }
    }
  },
  Ct.prototype.render = function() {
    if (!this._renderProperties) 
      throw new Lt;
    if (Array.isArray(this._renderProperties)) 
      for (var t = 0; t < this._renderProperties.length; t++) 
        R(this._renderProperties[t], this._encodings, this._options);
  else 
      R(this._renderProperties, this._encodings, this._options);
    return this
  },
  Ct.prototype._defaults = bt,
  "undefined" != typeof window && (window.JsBarcode = kt),
  "undefined" != typeof jQuery && (jQuery.fn.JsBarcode = function(t, e) {
    var n = [];
    return jQuery(this).each(function() {
      n.push(this)
    }),
    kt(n, t, e)
  }), {
    props: {
      value: {
        type: String,
        required: !0
      },
      options: {
        type: Object
      },
      tag: {
        type: String,
        default: "canvas"
      }
    },
    render: function(t) {
      return t(this.tag, this.$slots.default)
    },
    watch: {
      value: function() {
        this.generate()
      },
      options: function() {
        this.generate()
      }
    },
    mounted: function() {
      this.generate()
    },
    methods: {
      generate: function() {
        kt(this.$el, this.value, this.options)
      }
    }
  }
});
