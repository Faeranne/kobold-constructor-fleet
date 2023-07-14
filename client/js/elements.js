"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
      if (decorator = decorators[i4])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // node_modules/@lit/reactive-element/css-tag.js
  var t = window;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var n = /* @__PURE__ */ new WeakMap();
  var o = class {
    constructor(t4, e7, n7) {
      if (this._$cssResult$ = true, n7 !== s)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e7;
    }
    get styleSheet() {
      let t4 = this.o;
      const s5 = this.t;
      if (e && void 0 === t4) {
        const e7 = void 0 !== s5 && 1 === s5.length;
        e7 && (t4 = n.get(s5)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && n.set(s5, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new o("string" == typeof t4 ? t4 : t4 + "", void 0, s);
  var i = (t4, ...e7) => {
    const n7 = 1 === t4.length ? t4[0] : e7.reduce((e8, s5, n8) => e8 + ((t5) => {
      if (true === t5._$cssResult$)
        return t5.cssText;
      if ("number" == typeof t5)
        return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s5) + t4[n8 + 1], t4[0]);
    return new o(n7, t4, s);
  };
  var S = (s5, n7) => {
    e ? s5.adoptedStyleSheets = n7.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : n7.forEach((e7) => {
      const n8 = document.createElement("style"), o8 = t.litNonce;
      void 0 !== o8 && n8.setAttribute("nonce", o8), n8.textContent = e7.cssText, s5.appendChild(n8);
    });
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e7 = "";
    for (const s5 of t5.cssRules)
      e7 += s5.cssText;
    return r(e7);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2 = window;
  var r2 = e2.trustedTypes;
  var h = r2 ? r2.emptyScript : "";
  var o2 = e2.reactiveElementPolyfillSupport;
  var n2 = { toAttribute(t4, i4) {
    switch (i4) {
      case Boolean:
        t4 = t4 ? h : null;
        break;
      case Object:
      case Array:
        t4 = null == t4 ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, i4) {
    let s5 = t4;
    switch (i4) {
      case Boolean:
        s5 = null !== t4;
        break;
      case Number:
        s5 = null === t4 ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          s5 = JSON.parse(t4);
        } catch (t5) {
          s5 = null;
        }
    }
    return s5;
  } };
  var a = (t4, i4) => i4 !== t4 && (i4 == i4 || t4 == t4);
  var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
  var d = "finalized";
  var u = class extends HTMLElement {
    constructor() {
      super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
    }
    static addInitializer(t4) {
      var i4;
      this.finalize(), (null !== (i4 = this.h) && void 0 !== i4 ? i4 : this.h = []).push(t4);
    }
    static get observedAttributes() {
      this.finalize();
      const t4 = [];
      return this.elementProperties.forEach((i4, s5) => {
        const e7 = this._$Ep(s5, i4);
        void 0 !== e7 && (this._$Ev.set(e7, s5), t4.push(e7));
      }), t4;
    }
    static createProperty(t4, i4 = l) {
      if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t4, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t4)) {
        const s5 = "symbol" == typeof t4 ? Symbol() : "__" + t4, e7 = this.getPropertyDescriptor(t4, s5, i4);
        void 0 !== e7 && Object.defineProperty(this.prototype, t4, e7);
      }
    }
    static getPropertyDescriptor(t4, i4, s5) {
      return { get() {
        return this[i4];
      }, set(e7) {
        const r4 = this[t4];
        this[i4] = e7, this.requestUpdate(t4, r4, s5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) || l;
    }
    static finalize() {
      if (this.hasOwnProperty(d))
        return false;
      this[d] = true;
      const t4 = Object.getPrototypeOf(this);
      if (t4.finalize(), void 0 !== t4.h && (this.h = [...t4.h]), this.elementProperties = new Map(t4.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t5 = this.properties, i4 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
        for (const s5 of i4)
          this.createProperty(s5, t5[s5]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i4) {
      const s5 = [];
      if (Array.isArray(i4)) {
        const e7 = new Set(i4.flat(1 / 0).reverse());
        for (const i5 of e7)
          s5.unshift(c(i5));
      } else
        void 0 !== i4 && s5.push(c(i4));
      return s5;
    }
    static _$Ep(t4, i4) {
      const s5 = i4.attribute;
      return false === s5 ? void 0 : "string" == typeof s5 ? s5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
    }
    u() {
      var t4;
      this._$E_ = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t4 = this.constructor.h) || void 0 === t4 || t4.forEach((t5) => t5(this));
    }
    addController(t4) {
      var i4, s5;
      (null !== (i4 = this._$ES) && void 0 !== i4 ? i4 : this._$ES = []).push(t4), void 0 !== this.renderRoot && this.isConnected && (null === (s5 = t4.hostConnected) || void 0 === s5 || s5.call(t4));
    }
    removeController(t4) {
      var i4;
      null === (i4 = this._$ES) || void 0 === i4 || i4.splice(this._$ES.indexOf(t4) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach((t4, i4) => {
        this.hasOwnProperty(i4) && (this._$Ei.set(i4, this[i4]), delete this[i4]);
      });
    }
    createRenderRoot() {
      var t4;
      const s5 = null !== (t4 = this.shadowRoot) && void 0 !== t4 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
      return S(s5, this.constructor.elementStyles), s5;
    }
    connectedCallback() {
      var t4;
      void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t4 = this._$ES) || void 0 === t4 || t4.forEach((t5) => {
        var i4;
        return null === (i4 = t5.hostConnected) || void 0 === i4 ? void 0 : i4.call(t5);
      });
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      var t4;
      null === (t4 = this._$ES) || void 0 === t4 || t4.forEach((t5) => {
        var i4;
        return null === (i4 = t5.hostDisconnected) || void 0 === i4 ? void 0 : i4.call(t5);
      });
    }
    attributeChangedCallback(t4, i4, s5) {
      this._$AK(t4, s5);
    }
    _$EO(t4, i4, s5 = l) {
      var e7;
      const r4 = this.constructor._$Ep(t4, s5);
      if (void 0 !== r4 && true === s5.reflect) {
        const h3 = (void 0 !== (null === (e7 = s5.converter) || void 0 === e7 ? void 0 : e7.toAttribute) ? s5.converter : n2).toAttribute(i4, s5.type);
        this._$El = t4, null == h3 ? this.removeAttribute(r4) : this.setAttribute(r4, h3), this._$El = null;
      }
    }
    _$AK(t4, i4) {
      var s5;
      const e7 = this.constructor, r4 = e7._$Ev.get(t4);
      if (void 0 !== r4 && this._$El !== r4) {
        const t5 = e7.getPropertyOptions(r4), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== (null === (s5 = t5.converter) || void 0 === s5 ? void 0 : s5.fromAttribute) ? t5.converter : n2;
        this._$El = r4, this[r4] = h3.fromAttribute(i4, t5.type), this._$El = null;
      }
    }
    requestUpdate(t4, i4, s5) {
      let e7 = true;
      void 0 !== t4 && (((s5 = s5 || this.constructor.getPropertyOptions(t4)).hasChanged || a)(this[t4], i4) ? (this._$AL.has(t4) || this._$AL.set(t4, i4), true === s5.reflect && this._$El !== t4 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t4, s5))) : e7 = false), !this.isUpdatePending && e7 && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
      this.isUpdatePending = true;
      try {
        await this._$E_;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return null != t4 && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t4;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this._$Ei && (this._$Ei.forEach((t5, i5) => this[i5] = t5), this._$Ei = void 0);
      let i4 = false;
      const s5 = this._$AL;
      try {
        i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), null === (t4 = this._$ES) || void 0 === t4 || t4.forEach((t5) => {
          var i5;
          return null === (i5 = t5.hostUpdate) || void 0 === i5 ? void 0 : i5.call(t5);
        }), this.update(s5)) : this._$Ek();
      } catch (t5) {
        throw i4 = false, this._$Ek(), t5;
      }
      i4 && this._$AE(s5);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      var i4;
      null === (i4 = this._$ES) || void 0 === i4 || i4.forEach((t5) => {
        var i5;
        return null === (i5 = t5.hostUpdated) || void 0 === i5 ? void 0 : i5.call(t5);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$Ek() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$E_;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      void 0 !== this._$EC && (this._$EC.forEach((t5, i4) => this._$EO(i4, this[i4], t5)), this._$EC = void 0), this._$Ek();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  u[d] = true, u.elementProperties = /* @__PURE__ */ new Map(), u.elementStyles = [], u.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: u }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.6.2");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2 = window;
  var s3 = i2.trustedTypes;
  var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var o3 = "$lit$";
  var n3 = `lit$${(Math.random() + "").slice(9)}$`;
  var l2 = "?" + n3;
  var h2 = `<${l2}>`;
  var r3 = document;
  var u2 = () => r3.createComment("");
  var d2 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
  var c2 = Array.isArray;
  var v = (t4) => c2(t4) || "function" == typeof (null == t4 ? void 0 : t4[Symbol.iterator]);
  var a2 = "[ 	\n\f\r]";
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y = /^(?:script|style|textarea|title)$/i;
  var w = (t4) => (i4, ...s5) => ({ _$litType$: t4, strings: i4, values: s5 });
  var x = w(1);
  var b = w(2);
  var T = Symbol.for("lit-noChange");
  var A = Symbol.for("lit-nothing");
  var E = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129, null, false);
  function P(t4, i4) {
    if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i4) : i4;
  }
  var V = (t4, i4) => {
    const s5 = t4.length - 1, e7 = [];
    let l5, r4 = 2 === i4 ? "<svg>" : "", u3 = f;
    for (let i5 = 0; i5 < s5; i5++) {
      const s6 = t4[i5];
      let d3, c3, v2 = -1, a3 = 0;
      for (; a3 < s6.length && (u3.lastIndex = a3, c3 = u3.exec(s6), null !== c3); )
        a3 = u3.lastIndex, u3 === f ? "!--" === c3[1] ? u3 = _ : void 0 !== c3[1] ? u3 = m : void 0 !== c3[2] ? (y.test(c3[2]) && (l5 = RegExp("</" + c3[2], "g")), u3 = p) : void 0 !== c3[3] && (u3 = p) : u3 === p ? ">" === c3[0] ? (u3 = null != l5 ? l5 : f, v2 = -1) : void 0 === c3[1] ? v2 = -2 : (v2 = u3.lastIndex - c3[2].length, d3 = c3[1], u3 = void 0 === c3[3] ? p : '"' === c3[3] ? $ : g) : u3 === $ || u3 === g ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, l5 = void 0);
      const w2 = u3 === p && t4[i5 + 1].startsWith("/>") ? " " : "";
      r4 += u3 === f ? s6 + h2 : v2 >= 0 ? (e7.push(d3), s6.slice(0, v2) + o3 + s6.slice(v2) + n3 + w2) : s6 + n3 + (-2 === v2 ? (e7.push(void 0), i5) : w2);
    }
    return [P(t4, r4 + (t4[s5] || "<?>") + (2 === i4 ? "</svg>" : "")), e7];
  };
  var N = class _N {
    constructor({ strings: t4, _$litType$: i4 }, e7) {
      let h3;
      this.parts = [];
      let r4 = 0, d3 = 0;
      const c3 = t4.length - 1, v2 = this.parts, [a3, f2] = V(t4, i4);
      if (this.el = _N.createElement(a3, e7), C.currentNode = this.el.content, 2 === i4) {
        const t5 = this.el.content, i5 = t5.firstChild;
        i5.remove(), t5.append(...i5.childNodes);
      }
      for (; null !== (h3 = C.nextNode()) && v2.length < c3; ) {
        if (1 === h3.nodeType) {
          if (h3.hasAttributes()) {
            const t5 = [];
            for (const i5 of h3.getAttributeNames())
              if (i5.endsWith(o3) || i5.startsWith(n3)) {
                const s5 = f2[d3++];
                if (t5.push(i5), void 0 !== s5) {
                  const t6 = h3.getAttribute(s5.toLowerCase() + o3).split(n3), i6 = /([.?@])?(.*)/.exec(s5);
                  v2.push({ type: 1, index: r4, name: i6[2], strings: t6, ctor: "." === i6[1] ? H : "?" === i6[1] ? L : "@" === i6[1] ? z : k });
                } else
                  v2.push({ type: 6, index: r4 });
              }
            for (const i5 of t5)
              h3.removeAttribute(i5);
          }
          if (y.test(h3.tagName)) {
            const t5 = h3.textContent.split(n3), i5 = t5.length - 1;
            if (i5 > 0) {
              h3.textContent = s3 ? s3.emptyScript : "";
              for (let s5 = 0; s5 < i5; s5++)
                h3.append(t5[s5], u2()), C.nextNode(), v2.push({ type: 2, index: ++r4 });
              h3.append(t5[i5], u2());
            }
          }
        } else if (8 === h3.nodeType)
          if (h3.data === l2)
            v2.push({ type: 2, index: r4 });
          else {
            let t5 = -1;
            for (; -1 !== (t5 = h3.data.indexOf(n3, t5 + 1)); )
              v2.push({ type: 7, index: r4 }), t5 += n3.length - 1;
          }
        r4++;
      }
    }
    static createElement(t4, i4) {
      const s5 = r3.createElement("template");
      return s5.innerHTML = t4, s5;
    }
  };
  function S2(t4, i4, s5 = t4, e7) {
    var o8, n7, l5, h3;
    if (i4 === T)
      return i4;
    let r4 = void 0 !== e7 ? null === (o8 = s5._$Co) || void 0 === o8 ? void 0 : o8[e7] : s5._$Cl;
    const u3 = d2(i4) ? void 0 : i4._$litDirective$;
    return (null == r4 ? void 0 : r4.constructor) !== u3 && (null === (n7 = null == r4 ? void 0 : r4._$AO) || void 0 === n7 || n7.call(r4, false), void 0 === u3 ? r4 = void 0 : (r4 = new u3(t4), r4._$AT(t4, s5, e7)), void 0 !== e7 ? (null !== (l5 = (h3 = s5)._$Co) && void 0 !== l5 ? l5 : h3._$Co = [])[e7] = r4 : s5._$Cl = r4), void 0 !== r4 && (i4 = S2(t4, r4._$AS(t4, i4.values), r4, e7)), i4;
  }
  var M = class {
    constructor(t4, i4) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      var i4;
      const { el: { content: s5 }, parts: e7 } = this._$AD, o8 = (null !== (i4 = null == t4 ? void 0 : t4.creationScope) && void 0 !== i4 ? i4 : r3).importNode(s5, true);
      C.currentNode = o8;
      let n7 = C.nextNode(), l5 = 0, h3 = 0, u3 = e7[0];
      for (; void 0 !== u3; ) {
        if (l5 === u3.index) {
          let i5;
          2 === u3.type ? i5 = new R(n7, n7.nextSibling, this, t4) : 1 === u3.type ? i5 = new u3.ctor(n7, u3.name, u3.strings, this, t4) : 6 === u3.type && (i5 = new Z(n7, this, t4)), this._$AV.push(i5), u3 = e7[++h3];
        }
        l5 !== (null == u3 ? void 0 : u3.index) && (n7 = C.nextNode(), l5++);
      }
      return C.currentNode = r3, o8;
    }
    v(t4) {
      let i4 = 0;
      for (const s5 of this._$AV)
        void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t4, s5, i4), i4 += s5.strings.length - 2) : s5._$AI(t4[i4])), i4++;
    }
  };
  var R = class _R {
    constructor(t4, i4, s5, e7) {
      var o8;
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s5, this.options = e7, this._$Cp = null === (o8 = null == e7 ? void 0 : e7.isConnected) || void 0 === o8 || o8;
    }
    get _$AU() {
      var t4, i4;
      return null !== (i4 = null === (t4 = this._$AM) || void 0 === t4 ? void 0 : t4._$AU) && void 0 !== i4 ? i4 : this._$Cp;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i4 = this._$AM;
      return void 0 !== i4 && 11 === (null == t4 ? void 0 : t4.nodeType) && (t4 = i4.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i4 = this) {
      t4 = S2(this, t4, i4), d2(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== T && this._(t4) : void 0 !== t4._$litType$ ? this.g(t4) : void 0 !== t4.nodeType ? this.$(t4) : v(t4) ? this.T(t4) : this._(t4);
    }
    k(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    $(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.k(t4));
    }
    _(t4) {
      this._$AH !== A && d2(this._$AH) ? this._$AA.nextSibling.data = t4 : this.$(r3.createTextNode(t4)), this._$AH = t4;
    }
    g(t4) {
      var i4;
      const { values: s5, _$litType$: e7 } = t4, o8 = "number" == typeof e7 ? this._$AC(t4) : (void 0 === e7.el && (e7.el = N.createElement(P(e7.h, e7.h[0]), this.options)), e7);
      if ((null === (i4 = this._$AH) || void 0 === i4 ? void 0 : i4._$AD) === o8)
        this._$AH.v(s5);
      else {
        const t5 = new M(o8, this), i5 = t5.u(this.options);
        t5.v(s5), this.$(i5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i4 = E.get(t4.strings);
      return void 0 === i4 && E.set(t4.strings, i4 = new N(t4)), i4;
    }
    T(t4) {
      c2(this._$AH) || (this._$AH = [], this._$AR());
      const i4 = this._$AH;
      let s5, e7 = 0;
      for (const o8 of t4)
        e7 === i4.length ? i4.push(s5 = new _R(this.k(u2()), this.k(u2()), this, this.options)) : s5 = i4[e7], s5._$AI(o8), e7++;
      e7 < i4.length && (this._$AR(s5 && s5._$AB.nextSibling, e7), i4.length = e7);
    }
    _$AR(t4 = this._$AA.nextSibling, i4) {
      var s5;
      for (null === (s5 = this._$AP) || void 0 === s5 || s5.call(this, false, true, i4); t4 && t4 !== this._$AB; ) {
        const i5 = t4.nextSibling;
        t4.remove(), t4 = i5;
      }
    }
    setConnected(t4) {
      var i4;
      void 0 === this._$AM && (this._$Cp = t4, null === (i4 = this._$AP) || void 0 === i4 || i4.call(this, t4));
    }
  };
  var k = class {
    constructor(t4, i4, s5, e7, o8) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e7, this.options = o8, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4, i4 = this, s5, e7) {
      const o8 = this.strings;
      let n7 = false;
      if (void 0 === o8)
        t4 = S2(this, t4, i4, 0), n7 = !d2(t4) || t4 !== this._$AH && t4 !== T, n7 && (this._$AH = t4);
      else {
        const e8 = t4;
        let l5, h3;
        for (t4 = o8[0], l5 = 0; l5 < o8.length - 1; l5++)
          h3 = S2(this, e8[s5 + l5], i4, l5), h3 === T && (h3 = this._$AH[l5]), n7 || (n7 = !d2(h3) || h3 !== this._$AH[l5]), h3 === A ? t4 = A : t4 !== A && (t4 += (null != h3 ? h3 : "") + o8[l5 + 1]), this._$AH[l5] = h3;
      }
      n7 && !e7 && this.j(t4);
    }
    j(t4) {
      t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t4 ? t4 : "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t4) {
      this.element[this.name] = t4 === A ? void 0 : t4;
    }
  };
  var I = s3 ? s3.emptyScript : "";
  var L = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t4) {
      t4 && t4 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
    }
  };
  var z = class extends k {
    constructor(t4, i4, s5, e7, o8) {
      super(t4, i4, s5, e7, o8), this.type = 5;
    }
    _$AI(t4, i4 = this) {
      var s5;
      if ((t4 = null !== (s5 = S2(this, t4, i4, 0)) && void 0 !== s5 ? s5 : A) === T)
        return;
      const e7 = this._$AH, o8 = t4 === A && e7 !== A || t4.capture !== e7.capture || t4.once !== e7.once || t4.passive !== e7.passive, n7 = t4 !== A && (e7 === A || o8);
      o8 && this.element.removeEventListener(this.name, this, e7), n7 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      var i4, s5;
      "function" == typeof this._$AH ? this._$AH.call(null !== (s5 = null === (i4 = this.options) || void 0 === i4 ? void 0 : i4.host) && void 0 !== s5 ? s5 : this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var Z = class {
    constructor(t4, i4, s5) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s5;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      S2(this, t4);
    }
  };
  var B = i2.litHtmlPolyfillSupport;
  null == B || B(N, R), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.7.5");
  var D = (t4, i4, s5) => {
    var e7, o8;
    const n7 = null !== (e7 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== e7 ? e7 : i4;
    let l5 = n7._$litPart$;
    if (void 0 === l5) {
      const t5 = null !== (o8 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== o8 ? o8 : null;
      n7._$litPart$ = l5 = new R(i4.insertBefore(u2(), t5), t5, void 0, null != s5 ? s5 : {});
    }
    return l5._$AI(t4), l5;
  };

  // node_modules/lit-element/lit-element.js
  var l3;
  var o4;
  var s4 = class extends u {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var t4, e7;
      const i4 = super.createRenderRoot();
      return null !== (t4 = (e7 = this.renderOptions).renderBefore) && void 0 !== t4 || (e7.renderBefore = i4.firstChild), i4;
    }
    update(t4) {
      const i4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(i4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t4;
      super.connectedCallback(), null === (t4 = this._$Do) || void 0 === t4 || t4.setConnected(true);
    }
    disconnectedCallback() {
      var t4;
      super.disconnectedCallback(), null === (t4 = this._$Do) || void 0 === t4 || t4.setConnected(false);
    }
    render() {
      return T;
    }
  };
  s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
  var n4 = globalThis.litElementPolyfillSupport;
  null == n4 || n4({ LitElement: s4 });
  (null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.3.2");

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  var e4 = (e7) => (n7) => "function" == typeof n7 ? ((e8, n8) => (customElements.define(e8, n8), n8))(e7, n7) : ((e8, n8) => {
    const { kind: t4, elements: s5 } = n8;
    return { kind: t4, elements: s5, finisher(n9) {
      customElements.define(e8, n9);
    } };
  })(e7, n7);

  // node_modules/@lit/reactive-element/decorators/property.js
  var i3 = (i4, e7) => "method" === e7.kind && e7.descriptor && !("value" in e7.descriptor) ? { ...e7, finisher(n7) {
    n7.createProperty(e7.key, i4);
  } } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e7.key, initializer() {
    "function" == typeof e7.initializer && (this[e7.key] = e7.initializer.call(this));
  }, finisher(n7) {
    n7.createProperty(e7.key, i4);
  } };
  var e5 = (i4, e7, n7) => {
    e7.constructor.createProperty(n7, i4);
  };
  function n5(n7) {
    return (t4, o8) => void 0 !== o8 ? e5(n7, t4, o8) : i3(n7, t4);
  }

  // node_modules/@lit/reactive-element/decorators/state.js
  function t3(t4) {
    return n5({ ...t4, state: true });
  }

  // node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
  var n6;
  var e6 = null != (null === (n6 = window.HTMLSlotElement) || void 0 === n6 ? void 0 : n6.prototype.assignedElements) ? (o8, n7) => o8.assignedElements(n7) : (o8, n7) => o8.assignedNodes(n7).filter((o9) => o9.nodeType === Node.ELEMENT_NODE);

  // node_modules/lit-html/directives/map.js
  function* o6(o8, f2) {
    if (void 0 !== o8) {
      let i4 = 0;
      for (const t4 of o8)
        yield f2(t4, i4++);
    }
  }

  // node_modules/lit-html/directives/range.js
  function* o7(o8, l5, n7 = 1) {
    const t4 = void 0 === l5 ? 0 : o8;
    null != l5 || (l5 = o8);
    for (let o9 = t4; n7 > 0 ? o9 < l5 : l5 < o9; o9 += n7)
      yield o9;
  }

  // client/ts/crafting.ts
  var global = {};
  var ItemDisplay = class extends s4 {
    constructor() {
      super(...arguments);
      this.item = "empty";
    }
    itemModel(e7) {
    }
    render() {
      return x`<img height="128" width="128" @click="${this.itemModel}" src="./images/items/${this.item}.png">`;
    }
  };
  ItemDisplay.styles = i`img { height:64;width:64 }`;
  __decorateClass([
    n5()
  ], ItemDisplay.prototype, "item", 2);
  ItemDisplay = __decorateClass([
    e4("item-display")
  ], ItemDisplay);
  var ItemSlot = class extends ItemDisplay {
    itemModel(e7) {
      global.selector.target = this;
      global.selector.openDialog = true;
    }
  };
  ItemSlot = __decorateClass([
    e4("item-slot")
  ], ItemSlot);
  var ShapedCrafting = class extends s4 {
    constructor() {
      super(...arguments);
      this.ingredients = ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"];
      this.result = "empty";
    }
    generateRecipe() {
      const grid = this.shadowRoot.querySelector(".grid");
      const items = Array.from(grid.querySelectorAll("item-slot"));
      return items.map((x2) => x2.item);
    }
    importRecipe(recipe) {
      const grid = this.shadowRoot.querySelector(".grid");
      const items = Array.from(grid.querySelectorAll("item-slot"));
      recipe.forEach((item, slot) => {
        items[slot].item = item;
      });
    }
    render() {
      return x`
      <div class="grid">
        <div class="row">${o6(o7(0, 3), (e7) => x`<item-slot item="${this.ingredients[e7]}"/>`)}</div>
        <div class="row">${o6(o7(3, 6), (e7) => x`<item-slot item="${this.ingredients[e7]}"/>`)}</div>
        <div class="row">${o6(o7(6, 9), (e7) => x`<item-slot item="${this.ingredients[e7]}"/>`)}</div>
      </div>
    `;
    }
  };
  ShapedCrafting.styles = i`.row { display: flex; flex-direction: row; padding-bottom: 1% } .grid { display: flex; flex-direction: column} item-slot{ padding-right: 1%}`;
  __decorateClass([
    n5()
  ], ShapedCrafting.prototype, "ingredients", 2);
  __decorateClass([
    n5()
  ], ShapedCrafting.prototype, "result", 2);
  ShapedCrafting = __decorateClass([
    e4("shaped-crafting")
  ], ShapedCrafting);
  var ItemSelector = class extends s4 {
    constructor() {
      super(...arguments);
      this.openDialog = false;
      this.items = { special: ["empty"] };
      this.target = null;
    }
    open() {
      this.openDialog = true;
    }
    select(e7) {
      if (this.target) {
        this.target.item = e7.target.item;
        this.openDialog = false;
      }
    }
    render() {
      return x`
      <dialog ?open=${this.openDialog}>
        <h1>Item Selector</h1>
        <div id="itemList">
          ${o6(Object.keys(this.items), (name) => {
        const itemList = this.items[name];
        return x`<div>
              <h3>${name}</h3>
              ${o6(itemList, (item) => x`<item-display @click="${this.select}" item="${name}:${item}"></item-display>`)}
              </div>`;
      })}
        </div>
      </dialog>
    `;
    }
  };
  ItemSelector.styles = i`
    h1 {
      margin: 0;
      padding: 16px;
      background-color: RGBA(200,200,200,255);
    }
    dialog {
      padding: 0;
    }
  `;
  __decorateClass([
    t3()
  ], ItemSelector.prototype, "openDialog", 2);
  __decorateClass([
    n5()
  ], ItemSelector.prototype, "items", 2);
  ItemSelector = __decorateClass([
    e4("item-selector")
  ], ItemSelector);
  var generateItemSelector = () => {
    global.selector = new ItemSelector();
    document.body.prepend(global.selector);
  };
  document.addEventListener("DOMContentLoaded", function() {
    generateItemSelector();
  }, false);
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/map.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/range.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
