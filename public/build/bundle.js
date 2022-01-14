
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
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
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
    	return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, options) {
    	return (options.clone !== false && options.isMergeableObject(value))
    		? deepmerge(emptyTarget(value), value, options)
    		: value
    }

    function defaultArrayMerge(target, source, options) {
    	return target.concat(source).map(function(element) {
    		return cloneUnlessOtherwiseSpecified(element, options)
    	})
    }

    function getMergeFunction(key, options) {
    	if (!options.customMerge) {
    		return deepmerge
    	}
    	var customMerge = options.customMerge(key);
    	return typeof customMerge === 'function' ? customMerge : deepmerge
    }

    function getEnumerableOwnPropertySymbols(target) {
    	return Object.getOwnPropertySymbols
    		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
    			return target.propertyIsEnumerable(symbol)
    		})
    		: []
    }

    function getKeys(target) {
    	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
    }

    function propertyIsOnObject(object, property) {
    	try {
    		return property in object
    	} catch(_) {
    		return false
    	}
    }

    // Protects from prototype poisoning and unexpected merging up the prototype chain.
    function propertyIsUnsafe(target, key) {
    	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    }

    function mergeObject(target, source, options) {
    	var destination = {};
    	if (options.isMergeableObject(target)) {
    		getKeys(target).forEach(function(key) {
    			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    		});
    	}
    	getKeys(source).forEach(function(key) {
    		if (propertyIsUnsafe(target, key)) {
    			return
    		}

    		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
    			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    		} else {
    			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    		}
    	});
    	return destination
    }

    function deepmerge(target, source, options) {
    	options = options || {};
    	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    	// implementations can use it. The caller may not replace it.
    	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    	var sourceIsArray = Array.isArray(source);
    	var targetIsArray = Array.isArray(target);
    	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    	if (!sourceAndTargetTypesMatch) {
    		return cloneUnlessOtherwiseSpecified(source, options)
    	} else if (sourceIsArray) {
    		return options.arrayMerge(target, source, options)
    	} else {
    		return mergeObject(target, source, options)
    	}
    }

    deepmerge.all = function deepmergeAll(array, options) {
    	if (!Array.isArray(array)) {
    		throw new Error('first argument should be an array')
    	}

    	return array.reduce(function(prev, next) {
    		return deepmerge(prev, next, options)
    	}, {})
    };

    var deepmerge_1 = deepmerge;

    var cjs = deepmerge_1;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var ErrorKind;
    (function (ErrorKind) {
        /** Argument is unclosed (e.g. `{0`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
        /** Argument is empty (e.g. `{}`). */
        ErrorKind[ErrorKind["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
        /** Argument is malformed (e.g. `{foo!}``) */
        ErrorKind[ErrorKind["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
        /** Expect an argument type (e.g. `{foo,}`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
        /** Unsupported argument type (e.g. `{foo,foo}`) */
        ErrorKind[ErrorKind["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
        /** Expect an argument style (e.g. `{foo, number, }`) */
        ErrorKind[ErrorKind["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
        /** The number skeleton is invalid. */
        ErrorKind[ErrorKind["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
        /** The date time skeleton is invalid. */
        ErrorKind[ErrorKind["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
        /** Exepct a number skeleton following the `::` (e.g. `{foo, number, ::}`) */
        ErrorKind[ErrorKind["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
        /** Exepct a date time skeleton following the `::` (e.g. `{foo, date, ::}`) */
        ErrorKind[ErrorKind["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
        /** Unmatched apostrophes in the argument style (e.g. `{foo, number, 'test`) */
        ErrorKind[ErrorKind["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
        /** Missing select argument options (e.g. `{foo, select}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
        /** Expecting an offset value in `plural` or `selectordinal` argument (e.g `{foo, plural, offset}`) */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
        /** Offset value in `plural` or `selectordinal` is invalid (e.g. `{foo, plural, offset: x}`) */
        ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
        /** Expecting a selector in `select` argument (e.g `{foo, select}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
        /** Expecting a selector in `plural` or `selectordinal` argument (e.g `{foo, plural}`) */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
        /** Expecting a message fragment after the `select` selector (e.g. `{foo, select, apple}`) */
        ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
        /**
         * Expecting a message fragment after the `plural` or `selectordinal` selector
         * (e.g. `{foo, plural, one}`)
         */
        ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
        /** Selector in `plural` or `selectordinal` is malformed (e.g. `{foo, plural, =x {#}}`) */
        ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
        /**
         * Duplicate selectors in `plural` or `selectordinal` argument.
         * (e.g. {foo, plural, one {#} one {#}})
         */
        ErrorKind[ErrorKind["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
        /** Duplicate selectors in `select` argument.
         * (e.g. {foo, select, apple {apple} apple {apple}})
         */
        ErrorKind[ErrorKind["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
        /** Plural or select argument option must have `other` clause. */
        ErrorKind[ErrorKind["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
        /** The tag is malformed. (e.g. `<bold!>foo</bold!>) */
        ErrorKind[ErrorKind["INVALID_TAG"] = 23] = "INVALID_TAG";
        /** The tag name is invalid. (e.g. `<123>foo</123>`) */
        ErrorKind[ErrorKind["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
        /** The closing tag does not match the opening tag. (e.g. `<bold>foo</italic>`) */
        ErrorKind[ErrorKind["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
        /** The opening tag has unmatched closing tag. (e.g. `<bold>foo`) */
        ErrorKind[ErrorKind["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
    })(ErrorKind || (ErrorKind = {}));

    var TYPE;
    (function (TYPE) {
        /**
         * Raw text
         */
        TYPE[TYPE["literal"] = 0] = "literal";
        /**
         * Variable w/o any format, e.g `var` in `this is a {var}`
         */
        TYPE[TYPE["argument"] = 1] = "argument";
        /**
         * Variable w/ number format
         */
        TYPE[TYPE["number"] = 2] = "number";
        /**
         * Variable w/ date format
         */
        TYPE[TYPE["date"] = 3] = "date";
        /**
         * Variable w/ time format
         */
        TYPE[TYPE["time"] = 4] = "time";
        /**
         * Variable w/ select format
         */
        TYPE[TYPE["select"] = 5] = "select";
        /**
         * Variable w/ plural format
         */
        TYPE[TYPE["plural"] = 6] = "plural";
        /**
         * Only possible within plural argument.
         * This is the `#` symbol that will be substituted with the count.
         */
        TYPE[TYPE["pound"] = 7] = "pound";
        /**
         * XML-like tag
         */
        TYPE[TYPE["tag"] = 8] = "tag";
    })(TYPE || (TYPE = {}));
    var SKELETON_TYPE;
    (function (SKELETON_TYPE) {
        SKELETON_TYPE[SKELETON_TYPE["number"] = 0] = "number";
        SKELETON_TYPE[SKELETON_TYPE["dateTime"] = 1] = "dateTime";
    })(SKELETON_TYPE || (SKELETON_TYPE = {}));
    /**
     * Type Guards
     */
    function isLiteralElement(el) {
        return el.type === TYPE.literal;
    }
    function isArgumentElement(el) {
        return el.type === TYPE.argument;
    }
    function isNumberElement(el) {
        return el.type === TYPE.number;
    }
    function isDateElement(el) {
        return el.type === TYPE.date;
    }
    function isTimeElement(el) {
        return el.type === TYPE.time;
    }
    function isSelectElement(el) {
        return el.type === TYPE.select;
    }
    function isPluralElement(el) {
        return el.type === TYPE.plural;
    }
    function isPoundElement(el) {
        return el.type === TYPE.pound;
    }
    function isTagElement(el) {
        return el.type === TYPE.tag;
    }
    function isNumberSkeleton(el) {
        return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.number);
    }
    function isDateTimeSkeleton(el) {
        return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.dateTime);
    }

    // @generated from regex-gen.ts
    var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

    /**
     * https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
     * with some tweaks
     */
    var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
    /**
     * Parse Date time skeleton into Intl.DateTimeFormatOptions
     * Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * @public
     * @param skeleton skeleton string
     */
    function parseDateTimeSkeleton(skeleton) {
        var result = {};
        skeleton.replace(DATE_TIME_REGEX, function (match) {
            var len = match.length;
            switch (match[0]) {
                // Era
                case 'G':
                    result.era = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
                    break;
                // Year
                case 'y':
                    result.year = len === 2 ? '2-digit' : 'numeric';
                    break;
                case 'Y':
                case 'u':
                case 'U':
                case 'r':
                    throw new RangeError('`Y/u/U/r` (year) patterns are not supported, use `y` instead');
                // Quarter
                case 'q':
                case 'Q':
                    throw new RangeError('`q/Q` (quarter) patterns are not supported');
                // Month
                case 'M':
                case 'L':
                    result.month = ['numeric', '2-digit', 'short', 'long', 'narrow'][len - 1];
                    break;
                // Week
                case 'w':
                case 'W':
                    throw new RangeError('`w/W` (week) patterns are not supported');
                case 'd':
                    result.day = ['numeric', '2-digit'][len - 1];
                    break;
                case 'D':
                case 'F':
                case 'g':
                    throw new RangeError('`D/F/g` (day) patterns are not supported, use `d` instead');
                // Weekday
                case 'E':
                    result.weekday = len === 4 ? 'short' : len === 5 ? 'narrow' : 'short';
                    break;
                case 'e':
                    if (len < 4) {
                        throw new RangeError('`e..eee` (weekday) patterns are not supported');
                    }
                    result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                    break;
                case 'c':
                    if (len < 4) {
                        throw new RangeError('`c..ccc` (weekday) patterns are not supported');
                    }
                    result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                    break;
                // Period
                case 'a': // AM, PM
                    result.hour12 = true;
                    break;
                case 'b': // am, pm, noon, midnight
                case 'B': // flexible day periods
                    throw new RangeError('`b/B` (period) patterns are not supported, use `a` instead');
                // Hour
                case 'h':
                    result.hourCycle = 'h12';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'H':
                    result.hourCycle = 'h23';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'K':
                    result.hourCycle = 'h11';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'k':
                    result.hourCycle = 'h24';
                    result.hour = ['numeric', '2-digit'][len - 1];
                    break;
                case 'j':
                case 'J':
                case 'C':
                    throw new RangeError('`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead');
                // Minute
                case 'm':
                    result.minute = ['numeric', '2-digit'][len - 1];
                    break;
                // Second
                case 's':
                    result.second = ['numeric', '2-digit'][len - 1];
                    break;
                case 'S':
                case 'A':
                    throw new RangeError('`S/A` (second) patterns are not supported, use `s` instead');
                // Zone
                case 'z': // 1..3, 4: specific non-location format
                    result.timeZoneName = len < 4 ? 'short' : 'long';
                    break;
                case 'Z': // 1..3, 4, 5: The ISO8601 varios formats
                case 'O': // 1, 4: miliseconds in day short, long
                case 'v': // 1, 4: generic non-location format
                case 'V': // 1, 2, 3, 4: time zone ID or city
                case 'X': // 1, 2, 3, 4: The ISO8601 varios formats
                case 'x': // 1, 2, 3, 4: The ISO8601 varios formats
                    throw new RangeError('`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead');
            }
            return '';
        });
        return result;
    }

    // @generated from regex-gen.ts
    var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

    function parseNumberSkeletonFromString(skeleton) {
        if (skeleton.length === 0) {
            throw new Error('Number skeleton cannot be empty');
        }
        // Parse the skeleton
        var stringTokens = skeleton
            .split(WHITE_SPACE_REGEX)
            .filter(function (x) { return x.length > 0; });
        var tokens = [];
        for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
            var stringToken = stringTokens_1[_i];
            var stemAndOptions = stringToken.split('/');
            if (stemAndOptions.length === 0) {
                throw new Error('Invalid number skeleton');
            }
            var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
            for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
                var option = options_1[_a];
                if (option.length === 0) {
                    throw new Error('Invalid number skeleton');
                }
            }
            tokens.push({ stem: stem, options: options });
        }
        return tokens;
    }
    function icuUnitToEcma(unit) {
        return unit.replace(/^(.*?)-/, '');
    }
    var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
    var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
    var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
    var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
    function parseSignificantPrecision(str) {
        var result = {};
        if (str[str.length - 1] === 'r') {
            result.roundingPriority = 'morePrecision';
        }
        else if (str[str.length - 1] === 's') {
            result.roundingPriority = 'lessPrecision';
        }
        str.replace(SIGNIFICANT_PRECISION_REGEX, function (_, g1, g2) {
            // @@@ case
            if (typeof g2 !== 'string') {
                result.minimumSignificantDigits = g1.length;
                result.maximumSignificantDigits = g1.length;
            }
            // @@@+ case
            else if (g2 === '+') {
                result.minimumSignificantDigits = g1.length;
            }
            // .### case
            else if (g1[0] === '#') {
                result.maximumSignificantDigits = g1.length;
            }
            // .@@## or .@@@ case
            else {
                result.minimumSignificantDigits = g1.length;
                result.maximumSignificantDigits =
                    g1.length + (typeof g2 === 'string' ? g2.length : 0);
            }
            return '';
        });
        return result;
    }
    function parseSign(str) {
        switch (str) {
            case 'sign-auto':
                return {
                    signDisplay: 'auto',
                };
            case 'sign-accounting':
            case '()':
                return {
                    currencySign: 'accounting',
                };
            case 'sign-always':
            case '+!':
                return {
                    signDisplay: 'always',
                };
            case 'sign-accounting-always':
            case '()!':
                return {
                    signDisplay: 'always',
                    currencySign: 'accounting',
                };
            case 'sign-except-zero':
            case '+?':
                return {
                    signDisplay: 'exceptZero',
                };
            case 'sign-accounting-except-zero':
            case '()?':
                return {
                    signDisplay: 'exceptZero',
                    currencySign: 'accounting',
                };
            case 'sign-never':
            case '+_':
                return {
                    signDisplay: 'never',
                };
        }
    }
    function parseConciseScientificAndEngineeringStem(stem) {
        // Engineering
        var result;
        if (stem[0] === 'E' && stem[1] === 'E') {
            result = {
                notation: 'engineering',
            };
            stem = stem.slice(2);
        }
        else if (stem[0] === 'E') {
            result = {
                notation: 'scientific',
            };
            stem = stem.slice(1);
        }
        if (result) {
            var signDisplay = stem.slice(0, 2);
            if (signDisplay === '+!') {
                result.signDisplay = 'always';
                stem = stem.slice(2);
            }
            else if (signDisplay === '+?') {
                result.signDisplay = 'exceptZero';
                stem = stem.slice(2);
            }
            if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
                throw new Error('Malformed concise eng/scientific notation');
            }
            result.minimumIntegerDigits = stem.length;
        }
        return result;
    }
    function parseNotationOptions(opt) {
        var result = {};
        var signOpts = parseSign(opt);
        if (signOpts) {
            return signOpts;
        }
        return result;
    }
    /**
     * https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md#skeleton-stems-and-options
     */
    function parseNumberSkeleton(tokens) {
        var result = {};
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            switch (token.stem) {
                case 'percent':
                case '%':
                    result.style = 'percent';
                    continue;
                case '%x100':
                    result.style = 'percent';
                    result.scale = 100;
                    continue;
                case 'currency':
                    result.style = 'currency';
                    result.currency = token.options[0];
                    continue;
                case 'group-off':
                case ',_':
                    result.useGrouping = false;
                    continue;
                case 'precision-integer':
                case '.':
                    result.maximumFractionDigits = 0;
                    continue;
                case 'measure-unit':
                case 'unit':
                    result.style = 'unit';
                    result.unit = icuUnitToEcma(token.options[0]);
                    continue;
                case 'compact-short':
                case 'K':
                    result.notation = 'compact';
                    result.compactDisplay = 'short';
                    continue;
                case 'compact-long':
                case 'KK':
                    result.notation = 'compact';
                    result.compactDisplay = 'long';
                    continue;
                case 'scientific':
                    result = __assign(__assign(__assign({}, result), { notation: 'scientific' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                    continue;
                case 'engineering':
                    result = __assign(__assign(__assign({}, result), { notation: 'engineering' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                    continue;
                case 'notation-simple':
                    result.notation = 'standard';
                    continue;
                // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
                case 'unit-width-narrow':
                    result.currencyDisplay = 'narrowSymbol';
                    result.unitDisplay = 'narrow';
                    continue;
                case 'unit-width-short':
                    result.currencyDisplay = 'code';
                    result.unitDisplay = 'short';
                    continue;
                case 'unit-width-full-name':
                    result.currencyDisplay = 'name';
                    result.unitDisplay = 'long';
                    continue;
                case 'unit-width-iso-code':
                    result.currencyDisplay = 'symbol';
                    continue;
                case 'scale':
                    result.scale = parseFloat(token.options[0]);
                    continue;
                // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
                case 'integer-width':
                    if (token.options.length > 1) {
                        throw new RangeError('integer-width stems only accept a single optional option');
                    }
                    token.options[0].replace(INTEGER_WIDTH_REGEX, function (_, g1, g2, g3, g4, g5) {
                        if (g1) {
                            result.minimumIntegerDigits = g2.length;
                        }
                        else if (g3 && g4) {
                            throw new Error('We currently do not support maximum integer digits');
                        }
                        else if (g5) {
                            throw new Error('We currently do not support exact integer digits');
                        }
                        return '';
                    });
                    continue;
            }
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
            if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
                result.minimumIntegerDigits = token.stem.length;
                continue;
            }
            if (FRACTION_PRECISION_REGEX.test(token.stem)) {
                // Precision
                // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#fraction-precision
                // precision-integer case
                if (token.options.length > 1) {
                    throw new RangeError('Fraction-precision stems only accept a single optional option');
                }
                token.stem.replace(FRACTION_PRECISION_REGEX, function (_, g1, g2, g3, g4, g5) {
                    // .000* case (before ICU67 it was .000+)
                    if (g2 === '*') {
                        result.minimumFractionDigits = g1.length;
                    }
                    // .### case
                    else if (g3 && g3[0] === '#') {
                        result.maximumFractionDigits = g3.length;
                    }
                    // .00## case
                    else if (g4 && g5) {
                        result.minimumFractionDigits = g4.length;
                        result.maximumFractionDigits = g4.length + g5.length;
                    }
                    else {
                        result.minimumFractionDigits = g1.length;
                        result.maximumFractionDigits = g1.length;
                    }
                    return '';
                });
                var opt = token.options[0];
                // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#trailing-zero-display
                if (opt === 'w') {
                    result = __assign(__assign({}, result), { trailingZeroDisplay: 'stripIfInteger' });
                }
                else if (opt) {
                    result = __assign(__assign({}, result), parseSignificantPrecision(opt));
                }
                continue;
            }
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#significant-digits-precision
            if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
                result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
                continue;
            }
            var signOpts = parseSign(token.stem);
            if (signOpts) {
                result = __assign(__assign({}, result), signOpts);
            }
            var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
            if (conciseScientificAndEngineeringOpts) {
                result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
            }
        }
        return result;
    }

    var _a;
    var SPACE_SEPARATOR_START_REGEX = new RegExp("^".concat(SPACE_SEPARATOR_REGEX.source, "*"));
    var SPACE_SEPARATOR_END_REGEX = new RegExp("".concat(SPACE_SEPARATOR_REGEX.source, "*$"));
    function createLocation(start, end) {
        return { start: start, end: end };
    }
    // #region Ponyfills
    // Consolidate these variables up top for easier toggling during debugging
    var hasNativeStartsWith = !!String.prototype.startsWith;
    var hasNativeFromCodePoint = !!String.fromCodePoint;
    var hasNativeFromEntries = !!Object.fromEntries;
    var hasNativeCodePointAt = !!String.prototype.codePointAt;
    var hasTrimStart = !!String.prototype.trimStart;
    var hasTrimEnd = !!String.prototype.trimEnd;
    var hasNativeIsSafeInteger = !!Number.isSafeInteger;
    var isSafeInteger = hasNativeIsSafeInteger
        ? Number.isSafeInteger
        : function (n) {
            return (typeof n === 'number' &&
                isFinite(n) &&
                Math.floor(n) === n &&
                Math.abs(n) <= 0x1fffffffffffff);
        };
    // IE11 does not support y and u.
    var REGEX_SUPPORTS_U_AND_Y = true;
    try {
        var re = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
        /**
         * legacy Edge or Xbox One browser
         * Unicode flag support: supported
         * Pattern_Syntax support: not supported
         * See https://github.com/formatjs/formatjs/issues/2822
         */
        REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec('a')) === null || _a === void 0 ? void 0 : _a[0]) === 'a';
    }
    catch (_) {
        REGEX_SUPPORTS_U_AND_Y = false;
    }
    var startsWith = hasNativeStartsWith
        ? // Native
            function startsWith(s, search, position) {
                return s.startsWith(search, position);
            }
        : // For IE11
            function startsWith(s, search, position) {
                return s.slice(position, position + search.length) === search;
            };
    var fromCodePoint = hasNativeFromCodePoint
        ? String.fromCodePoint
        : // IE11
            function fromCodePoint() {
                var codePoints = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    codePoints[_i] = arguments[_i];
                }
                var elements = '';
                var length = codePoints.length;
                var i = 0;
                var code;
                while (length > i) {
                    code = codePoints[i++];
                    if (code > 0x10ffff)
                        throw RangeError(code + ' is not a valid code point');
                    elements +=
                        code < 0x10000
                            ? String.fromCharCode(code)
                            : String.fromCharCode(((code -= 0x10000) >> 10) + 0xd800, (code % 0x400) + 0xdc00);
                }
                return elements;
            };
    var fromEntries = 
    // native
    hasNativeFromEntries
        ? Object.fromEntries
        : // Ponyfill
            function fromEntries(entries) {
                var obj = {};
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var _a = entries_1[_i], k = _a[0], v = _a[1];
                    obj[k] = v;
                }
                return obj;
            };
    var codePointAt = hasNativeCodePointAt
        ? // Native
            function codePointAt(s, index) {
                return s.codePointAt(index);
            }
        : // IE 11
            function codePointAt(s, index) {
                var size = s.length;
                if (index < 0 || index >= size) {
                    return undefined;
                }
                var first = s.charCodeAt(index);
                var second;
                return first < 0xd800 ||
                    first > 0xdbff ||
                    index + 1 === size ||
                    (second = s.charCodeAt(index + 1)) < 0xdc00 ||
                    second > 0xdfff
                    ? first
                    : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
            };
    var trimStart = hasTrimStart
        ? // Native
            function trimStart(s) {
                return s.trimStart();
            }
        : // Ponyfill
            function trimStart(s) {
                return s.replace(SPACE_SEPARATOR_START_REGEX, '');
            };
    var trimEnd = hasTrimEnd
        ? // Native
            function trimEnd(s) {
                return s.trimEnd();
            }
        : // Ponyfill
            function trimEnd(s) {
                return s.replace(SPACE_SEPARATOR_END_REGEX, '');
            };
    // Prevent minifier to translate new RegExp to literal form that might cause syntax error on IE11.
    function RE(s, flag) {
        return new RegExp(s, flag);
    }
    // #endregion
    var matchIdentifierAtIndex;
    if (REGEX_SUPPORTS_U_AND_Y) {
        // Native
        var IDENTIFIER_PREFIX_RE_1 = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
        matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
            var _a;
            IDENTIFIER_PREFIX_RE_1.lastIndex = index;
            var match = IDENTIFIER_PREFIX_RE_1.exec(s);
            return (_a = match[1]) !== null && _a !== void 0 ? _a : '';
        };
    }
    else {
        // IE11
        matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
            var match = [];
            while (true) {
                var c = codePointAt(s, index);
                if (c === undefined || _isWhiteSpace(c) || _isPatternSyntax(c)) {
                    break;
                }
                match.push(c);
                index += c >= 0x10000 ? 2 : 1;
            }
            return fromCodePoint.apply(void 0, match);
        };
    }
    var Parser = /** @class */ (function () {
        function Parser(message, options) {
            if (options === void 0) { options = {}; }
            this.message = message;
            this.position = { offset: 0, line: 1, column: 1 };
            this.ignoreTag = !!options.ignoreTag;
            this.requiresOtherClause = !!options.requiresOtherClause;
            this.shouldParseSkeletons = !!options.shouldParseSkeletons;
        }
        Parser.prototype.parse = function () {
            if (this.offset() !== 0) {
                throw Error('parser can only be used once');
            }
            return this.parseMessage(0, '', false);
        };
        Parser.prototype.parseMessage = function (nestingLevel, parentArgType, expectingCloseTag) {
            var elements = [];
            while (!this.isEOF()) {
                var char = this.char();
                if (char === 123 /* `{` */) {
                    var result = this.parseArgument(nestingLevel, expectingCloseTag);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
                else if (char === 125 /* `}` */ && nestingLevel > 0) {
                    break;
                }
                else if (char === 35 /* `#` */ &&
                    (parentArgType === 'plural' || parentArgType === 'selectordinal')) {
                    var position = this.clonePosition();
                    this.bump();
                    elements.push({
                        type: TYPE.pound,
                        location: createLocation(position, this.clonePosition()),
                    });
                }
                else if (char === 60 /* `<` */ &&
                    !this.ignoreTag &&
                    this.peek() === 47 // char code for '/'
                ) {
                    if (expectingCloseTag) {
                        break;
                    }
                    else {
                        return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
                    }
                }
                else if (char === 60 /* `<` */ &&
                    !this.ignoreTag &&
                    _isAlpha(this.peek() || 0)) {
                    var result = this.parseTag(nestingLevel, parentArgType);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
                else {
                    var result = this.parseLiteral(nestingLevel, parentArgType);
                    if (result.err) {
                        return result;
                    }
                    elements.push(result.val);
                }
            }
            return { val: elements, err: null };
        };
        /**
         * A tag name must start with an ASCII lower/upper case letter. The grammar is based on the
         * [custom element name][] except that a dash is NOT always mandatory and uppercase letters
         * are accepted:
         *
         * ```
         * tag ::= "<" tagName (whitespace)* "/>" | "<" tagName (whitespace)* ">" message "</" tagName (whitespace)* ">"
         * tagName ::= [a-z] (PENChar)*
         * PENChar ::=
         *     "-" | "." | [0-9] | "_" | [a-z] | [A-Z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] |
         *     [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] |
         *     [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
         * ```
         *
         * [custom element name]: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
         * NOTE: We're a bit more lax here since HTML technically does not allow uppercase HTML element but we do
         * since other tag-based engines like React allow it
         */
        Parser.prototype.parseTag = function (nestingLevel, parentArgType) {
            var startPosition = this.clonePosition();
            this.bump(); // `<`
            var tagName = this.parseTagName();
            this.bumpSpace();
            if (this.bumpIf('/>')) {
                // Self closing tag
                return {
                    val: {
                        type: TYPE.literal,
                        value: "<".concat(tagName, "/>"),
                        location: createLocation(startPosition, this.clonePosition()),
                    },
                    err: null,
                };
            }
            else if (this.bumpIf('>')) {
                var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
                if (childrenResult.err) {
                    return childrenResult;
                }
                var children = childrenResult.val;
                // Expecting a close tag
                var endTagStartPosition = this.clonePosition();
                if (this.bumpIf('</')) {
                    if (this.isEOF() || !_isAlpha(this.char())) {
                        return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                    }
                    var closingTagNameStartPosition = this.clonePosition();
                    var closingTagName = this.parseTagName();
                    if (tagName !== closingTagName) {
                        return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
                    }
                    this.bumpSpace();
                    if (!this.bumpIf('>')) {
                        return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                    }
                    return {
                        val: {
                            type: TYPE.tag,
                            value: tagName,
                            children: children,
                            location: createLocation(startPosition, this.clonePosition()),
                        },
                        err: null,
                    };
                }
                else {
                    return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
                }
            }
            else {
                return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
            }
        };
        /**
         * This method assumes that the caller has peeked ahead for the first tag character.
         */
        Parser.prototype.parseTagName = function () {
            var startOffset = this.offset();
            this.bump(); // the first tag name character
            while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
                this.bump();
            }
            return this.message.slice(startOffset, this.offset());
        };
        Parser.prototype.parseLiteral = function (nestingLevel, parentArgType) {
            var start = this.clonePosition();
            var value = '';
            while (true) {
                var parseQuoteResult = this.tryParseQuote(parentArgType);
                if (parseQuoteResult) {
                    value += parseQuoteResult;
                    continue;
                }
                var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
                if (parseUnquotedResult) {
                    value += parseUnquotedResult;
                    continue;
                }
                var parseLeftAngleResult = this.tryParseLeftAngleBracket();
                if (parseLeftAngleResult) {
                    value += parseLeftAngleResult;
                    continue;
                }
                break;
            }
            var location = createLocation(start, this.clonePosition());
            return {
                val: { type: TYPE.literal, value: value, location: location },
                err: null,
            };
        };
        Parser.prototype.tryParseLeftAngleBracket = function () {
            if (!this.isEOF() &&
                this.char() === 60 /* `<` */ &&
                (this.ignoreTag ||
                    // If at the opening tag or closing tag position, bail.
                    !_isAlphaOrSlash(this.peek() || 0))) {
                this.bump(); // `<`
                return '<';
            }
            return null;
        };
        /**
         * Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
         * a character that requires quoting (that is, "only where needed"), and works the same in
         * nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
         */
        Parser.prototype.tryParseQuote = function (parentArgType) {
            if (this.isEOF() || this.char() !== 39 /* `'` */) {
                return null;
            }
            // Parse escaped char following the apostrophe, or early return if there is no escaped char.
            // Check if is valid escaped character
            switch (this.peek()) {
                case 39 /* `'` */:
                    // double quote, should return as a single quote.
                    this.bump();
                    this.bump();
                    return "'";
                // '{', '<', '>', '}'
                case 123:
                case 60:
                case 62:
                case 125:
                    break;
                case 35: // '#'
                    if (parentArgType === 'plural' || parentArgType === 'selectordinal') {
                        break;
                    }
                    return null;
                default:
                    return null;
            }
            this.bump(); // apostrophe
            var codePoints = [this.char()]; // escaped char
            this.bump();
            // read chars until the optional closing apostrophe is found
            while (!this.isEOF()) {
                var ch = this.char();
                if (ch === 39 /* `'` */) {
                    if (this.peek() === 39 /* `'` */) {
                        codePoints.push(39);
                        // Bump one more time because we need to skip 2 characters.
                        this.bump();
                    }
                    else {
                        // Optional closing apostrophe.
                        this.bump();
                        break;
                    }
                }
                else {
                    codePoints.push(ch);
                }
                this.bump();
            }
            return fromCodePoint.apply(void 0, codePoints);
        };
        Parser.prototype.tryParseUnquoted = function (nestingLevel, parentArgType) {
            if (this.isEOF()) {
                return null;
            }
            var ch = this.char();
            if (ch === 60 /* `<` */ ||
                ch === 123 /* `{` */ ||
                (ch === 35 /* `#` */ &&
                    (parentArgType === 'plural' || parentArgType === 'selectordinal')) ||
                (ch === 125 /* `}` */ && nestingLevel > 0)) {
                return null;
            }
            else {
                this.bump();
                return fromCodePoint(ch);
            }
        };
        Parser.prototype.parseArgument = function (nestingLevel, expectingCloseTag) {
            var openingBracePosition = this.clonePosition();
            this.bump(); // `{`
            this.bumpSpace();
            if (this.isEOF()) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            if (this.char() === 125 /* `}` */) {
                this.bump();
                return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
            // argument name
            var value = this.parseIdentifierIfPossible().value;
            if (!value) {
                return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
            this.bumpSpace();
            if (this.isEOF()) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            switch (this.char()) {
                // Simple argument: `{name}`
                case 125 /* `}` */: {
                    this.bump(); // `}`
                    return {
                        val: {
                            type: TYPE.argument,
                            // value does not include the opening and closing braces.
                            value: value,
                            location: createLocation(openingBracePosition, this.clonePosition()),
                        },
                        err: null,
                    };
                }
                // Argument with options: `{name, format, ...}`
                case 44 /* `,` */: {
                    this.bump(); // `,`
                    this.bumpSpace();
                    if (this.isEOF()) {
                        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
                    }
                    return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
                }
                default:
                    return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
            }
        };
        /**
         * Advance the parser until the end of the identifier, if it is currently on
         * an identifier character. Return an empty string otherwise.
         */
        Parser.prototype.parseIdentifierIfPossible = function () {
            var startingPosition = this.clonePosition();
            var startOffset = this.offset();
            var value = matchIdentifierAtIndex(this.message, startOffset);
            var endOffset = startOffset + value.length;
            this.bumpTo(endOffset);
            var endPosition = this.clonePosition();
            var location = createLocation(startingPosition, endPosition);
            return { value: value, location: location };
        };
        Parser.prototype.parseArgumentOptions = function (nestingLevel, expectingCloseTag, value, openingBracePosition) {
            var _a;
            // Parse this range:
            // {name, type, style}
            //        ^---^
            var typeStartPosition = this.clonePosition();
            var argType = this.parseIdentifierIfPossible().value;
            var typeEndPosition = this.clonePosition();
            switch (argType) {
                case '':
                    // Expecting a style string number, date, time, plural, selectordinal, or select.
                    return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
                case 'number':
                case 'date':
                case 'time': {
                    // Parse this range:
                    // {name, number, style}
                    //              ^-------^
                    this.bumpSpace();
                    var styleAndLocation = null;
                    if (this.bumpIf(',')) {
                        this.bumpSpace();
                        var styleStartPosition = this.clonePosition();
                        var result = this.parseSimpleArgStyleIfPossible();
                        if (result.err) {
                            return result;
                        }
                        var style = trimEnd(result.val);
                        if (style.length === 0) {
                            return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
                        }
                        var styleLocation = createLocation(styleStartPosition, this.clonePosition());
                        styleAndLocation = { style: style, styleLocation: styleLocation };
                    }
                    var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) {
                        return argCloseResult;
                    }
                    var location_1 = createLocation(openingBracePosition, this.clonePosition());
                    // Extract style or skeleton
                    if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, '::', 0)) {
                        // Skeleton starts with `::`.
                        var skeleton = trimStart(styleAndLocation.style.slice(2));
                        if (argType === 'number') {
                            var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                            if (result.err) {
                                return result;
                            }
                            return {
                                val: { type: TYPE.number, value: value, location: location_1, style: result.val },
                                err: null,
                            };
                        }
                        else {
                            if (skeleton.length === 0) {
                                return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
                            }
                            var style = {
                                type: SKELETON_TYPE.dateTime,
                                pattern: skeleton,
                                location: styleAndLocation.styleLocation,
                                parsedOptions: this.shouldParseSkeletons
                                    ? parseDateTimeSkeleton(skeleton)
                                    : {},
                            };
                            var type = argType === 'date' ? TYPE.date : TYPE.time;
                            return {
                                val: { type: type, value: value, location: location_1, style: style },
                                err: null,
                            };
                        }
                    }
                    // Regular style or no style.
                    return {
                        val: {
                            type: argType === 'number'
                                ? TYPE.number
                                : argType === 'date'
                                    ? TYPE.date
                                    : TYPE.time,
                            value: value,
                            location: location_1,
                            style: (_a = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a !== void 0 ? _a : null,
                        },
                        err: null,
                    };
                }
                case 'plural':
                case 'selectordinal':
                case 'select': {
                    // Parse this range:
                    // {name, plural, options}
                    //              ^---------^
                    var typeEndPosition_1 = this.clonePosition();
                    this.bumpSpace();
                    if (!this.bumpIf(',')) {
                        return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
                    }
                    this.bumpSpace();
                    // Parse offset:
                    // {name, plural, offset:1, options}
                    //                ^-----^
                    //
                    // or the first option:
                    //
                    // {name, plural, one {...} other {...}}
                    //                ^--^
                    var identifierAndLocation = this.parseIdentifierIfPossible();
                    var pluralOffset = 0;
                    if (argType !== 'select' && identifierAndLocation.value === 'offset') {
                        if (!this.bumpIf(':')) {
                            return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
                        }
                        this.bumpSpace();
                        var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
                        if (result.err) {
                            return result;
                        }
                        // Parse another identifier for option parsing
                        this.bumpSpace();
                        identifierAndLocation = this.parseIdentifierIfPossible();
                        pluralOffset = result.val;
                    }
                    var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
                    if (optionsResult.err) {
                        return optionsResult;
                    }
                    var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                    if (argCloseResult.err) {
                        return argCloseResult;
                    }
                    var location_2 = createLocation(openingBracePosition, this.clonePosition());
                    if (argType === 'select') {
                        return {
                            val: {
                                type: TYPE.select,
                                value: value,
                                options: fromEntries(optionsResult.val),
                                location: location_2,
                            },
                            err: null,
                        };
                    }
                    else {
                        return {
                            val: {
                                type: TYPE.plural,
                                value: value,
                                options: fromEntries(optionsResult.val),
                                offset: pluralOffset,
                                pluralType: argType === 'plural' ? 'cardinal' : 'ordinal',
                                location: location_2,
                            },
                            err: null,
                        };
                    }
                }
                default:
                    return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
            }
        };
        Parser.prototype.tryParseArgumentClose = function (openingBracePosition) {
            // Parse: {value, number, ::currency/GBP }
            //
            if (this.isEOF() || this.char() !== 125 /* `}` */) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            this.bump(); // `}`
            return { val: true, err: null };
        };
        /**
         * See: https://github.com/unicode-org/icu/blob/af7ed1f6d2298013dc303628438ec4abe1f16479/icu4c/source/common/messagepattern.cpp#L659
         */
        Parser.prototype.parseSimpleArgStyleIfPossible = function () {
            var nestedBraces = 0;
            var startPosition = this.clonePosition();
            while (!this.isEOF()) {
                var ch = this.char();
                switch (ch) {
                    case 39 /* `'` */: {
                        // Treat apostrophe as quoting but include it in the style part.
                        // Find the end of the quoted literal text.
                        this.bump();
                        var apostrophePosition = this.clonePosition();
                        if (!this.bumpUntil("'")) {
                            return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
                        }
                        this.bump();
                        break;
                    }
                    case 123 /* `{` */: {
                        nestedBraces += 1;
                        this.bump();
                        break;
                    }
                    case 125 /* `}` */: {
                        if (nestedBraces > 0) {
                            nestedBraces -= 1;
                        }
                        else {
                            return {
                                val: this.message.slice(startPosition.offset, this.offset()),
                                err: null,
                            };
                        }
                        break;
                    }
                    default:
                        this.bump();
                        break;
                }
            }
            return {
                val: this.message.slice(startPosition.offset, this.offset()),
                err: null,
            };
        };
        Parser.prototype.parseNumberSkeletonFromString = function (skeleton, location) {
            var tokens = [];
            try {
                tokens = parseNumberSkeletonFromString(skeleton);
            }
            catch (e) {
                return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
            }
            return {
                val: {
                    type: SKELETON_TYPE.number,
                    tokens: tokens,
                    location: location,
                    parsedOptions: this.shouldParseSkeletons
                        ? parseNumberSkeleton(tokens)
                        : {},
                },
                err: null,
            };
        };
        /**
         * @param nesting_level The current nesting level of messages.
         *     This can be positive when parsing message fragment in select or plural argument options.
         * @param parent_arg_type The parent argument's type.
         * @param parsed_first_identifier If provided, this is the first identifier-like selector of
         *     the argument. It is a by-product of a previous parsing attempt.
         * @param expecting_close_tag If true, this message is directly or indirectly nested inside
         *     between a pair of opening and closing tags. The nested message will not parse beyond
         *     the closing tag boundary.
         */
        Parser.prototype.tryParsePluralOrSelectOptions = function (nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
            var _a;
            var hasOtherClause = false;
            var options = [];
            var parsedSelectors = new Set();
            var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
            // Parse:
            // one {one apple}
            // ^--^
            while (true) {
                if (selector.length === 0) {
                    var startPosition = this.clonePosition();
                    if (parentArgType !== 'select' && this.bumpIf('=')) {
                        // Try parse `={number}` selector
                        var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
                        if (result.err) {
                            return result;
                        }
                        selectorLocation = createLocation(startPosition, this.clonePosition());
                        selector = this.message.slice(startPosition.offset, this.offset());
                    }
                    else {
                        break;
                    }
                }
                // Duplicate selector clauses
                if (parsedSelectors.has(selector)) {
                    return this.error(parentArgType === 'select'
                        ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR
                        : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
                }
                if (selector === 'other') {
                    hasOtherClause = true;
                }
                // Parse:
                // one {one apple}
                //     ^----------^
                this.bumpSpace();
                var openingBracePosition = this.clonePosition();
                if (!this.bumpIf('{')) {
                    return this.error(parentArgType === 'select'
                        ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
                        : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
                }
                var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
                if (fragmentResult.err) {
                    return fragmentResult;
                }
                var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                if (argCloseResult.err) {
                    return argCloseResult;
                }
                options.push([
                    selector,
                    {
                        value: fragmentResult.val,
                        location: createLocation(openingBracePosition, this.clonePosition()),
                    },
                ]);
                // Keep track of the existing selectors
                parsedSelectors.add(selector);
                // Prep next selector clause.
                this.bumpSpace();
                (_a = this.parseIdentifierIfPossible(), selector = _a.value, selectorLocation = _a.location);
            }
            if (options.length === 0) {
                return this.error(parentArgType === 'select'
                    ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR
                    : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
            }
            if (this.requiresOtherClause && !hasOtherClause) {
                return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            return { val: options, err: null };
        };
        Parser.prototype.tryParseDecimalInteger = function (expectNumberError, invalidNumberError) {
            var sign = 1;
            var startingPosition = this.clonePosition();
            if (this.bumpIf('+')) ;
            else if (this.bumpIf('-')) {
                sign = -1;
            }
            var hasDigits = false;
            var decimal = 0;
            while (!this.isEOF()) {
                var ch = this.char();
                if (ch >= 48 /* `0` */ && ch <= 57 /* `9` */) {
                    hasDigits = true;
                    decimal = decimal * 10 + (ch - 48);
                    this.bump();
                }
                else {
                    break;
                }
            }
            var location = createLocation(startingPosition, this.clonePosition());
            if (!hasDigits) {
                return this.error(expectNumberError, location);
            }
            decimal *= sign;
            if (!isSafeInteger(decimal)) {
                return this.error(invalidNumberError, location);
            }
            return { val: decimal, err: null };
        };
        Parser.prototype.offset = function () {
            return this.position.offset;
        };
        Parser.prototype.isEOF = function () {
            return this.offset() === this.message.length;
        };
        Parser.prototype.clonePosition = function () {
            // This is much faster than `Object.assign` or spread.
            return {
                offset: this.position.offset,
                line: this.position.line,
                column: this.position.column,
            };
        };
        /**
         * Return the code point at the current position of the parser.
         * Throws if the index is out of bound.
         */
        Parser.prototype.char = function () {
            var offset = this.position.offset;
            if (offset >= this.message.length) {
                throw Error('out of bound');
            }
            var code = codePointAt(this.message, offset);
            if (code === undefined) {
                throw Error("Offset ".concat(offset, " is at invalid UTF-16 code unit boundary"));
            }
            return code;
        };
        Parser.prototype.error = function (kind, location) {
            return {
                val: null,
                err: {
                    kind: kind,
                    message: this.message,
                    location: location,
                },
            };
        };
        /** Bump the parser to the next UTF-16 code unit. */
        Parser.prototype.bump = function () {
            if (this.isEOF()) {
                return;
            }
            var code = this.char();
            if (code === 10 /* '\n' */) {
                this.position.line += 1;
                this.position.column = 1;
                this.position.offset += 1;
            }
            else {
                this.position.column += 1;
                // 0 ~ 0x10000 -> unicode BMP, otherwise skip the surrogate pair.
                this.position.offset += code < 0x10000 ? 1 : 2;
            }
        };
        /**
         * If the substring starting at the current position of the parser has
         * the given prefix, then bump the parser to the character immediately
         * following the prefix and return true. Otherwise, don't bump the parser
         * and return false.
         */
        Parser.prototype.bumpIf = function (prefix) {
            if (startsWith(this.message, prefix, this.offset())) {
                for (var i = 0; i < prefix.length; i++) {
                    this.bump();
                }
                return true;
            }
            return false;
        };
        /**
         * Bump the parser until the pattern character is found and return `true`.
         * Otherwise bump to the end of the file and return `false`.
         */
        Parser.prototype.bumpUntil = function (pattern) {
            var currentOffset = this.offset();
            var index = this.message.indexOf(pattern, currentOffset);
            if (index >= 0) {
                this.bumpTo(index);
                return true;
            }
            else {
                this.bumpTo(this.message.length);
                return false;
            }
        };
        /**
         * Bump the parser to the target offset.
         * If target offset is beyond the end of the input, bump the parser to the end of the input.
         */
        Parser.prototype.bumpTo = function (targetOffset) {
            if (this.offset() > targetOffset) {
                throw Error("targetOffset ".concat(targetOffset, " must be greater than or equal to the current offset ").concat(this.offset()));
            }
            targetOffset = Math.min(targetOffset, this.message.length);
            while (true) {
                var offset = this.offset();
                if (offset === targetOffset) {
                    break;
                }
                if (offset > targetOffset) {
                    throw Error("targetOffset ".concat(targetOffset, " is at invalid UTF-16 code unit boundary"));
                }
                this.bump();
                if (this.isEOF()) {
                    break;
                }
            }
        };
        /** advance the parser through all whitespace to the next non-whitespace code unit. */
        Parser.prototype.bumpSpace = function () {
            while (!this.isEOF() && _isWhiteSpace(this.char())) {
                this.bump();
            }
        };
        /**
         * Peek at the *next* Unicode codepoint in the input without advancing the parser.
         * If the input has been exhausted, then this returns null.
         */
        Parser.prototype.peek = function () {
            if (this.isEOF()) {
                return null;
            }
            var code = this.char();
            var offset = this.offset();
            var nextCode = this.message.charCodeAt(offset + (code >= 0x10000 ? 2 : 1));
            return nextCode !== null && nextCode !== void 0 ? nextCode : null;
        };
        return Parser;
    }());
    /**
     * This check if codepoint is alphabet (lower & uppercase)
     * @param codepoint
     * @returns
     */
    function _isAlpha(codepoint) {
        return ((codepoint >= 97 && codepoint <= 122) ||
            (codepoint >= 65 && codepoint <= 90));
    }
    function _isAlphaOrSlash(codepoint) {
        return _isAlpha(codepoint) || codepoint === 47; /* '/' */
    }
    /** See `parseTag` function docs. */
    function _isPotentialElementNameChar(c) {
        return (c === 45 /* '-' */ ||
            c === 46 /* '.' */ ||
            (c >= 48 && c <= 57) /* 0..9 */ ||
            c === 95 /* '_' */ ||
            (c >= 97 && c <= 122) /** a..z */ ||
            (c >= 65 && c <= 90) /* A..Z */ ||
            c == 0xb7 ||
            (c >= 0xc0 && c <= 0xd6) ||
            (c >= 0xd8 && c <= 0xf6) ||
            (c >= 0xf8 && c <= 0x37d) ||
            (c >= 0x37f && c <= 0x1fff) ||
            (c >= 0x200c && c <= 0x200d) ||
            (c >= 0x203f && c <= 0x2040) ||
            (c >= 0x2070 && c <= 0x218f) ||
            (c >= 0x2c00 && c <= 0x2fef) ||
            (c >= 0x3001 && c <= 0xd7ff) ||
            (c >= 0xf900 && c <= 0xfdcf) ||
            (c >= 0xfdf0 && c <= 0xfffd) ||
            (c >= 0x10000 && c <= 0xeffff));
    }
    /**
     * Code point equivalent of regex `\p{White_Space}`.
     * From: https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
     */
    function _isWhiteSpace(c) {
        return ((c >= 0x0009 && c <= 0x000d) ||
            c === 0x0020 ||
            c === 0x0085 ||
            (c >= 0x200e && c <= 0x200f) ||
            c === 0x2028 ||
            c === 0x2029);
    }
    /**
     * Code point equivalent of regex `\p{Pattern_Syntax}`.
     * See https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
     */
    function _isPatternSyntax(c) {
        return ((c >= 0x0021 && c <= 0x0023) ||
            c === 0x0024 ||
            (c >= 0x0025 && c <= 0x0027) ||
            c === 0x0028 ||
            c === 0x0029 ||
            c === 0x002a ||
            c === 0x002b ||
            c === 0x002c ||
            c === 0x002d ||
            (c >= 0x002e && c <= 0x002f) ||
            (c >= 0x003a && c <= 0x003b) ||
            (c >= 0x003c && c <= 0x003e) ||
            (c >= 0x003f && c <= 0x0040) ||
            c === 0x005b ||
            c === 0x005c ||
            c === 0x005d ||
            c === 0x005e ||
            c === 0x0060 ||
            c === 0x007b ||
            c === 0x007c ||
            c === 0x007d ||
            c === 0x007e ||
            c === 0x00a1 ||
            (c >= 0x00a2 && c <= 0x00a5) ||
            c === 0x00a6 ||
            c === 0x00a7 ||
            c === 0x00a9 ||
            c === 0x00ab ||
            c === 0x00ac ||
            c === 0x00ae ||
            c === 0x00b0 ||
            c === 0x00b1 ||
            c === 0x00b6 ||
            c === 0x00bb ||
            c === 0x00bf ||
            c === 0x00d7 ||
            c === 0x00f7 ||
            (c >= 0x2010 && c <= 0x2015) ||
            (c >= 0x2016 && c <= 0x2017) ||
            c === 0x2018 ||
            c === 0x2019 ||
            c === 0x201a ||
            (c >= 0x201b && c <= 0x201c) ||
            c === 0x201d ||
            c === 0x201e ||
            c === 0x201f ||
            (c >= 0x2020 && c <= 0x2027) ||
            (c >= 0x2030 && c <= 0x2038) ||
            c === 0x2039 ||
            c === 0x203a ||
            (c >= 0x203b && c <= 0x203e) ||
            (c >= 0x2041 && c <= 0x2043) ||
            c === 0x2044 ||
            c === 0x2045 ||
            c === 0x2046 ||
            (c >= 0x2047 && c <= 0x2051) ||
            c === 0x2052 ||
            c === 0x2053 ||
            (c >= 0x2055 && c <= 0x205e) ||
            (c >= 0x2190 && c <= 0x2194) ||
            (c >= 0x2195 && c <= 0x2199) ||
            (c >= 0x219a && c <= 0x219b) ||
            (c >= 0x219c && c <= 0x219f) ||
            c === 0x21a0 ||
            (c >= 0x21a1 && c <= 0x21a2) ||
            c === 0x21a3 ||
            (c >= 0x21a4 && c <= 0x21a5) ||
            c === 0x21a6 ||
            (c >= 0x21a7 && c <= 0x21ad) ||
            c === 0x21ae ||
            (c >= 0x21af && c <= 0x21cd) ||
            (c >= 0x21ce && c <= 0x21cf) ||
            (c >= 0x21d0 && c <= 0x21d1) ||
            c === 0x21d2 ||
            c === 0x21d3 ||
            c === 0x21d4 ||
            (c >= 0x21d5 && c <= 0x21f3) ||
            (c >= 0x21f4 && c <= 0x22ff) ||
            (c >= 0x2300 && c <= 0x2307) ||
            c === 0x2308 ||
            c === 0x2309 ||
            c === 0x230a ||
            c === 0x230b ||
            (c >= 0x230c && c <= 0x231f) ||
            (c >= 0x2320 && c <= 0x2321) ||
            (c >= 0x2322 && c <= 0x2328) ||
            c === 0x2329 ||
            c === 0x232a ||
            (c >= 0x232b && c <= 0x237b) ||
            c === 0x237c ||
            (c >= 0x237d && c <= 0x239a) ||
            (c >= 0x239b && c <= 0x23b3) ||
            (c >= 0x23b4 && c <= 0x23db) ||
            (c >= 0x23dc && c <= 0x23e1) ||
            (c >= 0x23e2 && c <= 0x2426) ||
            (c >= 0x2427 && c <= 0x243f) ||
            (c >= 0x2440 && c <= 0x244a) ||
            (c >= 0x244b && c <= 0x245f) ||
            (c >= 0x2500 && c <= 0x25b6) ||
            c === 0x25b7 ||
            (c >= 0x25b8 && c <= 0x25c0) ||
            c === 0x25c1 ||
            (c >= 0x25c2 && c <= 0x25f7) ||
            (c >= 0x25f8 && c <= 0x25ff) ||
            (c >= 0x2600 && c <= 0x266e) ||
            c === 0x266f ||
            (c >= 0x2670 && c <= 0x2767) ||
            c === 0x2768 ||
            c === 0x2769 ||
            c === 0x276a ||
            c === 0x276b ||
            c === 0x276c ||
            c === 0x276d ||
            c === 0x276e ||
            c === 0x276f ||
            c === 0x2770 ||
            c === 0x2771 ||
            c === 0x2772 ||
            c === 0x2773 ||
            c === 0x2774 ||
            c === 0x2775 ||
            (c >= 0x2794 && c <= 0x27bf) ||
            (c >= 0x27c0 && c <= 0x27c4) ||
            c === 0x27c5 ||
            c === 0x27c6 ||
            (c >= 0x27c7 && c <= 0x27e5) ||
            c === 0x27e6 ||
            c === 0x27e7 ||
            c === 0x27e8 ||
            c === 0x27e9 ||
            c === 0x27ea ||
            c === 0x27eb ||
            c === 0x27ec ||
            c === 0x27ed ||
            c === 0x27ee ||
            c === 0x27ef ||
            (c >= 0x27f0 && c <= 0x27ff) ||
            (c >= 0x2800 && c <= 0x28ff) ||
            (c >= 0x2900 && c <= 0x2982) ||
            c === 0x2983 ||
            c === 0x2984 ||
            c === 0x2985 ||
            c === 0x2986 ||
            c === 0x2987 ||
            c === 0x2988 ||
            c === 0x2989 ||
            c === 0x298a ||
            c === 0x298b ||
            c === 0x298c ||
            c === 0x298d ||
            c === 0x298e ||
            c === 0x298f ||
            c === 0x2990 ||
            c === 0x2991 ||
            c === 0x2992 ||
            c === 0x2993 ||
            c === 0x2994 ||
            c === 0x2995 ||
            c === 0x2996 ||
            c === 0x2997 ||
            c === 0x2998 ||
            (c >= 0x2999 && c <= 0x29d7) ||
            c === 0x29d8 ||
            c === 0x29d9 ||
            c === 0x29da ||
            c === 0x29db ||
            (c >= 0x29dc && c <= 0x29fb) ||
            c === 0x29fc ||
            c === 0x29fd ||
            (c >= 0x29fe && c <= 0x2aff) ||
            (c >= 0x2b00 && c <= 0x2b2f) ||
            (c >= 0x2b30 && c <= 0x2b44) ||
            (c >= 0x2b45 && c <= 0x2b46) ||
            (c >= 0x2b47 && c <= 0x2b4c) ||
            (c >= 0x2b4d && c <= 0x2b73) ||
            (c >= 0x2b74 && c <= 0x2b75) ||
            (c >= 0x2b76 && c <= 0x2b95) ||
            c === 0x2b96 ||
            (c >= 0x2b97 && c <= 0x2bff) ||
            (c >= 0x2e00 && c <= 0x2e01) ||
            c === 0x2e02 ||
            c === 0x2e03 ||
            c === 0x2e04 ||
            c === 0x2e05 ||
            (c >= 0x2e06 && c <= 0x2e08) ||
            c === 0x2e09 ||
            c === 0x2e0a ||
            c === 0x2e0b ||
            c === 0x2e0c ||
            c === 0x2e0d ||
            (c >= 0x2e0e && c <= 0x2e16) ||
            c === 0x2e17 ||
            (c >= 0x2e18 && c <= 0x2e19) ||
            c === 0x2e1a ||
            c === 0x2e1b ||
            c === 0x2e1c ||
            c === 0x2e1d ||
            (c >= 0x2e1e && c <= 0x2e1f) ||
            c === 0x2e20 ||
            c === 0x2e21 ||
            c === 0x2e22 ||
            c === 0x2e23 ||
            c === 0x2e24 ||
            c === 0x2e25 ||
            c === 0x2e26 ||
            c === 0x2e27 ||
            c === 0x2e28 ||
            c === 0x2e29 ||
            (c >= 0x2e2a && c <= 0x2e2e) ||
            c === 0x2e2f ||
            (c >= 0x2e30 && c <= 0x2e39) ||
            (c >= 0x2e3a && c <= 0x2e3b) ||
            (c >= 0x2e3c && c <= 0x2e3f) ||
            c === 0x2e40 ||
            c === 0x2e41 ||
            c === 0x2e42 ||
            (c >= 0x2e43 && c <= 0x2e4f) ||
            (c >= 0x2e50 && c <= 0x2e51) ||
            c === 0x2e52 ||
            (c >= 0x2e53 && c <= 0x2e7f) ||
            (c >= 0x3001 && c <= 0x3003) ||
            c === 0x3008 ||
            c === 0x3009 ||
            c === 0x300a ||
            c === 0x300b ||
            c === 0x300c ||
            c === 0x300d ||
            c === 0x300e ||
            c === 0x300f ||
            c === 0x3010 ||
            c === 0x3011 ||
            (c >= 0x3012 && c <= 0x3013) ||
            c === 0x3014 ||
            c === 0x3015 ||
            c === 0x3016 ||
            c === 0x3017 ||
            c === 0x3018 ||
            c === 0x3019 ||
            c === 0x301a ||
            c === 0x301b ||
            c === 0x301c ||
            c === 0x301d ||
            (c >= 0x301e && c <= 0x301f) ||
            c === 0x3020 ||
            c === 0x3030 ||
            c === 0xfd3e ||
            c === 0xfd3f ||
            (c >= 0xfe45 && c <= 0xfe46));
    }

    function pruneLocation(els) {
        els.forEach(function (el) {
            delete el.location;
            if (isSelectElement(el) || isPluralElement(el)) {
                for (var k in el.options) {
                    delete el.options[k].location;
                    pruneLocation(el.options[k].value);
                }
            }
            else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
                delete el.style.location;
            }
            else if ((isDateElement(el) || isTimeElement(el)) &&
                isDateTimeSkeleton(el.style)) {
                delete el.style.location;
            }
            else if (isTagElement(el)) {
                pruneLocation(el.children);
            }
        });
    }
    function parse(message, opts) {
        if (opts === void 0) { opts = {}; }
        opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
        var result = new Parser(message, opts).parse();
        if (result.err) {
            var error = SyntaxError(ErrorKind[result.err.kind]);
            // @ts-expect-error Assign to error object
            error.location = result.err.location;
            // @ts-expect-error Assign to error object
            error.originalMessage = result.err.message;
            throw error;
        }
        if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
            pruneLocation(result.val);
        }
        return result.val;
    }

    //
    // Main
    //
    function memoize(fn, options) {
        var cache = options && options.cache ? options.cache : cacheDefault;
        var serializer = options && options.serializer ? options.serializer : serializerDefault;
        var strategy = options && options.strategy ? options.strategy : strategyDefault;
        return strategy(fn, {
            cache: cache,
            serializer: serializer,
        });
    }
    //
    // Strategy
    //
    function isPrimitive(value) {
        return (value == null || typeof value === 'number' || typeof value === 'boolean'); // || typeof value === "string" 'unsafe' primitive for our needs
    }
    function monadic(fn, cache, serializer, arg) {
        var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
        var computedValue = cache.get(cacheKey);
        if (typeof computedValue === 'undefined') {
            computedValue = fn.call(this, arg);
            cache.set(cacheKey, computedValue);
        }
        return computedValue;
    }
    function variadic(fn, cache, serializer) {
        var args = Array.prototype.slice.call(arguments, 3);
        var cacheKey = serializer(args);
        var computedValue = cache.get(cacheKey);
        if (typeof computedValue === 'undefined') {
            computedValue = fn.apply(this, args);
            cache.set(cacheKey, computedValue);
        }
        return computedValue;
    }
    function assemble(fn, context, strategy, cache, serialize) {
        return strategy.bind(context, fn, cache, serialize);
    }
    function strategyDefault(fn, options) {
        var strategy = fn.length === 1 ? monadic : variadic;
        return assemble(fn, this, strategy, options.cache.create(), options.serializer);
    }
    function strategyVariadic(fn, options) {
        return assemble(fn, this, variadic, options.cache.create(), options.serializer);
    }
    function strategyMonadic(fn, options) {
        return assemble(fn, this, monadic, options.cache.create(), options.serializer);
    }
    //
    // Serializer
    //
    var serializerDefault = function () {
        return JSON.stringify(arguments);
    };
    //
    // Cache
    //
    function ObjectWithoutPrototypeCache() {
        this.cache = Object.create(null);
    }
    ObjectWithoutPrototypeCache.prototype.get = function (key) {
        return this.cache[key];
    };
    ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
        this.cache[key] = value;
    };
    var cacheDefault = {
        create: function create() {
            // @ts-ignore
            return new ObjectWithoutPrototypeCache();
        },
    };
    var strategies = {
        variadic: strategyVariadic,
        monadic: strategyMonadic,
    };

    var ErrorCode;
    (function (ErrorCode) {
        // When we have a placeholder but no value to format
        ErrorCode["MISSING_VALUE"] = "MISSING_VALUE";
        // When value supplied is invalid
        ErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
        // When we need specific Intl API but it's not available
        ErrorCode["MISSING_INTL_API"] = "MISSING_INTL_API";
    })(ErrorCode || (ErrorCode = {}));
    var FormatError = /** @class */ (function (_super) {
        __extends(FormatError, _super);
        function FormatError(msg, code, originalMessage) {
            var _this = _super.call(this, msg) || this;
            _this.code = code;
            _this.originalMessage = originalMessage;
            return _this;
        }
        FormatError.prototype.toString = function () {
            return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
        };
        return FormatError;
    }(Error));
    var InvalidValueError = /** @class */ (function (_super) {
        __extends(InvalidValueError, _super);
        function InvalidValueError(variableId, value, options, originalMessage) {
            return _super.call(this, "Invalid values for \"".concat(variableId, "\": \"").concat(value, "\". Options are \"").concat(Object.keys(options).join('", "'), "\""), ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueError;
    }(FormatError));
    var InvalidValueTypeError = /** @class */ (function (_super) {
        __extends(InvalidValueTypeError, _super);
        function InvalidValueTypeError(value, type, originalMessage) {
            return _super.call(this, "Value for \"".concat(value, "\" must be of type ").concat(type), ErrorCode.INVALID_VALUE, originalMessage) || this;
        }
        return InvalidValueTypeError;
    }(FormatError));
    var MissingValueError = /** @class */ (function (_super) {
        __extends(MissingValueError, _super);
        function MissingValueError(variableId, originalMessage) {
            return _super.call(this, "The intl string context variable \"".concat(variableId, "\" was not provided to the string \"").concat(originalMessage, "\""), ErrorCode.MISSING_VALUE, originalMessage) || this;
        }
        return MissingValueError;
    }(FormatError));

    var PART_TYPE;
    (function (PART_TYPE) {
        PART_TYPE[PART_TYPE["literal"] = 0] = "literal";
        PART_TYPE[PART_TYPE["object"] = 1] = "object";
    })(PART_TYPE || (PART_TYPE = {}));
    function mergeLiteral(parts) {
        if (parts.length < 2) {
            return parts;
        }
        return parts.reduce(function (all, part) {
            var lastPart = all[all.length - 1];
            if (!lastPart ||
                lastPart.type !== PART_TYPE.literal ||
                part.type !== PART_TYPE.literal) {
                all.push(part);
            }
            else {
                lastPart.value += part.value;
            }
            return all;
        }, []);
    }
    function isFormatXMLElementFn(el) {
        return typeof el === 'function';
    }
    // TODO(skeleton): add skeleton support
    function formatToParts(els, locales, formatters, formats, values, currentPluralValue, 
    // For debugging
    originalMessage) {
        // Hot path for straight simple msg translations
        if (els.length === 1 && isLiteralElement(els[0])) {
            return [
                {
                    type: PART_TYPE.literal,
                    value: els[0].value,
                },
            ];
        }
        var result = [];
        for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
            var el = els_1[_i];
            // Exit early for string parts.
            if (isLiteralElement(el)) {
                result.push({
                    type: PART_TYPE.literal,
                    value: el.value,
                });
                continue;
            }
            // TODO: should this part be literal type?
            // Replace `#` in plural rules with the actual numeric value.
            if (isPoundElement(el)) {
                if (typeof currentPluralValue === 'number') {
                    result.push({
                        type: PART_TYPE.literal,
                        value: formatters.getNumberFormat(locales).format(currentPluralValue),
                    });
                }
                continue;
            }
            var varName = el.value;
            // Enforce that all required values are provided by the caller.
            if (!(values && varName in values)) {
                throw new MissingValueError(varName, originalMessage);
            }
            var value = values[varName];
            if (isArgumentElement(el)) {
                if (!value || typeof value === 'string' || typeof value === 'number') {
                    value =
                        typeof value === 'string' || typeof value === 'number'
                            ? String(value)
                            : '';
                }
                result.push({
                    type: typeof value === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                    value: value,
                });
                continue;
            }
            // Recursively format plural and select parts' option — which can be a
            // nested pattern structure. The choosing of the option to use is
            // abstracted-by and delegated-to the part helper object.
            if (isDateElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.date[el.style]
                    : isDateTimeSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getDateTimeFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isTimeElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.time[el.style]
                    : isDateTimeSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getDateTimeFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isNumberElement(el)) {
                var style = typeof el.style === 'string'
                    ? formats.number[el.style]
                    : isNumberSkeleton(el.style)
                        ? el.style.parsedOptions
                        : undefined;
                if (style && style.scale) {
                    value =
                        value *
                            (style.scale || 1);
                }
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters
                        .getNumberFormat(locales, style)
                        .format(value),
                });
                continue;
            }
            if (isTagElement(el)) {
                var children = el.children, value_1 = el.value;
                var formatFn = values[value_1];
                if (!isFormatXMLElementFn(formatFn)) {
                    throw new InvalidValueTypeError(value_1, 'function', originalMessage);
                }
                var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
                var chunks = formatFn(parts.map(function (p) { return p.value; }));
                if (!Array.isArray(chunks)) {
                    chunks = [chunks];
                }
                result.push.apply(result, chunks.map(function (c) {
                    return {
                        type: typeof c === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                        value: c,
                    };
                }));
            }
            if (isSelectElement(el)) {
                var opt = el.options[value] || el.options.other;
                if (!opt) {
                    throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
                }
                result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
                continue;
            }
            if (isPluralElement(el)) {
                var opt = el.options["=".concat(value)];
                if (!opt) {
                    if (!Intl.PluralRules) {
                        throw new FormatError("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", ErrorCode.MISSING_INTL_API, originalMessage);
                    }
                    var rule = formatters
                        .getPluralRules(locales, { type: el.pluralType })
                        .select(value - (el.offset || 0));
                    opt = el.options[rule] || el.options.other;
                }
                if (!opt) {
                    throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
                }
                result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
                continue;
            }
        }
        return mergeLiteral(result);
    }

    /*
    Copyright (c) 2014, Yahoo! Inc. All rights reserved.
    Copyrights licensed under the New BSD License.
    See the accompanying LICENSE file for terms.
    */
    // -- MessageFormat --------------------------------------------------------
    function mergeConfig(c1, c2) {
        if (!c2) {
            return c1;
        }
        return __assign(__assign(__assign({}, (c1 || {})), (c2 || {})), Object.keys(c1).reduce(function (all, k) {
            all[k] = __assign(__assign({}, c1[k]), (c2[k] || {}));
            return all;
        }, {}));
    }
    function mergeConfigs(defaultConfig, configs) {
        if (!configs) {
            return defaultConfig;
        }
        return Object.keys(defaultConfig).reduce(function (all, k) {
            all[k] = mergeConfig(defaultConfig[k], configs[k]);
            return all;
        }, __assign({}, defaultConfig));
    }
    function createFastMemoizeCache(store) {
        return {
            create: function () {
                return {
                    get: function (key) {
                        return store[key];
                    },
                    set: function (key, value) {
                        store[key] = value;
                    },
                };
            },
        };
    }
    function createDefaultFormatters(cache) {
        if (cache === void 0) { cache = {
            number: {},
            dateTime: {},
            pluralRules: {},
        }; }
        return {
            getNumberFormat: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.NumberFormat).bind.apply(_a, __spreadArray([void 0], args, false)))();
            }, {
                cache: createFastMemoizeCache(cache.number),
                strategy: strategies.variadic,
            }),
            getDateTimeFormat: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.DateTimeFormat).bind.apply(_a, __spreadArray([void 0], args, false)))();
            }, {
                cache: createFastMemoizeCache(cache.dateTime),
                strategy: strategies.variadic,
            }),
            getPluralRules: memoize(function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return new ((_a = Intl.PluralRules).bind.apply(_a, __spreadArray([void 0], args, false)))();
            }, {
                cache: createFastMemoizeCache(cache.pluralRules),
                strategy: strategies.variadic,
            }),
        };
    }
    var IntlMessageFormat = /** @class */ (function () {
        function IntlMessageFormat(message, locales, overrideFormats, opts) {
            var _this = this;
            if (locales === void 0) { locales = IntlMessageFormat.defaultLocale; }
            this.formatterCache = {
                number: {},
                dateTime: {},
                pluralRules: {},
            };
            this.format = function (values) {
                var parts = _this.formatToParts(values);
                // Hot path for straight simple msg translations
                if (parts.length === 1) {
                    return parts[0].value;
                }
                var result = parts.reduce(function (all, part) {
                    if (!all.length ||
                        part.type !== PART_TYPE.literal ||
                        typeof all[all.length - 1] !== 'string') {
                        all.push(part.value);
                    }
                    else {
                        all[all.length - 1] += part.value;
                    }
                    return all;
                }, []);
                if (result.length <= 1) {
                    return result[0] || '';
                }
                return result;
            };
            this.formatToParts = function (values) {
                return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, undefined, _this.message);
            };
            this.resolvedOptions = function () { return ({
                locale: Intl.NumberFormat.supportedLocalesOf(_this.locales)[0],
            }); };
            this.getAst = function () { return _this.ast; };
            if (typeof message === 'string') {
                this.message = message;
                if (!IntlMessageFormat.__parse) {
                    throw new TypeError('IntlMessageFormat.__parse must be set to process `message` of type `string`');
                }
                // Parse string messages into an AST.
                this.ast = IntlMessageFormat.__parse(message, {
                    ignoreTag: opts === null || opts === void 0 ? void 0 : opts.ignoreTag,
                });
            }
            else {
                this.ast = message;
            }
            if (!Array.isArray(this.ast)) {
                throw new TypeError('A message must be provided as a String or AST.');
            }
            // Creates a new object with the specified `formats` merged with the default
            // formats.
            this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
            // Defined first because it's used to build the format pattern.
            this.locales = locales;
            this.formatters =
                (opts && opts.formatters) || createDefaultFormatters(this.formatterCache);
        }
        Object.defineProperty(IntlMessageFormat, "defaultLocale", {
            get: function () {
                if (!IntlMessageFormat.memoizedDefaultLocale) {
                    IntlMessageFormat.memoizedDefaultLocale =
                        new Intl.NumberFormat().resolvedOptions().locale;
                }
                return IntlMessageFormat.memoizedDefaultLocale;
            },
            enumerable: false,
            configurable: true
        });
        IntlMessageFormat.memoizedDefaultLocale = null;
        IntlMessageFormat.__parse = parse;
        // Default format options used as the prototype of the `formats` provided to the
        // constructor. These are used when constructing the internal Intl.NumberFormat
        // and Intl.DateTimeFormat instances.
        IntlMessageFormat.formats = {
            number: {
                integer: {
                    maximumFractionDigits: 0,
                },
                currency: {
                    style: 'currency',
                },
                percent: {
                    style: 'percent',
                },
            },
            date: {
                short: {
                    month: 'numeric',
                    day: 'numeric',
                    year: '2-digit',
                },
                medium: {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                },
                long: {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                },
                full: {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                },
            },
            time: {
                short: {
                    hour: 'numeric',
                    minute: 'numeric',
                },
                medium: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                },
                long: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                },
                full: {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                },
            },
        };
        return IntlMessageFormat;
    }());

    /*
    Copyright (c) 2014, Yahoo! Inc. All rights reserved.
    Copyrights licensed under the New BSD License.
    See the accompanying LICENSE file for terms.
    */
    var o = IntlMessageFormat;

    const r={},i=(e,n,t)=>t?(n in r||(r[n]={}),e in r[n]||(r[n][e]=t),t):t,l=(e,n)=>{if(null==n)return;if(n in r&&e in r[n])return r[n][e];const t=E(n);for(let o=0;o<t.length;o++){const r=c(t[o],e);if(r)return i(e,n,r)}};let a;const s=writable({});function u(e){return e in a}function c(e,n){if(!u(e))return null;return function(e,n){if(null==n)return;if(n in e)return e[n];const t=n.split(".");let o=e;for(let e=0;e<t.length;e++)if("object"==typeof o){if(e>0){const n=t.slice(e,t.length).join(".");if(n in o){o=o[n];break}}o=o[t[e]];}else o=void 0;return o}(function(e){return a[e]||null}(e),n)}function m(e,...n){delete r[e],s.update((o=>(o[e]=cjs.all([o[e]||{},...n]),o)));}derived([s],(([e])=>Object.keys(e)));s.subscribe((e=>a=e));const d={};function g(e){return d[e]}function w(e){return null!=e&&E(e).some((e=>{var n;return null===(n=g(e))||void 0===n?void 0:n.size}))}function h(e,n){return Promise.all(n.map((n=>(function(e,n){d[e].delete(n),0===d[e].size&&delete d[e];}(e,n),n().then((e=>e.default||e)))))).then((n=>m(e,...n)))}const p={};function b(e){if(!w(e))return e in p?p[e]:Promise.resolve();const n=function(e){return E(e).map((e=>{const n=g(e);return [e,n?[...n]:[]]})).filter((([,e])=>e.length>0))}(e);return p[e]=Promise.all(n.map((([e,n])=>h(e,n)))).then((()=>{if(w(e))return b(e);delete p[e];})),p[e]}function y(e,n){g(e)||function(e){d[e]=new Set;}(e);const t=g(e);g(e).has(n)||(u(e)||s.update((n=>(n[e]={},n))),t.add(n));}
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */function v(e,n){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)n.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(t[o[r]]=e[o[r]]);}return t}const O={fallbackLocale:null,loadingDelay:200,formats:{number:{scientific:{notation:"scientific"},engineering:{notation:"engineering"},compactLong:{notation:"compact",compactDisplay:"long"},compactShort:{notation:"compact",compactDisplay:"short"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},warnOnMissingMessages:!0,ignoreTag:!0};function j(){return O}function $(e){const{formats:n}=e,t=v(e,["formats"]),o=e.initialLocale||e.fallbackLocale;return Object.assign(O,t,{initialLocale:o}),n&&("number"in n&&Object.assign(O.formats.number,n.number),"date"in n&&Object.assign(O.formats.date,n.date),"time"in n&&Object.assign(O.formats.time,n.time)),M.set(o)}const k=writable(!1);let L;const T=writable(null);function x(e){return e.split("-").map(((e,n,t)=>t.slice(0,n+1).join("-"))).reverse()}function E(e,n=j().fallbackLocale){const t=x(e);return n?[...new Set([...t,...x(n)])]:t}function D(){return null!=L?L:void 0}T.subscribe((e=>{L=null!=e?e:void 0,"undefined"!=typeof window&&null!=e&&document.documentElement.setAttribute("lang",e);}));const M=Object.assign(Object.assign({},T),{set:e=>{if(e&&function(e){if(null==e)return;const n=E(e);for(let e=0;e<n.length;e++){const t=n[e];if(u(t))return t}}(e)&&w(e)){const{loadingDelay:n}=j();let t;return "undefined"!=typeof window&&null!=D()&&n?t=window.setTimeout((()=>k.set(!0)),n):k.set(!0),b(e).then((()=>{T.set(e);})).finally((()=>{clearTimeout(t),k.set(!1);}))}return T.set(e)}}),I=()=>"undefined"==typeof window?null:window.navigator.language||window.navigator.languages[0],Z=e=>{const n=Object.create(null);return t=>{const o=JSON.stringify(t);return o in n?n[o]:n[o]=e(t)}},C=(e,n)=>{const{formats:t}=j();if(e in t&&n in t[e])return t[e][n];throw new Error(`[svelte-i18n] Unknown "${n}" ${e} format.`)},G=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format numbers');return t&&(o=C("number",t)),new Intl.NumberFormat(n,o)})),J=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format dates');return t?o=C("date",t):0===Object.keys(o).length&&(o=C("date","short")),new Intl.DateTimeFormat(n,o)})),U=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format time values');return t?o=C("time",t):0===Object.keys(o).length&&(o=C("time","short")),new Intl.DateTimeFormat(n,o)})),_=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return G(Object.assign({locale:n},t))},q=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return J(Object.assign({locale:n},t))},B=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return U(Object.assign({locale:n},t))},H=Z(((e,n=D())=>new o(e,n,j().formats,{ignoreTag:j().ignoreTag}))),K=(e,n={})=>{let t=n;"object"==typeof e&&(t=e,e=t.id);const{values:o,locale:r=D(),default:i}=t;if(null==r)throw new Error("[svelte-i18n] Cannot format a message without first setting the initial locale.");let a=l(e,r);if(a){if("string"!=typeof a)return console.warn(`[svelte-i18n] Message with id "${e}" must be of type "string", found: "${typeof a}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`),a}else j().warnOnMissingMessages&&console.warn(`[svelte-i18n] The message "${e}" was not found in "${E(r).join('", "')}".${w(D())?"\n\nNote: there are at least one loader still registered to this locale that wasn't executed.":""}`),a=null!=i?i:e;if(!o)return a;let s=a;try{s=H(a,r).format(o);}catch(n){console.warn(`[svelte-i18n] Message "${e}" has syntax error:`,n.message);}return s},Q=(e,n)=>B(n).format(e),R=(e,n)=>q(n).format(e),V=(e,n)=>_(n).format(e),W=(e,n=D())=>l(e,n),X=derived([M,s],(()=>K));derived([M],(()=>Q));derived([M],(()=>R));derived([M],(()=>V));derived([M,s],(()=>W));

    /* src/Navbar.svelte generated by Svelte v3.44.3 */
    const file$e = "src/Navbar.svelte";

    function create_fragment$e(ctx) {
    	let nav;
    	let a0;
    	let t0;
    	let button;
    	let svg;
    	let rect;
    	let path0;
    	let path1;
    	let path2;
    	let t1;
    	let div2;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let a4;
    	let t9;
    	let a5;
    	let t11;
    	let a6;
    	let t13;
    	let a7;
    	let t15;
    	let a8;
    	let t17;
    	let div1;
    	let div0;
    	let select;
    	let option0;
    	let option1;
    	let t20;
    	let div3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a0 = element("a");
    			t0 = space();
    			button = element("button");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			a1 = element("a");
    			a1.textContent = "×";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "About";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "Challenge System";
    			t7 = space();
    			a4 = element("a");
    			a4.textContent = "Trailer";
    			t9 = space();
    			a5 = element("a");
    			a5.textContent = "Vote Token";
    			t11 = space();
    			a6 = element("a");
    			a6.textContent = "Roadmap";
    			t13 = space();
    			a7 = element("a");
    			a7.textContent = "Team";
    			t15 = space();
    			a8 = element("a");
    			a8.textContent = "Contact";
    			t17 = space();
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "EN";
    			option1 = element("option");
    			option1.textContent = "FR";
    			t20 = space();
    			div3 = element("div");
    			attr_dev(a0, "class", "logo svelte-165rdhs");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$e, 1, 4, 26);
    			attr_dev(rect, "width", "48");
    			attr_dev(rect, "height", "48");
    			attr_dev(rect, "fill", "white");
    			attr_dev(rect, "fill-opacity", "0");
    			attr_dev(rect, "class", "svelte-165rdhs");
    			add_location(rect, file$e, 5, 12, 294);
    			attr_dev(path0, "d", "M7.94977 11.9498H39.9498");
    			attr_dev(path0, "stroke", "white");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-165rdhs");
    			add_location(path0, file$e, 6, 12, 368);
    			attr_dev(path1, "d", "M7.94977 23.9498H39.9498");
    			attr_dev(path1, "stroke", "white");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-165rdhs");
    			add_location(path1, file$e, 7, 12, 497);
    			attr_dev(path2, "d", "M7.94977 35.9498H39.9498");
    			attr_dev(path2, "stroke", "white");
    			attr_dev(path2, "stroke-width", "4");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-165rdhs");
    			add_location(path2, file$e, 8, 12, 626);
    			attr_dev(svg, "width", "48px");
    			attr_dev(svg, "height", "48px");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-165rdhs");
    			add_location(svg, file$e, 4, 8, 181);
    			attr_dev(button, "class", "hamburger svelte-165rdhs");
    			add_location(button, file$e, 3, 4, 126);
    			attr_dev(a1, "href", "javascript:void(0)");
    			attr_dev(a1, "class", "closebtn svelte-165rdhs");
    			add_location(a1, file$e, 12, 8, 812);
    			attr_dev(a2, "href", "#Table");
    			attr_dev(a2, "class", "svelte-165rdhs");
    			add_location(a2, file$e, 13, 8, 899);
    			attr_dev(a3, "href", "#Challenge");
    			attr_dev(a3, "class", "svelte-165rdhs");
    			add_location(a3, file$e, 14, 8, 935);
    			attr_dev(a4, "href", "#Trailer");
    			attr_dev(a4, "class", "svelte-165rdhs");
    			add_location(a4, file$e, 15, 8, 986);
    			attr_dev(a5, "href", "#Vote");
    			attr_dev(a5, "class", "svelte-165rdhs");
    			add_location(a5, file$e, 16, 8, 1026);
    			attr_dev(a6, "href", "#Roadmap");
    			attr_dev(a6, "class", "svelte-165rdhs");
    			add_location(a6, file$e, 17, 8, 1066);
    			attr_dev(a7, "href", "#Team");
    			attr_dev(a7, "class", "svelte-165rdhs");
    			add_location(a7, file$e, 18, 8, 1106);
    			attr_dev(a8, "href", "#Contact");
    			attr_dev(a8, "class", "svelte-165rdhs");
    			add_location(a8, file$e, 19, 8, 1140);
    			option0.__value = "en";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-165rdhs");
    			add_location(option0, file$e, 23, 20, 1336);
    			option1.__value = "fr";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-165rdhs");
    			add_location(option1, file$e, 24, 20, 1388);
    			attr_dev(select, "class", "svelte-165rdhs");
    			add_location(select, file$e, 22, 16, 1261);
    			attr_dev(div0, "class", "select svelte-165rdhs");
    			add_location(div0, file$e, 21, 12, 1223);
    			attr_dev(div1, "class", "locale-selector svelte-165rdhs");
    			add_location(div1, file$e, 20, 8, 1180);
    			attr_dev(div2, "id", "sidenav");
    			attr_dev(div2, "class", "svelte-165rdhs");
    			add_location(div2, file$e, 11, 4, 784);
    			attr_dev(div3, "id", "overlay");
    			attr_dev(div3, "class", "svelte-165rdhs");
    			add_location(div3, file$e, 29, 4, 1499);
    			attr_dev(nav, "class", "navbar svelte-165rdhs");
    			add_location(nav, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a0);
    			append_dev(nav, t0);
    			append_dev(nav, button);
    			append_dev(button, svg);
    			append_dev(svg, rect);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(nav, t1);
    			append_dev(nav, div2);
    			append_dev(div2, a1);
    			append_dev(div2, t3);
    			append_dev(div2, a2);
    			append_dev(div2, t5);
    			append_dev(div2, a3);
    			append_dev(div2, t7);
    			append_dev(div2, a4);
    			append_dev(div2, t9);
    			append_dev(div2, a5);
    			append_dev(div2, t11);
    			append_dev(div2, a6);
    			append_dev(div2, t13);
    			append_dev(div2, a7);
    			append_dev(div2, t15);
    			append_dev(div2, a8);
    			append_dev(div2, t17);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*value*/ ctx[0]);
    			append_dev(nav, t20);
    			append_dev(nav, div3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", openNav, false, false, false),
    					listen_dev(a1, "click", closeNav, false, false, false),
    					listen_dev(select, "change", /*handleLocaleChange*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function openNav() {
    	document.getElementById("sidenav").style.width = "250px";
    	document.getElementById("overlay").style.visibility = "visible";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
    	document.getElementById("sidenav").style.width = "0";
    	document.getElementById("overlay").style.visibility = "hidden";
    }

    function handleClick() {
    	alert('clicked');
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let value = "en";

    	const handleLocaleChange = e => {
    		e.preventDefault();
    		M.set(e.target.value);
    		closeNav();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		locale: M,
    		value,
    		openNav,
    		closeNav,
    		handleLocaleChange,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, handleLocaleChange];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/NewsletterSignup.svelte generated by Svelte v3.44.3 */

    const file$d = "src/NewsletterSignup.svelte";

    function create_fragment$d(ctx) {
    	let form;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let button;
    	let t2;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			button = element("button");
    			t2 = text("REGISTER NOW");
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "form-name");
    			input0.value = "newsletter";
    			attr_dev(input0, "class", "svelte-1lmsi1u");
    			add_location(input0, file$d, 4, 4, 165);
    			attr_dev(input1, "name", "email");
    			set_style(input1, "color", /*color*/ ctx[0]);
    			set_style(input1, "border-color", /*color*/ ctx[0]);
    			attr_dev(input1, "placeholder", "Sign up for our newsletter");
    			attr_dev(input1, "class", "svelte-1lmsi1u");
    			add_location(input1, file$d, 5, 4, 230);
    			set_style(button, "color", /*color*/ ctx[0]);
    			set_style(button, "border-color", /*color*/ ctx[0]);
    			attr_dev(button, "class", "svelte-1lmsi1u");
    			add_location(button, file$d, 6, 4, 343);
    			attr_dev(form, "name", "newsletter");
    			attr_dev(form, "data-netlify-honeypot", "bot-field");
    			attr_dev(form, "method", "POST");
    			attr_dev(form, "data-netlify", "true");
    			attr_dev(form, "netlify", "");
    			attr_dev(form, "class", "signup svelte-1lmsi1u");
    			add_location(form, file$d, 3, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input0);
    			append_dev(form, t0);
    			append_dev(form, input1);
    			append_dev(form, t1);
    			append_dev(form, button);
    			append_dev(button, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(input1, "color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(input1, "border-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(button, "color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(button, "border-color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewsletterSignup', slots, []);
    	let { color } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NewsletterSignup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class NewsletterSignup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewsletterSignup",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console.warn("<NewsletterSignup> was created without expected prop 'color'");
    		}
    	}

    	get color() {
    		throw new Error("<NewsletterSignup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<NewsletterSignup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Hero.svelte generated by Svelte v3.44.3 */
    const file$c = "src/Hero.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (56:20) {#each skills as skill}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*skill*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-112ncx8");
    			add_location(li, file$c, 56, 24, 1319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(56:20) {#each skills as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let t0_value = /*$_*/ ctx[0]('home.hero.title') + "";
    	let t0;
    	let t1;
    	let div2;
    	let div1;
    	let ul;
    	let t2;
    	let li;
    	let t4;
    	let div5;
    	let div4;
    	let p;
    	let t5_value = /*$_*/ ctx[0]('home.hero.description_start') + "";
    	let t5;
    	let t6;
    	let span0;
    	let t7_value = /*$_*/ ctx[0]('home.hero.description_highlight') + "";
    	let t7;
    	let t8;
    	let t9_value = /*$_*/ ctx[0]('home.hero.description_end') + "";
    	let t9;
    	let t10;
    	let newslettersignup;
    	let t11;
    	let span1;
    	let t12;
    	let a;
    	let current;
    	let each_value = /*skills*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	newslettersignup = new NewsletterSignup({
    			props: { color: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li = element("li");
    			li.textContent = "AllSkills";
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			span0 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			t9 = text(t9_value);
    			t10 = space();
    			create_component(newslettersignup.$$.fragment);
    			t11 = space();
    			span1 = element("span");
    			t12 = text("Big news coming soon...");
    			a = element("a");
    			a.textContent = "@AllSkillsNFT";
    			attr_dev(div0, "class", "content svelte-112ncx8");
    			add_location(div0, file$c, 51, 8, 1060);
    			set_style(li, "color", "aqua");
    			set_style(li, "font-weight", "600", 1);
    			attr_dev(li, "class", "svelte-112ncx8");
    			add_location(li, file$c, 58, 20, 1386);
    			attr_dev(ul, "class", "scroll-animation svelte-112ncx8");
    			add_location(ul, file$c, 54, 16, 1219);
    			attr_dev(div1, "class", "scrolling-content-mask svelte-112ncx8");
    			add_location(div1, file$c, 53, 12, 1165);
    			attr_dev(div2, "class", "scrolling-content svelte-112ncx8");
    			add_location(div2, file$c, 52, 8, 1120);
    			attr_dev(div3, "class", "left-content svelte-112ncx8");
    			add_location(div3, file$c, 50, 3, 1024);
    			set_style(span0, "color", "aqua");
    			add_location(span0, file$c, 65, 79, 1670);
    			set_style(p, "margin-bottom", "2rem");
    			attr_dev(p, "class", "svelte-112ncx8");
    			add_location(p, file$c, 65, 12, 1603);
    			attr_dev(div4, "class", "description svelte-112ncx8");
    			add_location(div4, file$c, 64, 8, 1564);
    			attr_dev(div5, "class", "hero-split svelte-112ncx8");
    			add_location(div5, file$c, 63, 4, 1530);
    			attr_dev(a, "href", "https://twitter.com/@AllSkillsNFT");
    			attr_dev(a, "class", "svelte-112ncx8");
    			add_location(a, file$c, 70, 51, 1922);
    			attr_dev(span1, "class", "countdown svelte-112ncx8");
    			add_location(span1, file$c, 70, 4, 1875);
    			attr_dev(section, "class", "hero svelte-112ncx8");
    			add_location(section, file$c, 49, 0, 997);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    			append_dev(ul, li);
    			append_dev(section, t4);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, span0);
    			append_dev(span0, t7);
    			append_dev(p, t8);
    			append_dev(p, t9);
    			append_dev(div4, t10);
    			mount_component(newslettersignup, div4, null);
    			append_dev(section, t11);
    			append_dev(section, span1);
    			append_dev(span1, t12);
    			append_dev(span1, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$_*/ 1) && t0_value !== (t0_value = /*$_*/ ctx[0]('home.hero.title') + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*skills*/ 2) {
    				each_value = /*skills*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if ((!current || dirty & /*$_*/ 1) && t5_value !== (t5_value = /*$_*/ ctx[0]('home.hero.description_start') + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*$_*/ 1) && t7_value !== (t7_value = /*$_*/ ctx[0]('home.hero.description_highlight') + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*$_*/ 1) && t9_value !== (t9_value = /*$_*/ ctx[0]('home.hero.description_end') + "")) set_data_dev(t9, t9_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newslettersignup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newslettersignup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			destroy_component(newslettersignup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(0, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);

    	const skills = [
    		"Gymnastics",
    		"Volleyball",
    		"Hockey",
    		"Chello",
    		"Ice Skating",
    		"Badminton",
    		"ESports",
    		"Drums",
    		"Dance",
    		"Football",
    		"Basketball",
    		"Water Sports",
    		"Snowboard",
    		"Swimming",
    		"Darts",
    		"Piano",
    		"Harmonica",
    		"Lacrosse",
    		"Rugby",
    		"Bass",
    		"Bowling",
    		"Running",
    		"Saxophone",
    		"Trumpet",
    		"Golf",
    		"Violin",
    		"Parkour",
    		"Tuba",
    		"Band",
    		"Surfing",
    		"Singing",
    		"Baseball",
    		"Tennis",
    		"Archery",
    		"Trombone",
    		"Cricket",
    		"Ski",
    		"Boxing",
    		"Skateboard",
    		"Soccer",
    		"Guitar",
    		"Trickshots"
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ NewsletterSignup, _: X, skills, $_ });
    	return [$_, skills];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/TeamCards.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;
    const file$b = "src/TeamCards.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].name;
    	child_ctx[11] = list[i].position;
    	child_ctx[12] = list[i].descr;
    	child_ctx[13] = list[i].email;
    	child_ctx[14] = list[i].twitter;
    	child_ctx[15] = list[i].img;
    	child_ctx[16] = list[i].bg;
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (24:12) {:else}
    function create_else_block$1(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "More Info";
    			attr_dev(a, "class", "info svelte-1rrwjx5");
    			attr_dev(a, "data-card-id", /*i*/ ctx[18]);
    			add_location(a, file$b, 24, 12, 1411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*toggleMoreInfo*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(24:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:12) {#if selected === i}
    function create_if_block$1(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Less Info";
    			attr_dev(a, "class", "info svelte-1rrwjx5");
    			attr_dev(a, "data-card-id", /*i*/ ctx[18]);
    			add_location(a, file$b, 22, 12, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*toggleMoreInfo*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:12) {#if selected === i}",
    		ctx
    	});

    	return block;
    }

    // (2:2) {#each staff as {name, position, descr, email, twitter, img, bg}
    function create_each_block$1(ctx) {
    	let figure;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let figcaption;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let h2;
    	let t2_value = /*name*/ ctx[10] + "";
    	let t2;
    	let span;
    	let t3_value = /*position*/ ctx[11] + "";
    	let t3;
    	let t4;
    	let p;
    	let t6;
    	let div4;
    	let div3;
    	let div0;
    	let a;
    	let img2;
    	let img2_src_value;
    	let t7;
    	let div1;
    	let img3;
    	let img3_src_value;
    	let t8;
    	let div2;
    	let img4;
    	let img4_src_value;
    	let t9;
    	let t10;

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[0] === /*i*/ ctx[18]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			img0 = element("img");
    			t0 = space();
    			figcaption = element("figcaption");
    			img1 = element("img");
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test";
    			t6 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img2 = element("img");
    			t7 = space();
    			div1 = element("div");
    			img3 = element("img");
    			t8 = space();
    			div2 = element("div");
    			img4 = element("img");
    			t9 = space();
    			if_block.c();
    			t10 = space();
    			attr_dev(img0, "class", "background svelte-1rrwjx5");
    			if (!src_url_equal(img0.src, img0_src_value = /*bg*/ ctx[16])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "sample87");
    			add_location(img0, file$b, 3, 8, 138);
    			if (!src_url_equal(img1.src, img1_src_value = /*img*/ ctx[15])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "profile-sample4");
    			attr_dev(img1, "class", "profile svelte-1rrwjx5");
    			toggle_class(img1, "selected", /*selected*/ ctx[0] === /*i*/ ctx[18]);
    			add_location(img1, file$b, 5, 10, 276);
    			attr_dev(span, "class", "svelte-1rrwjx5");
    			add_location(span, file$b, 6, 20, 384);
    			attr_dev(h2, "class", "svelte-1rrwjx5");
    			add_location(h2, file$b, 6, 10, 374);
    			attr_dev(p, "class", "svelte-1rrwjx5");
    			toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[18]);
    			add_location(p, file$b, 7, 10, 424);
    			attr_dev(img2, "alt", "Twitter");
    			if (!src_url_equal(img2.src, img2_src_value = "images/twitter-aqua.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1rrwjx5");
    			add_location(img2, file$b, 11, 52, 856);
    			attr_dev(a, "href", /*twitter*/ ctx[14]);
    			attr_dev(a, "class", "twitter svelte-1rrwjx5");
    			add_location(a, file$b, 11, 18, 822);
    			attr_dev(div0, "class", "socials-item svelte-1rrwjx5");
    			add_location(div0, file$b, 10, 16, 776);
    			attr_dev(img3, "alt", "Email");
    			if (!src_url_equal(img3.src, img3_src_value = "images/email-nocircle-aqua.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1rrwjx5");
    			add_location(img3, file$b, 14, 20, 999);
    			attr_dev(div1, "class", "socials-item svelte-1rrwjx5");
    			add_location(div1, file$b, 13, 16, 951);
    			attr_dev(img4, "alt", "LinkedIn");
    			if (!src_url_equal(img4.src, img4_src_value = "images/linkedin-aqua.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1rrwjx5");
    			add_location(img4, file$b, 17, 20, 1143);
    			attr_dev(div2, "class", "socials-item svelte-1rrwjx5");
    			add_location(div2, file$b, 16, 16, 1095);
    			attr_dev(div3, "class", "socials svelte-1rrwjx5");
    			set_style(div3, "width", "45%");
    			add_location(div3, file$b, 9, 12, 719);
    			set_style(div4, "max-width", "100%");
    			set_style(div4, "display", "flex");
    			set_style(div4, "justify-content", "space-around");
    			set_style(div4, "max-height", "60px");
    			attr_dev(div4, "class", "svelte-1rrwjx5");
    			add_location(div4, file$b, 8, 10, 614);
    			attr_dev(figcaption, "class", "slanted-bg svelte-1rrwjx5");
    			toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[18]);
    			add_location(figcaption, file$b, 4, 8, 198);
    			attr_dev(figure, "class", "card svelte-1rrwjx5");
    			add_location(figure, file$b, 2, 4, 107);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, img0);
    			append_dev(figure, t0);
    			append_dev(figure, figcaption);
    			append_dev(figcaption, img1);
    			append_dev(figcaption, t1);
    			append_dev(figcaption, h2);
    			append_dev(h2, t2);
    			append_dev(h2, span);
    			append_dev(span, t3);
    			append_dev(figcaption, t4);
    			append_dev(figcaption, p);
    			append_dev(figcaption, t6);
    			append_dev(figcaption, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, a);
    			append_dev(a, img2);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, img3);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, img4);
    			append_dev(div4, t9);
    			if_block.m(div4, null);
    			append_dev(figure, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected*/ 1) {
    				toggle_class(img1, "selected", /*selected*/ ctx[0] === /*i*/ ctx[18]);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[18]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[18]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(2:2) {#each staff as {name, position, descr, email, twitter, img, bg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let each_value = /*staff*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "cards-container svelte-1rrwjx5");
    			add_location(div, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected, toggleMoreInfo, staff*/ 7) {
    				each_value = /*staff*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TeamCards', slots, []);

    	const staff = [
    		{
    			id: 0,
    			name: "Noah Goren",
    			position: "Co-Founder",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "ngoren@allskills.ca",
    			twitter: "https://twitter.com/@NoGoren",
    			img: "images/Noah_s.webp",
    			bg: "images/summer_bg_s.webp"
    		},
    		{
    			id: 0,
    			name: "Frank Sammut",
    			position: "Co-Founder",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "fsammut@allskills.ca",
    			twitter: "https://twitter.com/@Sammut_frank",
    			img: "images/Frank_s.webp",
    			bg: "images/fall_bg_s.webp"
    		},
    		{
    			id: 0,
    			name: "Christopher Thompson",
    			position: "Co-Founder",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "cthompson@allskills.ca",
    			twitter: "",
    			img: "images/Christopher_s.webp",
    			bg: "images/winter_bg_s.webp"
    		},
    		{
    			id: 0,
    			name: "Charles Hamelin",
    			position: "Co-Founder",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "chamelin@allskills.ca",
    			twitter: "https://twitter.com/@Speedskater01",
    			img: "images/Charles_s.webp",
    			bg: "images/rings_s.webp"
    		}
    	];

    	let selected;
    	let infoShowing = false;
    	let hidden = true;
    	let buttonText = "More Info";

    	const toggleMoreInfo = e => {
    		// if same card clicked twice to toggle front and back
    		if (selected === Number(e.target.dataset.cardId)) {
    			$$invalidate(0, selected = null);
    			infoShowing = !infoShowing;
    			hidden = !hidden;
    		} else {
    			hidden = !hidden;
    			infoShowing = !infoShowing;
    			$$invalidate(0, selected = Number(e.target.dataset.cardId));
    		}
    	};

    	function clickMoreInfo() {
    		$$invalidate(0, selected = !selected);
    		bgselected = !bgselected;
    		hidden = !hidden;
    	}

    	let selectedFlip;
    	let cardBackShowing = false;

    	const toggleBackFront = e => {
    		// if same card clicked twice to toggle front and back
    		if (selectedFlip === Number(e.target.dataset.cardId)) {
    			$$invalidate(3, selectedFlip = null);
    			cardBackShowing = !cardBackShowing;
    		} else {
    			cardBackShowing = !cardBackShowing;
    			$$invalidate(3, selectedFlip = Number(e.target.dataset.cardId));
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<TeamCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		staff,
    		selected,
    		infoShowing,
    		hidden,
    		buttonText,
    		toggleMoreInfo,
    		clickMoreInfo,
    		selectedFlip,
    		cardBackShowing,
    		toggleBackFront
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('infoShowing' in $$props) infoShowing = $$props.infoShowing;
    		if ('hidden' in $$props) hidden = $$props.hidden;
    		if ('buttonText' in $$props) buttonText = $$props.buttonText;
    		if ('selectedFlip' in $$props) $$invalidate(3, selectedFlip = $$props.selectedFlip);
    		if ('cardBackShowing' in $$props) cardBackShowing = $$props.cardBackShowing;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedFlip*/ 8) {
    			console.log(selectedFlip);
    		}
    	};

    	return [selected, staff, toggleMoreInfo, selectedFlip];
    }

    class TeamCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TeamCards",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var frappeCharts_min_umd = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,function(){function t(t,e){return "string"==typeof t?(e||document).querySelector(t):t||null}function e(t){var e=t.getBoundingClientRect();return {top:e.top+(document.documentElement.scrollTop||document.body.scrollTop),left:e.left+(document.documentElement.scrollLeft||document.body.scrollLeft)}}function i(t){return null===t.offsetParent}function n(t){var e=t.getBoundingClientRect();return e.top>=0&&e.left>=0&&e.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth)}function a(t){var e=window.getComputedStyle(t),i=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight);return t.clientWidth-i}function s(t,e,i){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0);for(var a in i)n[a]=i[a];return t.dispatchEvent(n)}function r(t){return t.titleHeight+t.margins.top+t.paddings.top}function o(t){return t.margins.left+t.paddings.left}function l(t){return t.margins.top+t.margins.bottom+t.paddings.top+t.paddings.bottom+t.titleHeight+t.legendHeight}function u(t){return t.margins.left+t.margins.right+t.paddings.left+t.paddings.right}function h(t){return parseFloat(t.toFixed(2))}function c(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];i||(i=n?t[0]:t[t.length-1]);var a=new Array(Math.abs(e)).fill(i);return t=n?a.concat(t):t.concat(a)}function d(t,e){return (t+"").length*e}function p(t,e){return {x:Math.sin(t*Zt)*e,y:Math.cos(t*Zt)*e}}function f(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return !Number.isNaN(t)&&(void 0!==t&&(!!Number.isFinite(t)&&!(e&&t<0)))}function v(t){return Number(Math.round(t+"e4")+"e-4")}function g(t){var e=void 0,i=void 0,n=void 0;if(t instanceof Date)return new Date(t.getTime());if("object"!==(void 0===t?"undefined":Ft(t))||null===t)return t;e=Array.isArray(t)?[]:{};for(n in t)i=t[n],e[n]=g(i);return e}function m(t,e){var i=void 0,n=void 0;return t<=e?(i=e-t,n=t):(i=t-e,n=e),[i,n]}function y(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e.length-t.length;return i>0?t=c(t,i):e=c(e,i),[t,e]}function b(t,e){if(t)return t.length>e?t.slice(0,e-3)+"...":t}function x(t){var e=void 0;if("number"==typeof t)e=t;else if("string"==typeof t&&(e=Number(t),Number.isNaN(e)))return t;var i=Math.floor(Math.log10(Math.abs(e)));if(i<=2)return e;var n=Math.floor(i/3),a=Math.pow(10,i-3*n)*+(e/Math.pow(10,i)).toFixed(1);return Math.round(100*a)/100+" "+["","K","M","B","T"][n]}function k(t,e){for(var i=[],n=0;n<t.length;n++)i.push([t[n],e[n]]);var a=function(t,e){var i=e[0]-t[0],n=e[1]-t[1];return {length:Math.sqrt(Math.pow(i,2)+Math.pow(n,2)),angle:Math.atan2(n,i)}},s=function(t,e,i,n){var s=a(e||t,i||t),r=s.angle+(n?Math.PI:0),o=.2*s.length;return [t[0]+Math.cos(r)*o,t[1]+Math.sin(r)*o]};return function(t,e){return t.reduce(function(t,i,n,a){return 0===n?i[0]+","+i[1]:t+" "+e(i,n,a)},"")}(i,function(t,e,i){var n=s(i[e-1],i[e-2],t),a=s(t,i[e-1],i[e+1],!0);return "C "+n[0]+","+n[1]+" "+a[0]+","+a[1]+" "+t[0]+","+t[1]})}function w(t){return t>255?255:t<0?0:t}function A(t,e){var i=ie(t),n=!1;"#"==i[0]&&(i=i.slice(1),n=!0);var a=parseInt(i,16),s=w((a>>16)+e),r=w((a>>8&255)+e),o=w((255&a)+e);return (n?"#":"")+(o|r<<8|s<<16).toString(16)}function P(t){var e=/(^\s*)(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/i;return /(^\s*)(#)((?:[A-Fa-f0-9]{3}){1,2})$/i.test(t)||e.test(t)}function T(t,e){return "string"==typeof t?(e||document).querySelector(t):t||null}function L(t,e){var i=document.createElementNS("http://www.w3.org/2000/svg",t);for(var n in e){var a=e[n];if("inside"===n)T(a).appendChild(i);else if("around"===n){var s=T(a);s.parentNode.insertBefore(i,s),i.appendChild(s);}else "styles"===n?"object"===(void 0===a?"undefined":Ft(a))&&Object.keys(a).map(function(t){i.style[t]=a[t];}):("className"===n&&(n="class"),"innerHTML"===n?i.textContent=a:i.setAttribute(n,a));}return i}function O(t,e){return L("linearGradient",{inside:t,id:e,x1:0,x2:0,y1:0,y2:1})}function M(t,e,i,n){return L("stop",{inside:t,style:"stop-color: "+i,offset:e,"stop-opacity":n})}function C(t,e,i,n){return L("svg",{className:e,inside:t,width:i,height:n})}function D(t){return L("defs",{inside:t})}function N(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,n={className:t,transform:e};return i&&(n.inside=i),L("g",n)}function S(t){return L("path",{className:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",d:t,styles:{stroke:arguments.length>2&&void 0!==arguments[2]?arguments[2]:"none",fill:arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none","stroke-width":arguments.length>4&&void 0!==arguments[4]?arguments[4]:2}})}function E(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=i.x+t.x,o=i.y+t.y,l=i.x+e.x,u=i.y+e.y;return "M"+i.x+" "+i.y+"\n\t\tL"+r+" "+o+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+u+" z"}function _(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=i.x+t.x,o=i.y+t.y,l=i.x+e.x,u=2*i.y,h=i.y+e.y;return "M"+i.x+" "+i.y+"\n\t\tL"+r+" "+o+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+u+" z\n\t\tL"+r+" "+u+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+h+" z"}function z(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=i.x+t.x,o=i.y+t.y,l=i.x+e.x,u=i.y+e.y;return "M"+r+" "+o+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+u}function W(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=i.x+t.x,o=i.y+t.y,l=i.x+e.x,u=2*n+o,h=i.y+t.y;return "M"+r+" "+o+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+u+"\n\t\tM"+r+" "+u+"\n\t\tA "+n+" "+n+" 0 "+s+" "+(a?1:0)+"\n\t\t"+l+" "+h}function j(t,e){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n="path-fill-gradient-"+e+"-"+(i?"lighter":"default"),a=O(t,n),s=[1,.6,.2];return i&&(s=[.4,.2,0]),M(a,"0%",e,s[0]),M(a,"50%",e,s[1]),M(a,"100%",e,s[2]),n}function F(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:Jt,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"none";return L("rect",{className:"percentage-bar",x:t,y:e,width:i,height:n,fill:s,styles:{stroke:A(s,-25),"stroke-dasharray":"0, "+(n+i)+", "+i+", "+n,"stroke-width":a}})}function H(t,e,i,n,a){var s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"none",r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:{},o={className:t,x:e,y:i,width:n,height:n,rx:a,fill:s};return Object.keys(r).map(function(t){o[t]=r[t];}),L("rect",o)}function I(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none",a=arguments[4];a=arguments.length>5&&void 0!==arguments[5]&&arguments[5]?b(a,se):a;var s={className:"legend-bar",x:0,y:0,width:i,height:"2px",fill:n},r=L("text",{className:"legend-dataset-text",x:0,y:0,dy:2*re+"px","font-size":1.2*re+"px","text-anchor":"start",fill:le,innerHTML:a}),o=L("g",{transform:"translate("+t+", "+e+")"});return o.appendChild(L("rect",s)),o.appendChild(r),o}function R(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none",a=arguments[4];a=arguments.length>5&&void 0!==arguments[5]&&arguments[5]?b(a,se):a;var s={className:"legend-dot",cx:0,cy:0,r:i,fill:n},r=L("text",{className:"legend-dataset-text",x:0,y:0,dx:re+"px",dy:re/3+"px","font-size":1.2*re+"px","text-anchor":"start",fill:le,innerHTML:a}),o=L("g",{transform:"translate("+t+", "+e+")"});return o.appendChild(L("circle",s)),o.appendChild(r),o}function Y(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},s=a.fontSize||re;return L("text",{className:t,x:e,y:i,dy:(void 0!==a.dy?a.dy:s/2)+"px","font-size":s+"px",fill:a.fill||le,"text-anchor":a.textAnchor||"start",innerHTML:n})}function B(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};a.stroke||(a.stroke=oe);var s=L("line",{className:"line-vertical "+a.className,x1:0,x2:0,y1:i,y2:n,styles:{stroke:a.stroke}}),r=L("text",{x:0,y:i>n?i+ae:i-ae-re,dy:re+"px","font-size":re+"px","text-anchor":"middle",innerHTML:e+""}),o=L("g",{transform:"translate("+t+", 0)"});return o.appendChild(s),o.appendChild(r),o}function V(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};a.stroke||(a.stroke=oe),a.lineType||(a.lineType=""),a.shortenNumbers&&(e=x(e));var s=L("line",{className:"line-horizontal "+a.className+("dashed"===a.lineType?"dashed":""),x1:i,x2:n,y1:0,y2:0,styles:{stroke:a.stroke}}),r=L("text",{x:i<n?i-ae:i+ae,y:0,dy:re/2-2+"px","font-size":re+"px","text-anchor":i<n?"end":"start",innerHTML:e+""}),o=L("g",{transform:"translate(0, "+t+")","stroke-opacity":1});return 0!==r&&"0"!==r||(o.style.stroke="rgba(27, 31, 35, 0.6)"),o.appendChild(s),o.appendChild(r),o}function U(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};f(t)||(t=0),n.pos||(n.pos="left"),n.offset||(n.offset=0),n.mode||(n.mode="span"),n.stroke||(n.stroke=oe),n.className||(n.className="");var a=-1*ne,s="span"===n.mode?i+ne:0;return "tick"===n.mode&&"right"===n.pos&&(a=i+ne,s=i),a+=n.offset,s+=n.offset,V(t,e,a,s,{stroke:n.stroke,className:n.className,lineType:n.lineType,shortenNumbers:n.shortenNumbers})}function G(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};f(t)||(t=0),n.pos||(n.pos="bottom"),n.offset||(n.offset=0),n.mode||(n.mode="span"),n.stroke||(n.stroke=oe),n.className||(n.className="");var a=i+ne,s="span"===n.mode?-1*ne:i;return "tick"===n.mode&&"top"===n.pos&&(a=-1*ne,s=0),B(t,e,a,s,{stroke:n.stroke,className:n.className,lineType:n.lineType})}function q(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};n.labelPos||(n.labelPos="right");var a=L("text",{className:"chart-label",x:"left"===n.labelPos?ae:i-d(e,5)-ae,y:0,dy:re/-2+"px","font-size":re+"px","text-anchor":"start",innerHTML:e+""}),s=V(t,"",0,i,{stroke:n.stroke||oe,className:n.className||"",lineType:n.lineType});return s.appendChild(a),s}function X(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},s=t-e,r=L("rect",{className:"bar mini",styles:{fill:"rgba(228, 234, 239, 0.49)",stroke:oe,"stroke-dasharray":i+", "+s},x:0,y:0,width:i,height:s});a.labelPos||(a.labelPos="right");var o=L("text",{className:"chart-label",x:"left"===a.labelPos?ae:i-d(n+"",4.5)-ae,y:0,dy:re/-2+"px","font-size":re+"px","text-anchor":"start",innerHTML:n+""}),l=L("g",{transform:"translate(0, "+e+")"});return l.appendChild(r),l.appendChild(o),l}function J(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,o=arguments.length>7&&void 0!==arguments[7]?arguments[7]:{},l=m(e,o.zeroLine),u=Vt(l,2),h=u[0],c=u[1];c-=r,0===h&&(h=o.minHeight,c-=o.minHeight),f(t)||(t=0),f(c)||(c=0),f(h,!0)||(h=0),f(i,!0)||(i=0);var d=L("rect",{className:"bar mini",style:"fill: "+n,"data-point-index":s,x:t,y:c,width:i,height:h});if((a+="")||a.length){d.setAttribute("y",0),d.setAttribute("x",0);var p=L("text",{className:"data-point-value",x:i/2,y:0,dy:re/2*-1+"px","font-size":re+"px","text-anchor":"middle",innerHTML:a}),v=L("g",{"data-point-index":s,transform:"translate("+t+", "+c+")"});return v.appendChild(d),v.appendChild(p),v}return d}function K(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,r=L("circle",{style:"fill: "+n,"data-point-index":s,cx:t,cy:e,r:i});if((a+="")||a.length){r.setAttribute("cy",0),r.setAttribute("cx",0);var o=L("text",{className:"data-point-value",x:0,y:0,dy:re/2*-1-i+"px","font-size":re+"px","text-anchor":"middle",innerHTML:a}),l=L("g",{"data-point-index":s,transform:"translate("+t+", "+e+")"});return l.appendChild(r),l.appendChild(o),l}return r}function $(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},s=e.map(function(e,i){return t[i]+","+e}).join("L");n.spline&&(s=k(t,e));var r=S("M"+s,"line-graph-path",i);if(n.heatline){var o=j(a.svgDefs,i);r.style.stroke="url(#"+o+")";}var l={path:r};if(n.regionFill){var u=j(a.svgDefs,i,!0),h="M"+t[0]+","+a.zeroLine+"L"+s+"L"+t.slice(-1)[0]+","+a.zeroLine;l.region=S(h,"region-fill","none","url(#"+u+")");}return l}function Q(t,e,i,n){var a="string"==typeof e?e:e.join(", ");return [t,{transform:i.join(", ")},n,ve,"translate",{transform:a}]}function Z(t,e,i){return Q(t,[i,0],[e,0],pe)}function tt(t,e,i){return Q(t,[0,i],[0,e],pe)}function et(t,e,i,n){var a=e-i,s=t.childNodes[0];return [[s,{height:a,"stroke-dasharray":s.getAttribute("width")+", "+a},pe,ve],Q(t,[0,n],[0,i],pe)]}function it(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,s=m(i,(arguments.length>5&&void 0!==arguments[5]?arguments[5]:{}).zeroLine),r=Vt(s,2),o=r[0],l=r[1];return l-=a,"rect"!==t.nodeName?[[t.childNodes[0],{width:n,height:o},ce,ve],Q(t,t.getAttribute("transform").split("(")[1].slice(0,-1),[e,l],pe)]:[[t,{width:n,height:o,x:e,y:l},ce,ve]]}function nt(t,e,i){return "circle"!==t.nodeName?[Q(t,t.getAttribute("transform").split("(")[1].slice(0,-1),[e,i],pe)]:[[t,{cx:e,cy:i},ce,ve]]}function at(t,e,i,n,a){var s=[],r=i.map(function(t,i){return e[i]+","+t}).join("L");a&&(r=k(e,i));var o=[t.path,{d:"M"+r},de,ve];if(s.push(o),t.region){var l=e[0]+","+n+"L",u="L"+e.slice(-1)[0]+", "+n,h=[t.region,{d:"M"+l+r+u},de,ve];s.push(h);}return s}function st(t,e){return [t,{d:e},ce,ve]}function rt(t,e,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"linear",a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},r=t.cloneNode(!0),o=t.cloneNode(!0);for(var l in e){var u=void 0;u="transform"===l?document.createElementNS("http://www.w3.org/2000/svg","animateTransform"):document.createElementNS("http://www.w3.org/2000/svg","animate");var h=s[l]||t.getAttribute(l),c=e[l],d={attributeName:l,from:h,to:c,begin:"0s",dur:i/1e3+"s",values:h+";"+c,keySplines:ge[n],keyTimes:"0;1",calcMode:"spline",fill:"freeze"};a&&(d.type=a);for(var p in d)u.setAttribute(p,d[p]);r.appendChild(u),a?o.setAttribute(l,"translate("+c+")"):o.setAttribute(l,c);}return [r,o]}function ot(t,e){t.style.transform=e,t.style.webkitTransform=e,t.style.msTransform=e,t.style.mozTransform=e,t.style.oTransform=e;}function lt(t,e){var i=[],n=[];e.map(function(t){var e=t[0],a=e.parentNode,s=void 0,r=void 0;t[0]=e;var o=rt.apply(void 0,Ut(t)),l=Vt(o,2);s=l[0],r=l[1],i.push(r),n.push([s,a]),a&&a.replaceChild(s,e);});var a=t.cloneNode(!0);return n.map(function(t,n){t[1]&&(t[1].replaceChild(i[n],t[0]),e[n][0]=i[n]);}),a}function ut(t,e,i){if(0!==i.length){var n=lt(e,i);e.parentNode==t&&(t.removeChild(e),t.appendChild(n)),setTimeout(function(){n.parentNode==t&&(t.removeChild(n),t.appendChild(e));},fe);}}function ht(t,e){var i=document.createElement("a");i.style="display: none";var n=new Blob(e,{type:"image/svg+xml; charset=utf-8"}),a=window.URL.createObjectURL(n);i.href=a,i.download=t,document.body.appendChild(i),i.click(),setTimeout(function(){document.body.removeChild(i),window.URL.revokeObjectURL(a);},300);}function ct(e){var i=e.cloneNode(!0);i.classList.add("chart-container"),i.setAttribute("xmlns","http://www.w3.org/2000/svg"),i.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");var n=t.create("style",{innerHTML:me});i.insertBefore(n,i.firstChild);var a=t.create("div");return a.appendChild(i),a.innerHTML}function dt(t){var e=new Date(t);return e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),e}function pt(t){var e=t.getDate(),i=t.getMonth()+1;return [t.getFullYear(),(i>9?"":"0")+i,(e>9?"":"0")+e].join("-")}function ft(t){return new Date(t.getTime())}function vt(t,e){var i=xt(t);return Math.ceil(gt(i,e)/xe)}function gt(t,e){var i=we*ke;return (dt(e)-dt(t))/i}function mt(t,e){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}function yt(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=Ae[t];return e?i.slice(0,3):i}function bt(t,e){return new Date(e,t+1,0)}function xt(t){var e=ft(t),i=e.getDay();return 0!==i&&kt(e,-1*i),e}function kt(t,e){t.setDate(t.getDate()+e);}function wt(t,e,i){var n=Object.keys(Le).filter(function(e){return t.includes(e)}),a=Le[n[0]];return Object.assign(a,{constants:e,getData:i}),new Te(a)}function At(t){if(0===t)return [0,0];if(isNaN(t))return {mantissa:-6755399441055744,exponent:972};var e=t>0?1:-1;if(!isFinite(t))return {mantissa:4503599627370496*e,exponent:972};t=Math.abs(t);var i=Math.floor(Math.log10(t));return [e*(t/Math.pow(10,i)),i]}function Pt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=Math.ceil(t),n=Math.floor(e),a=i-n,s=a,r=1;a>5&&(a%2!=0&&(a=++i-n),s=a/2,r=2),a<=2&&(r=a/(s=4)),0===a&&(s=5,r=1);for(var o=[],l=0;l<=s;l++)o.push(n+r*l);return o}function Tt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=At(t),n=Vt(i,2),a=n[0],s=n[1],r=e?e/Math.pow(10,s):0,o=Pt(a=a.toFixed(6),r);return o=o.map(function(t){return t*Math.pow(10,s)})}function Lt(t){function e(t,e){for(var i=Tt(t),n=i[1]-i[0],a=0,s=1;a<e;s++)a+=n,i.unshift(-1*a);return i}var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Math.max.apply(Math,Ut(t)),a=Math.min.apply(Math,Ut(t)),s=[];if(n>=0&&a>=0)At(n)[1],s=i?Tt(n,a):Tt(n);else if(n>0&&a<0){var r=Math.abs(a);n>=r?(At(n)[1],s=e(n,r)):(At(r)[1],s=e(r,n).reverse().map(function(t){return -1*t}));}else if(n<=0&&a<=0){var o=Math.abs(a),l=Math.abs(n);At(o)[1],s=(s=i?Tt(o,l):Tt(o)).reverse().map(function(t){return -1*t});}return s}function Ot(t){var e=Mt(t);return t.indexOf(0)>=0?t.indexOf(0):t[0]>0?-1*t[0]/e:-1*t[t.length-1]/e+(t.length-1)}function Mt(t){return t[1]-t[0]}function Ct(t){return t[t.length-1]-t[0]}function Dt(t,e){return h(e.zeroLine-t*e.scaleMultiplier)}function Nt(t,e){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=e.reduce(function(e,i){return Math.abs(i-t)<Math.abs(e-t)?i:e},[]);return i?e.indexOf(n):n}function St(t,e){for(var i=Math.max.apply(Math,Ut(t)),n=1/(e-1),a=[],s=0;s<e;s++){var r=i*(n*s);a.push(r);}return a}function Et(t,e){return e.filter(function(e){return e<t}).length}function _t(t,e){t.labels=t.labels||[];var i=t.labels.length,n=t.datasets,a=new Array(i).fill(0);return n||(n=[{values:a}]),n.map(function(t){if(t.values){var n=t.values;n=(n=n.map(function(t){return isNaN(t)?0:t})).length>i?n.slice(0,i):c(n,i-n.length,0),t.values=n;}else t.values=a;t.chartType||(t.chartType=e);}),t.yRegions&&t.yRegions.map(function(t){if(t.end<t.start){var e=[t.end,t.start];t.start=e[0],t.end=e[1];}}),t}function zt(t){var e=t.labels.length,i=new Array(e).fill(0),n={labels:t.labels.slice(0,-1),datasets:t.datasets.map(function(t){return {name:"",values:i.slice(0,-1),chartType:t.chartType}})};return t.yMarkers&&(n.yMarkers=[{value:0,label:""}]),t.yRegions&&(n.yRegions=[{start:0,end:0,label:""}]),n}function Wt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n=t/e.length;n<=0&&(n=1);var a=n/Kt,s=void 0;if(i){var r=Math.max.apply(Math,Ut(e.map(function(t){return t.length})));s=Math.ceil(r/a);}return e.map(function(t,e){return (t+="").length>a&&(i?e%s!=0&&(t=""):t=a-3>0?t.slice(0,a-3)+" ...":t.slice(0,a)+".."),t})}function jt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"line",e=arguments[1],i=arguments[2];return "axis-mixed"===t?(i.type="line",new De(e,i)):Se[t]?new Se[t](e,i):void console.error("Undefined chart type: "+t)}!function(t,e){void 0===e&&(e={});var i=e.insertAt;if(t&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===i&&n.firstChild?n.insertBefore(a,n.firstChild):n.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t));}}('.chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ol,.graph-svg-tip ul{padding-left:0;display:-webkit-box;display:-ms-flexbox;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;-webkit-box-flex:1;-ms-flex:1;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:" ";border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}');var Ft="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ht=(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}),It=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),Rt=function t(e,i,n){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,i);if(void 0===a){var s=Object.getPrototypeOf(e);return null===s?void 0:t(s,i,n)}if("value"in a)return a.value;var r=a.get;if(void 0!==r)return r.call(n)},Yt=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);},Bt=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e},Vt=function(){function t(t,e){var i=[],n=!0,a=!1,s=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done)&&(i.push(r.value),!e||i.length!==e);n=!0);}catch(t){a=!0,s=t;}finally{try{!n&&o.return&&o.return();}finally{if(a)throw s}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),Ut=function(t){if(Array.isArray(t)){for(var e=0,i=Array(t.length);e<t.length;e++)i[e]=t[e];return i}return Array.from(t)};t.create=function(e,i){var n=document.createElement(e);for(var a in i){var s=i[a];if("inside"===a)t(s).appendChild(n);else if("around"===a){var r=t(s);r.parentNode.insertBefore(n,r),n.appendChild(r);}else "styles"===a?"object"===(void 0===s?"undefined":Ft(s))&&Object.keys(s).map(function(t){n.style[t]=s[t];}):a in n?n[a]=s:n.setAttribute(a,s);}return n};var Gt={margins:{top:10,bottom:10,left:20,right:20},paddings:{top:20,bottom:40,left:30,right:10},baseHeight:240,titleHeight:20,legendHeight:30,titleFontSize:12},qt=700,Jt=2,Kt=7,$t=["light-blue","blue","violet","red","orange","yellow","green","light-green","purple","magenta","light-grey","dark-grey"],Qt={bar:$t,line:$t,pie:$t,percentage:$t,heatmap:["#ebedf0","#c6e48b","#7bc96f","#239a3b","#196127"],donut:$t},Zt=Math.PI/180,te=function(){function e(t){var i=t.parent,n=void 0===i?null:i,a=t.colors,s=void 0===a?[]:a;Ht(this,e),this.parent=n,this.colors=s,this.titleName="",this.titleValue="",this.listValues=[],this.titleValueFirst=0,this.x=0,this.y=0,this.top=0,this.left=0,this.setup();}return It(e,[{key:"setup",value:function(){this.makeTooltip();}},{key:"refresh",value:function(){this.fill(),this.calcPosition();}},{key:"makeTooltip",value:function(){var e=this;this.container=t.create("div",{inside:this.parent,className:"graph-svg-tip comparison",innerHTML:'<span class="title"></span>\n\t\t\t\t<ul class="data-point-list"></ul>\n\t\t\t\t<div class="svg-pointer"></div>'}),this.hideTip(),this.title=this.container.querySelector(".title"),this.dataPointList=this.container.querySelector(".data-point-list"),this.parent.addEventListener("mouseleave",function(){e.hideTip();});}},{key:"fill",value:function(){var e=this,i=void 0;this.index&&this.container.setAttribute("data-point-index",this.index),i=this.titleValueFirst?"<strong>"+this.titleValue+"</strong>"+this.titleName:this.titleName+"<strong>"+this.titleValue+"</strong>",this.title.innerHTML=i,this.dataPointList.innerHTML="",this.listValues.map(function(i,n){var a=e.colors[n]||"black",s=0===i.formatted||i.formatted?i.formatted:i.value,r=t.create("li",{styles:{"border-top":"3px solid "+a},innerHTML:'<strong style="display: block;">'+(0===s||s?s:"")+"</strong>\n\t\t\t\t\t"+(i.title?i.title:"")});e.dataPointList.appendChild(r);});}},{key:"calcPosition",value:function(){var t=this.container.offsetWidth;this.top=this.y-this.container.offsetHeight-5,this.left=this.x-t/2;var e=this.parent.offsetWidth-t,i=this.container.querySelector(".svg-pointer");if(this.left<0)i.style.left="calc(50% - "+-1*this.left+"px)",this.left=0;else if(this.left>e){var n="calc(50% + "+(this.left-e)+"px)";i.style.left=n,this.left=e;}else i.style.left="50%";}},{key:"setValues",value:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:-1;this.titleName=i.name,this.titleValue=i.value,this.listValues=n,this.x=t,this.y=e,this.titleValueFirst=i.valueFirst||0,this.index=a,this.refresh();}},{key:"hideTip",value:function(){this.container.style.top="0px",this.container.style.left="0px",this.container.style.opacity="0";}},{key:"showTip",value:function(){this.container.style.top=this.top+"px",this.container.style.left=this.left+"px",this.container.style.opacity="1";}}]),e}(),ee={"light-blue":"#7cd6fd",blue:"#5e64ff",violet:"#743ee2",red:"#ff5858",orange:"#ffa00a",yellow:"#feef72",green:"#28a745","light-green":"#98d85b",purple:"#b554ff",magenta:"#ffa3ef",black:"#36114C",grey:"#bdd3e6","light-grey":"#f0f4f7","dark-grey":"#b8c2cc"},ie=function(t){return /rgb[a]{0,1}\([\d, ]+\)/gim.test(t)?/\D+(\d*)\D+(\d*)\D+(\d*)/gim.exec(t).map(function(t,e){return 0!==e?Number(t).toString(16):"#"}).reduce(function(t,e){return ""+t+e}):ee[t]||t},ne=6,ae=4,se=15,re=10,oe="#dadada",le="#555b51",ue={bar:function(t){var e=void 0;"rect"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var i=t.cloneNode();return i.style.fill="#000000",i.style.opacity="0.4",e&&i.setAttribute("transform",e),i},dot:function(t){var e=void 0;"circle"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var i=t.cloneNode(),n=t.getAttribute("r"),a=t.getAttribute("fill");return i.setAttribute("r",parseInt(n)+4),i.setAttribute("fill",a),i.style.opacity="0.6",e&&i.setAttribute("transform",e),i},heat_square:function(t){var e=void 0;"circle"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var i=t.cloneNode(),n=t.getAttribute("r"),a=t.getAttribute("fill");return i.setAttribute("r",parseInt(n)+4),i.setAttribute("fill",a),i.style.opacity="0.6",e&&i.setAttribute("transform",e),i}},he={bar:function(t,e){var i=void 0;"rect"!==t.nodeName&&(i=t.getAttribute("transform"),t=t.childNodes[0]);var n=["x","y","width","height"];Object.values(t.attributes).filter(function(t){return n.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),i&&e.setAttribute("transform",i);},dot:function(t,e){var i=void 0;"circle"!==t.nodeName&&(i=t.getAttribute("transform"),t=t.childNodes[0]);var n=["cx","cy"];Object.values(t.attributes).filter(function(t){return n.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),i&&e.setAttribute("transform",i);},heat_square:function(t,e){var i=void 0;"circle"!==t.nodeName&&(i=t.getAttribute("transform"),t=t.childNodes[0]);var n=["cx","cy"];Object.values(t.attributes).filter(function(t){return n.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),i&&e.setAttribute("transform",i);}},ce=350,de=350,pe=ce,fe=250,ve="easein",ge={ease:"0.25 0.1 0.25 1",linear:"0 0 1 1",easein:"0.1 0.8 0.2 1",easeout:"0 0 0.58 1",easeinout:"0.42 0 0.58 1"},me=".chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ul{padding-left:0;display:flex}.graph-svg-tip ol{padding-left:0;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:' ';border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}",ye=function(){function e(t,i){if(Ht(this,e),i=g(i),this.parent="string"==typeof t?document.querySelector(t):t,!(this.parent instanceof HTMLElement))throw new Error("No `parent` element to render on was provided.");this.rawChartArgs=i,this.title=i.title||"",this.type=i.type||"",this.realData=this.prepareData(i.data),this.data=this.prepareFirstData(this.realData),this.colors=this.validateColors(i.colors,this.type),this.config={showTooltip:1,showLegend:1,isNavigable:i.isNavigable||0,animate:void 0!==i.animate?i.animate:1,truncateLegends:i.truncateLegends||1},this.measures=JSON.parse(JSON.stringify(Gt));var n=this.measures;this.setMeasures(i),this.title.length||(n.titleHeight=0),this.config.showLegend||(n.legendHeight=0),this.argHeight=i.height||n.baseHeight,this.state={},this.options={},this.initTimeout=qt,this.config.isNavigable&&(this.overlays=[]),this.configure(i);}return It(e,[{key:"prepareData",value:function(t){return t}},{key:"prepareFirstData",value:function(t){return t}},{key:"validateColors",value:function(t,e){var i=[];return (t=(t||[]).concat(Qt[e])).forEach(function(t){var e=ie(t);P(e)?i.push(e):console.warn('"'+t+'" is not a valid color.');}),i}},{key:"setMeasures",value:function(){}},{key:"configure",value:function(){var t=this,e=this.argHeight;this.baseHeight=e,this.height=e-l(this.measures),this.boundDrawFn=function(){return t.draw(!0)},ResizeObserver&&(this.resizeObserver=new ResizeObserver(this.boundDrawFn),this.resizeObserver.observe(this.parent)),window.addEventListener("resize",this.boundDrawFn),window.addEventListener("orientationchange",this.boundDrawFn);}},{key:"destroy",value:function(){this.resizeObserver&&this.resizeObserver.disconnect(),window.removeEventListener("resize",this.boundDrawFn),window.removeEventListener("orientationchange",this.boundDrawFn);}},{key:"setup",value:function(){this.makeContainer(),this.updateWidth(),this.makeTooltip(),this.draw(!1,!0);}},{key:"makeContainer",value:function(){this.parent.innerHTML="";var e={inside:this.parent,className:"chart-container"};this.independentWidth&&(e.styles={width:this.independentWidth+"px"}),this.container=t.create("div",e);}},{key:"makeTooltip",value:function(){this.tip=new te({parent:this.container,colors:this.colors}),this.bindTooltip();}},{key:"bindTooltip",value:function(){}},{key:"draw",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e&&i(this.parent)||(this.updateWidth(),this.calc(e),this.makeChartArea(),this.setupComponents(),this.components.forEach(function(e){return e.setup(t.drawArea)}),this.render(this.components,!1),n&&(this.data=this.realData,setTimeout(function(){t.update(t.data);},this.initTimeout)),this.renderLegend(),this.setupNavigation(n));}},{key:"calc",value:function(){}},{key:"updateWidth",value:function(){this.baseWidth=a(this.parent),this.width=this.baseWidth-u(this.measures);}},{key:"makeChartArea",value:function(){this.svg&&this.container.removeChild(this.svg);var t=this.measures;this.svg=C(this.container,"frappe-chart chart",this.baseWidth,this.baseHeight),this.svgDefs=D(this.svg),this.title.length&&(this.titleEL=Y("title",t.margins.left,t.margins.top,this.title,{fontSize:t.titleFontSize,fill:"#666666",dy:t.titleFontSize}));var e=r(t);this.drawArea=N(this.type+"-chart chart-draw-area","translate("+o(t)+", "+e+")"),this.config.showLegend&&(e+=this.height+t.paddings.bottom,this.legendArea=N("chart-legend","translate("+o(t)+", "+e+")")),this.title.length&&this.svg.appendChild(this.titleEL),this.svg.appendChild(this.drawArea),this.config.showLegend&&this.svg.appendChild(this.legendArea),this.updateTipOffset(o(t),r(t));}},{key:"updateTipOffset",value:function(t,e){this.tip.offset={x:t,y:e};}},{key:"setupComponents",value:function(){this.components=new Map;}},{key:"update",value:function(t){t||console.error("No data to update."),this.data=this.prepareData(t),this.calc(),this.render(this.components,this.config.animate),this.renderLegend();}},{key:"render",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.components,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.config.isNavigable&&this.overlays.map(function(t){return t.parentNode.removeChild(t)});var n=[];e.forEach(function(t){n=n.concat(t.update(i));}),n.length>0?(ut(this.container,this.svg,n),setTimeout(function(){e.forEach(function(t){return t.make()}),t.updateNav();},400)):(e.forEach(function(t){return t.make()}),this.updateNav());}},{key:"updateNav",value:function(){this.config.isNavigable&&(this.makeOverlay(),this.bindUnits());}},{key:"renderLegend",value:function(){}},{key:"setupNavigation",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.config.isNavigable&&e&&(this.bindOverlay(),this.keyActions={13:this.onEnterKey.bind(this),37:this.onLeftArrow.bind(this),38:this.onUpArrow.bind(this),39:this.onRightArrow.bind(this),40:this.onDownArrow.bind(this)},document.addEventListener("keydown",function(e){n(t.container)&&(e=e||window.event,t.keyActions[e.keyCode]&&t.keyActions[e.keyCode]());}));}},{key:"makeOverlay",value:function(){}},{key:"updateOverlay",value:function(){}},{key:"bindOverlay",value:function(){}},{key:"bindUnits",value:function(){}},{key:"onLeftArrow",value:function(){}},{key:"onRightArrow",value:function(){}},{key:"onUpArrow",value:function(){}},{key:"onDownArrow",value:function(){}},{key:"onEnterKey",value:function(){}},{key:"addDataPoint",value:function(){}},{key:"removeDataPoint",value:function(){}},{key:"getDataPoint",value:function(){}},{key:"setCurrentDataPoint",value:function(){}},{key:"updateDataset",value:function(){}},{key:"export",value:function(){var t=ct(this.svg);ht(this.title||"Chart",[t]);}}]),e}(),be=function(t){function e(t,i){return Ht(this,e),Bt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i))}return Yt(e,t),It(e,[{key:"configure",value:function(t){Rt(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"configure",this).call(this,t),this.config.formatTooltipY=(t.tooltipOptions||{}).formatTooltipY,this.config.maxSlices=t.maxSlices||20,this.config.maxLegendPoints=t.maxLegendPoints||20;}},{key:"calc",value:function(){var t=this,e=this.state,i=this.config.maxSlices;e.sliceTotals=[];var n=this.data.labels.map(function(e,i){var n=0;return t.data.datasets.map(function(t){n+=t.values[i];}),[n,e]}).filter(function(t){return t[0]>=0}),a=n;if(n.length>i){n.sort(function(t,e){return e[0]-t[0]}),a=n.slice(0,i-1);var s=0;n.slice(i-1).map(function(t){s+=t[0];}),a.push([s,"Rest"]),this.colors[i-1]="grey";}e.labels=[],a.map(function(t){e.sliceTotals.push(v(t[0])),e.labels.push(t[1]);}),e.grandTotal=e.sliceTotals.reduce(function(t,e){return t+e},0),this.center={x:this.width/2,y:this.height/2};}},{key:"renderLegend",value:function(){var t=this,e=this.state;this.legendArea.textContent="",this.legendTotals=e.sliceTotals.slice(0,this.config.maxLegendPoints);var i=0,n=0;this.legendTotals.map(function(a,s){var r=150,o=Math.floor((t.width-u(t.measures))/r);t.legendTotals.length<o&&(r=t.width/t.legendTotals.length),i>o&&(i=0,n+=20);var l=r*i+5,h=t.config.truncateLegends?b(e.labels[s],r/10):e.labels[s],c=t.config.formatTooltipY?t.config.formatTooltipY(a):a,d=R(l,n,5,t.colors[s],h+": "+c,!1);t.legendArea.appendChild(d),i++;});}}]),e}(ye),xe=7,ke=1e3,we=86400,Ae=["January","February","March","April","May","June","July","August","September","October","November","December"],Pe=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Te=function(){function t(e){var i=e.layerClass,n=void 0===i?"":i,a=e.layerTransform,s=void 0===a?"":a,r=e.constants,o=e.getData,l=e.makeElements,u=e.animateElements;Ht(this,t),this.layerTransform=s,this.constants=r,this.makeElements=l,this.getData=o,this.animateElements=u,this.store=[],this.labels=[],this.layerClass=n,this.layerClass="function"==typeof this.layerClass?this.layerClass():this.layerClass,this.refresh();}return It(t,[{key:"refresh",value:function(t){this.data=t||this.getData();}},{key:"setup",value:function(t){this.layer=N(this.layerClass,this.layerTransform,t);}},{key:"make",value:function(){this.render(this.data),this.oldData=this.data;}},{key:"render",value:function(t){var e=this;this.store=this.makeElements(t),this.layer.textContent="",this.store.forEach(function(t){e.layer.appendChild(t);}),this.labels.forEach(function(t){e.layer.appendChild(t);});}},{key:"update",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.refresh();var e=[];return t&&(e=this.animateElements(this.data)||[]),e}}]),t}(),Le={donutSlices:{layerClass:"donut-slices",makeElements:function(t){return t.sliceStrings.map(function(e,i){var n=S(e,"donut-path",t.colors[i],"none",t.strokeWidth);return n.style.transition="transform .3s;",n})},animateElements:function(t){return this.store.map(function(e,i){return st(e,t.sliceStrings[i])})}},pieSlices:{layerClass:"pie-slices",makeElements:function(t){return t.sliceStrings.map(function(e,i){var n=S(e,"pie-path","none",t.colors[i]);return n.style.transition="transform .3s;",n})},animateElements:function(t){return this.store.map(function(e,i){return st(e,t.sliceStrings[i])})}},percentageBars:{layerClass:"percentage-bars",makeElements:function(t){var e=this;return t.xPositions.map(function(i,n){return F(i,0,t.widths[n],e.constants.barHeight,e.constants.barDepth,t.colors[n])})},animateElements:function(t){if(t)return []}},yAxis:{layerClass:"y axis",makeElements:function(t){var e=this;return t.positions.map(function(i,n){return U(i,t.labels[n],e.constants.width,{mode:e.constants.mode,pos:e.constants.pos,shortenNumbers:e.constants.shortenNumbers})})},animateElements:function(t){var e=t.positions,i=t.labels,n=this.oldData.positions,a=this.oldData.labels,s=y(n,e),r=Vt(s,2);n=r[0],e=r[1];var o=y(a,i),l=Vt(o,2);return a=l[0],i=l[1],this.render({positions:n,labels:i}),this.store.map(function(t,i){return tt(t,e[i],n[i])})}},xAxis:{layerClass:"x axis",makeElements:function(t){var e=this;return t.positions.map(function(i,n){return G(i,t.calcLabels[n],e.constants.height,{mode:e.constants.mode,pos:e.constants.pos})})},animateElements:function(t){var e=t.positions,i=t.calcLabels,n=this.oldData.positions,a=this.oldData.calcLabels,s=y(n,e),r=Vt(s,2);n=r[0],e=r[1];var o=y(a,i),l=Vt(o,2);return a=l[0],i=l[1],this.render({positions:n,calcLabels:i}),this.store.map(function(t,i){return Z(t,e[i],n[i])})}},yMarkers:{layerClass:"y-markers",makeElements:function(t){var e=this;return t.map(function(t){return q(t.position,t.label,e.constants.width,{labelPos:t.options.labelPos,mode:"span",lineType:"dashed"})})},animateElements:function(t){var e=y(this.oldData,t),i=Vt(e,2);this.oldData=i[0];var n=(t=i[1]).map(function(t){return t.position}),a=t.map(function(t){return t.label}),s=t.map(function(t){return t.options}),r=this.oldData.map(function(t){return t.position});return this.render(r.map(function(t,e){return {position:r[e],label:a[e],options:s[e]}})),this.store.map(function(t,e){return tt(t,n[e],r[e])})}},yRegions:{layerClass:"y-regions",makeElements:function(t){var e=this;return t.map(function(t){return X(t.startPos,t.endPos,e.constants.width,t.label,{labelPos:t.options.labelPos})})},animateElements:function(t){var e=y(this.oldData,t),i=Vt(e,2);this.oldData=i[0];var n=(t=i[1]).map(function(t){return t.endPos}),a=t.map(function(t){return t.label}),s=t.map(function(t){return t.startPos}),r=t.map(function(t){return t.options}),o=this.oldData.map(function(t){return t.endPos}),l=this.oldData.map(function(t){return t.startPos});this.render(o.map(function(t,e){return {startPos:l[e],endPos:o[e],label:a[e],options:r[e]}}));var u=[];return this.store.map(function(t,e){u=u.concat(et(t,s[e],n[e],o[e]));}),u}},heatDomain:{layerClass:function(){return "heat-domain domain-"+this.constants.index},makeElements:function(t){var e=this,i=this.constants,n=i.index,a=i.colWidth,s=i.rowHeight,r=i.squareSize,o=i.radius,l=i.xTranslate,u=0;return this.serializedSubDomains=[],t.cols.map(function(t,i){1===i&&e.labels.push(Y("domain-name",l,-12,yt(n,!0).toUpperCase(),{fontSize:9})),t.map(function(t,i){if(t.fill){var n={"data-date":t.yyyyMmDd,"data-value":t.dataValue,"data-day":i},a=H("day",l,u,r,o,t.fill,n);e.serializedSubDomains.push(a);}u+=s;}),u=0,l+=a;}),this.serializedSubDomains},animateElements:function(t){if(t)return []}},barGraph:{layerClass:function(){return "dataset-units dataset-bars dataset-"+this.constants.index},makeElements:function(t){var e=this.constants;return this.unitType="bar",this.units=t.yPositions.map(function(i,n){return J(t.xPositions[n],i,t.barWidth,e.color,t.labels[n],n,t.offsets[n],{zeroLine:t.zeroLine,barsWidth:t.barsWidth,minHeight:e.minHeight})}),this.units},animateElements:function(t){var e=t.xPositions,i=t.yPositions,n=t.offsets,a=t.labels,s=this.oldData.xPositions,r=this.oldData.yPositions,o=this.oldData.offsets,l=this.oldData.labels,u=y(s,e),h=Vt(u,2);s=h[0],e=h[1];var c=y(r,i),d=Vt(c,2);r=d[0],i=d[1];var p=y(o,n),f=Vt(p,2);o=f[0],n=f[1];var v=y(l,a),g=Vt(v,2);l=g[0],a=g[1],this.render({xPositions:s,yPositions:r,offsets:o,labels:a,zeroLine:this.oldData.zeroLine,barsWidth:this.oldData.barsWidth,barWidth:this.oldData.barWidth});var m=[];return this.store.map(function(a,s){m=m.concat(it(a,e[s],i[s],t.barWidth,n[s],{zeroLine:t.zeroLine}));}),m}},lineGraph:{layerClass:function(){return "dataset-units dataset-line dataset-"+this.constants.index},makeElements:function(t){var e=this.constants;return this.unitType="dot",this.paths={},e.hideLine||(this.paths=$(t.xPositions,t.yPositions,e.color,{heatline:e.heatline,regionFill:e.regionFill,spline:e.spline},{svgDefs:e.svgDefs,zeroLine:t.zeroLine})),this.units=[],e.hideDots||(this.units=t.yPositions.map(function(i,n){return K(t.xPositions[n],i,t.radius,e.color,e.valuesOverPoints?t.values[n]:"",n)})),Object.values(this.paths).concat(this.units)},animateElements:function(t){var e=t.xPositions,i=t.yPositions,n=t.values,a=this.oldData.xPositions,s=this.oldData.yPositions,r=this.oldData.values,o=y(a,e),l=Vt(o,2);a=l[0],e=l[1];var u=y(s,i),h=Vt(u,2);s=h[0],i=h[1];var c=y(r,n),d=Vt(c,2);r=d[0],n=d[1],this.render({xPositions:a,yPositions:s,values:n,zeroLine:this.oldData.zeroLine,radius:this.oldData.radius});var p=[];return Object.keys(this.paths).length&&(p=p.concat(at(this.paths,e,i,t.zeroLine,this.constants.spline))),this.units.length&&this.units.map(function(t,n){p=p.concat(nt(t,e[n],i[n]));}),p}}},Oe=function(t){function i(t,e){Ht(this,i);var n=Bt(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.type="percentage",n.setup(),n}return Yt(i,t),It(i,[{key:"setMeasures",value:function(t){var e=this.measures;this.barOptions=t.barOptions||{};var i=this.barOptions;i.height=i.height||20,i.depth=i.depth||Jt,e.paddings.right=30,e.legendHeight=60,e.baseHeight=8*(i.height+.5*i.depth);}},{key:"setupComponents",value:function(){var t=this.state,e=[["percentageBars",{barHeight:this.barOptions.height,barDepth:this.barOptions.depth},function(){return {xPositions:t.xPositions,widths:t.widths,colors:this.colors}}.bind(this)]];this.components=new Map(e.map(function(t){var e=wt.apply(void 0,Ut(t));return [t[0],e]}));}},{key:"calc",value:function(){var t=this;Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"calc",this).call(this);var e=this.state;e.xPositions=[],e.widths=[];var n=0;e.sliceTotals.map(function(i){var a=t.width*i/e.grandTotal;e.widths.push(a),e.xPositions.push(n),n+=a;});}},{key:"makeDataByIndex",value:function(){}},{key:"bindTooltip",value:function(){var t=this,i=this.state;this.container.addEventListener("mousemove",function(n){var a=t.components.get("percentageBars").store,s=n.target;if(a.includes(s)){var r=a.indexOf(s),o=e(t.container),l=e(s),u=l.left-o.left+parseInt(s.getAttribute("width"))/2,h=l.top-o.top,c=(t.formattedLabels&&t.formattedLabels.length>0?t.formattedLabels[r]:t.state.labels[r])+": ",d=i.sliceTotals[r]/i.grandTotal;t.tip.setValues(u,h,{name:c,value:(100*d).toFixed(1)+"%"}),t.tip.showTip();}});}}]),i}(be),Me=function(t){function i(t,e){Ht(this,i);var n=Bt(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.type="pie",n.initTimeout=0,n.init=1,n.setup(),n}return Yt(i,t),It(i,[{key:"configure",value:function(t){Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"configure",this).call(this,t),this.mouseMove=this.mouseMove.bind(this),this.mouseLeave=this.mouseLeave.bind(this),this.hoverRadio=t.hoverRadio||.1,this.config.startAngle=t.startAngle||0,this.clockWise=t.clockWise||!1;}},{key:"calc",value:function(){var t=this;Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"calc",this).call(this);var e=this.state;this.radius=this.height>this.width?this.center.x:this.center.y;var n=this.radius,a=this.clockWise,s=e.slicesProperties||[];e.sliceStrings=[],e.slicesProperties=[];var r=180-this.config.startAngle;e.sliceTotals.map(function(i,o){var l=r,u=i/e.grandTotal*360,h=u>180?1:0,c=a?-u:u,d=r+=c,f=p(l,n),v=p(d,n),g=t.init&&s[o],m=void 0,y=void 0;t.init?(m=g?g.startPosition:f,y=g?g.endPosition:f):(m=f,y=v);var b=360===u?_(m,y,t.center,t.radius,a,h):E(m,y,t.center,t.radius,a,h);e.sliceStrings.push(b),e.slicesProperties.push({startPosition:f,endPosition:v,value:i,total:e.grandTotal,startAngle:l,endAngle:d,angle:c});}),this.init=0;}},{key:"setupComponents",value:function(){var t=this.state,e=[["pieSlices",{},function(){return {sliceStrings:t.sliceStrings,colors:this.colors}}.bind(this)]];this.components=new Map(e.map(function(t){var e=wt.apply(void 0,Ut(t));return [t[0],e]}));}},{key:"calTranslateByAngle",value:function(t){var e=this.radius,i=this.hoverRadio,n=p(t.startAngle+t.angle/2,e);return "translate3d("+n.x*i+"px,"+n.y*i+"px,0)"}},{key:"hoverSlice",value:function(t,i,n,a){if(t){var s=this.colors[i];if(n){ot(t,this.calTranslateByAngle(this.state.slicesProperties[i])),t.style.fill=A(s,50);var r=e(this.svg),o=a.pageX-r.left+10,l=a.pageY-r.top-10,u=(this.formatted_labels&&this.formatted_labels.length>0?this.formatted_labels[i]:this.state.labels[i])+": ",h=(100*this.state.sliceTotals[i]/this.state.grandTotal).toFixed(1);this.tip.setValues(o,l,{name:u,value:h+"%"}),this.tip.showTip();}else ot(t,"translate3d(0,0,0)"),this.tip.hideTip(),t.style.fill=s;}}},{key:"bindTooltip",value:function(){this.container.addEventListener("mousemove",this.mouseMove),this.container.addEventListener("mouseleave",this.mouseLeave);}},{key:"mouseMove",value:function(t){var e=t.target,i=this.components.get("pieSlices").store,n=this.curActiveSliceIndex,a=this.curActiveSlice;if(i.includes(e)){var s=i.indexOf(e);this.hoverSlice(a,n,!1),this.curActiveSlice=e,this.curActiveSliceIndex=s,this.hoverSlice(e,s,!0,t);}else this.mouseLeave();}},{key:"mouseLeave",value:function(){this.hoverSlice(this.curActiveSlice,this.curActiveSliceIndex,!1);}}]),i}(be),Ce=function(t){function e(t,i){Ht(this,e);var n=Bt(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i));n.type="heatmap",n.countLabel=i.countLabel||"";var a=["Sunday","Monday"],s=a.includes(i.startSubDomain)?i.startSubDomain:"Sunday";return n.startSubDomainIndex=a.indexOf(s),n.setup(),n}return Yt(e,t),It(e,[{key:"setMeasures",value:function(t){var e=this.measures;this.discreteDomains=0===t.discreteDomains?0:1,e.paddings.top=36,e.paddings.bottom=0,e.legendHeight=24,e.baseHeight=12*xe+l(e);var i=this.data,n=this.discreteDomains?12:0;this.independentWidth=12*(vt(i.start,i.end)+n)+u(e);}},{key:"updateWidth",value:function(){var t=this.discreteDomains?12:0,e=this.state.noOfWeeks?this.state.noOfWeeks:52;this.baseWidth=12*(e+t)+u(this.measures);}},{key:"prepareData",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data;if(t.start&&t.end&&t.start>t.end)throw new Error("Start date cannot be greater than end date.");if(t.start||(t.start=new Date,t.start.setFullYear(t.start.getFullYear()-1)),t.end||(t.end=new Date),t.dataPoints=t.dataPoints||{},parseInt(Object.keys(t.dataPoints)[0])>1e5){var e={};Object.keys(t.dataPoints).forEach(function(i){var n=new Date(i*ke);e[pt(n)]=t.dataPoints[i];}),t.dataPoints=e;}return t}},{key:"calc",value:function(){var t=this.state;t.start=ft(this.data.start),t.end=ft(this.data.end),t.firstWeekStart=ft(t.start),t.noOfWeeks=vt(t.start,t.end),t.distribution=St(Object.values(this.data.dataPoints),5),t.domainConfigs=this.getDomains();}},{key:"setupComponents",value:function(){var t=this,e=this.state,i=this.discreteDomains?0:1,n=e.domainConfigs.map(function(n,a){return ["heatDomain",{index:n.index,colWidth:12,rowHeight:12,squareSize:10,radius:t.rawChartArgs.radius||0,xTranslate:12*e.domainConfigs.filter(function(t,e){return e<a}).map(function(t){return t.cols.length-i}).reduce(function(t,e){return t+e},0)},function(){return e.domainConfigs[a]}.bind(t)]});this.components=new Map(n.map(function(t,e){var i=wt.apply(void 0,Ut(t));return [t[0]+"-"+e,i]}));var a=0;Pe.forEach(function(e,i){if([1,3,5].includes(i)){var n=Y("subdomain-name",-6,a,e,{fontSize:10,dy:8,textAnchor:"end"});t.drawArea.appendChild(n);}a+=12;});}},{key:"update",value:function(t){t||console.error("No data to update."),this.data=this.prepareData(t),this.draw(),this.bindTooltip();}},{key:"bindTooltip",value:function(){var t=this;this.container.addEventListener("mousemove",function(e){t.components.forEach(function(i){var n=i.store,a=e.target;if(n.includes(a)){var s=a.getAttribute("data-value"),r=a.getAttribute("data-date").split("-"),o=yt(parseInt(r[1])-1,!0),l=t.container.getBoundingClientRect(),u=a.getBoundingClientRect(),h=parseInt(e.target.getAttribute("width")),c=u.left-l.left+h/2,d=u.top-l.top,p=s+" "+t.countLabel,f=" on "+o+" "+r[0]+", "+r[2];t.tip.setValues(c,d,{name:f,value:p,valueFirst:1},[]),t.tip.showTip();}});});}},{key:"renderLegend",value:function(){var t=this;this.legendArea.textContent="";var e=0,i=this.rawChartArgs.radius||0,n=Y("subdomain-name",e,12,"Less",{fontSize:11,dy:9});e=30,this.legendArea.appendChild(n),this.colors.slice(0,5).map(function(n,a){var s=H("heatmap-legend-unit",e+15*a,12,10,i,n);t.legendArea.appendChild(s);});var a=Y("subdomain-name",e+75+3,12,"More",{fontSize:11,dy:9});this.legendArea.appendChild(a);}},{key:"getDomains",value:function(){for(var t=this.state,e=[t.start.getMonth(),t.start.getFullYear()],i=e[0],n=e[1],a=[t.end.getMonth(),t.end.getFullYear()],s=a[0]-i+1+12*(a[1]-n),r=[],o=ft(t.start),l=0;l<s;l++){var u=t.end;if(!mt(o,t.end)){var h=[o.getMonth(),o.getFullYear()];u=bt(h[0],h[1]);}r.push(this.getDomainConfig(o,u)),kt(u,1),o=u;}return r}},{key:"getDomainConfig",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=[t.getMonth(),t.getFullYear()],n=i[0],a=i[1],s=xt(t),r={index:n,cols:[]};kt(e=ft(e)||bt(n,a),1);for(var o=vt(s,e),l=[],u=void 0,h=0;h<o;h++)u=this.getCol(s,n),l.push(u),kt(s=new Date(u[xe-1].yyyyMmDd),1);return void 0!==u[xe-1].dataValue&&(kt(s,1),l.push(this.getCol(s,n,!0))),r.cols=l,r}},{key:"getCol",value:function(t,e){for(var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=this.state,a=ft(t),s=[],r=0;r<xe;r++,kt(a,1)){var o={},l=a>=n.start&&a<=n.end;i||a.getMonth()!==e||!l?o.yyyyMmDd=pt(a):o=this.getSubDomainConfig(a),s.push(o);}return s}},{key:"getSubDomainConfig",value:function(t){var e=pt(t),i=this.data.dataPoints[e];return {yyyyMmDd:e,dataValue:i||0,fill:this.colors[Et(i,this.state.distribution)]}}}]),e}(ye),De=function(t){function i(t,e){Ht(this,i);var n=Bt(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.barOptions=e.barOptions||{},n.lineOptions=e.lineOptions||{},n.type=e.type||"line",n.init=1,n.setup(),n}return Yt(i,t),It(i,[{key:"setMeasures",value:function(){this.data.datasets.length<=1&&(this.config.showLegend=0,this.measures.paddings.bottom=30);}},{key:"configure",value:function(t){Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"configure",this).call(this,t),t.axisOptions=t.axisOptions||{},t.tooltipOptions=t.tooltipOptions||{},this.config.xAxisMode=t.axisOptions.xAxisMode||"span",this.config.yAxisMode=t.axisOptions.yAxisMode||"span",this.config.xIsSeries=t.axisOptions.xIsSeries||0,this.config.shortenYAxisNumbers=t.axisOptions.shortenYAxisNumbers||0,this.config.formatTooltipX=t.tooltipOptions.formatTooltipX,this.config.formatTooltipY=t.tooltipOptions.formatTooltipY,this.config.valuesOverPoints=t.valuesOverPoints;}},{key:"prepareData",value:function(){return _t(arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data,this.type)}},{key:"prepareFirstData",value:function(){return zt(arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data)}},{key:"calc",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.calcXPositions(),t||this.calcYAxisParameters(this.getAllYValues(),"line"===this.type),this.makeDataByIndex();}},{key:"calcXPositions",value:function(){var t=this.state,e=this.data.labels;t.datasetLength=e.length,t.unitWidth=this.width/t.datasetLength,t.xOffset=t.unitWidth/2,t.xAxis={labels:e,positions:e.map(function(e,i){return h(t.xOffset+i*t.unitWidth)})};}},{key:"calcYAxisParameters",value:function(t){var e=Lt(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"false"),i=this.height/Ct(e),n=Mt(e)*i,a=this.height-Ot(e)*n;this.state.yAxis={labels:e,positions:e.map(function(t){return a-t*i}),scaleMultiplier:i,zeroLine:a},this.calcDatasetPoints(),this.calcYExtremes(),this.calcYRegions();}},{key:"calcDatasetPoints",value:function(){var t=this.state,e=function(e){return e.map(function(e){return Dt(e,t.yAxis)})};t.datasets=this.data.datasets.map(function(t,i){var n=t.values,a=t.cumulativeYs||[];return {name:t.name&&t.name.replace(/<|>|&/g,function(t){return "&"==t?"&amp;":"<"==t?"&lt;":"&gt;"}),index:i,chartType:t.chartType,values:n,yPositions:e(n),cumulativeYs:a,cumulativeYPos:e(a)}});}},{key:"calcYExtremes",value:function(){var t=this.state;if(this.barOptions.stacked)return void(t.yExtremes=t.datasets[t.datasets.length-1].cumulativeYPos);t.yExtremes=new Array(t.datasetLength).fill(9999),t.datasets.map(function(e){e.yPositions.map(function(e,i){e<t.yExtremes[i]&&(t.yExtremes[i]=e);});});}},{key:"calcYRegions",value:function(){var t=this.state;this.data.yMarkers&&(this.state.yMarkers=this.data.yMarkers.map(function(e){return e.position=Dt(e.value,t.yAxis),e.options||(e.options={}),e})),this.data.yRegions&&(this.state.yRegions=this.data.yRegions.map(function(e){return e.startPos=Dt(e.start,t.yAxis),e.endPos=Dt(e.end,t.yAxis),e.options||(e.options={}),e}));}},{key:"getAllYValues",value:function(){var t,e=this,i="values";if(this.barOptions.stacked){i="cumulativeYs";var n=new Array(this.state.datasetLength).fill(0);this.data.datasets.map(function(t,a){var s=e.data.datasets[a].values;t[i]=n=n.map(function(t,e){return t+s[e]});});}var a=this.data.datasets.map(function(t){return t[i]});return this.data.yMarkers&&a.push(this.data.yMarkers.map(function(t){return t.value})),this.data.yRegions&&this.data.yRegions.map(function(t){a.push([t.end,t.start]);}),(t=[]).concat.apply(t,Ut(a))}},{key:"setupComponents",value:function(){var t=this,e=[["yAxis",{mode:this.config.yAxisMode,width:this.width,shortenNumbers:this.config.shortenYAxisNumbers},function(){return this.state.yAxis}.bind(this)],["xAxis",{mode:this.config.xAxisMode,height:this.height},function(){var t=this.state;return t.xAxis.calcLabels=Wt(this.width,t.xAxis.labels,this.config.xIsSeries),t.xAxis}.bind(this)],["yRegions",{width:this.width,pos:"right"},function(){return this.state.yRegions}.bind(this)]],i=this.state.datasets.filter(function(t){return "bar"===t.chartType}),n=this.state.datasets.filter(function(t){return "line"===t.chartType}),a=i.map(function(e){var n=e.index;return ["barGraph-"+e.index,{index:n,color:t.colors[n],stacked:t.barOptions.stacked,valuesOverPoints:t.config.valuesOverPoints,minHeight:0*t.height},function(){var t=this.state,e=t.datasets[n],a=this.barOptions.stacked,s=this.barOptions.spaceRatio||.5,r=t.unitWidth*(1-s),o=r/(a?1:i.length),l=t.xAxis.positions.map(function(t){return t-r/2});a||(l=l.map(function(t){return t+o*n}));var u=new Array(t.datasetLength).fill("");this.config.valuesOverPoints&&(u=a&&e.index===t.datasets.length-1?e.cumulativeYs:e.values);var h=new Array(t.datasetLength).fill(0);return a&&(h=e.yPositions.map(function(t,i){return t-e.cumulativeYPos[i]})),{xPositions:l,yPositions:e.yPositions,offsets:h,labels:u,zeroLine:t.yAxis.zeroLine,barsWidth:r,barWidth:o}}.bind(t)]}),s=n.map(function(e){var i=e.index;return ["lineGraph-"+e.index,{index:i,color:t.colors[i],svgDefs:t.svgDefs,heatline:t.lineOptions.heatline,regionFill:t.lineOptions.regionFill,spline:t.lineOptions.spline,hideDots:t.lineOptions.hideDots,hideLine:t.lineOptions.hideLine,valuesOverPoints:t.config.valuesOverPoints},function(){var t=this.state,e=t.datasets[i],n=t.yAxis.positions[0]<t.yAxis.zeroLine?t.yAxis.positions[0]:t.yAxis.zeroLine;return {xPositions:t.xAxis.positions,yPositions:e.yPositions,values:e.values,zeroLine:n,radius:this.lineOptions.dotSize||4}}.bind(t)]}),r=[["yMarkers",{width:this.width,pos:"right"},function(){return this.state.yMarkers}.bind(this)]];e=e.concat(a,s,r);var o=["yMarkers","yRegions"];this.dataUnitComponents=[],this.components=new Map(e.filter(function(e){return !o.includes(e[0])||t.state[e[0]]}).map(function(e){var i=wt.apply(void 0,Ut(e));return (e[0].includes("lineGraph")||e[0].includes("barGraph"))&&t.dataUnitComponents.push(i),[e[0],i]}));}},{key:"makeDataByIndex",value:function(){var t=this;this.dataByIndex={};var e=this.state,i=this.config.formatTooltipX,n=this.config.formatTooltipY;e.xAxis.labels.map(function(a,s){var r=t.state.datasets.map(function(e,i){var a=e.values[s];return {title:e.name,value:a,yPos:e.yPositions[s],color:t.colors[i],formatted:n?n(a):a}});t.dataByIndex[s]={label:a,formattedLabel:i?i(a):a,xPos:e.xAxis.positions[s],values:r,yExtreme:e.yExtremes[s]};});}},{key:"bindTooltip",value:function(){var t=this;this.container.addEventListener("mousemove",function(i){var n=t.measures,a=e(t.container),s=i.pageX-a.left-o(n),l=i.pageY-a.top;l<t.height+r(n)&&l>r(n)?t.mapTooltipXPosition(s):t.tip.hideTip();});}},{key:"mapTooltipXPosition",value:function(t){var e=this.state;if(e.yExtremes){var i=Nt(t,e.xAxis.positions,!0);if(i>=0){var n=this.dataByIndex[i];this.tip.setValues(n.xPos+this.tip.offset.x,n.yExtreme+this.tip.offset.y,{name:n.formattedLabel,value:""},n.values,i),this.tip.showTip();}}}},{key:"renderLegend",value:function(){var t=this,e=this.data;e.datasets.length>1&&(this.legendArea.textContent="",e.datasets.map(function(e,i){var n=I(100*i,"0",100,t.colors[i],e.name,t.config.truncateLegends);t.legendArea.appendChild(n);}));}},{key:"makeOverlay",value:function(){var t=this;if(this.init)return void(this.init=0);this.overlayGuides&&this.overlayGuides.forEach(function(t){var e=t.overlay;e.parentNode.removeChild(e);}),this.overlayGuides=this.dataUnitComponents.map(function(t){return {type:t.unitType,overlay:void 0,units:t.units}}),void 0===this.state.currentIndex&&(this.state.currentIndex=this.state.datasetLength-1),this.overlayGuides.map(function(e){var i=e.units[t.state.currentIndex];e.overlay=ue[e.type](i),t.drawArea.appendChild(e.overlay);});}},{key:"updateOverlayGuides",value:function(){this.overlayGuides&&this.overlayGuides.forEach(function(t){var e=t.overlay;e.parentNode.removeChild(e);});}},{key:"bindOverlay",value:function(){var t=this;this.parent.addEventListener("data-select",function(){t.updateOverlay();});}},{key:"bindUnits",value:function(){var t=this;this.dataUnitComponents.map(function(e){e.units.map(function(e){e.addEventListener("click",function(){var i=e.getAttribute("data-point-index");t.setCurrentDataPoint(i);});});}),this.tip.container.addEventListener("click",function(){var e=t.tip.container.getAttribute("data-point-index");t.setCurrentDataPoint(e);});}},{key:"updateOverlay",value:function(){var t=this;this.overlayGuides.map(function(e){var i=e.units[t.state.currentIndex];he[e.type](i,e.overlay);});}},{key:"onLeftArrow",value:function(){this.setCurrentDataPoint(this.state.currentIndex-1);}},{key:"onRightArrow",value:function(){this.setCurrentDataPoint(this.state.currentIndex+1);}},{key:"getDataPoint",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.state.currentIndex,e=this.state;return {index:t,label:e.xAxis.labels[t],values:e.datasets.map(function(e){return e.values[t]})}}},{key:"setCurrentDataPoint",value:function(t){var e=this.state;(t=parseInt(t))<0&&(t=0),t>=e.xAxis.labels.length&&(t=e.xAxis.labels.length-1),t!==e.currentIndex&&(e.currentIndex=t,s(this.parent,"data-select",this.getDataPoint()));}},{key:"addDataPoint",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.state.datasetLength;Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"addDataPoint",this).call(this,t,e,n),this.data.labels.splice(n,0,t),this.data.datasets.map(function(t,i){t.values.splice(n,0,e[i]);}),this.update(this.data);}},{key:"removeDataPoint",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.state.datasetLength-1;this.data.labels.length<=1||(Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"removeDataPoint",this).call(this,t),this.data.labels.splice(t,1),this.data.datasets.map(function(e){e.values.splice(t,1);}),this.update(this.data));}},{key:"updateDataset",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.data.datasets[e].values=t,this.update(this.data);}},{key:"updateDatasets",value:function(t){this.data.datasets.map(function(e,i){t[i]&&(e.values=t[i]);}),this.update(this.data);}}]),i}(ye),Ne=function(t){function i(t,e){Ht(this,i);var n=Bt(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.type="donut",n.initTimeout=0,n.init=1,n.setup(),n}return Yt(i,t),It(i,[{key:"configure",value:function(t){Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"configure",this).call(this,t),this.mouseMove=this.mouseMove.bind(this),this.mouseLeave=this.mouseLeave.bind(this),this.hoverRadio=t.hoverRadio||.1,this.config.startAngle=t.startAngle||0,this.clockWise=t.clockWise||!1,this.strokeWidth=t.strokeWidth||30;}},{key:"calc",value:function(){var t=this;Rt(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),"calc",this).call(this);var e=this.state;this.radius=this.height>this.width?this.center.x-this.strokeWidth/2:this.center.y-this.strokeWidth/2;var n=this.radius,a=this.clockWise,s=e.slicesProperties||[];e.sliceStrings=[],e.slicesProperties=[];var r=180-this.config.startAngle;e.sliceTotals.map(function(i,o){var l=r,u=i/e.grandTotal*360,h=u>180?1:0,c=a?-u:u,d=r+=c,f=p(l,n),v=p(d,n),g=t.init&&s[o],m=void 0,y=void 0;t.init?(m=g?g.startPosition:f,y=g?g.endPosition:f):(m=f,y=v);var b=360===u?W(m,y,t.center,t.radius,t.clockWise,h):z(m,y,t.center,t.radius,t.clockWise,h);e.sliceStrings.push(b),e.slicesProperties.push({startPosition:f,endPosition:v,value:i,total:e.grandTotal,startAngle:l,endAngle:d,angle:c});}),this.init=0;}},{key:"setupComponents",value:function(){var t=this.state,e=[["donutSlices",{},function(){return {sliceStrings:t.sliceStrings,colors:this.colors,strokeWidth:this.strokeWidth}}.bind(this)]];this.components=new Map(e.map(function(t){var e=wt.apply(void 0,Ut(t));return [t[0],e]}));}},{key:"calTranslateByAngle",value:function(t){var e=this.radius,i=this.hoverRadio,n=p(t.startAngle+t.angle/2,e);return "translate3d("+n.x*i+"px,"+n.y*i+"px,0)"}},{key:"hoverSlice",value:function(t,i,n,a){if(t){var s=this.colors[i];if(n){ot(t,this.calTranslateByAngle(this.state.slicesProperties[i])),t.style.stroke=A(s,50);var r=e(this.svg),o=a.pageX-r.left+10,l=a.pageY-r.top-10,u=(this.formatted_labels&&this.formatted_labels.length>0?this.formatted_labels[i]:this.state.labels[i])+": ",h=(100*this.state.sliceTotals[i]/this.state.grandTotal).toFixed(1);this.tip.setValues(o,l,{name:u,value:h+"%"}),this.tip.showTip();}else ot(t,"translate3d(0,0,0)"),this.tip.hideTip(),t.style.stroke=s;}}},{key:"bindTooltip",value:function(){this.container.addEventListener("mousemove",this.mouseMove),this.container.addEventListener("mouseleave",this.mouseLeave);}},{key:"mouseMove",value:function(t){var e=t.target,i=this.components.get("donutSlices").store,n=this.curActiveSliceIndex,a=this.curActiveSlice;if(i.includes(e)){var s=i.indexOf(e);this.hoverSlice(a,n,!1),this.curActiveSlice=e,this.curActiveSliceIndex=s,this.hoverSlice(e,s,!0,t);}else this.mouseLeave();}},{key:"mouseLeave",value:function(){this.hoverSlice(this.curActiveSlice,this.curActiveSliceIndex,!1);}}]),i}(be),Se={bar:De,line:De,percentage:Oe,heatmap:Ce,pie:Me,donut:Ne},Ee=function t(e,i){return Ht(this,t),jt(i.type,e,i)},_e=Object.freeze({Chart:Ee,PercentageChart:Oe,PieChart:Me,Heatmap:Ce,AxisChart:De}),ze={};return ze.NAME="Frappe Charts",ze.VERSION="1.6.2",ze=Object.assign({},ze,_e)});

    });

    /* node_modules/svelte-frappe-charts/src/components/base.svelte generated by Svelte v3.44.3 */
    const file$a = "node_modules/svelte-frappe-charts/src/components/base.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$a, 91, 0, 2116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[19](div);

    			if (!mounted) {
    				dispose = listen_dev(div, "data-select", /*data_select_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[19](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Base', slots, []);

    	let { data = {
    		labels: [],
    		datasets: [{ values: [] }],
    		yMarkers: {},
    		yRegions: []
    	} } = $$props;

    	let { title = '' } = $$props;
    	let { type = 'line' } = $$props;
    	let { height = 300 } = $$props;
    	let { animate = true } = $$props;
    	let { axisOptions = {} } = $$props;
    	let { barOptions = {} } = $$props;
    	let { lineOptions = {} } = $$props;
    	let { tooltipOptions = {} } = $$props;
    	let { colors = [] } = $$props;
    	let { valuesOverPoints = 0 } = $$props;
    	let { isNavigable = false } = $$props;
    	let { maxSlices = 3 } = $$props;
    	let { fontSize = 16 } = $$props;

    	/**
     *  COMPONENT
     */
    	//  The Chart returned from frappe
    	let chart = null;

    	//  DOM node for frappe to latch onto
    	let chartRef;

    	//  Helper HOF for calling a fn only if chart exists
    	function ifChartThen(fn) {
    		return function ifChart(...args) {
    			if (chart) {
    				return fn(...args);
    			}
    		};
    	}

    	const addDataPoint = ifChartThen((label, valueFromEachDataset, index) => chart.addDataPoint(label, valueFromEachDataset, index));
    	const removeDataPoint = ifChartThen(index => chart.removeDataPoint(index));
    	const exportChart = ifChartThen(() => chart.export());

    	//  Update the chart when incoming data changes
    	const updateChart = ifChartThen(newData => chart.update(newData));

    	/**
     *  Handle initializing the chart when this Svelte component mounts
     */
    	onMount(() => {
    		chart = new frappeCharts_min_umd.Chart(chartRef,
    		{
    				data,
    				title,
    				type,
    				height,
    				animate,
    				colors,
    				axisOptions,
    				barOptions,
    				lineOptions,
    				tooltipOptions,
    				valuesOverPoints,
    				isNavigable,
    				maxSlices,
    				fontSize
    			});
    	});

    	//  Mark Chart references for garbage collection when component is unmounted
    	onDestroy(() => {
    		chart = null;
    	});

    	const writable_props = [
    		'data',
    		'title',
    		'type',
    		'height',
    		'animate',
    		'axisOptions',
    		'barOptions',
    		'lineOptions',
    		'tooltipOptions',
    		'colors',
    		'valuesOverPoints',
    		'isNavigable',
    		'maxSlices',
    		'fontSize'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Base> was created with unknown prop '${key}'`);
    	});

    	function data_select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chartRef = $$value;
    			$$invalidate(0, chartRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('axisOptions' in $$props) $$invalidate(6, axisOptions = $$props.axisOptions);
    		if ('barOptions' in $$props) $$invalidate(7, barOptions = $$props.barOptions);
    		if ('lineOptions' in $$props) $$invalidate(8, lineOptions = $$props.lineOptions);
    		if ('tooltipOptions' in $$props) $$invalidate(9, tooltipOptions = $$props.tooltipOptions);
    		if ('colors' in $$props) $$invalidate(10, colors = $$props.colors);
    		if ('valuesOverPoints' in $$props) $$invalidate(11, valuesOverPoints = $$props.valuesOverPoints);
    		if ('isNavigable' in $$props) $$invalidate(12, isNavigable = $$props.isNavigable);
    		if ('maxSlices' in $$props) $$invalidate(13, maxSlices = $$props.maxSlices);
    		if ('fontSize' in $$props) $$invalidate(14, fontSize = $$props.fontSize);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		Chart: frappeCharts_min_umd.Chart,
    		data,
    		title,
    		type,
    		height,
    		animate,
    		axisOptions,
    		barOptions,
    		lineOptions,
    		tooltipOptions,
    		colors,
    		valuesOverPoints,
    		isNavigable,
    		maxSlices,
    		fontSize,
    		chart,
    		chartRef,
    		ifChartThen,
    		addDataPoint,
    		removeDataPoint,
    		exportChart,
    		updateChart
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('axisOptions' in $$props) $$invalidate(6, axisOptions = $$props.axisOptions);
    		if ('barOptions' in $$props) $$invalidate(7, barOptions = $$props.barOptions);
    		if ('lineOptions' in $$props) $$invalidate(8, lineOptions = $$props.lineOptions);
    		if ('tooltipOptions' in $$props) $$invalidate(9, tooltipOptions = $$props.tooltipOptions);
    		if ('colors' in $$props) $$invalidate(10, colors = $$props.colors);
    		if ('valuesOverPoints' in $$props) $$invalidate(11, valuesOverPoints = $$props.valuesOverPoints);
    		if ('isNavigable' in $$props) $$invalidate(12, isNavigable = $$props.isNavigable);
    		if ('maxSlices' in $$props) $$invalidate(13, maxSlices = $$props.maxSlices);
    		if ('fontSize' in $$props) $$invalidate(14, fontSize = $$props.fontSize);
    		if ('chart' in $$props) chart = $$props.chart;
    		if ('chartRef' in $$props) $$invalidate(0, chartRef = $$props.chartRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			updateChart(data);
    		}
    	};

    	return [
    		chartRef,
    		data,
    		title,
    		type,
    		height,
    		animate,
    		axisOptions,
    		barOptions,
    		lineOptions,
    		tooltipOptions,
    		colors,
    		valuesOverPoints,
    		isNavigable,
    		maxSlices,
    		fontSize,
    		addDataPoint,
    		removeDataPoint,
    		exportChart,
    		data_select_handler,
    		div_binding
    	];
    }

    class Base extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			data: 1,
    			title: 2,
    			type: 3,
    			height: 4,
    			animate: 5,
    			axisOptions: 6,
    			barOptions: 7,
    			lineOptions: 8,
    			tooltipOptions: 9,
    			colors: 10,
    			valuesOverPoints: 11,
    			isNavigable: 12,
    			maxSlices: 13,
    			fontSize: 14,
    			addDataPoint: 15,
    			removeDataPoint: 16,
    			exportChart: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Base",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get data() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animate() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animate(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get axisOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set axisOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get barOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valuesOverPoints() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valuesOverPoints(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isNavigable() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isNavigable(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSlices() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSlices(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addDataPoint() {
    		return this.$$.ctx[15];
    	}

    	set addDataPoint(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeDataPoint() {
    		return this.$$.ctx[16];
    	}

    	set removeDataPoint(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exportChart() {
    		return this.$$.ctx[17];
    	}

    	set exportChart(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Base$1 = Base;

    /* src/Tokenomics.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$9 = "src/Tokenomics.svelte";

    function create_fragment$9(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let div2;
    	let img;
    	let img_src_value;
    	let t4;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t5;
    	let div3;
    	let ul;
    	let li0;
    	let span0;
    	let t7;
    	let li1;
    	let span1;
    	let t9;
    	let li2;
    	let span2;
    	let t11;
    	let li3;
    	let span3;
    	let t13;
    	let li4;
    	let span4;
    	let t15;
    	let li5;
    	let span5;
    	let t17;
    	let div5;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "100,000,000 Tokens";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    			t3 = space();
    			div2 = element("div");
    			img = element("img");
    			t4 = space();
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t5 = space();
    			div3 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Team 10%";
    			t7 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Advisors & Partners 10%";
    			t9 = space();
    			li2 = element("li");
    			span2 = element("span");
    			span2.textContent = "Private Sale 15%";
    			t11 = space();
    			li3 = element("li");
    			span3 = element("span");
    			span3.textContent = "Public Sale 20%";
    			t13 = space();
    			li4 = element("li");
    			span4 = element("span");
    			span4.textContent = "Liquidity Pool 15%";
    			t15 = space();
    			li5 = element("li");
    			span5 = element("span");
    			span5.textContent = "Foundation 30%";
    			t17 = space();
    			div5 = element("div");
    			add_location(h2, file$9, 3, 12, 131);
    			add_location(p, file$9, 4, 12, 171);
    			set_style(div0, "align-self", "center");
    			add_location(div0, file$9, 2, 8, 87);
    			set_style(div1, "width", "30%");
    			set_style(div1, "display", "flex");
    			add_location(div1, file$9, 1, 4, 39);
    			attr_dev(img, "id", "coin");
    			if (!src_url_equal(img.src, img_src_value = "images/coin.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1rxan2x");
    			add_location(img, file$9, 8, 8, 476);
    			attr_dev(path0, "id", "0");
    			attr_dev(path0, "class", "test svelte-1rxan2x");
    			attr_dev(path0, "fill", "#ffffff");
    			attr_dev(path0, "d", "M150, 0 A150,150 0 0 1 234.49594861401022,26.062779328328688 L206.33063240934013,67.3751862188858 A100,100 0 0 0 150,50 Z");
    			add_location(path0, file$9, 10, 12, 611);
    			attr_dev(path1, "id", "1");
    			attr_dev(path1, "fill", "#8a2be2");
    			attr_dev(path1, "d", "M234.49594861401022, 26.062779328328688 A150,150 0 0 1 289.62924038982374,95.19420442908603 L243.0861602598825,113.46280295272402 A100,100 0 0 0 206.33063240934013,67.3751862188858 Z");
    			attr_dev(path1, "class", "svelte-1rxan2x");
    			add_location(path1, file$9, 11, 12, 798);
    			attr_dev(path2, "id", "2");
    			attr_dev(path2, "fill", "#FF3333");
    			attr_dev(path2, "d", "M289.62924038982374, 95.19420442908603 A150,150 0 0 1 279.9081736709546,224.99244237572935 L236.60544911396977,199.99496158381956 A100,100 0 0 0 243.0861602598825,113.46280295272402 Z");
    			attr_dev(path2, "class", "svelte-1rxan2x");
    			add_location(path2, file$9, 12, 12, 1033);
    			attr_dev(path3, "id", "3");
    			attr_dev(path3, "fill", "#FFDD33");
    			attr_dev(path3, "d", "M279.9081736709546, 224.99244237572935 A150,150 0 0 1 127.65722030200284,298.32666717541645 L135.10481353466855,248.88444478361097 A100,100 0 0 0 236.60544911396977,199.99496158381956 Z");
    			attr_dev(path3, "class", "svelte-1rxan2x");
    			add_location(path3, file$9, 13, 12, 1269);
    			attr_dev(path4, "id", "4");
    			attr_dev(path4, "fill", "#4dFFFF");
    			attr_dev(path4, "d", "M127.65722030200284, 298.32666717541645 A150,150 0 0 1 3.7649754408533056,183.39637094334898 L52.50998362723553,172.26424729556598 A100,100 0 0 0 135.10481353466855,248.88444478361097 Z");
    			attr_dev(path4, "class", "svelte-1rxan2x");
    			add_location(path4, file$9, 14, 12, 1507);
    			attr_dev(path5, "id", "5");
    			attr_dev(path5, "fill", "#004D0D");
    			attr_dev(path5, "d", "M3.7649754408533056, 183.39637094334898 A150,150 0 0 1 149.97382006135282,0.000002284630625126738 L149.98254670756856,50.00000152308709 A100,100 0 0 0 52.50998362723553,172.26424729556598 Z");
    			attr_dev(path5, "class", "svelte-1rxan2x");
    			add_location(path5, file$9, 15, 12, 1745);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "id", "sv");
    			attr_dev(svg, "viewBox", "-50 -50 400 400");
    			add_location(svg, file$9, 9, 8, 524);
    			attr_dev(div2, "class", "svg-container svelte-1rxan2x");
    			add_location(div2, file$9, 7, 4, 440);
    			attr_dev(span0, "class", "svelte-1rxan2x");
    			add_location(span0, file$9, 30, 62, 4978);
    			attr_dev(li0, "class", "team svelte-1rxan2x");
    			toggle_class(li0, "highlight", /*selected*/ ctx[0] === 0);
    			add_location(li0, file$9, 30, 12, 4928);
    			attr_dev(span1, "class", "svelte-1rxan2x");
    			add_location(span1, file$9, 31, 66, 5071);
    			attr_dev(li1, "class", "advisors svelte-1rxan2x");
    			toggle_class(li1, "highlight", /*selected*/ ctx[0] === 1);
    			add_location(li1, file$9, 31, 12, 5017);
    			attr_dev(span2, "class", "svelte-1rxan2x");
    			add_location(span2, file$9, 32, 65, 5178);
    			attr_dev(li2, "class", "private svelte-1rxan2x");
    			toggle_class(li2, "highlight", /*selected*/ ctx[0] === 2);
    			add_location(li2, file$9, 32, 12, 5125);
    			attr_dev(span3, "class", "svelte-1rxan2x");
    			add_location(span3, file$9, 33, 64, 5277);
    			attr_dev(li3, "class", "public svelte-1rxan2x");
    			toggle_class(li3, "highlight", /*selected*/ ctx[0] === 4);
    			add_location(li3, file$9, 33, 12, 5225);
    			attr_dev(span4, "class", "svelte-1rxan2x");
    			add_location(span4, file$9, 34, 67, 5378);
    			attr_dev(li4, "class", "liquidity svelte-1rxan2x");
    			toggle_class(li4, "highlight", /*selected*/ ctx[0] === 5);
    			add_location(li4, file$9, 34, 12, 5323);
    			attr_dev(span5, "class", "svelte-1rxan2x");
    			add_location(span5, file$9, 35, 68, 5483);
    			attr_dev(li5, "class", "foundation svelte-1rxan2x");
    			toggle_class(li5, "highlight", /*selected*/ ctx[0] === 6);
    			add_location(li5, file$9, 35, 12, 5427);
    			set_style(ul, "align-self", "center");
    			attr_dev(ul, "class", "svelte-1rxan2x");
    			add_location(ul, file$9, 29, 8, 4884);
    			attr_dev(div3, "class", "list svelte-1rxan2x");
    			set_style(div3, "width", "30%");
    			set_style(div3, "display", "flex");
    			add_location(div3, file$9, 28, 4, 4824);
    			attr_dev(div4, "class", "tokenomics-container svelte-1rxan2x");
    			add_location(div4, file$9, 0, 0, 0);
    			attr_dev(div5, "id", "tooltip");
    			attr_dev(div5, "display", "none");
    			set_style(div5, "position", "absolute");
    			set_style(div5, "display", "none");
    			attr_dev(div5, "class", "svelte-1rxan2x");
    			add_location(div5, file$9, 39, 0, 5548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, img);
    			append_dev(div2, t4);
    			append_dev(div2, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(li2, span2);
    			append_dev(ul, t11);
    			append_dev(ul, li3);
    			append_dev(li3, span3);
    			append_dev(ul, t13);
    			append_dev(ul, li4);
    			append_dev(li4, span4);
    			append_dev(ul, t15);
    			append_dev(ul, li5);
    			append_dev(li5, span5);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div5, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected*/ 1) {
    				toggle_class(li0, "highlight", /*selected*/ ctx[0] === 0);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li1, "highlight", /*selected*/ ctx[0] === 1);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li2, "highlight", /*selected*/ ctx[0] === 2);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li3, "highlight", /*selected*/ ctx[0] === 4);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li4, "highlight", /*selected*/ ctx[0] === 5);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li5, "highlight", /*selected*/ ctx[0] === 6);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function showTooltip(evt, text) {
    	let tooltip = document.getElementById("tooltip");
    	tooltip.innerHTML = evt.target.dataset.value;
    	tooltip.style.display = "block";
    	tooltip.style.left = evt.pageX + 15 + 'px';
    	tooltip.style.top = evt.pageY - 20 + 'px';
    }

    function hideTooltip() {
    	var tooltip = document.getElementById("tooltip");
    	tooltip.style.display = "none";
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tokenomics', slots, []);
    	let selected;

    	function bringToFront(e) {
    		$$invalidate(0, selected = Number(e.target.id));
    		console.log(e.target.id);
    		e.target.parentNode.appendChild(e.target);
    	}

    	function deselect() {
    		$$invalidate(0, selected = null);
    		hideTooltip();
    	}

    	let data = {
    		labels: [
    			'Team',
    			'Advisors',
    			'Foundation',
    			'Seed Sale',
    			'Private Sale',
    			'Public Sale',
    			'Liquidity Pool'
    		],
    		datasets: [
    			{
    				name: "Test",
    				values: [10, 5, 10, 10, 10, 15, 40]
    			}
    		]
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Tokenomics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		showTooltip,
    		hideTooltip,
    		selected,
    		Chart: Base$1,
    		bringToFront,
    		deselect,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('data' in $$props) data = $$props.data;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected];
    }

    class Tokenomics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tokenomics",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Challenge.svelte generated by Svelte v3.44.3 */

    const file$8 = "src/Challenge.svelte";

    function create_fragment$8(ctx) {
    	let div19;
    	let div4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let p0;
    	let span0;
    	let br0;
    	let t2;
    	let t3;
    	let p1;
    	let span1;
    	let br1;
    	let t5;
    	let t6;
    	let p2;
    	let span2;
    	let br2;
    	let t8;
    	let t9;
    	let p3;
    	let span3;
    	let br3;
    	let t11;
    	let t12;
    	let p4;
    	let span4;
    	let br4;
    	let t14;
    	let t15;
    	let div3;
    	let div2;
    	let h30;
    	let t17;
    	let p5;
    	let t18;
    	let span5;
    	let t20;
    	let t21;
    	let div9;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t22;
    	let div6;
    	let p6;
    	let t24;
    	let p7;
    	let t26;
    	let div5;
    	let p8;
    	let t28;
    	let p9;
    	let t30;
    	let p10;
    	let t32;
    	let div8;
    	let h31;
    	let t34;
    	let p11;
    	let t35;
    	let span6;
    	let t37;
    	let t38;
    	let div13;
    	let div11;
    	let img2;
    	let img2_src_value;
    	let t39;
    	let div10;
    	let p12;
    	let t41;
    	let div12;
    	let h32;
    	let t43;
    	let p13;
    	let t44;
    	let span7;
    	let t46;
    	let t47;
    	let div16;
    	let div14;
    	let img3;
    	let img3_src_value;
    	let t48;
    	let div15;
    	let h33;
    	let t50;
    	let p14;
    	let t51;
    	let span8;
    	let t53;
    	let div18;
    	let div17;
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			div19 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			p0 = element("p");
    			span0 = element("span");
    			span0.textContent = "Music";
    			br0 = element("br");
    			t2 = text("Users will get to chose from a variety of song clips to add to their videos");
    			t3 = space();
    			p1 = element("p");
    			span1 = element("span");
    			span1.textContent = "Filters";
    			br1 = element("br");
    			t5 = text("Users will have access to a number of filters to put over their videos");
    			t6 = space();
    			p2 = element("p");
    			span2 = element("span");
    			span2.textContent = "Effects";
    			br2 = element("br");
    			t8 = text("A number of video effects will be available to enhance the quality of the users videos.");
    			t9 = space();
    			p3 = element("p");
    			span3 = element("span");
    			span3.textContent = "GIFs";
    			br3 = element("br");
    			t11 = text("To add a unique touch to your trickshots, add a GIF for a built-in reaction to the users skills.");
    			t12 = space();
    			p4 = element("p");
    			span4 = element("span");
    			span4.textContent = "Crop";
    			br4 = element("br");
    			t14 = text("To cut and crop their videos, users are invited to use the trimming feature.");
    			t15 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Take videos showcasing your skills";
    			t17 = space();
    			p5 = element("p");
    			t18 = text("No matter if your skill is  ");
    			span5 = element("span");
    			span5.textContent = "athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind,";
    			t20 = text(" we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.");
    			t21 = space();
    			div9 = element("div");
    			div7 = element("div");
    			img1 = element("img");
    			t22 = space();
    			div6 = element("div");
    			p6 = element("p");
    			p6.textContent = "Users will have the option to save their video to their camera roll.";
    			t24 = space();
    			p7 = element("p");
    			p7.textContent = "Choose a unique name for your trickshot.";
    			t26 = space();
    			div5 = element("div");
    			p8 = element("p");
    			p8.textContent = "By adding SkillsTags to each video, users will be able to increase their reach and voting results.";
    			t28 = space();
    			p9 = element("p");
    			p9.textContent = "Users will be able to use this area to search for or create their own SkillsTags for their video.";
    			t30 = space();
    			p10 = element("p");
    			p10.textContent = "A total of 6 SkillsTags will be listed and added to each video.";
    			t32 = space();
    			div8 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Put videos up for Challenge";
    			t34 = space();
    			p11 = element("p");
    			t35 = text("After you’re satisfied with your video, it’s time to put it up for Challenge.  ");
    			span6 = element("span");
    			span6.textContent = "Winning a challenge round is how your video becomes eligible for minting.";
    			t37 = text(" Choose between putting your video up for Open Challenge or directly challenging another video or user. Round lengths can be either 24h or 72h.");
    			t38 = space();
    			div13 = element("div");
    			div11 = element("div");
    			img2 = element("img");
    			t39 = space();
    			div10 = element("div");
    			p12 = element("p");
    			p12.textContent = "Users will see freezeframe of the 2 videos and they can tap on the Play button to watch each video.";
    			t41 = space();
    			div12 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Users vote to determine winner";
    			t43 = space();
    			p13 = element("p");
    			t44 = text("Once the challenge starts, ");
    			span7 = element("span");
    			span7.textContent = "the control is now in the voters hands.";
    			t46 = text(" Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and minted as an NFT.");
    			t47 = space();
    			div16 = element("div");
    			div14 = element("div");
    			img3 = element("img");
    			t48 = space();
    			div15 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Earn money from voting and winning challenges";
    			t50 = space();
    			p14 = element("p");
    			t51 = text("Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is. ");
    			span8 = element("span");
    			span8.textContent = "Closer vote count = bigger cut.";
    			t53 = space();
    			div18 = element("div");
    			div17 = element("div");
    			iframe = element("iframe");
    			if (!src_url_equal(img0.src, img0_src_value = "images/Edit_sw.webp")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-fiq2g0");
    			add_location(img0, file$8, 3, 12, 106);
    			set_style(span0, "text-decoration", "underline");
    			add_location(span0, file$8, 5, 49, 255);
    			add_location(br0, file$8, 5, 102, 308);
    			attr_dev(p0, "id", "music");
    			attr_dev(p0, "class", "extra-info svelte-fiq2g0");
    			add_location(p0, file$8, 5, 16, 222);
    			set_style(span1, "text-decoration", "underline");
    			add_location(span1, file$8, 6, 51, 443);
    			add_location(br1, file$8, 6, 106, 498);
    			attr_dev(p1, "id", "filters");
    			attr_dev(p1, "class", "extra-info svelte-fiq2g0");
    			add_location(p1, file$8, 6, 16, 408);
    			set_style(span2, "text-decoration", "underline");
    			add_location(span2, file$8, 7, 51, 628);
    			add_location(br2, file$8, 7, 106, 683);
    			attr_dev(p2, "id", "effects");
    			attr_dev(p2, "class", "extra-info svelte-fiq2g0");
    			add_location(p2, file$8, 7, 16, 593);
    			set_style(span3, "text-decoration", "underline");
    			add_location(span3, file$8, 8, 58, 837);
    			add_location(br3, file$8, 8, 110, 889);
    			attr_dev(p3, "id", "gifs");
    			attr_dev(p3, "class", "extra-info info-left svelte-fiq2g0");
    			add_location(p3, file$8, 8, 16, 795);
    			set_style(span4, "text-decoration", "underline");
    			add_location(span4, file$8, 9, 58, 1052);
    			add_location(br4, file$8, 9, 110, 1104);
    			attr_dev(p4, "id", "crop");
    			attr_dev(p4, "class", "extra-info info-left svelte-fiq2g0");
    			add_location(p4, file$8, 9, 16, 1010);
    			attr_dev(div0, "class", "tooltips svelte-fiq2g0");
    			set_style(div0, "color", "rgb(200,255,255)");
    			add_location(div0, file$8, 4, 12, 152);
    			attr_dev(div1, "class", "image first svelte-fiq2g0");
    			add_location(div1, file$8, 2, 8, 68);
    			set_style(h30, "border-bottom", "2px solid aqua");
    			attr_dev(h30, "class", "svelte-fiq2g0");
    			add_location(h30, file$8, 14, 12, 1290);
    			set_style(span5, "color", "aqua");
    			add_location(span5, file$8, 15, 43, 1416);
    			attr_dev(p5, "class", "svelte-fiq2g0");
    			add_location(p5, file$8, 15, 12, 1385);
    			add_location(div2, file$8, 13, 12, 1272);
    			attr_dev(div3, "class", "content second svelte-fiq2g0");
    			add_location(div3, file$8, 12, 8, 1231);
    			attr_dev(div4, "class", "section svelte-fiq2g0");
    			add_location(div4, file$8, 1, 4, 38);
    			if (!src_url_equal(img1.src, img1_src_value = "images/upload_sw.webp")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-fiq2g0");
    			add_location(img1, file$8, 21, 12, 1792);
    			attr_dev(p6, "id", "music");
    			attr_dev(p6, "class", "extra-info info-left svelte-fiq2g0");
    			add_location(p6, file$8, 23, 16, 1910);
    			attr_dev(p7, "id", "name");
    			attr_dev(p7, "class", "extra-info info-left svelte-fiq2g0");
    			add_location(p7, file$8, 24, 16, 2042);
    			attr_dev(p8, "class", "svelte-fiq2g0");
    			add_location(p8, file$8, 26, 20, 2210);
    			attr_dev(p9, "class", "svelte-fiq2g0");
    			add_location(p9, file$8, 27, 20, 2336);
    			attr_dev(p10, "class", "svelte-fiq2g0");
    			add_location(p10, file$8, 28, 20, 2461);
    			attr_dev(div5, "id", "tags");
    			attr_dev(div5, "class", "extra-info info-left svelte-fiq2g0");
    			add_location(div5, file$8, 25, 16, 2145);
    			attr_dev(div6, "class", "tooltips svelte-fiq2g0");
    			set_style(div6, "color", "rgb(255,150,150)");
    			add_location(div6, file$8, 22, 12, 1840);
    			attr_dev(div7, "class", "image second svelte-fiq2g0");
    			add_location(div7, file$8, 20, 8, 1753);
    			set_style(h31, "border-bottom", "2px solid red");
    			attr_dev(h31, "class", "svelte-fiq2g0");
    			add_location(h31, file$8, 33, 12, 2637);
    			set_style(span6, "color", "red");
    			add_location(span6, file$8, 34, 94, 2806);
    			attr_dev(p11, "class", "svelte-fiq2g0");
    			add_location(p11, file$8, 34, 12, 2724);
    			attr_dev(div8, "class", "content first svelte-fiq2g0");
    			add_location(div8, file$8, 32, 8, 2597);
    			attr_dev(div9, "class", "section svelte-fiq2g0");
    			add_location(div9, file$8, 19, 4, 1723);
    			if (!src_url_equal(img2.src, img2_src_value = "images/challenge_sw.webp")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-fiq2g0");
    			add_location(img2, file$8, 39, 12, 3157);
    			attr_dev(p12, "id", "music");
    			attr_dev(p12, "class", "extra-info svelte-fiq2g0");
    			add_location(p12, file$8, 41, 16, 3278);
    			attr_dev(div10, "class", "tooltips svelte-fiq2g0");
    			set_style(div10, "color", "rgb(225,175,255)");
    			add_location(div10, file$8, 40, 12, 3208);
    			attr_dev(div11, "class", "image first svelte-fiq2g0");
    			add_location(div11, file$8, 38, 8, 3119);
    			set_style(h32, "border-bottom", "2px solid blueviolet");
    			attr_dev(h32, "class", "svelte-fiq2g0");
    			add_location(h32, file$8, 45, 12, 3498);
    			set_style(span7, "color", "blueviolet");
    			add_location(span7, file$8, 46, 42, 3625);
    			attr_dev(p13, "class", "svelte-fiq2g0");
    			add_location(p13, file$8, 46, 12, 3595);
    			attr_dev(div12, "class", "content second svelte-fiq2g0");
    			add_location(div12, file$8, 44, 8, 3457);
    			attr_dev(div13, "class", "section svelte-fiq2g0");
    			add_location(div13, file$8, 37, 4, 3089);
    			if (!src_url_equal(img3.src, img3_src_value = "")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-fiq2g0");
    			add_location(img3, file$8, 51, 12, 3994);
    			attr_dev(div14, "class", "image second svelte-fiq2g0");
    			add_location(div14, file$8, 50, 8, 3955);
    			set_style(h33, "border-bottom", "2px solid gold");
    			attr_dev(h33, "class", "svelte-fiq2g0");
    			add_location(h33, file$8, 54, 12, 4072);
    			set_style(span8, "color", "gold");
    			add_location(span8, file$8, 55, 292, 4458);
    			attr_dev(p14, "class", "svelte-fiq2g0");
    			add_location(p14, file$8, 55, 12, 4178);
    			attr_dev(div15, "class", "content first svelte-fiq2g0");
    			add_location(div15, file$8, 53, 8, 4032);
    			attr_dev(div16, "class", "section svelte-fiq2g0");
    			add_location(div16, file$8, 49, 4, 3925);
    			attr_dev(iframe, "title", "AllSkills Trailer Video");
    			attr_dev(iframe, "loading", "lazy");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/tgbNymZ7vqY")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "class", "svelte-fiq2g0");
    			add_location(iframe, file$8, 60, 12, 4641);
    			attr_dev(div17, "class", "video svelte-fiq2g0");
    			add_location(div17, file$8, 59, 8, 4609);
    			attr_dev(div18, "id", "Trailer");
    			attr_dev(div18, "class", "video-container svelte-fiq2g0");
    			add_location(div18, file$8, 58, 4, 4558);
    			attr_dev(div19, "class", "challenge-container svelte-fiq2g0");
    			add_location(div19, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, span0);
    			append_dev(p0, br0);
    			append_dev(p0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(p1, span1);
    			append_dev(p1, br1);
    			append_dev(p1, t5);
    			append_dev(div0, t6);
    			append_dev(div0, p2);
    			append_dev(p2, span2);
    			append_dev(p2, br2);
    			append_dev(p2, t8);
    			append_dev(div0, t9);
    			append_dev(div0, p3);
    			append_dev(p3, span3);
    			append_dev(p3, br3);
    			append_dev(p3, t11);
    			append_dev(div0, t12);
    			append_dev(div0, p4);
    			append_dev(p4, span4);
    			append_dev(p4, br4);
    			append_dev(p4, t14);
    			append_dev(div4, t15);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t17);
    			append_dev(div2, p5);
    			append_dev(p5, t18);
    			append_dev(p5, span5);
    			append_dev(p5, t20);
    			append_dev(div19, t21);
    			append_dev(div19, div9);
    			append_dev(div9, div7);
    			append_dev(div7, img1);
    			append_dev(div7, t22);
    			append_dev(div7, div6);
    			append_dev(div6, p6);
    			append_dev(div6, t24);
    			append_dev(div6, p7);
    			append_dev(div6, t26);
    			append_dev(div6, div5);
    			append_dev(div5, p8);
    			append_dev(div5, t28);
    			append_dev(div5, p9);
    			append_dev(div5, t30);
    			append_dev(div5, p10);
    			append_dev(div9, t32);
    			append_dev(div9, div8);
    			append_dev(div8, h31);
    			append_dev(div8, t34);
    			append_dev(div8, p11);
    			append_dev(p11, t35);
    			append_dev(p11, span6);
    			append_dev(p11, t37);
    			append_dev(div19, t38);
    			append_dev(div19, div13);
    			append_dev(div13, div11);
    			append_dev(div11, img2);
    			append_dev(div11, t39);
    			append_dev(div11, div10);
    			append_dev(div10, p12);
    			append_dev(div13, t41);
    			append_dev(div13, div12);
    			append_dev(div12, h32);
    			append_dev(div12, t43);
    			append_dev(div12, p13);
    			append_dev(p13, t44);
    			append_dev(p13, span7);
    			append_dev(p13, t46);
    			append_dev(div19, t47);
    			append_dev(div19, div16);
    			append_dev(div16, div14);
    			append_dev(div14, img3);
    			append_dev(div16, t48);
    			append_dev(div16, div15);
    			append_dev(div15, h33);
    			append_dev(div15, t50);
    			append_dev(div15, p14);
    			append_dev(p14, t51);
    			append_dev(p14, span8);
    			append_dev(div19, t53);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, iframe);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div19);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Challenge', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Challenge> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Challenge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Challenge",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/VoteToken.svelte generated by Svelte v3.44.3 */

    const file$7 = "src/VoteToken.svelte";

    function create_fragment$7(ctx) {
    	let div7;
    	let div0;
    	let span0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h30;
    	let t2;
    	let p0;
    	let t3;
    	let span1;
    	let t5;
    	let t6;
    	let div1;
    	let span2;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let h31;
    	let t9;
    	let p1;
    	let t10;
    	let span3;
    	let t12;
    	let t13;
    	let div2;
    	let span4;
    	let img2;
    	let img2_src_value;
    	let t14;
    	let h32;
    	let t16;
    	let p2;
    	let t17;
    	let span5;
    	let t19;
    	let t20;
    	let div3;
    	let h1;
    	let t22;
    	let img3;
    	let img3_src_value;
    	let t23;
    	let div4;
    	let span6;
    	let img4;
    	let img4_src_value;
    	let t24;
    	let h33;
    	let t26;
    	let p3;
    	let t27;
    	let span7;
    	let t29;
    	let t30;
    	let div5;
    	let span8;
    	let img5;
    	let img5_src_value;
    	let t31;
    	let h34;
    	let t33;
    	let p4;
    	let t34;
    	let span9;
    	let t36;
    	let t37;
    	let div6;
    	let span10;
    	let img6;
    	let img6_src_value;
    	let t38;
    	let h35;
    	let t40;
    	let p5;
    	let t41;
    	let span11;
    	let t43;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			img0 = element("img");
    			t0 = space();
    			h30 = element("h3");
    			h30.textContent = "Cast your vote";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Show your support by voting for the challenge video you like most. All votes form a ");
    			span1 = element("span");
    			span1.textContent = "reward pool";
    			t5 = text(" and decide the winning video.");
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			img1 = element("img");
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Earn through voting";
    			t9 = space();
    			p1 = element("p");
    			t10 = text("The reward pool is split between the winner and all those who voted for them. ");
    			span3 = element("span");
    			span3.textContent = "Earn up to 145%";
    			t12 = text(" back for votes cast on winning videos.");
    			t13 = space();
    			div2 = element("div");
    			span4 = element("span");
    			img2 = element("img");
    			t14 = space();
    			h32 = element("h3");
    			h32.textContent = "Share in the success";
    			t16 = space();
    			p2 = element("p");
    			t17 = text("Voters continue to share in the success by ");
    			span5 = element("span");
    			span5.textContent = "earning royalties";
    			t19 = text(" everytime a video they voted for is sold on any marketplace.");
    			t20 = space();
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "1 $Vote ≈ $0.10";
    			t22 = space();
    			img3 = element("img");
    			t23 = space();
    			div4 = element("div");
    			span6 = element("span");
    			img4 = element("img");
    			t24 = space();
    			h33 = element("h3");
    			h33.textContent = "Redeemable at stable value";
    			t26 = space();
    			p3 = element("p");
    			t27 = text("$Vote tokens are ");
    			span7 = element("span");
    			span7.textContent = "backed by fiat reserves";
    			t29 = text(" at 1:1 ratio and will always be redeemable at a stable value.");
    			t30 = space();
    			div5 = element("div");
    			span8 = element("span");
    			img5 = element("img");
    			t31 = space();
    			h34 = element("h3");
    			h34.textContent = "Stake to earn more";
    			t33 = space();
    			p4 = element("p");
    			t34 = text("Staking your $Vote tokens allows you to ");
    			span9 = element("span");
    			span9.textContent = "earn $Skills tokens.";
    			t36 = text(" Use $Skills tokens to participate in raffles and to voice your opinion.");
    			t37 = space();
    			div6 = element("div");
    			span10 = element("span");
    			img6 = element("img");
    			t38 = space();
    			h35 = element("h3");
    			h35.textContent = "Easily replenish your wallet";
    			t40 = space();
    			p5 = element("p");
    			t41 = text("If you run out of Vote tokens, you can ");
    			span11 = element("span");
    			span11.textContent = "watch sponsored videos to earn more";
    			t43 = text(" and get right back in the game.");
    			attr_dev(img0, "alt", "Vote");
    			if (!src_url_equal(img0.src, img0_src_value = "images/vote.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-xtai9e");
    			add_location(img0, file$7, 3, 12, 107);
    			attr_dev(h30, "class", "svelte-xtai9e");
    			add_location(h30, file$7, 4, 16, 164);
    			attr_dev(span0, "class", "title svelte-xtai9e");
    			add_location(span0, file$7, 2, 11, 74);
    			attr_dev(span1, "class", "highlight svelte-xtai9e");
    			add_location(span1, file$7, 6, 98, 306);
    			attr_dev(p0, "class", "svelte-xtai9e");
    			add_location(p0, file$7, 6, 11, 219);
    			attr_dev(div0, "class", "section left svelte-xtai9e");
    			add_location(div0, file$7, 1, 7, 36);
    			attr_dev(img1, "alt", "Earnings");
    			if (!src_url_equal(img1.src, img1_src_value = "images/earnings.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-xtai9e");
    			add_location(img1, file$7, 10, 12, 472);
    			attr_dev(h31, "class", "svelte-xtai9e");
    			add_location(h31, file$7, 11, 13, 534);
    			attr_dev(span2, "class", "title svelte-xtai9e");
    			add_location(span2, file$7, 9, 8, 439);
    			attr_dev(span3, "class", "highlight svelte-xtai9e");
    			add_location(span3, file$7, 13, 89, 669);
    			attr_dev(p1, "class", "svelte-xtai9e");
    			add_location(p1, file$7, 13, 8, 588);
    			attr_dev(div1, "class", "section left svelte-xtai9e");
    			add_location(div1, file$7, 8, 7, 404);
    			attr_dev(img2, "alt", "Royalties");
    			if (!src_url_equal(img2.src, img2_src_value = "images/revenue.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-xtai9e");
    			add_location(img2, file$7, 17, 12, 842);
    			attr_dev(h32, "class", "svelte-xtai9e");
    			add_location(h32, file$7, 18, 13, 904);
    			attr_dev(span4, "class", "title svelte-xtai9e");
    			add_location(span4, file$7, 16, 8, 809);
    			attr_dev(span5, "class", "highlight svelte-xtai9e");
    			add_location(span5, file$7, 20, 54, 1005);
    			attr_dev(p2, "class", "svelte-xtai9e");
    			add_location(p2, file$7, 20, 8, 959);
    			attr_dev(div2, "class", "section left svelte-xtai9e");
    			add_location(div2, file$7, 15, 4, 774);
    			attr_dev(h1, "id", "value");
    			attr_dev(h1, "class", "svelte-xtai9e");
    			add_location(h1, file$7, 23, 8, 1170);
    			attr_dev(img3, "id", "token");
    			attr_dev(img3, "alt", "Vote Token");
    			if (!src_url_equal(img3.src, img3_src_value = "images/token.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-xtai9e");
    			add_location(img3, file$7, 24, 8, 1214);
    			attr_dev(div3, "class", "column middle svelte-xtai9e");
    			add_location(div3, file$7, 22, 4, 1134);
    			attr_dev(img4, "alt", "Stable value");
    			if (!src_url_equal(img4.src, img4_src_value = "images/stable.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-xtai9e");
    			add_location(img4, file$7, 28, 16, 1369);
    			attr_dev(h33, "class", "svelte-xtai9e");
    			add_location(h33, file$7, 29, 17, 1437);
    			attr_dev(span6, "class", "title svelte-xtai9e");
    			add_location(span6, file$7, 27, 12, 1332);
    			attr_dev(span7, "class", "highlight svelte-xtai9e");
    			add_location(span7, file$7, 31, 32, 1526);
    			attr_dev(p3, "class", "svelte-xtai9e");
    			add_location(p3, file$7, 31, 12, 1506);
    			attr_dev(div4, "class", "section right svelte-xtai9e");
    			add_location(div4, file$7, 26, 8, 1292);
    			attr_dev(img5, "alt", "Stake");
    			if (!src_url_equal(img5.src, img5_src_value = "images/stake.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "svelte-xtai9e");
    			add_location(img5, file$7, 35, 16, 1747);
    			attr_dev(h34, "class", "svelte-xtai9e");
    			add_location(h34, file$7, 36, 17, 1807);
    			attr_dev(span8, "class", "title svelte-xtai9e");
    			add_location(span8, file$7, 34, 12, 1710);
    			attr_dev(span9, "class", "highlight svelte-xtai9e");
    			add_location(span9, file$7, 38, 55, 1911);
    			attr_dev(p4, "class", "svelte-xtai9e");
    			add_location(p4, file$7, 38, 12, 1868);
    			attr_dev(div5, "class", "section right svelte-xtai9e");
    			add_location(div5, file$7, 33, 8, 1670);
    			attr_dev(img6, "alt", "Replenish");
    			if (!src_url_equal(img6.src, img6_src_value = "images/replenish.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "class", "svelte-xtai9e");
    			add_location(img6, file$7, 42, 16, 2139);
    			attr_dev(h35, "class", "svelte-xtai9e");
    			add_location(h35, file$7, 43, 17, 2207);
    			attr_dev(span10, "class", "title svelte-xtai9e");
    			add_location(span10, file$7, 41, 12, 2102);
    			attr_dev(span11, "class", "highlight svelte-xtai9e");
    			add_location(span11, file$7, 45, 55, 2321);
    			attr_dev(p5, "class", "svelte-xtai9e");
    			add_location(p5, file$7, 45, 13, 2279);
    			attr_dev(div6, "class", "section right svelte-xtai9e");
    			add_location(div6, file$7, 40, 8, 2062);
    			attr_dev(div7, "class", "vote-container svelte-xtai9e");
    			add_location(div7, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, span0);
    			append_dev(span0, img0);
    			append_dev(span0, t0);
    			append_dev(span0, h30);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, span1);
    			append_dev(p0, t5);
    			append_dev(div7, t6);
    			append_dev(div7, div1);
    			append_dev(div1, span2);
    			append_dev(span2, img1);
    			append_dev(span2, t7);
    			append_dev(span2, h31);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(p1, t10);
    			append_dev(p1, span3);
    			append_dev(p1, t12);
    			append_dev(div7, t13);
    			append_dev(div7, div2);
    			append_dev(div2, span4);
    			append_dev(span4, img2);
    			append_dev(span4, t14);
    			append_dev(span4, h32);
    			append_dev(div2, t16);
    			append_dev(div2, p2);
    			append_dev(p2, t17);
    			append_dev(p2, span5);
    			append_dev(p2, t19);
    			append_dev(div7, t20);
    			append_dev(div7, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t22);
    			append_dev(div3, img3);
    			append_dev(div7, t23);
    			append_dev(div7, div4);
    			append_dev(div4, span6);
    			append_dev(span6, img4);
    			append_dev(span6, t24);
    			append_dev(span6, h33);
    			append_dev(div4, t26);
    			append_dev(div4, p3);
    			append_dev(p3, t27);
    			append_dev(p3, span7);
    			append_dev(p3, t29);
    			append_dev(div7, t30);
    			append_dev(div7, div5);
    			append_dev(div5, span8);
    			append_dev(span8, img5);
    			append_dev(span8, t31);
    			append_dev(span8, h34);
    			append_dev(div5, t33);
    			append_dev(div5, p4);
    			append_dev(p4, t34);
    			append_dev(p4, span9);
    			append_dev(p4, t36);
    			append_dev(div7, t37);
    			append_dev(div7, div6);
    			append_dev(div6, span10);
    			append_dev(span10, img6);
    			append_dev(span10, t38);
    			append_dev(span10, h35);
    			append_dev(div6, t40);
    			append_dev(div6, p5);
    			append_dev(p5, t41);
    			append_dev(p5, span11);
    			append_dev(p5, t43);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VoteToken', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VoteToken> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class VoteToken extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VoteToken",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Roadmapv2.svelte generated by Svelte v3.44.3 */

    const file$6 = "src/Roadmapv2.svelte";

    function create_fragment$6(ctx) {
    	let div16;
    	let div0;
    	let p;
    	let t1;
    	let div3;
    	let h30;
    	let t3;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div2;
    	let ul0;
    	let li0;
    	let t6;
    	let li1;
    	let t8;
    	let li2;
    	let t10;
    	let li3;
    	let t12;
    	let div6;
    	let h31;
    	let t14;
    	let div4;
    	let img1;
    	let img1_src_value;
    	let t15;
    	let div5;
    	let ul1;
    	let li4;
    	let t17;
    	let li5;
    	let t19;
    	let li6;
    	let t21;
    	let li7;
    	let t23;
    	let li8;
    	let t25;
    	let li9;
    	let t27;
    	let li10;
    	let t29;
    	let div9;
    	let h32;
    	let t31;
    	let div7;
    	let img2;
    	let img2_src_value;
    	let t32;
    	let div8;
    	let ul2;
    	let li11;
    	let t34;
    	let li12;
    	let t36;
    	let li13;
    	let t38;
    	let li14;
    	let t40;
    	let li15;
    	let t42;
    	let li16;
    	let t44;
    	let li17;
    	let t46;
    	let div12;
    	let h33;
    	let t48;
    	let div10;
    	let img3;
    	let img3_src_value;
    	let t49;
    	let div11;
    	let ul3;
    	let li18;
    	let t51;
    	let li19;
    	let t53;
    	let li20;
    	let t55;
    	let div15;
    	let h34;
    	let t57;
    	let div13;
    	let img4;
    	let img4_src_value;
    	let t58;
    	let div14;
    	let ul4;
    	let li21;
    	let t60;
    	let li22;
    	let t62;
    	let li23;
    	let t64;
    	let li24;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    			t1 = space();
    			div3 = element("div");
    			h30 = element("h3");
    			h30.textContent = "2019 - 2020";
    			t3 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t4 = space();
    			div2 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Ideation";
    			t6 = space();
    			li1 = element("li");
    			li1.textContent = "Business plan";
    			t8 = space();
    			li2 = element("li");
    			li2.textContent = "Feasibility study";
    			t10 = space();
    			li3 = element("li");
    			li3.textContent = "Olympic skater Charles Hamelin joins project";
    			t12 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			h31.textContent = "2021";
    			t14 = space();
    			div4 = element("div");
    			img1 = element("img");
    			t15 = space();
    			div5 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Markest research";
    			t17 = space();
    			li5 = element("li");
    			li5.textContent = "Acquired advisors & CTO";
    			t19 = space();
    			li6 = element("li");
    			li6.textContent = "Backed by PME Montreal";
    			t21 = space();
    			li7 = element("li");
    			li7.textContent = "Finalists in NBA Launchpad";
    			t23 = space();
    			li8 = element("li");
    			li8.textContent = "Pivot towards NFT platform";
    			t25 = space();
    			li9 = element("li");
    			li9.textContent = "Launch website";
    			t27 = space();
    			li10 = element("li");
    			li10.textContent = "Release whitepaper and tokenomics";
    			t29 = space();
    			div9 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Q1 2022";
    			t31 = space();
    			div7 = element("div");
    			img2 = element("img");
    			t32 = space();
    			div8 = element("div");
    			ul2 = element("ul");
    			li11 = element("li");
    			li11.textContent = "Announce partners";
    			t34 = space();
    			li12 = element("li");
    			li12.textContent = "Setup social accounts";
    			t36 = space();
    			li13 = element("li");
    			li13.textContent = "Release marketing plan";
    			t38 = space();
    			li14 = element("li");
    			li14.textContent = "Mint governance token";
    			t40 = space();
    			li15 = element("li");
    			li15.textContent = "Release plan for Ambassador program";
    			t42 = space();
    			li16 = element("li");
    			li16.textContent = "Trailer";
    			t44 = space();
    			li17 = element("li");
    			li17.textContent = "Token presale";
    			t46 = space();
    			div12 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Q2 2022";
    			t48 = space();
    			div10 = element("div");
    			img3 = element("img");
    			t49 = space();
    			div11 = element("div");
    			ul3 = element("ul");
    			li18 = element("li");
    			li18.textContent = "Mint stablecoin Vote token";
    			t51 = space();
    			li19 = element("li");
    			li19.textContent = "Launch closed beta";
    			t53 = space();
    			li20 = element("li");
    			li20.textContent = "Full release of challenge system and marketplace";
    			t55 = space();
    			div15 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Q3+ 2022";
    			t57 = space();
    			div13 = element("div");
    			img4 = element("img");
    			t58 = space();
    			div14 = element("div");
    			ul4 = element("ul");
    			li21 = element("li");
    			li21.textContent = "Add video editing features";
    			t60 = space();
    			li22 = element("li");
    			li22.textContent = "Unique Tap-to-Record feature";
    			t62 = space();
    			li23 = element("li");
    			li23.textContent = "Release of ambassador program";
    			t64 = space();
    			li24 = element("li");
    			li24.textContent = "Release of GM mode";
    			attr_dev(p, "class", "svelte-6ys767");
    			add_location(p, file$6, 2, 8, 63);
    			attr_dev(div0, "class", "info svelte-6ys767");
    			add_location(div0, file$6, 1, 4, 36);
    			set_style(h30, "color", "white");
    			attr_dev(h30, "class", "svelte-6ys767");
    			add_location(h30, file$6, 5, 8, 372);
    			attr_dev(img0, "alt", "Idea");
    			if (!src_url_equal(img0.src, img0_src_value = "images/idea_sw.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-6ys767");
    			add_location(img0, file$6, 7, 12, 496);
    			attr_dev(div1, "class", "header svelte-6ys767");
    			set_style(div1, "border-bottom", "5px solid #363636");
    			add_location(div1, file$6, 6, 8, 422);
    			attr_dev(li0, "class", "cleared");
    			add_location(li0, file$6, 11, 16, 615);
    			attr_dev(li1, "class", "cleared");
    			add_location(li1, file$6, 12, 16, 665);
    			attr_dev(li2, "class", "cleared");
    			add_location(li2, file$6, 13, 16, 720);
    			attr_dev(li3, "class", "cleared");
    			add_location(li3, file$6, 14, 16, 779);
    			attr_dev(ul0, "class", "svelte-6ys767");
    			add_location(ul0, file$6, 10, 12, 594);
    			attr_dev(div2, "class", "text svelte-6ys767");
    			add_location(div2, file$6, 9, 8, 563);
    			attr_dev(div3, "class", "roadmap-card svelte-6ys767");
    			set_style(div3, "height", "60%");
    			add_location(div3, file$6, 4, 4, 317);
    			set_style(h31, "color", "#852ee7");
    			attr_dev(h31, "class", "svelte-6ys767");
    			add_location(h31, file$6, 19, 8, 952);
    			attr_dev(img1, "alt", "New Direction");
    			if (!src_url_equal(img1.src, img1_src_value = "images/leadership_sw.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-6ys767");
    			add_location(img1, file$6, 21, 12, 1070);
    			attr_dev(div4, "class", "header svelte-6ys767");
    			set_style(div4, "border-bottom", "5px solid #852ee7");
    			add_location(div4, file$6, 20, 8, 996);
    			attr_dev(li4, "class", "cleared");
    			add_location(li4, file$6, 25, 16, 1204);
    			attr_dev(li5, "class", "cleared");
    			add_location(li5, file$6, 26, 16, 1262);
    			attr_dev(li6, "class", "cleared");
    			add_location(li6, file$6, 27, 16, 1327);
    			attr_dev(li7, "class", "cleared");
    			add_location(li7, file$6, 28, 16, 1392);
    			attr_dev(li8, "class", "cleared");
    			add_location(li8, file$6, 29, 16, 1460);
    			add_location(li9, file$6, 30, 16, 1528);
    			add_location(li10, file$6, 31, 16, 1568);
    			attr_dev(ul1, "class", "svelte-6ys767");
    			add_location(ul1, file$6, 24, 12, 1183);
    			attr_dev(div5, "class", "text svelte-6ys767");
    			add_location(div5, file$6, 23, 8, 1152);
    			attr_dev(div6, "class", "roadmap-card svelte-6ys767");
    			set_style(div6, "height", "70%");
    			add_location(div6, file$6, 18, 4, 897);
    			set_style(h32, "color", "#e0573f");
    			attr_dev(h32, "class", "svelte-6ys767");
    			add_location(h32, file$6, 36, 8, 1714);
    			attr_dev(img2, "alt", "Pre-launch plan");
    			if (!src_url_equal(img2.src, img2_src_value = "images/planning_sw.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-6ys767");
    			add_location(img2, file$6, 38, 12, 1835);
    			attr_dev(div7, "class", "header svelte-6ys767");
    			set_style(div7, "border-bottom", "5px solid #e0573f");
    			add_location(div7, file$6, 37, 8, 1761);
    			add_location(li11, file$6, 42, 16, 1969);
    			add_location(li12, file$6, 43, 16, 2012);
    			add_location(li13, file$6, 44, 16, 2059);
    			add_location(li14, file$6, 45, 16, 2107);
    			add_location(li15, file$6, 46, 16, 2154);
    			add_location(li16, file$6, 47, 16, 2215);
    			add_location(li17, file$6, 48, 16, 2248);
    			attr_dev(ul2, "class", "svelte-6ys767");
    			add_location(ul2, file$6, 41, 12, 1948);
    			attr_dev(div8, "class", "text svelte-6ys767");
    			add_location(div8, file$6, 40, 8, 1917);
    			attr_dev(div9, "class", "roadmap-card svelte-6ys767");
    			set_style(div9, "height", "80%");
    			add_location(div9, file$6, 35, 4, 1659);
    			set_style(h33, "color", "#ecec37");
    			attr_dev(h33, "class", "svelte-6ys767");
    			add_location(h33, file$6, 53, 8, 2374);
    			attr_dev(img3, "alt", "Launch plans");
    			if (!src_url_equal(img3.src, img3_src_value = "images/launch_sw.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-6ys767");
    			add_location(img3, file$6, 55, 12, 2496);
    			attr_dev(div10, "class", "header svelte-6ys767");
    			set_style(div10, "border-bottom", "5px solid #ecec37");
    			add_location(div10, file$6, 54, 8, 2422);
    			add_location(li18, file$6, 59, 16, 2625);
    			add_location(li19, file$6, 60, 16, 2677);
    			add_location(li20, file$6, 61, 16, 2721);
    			attr_dev(ul3, "class", "svelte-6ys767");
    			add_location(ul3, file$6, 58, 12, 2604);
    			attr_dev(div11, "class", "text svelte-6ys767");
    			add_location(div11, file$6, 57, 8, 2573);
    			attr_dev(div12, "class", "roadmap-card svelte-6ys767");
    			set_style(div12, "height", "90%");
    			add_location(div12, file$6, 52, 4, 2319);
    			set_style(h34, "color", "aqua");
    			attr_dev(h34, "class", "svelte-6ys767");
    			add_location(h34, file$6, 66, 8, 2883);
    			attr_dev(img4, "alt", "Post launch plans");
    			if (!src_url_equal(img4.src, img4_src_value = "images/globalization_sw.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-6ys767");
    			add_location(img4, file$6, 68, 12, 3001);
    			attr_dev(div13, "class", "header svelte-6ys767");
    			set_style(div13, "border-bottom", "5px solid aqua");
    			add_location(div13, file$6, 67, 8, 2930);
    			add_location(li21, file$6, 72, 16, 3142);
    			add_location(li22, file$6, 73, 16, 3194);
    			add_location(li23, file$6, 74, 16, 3248);
    			add_location(li24, file$6, 75, 16, 3303);
    			attr_dev(ul4, "class", "svelte-6ys767");
    			add_location(ul4, file$6, 71, 12, 3121);
    			attr_dev(div14, "class", "text svelte-6ys767");
    			add_location(div14, file$6, 70, 8, 3090);
    			attr_dev(div15, "class", "roadmap-card svelte-6ys767");
    			set_style(div15, "height", "100%");
    			add_location(div15, file$6, 65, 4, 2827);
    			attr_dev(div16, "class", "roadmap-container svelte-6ys767");
    			add_location(div16, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div0);
    			append_dev(div0, p);
    			append_dev(div16, t1);
    			append_dev(div16, div3);
    			append_dev(div3, h30);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t6);
    			append_dev(ul0, li1);
    			append_dev(ul0, t8);
    			append_dev(ul0, li2);
    			append_dev(ul0, t10);
    			append_dev(ul0, li3);
    			append_dev(div16, t12);
    			append_dev(div16, div6);
    			append_dev(div6, h31);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			append_dev(div4, img1);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div5, ul1);
    			append_dev(ul1, li4);
    			append_dev(ul1, t17);
    			append_dev(ul1, li5);
    			append_dev(ul1, t19);
    			append_dev(ul1, li6);
    			append_dev(ul1, t21);
    			append_dev(ul1, li7);
    			append_dev(ul1, t23);
    			append_dev(ul1, li8);
    			append_dev(ul1, t25);
    			append_dev(ul1, li9);
    			append_dev(ul1, t27);
    			append_dev(ul1, li10);
    			append_dev(div16, t29);
    			append_dev(div16, div9);
    			append_dev(div9, h32);
    			append_dev(div9, t31);
    			append_dev(div9, div7);
    			append_dev(div7, img2);
    			append_dev(div9, t32);
    			append_dev(div9, div8);
    			append_dev(div8, ul2);
    			append_dev(ul2, li11);
    			append_dev(ul2, t34);
    			append_dev(ul2, li12);
    			append_dev(ul2, t36);
    			append_dev(ul2, li13);
    			append_dev(ul2, t38);
    			append_dev(ul2, li14);
    			append_dev(ul2, t40);
    			append_dev(ul2, li15);
    			append_dev(ul2, t42);
    			append_dev(ul2, li16);
    			append_dev(ul2, t44);
    			append_dev(ul2, li17);
    			append_dev(div16, t46);
    			append_dev(div16, div12);
    			append_dev(div12, h33);
    			append_dev(div12, t48);
    			append_dev(div12, div10);
    			append_dev(div10, img3);
    			append_dev(div12, t49);
    			append_dev(div12, div11);
    			append_dev(div11, ul3);
    			append_dev(ul3, li18);
    			append_dev(ul3, t51);
    			append_dev(ul3, li19);
    			append_dev(ul3, t53);
    			append_dev(ul3, li20);
    			append_dev(div16, t55);
    			append_dev(div16, div15);
    			append_dev(div15, h34);
    			append_dev(div15, t57);
    			append_dev(div15, div13);
    			append_dev(div13, img4);
    			append_dev(div15, t58);
    			append_dev(div15, div14);
    			append_dev(div14, ul4);
    			append_dev(ul4, li21);
    			append_dev(ul4, t60);
    			append_dev(ul4, li22);
    			append_dev(ul4, t62);
    			append_dev(ul4, li23);
    			append_dev(ul4, t64);
    			append_dev(ul4, li24);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Roadmapv2', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Roadmapv2> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Roadmapv2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Roadmapv2",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Carousel.svelte generated by Svelte v3.44.3 */

    const file$5 = "src/Carousel.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let div0;
    	let label0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let label1;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let label2;
    	let img2;
    	let img2_src_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			div0 = element("div");
    			label0 = element("label");
    			img0 = element("img");
    			t3 = space();
    			label1 = element("label");
    			img1 = element("img");
    			t4 = space();
    			label2 = element("label");
    			img2 = element("img");
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "slider");
    			attr_dev(input0, "id", "item-1");
    			input0.checked = true;
    			attr_dev(input0, "class", "svelte-1rxlozd");
    			add_location(input0, file$5, 2, 8, 69);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "slider");
    			attr_dev(input1, "id", "item-2");
    			attr_dev(input1, "class", "svelte-1rxlozd");
    			add_location(input1, file$5, 3, 8, 132);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "slider");
    			attr_dev(input2, "id", "item-3");
    			attr_dev(input2, "class", "svelte-1rxlozd");
    			add_location(input2, file$5, 4, 8, 187);
    			if (!src_url_equal(img0.src, img0_src_value = "images/bass.webp")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "NFT Trading Card");
    			attr_dev(img0, "class", "svelte-1rxlozd");
    			add_location(img0, file$5, 7, 8, 320);
    			attr_dev(label0, "class", "card svelte-1rxlozd");
    			attr_dev(label0, "for", "item-1");
    			attr_dev(label0, "id", "card-1");
    			add_location(label0, file$5, 6, 8, 266);
    			if (!src_url_equal(img1.src, img1_src_value = "images/Dunk.webp")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "NFT Trading Card");
    			attr_dev(img1, "class", "svelte-1rxlozd");
    			add_location(img1, file$5, 10, 8, 451);
    			attr_dev(label1, "class", "card svelte-1rxlozd");
    			attr_dev(label1, "for", "item-2");
    			attr_dev(label1, "id", "card-2");
    			add_location(label1, file$5, 9, 8, 397);
    			if (!src_url_equal(img2.src, img2_src_value = "images/skateboard.webp")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "NFT Trading Card");
    			attr_dev(img2, "class", "svelte-1rxlozd");
    			add_location(img2, file$5, 13, 8, 582);
    			attr_dev(label2, "class", "card svelte-1rxlozd");
    			attr_dev(label2, "for", "item-3");
    			attr_dev(label2, "id", "card-3");
    			add_location(label2, file$5, 12, 8, 528);
    			attr_dev(div0, "class", "cards svelte-1rxlozd");
    			add_location(div0, file$5, 5, 4, 238);
    			attr_dev(div1, "class", "container svelte-1rxlozd");
    			add_location(div1, file$5, 1, 4, 37);
    			attr_dev(div2, "class", "carousel-container svelte-1rxlozd");
    			add_location(div2, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t0);
    			append_dev(div1, input1);
    			append_dev(div1, t1);
    			append_dev(div1, input2);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, img0);
    			append_dev(div0, t3);
    			append_dev(div0, label1);
    			append_dev(label1, img1);
    			append_dev(div0, t4);
    			append_dev(div0, label2);
    			append_dev(label2, img2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Table.svelte generated by Svelte v3.44.3 */

    const file$4 = "src/Table.svelte";

    function create_fragment$4(ctx) {
    	let div8;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h30;
    	let t2;
    	let p0;
    	let t4;
    	let div3;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let h31;
    	let t7;
    	let p1;
    	let t9;
    	let div5;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let h32;
    	let t12;
    	let p2;
    	let t14;
    	let div7;
    	let div6;
    	let img3;
    	let img3_src_value;
    	let t15;
    	let h33;
    	let t17;
    	let p3;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h30 = element("h3");
    			h30.textContent = "Skills Competition";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.";
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t5 = space();
    			h31 = element("h3");
    			h31.textContent = "Earning Potential";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.";
    			t9 = space();
    			div5 = element("div");
    			div4 = element("div");
    			img2 = element("img");
    			t10 = space();
    			h32 = element("h3");
    			h32.textContent = "NFT Collectibles";
    			t12 = space();
    			p2 = element("p");
    			p2.textContent = "Collect unique moments from talented creators. Winning challenge videos are minted into NFT collectibles that can be traded on our NFT marketplace.";
    			t14 = space();
    			div7 = element("div");
    			div6 = element("div");
    			img3 = element("img");
    			t15 = space();
    			h33 = element("h3");
    			h33.textContent = "NFT Marketplace";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters.";
    			attr_dev(img0, "alt", "Handshake");
    			set_style(img0, "width", "100%");
    			if (!src_url_equal(img0.src, img0_src_value = "images/handshake.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$4, 2, 32, 99);
    			attr_dev(div0, "class", "table-icon svelte-19ztz97");
    			add_location(div0, file$4, 2, 8, 75);
    			attr_dev(h30, "class", "svelte-19ztz97");
    			add_location(h30, file$4, 3, 8, 181);
    			attr_dev(p0, "class", "svelte-19ztz97");
    			add_location(p0, file$4, 4, 8, 217);
    			attr_dev(div1, "class", "grid-item svelte-19ztz97");
    			add_location(div1, file$4, 1, 4, 43);
    			attr_dev(img1, "alt", "Earnings");
    			set_style(img1, "width", "100%");
    			if (!src_url_equal(img1.src, img1_src_value = "images/earn.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$4, 7, 32, 553);
    			attr_dev(div2, "class", "table-icon svelte-19ztz97");
    			add_location(div2, file$4, 7, 8, 529);
    			attr_dev(h31, "class", "svelte-19ztz97");
    			add_location(h31, file$4, 8, 8, 629);
    			attr_dev(p1, "class", "svelte-19ztz97");
    			add_location(p1, file$4, 9, 8, 664);
    			attr_dev(div3, "class", "grid-item svelte-19ztz97");
    			add_location(div3, file$4, 6, 4, 497);
    			attr_dev(img2, "alt", "Collectibles");
    			set_style(img2, "width", "100%");
    			if (!src_url_equal(img2.src, img2_src_value = "images/stamps.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$4, 12, 32, 944);
    			attr_dev(div4, "class", "table-icon svelte-19ztz97");
    			add_location(div4, file$4, 12, 8, 920);
    			attr_dev(h32, "class", "svelte-19ztz97");
    			add_location(h32, file$4, 13, 8, 1026);
    			attr_dev(p2, "class", "svelte-19ztz97");
    			add_location(p2, file$4, 14, 8, 1060);
    			attr_dev(div5, "class", "grid-item svelte-19ztz97");
    			add_location(div5, file$4, 11, 4, 888);
    			attr_dev(img3, "alt", "Marketplace");
    			set_style(img3, "width", "100%");
    			if (!src_url_equal(img3.src, img3_src_value = "images/auction.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$4, 17, 32, 1286);
    			attr_dev(div6, "class", "table-icon svelte-19ztz97");
    			add_location(div6, file$4, 17, 8, 1262);
    			attr_dev(h33, "class", "svelte-19ztz97");
    			add_location(h33, file$4, 18, 8, 1368);
    			attr_dev(p3, "class", "svelte-19ztz97");
    			add_location(p3, file$4, 19, 8, 1401);
    			attr_dev(div7, "class", "grid-item svelte-19ztz97");
    			add_location(div7, file$4, 16, 4, 1230);
    			attr_dev(div8, "class", "table-content svelte-19ztz97");
    			attr_dev(div8, "id", "Table");
    			add_location(div8, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div1, t0);
    			append_dev(div1, h30);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div3, t5);
    			append_dev(div3, h31);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			append_dev(div8, t9);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, img2);
    			append_dev(div5, t10);
    			append_dev(div5, h32);
    			append_dev(div5, t12);
    			append_dev(div5, p2);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, img3);
    			append_dev(div7, t15);
    			append_dev(div7, h33);
    			append_dev(div7, t17);
    			append_dev(div7, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/News.svelte generated by Svelte v3.44.3 */

    const file$3 = "src/News.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].img;
    	child_ctx[2] = list[i].title;
    	child_ctx[3] = list[i].content;
    	return child_ctx;
    }

    // (2:4) {#each news as {img, title, content}}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t1_value = /*title*/ ctx[2] + "";
    	let t1;
    	let t2;
    	let div1;
    	let p;
    	let t3_value = /*content*/ ctx[3] + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = "images/profile-bg-1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-nl2vjr");
    			add_location(img, file$3, 4, 16, 146);
    			attr_dev(div0, "class", "image svelte-nl2vjr");
    			add_location(div0, file$3, 3, 12, 110);
    			attr_dev(h2, "class", "title svelte-nl2vjr");
    			add_location(h2, file$3, 6, 12, 215);
    			add_location(p, file$3, 8, 16, 296);
    			attr_dev(div1, "class", "content svelte-nl2vjr");
    			add_location(div1, file$3, 7, 12, 258);
    			attr_dev(div2, "class", "card svelte-nl2vjr");
    			add_location(div2, file$3, 2, 8, 79);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, h2);
    			append_dev(h2, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div2, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(2:4) {#each news as {img, title, content}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_value = /*news*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "news-container svelte-nl2vjr");
    			add_location(div, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*news*/ 1) {
    				each_value = /*news*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News', slots, []);

    	const news = [
    		{
    			img: "",
    			title: "Soft Launch!",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<News> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ news });
    	return [news];
    }

    class News extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.44.3 */
    const file$2 = "src/Content.svelte";

    function create_fragment$2(ctx) {
    	let carousel;
    	let t0;
    	let div11;
    	let h20;
    	let t2;
    	let table;
    	let t3;
    	let div0;
    	let h3;
    	let span0;
    	let t5;
    	let span1;
    	let t7;
    	let span2;
    	let t9;
    	let div1;
    	let h21;
    	let t11;
    	let challenge;
    	let t12;
    	let div2;
    	let h22;
    	let t14;
    	let votetoken;
    	let t15;
    	let div3;
    	let h23;
    	let t17;
    	let roadmap;
    	let t18;
    	let div5;
    	let h24;
    	let t20;
    	let div4;
    	let tokenomics;
    	let t21;
    	let div6;
    	let h25;
    	let t23;
    	let teamcards;
    	let t24;
    	let div8;
    	let div7;
    	let t25;
    	let div9;
    	let h26;
    	let t27;
    	let div10;
    	let h27;
    	let t29;
    	let news;
    	let current;
    	carousel = new Carousel({ $$inline: true });
    	table = new Table({ $$inline: true });
    	challenge = new Challenge({ $$inline: true });
    	votetoken = new VoteToken({ $$inline: true });
    	roadmap = new Roadmapv2({ $$inline: true });
    	tokenomics = new Tokenomics({ $$inline: true });
    	teamcards = new TeamCards({ $$inline: true });
    	news = new News({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(carousel.$$.fragment);
    			t0 = space();
    			div11 = element("div");
    			h20 = element("h2");
    			h20.textContent = "What We Provide";
    			t2 = space();
    			create_component(table.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			span0 = element("span");
    			span0.textContent = "AllSkills";
    			t5 = text(" is powered by cryptocurrency, using ");
    			span1 = element("span");
    			span1.textContent = "future-proof blockchain & smart contract technology";
    			t7 = text(" to connect talented people and audiences, and foster skill development through competition, all while providing ");
    			span2 = element("span");
    			span2.textContent = "incentives for everyone involved.";
    			t9 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Challenge System";
    			t11 = space();
    			create_component(challenge.$$.fragment);
    			t12 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "AllSkills $Vote Token";
    			t14 = space();
    			create_component(votetoken.$$.fragment);
    			t15 = space();
    			div3 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Buildup to Launch & Beyond";
    			t17 = space();
    			create_component(roadmap.$$.fragment);
    			t18 = space();
    			div5 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Tokenomics";
    			t20 = space();
    			div4 = element("div");
    			create_component(tokenomics.$$.fragment);
    			t21 = space();
    			div6 = element("div");
    			h25 = element("h2");
    			h25.textContent = "The Team";
    			t23 = space();
    			create_component(teamcards.$$.fragment);
    			t24 = space();
    			div8 = element("div");
    			div7 = element("div");
    			t25 = space();
    			div9 = element("div");
    			h26 = element("h2");
    			h26.textContent = "Partners";
    			t27 = space();
    			div10 = element("div");
    			h27 = element("h2");
    			h27.textContent = "News";
    			t29 = space();
    			create_component(news.$$.fragment);
    			attr_dev(h20, "class", "svelte-yk5na5");
    			add_location(h20, file$2, 15, 4, 444);
    			set_style(span0, "color", "aqua");
    			add_location(span0, file$2, 18, 12, 527);
    			set_style(span1, "background-color", "aqua");
    			set_style(span1, "color", "rgb(30,30,30)");
    			add_location(span1, file$2, 18, 91, 606);
    			set_style(span2, "background-color", "aqua");
    			set_style(span2, "color", "rgb(30,30,30)");
    			add_location(span2, file$2, 18, 321, 836);
    			attr_dev(h3, "class", "svelte-yk5na5");
    			add_location(h3, file$2, 18, 8, 523);
    			attr_dev(div0, "class", "powered-by svelte-yk5na5");
    			add_location(div0, file$2, 17, 4, 489);
    			set_style(h21, "text-decoration", "underline red");
    			attr_dev(h21, "class", "svelte-yk5na5");
    			add_location(h21, file$2, 21, 8, 998);
    			attr_dev(div1, "id", "Challenge");
    			attr_dev(div1, "class", "section svelte-yk5na5");
    			add_location(div1, file$2, 20, 4, 952);
    			set_style(h22, "text-align", "center");
    			set_style(h22, "text-decoration", "underline aqua");
    			attr_dev(h22, "class", "svelte-yk5na5");
    			add_location(h22, file$2, 25, 8, 1144);
    			attr_dev(div2, "id", "Vote");
    			attr_dev(div2, "class", "section svelte-yk5na5");
    			add_location(div2, file$2, 24, 4, 1103);
    			set_style(h23, "text-decoration", "underline blueviolet");
    			set_style(h23, "margin-bottom", "75px");
    			attr_dev(h23, "class", "svelte-yk5na5");
    			add_location(h23, file$2, 29, 8, 1319);
    			attr_dev(div3, "id", "Roadmap");
    			attr_dev(div3, "class", "section svelte-yk5na5");
    			add_location(div3, file$2, 28, 4, 1275);
    			set_style(h24, "text-align", "center");
    			set_style(h24, "text-decoration", "underline gold");
    			attr_dev(h24, "class", "svelte-yk5na5");
    			add_location(h24, file$2, 33, 8, 1507);
    			attr_dev(div4, "class", "section svelte-yk5na5");
    			add_location(div4, file$2, 34, 8, 1597);
    			attr_dev(div5, "id", "Tokenomics");
    			attr_dev(div5, "class", "section svelte-yk5na5");
    			add_location(div5, file$2, 32, 4, 1460);
    			set_style(h25, "text-decoration", "underline white");
    			attr_dev(h25, "class", "svelte-yk5na5");
    			add_location(h25, file$2, 39, 8, 1720);
    			attr_dev(div6, "id", "Team");
    			attr_dev(div6, "class", "section svelte-yk5na5");
    			add_location(div6, file$2, 38, 4, 1679);
    			attr_dev(div7, "class", "triangle svelte-yk5na5");
    			add_location(div7, file$2, 43, 8, 1846);
    			attr_dev(div8, "class", "top svelte-yk5na5");
    			add_location(div8, file$2, 42, 4, 1819);
    			set_style(h26, "margin-left", "7%");
    			attr_dev(h26, "class", "svelte-yk5na5");
    			add_location(h26, file$2, 46, 8, 1956);
    			attr_dev(div9, "id", "Partners");
    			attr_dev(div9, "class", "white svelte-yk5na5");
    			set_style(div9, "width", "100%");
    			add_location(div9, file$2, 45, 4, 1892);
    			set_style(h27, "margin-left", "7%");
    			attr_dev(h27, "class", "svelte-yk5na5");
    			add_location(h27, file$2, 49, 8, 2075);
    			attr_dev(div10, "id", "News");
    			attr_dev(div10, "class", "white svelte-yk5na5");
    			set_style(div10, "width", "100%");
    			add_location(div10, file$2, 48, 4, 2014);
    			attr_dev(div11, "class", "text-content svelte-yk5na5");
    			add_location(div11, file$2, 14, 0, 412);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(carousel, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, h20);
    			append_dev(div11, t2);
    			mount_component(table, div11, null);
    			append_dev(div11, t3);
    			append_dev(div11, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span0);
    			append_dev(h3, t5);
    			append_dev(h3, span1);
    			append_dev(h3, t7);
    			append_dev(h3, span2);
    			append_dev(div11, t9);
    			append_dev(div11, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t11);
    			mount_component(challenge, div1, null);
    			append_dev(div11, t12);
    			append_dev(div11, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t14);
    			mount_component(votetoken, div2, null);
    			append_dev(div11, t15);
    			append_dev(div11, div3);
    			append_dev(div3, h23);
    			append_dev(div3, t17);
    			mount_component(roadmap, div3, null);
    			append_dev(div11, t18);
    			append_dev(div11, div5);
    			append_dev(div5, h24);
    			append_dev(div5, t20);
    			append_dev(div5, div4);
    			mount_component(tokenomics, div4, null);
    			append_dev(div11, t21);
    			append_dev(div11, div6);
    			append_dev(div6, h25);
    			append_dev(div6, t23);
    			mount_component(teamcards, div6, null);
    			append_dev(div11, t24);
    			append_dev(div11, div8);
    			append_dev(div8, div7);
    			append_dev(div11, t25);
    			append_dev(div11, div9);
    			append_dev(div9, h26);
    			append_dev(div11, t27);
    			append_dev(div11, div10);
    			append_dev(div10, h27);
    			append_dev(div10, t29);
    			mount_component(news, div10, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(challenge.$$.fragment, local);
    			transition_in(votetoken.$$.fragment, local);
    			transition_in(roadmap.$$.fragment, local);
    			transition_in(tokenomics.$$.fragment, local);
    			transition_in(teamcards.$$.fragment, local);
    			transition_in(news.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(challenge.$$.fragment, local);
    			transition_out(votetoken.$$.fragment, local);
    			transition_out(roadmap.$$.fragment, local);
    			transition_out(tokenomics.$$.fragment, local);
    			transition_out(teamcards.$$.fragment, local);
    			transition_out(news.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(carousel, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div11);
    			destroy_component(table);
    			destroy_component(challenge);
    			destroy_component(votetoken);
    			destroy_component(roadmap);
    			destroy_component(tokenomics);
    			destroy_component(teamcards);
    			destroy_component(news);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TeamCards,
    		Tokenomics,
    		Challenge,
    		VoteToken,
    		Roadmap: Roadmapv2,
    		Carousel,
    		Table,
    		News
    	});

    	return [];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.44.3 */
    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div5;
    	let div0;
    	let h40;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;
    	let t13;
    	let li6;
    	let a6;
    	let t15;
    	let div2;
    	let h41;
    	let t17;
    	let div1;
    	let newslettersignup;
    	let t18;
    	let div4;
    	let h42;
    	let t20;
    	let div3;
    	let a7;
    	let img0;
    	let img0_src_value;
    	let t21;
    	let a8;
    	let img1;
    	let img1_src_value;
    	let t22;
    	let a9;
    	let img2;
    	let img2_src_value;
    	let t23;
    	let a10;
    	let img3;
    	let img3_src_value;
    	let t24;
    	let div6;
    	let img4;
    	let img4_src_value;
    	let t25;
    	let h3;
    	let current;

    	newslettersignup = new NewsletterSignup({
    			props: { color: "black" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div5 = element("div");
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Links";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Trailer";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Challenge System";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Vote Stablecoin";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Roadmap";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Tokenomics";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Team";
    			t13 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Blog";
    			t15 = space();
    			div2 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Newsletter Subscription";
    			t17 = space();
    			div1 = element("div");
    			create_component(newslettersignup.$$.fragment);
    			t18 = space();
    			div4 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Connect";
    			t20 = space();
    			div3 = element("div");
    			a7 = element("a");
    			img0 = element("img");
    			t21 = space();
    			a8 = element("a");
    			img1 = element("img");
    			t22 = space();
    			a9 = element("a");
    			img2 = element("img");
    			t23 = space();
    			a10 = element("a");
    			img3 = element("img");
    			t24 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t25 = space();
    			h3 = element("h3");
    			h3.textContent = "AllSkills";
    			add_location(h40, file$1, 7, 12, 202);
    			attr_dev(a0, "href", "#Trailer");
    			attr_dev(a0, "class", "svelte-dsezie");
    			add_location(a0, file$1, 9, 20, 276);
    			attr_dev(li0, "class", "svelte-dsezie");
    			add_location(li0, file$1, 9, 16, 272);
    			attr_dev(a1, "href", "#Challenge");
    			attr_dev(a1, "class", "svelte-dsezie");
    			add_location(a1, file$1, 10, 20, 333);
    			attr_dev(li1, "class", "svelte-dsezie");
    			add_location(li1, file$1, 10, 16, 329);
    			attr_dev(a2, "href", "#Vote");
    			attr_dev(a2, "class", "svelte-dsezie");
    			add_location(a2, file$1, 11, 20, 401);
    			attr_dev(li2, "class", "svelte-dsezie");
    			add_location(li2, file$1, 11, 16, 397);
    			attr_dev(a3, "href", "#Roadmap");
    			attr_dev(a3, "class", "svelte-dsezie");
    			add_location(a3, file$1, 12, 20, 463);
    			attr_dev(li3, "class", "svelte-dsezie");
    			add_location(li3, file$1, 12, 16, 459);
    			attr_dev(a4, "href", "#Tokenomics");
    			attr_dev(a4, "class", "svelte-dsezie");
    			add_location(a4, file$1, 13, 20, 520);
    			attr_dev(li4, "class", "svelte-dsezie");
    			add_location(li4, file$1, 13, 16, 516);
    			attr_dev(a5, "href", "#Team");
    			attr_dev(a5, "class", "svelte-dsezie");
    			add_location(a5, file$1, 14, 20, 583);
    			attr_dev(li5, "class", "svelte-dsezie");
    			add_location(li5, file$1, 14, 16, 579);
    			attr_dev(a6, "href", "#News");
    			attr_dev(a6, "class", "svelte-dsezie");
    			add_location(a6, file$1, 15, 20, 634);
    			attr_dev(li6, "class", "svelte-dsezie");
    			add_location(li6, file$1, 15, 16, 630);
    			attr_dev(ul, "class", "col-content svelte-dsezie");
    			add_location(ul, file$1, 8, 12, 230);
    			attr_dev(div0, "class", "footer-col svelte-dsezie");
    			attr_dev(div0, "id", "links");
    			add_location(div0, file$1, 6, 8, 153);
    			add_location(h41, file$1, 19, 12, 760);
    			attr_dev(div1, "class", "col-content svelte-dsezie");
    			add_location(div1, file$1, 20, 12, 806);
    			attr_dev(div2, "class", "footer-col svelte-dsezie");
    			attr_dev(div2, "id", "register");
    			add_location(div2, file$1, 18, 8, 708);
    			add_location(h42, file$1, 26, 12, 993);
    			attr_dev(img0, "alt", "Email");
    			if (!src_url_equal(img0.src, img0_src_value = "images/email.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-dsezie");
    			add_location(img0, file$1, 28, 51, 1153);
    			attr_dev(a7, "href", "mailto:info@allskills.ca");
    			attr_dev(a7, "class", "svelte-dsezie");
    			add_location(a7, file$1, 28, 16, 1118);
    			attr_dev(img1, "alt", "Discord");
    			if (!src_url_equal(img1.src, img1_src_value = "images/discord.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-dsezie");
    			add_location(img1, file$1, 29, 19, 1218);
    			attr_dev(a8, "class", "svelte-dsezie");
    			add_location(a8, file$1, 29, 16, 1215);
    			attr_dev(img2, "alt", "Instagram");
    			if (!src_url_equal(img2.src, img2_src_value = "images/instagram.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-dsezie");
    			add_location(img2, file$1, 30, 63, 1331);
    			attr_dev(a9, "href", "https:www.instagram.com/AllSkillsNFT");
    			attr_dev(a9, "class", "svelte-dsezie");
    			add_location(a9, file$1, 30, 16, 1284);
    			attr_dev(img3, "alt", "Twitter");
    			if (!src_url_equal(img3.src, img3_src_value = "images/twitter.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-dsezie");
    			add_location(img3, file$1, 31, 64, 1449);
    			attr_dev(a10, "href", "https://www.twitter.com/@AllSkillsNFT");
    			attr_dev(a10, "class", "svelte-dsezie");
    			add_location(a10, file$1, 31, 16, 1401);
    			attr_dev(div3, "class", "col-content svelte-dsezie");
    			set_style(div3, "display", "flex");
    			set_style(div3, "justify-content", "space-between");
    			add_location(div3, file$1, 27, 12, 1023);
    			attr_dev(div4, "class", "footer-col svelte-dsezie");
    			attr_dev(div4, "id", "connect");
    			add_location(div4, file$1, 25, 8, 942);
    			attr_dev(div5, "class", "footer-content svelte-dsezie");
    			add_location(div5, file$1, 5, 4, 115);
    			attr_dev(img4, "alt", "Logo");
    			set_style(img4, "margin-right", "12px");
    			if (!src_url_equal(img4.src, img4_src_value = "images/logo-dark.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-dsezie");
    			add_location(img4, file$1, 36, 8, 1576);
    			attr_dev(h3, "class", "svelte-dsezie");
    			add_location(h3, file$1, 37, 8, 1659);
    			attr_dev(div6, "id", "logo");
    			attr_dev(div6, "class", "svelte-dsezie");
    			add_location(div6, file$1, 35, 4, 1551);
    			attr_dev(footer, "class", "footer svelte-dsezie");
    			add_location(footer, file$1, 4, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t1);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			append_dev(ul, t13);
    			append_dev(ul, li6);
    			append_dev(li6, a6);
    			append_dev(div5, t15);
    			append_dev(div5, div2);
    			append_dev(div2, h41);
    			append_dev(div2, t17);
    			append_dev(div2, div1);
    			mount_component(newslettersignup, div1, null);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div4, h42);
    			append_dev(div4, t20);
    			append_dev(div4, div3);
    			append_dev(div3, a7);
    			append_dev(a7, img0);
    			append_dev(div3, t21);
    			append_dev(div3, a8);
    			append_dev(a8, img1);
    			append_dev(div3, t22);
    			append_dev(div3, a9);
    			append_dev(a9, img2);
    			append_dev(div3, t23);
    			append_dev(div3, a10);
    			append_dev(a10, img3);
    			append_dev(footer, t24);
    			append_dev(footer, div6);
    			append_dev(div6, img4);
    			append_dev(div6, t25);
    			append_dev(div6, h3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newslettersignup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newslettersignup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(newslettersignup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ NewsletterSignup });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */

    const file = "src/App.svelte";

    // (56:0) {:else}
    function create_else_block(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let hero;
    	let t1;
    	let content;
    	let t2;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	content = new Content({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-1n09gwf");
    			add_location(main, file, 56, 1, 1442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			mount_component(hero, main, null);
    			append_dev(main, t1);
    			mount_component(content, main, null);
    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(hero);
    			destroy_component(content);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(56:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:0) {#if $isLoading}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading";
    			add_location(p, file, 54, 2, 1418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(54:0) {#if $isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let style;
    	let script;
    	let script_src_value;
    	let link;
    	let meta;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isLoading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "@font-face {\n\t\t\tfont-family: \"Oswald\";\n\t\t\tsrc: url(\"./fonts/Oswald-Regular.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Raleway\";\n\t\t\tsrc: url(\"./fonts/Raleway-Medium.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\t\n\t\t@font-face {\n\t\t\tfont-family: \"BentonSans\";\n\t\t\tsrc: url(\"./fonts/BentonSans-Regular.otf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"DINPro\";\n\t\t\tsrc: url(\"./fonts/DINPro.otf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t";
    			script = element("script");
    			link = element("link");
    			meta = element("meta");
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(style, file, 25, 1, 526);
    			script.defer = true;
    			attr_dev(script, "data-domain", "allskills.ca");
    			if (!src_url_equal(script.src, script_src_value = "https://plausible.io/js/plausible.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 47, 1, 995);
    			attr_dev(link, "rel", "canonical");
    			attr_dev(link, "href", "https://allskills.ca/");
    			add_location(link, file, 48, 1, 1090);
    			document.title = "AllSkills - Competition based NFT Platform for showcasing all skills.";
    			attr_dev(meta, "name", "description");
    			attr_dev(meta, "content", "AllSkills is a competition based NFT platform where both talented creators and consumers of content can earn money.");
    			add_location(meta, file, 50, 1, 1231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			append_dev(document.head, script);
    			append_dev(document.head, link);
    			append_dev(document.head, meta);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(style);
    			detach_dev(script);
    			detach_dev(link);
    			detach_dev(meta);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $isLoading;
    	validate_store(k, 'isLoading');
    	component_subscribe($$self, k, $$value => $$invalidate(0, $isLoading = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	y("en", () => Promise.resolve().then(function () { return en$1; }));
    	y("es", () => Promise.resolve().then(function () { return es$1; }));
    	y("fr", () => Promise.resolve().then(function () { return fr$1; }));

    	$({
    		fallbackLocale: "en",
    		initialLocale: I()
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Hero,
    		Content,
    		Footer,
    		_: X,
    		getLocaleFromNavigator: I,
    		isLoading: k,
    		register: y,
    		init: $,
    		locale: M,
    		$isLoading
    	});

    	return [$isLoading];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    var home$2 = {
    	hero: {
    		title: "Built for",
    		description_start: "AllSkills is a platform that looks to bring",
    		description_highlight: "creativity, sustainable growth, and increased competition",
    		description_end: "to the talent world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning money through our carefully crafted token based Vote and Challenge system and NFT marketplace."
    	}
    };
    var en = {
    	home: home$2
    };

    var en$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        home: home$2,
        'default': en
    });

    var home$1 = {
    	hero: {
    		title: "Built for",
    		description_start: "",
    		description_highlight: "",
    		description_end: ""
    	}
    };
    var es = {
    	home: home$1
    };

    var es$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        home: home$1,
        'default': es
    });

    var home = {
    	hero: {
    		title: "Produit pour",
    		description_start: "",
    		description_highlight: "",
    		description_end: ""
    	}
    };
    var fr = {
    	home: home
    };

    var fr$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        home: home,
        'default': fr
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
