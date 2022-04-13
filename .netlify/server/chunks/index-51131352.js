var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  a: () => locale,
  b: () => locales,
  l: () => loadTranslations,
  t: () => t
});
module.exports = __toCommonJS(stdin_exports);
var import_index_4f192781 = require("./index-4f192781.js");
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = import_index_4f192781.n) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if ((0, import_index_4f192781.a)(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = import_index_4f192781.n) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || import_index_4f192781.n;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = import_index_4f192781.n;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = (0, import_index_4f192781.i)(result) ? result : import_index_4f192781.n;
      }
    };
    const unsubscribers = stores_array.map((store, i2) => (0, import_index_4f192781.b)(store, (value) => {
      values[i2] = value;
      pending &= ~(1 << i2);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i2;
    }));
    inited = true;
    sync();
    return function stop() {
      (0, import_index_4f192781.r)(unsubscribers);
      cleanup();
    };
  });
}
var D$1 = Object.defineProperty, I = Object.defineProperties;
var H$1 = Object.getOwnPropertyDescriptors;
var T$1 = Object.getOwnPropertySymbols;
var F = Object.prototype.hasOwnProperty, K = Object.prototype.propertyIsEnumerable;
var z$1 = (i2, t2, s) => t2 in i2 ? D$1(i2, t2, { enumerable: true, configurable: true, writable: true, value: s }) : i2[t2] = s, l$1 = (i2, t2) => {
  for (var s in t2 || (t2 = {}))
    F.call(t2, s) && z$1(i2, s, t2[s]);
  if (T$1)
    for (var s of T$1(t2))
      K.call(t2, s) && z$1(i2, s, t2[s]);
  return i2;
}, d$2 = (i2, t2) => I(i2, H$1(t2));
var L = (i2, t2) => {
  var s = {};
  for (var e in i2)
    F.call(i2, e) && t2.indexOf(e) < 0 && (s[e] = i2[e]);
  if (i2 != null && T$1)
    for (var e of T$1(i2))
      t2.indexOf(e) < 0 && K.call(i2, e) && (s[e] = i2[e]);
  return s;
};
var C$2 = ({ parser: i2, key: t2, params: s, translations: e, locale: r, fallbackLocale: a2 }) => {
  if (!(t2 && r))
    return console.warn("[i18n]: No translation key or locale provided. Skipping translation..."), "";
  let n2 = (e[r] || {})[t2];
  return a2 && n2 === void 0 && (n2 = (e[a2] || {})[t2]), i2.parse(n2, s, r, t2);
}, h$1 = (...i2) => i2.length ? i2.filter((t2) => !!t2).map((t2) => {
  let s = `${t2}`.toLowerCase();
  try {
    let [e] = Intl.Collator.supportedLocalesOf(t2);
    if (!e)
      throw new Error(`[i18n]: '${t2}' is non-standard.`);
    s = e;
  } catch {
    console.warn(`[i18n]: Non-standard locale provided: '${t2}'. Check your 'translations' and 'loaders' in i18n config...`);
  }
  return s;
}) : [], P$1 = (i2, t2) => Object.keys(i2 || {}).reduce((s, e) => {
  let r = i2[e], a2 = t2 ? `${t2}.${e}` : `${e}`;
  return r && typeof r == "object" ? l$1(l$1({}, s), P$1(r, a2)) : d$2(l$1({}, s), { [a2]: r });
}, {}), j = async (i2) => {
  try {
    return (await Promise.all(i2.map((r) => {
      var a2 = r, { loader: s } = a2, e = L(a2, ["loader"]);
      return new Promise(async (n2) => {
        let c;
        try {
          c = await s();
        } catch (v2) {
          console.error(`[i18n]: Failed to load translation. Verify your '${e.locale}' > '${e.key}' Loader.`), console.error(v2);
        }
        n2(d$2(l$1({ loader: s }, e), { data: c }));
      });
    }))).reduce((s, { key: e, data: r, locale: a2 }) => {
      if (!r)
        return s;
      let [n2] = h$1(a2);
      return d$2(l$1({}, s), { [n2]: P$1(d$2(l$1({}, s[n2] || {}), { [e]: r })) });
    }, {});
  } catch (t2) {
    console.error(t2);
  }
  return {};
}, k$1 = (i2) => (t2) => {
  try {
    if (typeof t2 == "string")
      return t2 === i2;
    if (typeof t2 == "object")
      return t2.test(i2);
  } catch {
    throw new Error("[i18n]: Invalid route config!");
  }
  return false;
}, N$1 = (i2, t2) => {
  let s = true;
  try {
    s = Object.keys(i2).filter((e) => i2[e] !== void 0).every((e) => i2[e] === t2[e]);
  } catch {
  }
  return s;
};
var A$1 = 1e3 * 60 * 60 * 24, E$1 = class {
  constructor(t2) {
    this.cachedAt = 0;
    this.loadedKeys = {};
    this.currentRoute = writable();
    this.config = writable();
    this.isLoading = writable(false);
    this.promises = /* @__PURE__ */ new Set();
    this.loading = { subscribe: this.isLoading.subscribe, toPromise: (t3, s) => {
      let e = Array.from(this.promises).filter((r) => N$1({ locale: h$1(t3)[0], route: s }, r)).map(({ promise: r }) => r);
      return Promise.all(e);
    }, get: () => (0, import_index_4f192781.g)(this.isLoading) };
    this.privateTranslations = writable({});
    this.translations = { subscribe: this.privateTranslations.subscribe, get: () => (0, import_index_4f192781.g)(this.translations) };
    this.locales = d$2(l$1({}, derived([this.config, this.privateTranslations], ([t3, s]) => {
      if (!t3)
        return [];
      let { loaders: e = [] } = t3, r = e.map(({ locale: n2 }) => h$1(n2)[0]), a2 = Object.keys(s).map((n2) => h$1(n2)[0]);
      return Array.from(/* @__PURE__ */ new Set([...r, ...a2]));
    }, [])), { get: () => (0, import_index_4f192781.g)(this.locales) });
    this.internalLocale = writable();
    this.loaderTrigger = derived([this.internalLocale, this.currentRoute], ([t3, s], e) => {
      var r, a2, n2;
      t3 !== void 0 && s !== void 0 && (t3 !== ((r = (0, import_index_4f192781.g)(this.loaderTrigger)) == null ? void 0 : r[0]) || s !== ((a2 = (0, import_index_4f192781.g)(this.loaderTrigger)) == null ? void 0 : a2[1])) && ((n2 = (0, import_index_4f192781.g)(this.config)) != null && n2.debug && console.debug("[i18n]: Triggering translation load..."), e([t3, s]));
    }, []);
    this.localeHelper = writable();
    this.locale = { subscribe: this.localeHelper.subscribe, forceSet: this.localeHelper.set, set: this.internalLocale.set, update: this.internalLocale.update, get: () => (0, import_index_4f192781.g)(this.locale) };
    this.initialized = derived([this.locale, this.currentRoute, this.privateTranslations], ([t3, s, e], r) => {
      (0, import_index_4f192781.g)(this.initialized) || r(t3 !== void 0 && s !== void 0 && !!Object.keys(e).length);
    });
    this.translation = derived([this.privateTranslations, this.locale, this.isLoading], ([t3, s, e], r) => {
      let a2 = t3[s];
      a2 && Object.keys(a2).length && !e && r(a2);
    }, {});
    this.t = d$2(l$1({}, derived([this.config, this.translation], ([{ parser: t3, fallbackLocale: s }]) => (e, ...r) => C$2({ parser: t3, key: e, params: r, translations: this.translations.get(), locale: this.locale.get(), fallbackLocale: s }))), { get: (t3, ...s) => (0, import_index_4f192781.g)(this.t)(t3, ...s) });
    this.l = d$2(l$1({}, derived([this.config, this.translations], ([{ parser: t3, fallbackLocale: s }, e]) => (r, a2, ...n2) => C$2({ parser: t3, key: a2, params: n2, translations: e, locale: r, fallbackLocale: s }))), { get: (t3, s, ...e) => (0, import_index_4f192781.g)(this.l)(t3, s, ...e) });
    this.getLocale = (t3) => {
      if (!t3)
        return "";
      let e = this.locales.get().find((r) => r === h$1(t3)[0]) || "";
      return h$1(e)[0] || "";
    };
    this.setLocale = (t3) => {
      var e;
      if (!t3)
        return;
      let [s] = h$1(t3);
      if (s !== (0, import_index_4f192781.g)(this.internalLocale))
        return (e = (0, import_index_4f192781.g)(this.config)) != null && e.debug && console.debug(`[i18n]: Setting '${s}' locale.`), this.internalLocale.set(s), this.loading.toPromise(t3, (0, import_index_4f192781.g)(this.currentRoute));
    };
    this.setRoute = (t3) => {
      var s;
      if (t3 !== (0, import_index_4f192781.g)(this.currentRoute)) {
        (s = (0, import_index_4f192781.g)(this.config)) != null && s.debug && console.debug(`[i18n]: Setting '${t3}' route.`), this.currentRoute.set(t3);
        let e = (0, import_index_4f192781.g)(this.internalLocale);
        return this.loading.toPromise(e, t3);
      }
    };
    this.loadConfig = async (t3) => {
      await this.configLoader(t3);
    };
    this.getTranslationProps = async (t3 = this.locale.get(), s = (0, import_index_4f192781.g)(this.currentRoute)) => {
      let e = (0, import_index_4f192781.g)(this.config);
      if (!e || !t3)
        return [];
      let r = this.translations.get(), { loaders: a2, fallbackLocale: n2 = "", cache: c = A$1 } = e || {}, v2 = Number.isNaN(+c) ? A$1 : +c;
      this.cachedAt ? Date.now() > v2 + this.cachedAt && (e != null && e.debug && console.debug("[i18n]: Refreshing cache."), this.loadedKeys = {}, this.cachedAt = 0) : (e != null && e.debug && console.debug("[i18n]: Setting cache timestamp."), this.cachedAt = Date.now());
      let [S2, w2] = h$1(t3, n2), O2 = r[S2], W2 = r[w2], x = (a2 || []).map((R2) => {
        var u2 = R2, { locale: g2 } = u2, f2 = L(u2, ["locale"]);
        return d$2(l$1({}, f2), { locale: h$1(g2)[0] });
      }).filter(({ routes: g2 }) => !g2 || (g2 || []).some(k$1(s))).filter(({ key: g2, locale: f2 }) => f2 === S2 && (!O2 || !(this.loadedKeys[S2] || []).includes(g2)) || n2 && f2 === w2 && (!W2 || !(this.loadedKeys[w2] || []).includes(g2)));
      if (x.length) {
        this.isLoading.set(true), e != null && e.debug && console.debug("[i18n]: Fetching translations...");
        let g2 = await j(x);
        this.isLoading.set(false);
        let f2 = Object.keys(g2).reduce((u2, p2) => d$2(l$1({}, u2), { [p2]: Object.keys(g2[p2]) }), {}), R2 = x.filter(({ key: u2, locale: p2 }) => (f2[p2] || []).some((y) => `${y}`.startsWith(u2))).reduce((u2, { key: p2, locale: y }) => d$2(l$1({}, u2), { [y]: [...u2[y] || [], p2] }), {});
        return [g2, R2];
      }
      return [];
    };
    this.addTranslations = (t3, s) => {
      var r;
      if (!t3)
        return;
      (r = (0, import_index_4f192781.g)(this.config)) != null && r.debug && console.debug("[i18n]: Adding translations...");
      let e = Object.keys(t3 || {});
      this.privateTranslations.update((a2) => e.reduce((n2, c) => d$2(l$1({}, n2), { [c]: l$1(l$1({}, n2[c] || {}), P$1(t3[c])) }), a2)), e.forEach((a2) => {
        let n2 = Object.keys(t3[a2]).map((c) => `${c}`.split(".")[0]);
        s && (n2 = s[a2]), this.loadedKeys[a2] = Array.from(/* @__PURE__ */ new Set([...this.loadedKeys[a2] || [], ...n2 || []]));
      });
    };
    this.loader = async ([t3, s]) => {
      var r;
      (r = (0, import_index_4f192781.g)(this.config)) != null && r.debug && console.debug("[i18n]: Adding loader promise.");
      let e = (async () => {
        let a2 = await this.getTranslationProps(t3, s);
        a2.length && this.addTranslations(...a2);
      })();
      this.promises.add({ locale: t3, route: s, promise: e }), e.then(() => {
        let a2 = this.getLocale(t3);
        a2 && this.locale.get() !== a2 && this.locale.forceSet(a2);
      });
    };
    this.loadTranslations = (t3, s = (0, import_index_4f192781.g)(this.currentRoute) || "") => {
      if (!!t3)
        return this.setRoute(s), this.setLocale(t3), this.loading.toPromise(t3, s);
    };
    t2 && this.loadConfig(t2), this.loaderTrigger.subscribe(this.loader), this.isLoading.subscribe(async (s) => {
      var e;
      s && this.promises.size && (await this.loading.toPromise(), this.promises.clear(), (e = (0, import_index_4f192781.g)(this.config)) != null && e.debug && console.debug("[i18n]: Loader promises have been purged."));
    });
  }
  async configLoader(t2) {
    if (!t2)
      throw new Error("[i18n]: No config provided!");
    let c = t2, { initLocale: s, fallbackLocale: e, translations: r, debug: a2 } = c, n2 = L(c, ["initLocale", "fallbackLocale", "translations", "debug"]);
    [s] = h$1(s), [e] = h$1(e), a2 && console.debug("[i18n]: Setting config."), this.config.set(l$1({ initLocale: s, fallbackLocale: e, translations: r, debug: a2 }, n2)), r && this.addTranslations(r), await this.loadTranslations(s);
  }
};
var R = Object.defineProperty, E = Object.defineProperties;
var v = Object.getOwnPropertyDescriptors;
var k = Object.getOwnPropertySymbols;
var C$1 = Object.prototype.hasOwnProperty, O = Object.prototype.propertyIsEnumerable;
var w = (t2, e, r) => e in t2 ? R(t2, e, { enumerable: true, configurable: true, writable: true, value: r }) : t2[e] = r, u$1 = (t2, e) => {
  for (var r in e || (e = {}))
    C$1.call(e, r) && w(t2, r, e[r]);
  if (k)
    for (var r of k(e))
      O.call(e, r) && w(t2, r, e[r]);
  return t2;
}, $ = (t2, e) => E(t2, v(e));
var d$1 = (t2, e) => {
  var r = {};
  for (var i2 in t2)
    C$1.call(t2, i2) && e.indexOf(i2) < 0 && (r[i2] = t2[i2]);
  if (t2 != null && k)
    for (var i2 of k(t2))
      e.indexOf(i2) < 0 && O.call(t2, i2) && (r[i2] = t2[i2]);
  return r;
};
var z = (t2, e) => {
  for (var r in e)
    R(t2, r, { get: e[r], enumerable: true });
};
var h = {};
z(h, { ago: () => X, date: () => Q, eq: () => p$1, gt: () => q, gte: () => H, lt: () => U, lte: () => G, ne: () => B$1, number: () => J });
var T = (t2, e) => {
  let { modifierDefaults: r } = e || {}, { [t2]: i2 } = r || {};
  return i2 || {};
};
var p$1 = ({ value: t2, options: e = [], defaultValue: r = "" }) => (e.find(({ key: i2 }) => `${i2}`.toLowerCase() === `${t2}`.toLowerCase()) || {}).value || r, B$1 = ({ value: t2, options: e = [], defaultValue: r = "" }) => (e.find(({ key: i2 }) => `${i2}`.toLowerCase() !== `${t2}`.toLowerCase()) || {}).value || r, U = ({ value: t2, options: e = [], defaultValue: r = "" }) => (e.sort((o, n2) => +o.key - +n2.key).find(({ key: o }) => +t2 < +o) || {}).value || r, q = ({ value: t2, options: e = [], defaultValue: r = "" }) => (e.sort((o, n2) => +n2.key - +o.key).find(({ key: o }) => +t2 > +o) || {}).value || r, G = ({ value: t2, options: e = [], defaultValue: r = "" }) => p$1({ value: t2, options: e, defaultValue: U({ value: t2, options: e, defaultValue: r }) }), H = ({ value: t2, options: e = [], defaultValue: r = "" }) => p$1({ value: t2, options: e, defaultValue: q({ value: t2, options: e, defaultValue: r }) }), J = ({ value: t2, props: e, defaultValue: r = "", locale: i2 = "", parserOptions: o }) => {
  if (!i2)
    return "";
  let s = T("number", o), { maximumFractionDigits: n2 } = s, m2 = d$1(s, ["maximumFractionDigits"]), c = (e == null ? void 0 : e.number) || {}, { maximumFractionDigits: f2 = n2 || 2 } = c, a2 = d$1(c, ["maximumFractionDigits"]);
  return new Intl.NumberFormat(i2, u$1($(u$1({}, m2), { maximumFractionDigits: f2 }), a2)).format(+t2 || +r);
}, Q = ({ value: t2, props: e, defaultValue: r = "", locale: i2 = "", parserOptions: o }) => {
  if (!i2)
    return "";
  let n2 = d$1(T("date", o), []), m2 = d$1((e == null ? void 0 : e.date) || {}, []);
  return new Intl.DateTimeFormat(i2, u$1(u$1({}, n2), m2)).format(+t2 || +r);
}, P = [{ key: "second", multiplier: 1e3 }, { key: "minute", multiplier: 60 }, { key: "hour", multiplier: 60 }, { key: "day", multiplier: 24 }, { key: "week", multiplier: 7 }, { key: "month", multiplier: 13 / 3 }, { key: "year", multiplier: 12 }], N = (t2 = "", e = "") => new RegExp(`^${t2}s?$`).test(e), S = (t2) => P.indexOf(P.find(({ key: e }) => N(e, t2))), W = (t2, e) => P.reduce(([r, i2], { key: o, multiplier: n2 }, m2) => {
  if (N(i2, e))
    return [r, i2];
  if (!i2 || m2 === S(i2) + 1) {
    let f2 = Math.round(r / n2);
    if (!i2 || Math.abs(f2) >= 1 || e !== "auto")
      return [f2, o];
  }
  return [r, i2];
}, [t2, ""]), X = ({ value: t2, defaultValue: e = "", locale: r = "", props: i2, parserOptions: o }) => {
  if (!r)
    return "";
  let g2 = T("ago", o), { format: n2, numeric: m2 } = g2, f2 = d$1(g2, ["format", "numeric"]), l2 = (i2 == null ? void 0 : i2.ago) || {}, { format: a2 = n2 || "auto", numeric: s = m2 || "auto" } = l2, c = d$1(l2, ["format", "numeric"]), x = +t2 || +e, M = W(x, a2);
  return new Intl.RelativeTimeFormat(r, u$1($(u$1({}, f2), { numeric: s }), c)).format(...M);
};
var Y = (t2) => typeof t2 == "string" && /{{(?:(?!{{|}}).)+}}/.test(t2), D = (t2) => typeof t2 == "string" ? t2.replace(/\\(?=:|;|{|})/g, "") : t2, Z = ({ value: t2, props: e, payload: r, parserOptions: i2, locale: o }) => `${t2}`.replace(/{{\s*(?:(?!{{|}}).)+\s*}}/g, (n2) => {
  let m2 = D(`${n2.match(/(?!{|\s).+?(?!\\[:;]).(?=\s*(?:[:;]|}}$))/)}`), f2 = r == null ? void 0 : r[m2], [, a2 = ""] = n2.match(/.+?(?!\\;).;\s*default\s*:\s*([^\s:;].+?(?:\\[:;]|[^;\s}])*)(?=\s*(?:;|}}$))/i) || [];
  a2 = a2 || (r == null ? void 0 : r.default) || "";
  let [, s = ""] = n2.match(/{{\s*(?:[^;]|(?:\\;))+\s*(?:(?!\\:).[:])\s*(?!\s)((?:\\;|[^;])+?)(?=\s*(?:[;]|}}$))/i) || [];
  if (f2 === void 0 && s !== "ne")
    return a2;
  let c = !!s, { customModifiers: x } = i2 || {}, M = u$1(u$1({}, h), x || {});
  s = Object.keys(M).includes(s) ? s : "eq";
  let g2 = M[s], l2 = (n2.match(/[^\s:;{](?:[^;]|\\[;])+[^\s:;}]/gi) || []).reduce((F2, b, j2) => {
    if (j2 > 0) {
      let y = D(`${b.match(/(?:(?:\\:)|[^:])+/)}`.trim()), I2 = `${b.match(/(?:(?:\\:)|[^:])+$/)}`.trim();
      if (y && y !== "default" && I2)
        return [...F2, { key: y, value: I2 }];
    }
    return F2;
  }, []);
  return !c && !l2.length ? f2 : g2({ value: f2, options: l2, props: e, defaultValue: a2, locale: o, parserOptions: i2 });
}), A = ({ value: t2, props: e, payload: r, parserOptions: i2, locale: o }) => {
  if (Y(t2)) {
    let n2 = Z({ value: t2, payload: r, props: e, parserOptions: i2, locale: o });
    return A({ value: n2, payload: r, props: e, parserOptions: i2, locale: o });
  } else
    return D(t2);
}, _ = (t2) => ({ parse: (e, [r, i2], o, n2) => ((r == null ? void 0 : r.default) && e === void 0 && (e = `${r.default}`), e === void 0 && (e = `${n2}`), A({ value: e, payload: r, props: i2, parserOptions: t2, locale: o })) }), rt = _;
var d = Object.defineProperty, l = Object.defineProperties;
var u = Object.getOwnPropertyDescriptors;
var t$1 = Object.getOwnPropertySymbols;
var i = Object.prototype.hasOwnProperty, f = Object.prototype.propertyIsEnumerable;
var p = (r, o, e) => o in r ? d(r, o, { enumerable: true, configurable: true, writable: true, value: e }) : r[o] = e, m = (r, o) => {
  for (var e in o || (o = {}))
    i.call(o, e) && p(r, e, o[e]);
  if (t$1)
    for (var e of t$1(o))
      f.call(o, e) && p(r, e, o[e]);
  return r;
}, n = (r, o) => l(r, u(o));
var g = (r, o) => {
  var e = {};
  for (var s in r)
    i.call(r, s) && o.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && t$1)
    for (var s of t$1(r))
      o.indexOf(s) < 0 && f.call(r, s) && (e[s] = r[s]);
  return e;
};
var C = (e) => {
  var s = e, { parserOptions: r = {} } = s, o = g(s, ["parserOptions"]);
  return n(m({}, o), { parser: rt(r) });
}, a = class extends E$1 {
  constructor(e) {
    super(e && C(e));
    this.loadConfig = (e2) => super.configLoader(C(e2));
  }
}, B = a;
const en = "English";
const fr = "French";
var lang = {
  en,
  fr
};
const config = {
  translations: {
    en: { lang },
    fr: { lang }
  },
  loaders: [
    {
      locale: "en",
      key: "en",
      loader: async () => (await Promise.resolve().then(() => __toESM(require("./en-f39cd644.js")))).default
    },
    {
      locale: "fr",
      key: "en",
      loader: async () => (await Promise.resolve().then(() => __toESM(require("./en-f39cd644.js")))).default
    }
  ]
};
const { t, loading, locales, locale, loadTranslations } = new B(config);
loading.subscribe(($loading) => $loading && console.log("Loading translations..."));
