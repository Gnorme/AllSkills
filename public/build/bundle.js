
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    ***************************************************************************** */function v(e,n){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)n.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(t[o[r]]=e[o[r]]);}return t}const O={fallbackLocale:null,loadingDelay:200,formats:{number:{scientific:{notation:"scientific"},engineering:{notation:"engineering"},compactLong:{notation:"compact",compactDisplay:"long"},compactShort:{notation:"compact",compactDisplay:"short"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},warnOnMissingMessages:!0,ignoreTag:!0};function j(){return O}function $(e){const{formats:n}=e,t=v(e,["formats"]),o=e.initialLocale||e.fallbackLocale;return Object.assign(O,t,{initialLocale:o}),n&&("number"in n&&Object.assign(O.formats.number,n.number),"date"in n&&Object.assign(O.formats.date,n.date),"time"in n&&Object.assign(O.formats.time,n.time)),M.set(o)}const k=writable(!1);let L;const T=writable(null);function x(e){return e.split("-").map(((e,n,t)=>t.slice(0,n+1).join("-"))).reverse()}function E(e,n=j().fallbackLocale){const t=x(e);return n?[...new Set([...t,...x(n)])]:t}function D(){return null!=L?L:void 0}T.subscribe((e=>{L=null!=e?e:void 0,"undefined"!=typeof window&&null!=e&&document.documentElement.setAttribute("lang",e);}));const M=Object.assign(Object.assign({},T),{set:e=>{if(e&&function(e){if(null==e)return;const n=E(e);for(let e=0;e<n.length;e++){const t=n[e];if(u(t))return t}}(e)&&w(e)){const{loadingDelay:n}=j();let t;return "undefined"!=typeof window&&null!=D()&&n?t=window.setTimeout((()=>k.set(!0)),n):k.set(!0),b(e).then((()=>{T.set(e);})).finally((()=>{clearTimeout(t),k.set(!1);}))}return T.set(e)}}),I=()=>"undefined"==typeof window?null:window.navigator.language||window.navigator.languages[0],Z=e=>{const n=Object.create(null);return t=>{const o=JSON.stringify(t);return o in n?n[o]:n[o]=e(t)}},C=(e,n)=>{const{formats:t}=j();if(e in t&&n in t[e])return t[e][n];throw new Error(`[svelte-i18n] Unknown "${n}" ${e} format.`)},G=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format numbers');return t&&(o=C("number",t)),new Intl.NumberFormat(n,o)})),J=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format dates');return t?o=C("date",t):0===Object.keys(o).length&&(o=C("date","short")),new Intl.DateTimeFormat(n,o)})),U=Z((e=>{var{locale:n,format:t}=e,o=v(e,["locale","format"]);if(null==n)throw new Error('[svelte-i18n] A "locale" must be set to format time values');return t?o=C("time",t):0===Object.keys(o).length&&(o=C("time","short")),new Intl.DateTimeFormat(n,o)})),_=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return G(Object.assign({locale:n},t))},q=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return J(Object.assign({locale:n},t))},B=(e={})=>{var{locale:n=D()}=e,t=v(e,["locale"]);return U(Object.assign({locale:n},t))},H=Z(((e,n=D())=>new o(e,n,j().formats,{ignoreTag:j().ignoreTag}))),K=(e,n={})=>{let t=n;"object"==typeof e&&(t=e,e=t.id);const{values:o,locale:r=D(),default:i}=t;if(null==r)throw new Error("[svelte-i18n] Cannot format a message without first setting the initial locale.");let a=l(e,r);if(a){if("string"!=typeof a)return console.warn(`[svelte-i18n] Message with id "${e}" must be of type "string", found: "${typeof a}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`),a}else j().warnOnMissingMessages&&console.warn(`[svelte-i18n] The message "${e}" was not found in "${E(r).join('", "')}".${w(D())?"\n\nNote: there are at least one loader still registered to this locale that wasn't executed.":""}`),a=null!=i?i:e;if(!o)return a;let s=a;try{s=H(a,r).format(o);}catch(n){console.warn(`[svelte-i18n] Message "${e}" has syntax error:`,n.message);}return s},Q=(e,n)=>B(n).format(e),R=(e,n)=>q(n).format(e),V=(e,n)=>_(n).format(e),W=(e,n=D())=>l(e,n),X=derived([M,s],(()=>K));derived([M],(()=>Q));derived([M],(()=>R));derived([M],(()=>V));const te=derived([M,s],(()=>W));

    /* src/Navbar.svelte generated by Svelte v3.44.3 */
    const file$h = "src/Navbar.svelte";

    function create_fragment$i(ctx) {
    	let nav;
    	let img;
    	let img_src_value;
    	let t0;
    	let button;
    	let svg;
    	let rect;
    	let path0;
    	let path1;
    	let path2;
    	let t1;
    	let div2;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let a4;
    	let t11;
    	let a5;
    	let t13;
    	let a6;
    	let t15;
    	let a7;
    	let t17;
    	let a8;
    	let t19;
    	let a9;
    	let t21;
    	let a10;
    	let t23;
    	let a11;
    	let t25;
    	let div1;
    	let div0;
    	let select;
    	let option0;
    	let option1;
    	let t28;
    	let div3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			img = element("img");
    			t0 = space();
    			button = element("button");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			a0 = element("a");
    			a0.textContent = "×";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Trailer";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "About";
    			t7 = space();
    			a3 = element("a");
    			a3.textContent = "Challenge System";
    			t9 = space();
    			a4 = element("a");
    			a4.textContent = "Vote Token";
    			t11 = space();
    			a5 = element("a");
    			a5.textContent = "NFTs";
    			t13 = space();
    			a6 = element("a");
    			a6.textContent = "Ambassador Program";
    			t15 = space();
    			a7 = element("a");
    			a7.textContent = "Roadmap";
    			t17 = space();
    			a8 = element("a");
    			a8.textContent = "Tokenomics";
    			t19 = space();
    			a9 = element("a");
    			a9.textContent = "Team";
    			t21 = space();
    			a10 = element("a");
    			a10.textContent = "News";
    			t23 = space();
    			a11 = element("a");
    			a11.textContent = "Contact";
    			t25 = space();
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "EN";
    			option1 = element("option");
    			option1.textContent = "FR";
    			t28 = space();
    			div3 = element("div");
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "class", "logo svelte-1gx9ozd");
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$h, 1, 4, 26);
    			attr_dev(rect, "width", "48");
    			attr_dev(rect, "height", "48");
    			attr_dev(rect, "fill", "white");
    			attr_dev(rect, "fill-opacity", "0");
    			attr_dev(rect, "class", "svelte-1gx9ozd");
    			add_location(rect, file$h, 4, 12, 283);
    			attr_dev(path0, "d", "M7.94977 11.9498H39.9498");
    			attr_dev(path0, "stroke", "white");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-1gx9ozd");
    			add_location(path0, file$h, 5, 12, 357);
    			attr_dev(path1, "d", "M7.94977 23.9498H39.9498");
    			attr_dev(path1, "stroke", "white");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-1gx9ozd");
    			add_location(path1, file$h, 6, 12, 486);
    			attr_dev(path2, "d", "M7.94977 35.9498H39.9498");
    			attr_dev(path2, "stroke", "white");
    			attr_dev(path2, "stroke-width", "4");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-1gx9ozd");
    			add_location(path2, file$h, 7, 12, 615);
    			attr_dev(svg, "width", "48px");
    			attr_dev(svg, "height", "48px");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-1gx9ozd");
    			add_location(svg, file$h, 3, 8, 170);
    			attr_dev(button, "class", "hamburger svelte-1gx9ozd");
    			attr_dev(button, "aria-label", "Navigation button");
    			add_location(button, file$h, 2, 4, 84);
    			attr_dev(a0, "href", "javascript:void(0)");
    			attr_dev(a0, "class", "closebtn svelte-1gx9ozd");
    			add_location(a0, file$h, 11, 8, 801);
    			attr_dev(a1, "href", "#Trailer");
    			attr_dev(a1, "class", "svelte-1gx9ozd");
    			add_location(a1, file$h, 12, 8, 888);
    			attr_dev(a2, "href", "#Table");
    			attr_dev(a2, "class", "svelte-1gx9ozd");
    			add_location(a2, file$h, 13, 8, 928);
    			attr_dev(a3, "href", "#Challenge");
    			attr_dev(a3, "class", "svelte-1gx9ozd");
    			add_location(a3, file$h, 14, 8, 964);
    			attr_dev(a4, "href", "#Vote");
    			attr_dev(a4, "class", "svelte-1gx9ozd");
    			add_location(a4, file$h, 15, 8, 1015);
    			attr_dev(a5, "href", "#NFT");
    			attr_dev(a5, "class", "svelte-1gx9ozd");
    			add_location(a5, file$h, 16, 8, 1055);
    			attr_dev(a6, "href", "#Ambassadors");
    			attr_dev(a6, "class", "svelte-1gx9ozd");
    			add_location(a6, file$h, 17, 8, 1088);
    			attr_dev(a7, "href", "#Roadmap");
    			attr_dev(a7, "class", "svelte-1gx9ozd");
    			add_location(a7, file$h, 18, 8, 1143);
    			attr_dev(a8, "href", "#Tokenomics");
    			attr_dev(a8, "class", "svelte-1gx9ozd");
    			add_location(a8, file$h, 19, 8, 1183);
    			attr_dev(a9, "href", "#Team");
    			attr_dev(a9, "class", "svelte-1gx9ozd");
    			add_location(a9, file$h, 20, 8, 1229);
    			attr_dev(a10, "href", "#News");
    			attr_dev(a10, "class", "svelte-1gx9ozd");
    			add_location(a10, file$h, 21, 8, 1263);
    			attr_dev(a11, "href", "#Contact");
    			attr_dev(a11, "class", "svelte-1gx9ozd");
    			add_location(a11, file$h, 22, 8, 1297);
    			option0.__value = "en";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-1gx9ozd");
    			add_location(option0, file$h, 26, 20, 1493);
    			option1.__value = "fr";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-1gx9ozd");
    			add_location(option1, file$h, 27, 20, 1545);
    			attr_dev(select, "class", "svelte-1gx9ozd");
    			add_location(select, file$h, 25, 16, 1418);
    			attr_dev(div0, "class", "select svelte-1gx9ozd");
    			add_location(div0, file$h, 24, 12, 1380);
    			attr_dev(div1, "class", "locale-selector svelte-1gx9ozd");
    			add_location(div1, file$h, 23, 8, 1337);
    			attr_dev(div2, "id", "sidenav");
    			attr_dev(div2, "class", "svelte-1gx9ozd");
    			add_location(div2, file$h, 10, 4, 773);
    			attr_dev(div3, "id", "overlay");
    			attr_dev(div3, "class", "svelte-1gx9ozd");
    			add_location(div3, file$h, 32, 4, 1656);
    			attr_dev(nav, "class", "navbar svelte-1gx9ozd");
    			add_location(nav, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, img);
    			append_dev(nav, t0);
    			append_dev(nav, button);
    			append_dev(button, svg);
    			append_dev(svg, rect);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(nav, t1);
    			append_dev(nav, div2);
    			append_dev(div2, a0);
    			append_dev(div2, t3);
    			append_dev(div2, a1);
    			append_dev(div2, t5);
    			append_dev(div2, a2);
    			append_dev(div2, t7);
    			append_dev(div2, a3);
    			append_dev(div2, t9);
    			append_dev(div2, a4);
    			append_dev(div2, t11);
    			append_dev(div2, a5);
    			append_dev(div2, t13);
    			append_dev(div2, a6);
    			append_dev(div2, t15);
    			append_dev(div2, a7);
    			append_dev(div2, t17);
    			append_dev(div2, a8);
    			append_dev(div2, t19);
    			append_dev(div2, a9);
    			append_dev(div2, t21);
    			append_dev(div2, a10);
    			append_dev(div2, t23);
    			append_dev(div2, a11);
    			append_dev(div2, t25);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*value*/ ctx[0]);
    			append_dev(nav, t28);
    			append_dev(nav, div3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", openNav, false, false, false),
    					listen_dev(a0, "click", closeNav, false, false, false),
    					listen_dev(select, "change", /*handleLocaleChange*/ ctx[1], false, false, false),
    					listen_dev(div3, "click", closeNav, false, false, false)
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
    		id: create_fragment$i.name,
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

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/NewsletterSignup.svelte generated by Svelte v3.44.3 */

    const file$g = "src/NewsletterSignup.svelte";

    function create_fragment$h(ctx) {
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
    			attr_dev(input0, "class", "svelte-1lrr3ng");
    			add_location(input0, file$g, 4, 4, 165);
    			attr_dev(input1, "name", "email");
    			set_style(input1, "color", /*color*/ ctx[0]);
    			set_style(input1, "border-color", /*color*/ ctx[0]);
    			set_style(input1, "--placeholder", /*color*/ ctx[0]);
    			attr_dev(input1, "placeholder", "Sign up for our newsletter");
    			attr_dev(input1, "class", "svelte-1lrr3ng");
    			add_location(input1, file$g, 5, 4, 230);
    			set_style(button, "color", /*color*/ ctx[0]);
    			set_style(button, "border-color", /*color*/ ctx[0]);
    			attr_dev(button, "class", "svelte-1lrr3ng");
    			add_location(button, file$g, 6, 4, 367);
    			attr_dev(form, "name", "newsletter");
    			attr_dev(form, "data-netlify-honeypot", "bot-field");
    			attr_dev(form, "method", "POST");
    			attr_dev(form, "data-netlify", "true");
    			attr_dev(form, "netlify", "");
    			attr_dev(form, "class", "signup svelte-1lrr3ng");
    			add_location(form, file$g, 3, 0, 44);
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
    				set_style(input1, "--placeholder", /*color*/ ctx[0]);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewsletterSignup",
    			options,
    			id: create_fragment$h.name
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
    const file$f = "src/Hero.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (57:20) {#each skills as skill}
    function create_each_block$3(ctx) {
    	let li;
    	let t_value = /*skill*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-1ljob9b");
    			add_location(li, file$f, 57, 24, 1389);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(57:20) {#each skills as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div6;
    	let img;
    	let img_src_value;
    	let t0;
    	let div3;
    	let div0;
    	let t1_value = /*$_*/ ctx[0]('home.hero.title') + "";
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let ul;
    	let t3;
    	let li;
    	let t5;
    	let div5;
    	let div4;
    	let p;
    	let t6_value = /*$_*/ ctx[0]('home.hero.description_start') + "";
    	let t6;
    	let t7;
    	let span0;
    	let t8_value = /*$_*/ ctx[0]('home.hero.description_highlight') + "";
    	let t8;
    	let t9;
    	let t10_value = /*$_*/ ctx[0]('home.hero.description_end') + "";
    	let t10;
    	let t11;
    	let newslettersignup;
    	let t12;
    	let span1;
    	let t13;
    	let a;
    	let current;
    	let each_value = /*skills*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	newslettersignup = new NewsletterSignup({
    			props: { color: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			li = element("li");
    			li.textContent = "AllSkills";
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			span0 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			t10 = text(t10_value);
    			t11 = space();
    			create_component(newslettersignup.$$.fragment);
    			t12 = space();
    			span1 = element("span");
    			t13 = text("Big news coming soon...");
    			a = element("a");
    			a.textContent = "@AllSkillsNFT";
    			attr_dev(img, "alt", "AllSkills logo");
    			attr_dev(img, "id", "hero-logo");
    			if (!src_url_equal(img.src, img_src_value = "images/logo-border-2.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1ljob9b");
    			add_location(img, file$f, 50, 3, 1017);
    			attr_dev(div0, "class", "content svelte-1ljob9b");
    			add_location(div0, file$f, 52, 8, 1130);
    			set_style(li, "color", "#00F3FF");
    			set_style(li, "font-weight", "600", 1);
    			set_style(li, "font-family", "'Bebas Neue'");
    			set_style(li, "margin-top", "11px");
    			attr_dev(li, "class", "svelte-1ljob9b");
    			add_location(li, file$f, 59, 20, 1456);
    			attr_dev(ul, "class", "scroll-animation svelte-1ljob9b");
    			add_location(ul, file$f, 55, 16, 1289);
    			attr_dev(div1, "class", "scrolling-content-mask svelte-1ljob9b");
    			add_location(div1, file$f, 54, 12, 1235);
    			attr_dev(div2, "class", "scrolling-content svelte-1ljob9b");
    			add_location(div2, file$f, 53, 8, 1190);
    			attr_dev(div3, "class", "left-content svelte-1ljob9b");
    			add_location(div3, file$f, 51, 3, 1094);
    			set_style(span0, "color", "#00F3FF");
    			add_location(span0, file$f, 66, 79, 1786);
    			set_style(p, "margin-bottom", "2rem");
    			attr_dev(p, "class", "svelte-1ljob9b");
    			add_location(p, file$f, 66, 12, 1719);
    			attr_dev(div4, "class", "description svelte-1ljob9b");
    			add_location(div4, file$f, 65, 8, 1680);
    			attr_dev(div5, "class", "hero-split svelte-1ljob9b");
    			add_location(div5, file$f, 64, 4, 1646);
    			attr_dev(a, "href", "https://twitter.com/@AllSkillsNFT");
    			attr_dev(a, "class", "svelte-1ljob9b");
    			add_location(a, file$f, 71, 51, 2041);
    			attr_dev(span1, "class", "countdown svelte-1ljob9b");
    			add_location(span1, file$f, 71, 4, 1994);
    			attr_dev(div6, "id", "hero");
    			attr_dev(div6, "class", "svelte-1ljob9b");
    			add_location(div6, file$f, 49, 0, 997);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, img);
    			append_dev(div6, t0);
    			append_dev(div6, div3);
    			append_dev(div3, div0);
    			append_dev(div0, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t3);
    			append_dev(ul, li);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(p, span0);
    			append_dev(span0, t8);
    			append_dev(p, t9);
    			append_dev(p, t10);
    			append_dev(div4, t11);
    			mount_component(newslettersignup, div4, null);
    			append_dev(div6, t12);
    			append_dev(div6, span1);
    			append_dev(span1, t13);
    			append_dev(span1, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$_*/ 1) && t1_value !== (t1_value = /*$_*/ ctx[0]('home.hero.title') + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*skills*/ 2) {
    				each_value = /*skills*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if ((!current || dirty & /*$_*/ 1) && t6_value !== (t6_value = /*$_*/ ctx[0]('home.hero.description_start') + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*$_*/ 1) && t8_value !== (t8_value = /*$_*/ ctx[0]('home.hero.description_highlight') + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*$_*/ 1) && t10_value !== (t10_value = /*$_*/ ctx[0]('home.hero.description_end') + "")) set_data_dev(t10, t10_value);
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
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    			destroy_component(newslettersignup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/TeamCards.svelte generated by Svelte v3.44.3 */

    const { console: console_1$4 } = globals;
    const file$e = "src/TeamCards.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].name;
    	child_ctx[11] = list[i].position;
    	child_ctx[12] = list[i].descr;
    	child_ctx[13] = list[i].email;
    	child_ctx[14] = list[i].twitter;
    	child_ctx[15] = list[i].linkedin;
    	child_ctx[16] = list[i].img;
    	child_ctx[17] = list[i].bg;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (30:12) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("More Info");
    			attr_dev(button, "class", "more-info svelte-ae319g");
    			set_style(button, "border-color", /*bg*/ ctx[17]);
    			attr_dev(button, "data-card-id", /*i*/ ctx[19]);
    			add_location(button, file$e, 30, 12, 1854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleMoreInfo*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(30:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:12) {#if selected === i}
    function create_if_block$3(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Less Info");
    			attr_dev(button, "class", "more-info svelte-ae319g");
    			set_style(button, "border-color", /*bg*/ ctx[17]);
    			attr_dev(button, "data-card-id", /*i*/ ctx[19]);
    			add_location(button, file$e, 28, 12, 1705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleMoreInfo*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(28:12) {#if selected === i}",
    		ctx
    	});

    	return block;
    }

    // (2:2) {#each staff as {name, position, descr, email, twitter, linkedin, img, bg}
    function create_each_block$2(ctx) {
    	let figure;
    	let div0;
    	let svg0;
    	let polygon0;
    	let polygon1;
    	let t0;
    	let figcaption;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let h2;
    	let t2_value = /*name*/ ctx[10] + "";
    	let t2;
    	let span;
    	let t3_value = /*position*/ ctx[11] + "";
    	let t3;
    	let t4;
    	let p;
    	let t5_value = /*descr*/ ctx[12] + "";
    	let t5;
    	let t6;
    	let div5;
    	let div4;
    	let div1;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div2;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let a1;
    	let t8;
    	let div3;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t9;
    	let t10;
    	let svg1;
    	let polygon2;
    	let polygon3;
    	let t11;

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[0] === /*i*/ ctx[19]) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			polygon0 = svg_element("polygon");
    			polygon1 = svg_element("polygon");
    			t0 = space();
    			figcaption = element("figcaption");
    			img0 = element("img");
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t7 = space();
    			div2 = element("div");
    			a2 = element("a");
    			img2 = element("img");
    			a1 = element("a");
    			t8 = space();
    			div3 = element("div");
    			a3 = element("a");
    			img3 = element("img");
    			t9 = space();
    			if_block.c();
    			t10 = space();
    			svg1 = svg_element("svg");
    			polygon2 = svg_element("polygon");
    			polygon3 = svg_element("polygon");
    			t11 = space();
    			set_style(polygon0, "fill", /*bg*/ ctx[17]);
    			attr_dev(polygon0, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			attr_dev(polygon0, "class", "svelte-ae319g");
    			add_location(polygon0, file$e, 6, 12, 340);
    			set_style(polygon1, "fill", /*bg*/ ctx[17]);
    			attr_dev(polygon1, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			attr_dev(polygon1, "class", "svelte-ae319g");
    			add_location(polygon1, file$e, 7, 12, 475);
    			attr_dev(svg0, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "svelte-ae319g");
    			add_location(svg0, file$e, 5, 10, 254);
    			set_style(div0, "height", "200px");
    			attr_dev(div0, "class", "svelte-ae319g");
    			add_location(div0, file$e, 4, 8, 215);
    			if (!src_url_equal(img0.src, img0_src_value = /*img*/ ctx[16])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "profile-sample4");
    			set_style(img0, "border", "3px solid " + /*bg*/ ctx[17]);
    			attr_dev(img0, "class", "profile svelte-ae319g");
    			toggle_class(img0, "selected", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			add_location(img0, file$e, 11, 10, 724);
    			attr_dev(span, "class", "svelte-ae319g");
    			add_location(span, file$e, 12, 20, 863);
    			attr_dev(h2, "class", "svelte-ae319g");
    			add_location(h2, file$e, 12, 10, 853);
    			attr_dev(p, "class", "svelte-ae319g");
    			toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[19]);
    			add_location(p, file$e, 13, 10, 903);
    			attr_dev(img1, "alt", "Twitter");
    			if (!src_url_equal(img1.src, img1_src_value = "images/twitter-aqua.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-ae319g");
    			add_location(img1, file$e, 17, 52, 1200);
    			attr_dev(a0, "href", /*twitter*/ ctx[14]);
    			attr_dev(a0, "class", "twitter svelte-ae319g");
    			add_location(a0, file$e, 17, 18, 1166);
    			attr_dev(div1, "class", "socials-item svelte-ae319g");
    			add_location(div1, file$e, 16, 16, 1120);
    			attr_dev(img2, "alt", /*email*/ ctx[13]);
    			if (!src_url_equal(img2.src, img2_src_value = "images/email-nocircle-aqua.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-ae319g");
    			add_location(img2, file$e, 20, 45, 1368);
    			attr_dev(a1, "class", "svelte-ae319g");
    			add_location(a1, file$e, 20, 101, 1424);
    			attr_dev(a2, "href", "mailto:" + /*email*/ ctx[13]);
    			attr_dev(a2, "class", "svelte-ae319g");
    			add_location(a2, file$e, 20, 20, 1343);
    			attr_dev(div2, "class", "socials-item svelte-ae319g");
    			add_location(div2, file$e, 19, 16, 1295);
    			attr_dev(img3, "alt", "LinkedIn");
    			if (!src_url_equal(img3.src, img3_src_value = "images/linkedin-aqua.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-ae319g");
    			add_location(img3, file$e, 23, 39, 1540);
    			attr_dev(a3, "href", /*linkedin*/ ctx[15]);
    			attr_dev(a3, "class", "svelte-ae319g");
    			add_location(a3, file$e, 23, 20, 1521);
    			attr_dev(div3, "class", "socials-item svelte-ae319g");
    			add_location(div3, file$e, 22, 16, 1473);
    			attr_dev(div4, "class", "socials svelte-ae319g");
    			set_style(div4, "width", "45%");
    			add_location(div4, file$e, 15, 12, 1063);
    			set_style(div5, "max-width", "100%");
    			set_style(div5, "display", "flex");
    			set_style(div5, "justify-content", "space-around");
    			set_style(div5, "max-height", "60px");
    			attr_dev(div5, "class", "svelte-ae319g");
    			add_location(div5, file$e, 14, 10, 958);
    			attr_dev(figcaption, "class", "slanted-bg svelte-ae319g");
    			toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			add_location(figcaption, file$e, 10, 8, 646);
    			set_style(polygon2, "fill", /*bg*/ ctx[17]);
    			attr_dev(polygon2, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			attr_dev(polygon2, "class", "svelte-ae319g");
    			add_location(polygon2, file$e, 35, 10, 2120);
    			set_style(polygon3, "fill", /*bg*/ ctx[17]);
    			attr_dev(polygon3, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			attr_dev(polygon3, "class", "svelte-ae319g");
    			add_location(polygon3, file$e, 36, 10, 2261);
    			attr_dev(svg1, "viewBox", "-1.79 0 501.79 94.114");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "svelte-ae319g");
    			add_location(svg1, file$e, 34, 8, 2036);
    			attr_dev(figure, "class", "card svelte-ae319g");
    			add_location(figure, file$e, 2, 4, 117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, polygon0);
    			append_dev(svg0, polygon1);
    			append_dev(figure, t0);
    			append_dev(figure, figcaption);
    			append_dev(figcaption, img0);
    			append_dev(figcaption, t1);
    			append_dev(figcaption, h2);
    			append_dev(h2, t2);
    			append_dev(h2, span);
    			append_dev(span, t3);
    			append_dev(figcaption, t4);
    			append_dev(figcaption, p);
    			append_dev(p, t5);
    			append_dev(figcaption, t6);
    			append_dev(figcaption, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img1);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, a2);
    			append_dev(a2, img2);
    			append_dev(a2, a1);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			append_dev(a3, img3);
    			append_dev(div5, t9);
    			if_block.m(div5, null);
    			append_dev(figure, t10);
    			append_dev(figure, svg1);
    			append_dev(svg1, polygon2);
    			append_dev(svg1, polygon3);
    			append_dev(figure, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected*/ 1) {
    				toggle_class(img0, "selected", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[19]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div5, null);
    				}
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(2:2) {#each staff as {name, position, descr, email, twitter, linkedin, img, bg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let each_value = /*staff*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "cards-container svelte-ae319g");
    			add_location(div, file$e, 0, 0, 0);
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
    			if (dirty & /*staff, selected, toggleMoreInfo*/ 7) {
    				each_value = /*staff*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TeamCards', slots, []);

    	const staff = [
    		{
    			id: 0,
    			name: "Noah Goren",
    			position: "Co-Founder",
    			descr: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University’s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah’s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him. ",
    			email: "ngoren@allskills.ca",
    			twitter: "https://twitter.com/@NoGoren",
    			linkedin: "https://www.linkedin.com/in/noahgoren/",
    			img: "images/Noah_s.webp",
    			bg: "aqua"
    		},
    		{
    			id: 0,
    			name: "François Sammut",
    			position: "Co-Founder",
    			descr: "A director, conceptualist and creative, François, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, François has learned from them all and applies this knowledge and passion to AllSkills.",
    			email: "fsammut@allskills.ca",
    			twitter: "https://twitter.com/@Sammut_frank",
    			linkedin: "https://www.linkedin.com/in/fsammut/",
    			img: "images/Frank_s.webp",
    			bg: "#FF3333"
    		},
    		{
    			id: 0,
    			name: "Christopher Thompson",
    			position: "Co-Founder",
    			descr: "Christopher has a wide range of interests and knowledge.  On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
    			email: "cthompson@allskills.ca",
    			twitter: "",
    			linkedin: "https://www.linkedin.com/in/christopher-thompson-b48b7b8b/",
    			img: "images/Christopher_s.webp",
    			bg: "blueviolet"
    		},
    		{
    			id: 0,
    			name: "Charles Hamelin",
    			position: "Co-Founder",
    			descr: "A ﬁve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world’s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers.",
    			email: "chamelin@allskills.ca",
    			twitter: "https://twitter.com/@Speedskater01",
    			linkedin: "https://www.linkedin.com/in/charles-hamelin-70600816a/",
    			img: "images/Charles_s.webp",
    			bg: "gold"
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<TeamCards> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TeamCards",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Tokenomics.svelte generated by Svelte v3.44.3 */

    const { console: console_1$3 } = globals;
    const file$d = "src/Tokenomics.svelte";

    function create_fragment$e(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let p;
    	let t2;
    	let span0;
    	let t4;
    	let t5;
    	let div2;
    	let img;
    	let img_src_value;
    	let t6;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t7;
    	let div3;
    	let ul;
    	let li0;
    	let span1;
    	let t9;
    	let li1;
    	let span2;
    	let t11;
    	let li2;
    	let span3;
    	let t13;
    	let li3;
    	let span4;
    	let t15;
    	let li4;
    	let span5;
    	let t17;
    	let li5;
    	let span6;
    	let t19;
    	let div4;
    	let t21;
    	let div6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "100,000,000 $Skills Tokens";
    			t1 = space();
    			p = element("p");
    			t2 = text("With a max supply of 100,000,000 our ");
    			span0 = element("span");
    			span0.textContent = "$Skills token";
    			t4 = text(" will be used for voting on how you think AllSkills should operate, getting access to our beta and early access to new features, entering raffles to earn exclusive prizes, staking to earn $Vote tokens, and paying gas fees.");
    			t5 = space();
    			div2 = element("div");
    			img = element("img");
    			t6 = space();
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t7 = space();
    			div3 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			span1 = element("span");
    			span1.textContent = "Team 10%";
    			t9 = space();
    			li1 = element("li");
    			span2 = element("span");
    			span2.textContent = "Advisors & Partners 10%";
    			t11 = space();
    			li2 = element("li");
    			span3 = element("span");
    			span3.textContent = "Private Sale 15%";
    			t13 = space();
    			li3 = element("li");
    			span4 = element("span");
    			span4.textContent = "Public Sale 20%";
    			t15 = space();
    			li4 = element("li");
    			span5 = element("span");
    			span5.textContent = "Liquidity Pool 15%";
    			t17 = space();
    			li5 = element("li");
    			span6 = element("span");
    			span6.textContent = "Foundation 30%";
    			t19 = space();
    			div4 = element("div");
    			div4.textContent = "The presale is scheduled to take place a week before the launch of our beta. Beta access will be granted to users with $Skills tokens in their wallet. The public sale of the $Skills token is scheduled for 1 month after the release of our beta.";
    			t21 = space();
    			div6 = element("div");
    			attr_dev(h2, "class", "svelte-zzundx");
    			add_location(h2, file$d, 3, 12, 138);
    			attr_dev(span0, "class", "highlight svelte-zzundx");
    			add_location(span0, file$d, 4, 52, 226);
    			attr_dev(p, "class", "svelte-zzundx");
    			add_location(p, file$d, 4, 12, 186);
    			attr_dev(div0, "id", "left-container");
    			attr_dev(div0, "class", "svelte-zzundx");
    			add_location(div0, file$d, 2, 8, 100);
    			attr_dev(div1, "class", "list svelte-zzundx");
    			set_style(div1, "width", "30%");
    			set_style(div1, "display", "flex");
    			add_location(div1, file$d, 1, 4, 39);
    			attr_dev(img, "alt", "$Skills Token");
    			attr_dev(img, "id", "coin");
    			if (!src_url_equal(img.src, img_src_value = "images/coin.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-zzundx");
    			add_location(img, file$d, 8, 8, 563);
    			attr_dev(path0, "data-value", "Team 10,000,000");
    			attr_dev(path0, "id", "0");
    			attr_dev(path0, "class", "test svelte-zzundx");
    			attr_dev(path0, "fill", "#ffffff");
    			attr_dev(path0, "d", "M150, 0 A150,150 0 0 1 234.49594861401022,26.062779328328688 L206.33063240934013,67.3751862188858 A100,100 0 0 0 150,50 Z");
    			add_location(path0, file$d, 10, 12, 719);
    			attr_dev(path1, "data-value", "Partners 10,000,000");
    			attr_dev(path1, "id", "1");
    			attr_dev(path1, "fill", "#8a2be2");
    			attr_dev(path1, "d", "M234.49594861401022, 26.062779328328688 A150,150 0 0 1 289.62924038982374,95.19420442908603 L243.0861602598825,113.46280295272402 A100,100 0 0 0 206.33063240934013,67.3751862188858 Z");
    			attr_dev(path1, "class", "svelte-zzundx");
    			add_location(path1, file$d, 11, 12, 1038);
    			attr_dev(path2, "data-value", "Private Sale 15,000,000");
    			attr_dev(path2, "id", "2");
    			attr_dev(path2, "fill", "#FF3333");
    			attr_dev(path2, "d", "M289.62924038982374, 95.19420442908603 A150,150 0 0 1 279.9081736709546,224.99244237572935 L236.60544911396977,199.99496158381956 A100,100 0 0 0 243.0861602598825,113.46280295272402 Z");
    			attr_dev(path2, "class", "svelte-zzundx");
    			add_location(path2, file$d, 12, 12, 1409);
    			attr_dev(path3, "data-value", "Public Sale 20,000,000");
    			attr_dev(path3, "id", "3");
    			attr_dev(path3, "fill", "#FFDD33");
    			attr_dev(path3, "d", "M279.9081736709546, 224.99244237572935 A150,150 0 0 1 127.65722030200284,298.32666717541645 L135.10481353466855,248.88444478361097 A100,100 0 0 0 236.60544911396977,199.99496158381956 Z");
    			attr_dev(path3, "class", "svelte-zzundx");
    			add_location(path3, file$d, 13, 12, 1785);
    			attr_dev(path4, "data-value", "Liquidity Pool 15,000,000");
    			attr_dev(path4, "id", "4");
    			attr_dev(path4, "fill", "#00ddff");
    			attr_dev(path4, "d", "M127.65722030200284, 298.32666717541645 A150,150 0 0 1 3.7649754408533056,183.39637094334898 L52.50998362723553,172.26424729556598 A100,100 0 0 0 135.10481353466855,248.88444478361097 Z");
    			attr_dev(path4, "class", "svelte-zzundx");
    			add_location(path4, file$d, 14, 12, 2162);
    			attr_dev(path5, "data-value", "Foundation 30,000,000");
    			attr_dev(path5, "id", "5");
    			attr_dev(path5, "fill", "#78FF78");
    			attr_dev(path5, "d", "M3.7649754408533056, 183.39637094334898 A150,150 0 0 1 149.97382006135282,0.000002284630625126738 L149.98254670756856,50.00000152308709 A100,100 0 0 0 52.50998362723553,172.26424729556598 Z");
    			attr_dev(path5, "class", "svelte-zzundx");
    			add_location(path5, file$d, 15, 12, 2542);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "id", "sv");
    			attr_dev(svg, "viewBox", "-50 -50 400 400");
    			add_location(svg, file$d, 9, 8, 632);
    			attr_dev(div2, "class", "svg-container svelte-zzundx");
    			add_location(div2, file$d, 7, 4, 527);
    			attr_dev(span1, "class", "svelte-zzundx");
    			add_location(span1, file$d, 30, 56, 5914);
    			attr_dev(li0, "class", "team svelte-zzundx");
    			toggle_class(li0, "box", /*selected*/ ctx[0] === 0);
    			add_location(li0, file$d, 30, 12, 5870);
    			attr_dev(span2, "class", "svelte-zzundx");
    			add_location(span2, file$d, 31, 60, 6001);
    			attr_dev(li1, "class", "advisors svelte-zzundx");
    			toggle_class(li1, "box", /*selected*/ ctx[0] === 1);
    			add_location(li1, file$d, 31, 12, 5953);
    			attr_dev(span3, "class", "svelte-zzundx");
    			add_location(span3, file$d, 32, 59, 6102);
    			attr_dev(li2, "class", "private svelte-zzundx");
    			toggle_class(li2, "box", /*selected*/ ctx[0] === 2);
    			add_location(li2, file$d, 32, 12, 6055);
    			attr_dev(span4, "class", "svelte-zzundx");
    			add_location(span4, file$d, 33, 58, 6195);
    			attr_dev(li3, "class", "public svelte-zzundx");
    			toggle_class(li3, "box", /*selected*/ ctx[0] === 3);
    			add_location(li3, file$d, 33, 12, 6149);
    			attr_dev(span5, "class", "svelte-zzundx");
    			add_location(span5, file$d, 34, 61, 6290);
    			attr_dev(li4, "class", "liquidity svelte-zzundx");
    			toggle_class(li4, "box", /*selected*/ ctx[0] === 4);
    			add_location(li4, file$d, 34, 12, 6241);
    			attr_dev(span6, "class", "svelte-zzundx");
    			add_location(span6, file$d, 35, 62, 6389);
    			attr_dev(li5, "class", "foundation svelte-zzundx");
    			toggle_class(li5, "box", /*selected*/ ctx[0] === 5);
    			add_location(li5, file$d, 35, 12, 6339);
    			set_style(ul, "align-self", "center");
    			attr_dev(ul, "class", "svelte-zzundx");
    			add_location(ul, file$d, 29, 8, 5826);
    			attr_dev(div3, "class", "list svelte-zzundx");
    			set_style(div3, "width", "30%");
    			set_style(div3, "display", "flex");
    			add_location(div3, file$d, 28, 4, 5766);
    			attr_dev(div4, "id", "notice");
    			attr_dev(div4, "class", "svelte-zzundx");
    			add_location(div4, file$d, 38, 4, 6451);
    			attr_dev(div5, "class", "tokenomics-container svelte-zzundx");
    			add_location(div5, file$d, 0, 0, 0);
    			attr_dev(div6, "id", "tooltip");
    			attr_dev(div6, "display", "none");
    			set_style(div6, "position", "absolute");
    			set_style(div6, "display", "none");
    			attr_dev(div6, "class", "svelte-zzundx");
    			add_location(div6, file$d, 41, 0, 6726);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(p, span0);
    			append_dev(p, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div2);
    			append_dev(div2, img);
    			append_dev(div2, t6);
    			append_dev(div2, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(div5, t7);
    			append_dev(div5, div3);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span1);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(li1, span2);
    			append_dev(ul, t11);
    			append_dev(ul, li2);
    			append_dev(li2, span3);
    			append_dev(ul, t13);
    			append_dev(ul, li3);
    			append_dev(li3, span4);
    			append_dev(ul, t15);
    			append_dev(ul, li4);
    			append_dev(li4, span5);
    			append_dev(ul, t17);
    			append_dev(ul, li5);
    			append_dev(li5, span6);
    			append_dev(div5, t19);
    			append_dev(div5, div4);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div6, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path0, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path0, "focus", showTooltip, false, false, false),
    					listen_dev(path0, "mousemove", showTooltip, false, false, false),
    					listen_dev(path0, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path1, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path1, "focus", showTooltip, false, false, false),
    					listen_dev(path1, "mousemove", showTooltip, false, false, false),
    					listen_dev(path1, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path2, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path2, "focus", showTooltip, false, false, false),
    					listen_dev(path2, "mousemove", showTooltip, false, false, false),
    					listen_dev(path2, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path3, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path3, "focus", showTooltip, false, false, false),
    					listen_dev(path3, "mousemove", showTooltip, false, false, false),
    					listen_dev(path3, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path4, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path4, "focus", showTooltip, false, false, false),
    					listen_dev(path4, "mousemove", showTooltip, false, false, false),
    					listen_dev(path4, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path5, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path5, "focus", showTooltip, false, false, false),
    					listen_dev(path5, "mousemove", showTooltip, false, false, false),
    					listen_dev(path5, "mouseleave", /*deselect*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected*/ 1) {
    				toggle_class(li0, "box", /*selected*/ ctx[0] === 0);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li1, "box", /*selected*/ ctx[0] === 1);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li2, "box", /*selected*/ ctx[0] === 2);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li3, "box", /*selected*/ ctx[0] === 3);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li4, "box", /*selected*/ ctx[0] === 4);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li5, "box", /*selected*/ ctx[0] === 5);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div6);
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

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function grow(e) {
    	await sleep(500);
    	let coin = document.getElementById("coin");
    	coin.style.transform = "scale(1.15)";
    	coin.style.zIndex = "-1";
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

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tokenomics', slots, []);
    	let color = '#78FF78';
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Tokenomics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		color,
    		sleep,
    		grow,
    		showTooltip,
    		hideTooltip,
    		selected,
    		bringToFront,
    		deselect,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) color = $$props.color;
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('data' in $$props) data = $$props.data;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, bringToFront, deselect];
    }

    class Tokenomics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tokenomics",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/Challenge.svelte generated by Svelte v3.44.3 */
    const file$c = "src/Challenge.svelte";

    function create_fragment$d(ctx) {
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
    	let t16_value = /*$_*/ ctx[0]('home.challenges.videos.title') + "";
    	let t16;
    	let t17;
    	let p5;
    	let t18_value = /*$_*/ ctx[0]('home.challenges.videos.pStart') + "";
    	let t18;
    	let t19;
    	let span5;
    	let t20_value = /*$_*/ ctx[0]('home.challenges.videos.highlighted') + "";
    	let t20;
    	let t21_value = /*$_*/ ctx[0]('home.challenges.videos.pEnd') + "";
    	let t21;
    	let t22;
    	let div9;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t23;
    	let div6;
    	let p6;
    	let t25;
    	let p7;
    	let t27;
    	let div5;
    	let p8;
    	let t29;
    	let p9;
    	let t31;
    	let p10;
    	let t33;
    	let div8;
    	let h31;
    	let t34_value = /*$_*/ ctx[0]('home.challenges.challenges.title') + "";
    	let t34;
    	let t35;
    	let p11;
    	let t36_value = /*$_*/ ctx[0]('home.challenges.challenges.pStart') + "";
    	let t36;
    	let t37;
    	let span6;
    	let t38_value = /*$_*/ ctx[0]('home.challenges.challenges.highlighted') + "";
    	let t38;
    	let t39;
    	let t40_value = /*$_*/ ctx[0]('home.challenges.challenges.pEnd') + "";
    	let t40;
    	let t41;
    	let div13;
    	let div11;
    	let img2;
    	let img2_src_value;
    	let t42;
    	let div10;
    	let p12;
    	let t44;
    	let div12;
    	let h32;
    	let t45_value = /*$_*/ ctx[0]('home.challenges.votes.title') + "";
    	let t45;
    	let t46;
    	let p13;
    	let t47_value = /*$_*/ ctx[0]('home.challenges.votes.pStart') + "";
    	let t47;
    	let t48;
    	let span7;
    	let t49_value = /*$_*/ ctx[0]('home.challenges.votes.highlighted') + "";
    	let t49;
    	let t50;
    	let t51_value = /*$_*/ ctx[0]('home.challenges.votes.pEnd') + "";
    	let t51;
    	let t52;
    	let div18;
    	let div16;
    	let div14;
    	let t53;
    	let div15;
    	let button;
    	let t55;
    	let img3;
    	let img3_src_value;
    	let t56;
    	let div17;
    	let h33;
    	let t57_value = /*$_*/ ctx[0]('home.challenges.earn.title') + "";
    	let t57;
    	let t58;
    	let p14;
    	let t59_value = /*$_*/ ctx[0]('home.challenges.earn.pStart') + "";
    	let t59;
    	let span8;
    	let t60_value = /*$_*/ ctx[0]('home.challenges.earn.highlighted') + "";
    	let t60;
    	let mounted;
    	let dispose;

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
    			t16 = text(t16_value);
    			t17 = space();
    			p5 = element("p");
    			t18 = text(t18_value);
    			t19 = space();
    			span5 = element("span");
    			t20 = text(t20_value);
    			t21 = text(t21_value);
    			t22 = space();
    			div9 = element("div");
    			div7 = element("div");
    			img1 = element("img");
    			t23 = space();
    			div6 = element("div");
    			p6 = element("p");
    			p6.textContent = "Users will have the option to save their video to their camera roll.";
    			t25 = space();
    			p7 = element("p");
    			p7.textContent = "Choose a unique name for your trickshot.";
    			t27 = space();
    			div5 = element("div");
    			p8 = element("p");
    			p8.textContent = "By adding SkillsTags to each video, users will be able to increase their reach and voting results.";
    			t29 = space();
    			p9 = element("p");
    			p9.textContent = "Users will be able to use this area to search for or create their own SkillsTags for their video.";
    			t31 = space();
    			p10 = element("p");
    			p10.textContent = "A total of 6 SkillsTags will be listed and added to each video.";
    			t33 = space();
    			div8 = element("div");
    			h31 = element("h3");
    			t34 = text(t34_value);
    			t35 = space();
    			p11 = element("p");
    			t36 = text(t36_value);
    			t37 = space();
    			span6 = element("span");
    			t38 = text(t38_value);
    			t39 = space();
    			t40 = text(t40_value);
    			t41 = space();
    			div13 = element("div");
    			div11 = element("div");
    			img2 = element("img");
    			t42 = space();
    			div10 = element("div");
    			p12 = element("p");
    			p12.textContent = "Users will see freezeframe of the 2 videos and they can tap on the Play button to watch each video.";
    			t44 = space();
    			div12 = element("div");
    			h32 = element("h3");
    			t45 = text(t45_value);
    			t46 = space();
    			p13 = element("p");
    			t47 = text(t47_value);
    			t48 = space();
    			span7 = element("span");
    			t49 = text(t49_value);
    			t50 = space();
    			t51 = text(t51_value);
    			t52 = space();
    			div18 = element("div");
    			div16 = element("div");
    			div14 = element("div");
    			t53 = space();
    			div15 = element("div");
    			button = element("button");
    			button.textContent = "View Results";
    			t55 = space();
    			img3 = element("img");
    			t56 = space();
    			div17 = element("div");
    			h33 = element("h3");
    			t57 = text(t57_value);
    			t58 = space();
    			p14 = element("p");
    			t59 = text(t59_value);
    			span8 = element("span");
    			t60 = text(t60_value);
    			attr_dev(img0, "alt", "Edit videos");
    			attr_dev(img0, "class", "phone svelte-17wm7hn");
    			if (!src_url_equal(img0.src, img0_src_value = "images/challenge_edit.webp")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$c, 5, 12, 117);
    			set_style(span0, "text-decoration", "underline");
    			add_location(span0, file$c, 7, 49, 305);
    			add_location(br0, file$c, 7, 102, 358);
    			attr_dev(p0, "id", "music");
    			attr_dev(p0, "class", "extra-info svelte-17wm7hn");
    			add_location(p0, file$c, 7, 16, 272);
    			set_style(span1, "text-decoration", "underline");
    			add_location(span1, file$c, 8, 51, 493);
    			add_location(br1, file$c, 8, 106, 548);
    			attr_dev(p1, "id", "filters");
    			attr_dev(p1, "class", "extra-info svelte-17wm7hn");
    			add_location(p1, file$c, 8, 16, 458);
    			set_style(span2, "text-decoration", "underline");
    			add_location(span2, file$c, 9, 51, 678);
    			add_location(br2, file$c, 9, 106, 733);
    			attr_dev(p2, "id", "effects");
    			attr_dev(p2, "class", "extra-info svelte-17wm7hn");
    			add_location(p2, file$c, 9, 16, 643);
    			set_style(span3, "text-decoration", "underline");
    			add_location(span3, file$c, 10, 58, 887);
    			add_location(br3, file$c, 10, 110, 939);
    			attr_dev(p3, "id", "gifs");
    			attr_dev(p3, "class", "extra-info info-left svelte-17wm7hn");
    			add_location(p3, file$c, 10, 16, 845);
    			set_style(span4, "text-decoration", "underline");
    			add_location(span4, file$c, 11, 58, 1102);
    			add_location(br4, file$c, 11, 110, 1154);
    			attr_dev(p4, "id", "crop");
    			attr_dev(p4, "class", "extra-info info-left svelte-17wm7hn");
    			add_location(p4, file$c, 11, 16, 1060);
    			attr_dev(div0, "class", "tooltips svelte-17wm7hn");
    			set_style(div0, "color", "rgb(200,255,255)");
    			add_location(div0, file$c, 6, 12, 202);
    			attr_dev(div1, "class", "image first svelte-17wm7hn");
    			add_location(div1, file$c, 4, 8, 79);
    			attr_dev(h30, "class", "title svelte-17wm7hn");
    			set_style(h30, "background-image", "linear-gradient(aqua, aqua)");
    			add_location(h30, file$c, 16, 12, 1340);
    			set_style(span5, "color", "aqua");
    			add_location(span5, file$c, 17, 53, 1508);
    			attr_dev(p5, "class", "svelte-17wm7hn");
    			add_location(p5, file$c, 17, 12, 1467);
    			add_location(div2, file$c, 15, 12, 1322);
    			attr_dev(div3, "class", "content second svelte-17wm7hn");
    			add_location(div3, file$c, 14, 8, 1281);
    			attr_dev(div4, "class", "info-section svelte-17wm7hn");
    			add_location(div4, file$c, 3, 4, 44);
    			attr_dev(img1, "alt", "Upload videos");
    			attr_dev(img1, "class", "phone svelte-17wm7hn");
    			if (!src_url_equal(img1.src, img1_src_value = "images/challenge_upload.webp")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$c, 23, 12, 1746);
    			attr_dev(p6, "id", "music");
    			attr_dev(p6, "class", "extra-info info-left svelte-17wm7hn");
    			add_location(p6, file$c, 25, 16, 1905);
    			attr_dev(p7, "id", "name");
    			attr_dev(p7, "class", "extra-info info-left svelte-17wm7hn");
    			add_location(p7, file$c, 26, 16, 2037);
    			attr_dev(p8, "class", "svelte-17wm7hn");
    			add_location(p8, file$c, 28, 20, 2205);
    			attr_dev(p9, "class", "svelte-17wm7hn");
    			add_location(p9, file$c, 29, 20, 2331);
    			attr_dev(p10, "class", "svelte-17wm7hn");
    			add_location(p10, file$c, 30, 20, 2456);
    			attr_dev(div5, "id", "tags");
    			attr_dev(div5, "class", "extra-info info-left svelte-17wm7hn");
    			add_location(div5, file$c, 27, 16, 2140);
    			attr_dev(div6, "class", "tooltips svelte-17wm7hn");
    			set_style(div6, "color", "rgb(255,150,150)");
    			add_location(div6, file$c, 24, 12, 1835);
    			attr_dev(div7, "class", "image second svelte-17wm7hn");
    			add_location(div7, file$c, 22, 8, 1707);
    			attr_dev(h31, "class", "title svelte-17wm7hn");
    			set_style(h31, "background-image", "linear-gradient(red,red)");
    			add_location(h31, file$c, 35, 12, 2632);
    			set_style(span6, "color", "red");
    			add_location(span6, file$c, 36, 58, 2806);
    			attr_dev(p11, "class", "svelte-17wm7hn");
    			add_location(p11, file$c, 36, 12, 2760);
    			attr_dev(div8, "class", "content first svelte-17wm7hn");
    			add_location(div8, file$c, 34, 8, 2592);
    			attr_dev(div9, "class", "info-section svelte-17wm7hn");
    			add_location(div9, file$c, 21, 4, 1672);
    			attr_dev(img2, "alt", "Users vote for winner");
    			attr_dev(img2, "class", "phone svelte-17wm7hn");
    			if (!src_url_equal(img2.src, img2_src_value = "images/challenge_current.webp")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$c, 41, 12, 3032);
    			attr_dev(p12, "id", "music");
    			attr_dev(p12, "class", "extra-info svelte-17wm7hn");
    			add_location(p12, file$c, 43, 16, 3200);
    			attr_dev(div10, "class", "tooltips svelte-17wm7hn");
    			set_style(div10, "color", "rgb(225,175,255)");
    			add_location(div10, file$c, 42, 12, 3130);
    			attr_dev(div11, "class", "image first svelte-17wm7hn");
    			add_location(div11, file$c, 40, 8, 2994);
    			attr_dev(h32, "class", "title svelte-17wm7hn");
    			set_style(h32, "background-image", "linear-gradient(blueviolet,blueviolet)");
    			add_location(h32, file$c, 47, 12, 3420);
    			set_style(span7, "color", "blueviolet");
    			add_location(span7, file$c, 48, 52, 3597);
    			attr_dev(p13, "class", "svelte-17wm7hn");
    			add_location(p13, file$c, 48, 12, 3557);
    			attr_dev(div12, "class", "content second svelte-17wm7hn");
    			add_location(div12, file$c, 46, 8, 3379);
    			attr_dev(div13, "class", "info-section svelte-17wm7hn");
    			add_location(div13, file$c, 39, 4, 2959);
    			attr_dev(div14, "id", "winModal");
    			set_style(div14, "display", "none");
    			attr_dev(div14, "class", "svelte-17wm7hn");
    			add_location(div14, file$c, 53, 12, 3821);
    			attr_dev(button, "class", "shake svelte-17wm7hn");
    			attr_dev(button, "id", "resButton");
    			add_location(button, file$c, 62, 32, 4252);
    			attr_dev(div15, "id", "doneModal");
    			attr_dev(div15, "class", "svelte-17wm7hn");
    			add_location(div15, file$c, 62, 12, 4232);
    			attr_dev(img3, "alt", "Rewards");
    			attr_dev(img3, "class", "phone svelte-17wm7hn");
    			if (!src_url_equal(img3.src, img3_src_value = "images/challenge_win.webp")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$c, 63, 12, 4352);
    			attr_dev(div16, "class", "image second svelte-17wm7hn");
    			add_location(div16, file$c, 52, 8, 3782);
    			attr_dev(h33, "class", "title svelte-17wm7hn");
    			set_style(h33, "background-image", "linear-gradient(gold,gold)");
    			add_location(h33, file$c, 66, 12, 4483);
    			set_style(span8, "color", "gold");
    			add_location(span8, file$c, 67, 50, 4645);
    			attr_dev(p14, "class", "svelte-17wm7hn");
    			add_location(p14, file$c, 67, 12, 4607);
    			attr_dev(div17, "class", "content first svelte-17wm7hn");
    			add_location(div17, file$c, 65, 8, 4443);
    			attr_dev(div18, "class", "info-section svelte-17wm7hn");
    			add_location(div18, file$c, 51, 4, 3747);
    			attr_dev(div19, "class", "challenge-container svelte-17wm7hn");
    			add_location(div19, file$c, 1, 0, 1);
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
    			append_dev(h30, t16);
    			append_dev(div2, t17);
    			append_dev(div2, p5);
    			append_dev(p5, t18);
    			append_dev(p5, t19);
    			append_dev(p5, span5);
    			append_dev(span5, t20);
    			append_dev(p5, t21);
    			append_dev(div19, t22);
    			append_dev(div19, div9);
    			append_dev(div9, div7);
    			append_dev(div7, img1);
    			append_dev(div7, t23);
    			append_dev(div7, div6);
    			append_dev(div6, p6);
    			append_dev(div6, t25);
    			append_dev(div6, p7);
    			append_dev(div6, t27);
    			append_dev(div6, div5);
    			append_dev(div5, p8);
    			append_dev(div5, t29);
    			append_dev(div5, p9);
    			append_dev(div5, t31);
    			append_dev(div5, p10);
    			append_dev(div9, t33);
    			append_dev(div9, div8);
    			append_dev(div8, h31);
    			append_dev(h31, t34);
    			append_dev(div8, t35);
    			append_dev(div8, p11);
    			append_dev(p11, t36);
    			append_dev(p11, t37);
    			append_dev(p11, span6);
    			append_dev(span6, t38);
    			append_dev(p11, t39);
    			append_dev(p11, t40);
    			append_dev(div19, t41);
    			append_dev(div19, div13);
    			append_dev(div13, div11);
    			append_dev(div11, img2);
    			append_dev(div11, t42);
    			append_dev(div11, div10);
    			append_dev(div10, p12);
    			append_dev(div13, t44);
    			append_dev(div13, div12);
    			append_dev(div12, h32);
    			append_dev(h32, t45);
    			append_dev(div12, t46);
    			append_dev(div12, p13);
    			append_dev(p13, t47);
    			append_dev(p13, t48);
    			append_dev(p13, span7);
    			append_dev(span7, t49);
    			append_dev(p13, t50);
    			append_dev(p13, t51);
    			append_dev(div19, t52);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			append_dev(div16, div14);
    			append_dev(div16, t53);
    			append_dev(div16, div15);
    			append_dev(div15, button);
    			append_dev(div16, t55);
    			append_dev(div16, img3);
    			append_dev(div18, t56);
    			append_dev(div18, div17);
    			append_dev(div17, h33);
    			append_dev(h33, t57);
    			append_dev(div17, t58);
    			append_dev(div17, p14);
    			append_dev(p14, t59);
    			append_dev(p14, span8);
    			append_dev(span8, t60);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", showResults, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$_*/ 1 && t16_value !== (t16_value = /*$_*/ ctx[0]('home.challenges.videos.title') + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*$_*/ 1 && t18_value !== (t18_value = /*$_*/ ctx[0]('home.challenges.videos.pStart') + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*$_*/ 1 && t20_value !== (t20_value = /*$_*/ ctx[0]('home.challenges.videos.highlighted') + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*$_*/ 1 && t21_value !== (t21_value = /*$_*/ ctx[0]('home.challenges.videos.pEnd') + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*$_*/ 1 && t34_value !== (t34_value = /*$_*/ ctx[0]('home.challenges.challenges.title') + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*$_*/ 1 && t36_value !== (t36_value = /*$_*/ ctx[0]('home.challenges.challenges.pStart') + "")) set_data_dev(t36, t36_value);
    			if (dirty & /*$_*/ 1 && t38_value !== (t38_value = /*$_*/ ctx[0]('home.challenges.challenges.highlighted') + "")) set_data_dev(t38, t38_value);
    			if (dirty & /*$_*/ 1 && t40_value !== (t40_value = /*$_*/ ctx[0]('home.challenges.challenges.pEnd') + "")) set_data_dev(t40, t40_value);
    			if (dirty & /*$_*/ 1 && t45_value !== (t45_value = /*$_*/ ctx[0]('home.challenges.votes.title') + "")) set_data_dev(t45, t45_value);
    			if (dirty & /*$_*/ 1 && t47_value !== (t47_value = /*$_*/ ctx[0]('home.challenges.votes.pStart') + "")) set_data_dev(t47, t47_value);
    			if (dirty & /*$_*/ 1 && t49_value !== (t49_value = /*$_*/ ctx[0]('home.challenges.votes.highlighted') + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*$_*/ 1 && t51_value !== (t51_value = /*$_*/ ctx[0]('home.challenges.votes.pEnd') + "")) set_data_dev(t51, t51_value);
    			if (dirty & /*$_*/ 1 && t57_value !== (t57_value = /*$_*/ ctx[0]('home.challenges.earn.title') + "")) set_data_dev(t57, t57_value);
    			if (dirty & /*$_*/ 1 && t59_value !== (t59_value = /*$_*/ ctx[0]('home.challenges.earn.pStart') + "")) set_data_dev(t59, t59_value);
    			if (dirty & /*$_*/ 1 && t60_value !== (t60_value = /*$_*/ ctx[0]('home.challenges.earn.highlighted') + "")) set_data_dev(t60, t60_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div19);
    			mounted = false;
    			dispose();
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

    function showResults(e) {
    	//e.target.style.zIndex = "5";
    	e.target.classList.remove('shake');

    	e.target.classList.add('open');

    	setTimeout(
    		() => {
    			e.target.style.zIndex = "5";
    			document.getElementById("winModal").style.display = "block";
    		},
    		2000
    	);
    } //document.getElementById("winModal").style.display = "block";

    function instance$d($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(0, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Challenge', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Challenge> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ _: X, showResults, $_ });
    	return [$_];
    }

    class Challenge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Challenge",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/VoteToken.svelte generated by Svelte v3.44.3 */
    const file$b = "src/VoteToken.svelte";

    function create_fragment$c(ctx) {
    	let div14;
    	let div0;
    	let span0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h30;
    	let t1_value = /*$_*/ ctx[0]('home.vote.cast.title') + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*$_*/ ctx[0]('home.vote.cast.pStart') + "";
    	let t3;
    	let t4;
    	let span1;
    	let t5_value = /*$_*/ ctx[0]('home.vote.cast.highlighted') + "";
    	let t5;
    	let t6;
    	let t7_value = /*$_*/ ctx[0]('home.vote.cast.pEnd') + "";
    	let t7;
    	let t8;
    	let div1;
    	let span2;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let h31;
    	let t10_value = /*$_*/ ctx[0]('home.vote.earn.title') + "";
    	let t10;
    	let t11;
    	let p1;
    	let t12_value = /*$_*/ ctx[0]('home.vote.earn.pStart') + "";
    	let t12;
    	let t13;
    	let span3;
    	let t14_value = /*$_*/ ctx[0]('home.vote.earn.highlighted') + "";
    	let t14;
    	let t15;
    	let t16_value = /*$_*/ ctx[0]('home.vote.earn.pEnd') + "";
    	let t16;
    	let t17;
    	let div2;
    	let span4;
    	let img2;
    	let img2_src_value;
    	let t18;
    	let h32;
    	let t19_value = /*$_*/ ctx[0]('home.vote.success.title') + "";
    	let t19;
    	let t20;
    	let p2;
    	let t21_value = /*$_*/ ctx[0]('home.vote.success.pStart') + "";
    	let t21;
    	let t22;
    	let span5;
    	let t23_value = /*$_*/ ctx[0]('home.vote.success.highlighted') + "";
    	let t23;
    	let t24;
    	let t25_value = /*$_*/ ctx[0]('home.vote.success.pEnd') + "";
    	let t25;
    	let t26;
    	let div10;
    	let h1;
    	let t28;
    	let div9;
    	let div7;
    	let div3;
    	let t29;
    	let span6;
    	let t30;
    	let div6;
    	let div4;
    	let t32;
    	let div5;
    	let t34;
    	let span7;
    	let t36;
    	let span8;
    	let t38;
    	let div8;
    	let t39;
    	let div11;
    	let span9;
    	let img3;
    	let img3_src_value;
    	let t40;
    	let h33;
    	let t41_value = /*$_*/ ctx[0]('home.vote.stable.title') + "";
    	let t41;
    	let t42;
    	let p3;
    	let t43_value = /*$_*/ ctx[0]('home.vote.stable.pStart') + "";
    	let t43;
    	let t44;
    	let span10;
    	let t45_value = /*$_*/ ctx[0]('home.vote.stable.highlighted') + "";
    	let t45;
    	let t46;
    	let t47_value = /*$_*/ ctx[0]('home.vote.stable.pEnd') + "";
    	let t47;
    	let t48;
    	let div12;
    	let span11;
    	let img4;
    	let img4_src_value;
    	let t49;
    	let h34;
    	let t50_value = /*$_*/ ctx[0]('home.vote.stake.title') + "";
    	let t50;
    	let t51;
    	let p4;
    	let t52_value = /*$_*/ ctx[0]('home.vote.stake.pStart') + "";
    	let t52;
    	let t53;
    	let span12;
    	let t54_value = /*$_*/ ctx[0]('home.vote.stake.highlighted') + "";
    	let t54;
    	let t55;
    	let t56_value = /*$_*/ ctx[0]('home.vote.stake.pEnd') + "";
    	let t56;
    	let t57;
    	let div13;
    	let span13;
    	let img5;
    	let img5_src_value;
    	let t58;
    	let h35;
    	let t59_value = /*$_*/ ctx[0]('home.vote.replenish.title') + "";
    	let t59;
    	let t60;
    	let p5;
    	let t61_value = /*$_*/ ctx[0]('home.vote.replenish.pStart') + "";
    	let t61;
    	let t62;
    	let span14;
    	let t63_value = /*$_*/ ctx[0]('home.vote.replenish.highlighted') + "";
    	let t63;
    	let t64;
    	let t65_value = /*$_*/ ctx[0]('home.vote.replenish.pEnd') + "";
    	let t65;

    	const block = {
    		c: function create() {
    			div14 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			img0 = element("img");
    			t0 = space();
    			h30 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			div1 = element("div");
    			span2 = element("span");
    			img1 = element("img");
    			t9 = space();
    			h31 = element("h3");
    			t10 = text(t10_value);
    			t11 = space();
    			p1 = element("p");
    			t12 = text(t12_value);
    			t13 = space();
    			span3 = element("span");
    			t14 = text(t14_value);
    			t15 = space();
    			t16 = text(t16_value);
    			t17 = space();
    			div2 = element("div");
    			span4 = element("span");
    			img2 = element("img");
    			t18 = space();
    			h32 = element("h3");
    			t19 = text(t19_value);
    			t20 = space();
    			p2 = element("p");
    			t21 = text(t21_value);
    			t22 = space();
    			span5 = element("span");
    			t23 = text(t23_value);
    			t24 = space();
    			t25 = text(t25_value);
    			t26 = space();
    			div10 = element("div");
    			h1 = element("h1");
    			h1.textContent = "1 $Vote ≈ $0.10";
    			t28 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div3 = element("div");
    			t29 = space();
    			span6 = element("span");
    			t30 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "10¢";
    			t32 = space();
    			div5 = element("div");
    			div5.textContent = "10¢";
    			t34 = space();
    			span7 = element("span");
    			span7.textContent = "Vote";
    			t36 = space();
    			span8 = element("span");
    			span8.textContent = "Token";
    			t38 = space();
    			div8 = element("div");
    			t39 = space();
    			div11 = element("div");
    			span9 = element("span");
    			img3 = element("img");
    			t40 = space();
    			h33 = element("h3");
    			t41 = text(t41_value);
    			t42 = space();
    			p3 = element("p");
    			t43 = text(t43_value);
    			t44 = space();
    			span10 = element("span");
    			t45 = text(t45_value);
    			t46 = space();
    			t47 = text(t47_value);
    			t48 = space();
    			div12 = element("div");
    			span11 = element("span");
    			img4 = element("img");
    			t49 = space();
    			h34 = element("h3");
    			t50 = text(t50_value);
    			t51 = space();
    			p4 = element("p");
    			t52 = text(t52_value);
    			t53 = space();
    			span12 = element("span");
    			t54 = text(t54_value);
    			t55 = text(". ");
    			t56 = text(t56_value);
    			t57 = space();
    			div13 = element("div");
    			span13 = element("span");
    			img5 = element("img");
    			t58 = space();
    			h35 = element("h3");
    			t59 = text(t59_value);
    			t60 = space();
    			p5 = element("p");
    			t61 = text(t61_value);
    			t62 = space();
    			span14 = element("span");
    			t63 = text(t63_value);
    			t64 = space();
    			t65 = text(t65_value);
    			attr_dev(img0, "alt", "Vote");
    			if (!src_url_equal(img0.src, img0_src_value = "images/vote.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1otaeng");
    			add_location(img0, file$b, 3, 12, 107);
    			attr_dev(h30, "class", "svelte-1otaeng");
    			add_location(h30, file$b, 4, 16, 164);
    			attr_dev(span0, "class", "title svelte-1otaeng");
    			add_location(span0, file$b, 2, 11, 74);
    			attr_dev(span1, "class", "highlight svelte-1otaeng");
    			add_location(span1, file$b, 6, 44, 266);
    			attr_dev(p0, "class", "svelte-1otaeng");
    			add_location(p0, file$b, 6, 11, 233);
    			attr_dev(div0, "class", "section left svelte-1otaeng");
    			add_location(div0, file$b, 1, 7, 36);
    			attr_dev(img1, "alt", "Earnings");
    			if (!src_url_equal(img1.src, img1_src_value = "images/earnings.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1otaeng");
    			add_location(img1, file$b, 10, 12, 453);
    			attr_dev(h31, "class", "svelte-1otaeng");
    			add_location(h31, file$b, 11, 13, 515);
    			attr_dev(span2, "class", "title svelte-1otaeng");
    			add_location(span2, file$b, 9, 8, 420);
    			attr_dev(span3, "class", "highlight svelte-1otaeng");
    			add_location(span3, file$b, 13, 41, 611);
    			attr_dev(p1, "class", "svelte-1otaeng");
    			add_location(p1, file$b, 13, 8, 578);
    			attr_dev(div1, "class", "section left svelte-1otaeng");
    			add_location(div1, file$b, 8, 7, 385);
    			attr_dev(img2, "alt", "Royalties");
    			if (!src_url_equal(img2.src, img2_src_value = "images/revenue.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1otaeng");
    			add_location(img2, file$b, 17, 12, 792);
    			attr_dev(h32, "class", "svelte-1otaeng");
    			add_location(h32, file$b, 18, 13, 854);
    			attr_dev(span4, "class", "title svelte-1otaeng");
    			add_location(span4, file$b, 16, 8, 759);
    			attr_dev(span5, "class", "highlight svelte-1otaeng");
    			add_location(span5, file$b, 20, 44, 956);
    			attr_dev(p2, "class", "svelte-1otaeng");
    			add_location(p2, file$b, 20, 8, 920);
    			attr_dev(div2, "class", "section left svelte-1otaeng");
    			add_location(div2, file$b, 15, 4, 724);
    			attr_dev(h1, "id", "value");
    			attr_dev(h1, "class", "svelte-1otaeng");
    			add_location(h1, file$b, 23, 8, 1111);
    			attr_dev(div3, "class", "star svelte-1otaeng");
    			add_location(div3, file$b, 26, 14, 1225);
    			attr_dev(span6, "class", "currency svelte-1otaeng");
    			add_location(span6, file$b, 27, 14, 1264);
    			attr_dev(div4, "class", "shape_l svelte-1otaeng");
    			add_location(div4, file$b, 29, 16, 1346);
    			attr_dev(div5, "class", "shape_r svelte-1otaeng");
    			add_location(div5, file$b, 30, 16, 1393);
    			attr_dev(span7, "class", "top svelte-1otaeng");
    			add_location(span7, file$b, 31, 16, 1440);
    			attr_dev(span8, "class", "bottom svelte-1otaeng");
    			add_location(span8, file$b, 32, 16, 1486);
    			attr_dev(div6, "class", "shapes svelte-1otaeng");
    			add_location(div6, file$b, 28, 14, 1309);
    			attr_dev(div7, "class", "front jump svelte-1otaeng");
    			add_location(div7, file$b, 25, 12, 1186);
    			attr_dev(div8, "class", "shadow svelte-1otaeng");
    			add_location(div8, file$b, 35, 12, 1572);
    			attr_dev(div9, "class", "coin svelte-1otaeng");
    			add_location(div9, file$b, 24, 8, 1155);
    			attr_dev(div10, "class", "column middle svelte-1otaeng");
    			add_location(div10, file$b, 22, 4, 1075);
    			attr_dev(img3, "alt", "Stable value");
    			if (!src_url_equal(img3.src, img3_src_value = "images/stable.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1otaeng");
    			add_location(img3, file$b, 42, 16, 1797);
    			attr_dev(h33, "class", "svelte-1otaeng");
    			add_location(h33, file$b, 43, 17, 1865);
    			attr_dev(span9, "class", "title svelte-1otaeng");
    			add_location(span9, file$b, 41, 12, 1760);
    			attr_dev(span10, "class", "highlight svelte-1otaeng");
    			add_location(span10, file$b, 45, 47, 1973);
    			attr_dev(p3, "class", "svelte-1otaeng");
    			add_location(p3, file$b, 45, 12, 1938);
    			attr_dev(div11, "class", "section right svelte-1otaeng");
    			add_location(div11, file$b, 40, 8, 1720);
    			attr_dev(img4, "alt", "Stake");
    			if (!src_url_equal(img4.src, img4_src_value = "images/stake.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1otaeng");
    			add_location(img4, file$b, 49, 16, 2175);
    			attr_dev(h34, "class", "svelte-1otaeng");
    			add_location(h34, file$b, 50, 17, 2235);
    			attr_dev(span11, "class", "title svelte-1otaeng");
    			add_location(span11, file$b, 48, 12, 2138);
    			attr_dev(span12, "class", "highlight svelte-1otaeng");
    			add_location(span12, file$b, 52, 46, 2341);
    			attr_dev(p4, "class", "svelte-1otaeng");
    			add_location(p4, file$b, 52, 12, 2307);
    			attr_dev(div12, "class", "section right svelte-1otaeng");
    			add_location(div12, file$b, 47, 8, 2098);
    			attr_dev(img5, "alt", "Replenish");
    			if (!src_url_equal(img5.src, img5_src_value = "images/replenish.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "svelte-1otaeng");
    			add_location(img5, file$b, 56, 16, 2542);
    			attr_dev(h35, "class", "svelte-1otaeng");
    			add_location(h35, file$b, 57, 17, 2610);
    			attr_dev(span13, "class", "title svelte-1otaeng");
    			add_location(span13, file$b, 55, 12, 2505);
    			attr_dev(span14, "class", "highlight svelte-1otaeng");
    			add_location(span14, file$b, 59, 51, 2725);
    			attr_dev(p5, "class", "svelte-1otaeng");
    			add_location(p5, file$b, 59, 13, 2687);
    			attr_dev(div13, "class", "section right svelte-1otaeng");
    			add_location(div13, file$b, 54, 8, 2465);
    			attr_dev(div14, "class", "vote-container svelte-1otaeng");
    			add_location(div14, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div14, anchor);
    			append_dev(div14, div0);
    			append_dev(div0, span0);
    			append_dev(span0, img0);
    			append_dev(span0, t0);
    			append_dev(span0, h30);
    			append_dev(h30, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(p0, span1);
    			append_dev(span1, t5);
    			append_dev(p0, t6);
    			append_dev(p0, t7);
    			append_dev(div14, t8);
    			append_dev(div14, div1);
    			append_dev(div1, span2);
    			append_dev(span2, img1);
    			append_dev(span2, t9);
    			append_dev(span2, h31);
    			append_dev(h31, t10);
    			append_dev(div1, t11);
    			append_dev(div1, p1);
    			append_dev(p1, t12);
    			append_dev(p1, t13);
    			append_dev(p1, span3);
    			append_dev(span3, t14);
    			append_dev(p1, t15);
    			append_dev(p1, t16);
    			append_dev(div14, t17);
    			append_dev(div14, div2);
    			append_dev(div2, span4);
    			append_dev(span4, img2);
    			append_dev(span4, t18);
    			append_dev(span4, h32);
    			append_dev(h32, t19);
    			append_dev(div2, t20);
    			append_dev(div2, p2);
    			append_dev(p2, t21);
    			append_dev(p2, t22);
    			append_dev(p2, span5);
    			append_dev(span5, t23);
    			append_dev(p2, t24);
    			append_dev(p2, t25);
    			append_dev(div14, t26);
    			append_dev(div14, div10);
    			append_dev(div10, h1);
    			append_dev(div10, t28);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div7, div3);
    			append_dev(div7, t29);
    			append_dev(div7, span6);
    			append_dev(div7, t30);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t32);
    			append_dev(div6, div5);
    			append_dev(div6, t34);
    			append_dev(div6, span7);
    			append_dev(div6, t36);
    			append_dev(div6, span8);
    			append_dev(div9, t38);
    			append_dev(div9, div8);
    			append_dev(div14, t39);
    			append_dev(div14, div11);
    			append_dev(div11, span9);
    			append_dev(span9, img3);
    			append_dev(span9, t40);
    			append_dev(span9, h33);
    			append_dev(h33, t41);
    			append_dev(div11, t42);
    			append_dev(div11, p3);
    			append_dev(p3, t43);
    			append_dev(p3, t44);
    			append_dev(p3, span10);
    			append_dev(span10, t45);
    			append_dev(p3, t46);
    			append_dev(p3, t47);
    			append_dev(div14, t48);
    			append_dev(div14, div12);
    			append_dev(div12, span11);
    			append_dev(span11, img4);
    			append_dev(span11, t49);
    			append_dev(span11, h34);
    			append_dev(h34, t50);
    			append_dev(div12, t51);
    			append_dev(div12, p4);
    			append_dev(p4, t52);
    			append_dev(p4, t53);
    			append_dev(p4, span12);
    			append_dev(span12, t54);
    			append_dev(p4, t55);
    			append_dev(p4, t56);
    			append_dev(div14, t57);
    			append_dev(div14, div13);
    			append_dev(div13, span13);
    			append_dev(span13, img5);
    			append_dev(span13, t58);
    			append_dev(span13, h35);
    			append_dev(h35, t59);
    			append_dev(div13, t60);
    			append_dev(div13, p5);
    			append_dev(p5, t61);
    			append_dev(p5, t62);
    			append_dev(p5, span14);
    			append_dev(span14, t63);
    			append_dev(p5, t64);
    			append_dev(p5, t65);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$_*/ 1 && t1_value !== (t1_value = /*$_*/ ctx[0]('home.vote.cast.title') + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$_*/ 1 && t3_value !== (t3_value = /*$_*/ ctx[0]('home.vote.cast.pStart') + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$_*/ 1 && t5_value !== (t5_value = /*$_*/ ctx[0]('home.vote.cast.highlighted') + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*$_*/ 1 && t7_value !== (t7_value = /*$_*/ ctx[0]('home.vote.cast.pEnd') + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$_*/ 1 && t10_value !== (t10_value = /*$_*/ ctx[0]('home.vote.earn.title') + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$_*/ 1 && t12_value !== (t12_value = /*$_*/ ctx[0]('home.vote.earn.pStart') + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*$_*/ 1 && t14_value !== (t14_value = /*$_*/ ctx[0]('home.vote.earn.highlighted') + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*$_*/ 1 && t16_value !== (t16_value = /*$_*/ ctx[0]('home.vote.earn.pEnd') + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*$_*/ 1 && t19_value !== (t19_value = /*$_*/ ctx[0]('home.vote.success.title') + "")) set_data_dev(t19, t19_value);
    			if (dirty & /*$_*/ 1 && t21_value !== (t21_value = /*$_*/ ctx[0]('home.vote.success.pStart') + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*$_*/ 1 && t23_value !== (t23_value = /*$_*/ ctx[0]('home.vote.success.highlighted') + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*$_*/ 1 && t25_value !== (t25_value = /*$_*/ ctx[0]('home.vote.success.pEnd') + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*$_*/ 1 && t41_value !== (t41_value = /*$_*/ ctx[0]('home.vote.stable.title') + "")) set_data_dev(t41, t41_value);
    			if (dirty & /*$_*/ 1 && t43_value !== (t43_value = /*$_*/ ctx[0]('home.vote.stable.pStart') + "")) set_data_dev(t43, t43_value);
    			if (dirty & /*$_*/ 1 && t45_value !== (t45_value = /*$_*/ ctx[0]('home.vote.stable.highlighted') + "")) set_data_dev(t45, t45_value);
    			if (dirty & /*$_*/ 1 && t47_value !== (t47_value = /*$_*/ ctx[0]('home.vote.stable.pEnd') + "")) set_data_dev(t47, t47_value);
    			if (dirty & /*$_*/ 1 && t50_value !== (t50_value = /*$_*/ ctx[0]('home.vote.stake.title') + "")) set_data_dev(t50, t50_value);
    			if (dirty & /*$_*/ 1 && t52_value !== (t52_value = /*$_*/ ctx[0]('home.vote.stake.pStart') + "")) set_data_dev(t52, t52_value);
    			if (dirty & /*$_*/ 1 && t54_value !== (t54_value = /*$_*/ ctx[0]('home.vote.stake.highlighted') + "")) set_data_dev(t54, t54_value);
    			if (dirty & /*$_*/ 1 && t56_value !== (t56_value = /*$_*/ ctx[0]('home.vote.stake.pEnd') + "")) set_data_dev(t56, t56_value);
    			if (dirty & /*$_*/ 1 && t59_value !== (t59_value = /*$_*/ ctx[0]('home.vote.replenish.title') + "")) set_data_dev(t59, t59_value);
    			if (dirty & /*$_*/ 1 && t61_value !== (t61_value = /*$_*/ ctx[0]('home.vote.replenish.pStart') + "")) set_data_dev(t61, t61_value);
    			if (dirty & /*$_*/ 1 && t63_value !== (t63_value = /*$_*/ ctx[0]('home.vote.replenish.highlighted') + "")) set_data_dev(t63, t63_value);
    			if (dirty & /*$_*/ 1 && t65_value !== (t65_value = /*$_*/ ctx[0]('home.vote.replenish.pEnd') + "")) set_data_dev(t65, t65_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div14);
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
    	validate_slots('VoteToken', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VoteToken> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ _: X, $_ });
    	return [$_];
    }

    class VoteToken extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VoteToken",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Roadmap.svelte generated by Svelte v3.44.3 */
    const file$a = "src/Roadmap.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:16) {#each $json('home.roadmap.idea.cleared') as step}
    function create_each_block_5(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "cleared svelte-1ln9mqs");
    			add_location(li, file$a, 9, 20, 405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(9:16) {#each $json('home.roadmap.idea.cleared') as step}",
    		ctx
    	});

    	return block;
    }

    // (25:16) {#each $json('home.roadmap.research.cleared') as step}
    function create_each_block_4(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "cleared svelte-1ln9mqs");
    			add_location(li, file$a, 25, 20, 1098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(25:16) {#each $json('home.roadmap.research.cleared') as step}",
    		ctx
    	});

    	return block;
    }

    // (38:16) {#each $json('home.roadmap.plan.cleared') as step}
    function create_each_block_3(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "cleared svelte-1ln9mqs");
    			add_location(li, file$a, 38, 20, 1583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(38:16) {#each $json('home.roadmap.plan.cleared') as step}",
    		ctx
    	});

    	return block;
    }

    // (41:16) {#each $json('home.roadmap.plan.uncleared') as step}
    function create_each_block_2(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$a, 41, 20, 1728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(41:16) {#each $json('home.roadmap.plan.uncleared') as step}",
    		ctx
    	});

    	return block;
    }

    // (66:16) {#each $json('home.roadmap.launch.uncleared') as step}
    function create_each_block_1(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$a, 66, 20, 2805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(66:16) {#each $json('home.roadmap.launch.uncleared') as step}",
    		ctx
    	});

    	return block;
    }

    // (79:16) {#each $json('home.roadmap.post.uncleared') as step}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*step*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$a, 79, 20, 3281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$json*/ 1 && t_value !== (t_value = /*step*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(79:16) {#each $json('home.roadmap.post.uncleared') as step}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div25;
    	let div2;
    	let h30;
    	let t1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div1;
    	let ul0;
    	let t3;
    	let div5;
    	let h31;
    	let t5;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let div4;
    	let ul1;
    	let t7;
    	let div8;
    	let h32;
    	let t9;
    	let div6;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div7;
    	let ul2;
    	let t11;
    	let t12;
    	let div20;
    	let h33;
    	let t14;
    	let div18;
    	let div17;
    	let img3;
    	let img3_src_value;
    	let t15;
    	let div16;
    	let div15;
    	let div9;
    	let t16;
    	let div10;
    	let t17;
    	let div11;
    	let t18;
    	let div12;
    	let t19;
    	let div13;
    	let t20;
    	let div14;
    	let t21;
    	let div19;
    	let ul3;
    	let t22;
    	let div23;
    	let h34;
    	let t24;
    	let div21;
    	let img4;
    	let img4_src_value;
    	let t25;
    	let div22;
    	let ul4;
    	let t26;
    	let div24;
    	let p;
    	let t27_value = /*$_*/ ctx[1]('home.roadmap.socials') + "";
    	let t27;
    	let each_value_5 = /*$json*/ ctx[0]('home.roadmap.idea.cleared');
    	validate_each_argument(each_value_5);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_5[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*$json*/ ctx[0]('home.roadmap.research.cleared');
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*$json*/ ctx[0]('home.roadmap.plan.cleared');
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*$json*/ ctx[0]('home.roadmap.plan.uncleared');
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*$json*/ ctx[0]('home.roadmap.launch.uncleared');
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*$json*/ ctx[0]('home.roadmap.post.uncleared');
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div25 = element("div");
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "2019 - 2020";
    			t1 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			t3 = space();
    			div5 = element("div");
    			h31 = element("h3");
    			h31.textContent = "2021";
    			t5 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t6 = space();
    			div4 = element("div");
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t7 = space();
    			div8 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Q1 2022";
    			t9 = space();
    			div6 = element("div");
    			img2 = element("img");
    			t10 = space();
    			div7 = element("div");
    			ul2 = element("ul");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t11 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t12 = space();
    			div20 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Q2 2022";
    			t14 = space();
    			div18 = element("div");
    			div17 = element("div");
    			img3 = element("img");
    			t15 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div9 = element("div");
    			t16 = space();
    			div10 = element("div");
    			t17 = space();
    			div11 = element("div");
    			t18 = space();
    			div12 = element("div");
    			t19 = space();
    			div13 = element("div");
    			t20 = space();
    			div14 = element("div");
    			t21 = space();
    			div19 = element("div");
    			ul3 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t22 = space();
    			div23 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Q3+ 2022";
    			t24 = space();
    			div21 = element("div");
    			img4 = element("img");
    			t25 = space();
    			div22 = element("div");
    			ul4 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t26 = space();
    			div24 = element("div");
    			p = element("p");
    			t27 = text(t27_value);
    			set_style(h30, "color", "white");
    			attr_dev(h30, "class", "svelte-1ln9mqs");
    			add_location(h30, file$a, 2, 8, 91);
    			attr_dev(img0, "alt", "Idea");
    			if (!src_url_equal(img0.src, img0_src_value = "images/idea_sw.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1ln9mqs");
    			add_location(img0, file$a, 4, 12, 215);
    			attr_dev(div0, "class", "header svelte-1ln9mqs");
    			set_style(div0, "border-bottom", "5px solid #363636");
    			add_location(div0, file$a, 3, 8, 141);
    			attr_dev(ul0, "class", "svelte-1ln9mqs");
    			add_location(ul0, file$a, 7, 12, 313);
    			attr_dev(div1, "class", "text svelte-1ln9mqs");
    			add_location(div1, file$a, 6, 8, 282);
    			attr_dev(div2, "class", "roadmap-card svelte-1ln9mqs");
    			set_style(div2, "height", "60%");
    			add_location(div2, file$a, 1, 4, 36);
    			set_style(h31, "color", "#852ee7");
    			attr_dev(h31, "class", "svelte-1ln9mqs");
    			add_location(h31, file$a, 18, 8, 771);
    			attr_dev(img1, "alt", "New Direction");
    			if (!src_url_equal(img1.src, img1_src_value = "images/leadership_sw.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1ln9mqs");
    			add_location(img1, file$a, 20, 12, 889);
    			attr_dev(div3, "class", "header svelte-1ln9mqs");
    			set_style(div3, "border-bottom", "5px solid #852ee7");
    			add_location(div3, file$a, 19, 8, 815);
    			attr_dev(ul1, "class", "svelte-1ln9mqs");
    			add_location(ul1, file$a, 23, 12, 1002);
    			attr_dev(div4, "class", "text svelte-1ln9mqs");
    			add_location(div4, file$a, 22, 8, 971);
    			attr_dev(div5, "class", "roadmap-card svelte-1ln9mqs");
    			set_style(div5, "height", "70%");
    			add_location(div5, file$a, 17, 4, 716);
    			set_style(h32, "color", "#e0573f");
    			attr_dev(h32, "class", "svelte-1ln9mqs");
    			add_location(h32, file$a, 31, 8, 1257);
    			attr_dev(img2, "alt", "Pre-launch plan");
    			if (!src_url_equal(img2.src, img2_src_value = "images/planning_sw.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1ln9mqs");
    			add_location(img2, file$a, 33, 12, 1378);
    			attr_dev(div6, "class", "header svelte-1ln9mqs");
    			set_style(div6, "border-bottom", "5px solid #e0573f");
    			add_location(div6, file$a, 32, 8, 1304);
    			attr_dev(ul2, "class", "svelte-1ln9mqs");
    			add_location(ul2, file$a, 36, 12, 1491);
    			attr_dev(div7, "class", "text svelte-1ln9mqs");
    			add_location(div7, file$a, 35, 8, 1460);
    			attr_dev(div8, "class", "roadmap-card svelte-1ln9mqs");
    			set_style(div8, "height", "80%");
    			add_location(div8, file$a, 30, 4, 1202);
    			set_style(h33, "color", "#ecec37");
    			attr_dev(h33, "class", "svelte-1ln9mqs");
    			add_location(h33, file$a, 47, 8, 1871);
    			set_style(img3, "max-height", "100px");
    			set_style(img3, "position", "relative");
    			attr_dev(img3, "alt", "Launch plans");
    			if (!src_url_equal(img3.src, img3_src_value = "images/launch_no_ex.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1ln9mqs");
    			add_location(img3, file$a, 50, 16, 2063);
    			attr_dev(div9, "class", "red flame svelte-1ln9mqs");
    			add_location(div9, file$a, 53, 24, 2271);
    			attr_dev(div10, "class", "orange flame svelte-1ln9mqs");
    			add_location(div10, file$a, 54, 24, 2325);
    			attr_dev(div11, "class", "yellow flame svelte-1ln9mqs");
    			add_location(div11, file$a, 55, 24, 2382);
    			attr_dev(div12, "class", "white flame svelte-1ln9mqs");
    			add_location(div12, file$a, 56, 24, 2439);
    			attr_dev(div13, "class", "blue circle svelte-1ln9mqs");
    			add_location(div13, file$a, 57, 24, 2495);
    			attr_dev(div14, "class", "black circle svelte-1ln9mqs");
    			add_location(div14, file$a, 58, 24, 2551);
    			attr_dev(div15, "class", "container svelte-1ln9mqs");
    			add_location(div15, file$a, 52, 20, 2223);
    			attr_dev(div16, "class", "exhaust svelte-1ln9mqs");
    			add_location(div16, file$a, 51, 16, 2181);
    			set_style(div17, "position", "relative");
    			set_style(div17, "display", "inline-grid");
    			add_location(div17, file$a, 49, 12, 1993);
    			attr_dev(div18, "class", "header svelte-1ln9mqs");
    			set_style(div18, "border-bottom", "5px solid #ecec37");
    			add_location(div18, file$a, 48, 8, 1919);
    			attr_dev(ul3, "class", "svelte-1ln9mqs");
    			add_location(ul3, file$a, 64, 12, 2709);
    			attr_dev(div19, "class", "text svelte-1ln9mqs");
    			add_location(div19, file$a, 63, 8, 2678);
    			attr_dev(div20, "class", "roadmap-card svelte-1ln9mqs");
    			set_style(div20, "height", "90%");
    			add_location(div20, file$a, 46, 4, 1816);
    			set_style(h34, "color", "aqua");
    			attr_dev(h34, "class", "svelte-1ln9mqs");
    			add_location(h34, file$a, 72, 8, 2949);
    			attr_dev(img4, "alt", "Post launch plans");
    			if (!src_url_equal(img4.src, img4_src_value = "images/globalization_sw.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1ln9mqs");
    			add_location(img4, file$a, 74, 12, 3067);
    			attr_dev(div21, "class", "header svelte-1ln9mqs");
    			set_style(div21, "border-bottom", "5px solid aqua");
    			add_location(div21, file$a, 73, 8, 2996);
    			attr_dev(ul4, "class", "svelte-1ln9mqs");
    			add_location(ul4, file$a, 77, 12, 3187);
    			attr_dev(div22, "class", "text svelte-1ln9mqs");
    			add_location(div22, file$a, 76, 8, 3156);
    			attr_dev(div23, "class", "roadmap-card svelte-1ln9mqs");
    			set_style(div23, "height", "100%");
    			add_location(div23, file$a, 71, 4, 2893);
    			attr_dev(p, "class", "svelte-1ln9mqs");
    			add_location(p, file$a, 85, 8, 3403);
    			attr_dev(div24, "class", "social-info svelte-1ln9mqs");
    			add_location(div24, file$a, 84, 4, 3369);
    			attr_dev(div25, "class", "roadmap-container svelte-1ln9mqs");
    			add_location(div25, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div25, anchor);
    			append_dev(div25, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, img0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].m(ul0, null);
    			}

    			append_dev(div25, t3);
    			append_dev(div25, div5);
    			append_dev(div5, h31);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, img1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, ul1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(ul1, null);
    			}

    			append_dev(div25, t7);
    			append_dev(div25, div8);
    			append_dev(div8, h32);
    			append_dev(div8, t9);
    			append_dev(div8, div6);
    			append_dev(div6, img2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, ul2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(ul2, null);
    			}

    			append_dev(ul2, t11);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(ul2, null);
    			}

    			append_dev(div25, t12);
    			append_dev(div25, div20);
    			append_dev(div20, h33);
    			append_dev(div20, t14);
    			append_dev(div20, div18);
    			append_dev(div18, div17);
    			append_dev(div17, img3);
    			append_dev(div17, t15);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div9);
    			append_dev(div15, t16);
    			append_dev(div15, div10);
    			append_dev(div15, t17);
    			append_dev(div15, div11);
    			append_dev(div15, t18);
    			append_dev(div15, div12);
    			append_dev(div15, t19);
    			append_dev(div15, div13);
    			append_dev(div15, t20);
    			append_dev(div15, div14);
    			append_dev(div20, t21);
    			append_dev(div20, div19);
    			append_dev(div19, ul3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul3, null);
    			}

    			append_dev(div25, t22);
    			append_dev(div25, div23);
    			append_dev(div23, h34);
    			append_dev(div23, t24);
    			append_dev(div23, div21);
    			append_dev(div21, img4);
    			append_dev(div23, t25);
    			append_dev(div23, div22);
    			append_dev(div22, ul4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul4, null);
    			}

    			append_dev(div25, t26);
    			append_dev(div25, div24);
    			append_dev(div24, p);
    			append_dev(p, t27);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$json*/ 1) {
    				each_value_5 = /*$json*/ ctx[0]('home.roadmap.idea.cleared');
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_5(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_5.length;
    			}

    			if (dirty & /*$json*/ 1) {
    				each_value_4 = /*$json*/ ctx[0]('home.roadmap.research.cleared');
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty & /*$json*/ 1) {
    				each_value_3 = /*$json*/ ctx[0]('home.roadmap.plan.cleared');
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(ul2, t11);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty & /*$json*/ 1) {
    				each_value_2 = /*$json*/ ctx[0]('home.roadmap.plan.uncleared');
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul2, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*$json*/ 1) {
    				each_value_1 = /*$json*/ ctx[0]('home.roadmap.launch.uncleared');
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul3, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*$json*/ 1) {
    				each_value = /*$json*/ ctx[0]('home.roadmap.post.uncleared');
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$_*/ 2 && t27_value !== (t27_value = /*$_*/ ctx[1]('home.roadmap.socials') + "")) set_data_dev(t27, t27_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div25);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
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
    	let $json;
    	let $_;
    	validate_store(te, 'json');
    	component_subscribe($$self, te, $$value => $$invalidate(0, $json = $$value));
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(1, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Roadmap', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Roadmap> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ _: X, json: te, $json, $_ });
    	return [$json, $_];
    }

    class Roadmap extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Roadmap",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Partners.svelte generated by Svelte v3.44.3 */

    const file$9 = "src/Partners.svelte";

    // (13:4) {#if formShowing}
    function create_if_block$2(ctx) {
    	let div0;
    	let svg0;
    	let polygon0;
    	let polygon1;
    	let t0;
    	let span;
    	let t2;
    	let h2;
    	let t4;
    	let form;
    	let input0;
    	let t5;
    	let label0;
    	let t7;
    	let input1;
    	let t8;
    	let label1;
    	let t10;
    	let input2;
    	let t11;
    	let label2;
    	let t13;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t17;
    	let label3;
    	let t19;
    	let textarea;
    	let t20;
    	let button;
    	let t22;
    	let svg1;
    	let polygon2;
    	let polygon3;
    	let t23;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			polygon0 = svg_element("polygon");
    			polygon1 = svg_element("polygon");
    			t0 = space();
    			span = element("span");
    			span.textContent = "X";
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Thank you for reaching out";
    			t4 = space();
    			form = element("form");
    			input0 = element("input");
    			t5 = space();
    			label0 = element("label");
    			label0.textContent = "Name";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			label1 = element("label");
    			label1.textContent = "Email";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			label2 = element("label");
    			label2.textContent = "Type of partnership";
    			t13 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Ambassador";
    			option1 = element("option");
    			option1.textContent = "Business";
    			option2 = element("option");
    			option2.textContent = "General";
    			t17 = space();
    			label3 = element("label");
    			label3.textContent = "Message";
    			t19 = space();
    			textarea = element("textarea");
    			t20 = space();
    			button = element("button");
    			button.textContent = "Submit";
    			t22 = space();
    			svg1 = svg_element("svg");
    			polygon2 = svg_element("polygon");
    			polygon3 = svg_element("polygon");
    			t23 = space();
    			div1 = element("div");
    			set_style(polygon0, "fill", "aqua");
    			attr_dev(polygon0, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon0, file$9, 15, 12, 703);
    			set_style(polygon1, "fill", "aqua");
    			attr_dev(polygon1, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon1, file$9, 16, 12, 837);
    			attr_dev(svg0, "class", "top svelte-fbzbol");
    			attr_dev(svg0, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$9, 14, 8, 606);
    			attr_dev(span, "class", "svelte-fbzbol");
    			add_location(span, file$9, 18, 10, 990);
    			add_location(h2, file$9, 19, 8, 1035);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "form-name");
    			input0.value = "partnerships";
    			attr_dev(input0, "class", "svelte-fbzbol");
    			add_location(input0, file$9, 21, 12, 1209);
    			set_style(label0, "text-decoration-color", "aqua");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-fbzbol");
    			add_location(label0, file$9, 22, 12, 1283);
    			attr_dev(input1, "name", "name");
    			attr_dev(input1, "class", "svelte-fbzbol");
    			add_location(input1, file$9, 23, 12, 1363);
    			set_style(label1, "text-decoration-color", "gold");
    			attr_dev(label1, "for", "email");
    			attr_dev(label1, "class", "svelte-fbzbol");
    			add_location(label1, file$9, 24, 12, 1418);
    			attr_dev(input2, "name", "email");
    			attr_dev(input2, "class", "svelte-fbzbol");
    			add_location(input2, file$9, 25, 12, 1500);
    			set_style(label2, "text-decoration-color", "blueviolet");
    			attr_dev(label2, "for", "type");
    			attr_dev(label2, "class", "svelte-fbzbol");
    			add_location(label2, file$9, 26, 12, 1565);
    			option0.__value = "Ambassador";
    			option0.value = option0.__value;
    			add_location(option0, file$9, 28, 16, 1726);
    			option1.__value = "Business";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 29, 16, 1770);
    			option2.__value = "General";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 30, 16, 1812);
    			attr_dev(select, "name", "type");
    			attr_dev(select, "class", "svelte-fbzbol");
    			if (/*typeValue*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[9].call(select));
    			add_location(select, file$9, 27, 12, 1666);
    			set_style(label3, "text-decoration-color", "#FF3333");
    			attr_dev(label3, "for", "messsage");
    			attr_dev(label3, "class", "svelte-fbzbol");
    			add_location(label3, file$9, 32, 12, 1871);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "class", "svelte-fbzbol");
    			add_location(textarea, file$9, 33, 12, 1961);
    			attr_dev(button, "id", "submit");
    			attr_dev(button, "class", "svelte-fbzbol");
    			add_location(button, file$9, 34, 12, 2033);
    			attr_dev(form, "name", "partnerships");
    			attr_dev(form, "data-netlify-honeypot", "bot-field");
    			attr_dev(form, "method", "POST");
    			attr_dev(form, "data-netlify", "true");
    			attr_dev(form, "netlify", "");
    			attr_dev(form, "class", "signup svelte-fbzbol");
    			add_location(form, file$9, 20, 8, 1079);
    			set_style(polygon2, "fill", "aqua");
    			attr_dev(polygon2, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon2, file$9, 38, 12, 2194);
    			set_style(polygon3, "fill", "aqua");
    			attr_dev(polygon3, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon3, file$9, 39, 12, 2336);
    			attr_dev(svg1, "class", "bottom svelte-fbzbol");
    			attr_dev(svg1, "viewBox", "-1.79 0 501.79 94.114");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$9, 37, 8, 2094);
    			attr_dev(div0, "class", "modal svelte-fbzbol");
    			add_location(div0, file$9, 13, 1, 578);
    			attr_dev(div1, "id", "overlay");
    			attr_dev(div1, "class", "svelte-fbzbol");
    			add_location(div1, file$9, 42, 4, 2493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg0);
    			append_dev(svg0, polygon0);
    			append_dev(svg0, polygon1);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(div0, t2);
    			append_dev(div0, h2);
    			append_dev(div0, t4);
    			append_dev(div0, form);
    			append_dev(form, input0);
    			append_dev(form, t5);
    			append_dev(form, label0);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			set_input_value(input1, /*nameValue*/ ctx[3]);
    			append_dev(form, t8);
    			append_dev(form, label1);
    			append_dev(form, t10);
    			append_dev(form, input2);
    			set_input_value(input2, /*emailValue*/ ctx[2]);
    			append_dev(form, t11);
    			append_dev(form, label2);
    			append_dev(form, t13);
    			append_dev(form, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*typeValue*/ ctx[4]);
    			append_dev(form, t17);
    			append_dev(form, label3);
    			append_dev(form, t19);
    			append_dev(form, textarea);
    			set_input_value(textarea, /*textValue*/ ctx[1]);
    			append_dev(form, t20);
    			append_dev(form, button);
    			append_dev(div0, t22);
    			append_dev(div0, svg1);
    			append_dev(svg1, polygon2);
    			append_dev(svg1, polygon3);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*hideForm*/ ctx[6], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[8]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[9]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[10]),
    					listen_dev(div1, "click", /*click_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nameValue*/ 8 && input1.value !== /*nameValue*/ ctx[3]) {
    				set_input_value(input1, /*nameValue*/ ctx[3]);
    			}

    			if (dirty & /*emailValue*/ 4 && input2.value !== /*emailValue*/ ctx[2]) {
    				set_input_value(input2, /*emailValue*/ ctx[2]);
    			}

    			if (dirty & /*typeValue*/ 16) {
    				select_option(select, /*typeValue*/ ctx[4]);
    			}

    			if (dirty & /*textValue*/ 2) {
    				set_input_value(textarea, /*textValue*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:4) {#if formShowing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div2;
    	let h2;
    	let t1;
    	let h3;
    	let t3;
    	let div0;
    	let button;
    	let t5;
    	let div1;
    	let form;
    	let label;
    	let t7;
    	let input;
    	let t8;
    	let mounted;
    	let dispose;
    	let if_block = /*formShowing*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Big news coming soon.";
    			t1 = space();
    			h3 = element("h3");
    			h3.textContent = "We're always open to working with exceptional minds and talents. Reach out if you're interested in being a Partner, Ambassador, or helping us build and grow AllSkills.";
    			t3 = space();
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Reach Out";
    			t5 = space();
    			div1 = element("div");
    			form = element("form");
    			label = element("label");
    			label.textContent = "Test";
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			if (if_block) if_block.c();
    			set_style(h2, "font-size", "2.2rem");
    			add_location(h2, file$9, 1, 4, 33);
    			set_style(h3, "font-size", "1.7rem");
    			set_style(h3, "font-weight", "400");
    			add_location(h3, file$9, 2, 4, 95);
    			attr_dev(button, "id", "reach-out");
    			attr_dev(button, "class", "svelte-fbzbol");
    			add_location(button, file$9, 4, 8, 335);
    			add_location(div0, file$9, 3, 4, 321);
    			attr_dev(label, "for", "name");
    			attr_dev(label, "class", "svelte-fbzbol");
    			add_location(label, file$9, 8, 12, 465);
    			attr_dev(input, "name", "name");
    			attr_dev(input, "class", "svelte-fbzbol");
    			add_location(input, file$9, 9, 12, 508);
    			attr_dev(form, "class", "svelte-fbzbol");
    			add_location(form, file$9, 7, 8, 446);
    			attr_dev(div1, "id", "partner-form");
    			attr_dev(div1, "class", "svelte-fbzbol");
    			add_location(div1, file$9, 6, 4, 414);
    			attr_dev(div2, "id", "partner-container");
    			attr_dev(div2, "class", "svelte-fbzbol");
    			add_location(div2, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h2);
    			append_dev(div2, t1);
    			append_dev(div2, h3);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			append_dev(form, label);
    			append_dev(form, t7);
    			append_dev(form, input);
    			append_dev(div2, t8);
    			if (if_block) if_block.m(div2, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showForm*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*formShowing*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
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
    	validate_slots('Partners', slots, []);
    	let formShowing = false;
    	let textValue = "";
    	let emailValue = "";
    	let nameValue = "";
    	let typeValue = "Ambassador";

    	function showForm() {
    		$$invalidate(0, formShowing = true);
    	}

    	function hideForm() {
    		$$invalidate(0, formShowing = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Partners> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		nameValue = this.value;
    		$$invalidate(3, nameValue);
    	}

    	function input2_input_handler() {
    		emailValue = this.value;
    		$$invalidate(2, emailValue);
    	}

    	function select_change_handler() {
    		typeValue = select_value(this);
    		$$invalidate(4, typeValue);
    	}

    	function textarea_input_handler() {
    		textValue = this.value;
    		$$invalidate(1, textValue);
    	}

    	const click_handler = () => $$invalidate(0, formShowing = false);

    	$$self.$capture_state = () => ({
    		formShowing,
    		textValue,
    		emailValue,
    		nameValue,
    		typeValue,
    		showForm,
    		hideForm
    	});

    	$$self.$inject_state = $$props => {
    		if ('formShowing' in $$props) $$invalidate(0, formShowing = $$props.formShowing);
    		if ('textValue' in $$props) $$invalidate(1, textValue = $$props.textValue);
    		if ('emailValue' in $$props) $$invalidate(2, emailValue = $$props.emailValue);
    		if ('nameValue' in $$props) $$invalidate(3, nameValue = $$props.nameValue);
    		if ('typeValue' in $$props) $$invalidate(4, typeValue = $$props.typeValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formShowing,
    		textValue,
    		emailValue,
    		nameValue,
    		typeValue,
    		showForm,
    		hideForm,
    		input1_input_handler,
    		input2_input_handler,
    		select_change_handler,
    		textarea_input_handler,
    		click_handler
    	];
    }

    class Partners extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Partners",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Table.svelte generated by Svelte v3.44.3 */
    const file$8 = "src/Table.svelte";

    function create_fragment$9(ctx) {
    	let div8;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h30;
    	let t1_value = /*$_*/ ctx[0]('home.table.title1') + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*$_*/ ctx[0]('home.table.p1') + "";
    	let t3;
    	let t4;
    	let div3;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let h31;
    	let t6_value = /*$_*/ ctx[0]('home.table.title2') + "";
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*$_*/ ctx[0]('home.table.p2') + "";
    	let t8;
    	let t9;
    	let div5;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let h32;
    	let t11_value = /*$_*/ ctx[0]('home.table.title3') + "";
    	let t11;
    	let t12;
    	let p2;
    	let t13_value = /*$_*/ ctx[0]('home.table.p3') + "";
    	let t13;
    	let t14;
    	let div7;
    	let div6;
    	let img3;
    	let img3_src_value;
    	let t15;
    	let h33;
    	let t16_value = /*$_*/ ctx[0]('home.table.title4') + "";
    	let t16;
    	let t17;
    	let p3;
    	let t18_value = /*$_*/ ctx[0]('home.table.p4') + "";
    	let t18;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h30 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t5 = space();
    			h31 = element("h3");
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			div4 = element("div");
    			img2 = element("img");
    			t10 = space();
    			h32 = element("h3");
    			t11 = text(t11_value);
    			t12 = space();
    			p2 = element("p");
    			t13 = text(t13_value);
    			t14 = space();
    			div7 = element("div");
    			div6 = element("div");
    			img3 = element("img");
    			t15 = space();
    			h33 = element("h3");
    			t16 = text(t16_value);
    			t17 = space();
    			p3 = element("p");
    			t18 = text(t18_value);
    			attr_dev(img0, "alt", "Handshake");
    			set_style(img0, "width", "100%");
    			if (!src_url_equal(img0.src, img0_src_value = "images/handshake.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$8, 2, 32, 99);
    			attr_dev(div0, "class", "table-icon svelte-cy9dcx");
    			add_location(div0, file$8, 2, 8, 75);
    			attr_dev(h30, "class", "svelte-cy9dcx");
    			add_location(h30, file$8, 3, 8, 181);
    			attr_dev(p0, "class", "svelte-cy9dcx");
    			add_location(p0, file$8, 4, 8, 224);
    			attr_dev(div1, "class", "grid-item svelte-cy9dcx");
    			add_location(div1, file$8, 1, 4, 43);
    			attr_dev(img1, "alt", "Earnings");
    			set_style(img1, "width", "100%");
    			if (!src_url_equal(img1.src, img1_src_value = "images/earn.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$8, 7, 32, 324);
    			attr_dev(div2, "class", "table-icon svelte-cy9dcx");
    			add_location(div2, file$8, 7, 8, 300);
    			attr_dev(h31, "class", "svelte-cy9dcx");
    			add_location(h31, file$8, 8, 8, 400);
    			attr_dev(p1, "class", "svelte-cy9dcx");
    			add_location(p1, file$8, 9, 8, 443);
    			attr_dev(div3, "class", "grid-item svelte-cy9dcx");
    			add_location(div3, file$8, 6, 4, 268);
    			attr_dev(img2, "alt", "Collectibles");
    			set_style(img2, "width", "100%");
    			if (!src_url_equal(img2.src, img2_src_value = "images/stamps.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$8, 12, 32, 543);
    			attr_dev(div4, "class", "table-icon svelte-cy9dcx");
    			add_location(div4, file$8, 12, 8, 519);
    			attr_dev(h32, "class", "svelte-cy9dcx");
    			add_location(h32, file$8, 13, 8, 625);
    			attr_dev(p2, "class", "svelte-cy9dcx");
    			add_location(p2, file$8, 14, 8, 668);
    			attr_dev(div5, "class", "grid-item svelte-cy9dcx");
    			add_location(div5, file$8, 11, 4, 487);
    			attr_dev(img3, "alt", "Marketplace");
    			set_style(img3, "width", "100%");
    			if (!src_url_equal(img3.src, img3_src_value = "images/auction.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$8, 17, 32, 768);
    			attr_dev(div6, "class", "table-icon svelte-cy9dcx");
    			add_location(div6, file$8, 17, 8, 744);
    			attr_dev(h33, "class", "svelte-cy9dcx");
    			add_location(h33, file$8, 18, 8, 850);
    			attr_dev(p3, "class", "svelte-cy9dcx");
    			add_location(p3, file$8, 19, 8, 893);
    			attr_dev(div7, "class", "grid-item svelte-cy9dcx");
    			add_location(div7, file$8, 16, 4, 712);
    			attr_dev(div8, "class", "table-content svelte-cy9dcx");
    			attr_dev(div8, "id", "Table");
    			add_location(div8, file$8, 0, 0, 0);
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
    			append_dev(h30, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div3, t5);
    			append_dev(div3, h31);
    			append_dev(h31, t6);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			append_dev(p1, t8);
    			append_dev(div8, t9);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, img2);
    			append_dev(div5, t10);
    			append_dev(div5, h32);
    			append_dev(h32, t11);
    			append_dev(div5, t12);
    			append_dev(div5, p2);
    			append_dev(p2, t13);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, img3);
    			append_dev(div7, t15);
    			append_dev(div7, h33);
    			append_dev(h33, t16);
    			append_dev(div7, t17);
    			append_dev(div7, p3);
    			append_dev(p3, t18);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$_*/ 1 && t1_value !== (t1_value = /*$_*/ ctx[0]('home.table.title1') + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$_*/ 1 && t3_value !== (t3_value = /*$_*/ ctx[0]('home.table.p1') + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$_*/ 1 && t6_value !== (t6_value = /*$_*/ ctx[0]('home.table.title2') + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$_*/ 1 && t8_value !== (t8_value = /*$_*/ ctx[0]('home.table.p2') + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*$_*/ 1 && t11_value !== (t11_value = /*$_*/ ctx[0]('home.table.title3') + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*$_*/ 1 && t13_value !== (t13_value = /*$_*/ ctx[0]('home.table.p3') + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*$_*/ 1 && t16_value !== (t16_value = /*$_*/ ctx[0]('home.table.title4') + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*$_*/ 1 && t18_value !== (t18_value = /*$_*/ ctx[0]('home.table.p4') + "")) set_data_dev(t18, t18_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
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

    function instance$9($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(0, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ _: X, $_ });
    	return [$_];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/News.svelte generated by Svelte v3.44.3 */

    const file$7 = "src/News.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].img;
    	child_ctx[2] = list[i].title;
    	child_ctx[3] = list[i].content;
    	return child_ctx;
    }

    // (4:4) {#each news as {img, title, content}}
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
    			attr_dev(img, "alt", "Article header");
    			if (!src_url_equal(img.src, img_src_value = "images/profile-bg-1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-vimvpn");
    			add_location(img, file$7, 6, 16, 214);
    			attr_dev(div0, "class", "image svelte-vimvpn");
    			add_location(div0, file$7, 5, 12, 178);
    			attr_dev(h2, "class", "title svelte-vimvpn");
    			add_location(h2, file$7, 8, 12, 304);
    			add_location(p, file$7, 10, 16, 385);
    			attr_dev(div1, "class", "content svelte-vimvpn");
    			add_location(div1, file$7, 9, 12, 347);
    			attr_dev(div2, "class", "card svelte-vimvpn");
    			add_location(div2, file$7, 4, 8, 147);
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
    		source: "(4:4) {#each news as {img, title, content}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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

    			attr_dev(div, "class", "news-container svelte-vimvpn");
    			add_location(div, file$7, 0, 0, 0);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News', slots, []);

    	const news = [
    		{
    			img: "",
    			title: "Soft Launch!",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		},
    		{
    			img: "",
    			title: "First videoshoot with local hockey phenom",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		},
    		{
    			img: "",
    			title: "Charles Hammelin leaves for Olympics",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		},
    		{
    			img: "",
    			title: "Charles Hammelin leaves for Olympics",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		},
    		{
    			img: "",
    			title: "Charles Hammelin leaves for Olympics",
    			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    		},
    		{
    			img: "",
    			title: "Charles Hammelin leaves for Olympics",
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/NFT.svelte generated by Svelte v3.44.3 */
    const file$6 = "src/NFT.svelte";

    // (80:4) {#if modalShowing}
    function create_if_block$1(ctx) {
    	let div0;
    	let h2;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(/*modalTitle*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*modalDescription*/ ctx[2]);
    			t3 = space();
    			div1 = element("div");
    			add_location(h2, file$6, 81, 8, 6444);
    			add_location(p, file$6, 82, 8, 6474);
    			attr_dev(div0, "class", "modal svelte-jkq38r");
    			add_location(div0, file$6, 80, 1, 6416);
    			attr_dev(div1, "id", "overlay");
    			attr_dev(div1, "class", "svelte-jkq38r");
    			add_location(div1, file$6, 84, 4, 6512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler_8*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*modalTitle*/ 2) set_data_dev(t0, /*modalTitle*/ ctx[1]);
    			if (dirty & /*modalDescription*/ 4) set_data_dev(t2, /*modalDescription*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(80:4) {#if modalShowing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div15;
    	let div6;
    	let div0;
    	let h10;
    	let t1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div5;
    	let ul0;
    	let div1;
    	let svg0;
    	let polygon0;
    	let polygon1;
    	let t3;
    	let h40;
    	let t4_value = /*$_*/ ctx[3]('home.nft.1.pStart') + "";
    	let t4;
    	let t5;
    	let a0;
    	let t6_value = /*$_*/ ctx[3]('home.nft.1.link') + "";
    	let t6;
    	let t7;
    	let div2;
    	let svg1;
    	let polygon2;
    	let polygon3;
    	let t8;
    	let h41;
    	let t9_value = /*$_*/ ctx[3]('home.nft.2.pStart') + "";
    	let t9;
    	let t10;
    	let a1;
    	let t11_value = /*$_*/ ctx[3]('home.nft.2.link') + "";
    	let t11;
    	let t12;
    	let t13_value = /*$_*/ ctx[3]('home.nft.2.pEnd') + "";
    	let t13;
    	let t14;
    	let div3;
    	let svg2;
    	let polygon4;
    	let polygon5;
    	let t15;
    	let h42;
    	let t16_value = /*$_*/ ctx[3]('home.nft.3.pStart') + "";
    	let t16;
    	let t17;
    	let a2;
    	let t18_value = /*$_*/ ctx[3]('home.nft.3.link') + "";
    	let t18;
    	let t19;
    	let t20_value = /*$_*/ ctx[3]('home.nft.3.pEnd') + "";
    	let t20;
    	let t21;
    	let div4;
    	let svg3;
    	let polygon6;
    	let polygon7;
    	let t22;
    	let h43;
    	let t23_value = /*$_*/ ctx[3]('home.nft.4.pStart') + "";
    	let t23;
    	let t24;
    	let a3;
    	let t25_value = /*$_*/ ctx[3]('home.nft.4.link') + "";
    	let t25;
    	let t26;
    	let t27_value = /*$_*/ ctx[3]('home.nft.4.pEnd') + "";
    	let t27;
    	let t28;
    	let div14;
    	let div7;
    	let h11;
    	let t30;
    	let img1;
    	let img1_src_value;
    	let t31;
    	let div13;
    	let div12;
    	let ul1;
    	let div8;
    	let h44;
    	let t32_value = /*$_*/ ctx[3]('home.nft.5.pStart') + "";
    	let t32;
    	let t33;
    	let a4;
    	let t34_value = /*$_*/ ctx[3]('home.nft.5.link') + "";
    	let t34;
    	let t35;
    	let svg4;
    	let polygon8;
    	let polygon9;
    	let t36;
    	let div9;
    	let h45;
    	let t37_value = /*$_*/ ctx[3]('home.nft.6.pStart') + "";
    	let t37;
    	let t38;
    	let a5;
    	let t39_value = /*$_*/ ctx[3]('home.nft.6.link') + "";
    	let t39;
    	let t40;
    	let svg5;
    	let polygon10;
    	let polygon11;
    	let t41;
    	let div10;
    	let h46;
    	let t42_value = /*$_*/ ctx[3]('home.nft.7.pStart') + "";
    	let t42;
    	let t43;
    	let a6;
    	let t44_value = /*$_*/ ctx[3]('home.nft.7.link') + "";
    	let t44;
    	let t45;
    	let svg6;
    	let polygon12;
    	let polygon13;
    	let t46;
    	let div11;
    	let h47;
    	let t47_value = /*$_*/ ctx[3]('home.nft.8.pStart') + "";
    	let t47;
    	let t48;
    	let a7;
    	let t49_value = /*$_*/ ctx[3]('home.nft.8.link') + "";
    	let t49;
    	let t50;
    	let svg7;
    	let polygon14;
    	let polygon15;
    	let t51;
    	let mounted;
    	let dispose;
    	let if_block = /*modalShowing*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Coming soon";
    			t1 = space();
    			img0 = element("img");
    			t2 = space();
    			div5 = element("div");
    			ul0 = element("ul");
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			polygon0 = svg_element("polygon");
    			polygon1 = svg_element("polygon");
    			t3 = space();
    			h40 = element("h4");
    			t4 = text(t4_value);
    			t5 = space();
    			a0 = element("a");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			svg1 = svg_element("svg");
    			polygon2 = svg_element("polygon");
    			polygon3 = svg_element("polygon");
    			t8 = space();
    			h41 = element("h4");
    			t9 = text(t9_value);
    			t10 = space();
    			a1 = element("a");
    			t11 = text(t11_value);
    			t12 = space();
    			t13 = text(t13_value);
    			t14 = space();
    			div3 = element("div");
    			svg2 = svg_element("svg");
    			polygon4 = svg_element("polygon");
    			polygon5 = svg_element("polygon");
    			t15 = space();
    			h42 = element("h4");
    			t16 = text(t16_value);
    			t17 = space();
    			a2 = element("a");
    			t18 = text(t18_value);
    			t19 = space();
    			t20 = text(t20_value);
    			t21 = space();
    			div4 = element("div");
    			svg3 = svg_element("svg");
    			polygon6 = svg_element("polygon");
    			polygon7 = svg_element("polygon");
    			t22 = space();
    			h43 = element("h4");
    			t23 = text(t23_value);
    			t24 = space();
    			a3 = element("a");
    			t25 = text(t25_value);
    			t26 = space();
    			t27 = text(t27_value);
    			t28 = space();
    			div14 = element("div");
    			div7 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Coming soon";
    			t30 = space();
    			img1 = element("img");
    			t31 = space();
    			div13 = element("div");
    			div12 = element("div");
    			ul1 = element("ul");
    			div8 = element("div");
    			h44 = element("h4");
    			t32 = text(t32_value);
    			t33 = space();
    			a4 = element("a");
    			t34 = text(t34_value);
    			t35 = space();
    			svg4 = svg_element("svg");
    			polygon8 = svg_element("polygon");
    			polygon9 = svg_element("polygon");
    			t36 = space();
    			div9 = element("div");
    			h45 = element("h4");
    			t37 = text(t37_value);
    			t38 = space();
    			a5 = element("a");
    			t39 = text(t39_value);
    			t40 = space();
    			svg5 = svg_element("svg");
    			polygon10 = svg_element("polygon");
    			polygon11 = svg_element("polygon");
    			t41 = space();
    			div10 = element("div");
    			h46 = element("h4");
    			t42 = text(t42_value);
    			t43 = space();
    			a6 = element("a");
    			t44 = text(t44_value);
    			t45 = space();
    			svg6 = svg_element("svg");
    			polygon12 = svg_element("polygon");
    			polygon13 = svg_element("polygon");
    			t46 = space();
    			div11 = element("div");
    			h47 = element("h4");
    			t47 = text(t47_value);
    			t48 = space();
    			a7 = element("a");
    			t49 = text(t49_value);
    			t50 = space();
    			svg7 = svg_element("svg");
    			polygon14 = svg_element("polygon");
    			polygon15 = svg_element("polygon");
    			t51 = space();
    			if (if_block) if_block.c();
    			set_style(h10, "position", "absolute");
    			set_style(h10, "top", "40%");
    			set_style(h10, "z-index", "2");
    			set_style(h10, "font-size", "2rem");
    			set_style(h10, "font-family", "'Oswald'");
    			add_location(h10, file$6, 3, 12, 150);
    			attr_dev(img0, "class", "blurred svelte-jkq38r");
    			attr_dev(img0, "alt", "NFT card");
    			if (!src_url_equal(img0.src, img0_src_value = "images/frame.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$6, 4, 12, 271);
    			attr_dev(div0, "class", "image first marker-highlight svelte-jkq38r");
    			add_location(div0, file$6, 2, 8, 95);
    			set_style(polygon0, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon0, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon0, file$6, 10, 24, 557);
    			set_style(polygon1, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon1, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon1, file$6, 11, 24, 718);
    			attr_dev(svg0, "viewBox", "3 30 500.35 50.328");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$6, 9, 20, 463);
    			attr_dev(a0, "class", "svelte-jkq38r");
    			add_location(a0, file$6, 13, 50, 938);
    			attr_dev(h40, "class", "svelte-jkq38r");
    			add_location(h40, file$6, 13, 20, 908);
    			attr_dev(div1, "class", "info right svelte-jkq38r");
    			add_location(div1, file$6, 8, 16, 418);
    			set_style(polygon2, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon2, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon2, file$6, 17, 24, 1191);
    			set_style(polygon3, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon3, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon3, file$6, 18, 24, 1352);
    			attr_dev(svg1, "viewBox", "3 30 500.35 50.328");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$6, 16, 20, 1097);
    			attr_dev(a1, "class", "svelte-jkq38r");
    			add_location(a1, file$6, 20, 50, 1576);
    			attr_dev(h41, "class", "svelte-jkq38r");
    			add_location(h41, file$6, 20, 20, 1546);
    			attr_dev(div2, "class", "info right svelte-jkq38r");
    			add_location(div2, file$6, 15, 16, 1052);
    			set_style(polygon4, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon4, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon4, file$6, 24, 24, 1852);
    			set_style(polygon5, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon5, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon5, file$6, 25, 24, 2013);
    			attr_dev(svg2, "viewBox", "3 30 500.35 50.328");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg2, file$6, 23, 20, 1758);
    			attr_dev(a2, "class", "svelte-jkq38r");
    			add_location(a2, file$6, 27, 50, 2234);
    			attr_dev(h42, "class", "svelte-jkq38r");
    			add_location(h42, file$6, 27, 20, 2204);
    			attr_dev(div3, "class", "info right svelte-jkq38r");
    			add_location(div3, file$6, 22, 16, 1713);
    			set_style(polygon6, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon6, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon6, file$6, 31, 24, 2514);
    			set_style(polygon7, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon7, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon7, file$6, 32, 24, 2675);
    			attr_dev(svg3, "viewBox", "3 30 500.35 50.328");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg3, file$6, 30, 20, 2420);
    			attr_dev(a3, "class", "svelte-jkq38r");
    			add_location(a3, file$6, 34, 50, 2896);
    			attr_dev(h43, "class", "svelte-jkq38r");
    			add_location(h43, file$6, 34, 20, 2866);
    			attr_dev(div4, "class", "info right svelte-jkq38r");
    			add_location(div4, file$6, 29, 16, 2375);
    			attr_dev(ul0, "class", "svelte-jkq38r");
    			add_location(ul0, file$6, 7, 12, 397);
    			attr_dev(div5, "class", "content second svelte-jkq38r");
    			add_location(div5, file$6, 6, 8, 356);
    			attr_dev(div6, "class", "nft-section svelte-jkq38r");
    			set_style(div6, "margin-bottom", "150px");
    			add_location(div6, file$6, 1, 4, 32);
    			set_style(h11, "position", "absolute");
    			set_style(h11, "top", "40%");
    			set_style(h11, "z-index", "2");
    			set_style(h11, "font-size", "2rem");
    			set_style(h11, "font-family", "'Oswald'");
    			add_location(h11, file$6, 41, 12, 3153);
    			attr_dev(img1, "class", "blurred svelte-jkq38r");
    			if (!src_url_equal(img1.src, img1_src_value = "images/frame.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$6, 42, 12, 3274);
    			attr_dev(div7, "class", "image second marker-highlight svelte-jkq38r");
    			add_location(div7, file$6, 40, 8, 3097);
    			attr_dev(a4, "class", "svelte-jkq38r");
    			add_location(a4, file$6, 48, 54, 3509);
    			attr_dev(h44, "class", "svelte-jkq38r");
    			add_location(h44, file$6, 48, 24, 3479);
    			set_style(polygon8, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon8, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon8, file$6, 50, 28, 3768);
    			set_style(polygon9, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon9, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon9, file$6, 51, 28, 3941);
    			set_style(svg4, "margin-bottom", "-6px");
    			set_style(svg4, "margin-right", "-7px");
    			set_style(svg4, "z-index", "-1");
    			attr_dev(svg4, "viewBox", "3 10 501.79 50.114");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg4, file$6, 49, 24, 3611);
    			attr_dev(div8, "class", "info left svelte-jkq38r");
    			add_location(div8, file$6, 47, 20, 3431);
    			attr_dev(a5, "class", "svelte-jkq38r");
    			add_location(a5, file$6, 55, 54, 4240);
    			attr_dev(h45, "class", "svelte-jkq38r");
    			add_location(h45, file$6, 55, 24, 4210);
    			set_style(polygon10, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon10, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon10, file$6, 57, 28, 4500);
    			set_style(polygon11, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon11, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon11, file$6, 58, 28, 4673);
    			set_style(svg5, "margin-bottom", "-6px");
    			set_style(svg5, "margin-right", "-7px");
    			set_style(svg5, "z-index", "-1");
    			attr_dev(svg5, "viewBox", "3 10 501.79 50.114");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg5, file$6, 56, 24, 4343);
    			attr_dev(div9, "class", "info left svelte-jkq38r");
    			add_location(div9, file$6, 54, 20, 4162);
    			attr_dev(a6, "class", "svelte-jkq38r");
    			add_location(a6, file$6, 62, 54, 4972);
    			attr_dev(h46, "class", "svelte-jkq38r");
    			add_location(h46, file$6, 62, 24, 4942);
    			set_style(polygon12, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon12, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon12, file$6, 64, 28, 5224);
    			set_style(polygon13, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon13, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon13, file$6, 65, 28, 5397);
    			set_style(svg6, "margin-bottom", "-6px");
    			set_style(svg6, "margin-right", "-7px");
    			set_style(svg6, "z-index", "-1");
    			attr_dev(svg6, "viewBox", "3 10 501.79 50.114");
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg6, file$6, 63, 24, 5067);
    			attr_dev(div10, "class", "info left svelte-jkq38r");
    			add_location(div10, file$6, 61, 20, 4894);
    			attr_dev(a7, "class", "svelte-jkq38r");
    			add_location(a7, file$6, 69, 54, 5696);
    			attr_dev(h47, "class", "svelte-jkq38r");
    			add_location(h47, file$6, 69, 24, 5666);
    			set_style(polygon14, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon14, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon14, file$6, 71, 28, 5951);
    			set_style(polygon15, "fill", "rgba(0,255,255,0.5)");
    			attr_dev(polygon15, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon15, file$6, 72, 28, 6124);
    			set_style(svg7, "margin-bottom", "-6px");
    			set_style(svg7, "margin-right", "-7px");
    			set_style(svg7, "z-index", "-1");
    			attr_dev(svg7, "viewBox", "3 10 501.79 50.114");
    			attr_dev(svg7, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg7, file$6, 70, 24, 5794);
    			attr_dev(div11, "class", "info left svelte-jkq38r");
    			add_location(div11, file$6, 68, 20, 5618);
    			attr_dev(ul1, "class", "svelte-jkq38r");
    			add_location(ul1, file$6, 46, 16, 3406);
    			add_location(div12, file$6, 45, 12, 3384);
    			attr_dev(div13, "class", "content first svelte-jkq38r");
    			add_location(div13, file$6, 44, 8, 3344);
    			attr_dev(div14, "class", "nft-section svelte-jkq38r");
    			add_location(div14, file$6, 39, 4, 3063);
    			attr_dev(div15, "class", "NFT-container svelte-jkq38r");
    			add_location(div15, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div6);
    			append_dev(div6, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, img0);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, ul0);
    			append_dev(ul0, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, polygon0);
    			append_dev(svg0, polygon1);
    			append_dev(div1, t3);
    			append_dev(div1, h40);
    			append_dev(h40, t4);
    			append_dev(h40, t5);
    			append_dev(h40, a0);
    			append_dev(a0, t6);
    			append_dev(ul0, t7);
    			append_dev(ul0, div2);
    			append_dev(div2, svg1);
    			append_dev(svg1, polygon2);
    			append_dev(svg1, polygon3);
    			append_dev(div2, t8);
    			append_dev(div2, h41);
    			append_dev(h41, t9);
    			append_dev(h41, t10);
    			append_dev(h41, a1);
    			append_dev(a1, t11);
    			append_dev(h41, t12);
    			append_dev(h41, t13);
    			append_dev(ul0, t14);
    			append_dev(ul0, div3);
    			append_dev(div3, svg2);
    			append_dev(svg2, polygon4);
    			append_dev(svg2, polygon5);
    			append_dev(div3, t15);
    			append_dev(div3, h42);
    			append_dev(h42, t16);
    			append_dev(h42, t17);
    			append_dev(h42, a2);
    			append_dev(a2, t18);
    			append_dev(h42, t19);
    			append_dev(h42, t20);
    			append_dev(ul0, t21);
    			append_dev(ul0, div4);
    			append_dev(div4, svg3);
    			append_dev(svg3, polygon6);
    			append_dev(svg3, polygon7);
    			append_dev(div4, t22);
    			append_dev(div4, h43);
    			append_dev(h43, t23);
    			append_dev(h43, t24);
    			append_dev(h43, a3);
    			append_dev(a3, t25);
    			append_dev(h43, t26);
    			append_dev(h43, t27);
    			append_dev(div15, t28);
    			append_dev(div15, div14);
    			append_dev(div14, div7);
    			append_dev(div7, h11);
    			append_dev(div7, t30);
    			append_dev(div7, img1);
    			append_dev(div14, t31);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, ul1);
    			append_dev(ul1, div8);
    			append_dev(div8, h44);
    			append_dev(h44, t32);
    			append_dev(h44, t33);
    			append_dev(h44, a4);
    			append_dev(a4, t34);
    			append_dev(div8, t35);
    			append_dev(div8, svg4);
    			append_dev(svg4, polygon8);
    			append_dev(svg4, polygon9);
    			append_dev(ul1, t36);
    			append_dev(ul1, div9);
    			append_dev(div9, h45);
    			append_dev(h45, t37);
    			append_dev(h45, t38);
    			append_dev(h45, a5);
    			append_dev(a5, t39);
    			append_dev(div9, t40);
    			append_dev(div9, svg5);
    			append_dev(svg5, polygon10);
    			append_dev(svg5, polygon11);
    			append_dev(ul1, t41);
    			append_dev(ul1, div10);
    			append_dev(div10, h46);
    			append_dev(h46, t42);
    			append_dev(h46, t43);
    			append_dev(h46, a6);
    			append_dev(a6, t44);
    			append_dev(div10, t45);
    			append_dev(div10, svg6);
    			append_dev(svg6, polygon12);
    			append_dev(svg6, polygon13);
    			append_dev(ul1, t46);
    			append_dev(ul1, div11);
    			append_dev(div11, h47);
    			append_dev(h47, t47);
    			append_dev(h47, t48);
    			append_dev(h47, a7);
    			append_dev(a7, t49);
    			append_dev(div11, t50);
    			append_dev(div11, svg7);
    			append_dev(svg7, polygon14);
    			append_dev(svg7, polygon15);
    			append_dev(div15, t51);
    			if (if_block) if_block.m(div15, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[7], false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[8], false, false, false),
    					listen_dev(a4, "click", /*click_handler_4*/ ctx[9], false, false, false),
    					listen_dev(a5, "click", /*click_handler_5*/ ctx[10], false, false, false),
    					listen_dev(a6, "click", /*click_handler_6*/ ctx[11], false, false, false),
    					listen_dev(a7, "click", /*click_handler_7*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$_*/ 8 && t4_value !== (t4_value = /*$_*/ ctx[3]('home.nft.1.pStart') + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$_*/ 8 && t6_value !== (t6_value = /*$_*/ ctx[3]('home.nft.1.link') + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$_*/ 8 && t9_value !== (t9_value = /*$_*/ ctx[3]('home.nft.2.pStart') + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*$_*/ 8 && t11_value !== (t11_value = /*$_*/ ctx[3]('home.nft.2.link') + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*$_*/ 8 && t13_value !== (t13_value = /*$_*/ ctx[3]('home.nft.2.pEnd') + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*$_*/ 8 && t16_value !== (t16_value = /*$_*/ ctx[3]('home.nft.3.pStart') + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*$_*/ 8 && t18_value !== (t18_value = /*$_*/ ctx[3]('home.nft.3.link') + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*$_*/ 8 && t20_value !== (t20_value = /*$_*/ ctx[3]('home.nft.3.pEnd') + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*$_*/ 8 && t23_value !== (t23_value = /*$_*/ ctx[3]('home.nft.4.pStart') + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*$_*/ 8 && t25_value !== (t25_value = /*$_*/ ctx[3]('home.nft.4.link') + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*$_*/ 8 && t27_value !== (t27_value = /*$_*/ ctx[3]('home.nft.4.pEnd') + "")) set_data_dev(t27, t27_value);
    			if (dirty & /*$_*/ 8 && t32_value !== (t32_value = /*$_*/ ctx[3]('home.nft.5.pStart') + "")) set_data_dev(t32, t32_value);
    			if (dirty & /*$_*/ 8 && t34_value !== (t34_value = /*$_*/ ctx[3]('home.nft.5.link') + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*$_*/ 8 && t37_value !== (t37_value = /*$_*/ ctx[3]('home.nft.6.pStart') + "")) set_data_dev(t37, t37_value);
    			if (dirty & /*$_*/ 8 && t39_value !== (t39_value = /*$_*/ ctx[3]('home.nft.6.link') + "")) set_data_dev(t39, t39_value);
    			if (dirty & /*$_*/ 8 && t42_value !== (t42_value = /*$_*/ ctx[3]('home.nft.7.pStart') + "")) set_data_dev(t42, t42_value);
    			if (dirty & /*$_*/ 8 && t44_value !== (t44_value = /*$_*/ ctx[3]('home.nft.7.link') + "")) set_data_dev(t44, t44_value);
    			if (dirty & /*$_*/ 8 && t47_value !== (t47_value = /*$_*/ ctx[3]('home.nft.8.pStart') + "")) set_data_dev(t47, t47_value);
    			if (dirty & /*$_*/ 8 && t49_value !== (t49_value = /*$_*/ ctx[3]('home.nft.8.link') + "")) set_data_dev(t49, t49_value);

    			if (/*modalShowing*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div15, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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

    function instance$7($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(3, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NFT', slots, []);
    	let modalShowing = false;
    	let modalTitle = "modal";
    	let modalDescription = "";

    	let descriptions = {
    		benefits: {
    			title: "Level Rewards",
    			description: "List of rewards users can earn from leveling up"
    		},
    		minting: {
    			title: "Minting",
    			description: "Minting of challenge videos allows our users to truly own their content. Non-Fungible Tokens (NFTs) and smart-contracts are used to wrap ownership of something in rules governed by programmable logic that allows it to be easily traded to others or brought to other platforms in a way that doesn’t rely on centralized control or servers and means your videos will last beyond AllSkills."
    		},
    		leaderboard: {
    			title: "Leaderboards",
    			description: "Description of our various leaderboards"
    		},
    		token: {
    			title: "Mint Token",
    			description: "After you purchase a Mint Token, you can apply it to a challenge video you've already won to mint it into an NFT, or you can apply it to your next challenge making your next win a guaranteed mint."
    		},
    		blockchains: {
    			title: "Blockchains",
    			description: "We want to give our users the freedom to use the blockchain and NFT marketplaces of their choice. Mint your winning challenge videos directly to either Ethereum, Polygon, NEAR, Tezos, or Flow blockchains."
    		},
    		marketplaces: {
    			title: "Marketplaces",
    			description: "The option to mint to so many blockchains opens users up to selling their NFT on the worlds biggest NFT marketplaces like OpenSea and Rarible, on top of our own."
    		},
    		ipfs: {
    			title: "IPFS",
    			description: "The InterPlanetary File System is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices."
    		},
    		arweave: {
    			title: "arweave",
    			description: "Arweave is a new type of storage that backs data with sustainable and perpetual endowments, allowing users and developers to truly store data forever – for the very first time. As a collectively owned hard drive that never forgets, Arweave allows us to remember and preserve valuable information, apps, and history indefinitely. By preserving history, it prevents others from rewriting it."
    		},
    		ardrive: {
    			title: "ardrive",
    			description: "description"
    		}
    	};

    	function showModal(title) {
    		$$invalidate(0, modalShowing = true);
    		$$invalidate(1, modalTitle = descriptions[title].title);
    		$$invalidate(2, modalDescription = descriptions[title].description);
    	} //document.getElementById(target).style.display = "block";
    	//document.getElementById("overlay").style.visibility = "visible";

    	function closeModal() {
    		$$invalidate(0, modalShowing = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NFT> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => showModal("benefits");
    	const click_handler_1 = () => showModal("minting");
    	const click_handler_2 = () => showModal("leaderboard");
    	const click_handler_3 = () => showModal("token");
    	const click_handler_4 = () => showModal("blockchains");
    	const click_handler_5 = () => showModal("marketplaces");
    	const click_handler_6 = () => showModal("ipfs");
    	const click_handler_7 = () => showModal("arweave");
    	const click_handler_8 = () => $$invalidate(0, modalShowing = false);

    	$$self.$capture_state = () => ({
    		_: X,
    		modalShowing,
    		modalTitle,
    		modalDescription,
    		descriptions,
    		showModal,
    		closeModal,
    		$_
    	});

    	$$self.$inject_state = $$props => {
    		if ('modalShowing' in $$props) $$invalidate(0, modalShowing = $$props.modalShowing);
    		if ('modalTitle' in $$props) $$invalidate(1, modalTitle = $$props.modalTitle);
    		if ('modalDescription' in $$props) $$invalidate(2, modalDescription = $$props.modalDescription);
    		if ('descriptions' in $$props) descriptions = $$props.descriptions;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		modalShowing,
    		modalTitle,
    		modalDescription,
    		$_,
    		showModal,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class NFT extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NFT",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Youtube.svelte generated by Svelte v3.44.3 */

    const { console: console_1$2 } = globals;
    const file$5 = "src/Youtube.svelte";

    function create_fragment$6(ctx) {
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			set_style(div0, "width", "380px");
    			set_style(div0, "height", "690px");
    			set_style(div0, "background-color", "black");
    			set_style(div0, "border-radius", "50px");
    			set_style(div0, "position", "absolute");
    			attr_dev(div0, "id", "placeholder");
    			add_location(div0, file$5, 94, 2, 3015);
    			set_style(div1, "border-radius", "40px");
    			set_style(div1, "padding-top", "19px");
    			set_style(div1, "padding-left", "5px");
    			attr_dev(div1, "id", /*divId*/ ctx[0]);
    			add_location(div1, file$5, 97, 2, 3151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
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

    function loadYT() {
    	var tag = document.createElement("script");
    	tag.src = "https://www.youtube.com/iframe_api";
    	var firstScriptTag = document.getElementsByTagName("script")[0];
    	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    	window.onYouTubeIframeAPIReady = () => window.dispatchEvent(new Event("iframeApiReady"));
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Youtube', slots, []);

    	onMount(() => {
    		
    	}); /*document.getElementById("placeholder").addEventListener("click", function(){
        this.style.display = 'none';
        loadYT()
    });
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
    window.onYouTubeIframeAPIReady = () =>
    window.dispatchEvent(new Event("iframeApiReady"));*/

    	let { videoId } = $$props;
    	let player;
    	let divId = "player-1";

    	function play() {
    		console.log("trying to play");

    		if (player.getPlayerState() !== 1) {
    			player.playVideo();
    		}
    	}

    	function stop() {
    		player.stopVideo();
    	}

    	function pause() {
    		player.pauseVideo();
    	}

    	function unmute() {
    		player.unMute();
    	}

    	function mute() {
    		player.mute();
    	}

    	function getPlayerState() {
    		return player.getPlayerState();
    	}

    	const dispatch = createEventDispatcher();

    	window.addEventListener("iframeApiReady", function (e) {
    		player = new YT.Player(divId,
    		{
    				height: "645",
    				width: "345",
    				videoId,
    				playerVars: {
    					'autoplay': 1,
    					'controls': 0,
    					'enablejsapi': 1,
    					'modestbranding': 1,
    					'rel': 0,
    					'playsinline': 1
    				},
    				events: {
    					onReady: playerIsReady,
    					onStateChange: playerStateChange
    				}
    			});
    	});

    	function playerStateChange({ data }) {
    		dispatch("PlayerStateChange", data);
    		console.log(data);
    		let strReturn = "";

    		if (data == -1) {
    			strReturn = "(unstarted)";
    		} //console.log("playing because unstarted")
    		//player.playVideo()

    		if (data == 0) {
    			strReturn = "(ended)";
    		}

    		if (data == 1) {
    			strReturn = "(playing)";
    		}

    		if (data == 2) {
    			strReturn = "(paused)";
    		}

    		if (data == 3) {
    			strReturn = "(buffering)";

    			//console.log("playing because of buffer")
    			player.playVideo();
    		}

    		if (data == 5) {
    			strReturn = "(video cued).";
    		}

    		dispatch("PlayerStateChangeString", strReturn);
    	}

    	function playerIsReady(event) {
    		dispatch("Ready");
    		console.log("playing because ready");
    		event.target.mute();
    		event.target.playVideo();
    		document.getElementById("placeholder").style.display = "none";
    	} //entry.target.style.display = 'none';

    	const writable_props = ['videoId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Youtube> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('videoId' in $$props) $$invalidate(1, videoId = $$props.videoId);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		loadYT,
    		videoId,
    		player,
    		divId,
    		play,
    		stop,
    		pause,
    		unmute,
    		mute,
    		getPlayerState,
    		dispatch,
    		playerStateChange,
    		playerIsReady
    	});

    	$$self.$inject_state = $$props => {
    		if ('videoId' in $$props) $$invalidate(1, videoId = $$props.videoId);
    		if ('player' in $$props) player = $$props.player;
    		if ('divId' in $$props) $$invalidate(0, divId = $$props.divId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [divId, videoId, play, stop, pause, unmute, mute, getPlayerState];
    }

    class Youtube extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			videoId: 1,
    			play: 2,
    			stop: 3,
    			pause: 4,
    			unmute: 5,
    			mute: 6,
    			getPlayerState: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Youtube",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*videoId*/ ctx[1] === undefined && !('videoId' in props)) {
    			console_1$2.warn("<Youtube> was created without expected prop 'videoId'");
    		}
    	}

    	get videoId() {
    		throw new Error("<Youtube>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set videoId(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get play() {
    		return this.$$.ctx[2];
    	}

    	set play(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stop() {
    		return this.$$.ctx[3];
    	}

    	set stop(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[4];
    	}

    	set pause(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmute() {
    		return this.$$.ctx[5];
    	}

    	set unmute(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mute() {
    		return this.$$.ctx[6];
    	}

    	set mute(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getPlayerState() {
    		return this.$$.ctx[7];
    	}

    	set getPlayerState(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Carousel.svelte generated by Svelte v3.44.3 */

    const file$4 = "src/Carousel.svelte";

    function create_fragment$5(ctx) {
    	let div4;
    	let div3;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let div2;
    	let label0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let label1;
    	let div0;
    	let h10;
    	let t5;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let label2;
    	let div1;
    	let h11;
    	let t8;
    	let img2;
    	let img2_src_value;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			div2 = element("div");
    			label0 = element("label");
    			img0 = element("img");
    			t3 = space();
    			label1 = element("label");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Coming soon";
    			t5 = space();
    			img1 = element("img");
    			t6 = space();
    			label2 = element("label");
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Coming soon";
    			t8 = space();
    			img2 = element("img");
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "slider");
    			attr_dev(input0, "id", "item-1");
    			input0.checked = true;
    			attr_dev(input0, "class", "svelte-13dh4e1");
    			add_location(input0, file$4, 2, 8, 69);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "slider");
    			attr_dev(input1, "id", "item-2");
    			attr_dev(input1, "class", "svelte-13dh4e1");
    			add_location(input1, file$4, 3, 8, 132);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "slider");
    			attr_dev(input2, "id", "item-3");
    			attr_dev(input2, "class", "svelte-13dh4e1");
    			add_location(input2, file$4, 4, 8, 187);
    			if (!src_url_equal(img0.src, img0_src_value = "images/Chris_Boucher.jpeg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "NFT Trading Card");
    			attr_dev(img0, "class", "svelte-13dh4e1");
    			add_location(img0, file$4, 7, 8, 320);
    			attr_dev(label0, "class", "card svelte-13dh4e1");
    			attr_dev(label0, "for", "item-1");
    			attr_dev(label0, "id", "card-1");
    			add_location(label0, file$4, 6, 8, 266);
    			attr_dev(h10, "class", "overlay-text svelte-13dh4e1");
    			add_location(h10, file$4, 10, 35, 487);
    			attr_dev(div0, "class", "text-holder svelte-13dh4e1");
    			add_location(div0, file$4, 10, 10, 462);
    			attr_dev(img1, "class", "blurred svelte-13dh4e1");
    			if (!src_url_equal(img1.src, img1_src_value = "images/Dunk.webp")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "NFT Trading Card");
    			add_location(img1, file$4, 11, 10, 545);
    			attr_dev(label1, "class", "card svelte-13dh4e1");
    			attr_dev(label1, "for", "item-2");
    			attr_dev(label1, "id", "card-2");
    			add_location(label1, file$4, 9, 8, 406);
    			attr_dev(h11, "class", "overlay-text svelte-13dh4e1");
    			add_location(h11, file$4, 14, 35, 719);
    			attr_dev(div1, "class", "text-holder svelte-13dh4e1");
    			add_location(div1, file$4, 14, 10, 694);
    			attr_dev(img2, "class", "blurred svelte-13dh4e1");
    			if (!src_url_equal(img2.src, img2_src_value = "images/skateboard.webp")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "NFT Trading Card");
    			add_location(img2, file$4, 15, 10, 777);
    			attr_dev(label2, "class", "card svelte-13dh4e1");
    			attr_dev(label2, "for", "item-3");
    			attr_dev(label2, "id", "card-3");
    			add_location(label2, file$4, 13, 8, 638);
    			attr_dev(div2, "class", "cards svelte-13dh4e1");
    			add_location(div2, file$4, 5, 4, 238);
    			attr_dev(div3, "class", "container svelte-13dh4e1");
    			add_location(div3, file$4, 1, 4, 37);
    			attr_dev(div4, "class", "carousel-container svelte-13dh4e1");
    			add_location(div4, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, input0);
    			append_dev(div3, t0);
    			append_dev(div3, input1);
    			append_dev(div3, t1);
    			append_dev(div3, input2);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, label0);
    			append_dev(label0, img0);
    			append_dev(div2, t3);
    			append_dev(div2, label1);
    			append_dev(label1, div0);
    			append_dev(div0, h10);
    			append_dev(label1, t5);
    			append_dev(label1, img1);
    			append_dev(div2, t6);
    			append_dev(div2, label2);
    			append_dev(label2, div1);
    			append_dev(div1, h11);
    			append_dev(label2, t8);
    			append_dev(label2, img2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
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

    /* src/Ambassador.svelte generated by Svelte v3.44.3 */
    const file$3 = "src/Ambassador.svelte";

    function create_fragment$4(ctx) {
    	let div4;
    	let carousel;
    	let t0;
    	let div3;
    	let div0;
    	let h40;
    	let t1_value = /*$_*/ ctx[0]('home.ambassador.line1') + "";
    	let t1;
    	let t2;
    	let div1;
    	let h41;
    	let t3_value = /*$_*/ ctx[0]('home.ambassador.line2') + "";
    	let t3;
    	let t4;
    	let div2;
    	let h42;
    	let t5_value = /*$_*/ ctx[0]('home.ambassador.line3') + "";
    	let t5;
    	let current;
    	carousel = new Carousel({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(carousel.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			h40 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			h41 = element("h4");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			h42 = element("h4");
    			t5 = text(t5_value);
    			attr_dev(h40, "class", "slidedown svelte-tle2l2");
    			add_location(h40, file$3, 4, 37, 137);
    			attr_dev(div0, "class", "ambassador-info svelte-tle2l2");
    			add_location(div0, file$3, 4, 8, 108);
    			attr_dev(h41, "class", "slidedown svelte-tle2l2");
    			add_location(h41, file$3, 5, 37, 237);
    			attr_dev(div1, "class", "ambassador-info svelte-tle2l2");
    			add_location(div1, file$3, 5, 8, 208);
    			set_style(h42, "text-decoration", "underline white");
    			set_style(h42, "-webkit-text-decoration", "underline white");
    			attr_dev(h42, "class", "slidedown svelte-tle2l2");
    			add_location(h42, file$3, 6, 37, 337);
    			attr_dev(div2, "class", "ambassador-info svelte-tle2l2");
    			add_location(div2, file$3, 6, 8, 308);
    			attr_dev(div3, "class", "info-container full-highlight svelte-tle2l2");
    			add_location(div3, file$3, 3, 4, 56);
    			attr_dev(div4, "class", "ambassador-container svelte-tle2l2");
    			add_location(div4, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(carousel, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h40);
    			append_dev(h40, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, h41);
    			append_dev(h41, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, h42);
    			append_dev(h42, t5);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$_*/ 1) && t1_value !== (t1_value = /*$_*/ ctx[0]('home.ambassador.line1') + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$_*/ 1) && t3_value !== (t3_value = /*$_*/ ctx[0]('home.ambassador.line2') + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*$_*/ 1) && t5_value !== (t5_value = /*$_*/ ctx[0]('home.ambassador.line3') + "")) set_data_dev(t5, t5_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(carousel);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(0, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ambassador', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ambassador> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Carousel, _: X, $_ });
    	return [$_];
    }

    class Ambassador extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ambassador",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Observers.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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
    	validate_slots('Observers', slots, []);

    	onMount(() => {
    		const observer = new IntersectionObserver(entries => {
    				// Loop over the entries
    				let highlightShowing = 0;

    				entries.forEach(entry => {
    					// If the element is visible
    					if (entry.isIntersecting) {
    						// Add the animation class
    						entry.target.classList.add('type');

    						highlightShowing += 1;
    					}
    				});

    				if (highlightShowing >= 2) {
    					observer.disconnect();
    				}
    			});

    		const underlineObserver = new IntersectionObserver(entries => {
    				// Loop over the entries
    				let titlesShowing = 0;

    				entries.forEach(entry => {
    					// If the element is visible
    					if (entry.isIntersecting) {
    						// Add the animation class
    						entry.target.classList.add('underline');

    						titlesShowing += 1;
    					}
    				});

    				if (titlesShowing >= titles.length) {
    					underlineObserver.disconnect();
    				}
    			});

    		const cardObserver = new IntersectionObserver(entries => {
    				// Loop over the entries
    				let infoShowing = 0;

    				entries.forEach(entry => {
    					// If the element is visible
    					if (entry.isIntersecting) {
    						// Add the animation class
    						entry.target.classList.add('slide-in');

    						infoShowing += 1;
    					}
    				});

    				if (infoShowing >= cards.length) {
    					cardObserver.disconnect();
    				}
    			});

    		const coinObserver = new IntersectionObserver(entries => {
    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						entry.target.classList.add('grow');
    						coinObserver.disconnect();
    					}
    				});
    			});

    		const checksObserver = new IntersectionObserver(entries => {
    				let cardsShowing = 0;

    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						entry.target.classList.add('growshrink');
    						var styleElem = document.head.appendChild(document.createElement("style"));
    						styleElem.innerHTML = ".cleared::after {animation: appear 4s forwards ease}";
    						cardsShowing += 1;
    					} //checksObserver.disconnect()
    				});

    				if (cardsShowing >= 5) {
    					checksObserver.disconnect();
    				}
    			});

    		const videoObserver = new IntersectionObserver(entries => {
    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						var tag = document.createElement("script");
    						tag.src = "https://www.youtube.com/iframe_api";
    						var firstScriptTag = document.getElementsByTagName("script")[0];
    						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    						window.onYouTubeIframeAPIReady = () => window.dispatchEvent(new Event("iframeApiReady"));
    						videoObserver.disconnect();
    					}
    				});
    			});

    		const video = document.getElementById("placeholder");
    		videoObserver.observe(video);
    		const checks = document.querySelectorAll(".header");
    		checks.forEach(check => checksObserver.observe(check));
    		const coin = document.querySelector("#coin");
    		coinObserver.observe(coin);
    		const cards = document.querySelectorAll('.info');
    		console.log("cards: " + cards.length.toString());
    		cards.forEach(card => cardObserver.observe(card));
    		const importants = document.querySelectorAll('.important');
    		importants.forEach(important => observer.observe(important));
    		const titles = document.querySelectorAll('.title');
    		titles.forEach(title => underlineObserver.observe(title));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Observers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class Observers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Observers",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$2 = "src/Content.svelte";

    function create_fragment$2(ctx) {
    	let observers;
    	let t0;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div2;
    	let youtube;
    	let t3;
    	let div8;
    	let h20;
    	let t5;
    	let table;
    	let t6;
    	let div4;
    	let h3;
    	let span0;
    	let t7_value = /*$_*/ ctx[1]('home.highlighted.company') + "";
    	let t7;
    	let t8;
    	let t9_value = /*$_*/ ctx[1]('home.highlighted.start') + "";
    	let t9;
    	let t10;
    	let span1;
    	let t11_value = /*$_*/ ctx[1]('home.highlighted.highlight1') + "";
    	let t11;
    	let t12_value = /*$_*/ ctx[1]('home.highlighted.middle') + "";
    	let t12;
    	let t13;
    	let span2;
    	let t14_value = /*$_*/ ctx[1]('home.highlighted.highlight2') + "";
    	let t14;
    	let t15;
    	let svg0;
    	let polygon0;
    	let polygon1;
    	let t16;
    	let section0;
    	let h21;
    	let t18;
    	let challenge;
    	let t19;
    	let svg1;
    	let polygon2;
    	let polygon3;
    	let t20;
    	let section1;
    	let h22;
    	let span3;
    	let t22;
    	let t23;
    	let votetoken;
    	let t24;
    	let svg2;
    	let polygon4;
    	let polygon5;
    	let t25;
    	let section2;
    	let h23;
    	let span4;
    	let t27;
    	let t28;
    	let nft;
    	let t29;
    	let svg3;
    	let polygon6;
    	let polygon7;
    	let t30;
    	let section3;
    	let h24;
    	let t32;
    	let ambassador;
    	let t33;
    	let svg4;
    	let polygon8;
    	let polygon9;
    	let t34;
    	let section4;
    	let h25;
    	let t36;
    	let roadmap;
    	let t37;
    	let svg5;
    	let polygon10;
    	let polygon11;
    	let t38;
    	let section5;
    	let h26;
    	let t40;
    	let div5;
    	let tokenomics;
    	let t41;
    	let svg6;
    	let polygon12;
    	let polygon13;
    	let t42;
    	let section6;
    	let h27;
    	let t44;
    	let teamcards;
    	let t45;
    	let div7;
    	let div6;
    	let t46;
    	let section7;
    	let h28;
    	let t48;
    	let partners;
    	let current;
    	let mounted;
    	let dispose;
    	observers = new Observers({ $$inline: true });
    	let youtube_props = { videoId: "O2A5MIWsCFI" };
    	youtube = new Youtube({ props: youtube_props, $$inline: true });
    	/*youtube_binding*/ ctx[5](youtube);
    	youtube.$on("End", /*End_handler*/ ctx[6]);
    	youtube.$on("Ready", /*Ready_handler*/ ctx[7]);
    	table = new Table({ $$inline: true });
    	challenge = new Challenge({ $$inline: true });
    	votetoken = new VoteToken({ $$inline: true });
    	nft = new NFT({ $$inline: true });
    	ambassador = new Ambassador({ $$inline: true });
    	roadmap = new Roadmap({ $$inline: true });
    	tokenomics = new Tokenomics({ $$inline: true });
    	teamcards = new TeamCards({ $$inline: true });
    	partners = new Partners({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(observers.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			img = element("img");
    			t2 = space();
    			div2 = element("div");
    			create_component(youtube.$$.fragment);
    			t3 = space();
    			div8 = element("div");
    			h20 = element("h2");
    			h20.textContent = "What We Provide";
    			t5 = space();
    			create_component(table.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			h3 = element("h3");
    			span0 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			t9 = text(t9_value);
    			t10 = space();
    			span1 = element("span");
    			t11 = text(t11_value);
    			t12 = text(t12_value);
    			t13 = space();
    			span2 = element("span");
    			t14 = text(t14_value);
    			t15 = space();
    			svg0 = svg_element("svg");
    			polygon0 = svg_element("polygon");
    			polygon1 = svg_element("polygon");
    			t16 = space();
    			section0 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Challenge System";
    			t18 = space();
    			create_component(challenge.$$.fragment);
    			t19 = space();
    			svg1 = svg_element("svg");
    			polygon2 = svg_element("polygon");
    			polygon3 = svg_element("polygon");
    			t20 = space();
    			section1 = element("section");
    			h22 = element("h2");
    			span3 = element("span");
    			span3.textContent = "AllSkills";
    			t22 = text(" $Vote Token");
    			t23 = space();
    			create_component(votetoken.$$.fragment);
    			t24 = space();
    			svg2 = svg_element("svg");
    			polygon4 = svg_element("polygon");
    			polygon5 = svg_element("polygon");
    			t25 = space();
    			section2 = element("section");
    			h23 = element("h2");
    			span4 = element("span");
    			span4.textContent = "AllSkills";
    			t27 = text(" NFTs");
    			t28 = space();
    			create_component(nft.$$.fragment);
    			t29 = space();
    			svg3 = svg_element("svg");
    			polygon6 = svg_element("polygon");
    			polygon7 = svg_element("polygon");
    			t30 = space();
    			section3 = element("section");
    			h24 = element("h2");
    			h24.textContent = "Ambassador Program";
    			t32 = space();
    			create_component(ambassador.$$.fragment);
    			t33 = space();
    			svg4 = svg_element("svg");
    			polygon8 = svg_element("polygon");
    			polygon9 = svg_element("polygon");
    			t34 = space();
    			section4 = element("section");
    			h25 = element("h2");
    			h25.textContent = "Buildup to Launch & Beyond";
    			t36 = space();
    			create_component(roadmap.$$.fragment);
    			t37 = space();
    			svg5 = svg_element("svg");
    			polygon10 = svg_element("polygon");
    			polygon11 = svg_element("polygon");
    			t38 = space();
    			section5 = element("section");
    			h26 = element("h2");
    			h26.textContent = "Tokenomics";
    			t40 = space();
    			div5 = element("div");
    			create_component(tokenomics.$$.fragment);
    			t41 = space();
    			svg6 = svg_element("svg");
    			polygon12 = svg_element("polygon");
    			polygon13 = svg_element("polygon");
    			t42 = space();
    			section6 = element("section");
    			h27 = element("h2");
    			h27.textContent = "The Team";
    			t44 = space();
    			create_component(teamcards.$$.fragment);
    			t45 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t46 = space();
    			section7 = element("section");
    			h28 = element("h2");
    			h28.textContent = "Partners";
    			t48 = space();
    			create_component(partners.$$.fragment);
    			attr_dev(div0, "id", "mute");
    			attr_dev(div0, "class", "svelte-8ob8ap");
    			add_location(div0, file$2, 74, 4, 2681);
    			attr_dev(img, "alt", "Phone frame");
    			if (!src_url_equal(img.src, img_src_value = "images/iphone_frame.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-8ob8ap");
    			add_location(img, file$2, 75, 27, 2749);
    			attr_dev(div1, "class", "img-frame svelte-8ob8ap");
    			add_location(div1, file$2, 75, 4, 2726);
    			attr_dev(div2, "class", "video svelte-8ob8ap");
    			add_location(div2, file$2, 76, 4, 2814);
    			attr_dev(div3, "id", "Trailer");
    			attr_dev(div3, "class", "video-container marker-highlight svelte-8ob8ap");
    			add_location(div3, file$2, 73, 0, 2616);
    			attr_dev(h20, "class", "svelte-8ob8ap");
    			add_location(h20, file$2, 83, 4, 3257);
    			set_style(span0, "color", "aqua");
    			add_location(span0, file$2, 86, 12, 3340);
    			attr_dev(span1, "class", "important");
    			add_location(span1, file$2, 86, 109, 3437);
    			attr_dev(span2, "class", "important");
    			add_location(span2, file$2, 86, 207, 3535);
    			attr_dev(h3, "class", "svelte-8ob8ap");
    			add_location(h3, file$2, 86, 8, 3336);
    			attr_dev(div4, "class", "powered-by svelte-8ob8ap");
    			add_location(div4, file$2, 85, 4, 3302);
    			set_style(polygon0, "fill", "aqua");
    			attr_dev(polygon0, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon0, file$2, 89, 8, 3722);
    			set_style(polygon1, "fill", "aqua");
    			attr_dev(polygon1, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon1, file$2, 90, 8, 3853);
    			attr_dev(svg0, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg0, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$2, 88, 4, 3624);
    			set_style(h21, "text-decoration", "underline aqua");
    			set_style(h21, "-webkit-text-decoration-line", "underline");
    			set_style(h21, "-webkit-text-decoration-color", "aqua");
    			attr_dev(h21, "class", "svelte-8ob8ap");
    			add_location(h21, file$2, 93, 8, 4048);
    			attr_dev(section0, "id", "Challenge");
    			attr_dev(section0, "class", "section svelte-8ob8ap");
    			add_location(section0, file$2, 92, 4, 3998);
    			set_style(polygon2, "fill", "gold");
    			attr_dev(polygon2, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon2, file$2, 97, 8, 4334);
    			set_style(polygon3, "fill", "gold");
    			attr_dev(polygon3, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon3, file$2, 98, 8, 4473);
    			attr_dev(svg1, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg1, "viewBox", "-1.79 0 501.79 94.114");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$2, 96, 4, 4236);
    			set_style(span3, "font-family", "'Bebas Neue'");
    			add_location(span3, file$2, 101, 151, 4808);
    			set_style(h22, "text-align", "center");
    			set_style(h22, "text-decoration", "underline gold");
    			set_style(h22, "-webkit-text-decoration-line", "underline");
    			set_style(h22, "-webkit-text-decoration-color", "gold");
    			attr_dev(h22, "class", "svelte-8ob8ap");
    			add_location(h22, file$2, 101, 8, 4665);
    			attr_dev(section1, "id", "Vote");
    			attr_dev(section1, "class", "section svelte-8ob8ap");
    			add_location(section1, file$2, 100, 4, 4620);
    			set_style(polygon4, "fill", "blueviolet");
    			attr_dev(polygon4, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon4, file$2, 105, 8, 5024);
    			set_style(polygon5, "fill", "blueviolet");
    			attr_dev(polygon5, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon5, file$2, 106, 8, 5161);
    			attr_dev(svg2, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg2, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg2, file$2, 104, 4, 4926);
    			set_style(span4, "font-family", "'Bebas Neue'");
    			add_location(span4, file$2, 109, 27, 5375);
    			attr_dev(h23, "id", "nftTitle");
    			attr_dev(h23, "class", "svelte-8ob8ap");
    			add_location(h23, file$2, 109, 8, 5356);
    			attr_dev(section2, "id", "NFT");
    			attr_dev(section2, "class", "section svelte-8ob8ap");
    			add_location(section2, file$2, 108, 4, 5312);
    			set_style(polygon6, "fill", "#FF3333");
    			attr_dev(polygon6, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon6, file$2, 113, 8, 5578);
    			set_style(polygon7, "fill", "#FF3333");
    			attr_dev(polygon7, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon7, file$2, 114, 8, 5720);
    			attr_dev(svg3, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg3, "viewBox", "-1.79 0 501.79 94.114");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg3, file$2, 112, 4, 5480);
    			set_style(h24, "text-decoration", "underline #FF3333");
    			set_style(h24, "-webkit-text-decoration-line", "underline");
    			set_style(h24, "-webkit-text-decoration-color", "#FF3333");
    			attr_dev(h24, "class", "svelte-8ob8ap");
    			add_location(h24, file$2, 117, 8, 5922);
    			attr_dev(section3, "id", "Ambassadors");
    			attr_dev(section3, "class", "section svelte-8ob8ap");
    			add_location(section3, file$2, 116, 4, 5870);
    			set_style(polygon8, "fill", "white");
    			attr_dev(polygon8, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon8, file$2, 121, 8, 6217);
    			set_style(polygon9, "fill", "white");
    			attr_dev(polygon9, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon9, file$2, 122, 8, 6349);
    			attr_dev(svg4, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg4, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg4, file$2, 120, 4, 6119);
    			set_style(h25, "text-decoration", "underline white");
    			set_style(h25, "-webkit-text-decoration-line", "underline");
    			set_style(h25, "-webkit-text-decoration-color", "white");
    			set_style(h25, "margin-bottom", "75px");
    			attr_dev(h25, "class", "svelte-8ob8ap");
    			add_location(h25, file$2, 125, 8, 6543);
    			attr_dev(section4, "id", "Roadmap");
    			attr_dev(section4, "class", "section svelte-8ob8ap");
    			add_location(section4, file$2, 124, 4, 6495);
    			set_style(polygon10, "fill", "#78FF78");
    			attr_dev(polygon10, "points", "500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393");
    			add_location(polygon10, file$2, 129, 8, 6860);
    			set_style(polygon11, "fill", "#78FF78");
    			attr_dev(polygon11, "points", "352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985");
    			add_location(polygon11, file$2, 130, 8, 7002);
    			attr_dev(svg5, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg5, "viewBox", "-1.79 0 501.79 94.114");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg5, file$2, 128, 4, 6762);
    			set_style(h26, "text-align", "center");
    			set_style(h26, "text-decoration", "underline #78FF78");
    			set_style(h26, "-webkit-text-decoration-line", "underline");
    			set_style(h26, "-webkit-text-decoration-color", "#78FF78");
    			attr_dev(h26, "class", "svelte-8ob8ap");
    			add_location(h26, file$2, 133, 8, 7203);
    			add_location(div5, file$2, 134, 8, 7377);
    			attr_dev(section5, "id", "Tokenomics");
    			attr_dev(section5, "class", "section svelte-8ob8ap");
    			add_location(section5, file$2, 132, 4, 7152);
    			set_style(polygon12, "fill", "white");
    			attr_dev(polygon12, "points", "70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101");
    			add_location(polygon12, file$2, 139, 8, 7545);
    			set_style(polygon13, "fill", "white");
    			attr_dev(polygon13, "points", "120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134");
    			add_location(polygon13, file$2, 140, 8, 7677);
    			attr_dev(svg6, "class", "bMargin svelte-8ob8ap");
    			attr_dev(svg6, "viewBox", "-0.35 0 500.35 78.328");
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg6, file$2, 138, 4, 7447);
    			set_style(h27, "text-decoration", "underline white");
    			set_style(h27, "-webkit-text-decoration-line", "underline");
    			attr_dev(h27, "class", "svelte-8ob8ap");
    			add_location(h27, file$2, 143, 8, 7868);
    			attr_dev(section6, "id", "Team");
    			attr_dev(section6, "class", "section svelte-8ob8ap");
    			add_location(section6, file$2, 142, 4, 7823);
    			attr_dev(div6, "class", "triangle svelte-8ob8ap");
    			add_location(div6, file$2, 147, 8, 8039);
    			attr_dev(div7, "class", "top svelte-8ob8ap");
    			add_location(div7, file$2, 146, 4, 8012);
    			set_style(h28, "margin-left", "7%");
    			set_style(h28, "text-shadow", "none");
    			attr_dev(h28, "class", "svelte-8ob8ap");
    			add_location(h28, file$2, 150, 8, 8153);
    			attr_dev(section7, "id", "Partners");
    			attr_dev(section7, "class", "white svelte-8ob8ap");
    			set_style(section7, "width", "100%");
    			add_location(section7, file$2, 149, 4, 8085);
    			attr_dev(div8, "class", "text-content svelte-8ob8ap");
    			add_location(div8, file$2, 82, 0, 3225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(observers, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, img);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(youtube, div2, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, h20);
    			append_dev(div8, t5);
    			mount_component(table, div8, null);
    			append_dev(div8, t6);
    			append_dev(div8, div4);
    			append_dev(div4, h3);
    			append_dev(h3, span0);
    			append_dev(span0, t7);
    			append_dev(h3, t8);
    			append_dev(h3, t9);
    			append_dev(h3, t10);
    			append_dev(h3, span1);
    			append_dev(span1, t11);
    			append_dev(h3, t12);
    			append_dev(h3, t13);
    			append_dev(h3, span2);
    			append_dev(span2, t14);
    			append_dev(div8, t15);
    			append_dev(div8, svg0);
    			append_dev(svg0, polygon0);
    			append_dev(svg0, polygon1);
    			append_dev(div8, t16);
    			append_dev(div8, section0);
    			append_dev(section0, h21);
    			append_dev(section0, t18);
    			mount_component(challenge, section0, null);
    			append_dev(div8, t19);
    			append_dev(div8, svg1);
    			append_dev(svg1, polygon2);
    			append_dev(svg1, polygon3);
    			append_dev(div8, t20);
    			append_dev(div8, section1);
    			append_dev(section1, h22);
    			append_dev(h22, span3);
    			append_dev(h22, t22);
    			append_dev(section1, t23);
    			mount_component(votetoken, section1, null);
    			append_dev(div8, t24);
    			append_dev(div8, svg2);
    			append_dev(svg2, polygon4);
    			append_dev(svg2, polygon5);
    			append_dev(div8, t25);
    			append_dev(div8, section2);
    			append_dev(section2, h23);
    			append_dev(h23, span4);
    			append_dev(h23, t27);
    			append_dev(section2, t28);
    			mount_component(nft, section2, null);
    			append_dev(div8, t29);
    			append_dev(div8, svg3);
    			append_dev(svg3, polygon6);
    			append_dev(svg3, polygon7);
    			append_dev(div8, t30);
    			append_dev(div8, section3);
    			append_dev(section3, h24);
    			append_dev(section3, t32);
    			mount_component(ambassador, section3, null);
    			append_dev(div8, t33);
    			append_dev(div8, svg4);
    			append_dev(svg4, polygon8);
    			append_dev(svg4, polygon9);
    			append_dev(div8, t34);
    			append_dev(div8, section4);
    			append_dev(section4, h25);
    			append_dev(section4, t36);
    			mount_component(roadmap, section4, null);
    			append_dev(div8, t37);
    			append_dev(div8, svg5);
    			append_dev(svg5, polygon10);
    			append_dev(svg5, polygon11);
    			append_dev(div8, t38);
    			append_dev(div8, section5);
    			append_dev(section5, h26);
    			append_dev(section5, t40);
    			append_dev(section5, div5);
    			mount_component(tokenomics, div5, null);
    			append_dev(div8, t41);
    			append_dev(div8, svg6);
    			append_dev(svg6, polygon12);
    			append_dev(svg6, polygon13);
    			append_dev(div8, t42);
    			append_dev(div8, section6);
    			append_dev(section6, h27);
    			append_dev(section6, t44);
    			mount_component(teamcards, section6, null);
    			append_dev(div8, t45);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div8, t46);
    			append_dev(div8, section7);
    			append_dev(section7, h28);
    			append_dev(section7, t48);
    			mount_component(partners, section7, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*unmute*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const youtube_changes = {};
    			youtube.$set(youtube_changes);
    			if ((!current || dirty & /*$_*/ 2) && t7_value !== (t7_value = /*$_*/ ctx[1]('home.highlighted.company') + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*$_*/ 2) && t9_value !== (t9_value = /*$_*/ ctx[1]('home.highlighted.start') + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*$_*/ 2) && t11_value !== (t11_value = /*$_*/ ctx[1]('home.highlighted.highlight1') + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*$_*/ 2) && t12_value !== (t12_value = /*$_*/ ctx[1]('home.highlighted.middle') + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*$_*/ 2) && t14_value !== (t14_value = /*$_*/ ctx[1]('home.highlighted.highlight2') + "")) set_data_dev(t14, t14_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(observers.$$.fragment, local);
    			transition_in(youtube.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(challenge.$$.fragment, local);
    			transition_in(votetoken.$$.fragment, local);
    			transition_in(nft.$$.fragment, local);
    			transition_in(ambassador.$$.fragment, local);
    			transition_in(roadmap.$$.fragment, local);
    			transition_in(tokenomics.$$.fragment, local);
    			transition_in(teamcards.$$.fragment, local);
    			transition_in(partners.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(observers.$$.fragment, local);
    			transition_out(youtube.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(challenge.$$.fragment, local);
    			transition_out(votetoken.$$.fragment, local);
    			transition_out(nft.$$.fragment, local);
    			transition_out(ambassador.$$.fragment, local);
    			transition_out(roadmap.$$.fragment, local);
    			transition_out(tokenomics.$$.fragment, local);
    			transition_out(teamcards.$$.fragment, local);
    			transition_out(partners.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(observers, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			/*youtube_binding*/ ctx[5](null);
    			destroy_component(youtube);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div8);
    			destroy_component(table);
    			destroy_component(challenge);
    			destroy_component(votetoken);
    			destroy_component(nft);
    			destroy_component(ambassador);
    			destroy_component(roadmap);
    			destroy_component(tokenomics);
    			destroy_component(teamcards);
    			destroy_component(partners);
    			mounted = false;
    			dispose();
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
    	let $_;
    	validate_store(X, '_');
    	component_subscribe($$self, X, $$value => $$invalidate(1, $_ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	let player1;
    	let startingToPlay = false;
    	let tryingToPause = false;
    	let muted = true;

    	function addObservers() {
    		const videoObserver = new IntersectionObserver(entries => {
    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						try {
    							console.log("Trying to playyyyy");

    							setTimeout(
    								() => {
    									console.log(tryingToPause);

    									if (tryingToPause == false) {
    										player1.play();
    									}

    									tryingToPause = false;
    								},
    								1000
    							);
    						} catch(e) {
    							console.log(e);
    						}
    					} else {
    						console.log("trying to pause");
    						tryingToPause = true;
    						console.log(tryingToPause);

    						if (player1.getPlayerState() !== 2) {
    							setTimeout(
    								() => {
    									player1.pause();
    									tryingToPause = false;
    								},
    								1000
    							);
    						}
    					}
    				}); //observer.disconnect()
    			});

    		const players = document.querySelectorAll(".video");
    		players.forEach(p => videoObserver.observe(p));
    	}

    	function start() {
    		player1.play();
    		player1.unmute();
    	}

    	function unmute(e) {
    		if (muted) {
    			player1.unmute();
    			e.target.style.backgroundImage = "url('../images/volume.png')";
    		} else {
    			player1.mute();
    			e.target.style.backgroundImage = "url('../images/volume-mute.png')";
    		}

    		muted = !muted;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	function youtube_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			player1 = $$value;
    			$$invalidate(0, player1);
    		});
    	}

    	const End_handler = () => start();
    	const Ready_handler = () => addObservers();

    	$$self.$capture_state = () => ({
    		TeamCards,
    		Tokenomics,
    		Challenge,
    		VoteToken,
    		Roadmap,
    		Partners,
    		Table,
    		News,
    		NFT,
    		Youtube,
    		Ambassador,
    		Observers,
    		_: X,
    		onMount,
    		player1,
    		startingToPlay,
    		tryingToPause,
    		muted,
    		addObservers,
    		start,
    		unmute,
    		$_
    	});

    	$$self.$inject_state = $$props => {
    		if ('player1' in $$props) $$invalidate(0, player1 = $$props.player1);
    		if ('startingToPlay' in $$props) startingToPlay = $$props.startingToPlay;
    		if ('tryingToPause' in $$props) tryingToPause = $$props.tryingToPause;
    		if ('muted' in $$props) muted = $$props.muted;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		player1,
    		$_,
    		addObservers,
    		start,
    		unmute,
    		youtube_binding,
    		End_handler,
    		Ready_handler
    	];
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
    	let li7;
    	let a7;
    	let t17;
    	let div2;
    	let h41;
    	let t19;
    	let div1;
    	let newslettersignup;
    	let t20;
    	let div4;
    	let h42;
    	let t22;
    	let div3;
    	let a8;
    	let img0;
    	let img0_src_value;
    	let t23;
    	let a9;
    	let img1;
    	let img1_src_value;
    	let t24;
    	let a10;
    	let img2;
    	let img2_src_value;
    	let t25;
    	let a11;
    	let img3;
    	let img3_src_value;
    	let t26;
    	let div6;
    	let img4;
    	let img4_src_value;
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
    			a1.textContent = "About";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Challenge System";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Vote Token";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "NFTs";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Ambassador Program";
    			t13 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Roadmap";
    			t15 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Tokenomics";
    			t17 = space();
    			div2 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Newsletter Subscription";
    			t19 = space();
    			div1 = element("div");
    			create_component(newslettersignup.$$.fragment);
    			t20 = space();
    			div4 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Connect";
    			t22 = space();
    			div3 = element("div");
    			a8 = element("a");
    			img0 = element("img");
    			t23 = space();
    			a9 = element("a");
    			img1 = element("img");
    			t24 = space();
    			a10 = element("a");
    			img2 = element("img");
    			t25 = space();
    			a11 = element("a");
    			img3 = element("img");
    			t26 = space();
    			div6 = element("div");
    			img4 = element("img");
    			attr_dev(h40, "class", "svelte-1oeaakk");
    			add_location(h40, file$1, 7, 12, 202);
    			attr_dev(a0, "href", "#Trailer");
    			attr_dev(a0, "class", "svelte-1oeaakk");
    			add_location(a0, file$1, 9, 20, 276);
    			attr_dev(li0, "class", "svelte-1oeaakk");
    			add_location(li0, file$1, 9, 16, 272);
    			attr_dev(a1, "href", "#Table");
    			attr_dev(a1, "class", "svelte-1oeaakk");
    			add_location(a1, file$1, 10, 20, 333);
    			attr_dev(li1, "class", "svelte-1oeaakk");
    			add_location(li1, file$1, 10, 16, 329);
    			attr_dev(a2, "href", "#Challenge");
    			attr_dev(a2, "class", "svelte-1oeaakk");
    			add_location(a2, file$1, 11, 20, 386);
    			attr_dev(li2, "class", "svelte-1oeaakk");
    			add_location(li2, file$1, 11, 16, 382);
    			attr_dev(a3, "href", "#Vote");
    			attr_dev(a3, "class", "svelte-1oeaakk");
    			add_location(a3, file$1, 12, 20, 454);
    			attr_dev(li3, "class", "svelte-1oeaakk");
    			add_location(li3, file$1, 12, 16, 450);
    			attr_dev(a4, "href", "#NFT");
    			attr_dev(a4, "class", "svelte-1oeaakk");
    			add_location(a4, file$1, 13, 20, 511);
    			attr_dev(li4, "class", "svelte-1oeaakk");
    			add_location(li4, file$1, 13, 16, 507);
    			attr_dev(a5, "href", "#Ambassadors");
    			attr_dev(a5, "class", "svelte-1oeaakk");
    			add_location(a5, file$1, 14, 20, 561);
    			attr_dev(li5, "class", "svelte-1oeaakk");
    			add_location(li5, file$1, 14, 16, 557);
    			attr_dev(a6, "href", "#Roadmap");
    			attr_dev(a6, "class", "svelte-1oeaakk");
    			add_location(a6, file$1, 15, 20, 633);
    			attr_dev(li6, "class", "svelte-1oeaakk");
    			add_location(li6, file$1, 15, 16, 629);
    			attr_dev(a7, "href", "#Tokenomics");
    			attr_dev(a7, "class", "svelte-1oeaakk");
    			add_location(a7, file$1, 16, 20, 690);
    			attr_dev(li7, "class", "svelte-1oeaakk");
    			add_location(li7, file$1, 16, 16, 686);
    			attr_dev(ul, "class", "col-content svelte-1oeaakk");
    			add_location(ul, file$1, 8, 12, 230);
    			attr_dev(div0, "class", "footer-col svelte-1oeaakk");
    			attr_dev(div0, "id", "links");
    			add_location(div0, file$1, 6, 8, 153);
    			attr_dev(h41, "id", "links");
    			attr_dev(h41, "class", "svelte-1oeaakk");
    			add_location(h41, file$1, 20, 12, 828);
    			attr_dev(div1, "class", "col-content svelte-1oeaakk");
    			add_location(div1, file$1, 21, 12, 885);
    			attr_dev(div2, "class", "footer-col svelte-1oeaakk");
    			attr_dev(div2, "id", "register");
    			add_location(div2, file$1, 19, 8, 776);
    			attr_dev(h42, "id", "links");
    			attr_dev(h42, "class", "svelte-1oeaakk");
    			add_location(h42, file$1, 27, 12, 1072);
    			attr_dev(img0, "alt", "Email");
    			if (!src_url_equal(img0.src, img0_src_value = "images/email.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1oeaakk");
    			add_location(img0, file$1, 29, 51, 1243);
    			attr_dev(a8, "href", "mailto:info@allskills.ca");
    			attr_dev(a8, "class", "svelte-1oeaakk");
    			add_location(a8, file$1, 29, 16, 1208);
    			attr_dev(img1, "alt", "Discord");
    			if (!src_url_equal(img1.src, img1_src_value = "images/discord.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1oeaakk");
    			add_location(img1, file$1, 30, 64, 1353);
    			attr_dev(a9, "href", "https://www.twitter.com/@AllSkillsNFT");
    			attr_dev(a9, "class", "svelte-1oeaakk");
    			add_location(a9, file$1, 30, 16, 1305);
    			attr_dev(img2, "alt", "Instagram");
    			if (!src_url_equal(img2.src, img2_src_value = "images/instagram.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1oeaakk");
    			add_location(img2, file$1, 31, 65, 1468);
    			attr_dev(a10, "href", "https://www.instagram.com/AllSkillsNFT");
    			attr_dev(a10, "class", "svelte-1oeaakk");
    			add_location(a10, file$1, 31, 16, 1419);
    			attr_dev(img3, "alt", "Twitter");
    			if (!src_url_equal(img3.src, img3_src_value = "images/twitter.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1oeaakk");
    			add_location(img3, file$1, 32, 64, 1586);
    			attr_dev(a11, "href", "https://www.twitter.com/@AllSkillsNFT");
    			attr_dev(a11, "class", "svelte-1oeaakk");
    			add_location(a11, file$1, 32, 16, 1538);
    			attr_dev(div3, "class", "col-content svelte-1oeaakk");
    			set_style(div3, "display", "flex");
    			set_style(div3, "justify-content", "space-between");
    			add_location(div3, file$1, 28, 12, 1113);
    			attr_dev(div4, "class", "footer-col svelte-1oeaakk");
    			attr_dev(div4, "id", "connect");
    			add_location(div4, file$1, 26, 8, 1021);
    			attr_dev(div5, "class", "footer-content svelte-1oeaakk");
    			add_location(div5, file$1, 5, 4, 115);
    			attr_dev(img4, "alt", "Logo");
    			set_style(img4, "margin-right", "12px");
    			if (!src_url_equal(img4.src, img4_src_value = "images/logo-dark-bottom.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1oeaakk");
    			add_location(img4, file$1, 37, 8, 1713);
    			attr_dev(div6, "id", "logo");
    			attr_dev(div6, "class", "svelte-1oeaakk");
    			add_location(div6, file$1, 36, 4, 1688);
    			attr_dev(footer, "class", "footer svelte-1oeaakk");
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
    			append_dev(ul, t15);
    			append_dev(ul, li7);
    			append_dev(li7, a7);
    			append_dev(div5, t17);
    			append_dev(div5, div2);
    			append_dev(div2, h41);
    			append_dev(div2, t19);
    			append_dev(div2, div1);
    			mount_component(newslettersignup, div1, null);
    			append_dev(div5, t20);
    			append_dev(div5, div4);
    			append_dev(div4, h42);
    			append_dev(div4, t22);
    			append_dev(div4, div3);
    			append_dev(div3, a8);
    			append_dev(a8, img0);
    			append_dev(div3, t23);
    			append_dev(div3, a9);
    			append_dev(a9, img1);
    			append_dev(div3, t24);
    			append_dev(div3, a10);
    			append_dev(a10, img2);
    			append_dev(div3, t25);
    			append_dev(div3, a11);
    			append_dev(a11, img3);
    			append_dev(footer, t26);
    			append_dev(footer, div6);
    			append_dev(div6, img4);
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

    const { document: document_1 } = globals;

    const file = "src/App.svelte";

    // (75:0) {:else}
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
    			attr_dev(main, "class", "svelte-1hgc6jf");
    			add_location(main, file, 75, 1, 1913);
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
    		source: "(75:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (73:0) {#if $isLoading}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading";
    			add_location(p, file, 73, 2, 1889);
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
    		source: "(73:0) {#if $isLoading}",
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
    			style.textContent = "@font-face {\n\t\t\tfont-family: \"Roboto Mono\";\n\t\t\tsrc: url(\"./fonts/RobotoMono.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Consolate Elf\";\n\t\t\tsrc: url(\"./fonts/ConsolateElf.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Oswald\";\n\t\t\tsrc: url(\"./fonts/Oswald-Regular.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Bebas Neue\";\n\t\t\tsrc: url(\"./fonts/BebasNeue-Regular.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Raleway\";\n\t\t\tsrc: url(\"./fonts/Raleway-Medium.ttf\");\n\t\t\tfont-display: swap;\n\t\t}\t\t\n\t\t@font-face {\n\t\t\tfont-family: \"BentonSans\";\n\t\t\tsrc: url(\"./fonts/BentonSans-Regular.otf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"DINPro\";\n\t\t\tsrc: url(\"./fonts/DINPro.otf\");\n\t\t\tfont-display: swap;\n\t\t}\t\n\t";
    			script = element("script");
    			link = element("link");
    			meta = element("meta");
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(style, file, 29, 1, 648);
    			script.defer = true;
    			attr_dev(script, "data-domain", "allskills.ca");
    			if (!src_url_equal(script.src, script_src_value = "https://plausible.io/js/plausible.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 66, 1, 1466);
    			attr_dev(link, "rel", "canonical");
    			attr_dev(link, "href", "https://allskills.ca/");
    			add_location(link, file, 67, 1, 1561);
    			document_1.title = "AllSkills - Competition based NFT Platform for showcasing all skills.";
    			attr_dev(meta, "name", "description");
    			attr_dev(meta, "content", "AllSkills is a competition based NFT platform where both talented creators and consumers of content can earn money.");
    			add_location(meta, file, 69, 1, 1702);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, style);
    			append_dev(document_1.head, script);
    			append_dev(document_1.head, link);
    			append_dev(document_1.head, meta);
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
    	let page = document.location.hash;

    	$({
    		fallbackLocale: "en",
    		initialLocale: I()
    	});

    	window.onpopstate = function (event) {
    		page = document.location.hash;
    	};

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
    		page,
    		$isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) page = $$props.page;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

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
    	},
    	table: {
    		title1: "Skills Competition",
    		p1: "Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.",
    		title2: "Earning Potential",
    		p2: "Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.",
    		title3: "NFT Collectibles",
    		p3: "Videos that win have the opportunity to be minted into NFT collectibles that can be traded on our Marketplace or any of the other top NFT marketplaces. Tokenizing challenge videos enables users to fully own and easily monetize their content, and each one is backed up forever using blockchain technology.",
    		title4: "Ambassador Program",
    		p4: "Have the opportunity to try and out-perform your favourite pros and earn prizes doing it. Every week top athletes from different domains submit a challenge to the community to try and replicate one of their iconic moves. Submit your best attempt to get entered into a raffle and earn prizes."
    	},
    	highlighted: {
    		company: "AllSkills",
    		start: "uses future-proof blockchain & smart contract technology to",
    		highlight1: "connect talented people & audiences",
    		middle: ", and foster skill development through competition all while providing",
    		highlight2: "incentives for everyone involved."
    	},
    	challenges: {
    		videos: {
    			title: "Take videos showcasing your skills",
    			pStart: "No matter if your skill is",
    			highlighted: "athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind",
    			pEnd: ", we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.",
    			tooltips: [
    			]
    		},
    		challenges: {
    			title: "Put videos up for Challenge",
    			pStart: "After you’re satisfied with your video, it’s time to put it up for Challenge.",
    			highlighted: "Winning a challenge round is how your video becomes eligible for minting.",
    			pEnd: "Choose between putting your video up for Open Challenge or directly challenging another video or user. Rounds last 72h.",
    			tooltips: [
    			]
    		},
    		votes: {
    			title: "Users vote to determine winner",
    			pStart: "Once the challenge starts,",
    			highlighted: "the control is now in the voters hands.",
    			pEnd: "Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and has the opportunity to be minted as an NFT.",
    			tooltips: [
    			]
    		},
    		earn: {
    			title: "Earn money from voting and winning challenges",
    			pStart: "Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is.",
    			highlighted: " Closer vote count = bigger cut.",
    			pEnd: "",
    			tooltips: [
    			]
    		}
    	},
    	vote: {
    		cast: {
    			title: "Cast your vote",
    			pStart: "Show your support by voting for the challenge video you like most. All votes form a",
    			highlighted: "reward pool",
    			pEnd: "and decide the winning video."
    		},
    		success: {
    			title: "Share in the success",
    			pStart: "Voters continue to share in the success by",
    			highlighted: "earning royalties",
    			pEnd: "everytime a video they voted for is sold on marketplaces."
    		},
    		stake: {
    			title: "Stake to earn more",
    			pStart: "Staking your $Skills tokens allows you to",
    			highlighted: "earn $Vote tokens",
    			pEnd: "$Skills tokens can also be used to participate in raffles, pay gas fees, and to declare how you think AllSkills should operate."
    		},
    		earn: {
    			title: "Earn through voting",
    			pStart: "The reward pool is split between the winner and all those who voted for them.",
    			highlighted: "Earn up to 145%",
    			pEnd: "back for votes cast on winning videos."
    		},
    		stable: {
    			title: "Stablecoin for all skills",
    			pStart: "$Vote tokens are",
    			highlighted: "backed by fiat reserves",
    			pEnd: "at 1:1 ratio and will always be redeemable at a stable value."
    		},
    		replenish: {
    			title: "Easily replenish your wallet",
    			pStart: "If you run out of Vote tokens, you can",
    			highlighted: "watch sponsored videos to earn more",
    			pEnd: "and get right back in the game."
    		}
    	},
    	nft: {
    		"1": {
    			pStart: "Level up by winning challenges and unlock",
    			link: "exclusive benefits.",
    			pEnd: ""
    		},
    		"2": {
    			pStart: "Reach level 7 to unlock",
    			link: "NFT minting",
    			pEnd: "for all your challenge wins."
    		},
    		"3": {
    			pStart: "All winning challenge videos that end in the daily",
    			link: "top 10% of votes",
    			pEnd: "received get minted."
    		},
    		"4": {
    			pStart: "Purchase a",
    			link: "Mint Token",
    			pEnd: "to automatically mint one of your challenge wins as an NFT."
    		},
    		"5": {
    			pStart: "Users can choose to mint to either",
    			link: "Ethereum, Polygon, Tezos, NEAR, or Flow.",
    			pEnd: ""
    		},
    		"6": {
    			pStart: "Minted videos are tradeable on our marketplace as well as other top NFT marketplaces like",
    			link: "OpenSea and Rarible.",
    			pEnd: ""
    		},
    		"7": {
    			pStart: "NFT videos will be stored using decentralized cloud storage providers and the",
    			link: "IPFS",
    			pEnd: ""
    		},
    		"8": {
    			pStart: "All minted challenge videos are also backed-up forever using",
    			link: "arweave and ardrive.",
    			pEnd: ""
    		}
    	},
    	ambassador: {
    		line1: "Compete in new Ambassador Challenges every week hosted by different athletes",
    		line2: "Chance to win an NFT of Ambassador's Challenge video + additional prizes.",
    		line3: "Stay tuned for more details."
    	},
    	roadmap: {
    		socials: "Join our Discord and follow our Twitter to get access to the latest announcements and enter raffles to earn prizes from our Ambassadors",
    		idea: {
    			cleared: [
    				"Ideation",
    				"Business plan",
    				"Feasability study",
    				"Olympic skater Charles Hamelin joins project"
    			]
    		},
    		research: {
    			cleared: [
    				"Market research",
    				"Acquired advisors & CTO",
    				"Backed by PME Montreal",
    				"Finalist in NBA Launchpad",
    				"Pivot towards NFT platform",
    				"Launch website",
    				"Release whitepaper and tokenomics"
    			]
    		},
    		plan: {
    			cleared: [
    				"Setup social community",
    				"Release marketing plan",
    				"Trailer"
    			],
    			uncleared: [
    				"Announce partners",
    				"Reveal plan for Ambassador program",
    				"Reveal first AllSkills Ambassadors",
    				"Mint $Skills token"
    			]
    		},
    		launch: {
    			cleared: [
    			],
    			uncleared: [
    				"Token presale",
    				"Mint stablecoin Vote token",
    				"Launch closed beta",
    				"Public sale",
    				"Full release of challenge system and marketplace",
    				"Start Ambassador program"
    			]
    		},
    		post: {
    			cleared: [
    			],
    			uncleared: [
    				"Add unique Tap-to-Record",
    				"Release Scout mode",
    				"Release GM mode",
    				"Add more cosmetics and editing features"
    			]
    		}
    	},
    	tokenomics: {
    		pTitle: "100,000,000 Tokens",
    		paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    		list: [
    			"Team 10%",
    			"Advisors & Partners 10%",
    			"Private Sale 10%",
    			"Public Sale 20%",
    			"Liquidity Pool 20%",
    			"Foundation 30%"
    		]
    	},
    	team: {
    		position: "Co-Founder",
    		button: "MORE INFO",
    		noah: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University’s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah’s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him.",
    		frank: "A director, conceptualist and creative, François, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, François has learned from them all and applies this knowledge and passion to AllSkills.",
    		christopher: "Christopher has a wide range of interests and knowledge. On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
    		charles: "A ﬁve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world’s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers."
    	},
    	partners: {
    		soon: "Announcements coming soon"
    	},
    	news: {
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
    		description_start: "AllSkills is a platform that looks to bring",
    		description_highlight: "creativity, sustainable growth, and increased competition",
    		description_end: "to the talent world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning money through our carefully crafted token based Vote and Challenge system and NFT marketplace."
    	},
    	table: {
    		title1: "Skills Competition",
    		p1: "Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.",
    		title2: "Earning Potential",
    		p2: "Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.",
    		title3: "NFT Collectibles",
    		p3: "Collect unique moments from talented creators. Winning challenge videos have the opportunity to be minted into NFT collectibles that can be traded on our NFT marketplace.",
    		title4: "NFT Marketplace",
    		p4: "Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters."
    	},
    	highlighted: {
    		company: "AllSkills",
    		start: "is powered by cryptocurrency, using future-proof blockchain & smart contract technology to",
    		highlight1: "connect talented people & audiences",
    		middle: ", and foster skill development through competition all while providing",
    		highlight2: "incentives for everyone involved."
    	},
    	challenges: {
    		videos: {
    			title: "Take videos showcasing your skills",
    			pStart: "No matter if your skill is",
    			highlighted: "athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind",
    			pEnd: ", we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.",
    			tooltips: [
    			]
    		},
    		challenges: {
    			title: "Put videos up for Challenge",
    			pStart: "After you’re satisfied with your video, it’s time to put it up for Challenge.",
    			highlighted: "Winning a challenge round is how your video becomes eligible for minting.",
    			pEnd: "Choose between putting your video up for Open Challenge or directly challenging another video or user. Rounds last 72h.",
    			tooltips: [
    			]
    		},
    		votes: {
    			title: "Users vote to determine winner",
    			pStart: "Once the challenge starts,",
    			highlighted: "the control is now in the voters hands.",
    			pEnd: "Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and has the opportunity to be minted as an NFT.",
    			tooltips: [
    			]
    		},
    		earn: {
    			title: "Earn money from voting and winning challenges",
    			pStart: "Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is.",
    			highlighted: "Closer vote count = bigger cut.",
    			pEnd: "",
    			tooltips: [
    			]
    		}
    	},
    	vote: {
    		cast: {
    			title: "Cast your vote",
    			pStart: "Show your support by voting for the challenge video you like most. All votes form a",
    			highlighted: "reward pool",
    			pEnd: "and decide the winning video."
    		},
    		success: {
    			title: "Share in the success",
    			pStart: "Voters continue to share in the success by",
    			highlighted: "earning royalties",
    			pEnd: "everytime a video they voted for is sold on marketplaces."
    		},
    		stake: {
    			title: "Stake to earn more",
    			pStart: "Staking your $Skills tokens allows you to",
    			highlighted: "earn $Vote tokens",
    			pEnd: "$Skills tokens can also be used to participate in raffles, pay gas fees, and to declare how you think AllSkills should operate."
    		},
    		earn: {
    			title: "Earn through voting",
    			pStart: "The reward pool is split between the winner and all those who voted for them.",
    			highlighted: "Earn up to 145%",
    			pEnd: "back for votes cast on winning videos."
    		},
    		stable: {
    			title: "Stablecoin for all skills",
    			pStart: "$Vote tokens are",
    			highlighted: "backed by fiat reserves",
    			pEnd: "at 1:1 ratio and will always be redeemable at a stable value."
    		},
    		replenish: {
    			title: "Easily replenish your wallet",
    			pStart: "If you run out of Vote tokens, you can",
    			highlighted: "watch sponsored videos to earn more",
    			pEnd: "and get right back in the game."
    		}
    	},
    	nft: {
    		"1": {
    			pStart: "Level up by winning challenges and unlock",
    			link: "exclusive benefits.",
    			pEnd: ""
    		},
    		"2": {
    			pStart: "Reach level 7 to unlock",
    			link: "NFT minting",
    			pEnd: "for all your challenge wins."
    		},
    		"3": {
    			pStart: "All winning challenge videos that end in the daily",
    			link: "top 10% of votes",
    			pEnd: "received get minted."
    		},
    		"4": {
    			pStart: "Purchase a",
    			link: "Mint Token",
    			pEnd: "to automatically mint one of your challenge wins as an NFT."
    		},
    		"5": {
    			pStart: "User can choose to mint to",
    			link: "Ethereum, Polygon, Tezos, NEAR, or Flow.",
    			pEnd: ""
    		},
    		"6": {
    			pStart: "Tradeable on our marketplace as well as other top NFT marketplaces like",
    			link: "OpenSea and Rarible.",
    			pEnd: ""
    		},
    		"7": {
    			pStart: "Challenge videos will be stored using decentralized cloud storage providers and the",
    			link: "IPFS",
    			pEnd: ""
    		},
    		"8": {
    			pStart: "All minted challenge videos are also backed-up forever using",
    			link: "arweave and ardrive.",
    			pEnd: ""
    		}
    	},
    	ambassador: {
    		line1: "Compete in new Ambassador Challenges every week hosted by different athletes",
    		line2: "Chance to win an NFT of Ambassador's Challenge video + additional prizes.",
    		line3: "Stay tune for more details."
    	},
    	roadmap: {
    		socials: "Join our Discord and follow our Twitter to get access to the latest announcements and enter raffles to earn prizes from our Ambassadors",
    		idea: {
    			cleared: [
    				"Ideation",
    				"Business plan",
    				"Feasability study",
    				"Olympic skater Charles Hamelin joins project"
    			]
    		},
    		research: {
    			cleared: [
    				"Market research",
    				"Acquired advisors & CTO",
    				"Backed by PME Montreal",
    				"Finalist in NBA Launchpad",
    				"Pivot towards NFT platform",
    				"Launch website",
    				"Release whitepaper and tokenomics"
    			]
    		},
    		plan: {
    			cleared: [
    				"Setup social community",
    				"Release marketing plan",
    				"Trailer"
    			],
    			uncleared: [
    				"Announce partners",
    				"Reveal plan for Ambassador program",
    				"Reveal first AllSkills Ambassadors",
    				"Mint $Skills token",
    				"Token presale"
    			]
    		},
    		launch: {
    			cleared: [
    			],
    			uncleared: [
    				"Mint stablecoin Vote token",
    				"Launch closed beta",
    				"Full release of challenge system and marketplace",
    				"Start Ambassador program"
    			]
    		},
    		post: {
    			cleared: [
    			],
    			uncleared: [
    				"Add unique Tap-to-Record",
    				"Release Scout mode",
    				"Release GM mode",
    				"Add more cosmetics and editing features"
    			]
    		}
    	},
    	tokenomics: {
    		pTitle: "100,000,000 Tokens",
    		paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    		list: [
    			"Team 10%",
    			"Advisors & Partners 10%",
    			"Private Sale 10%",
    			"Public Sale 20%",
    			"Liquidity Pool 20%",
    			"Foundation 30%"
    		]
    	},
    	team: {
    		position: "Co-Founder",
    		button: "MORE INFO",
    		noah: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University’s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah’s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him.",
    		frank: "A director, conceptualist and creative, François, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, François has learned from them all and applies this knowledge and passion to AllSkills.",
    		christopher: "Christopher has a wide range of interests and knowledge. On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
    		charles: "A ﬁve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world’s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers."
    	},
    	partners: {
    		soon: "Announcements coming soon"
    	},
    	news: {
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
    		title: "Built for",
    		description_start: "AllSkills is a platform that looks to bring",
    		description_highlight: "creativity, sustainable growth, and increased competition",
    		description_end: "to the talent world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning money through our carefully crafted token based Vote and Challenge system and NFT marketplace."
    	},
    	table: {
    		title1: "Skills Competition",
    		p1: "Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.",
    		title2: "Earning Potential",
    		p2: "Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.",
    		title3: "NFT Collectibles",
    		p3: "Collect unique moments from talented creators. Winning challenge videos have the opportunity to be minted into NFT collectibles that can be traded on our NFT marketplace.",
    		title4: "NFT Marketplace",
    		p4: "Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters."
    	},
    	highlighted: {
    		company: "AllSkills",
    		start: "is powered by cryptocurrency, using future-proof blockchain & smart contract technology to",
    		highlight1: "connect talented people & audiences",
    		middle: ", and foster skill development through competition all while providing",
    		highlight2: "incentives for everyone involved."
    	},
    	challenges: {
    		videos: {
    			title: "Take videos showcasing your skills",
    			pStart: "No matter if your skill is",
    			highlighted: "athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind",
    			pEnd: ", we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.",
    			tooltips: [
    			]
    		},
    		challenges: {
    			title: "Put videos up for Challenge",
    			pStart: "After you’re satisfied with your video, it’s time to put it up for Challenge.",
    			highlighted: "Winning a challenge round is how your video becomes eligible for minting.",
    			pEnd: "Choose between putting your video up for Open Challenge or directly challenging another video or user. Rounds last 72h.",
    			tooltips: [
    			]
    		},
    		votes: {
    			title: "Users vote to determine winner",
    			pStart: "Once the challenge starts,",
    			highlighted: "the control is now in the voters hands.",
    			pEnd: "Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and has the opportunity to be minted as an NFT.",
    			tooltips: [
    			]
    		},
    		earn: {
    			title: "Earn money from voting and winning challenges",
    			pStart: "Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is.",
    			highlighted: "Closer vote count = bigger cut.",
    			pEnd: "",
    			tooltips: [
    			]
    		}
    	},
    	vote: {
    		cast: {
    			title: "Cast your vote",
    			pStart: "Show your support by voting for the challenge video you like most. All votes form a",
    			highlighted: "reward pool",
    			pEnd: "and decide the winning video."
    		},
    		success: {
    			title: "Share in the success",
    			pStart: "Voters continue to share in the success by",
    			highlighted: "earning royalties",
    			pEnd: "everytime a video they voted for is sold on marketplaces."
    		},
    		stake: {
    			title: "Stake to earn more",
    			pStart: "Staking your $Skills tokens allows you to",
    			highlighted: "earn $Vote tokens",
    			pEnd: "$Skills tokens can also be used to participate in raffles, pay gas fees, and to declare how you think AllSkills should operate."
    		},
    		earn: {
    			title: "Earn through voting",
    			pStart: "The reward pool is split between the winner and all those who voted for them.",
    			highlighted: "Earn up to 145%",
    			pEnd: "back for votes cast on winning videos."
    		},
    		stable: {
    			title: "Stablecoin for all skills",
    			pStart: "$Vote tokens are",
    			highlighted: "backed by fiat reserves",
    			pEnd: "at 1:1 ratio and will always be redeemable at a stable value."
    		},
    		replenish: {
    			title: "Easily replenish your wallet",
    			pStart: "If you run out of Vote tokens, you can",
    			highlighted: "watch sponsored videos to earn more",
    			pEnd: "and get right back in the game."
    		}
    	},
    	nft: {
    		"1": {
    			pStart: "Level up by winning challenges and unlock",
    			link: "exclusive benefits.",
    			pEnd: ""
    		},
    		"2": {
    			pStart: "Reach level 7 to unlock",
    			link: "NFT minting",
    			pEnd: "for all your challenge wins."
    		},
    		"3": {
    			pStart: "All winning challenge videos that end in the daily",
    			link: "top 10% of votes",
    			pEnd: "received get minted."
    		},
    		"4": {
    			pStart: "Purchase a",
    			link: "Mint Token",
    			pEnd: "to automatically mint one of your challenge wins as an NFT."
    		},
    		"5": {
    			pStart: "User can choose to mint to",
    			link: "Ethereum, Polygon, Tezos, NEAR, or Flow.",
    			pEnd: ""
    		},
    		"6": {
    			pStart: "Tradeable on our marketplace as well as other top NFT marketplaces like",
    			link: "OpenSea and Rarible.",
    			pEnd: ""
    		},
    		"7": {
    			pStart: "Challenge videos will be stored using decentralized cloud storage providers and the",
    			link: "IPFS",
    			pEnd: ""
    		},
    		"8": {
    			pStart: "All minted challenge videos are also backed-up forever using",
    			link: "arweave and ardrive.",
    			pEnd: ""
    		}
    	},
    	ambassador: {
    		line1: "Compete in new Ambassador Challenges every week hosted by different athletes",
    		line2: "Chance to win an NFT of Ambassador's Challenge video + additional prizes.",
    		line3: "Stay tune for more details."
    	},
    	roadmap: {
    		socials: "Join our Discord and follow our Twitter to get access to the latest announcements and enter raffles to earn prizes from our Ambassadors",
    		idea: {
    			cleared: [
    				"Ideation",
    				"Business plan",
    				"Feasability study",
    				"Olympic skater Charles Hamelin joins project"
    			]
    		},
    		research: {
    			cleared: [
    				"Market research",
    				"Acquired advisors & CTO",
    				"Backed by PME Montreal",
    				"Finalist in NBA Launchpad",
    				"Pivot towards NFT platform",
    				"Launch website",
    				"Release whitepaper and tokenomics"
    			]
    		},
    		plan: {
    			cleared: [
    				"Setup social community",
    				"Release marketing plan",
    				"Trailer"
    			],
    			uncleared: [
    				"Announce partners",
    				"Reveal plan for Ambassador program",
    				"Reveal first AllSkills Ambassadors",
    				"Mint $Skills token",
    				"Token presale"
    			]
    		},
    		launch: {
    			cleared: [
    			],
    			uncleared: [
    				"Mint stablecoin Vote token",
    				"Launch closed beta",
    				"Full release of challenge system and marketplace",
    				"Start Ambassador program"
    			]
    		},
    		post: {
    			cleared: [
    			],
    			uncleared: [
    				"Add unique Tap-to-Record",
    				"Release Scout mode",
    				"Release GM mode",
    				"Add more cosmetics and editing features"
    			]
    		}
    	},
    	tokenomics: {
    		pTitle: "100,000,000 Tokens",
    		paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    		list: [
    			"Team 10%",
    			"Advisors & Partners 10%",
    			"Private Sale 10%",
    			"Public Sale 20%",
    			"Liquidity Pool 20%",
    			"Foundation 30%"
    		]
    	},
    	team: {
    		position: "Co-Founder",
    		button: "MORE INFO",
    		noah: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University’s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah’s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him.",
    		frank: "A director, conceptualist and creative, François, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, François has learned from them all and applies this knowledge and passion to AllSkills.",
    		christopher: "Christopher has a wide range of interests and knowledge. On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
    		charles: "A ﬁve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world’s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers."
    	},
    	partners: {
    		soon: "Announcements coming soon"
    	},
    	news: {
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
