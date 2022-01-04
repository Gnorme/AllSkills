
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
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

    /* src/Navbar.svelte generated by Svelte v3.44.3 */

    const file$f = "src/Navbar.svelte";

    function create_fragment$f(ctx) {
    	let nav;
    	let img;
    	let img_src_value;
    	let t;
    	let button;
    	let svg;
    	let rect;
    	let path0;
    	let path1;
    	let path2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			img = element("img");
    			t = space();
    			button = element("button");
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "class", "logo svelte-1xk5cw1");
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$f, 1, 4, 26);
    			attr_dev(rect, "width", "48");
    			attr_dev(rect, "height", "48");
    			attr_dev(rect, "fill", "white");
    			attr_dev(rect, "fill-opacity", "0");
    			attr_dev(rect, "class", "svelte-1xk5cw1");
    			add_location(rect, file$f, 5, 12, 258);
    			attr_dev(path0, "d", "M7.94977 11.9498H39.9498");
    			attr_dev(path0, "stroke", "white");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-1xk5cw1");
    			add_location(path0, file$f, 6, 12, 332);
    			attr_dev(path1, "d", "M7.94977 23.9498H39.9498");
    			attr_dev(path1, "stroke", "white");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-1xk5cw1");
    			add_location(path1, file$f, 7, 12, 461);
    			attr_dev(path2, "d", "M7.94977 35.9498H39.9498");
    			attr_dev(path2, "stroke", "white");
    			attr_dev(path2, "stroke-width", "4");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-1xk5cw1");
    			add_location(path2, file$f, 8, 12, 590);
    			attr_dev(svg, "width", "48px");
    			attr_dev(svg, "height", "48px");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-1xk5cw1");
    			add_location(svg, file$f, 4, 8, 145);
    			attr_dev(button, "class", "hamburger svelte-1xk5cw1");
    			add_location(button, file$f, 3, 4, 86);
    			attr_dev(nav, "class", "navbar svelte-1xk5cw1");
    			add_location(nav, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, img);
    			append_dev(nav, t);
    			append_dev(nav, button);
    			append_dev(button, svg);
    			append_dev(svg, rect);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", handleClick, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			dispose();
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

    function handleClick() {
    	alert('clicked');
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ handleClick });
    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/NewsletterSignup.svelte generated by Svelte v3.44.3 */

    const file$e = "src/NewsletterSignup.svelte";

    function create_fragment$e(ctx) {
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
    			attr_dev(input0, "class", "svelte-rg97zl");
    			add_location(input0, file$e, 4, 4, 151);
    			attr_dev(input1, "name", "email");
    			set_style(input1, "color", /*color*/ ctx[0]);
    			set_style(input1, "border-color", /*color*/ ctx[0]);
    			attr_dev(input1, "placeholder", "Sign up for our newsletter");
    			attr_dev(input1, "class", "svelte-rg97zl");
    			add_location(input1, file$e, 5, 4, 216);
    			set_style(button, "color", /*color*/ ctx[0]);
    			set_style(button, "border-color", /*color*/ ctx[0]);
    			attr_dev(button, "onclick", "alert('test')");
    			attr_dev(button, "class", "svelte-rg97zl");
    			add_location(button, file$e, 6, 4, 329);
    			attr_dev(form, "name", "newsletter");
    			attr_dev(form, "data-netlify-honeypot", "bot-field");
    			attr_dev(form, "data-netlify", "true");
    			attr_dev(form, "netlify", "");
    			attr_dev(form, "class", "signup svelte-rg97zl");
    			add_location(form, file$e, 3, 0, 44);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewsletterSignup",
    			options,
    			id: create_fragment$e.name
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
    const file$d = "src/Hero.svelte";

    function create_fragment$d(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let ul;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let li2;
    	let t7;
    	let li3;
    	let t9;
    	let li4;
    	let t11;
    	let li5;
    	let t13;
    	let li6;
    	let t15;
    	let li7;
    	let t17;
    	let li8;
    	let t19;
    	let li9;
    	let t21;
    	let li10;
    	let t23;
    	let li11;
    	let t25;
    	let li12;
    	let t27;
    	let li13;
    	let t29;
    	let li14;
    	let t31;
    	let li15;
    	let t33;
    	let li16;
    	let t35;
    	let li17;
    	let t37;
    	let li18;
    	let t39;
    	let li19;
    	let t41;
    	let li20;
    	let t43;
    	let li21;
    	let t45;
    	let li22;
    	let t47;
    	let li23;
    	let t49;
    	let li24;
    	let t51;
    	let li25;
    	let t53;
    	let li26;
    	let t55;
    	let li27;
    	let t57;
    	let li28;
    	let li29;
    	let t60;
    	let li30;
    	let t62;
    	let li31;
    	let t64;
    	let li32;
    	let t66;
    	let li33;
    	let t68;
    	let li34;
    	let t70;
    	let li35;
    	let t72;
    	let li36;
    	let t74;
    	let li37;
    	let t76;
    	let li38;
    	let t78;
    	let li39;
    	let t80;
    	let li40;
    	let t82;
    	let div5;
    	let div4;
    	let p;
    	let t83;
    	let span;
    	let t85;
    	let t86;
    	let newslettersignup;
    	let current;

    	newslettersignup = new NewsletterSignup({
    			props: { color: "white" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "Built for";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Archery";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Badminton";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Band";
    			t7 = space();
    			li3 = element("li");
    			li3.textContent = "Baseball";
    			t9 = space();
    			li4 = element("li");
    			li4.textContent = "Basketball";
    			t11 = space();
    			li5 = element("li");
    			li5.textContent = "Bass";
    			t13 = space();
    			li6 = element("li");
    			li6.textContent = "Bowling";
    			t15 = space();
    			li7 = element("li");
    			li7.textContent = "Boxing";
    			t17 = space();
    			li8 = element("li");
    			li8.textContent = "Chello";
    			t19 = space();
    			li9 = element("li");
    			li9.textContent = "Cricket";
    			t21 = space();
    			li10 = element("li");
    			li10.textContent = "Dance";
    			t23 = space();
    			li11 = element("li");
    			li11.textContent = "Darts";
    			t25 = space();
    			li12 = element("li");
    			li12.textContent = "Drums";
    			t27 = space();
    			li13 = element("li");
    			li13.textContent = "ESports";
    			t29 = space();
    			li14 = element("li");
    			li14.textContent = "Football";
    			t31 = space();
    			li15 = element("li");
    			li15.textContent = "Golf";
    			t33 = space();
    			li16 = element("li");
    			li16.textContent = "Guitar";
    			t35 = space();
    			li17 = element("li");
    			li17.textContent = "Gymnastics";
    			t37 = space();
    			li18 = element("li");
    			li18.textContent = "Harmonica";
    			t39 = space();
    			li19 = element("li");
    			li19.textContent = "Hockey";
    			t41 = space();
    			li20 = element("li");
    			li20.textContent = "Ice Skating";
    			t43 = space();
    			li21 = element("li");
    			li21.textContent = "Lacrosse";
    			t45 = space();
    			li22 = element("li");
    			li22.textContent = "Parkour";
    			t47 = space();
    			li23 = element("li");
    			li23.textContent = "Piano";
    			t49 = space();
    			li24 = element("li");
    			li24.textContent = "Rugby";
    			t51 = space();
    			li25 = element("li");
    			li25.textContent = "Running";
    			t53 = space();
    			li26 = element("li");
    			li26.textContent = "Saxophone";
    			t55 = space();
    			li27 = element("li");
    			li27.textContent = "Singing";
    			t57 = space();
    			li28 = element("li");
    			li28.textContent = "Skateboard\r\n                    ";
    			li29 = element("li");
    			li29.textContent = "Ski";
    			t60 = space();
    			li30 = element("li");
    			li30.textContent = "Snowboard";
    			t62 = space();
    			li31 = element("li");
    			li31.textContent = "Soccer";
    			t64 = space();
    			li32 = element("li");
    			li32.textContent = "Surfing";
    			t66 = space();
    			li33 = element("li");
    			li33.textContent = "Swimming";
    			t68 = space();
    			li34 = element("li");
    			li34.textContent = "Tennis";
    			t70 = space();
    			li35 = element("li");
    			li35.textContent = "Trombone";
    			t72 = space();
    			li36 = element("li");
    			li36.textContent = "Trumpet";
    			t74 = space();
    			li37 = element("li");
    			li37.textContent = "Tuba";
    			t76 = space();
    			li38 = element("li");
    			li38.textContent = "Volleyball";
    			t78 = space();
    			li39 = element("li");
    			li39.textContent = "Violin";
    			t80 = space();
    			li40 = element("li");
    			li40.textContent = "AllSkills";
    			t82 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p = element("p");
    			t83 = text("AllSkills is a platform that looks to bring ");
    			span = element("span");
    			span.textContent = "creativity, sustainable growth, and increased competition";
    			t85 = text(" to the talent world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning money through our carefully crafted token based Vote and Challenge system and NFT marketplace.");
    			t86 = space();
    			create_component(newslettersignup.$$.fragment);
    			attr_dev(div0, "class", "content svelte-hzesjv");
    			add_location(div0, file$d, 7, 8, 154);
    			attr_dev(li0, "class", "svelte-hzesjv");
    			add_location(li0, file$d, 11, 20, 350);
    			attr_dev(li1, "class", "svelte-hzesjv");
    			add_location(li1, file$d, 12, 20, 388);
    			attr_dev(li2, "class", "svelte-hzesjv");
    			add_location(li2, file$d, 13, 20, 428);
    			attr_dev(li3, "class", "svelte-hzesjv");
    			add_location(li3, file$d, 14, 20, 463);
    			attr_dev(li4, "class", "svelte-hzesjv");
    			add_location(li4, file$d, 15, 20, 502);
    			attr_dev(li5, "class", "svelte-hzesjv");
    			add_location(li5, file$d, 16, 20, 543);
    			attr_dev(li6, "class", "svelte-hzesjv");
    			add_location(li6, file$d, 17, 20, 578);
    			attr_dev(li7, "class", "svelte-hzesjv");
    			add_location(li7, file$d, 18, 20, 616);
    			attr_dev(li8, "class", "svelte-hzesjv");
    			add_location(li8, file$d, 19, 20, 653);
    			attr_dev(li9, "class", "svelte-hzesjv");
    			add_location(li9, file$d, 20, 20, 690);
    			attr_dev(li10, "class", "svelte-hzesjv");
    			add_location(li10, file$d, 21, 20, 728);
    			attr_dev(li11, "class", "svelte-hzesjv");
    			add_location(li11, file$d, 22, 20, 764);
    			attr_dev(li12, "class", "svelte-hzesjv");
    			add_location(li12, file$d, 23, 20, 800);
    			attr_dev(li13, "class", "svelte-hzesjv");
    			add_location(li13, file$d, 24, 20, 836);
    			attr_dev(li14, "class", "svelte-hzesjv");
    			add_location(li14, file$d, 25, 20, 874);
    			attr_dev(li15, "class", "svelte-hzesjv");
    			add_location(li15, file$d, 26, 20, 913);
    			attr_dev(li16, "class", "svelte-hzesjv");
    			add_location(li16, file$d, 27, 20, 948);
    			attr_dev(li17, "class", "svelte-hzesjv");
    			add_location(li17, file$d, 28, 20, 985);
    			attr_dev(li18, "class", "svelte-hzesjv");
    			add_location(li18, file$d, 29, 20, 1026);
    			attr_dev(li19, "class", "svelte-hzesjv");
    			add_location(li19, file$d, 30, 20, 1066);
    			attr_dev(li20, "class", "svelte-hzesjv");
    			add_location(li20, file$d, 31, 20, 1103);
    			attr_dev(li21, "class", "svelte-hzesjv");
    			add_location(li21, file$d, 32, 20, 1145);
    			attr_dev(li22, "class", "svelte-hzesjv");
    			add_location(li22, file$d, 33, 20, 1184);
    			attr_dev(li23, "class", "svelte-hzesjv");
    			add_location(li23, file$d, 34, 20, 1222);
    			attr_dev(li24, "class", "svelte-hzesjv");
    			add_location(li24, file$d, 35, 20, 1258);
    			attr_dev(li25, "class", "svelte-hzesjv");
    			add_location(li25, file$d, 36, 20, 1294);
    			attr_dev(li26, "class", "svelte-hzesjv");
    			add_location(li26, file$d, 37, 20, 1332);
    			attr_dev(li27, "class", "svelte-hzesjv");
    			add_location(li27, file$d, 38, 20, 1372);
    			attr_dev(li28, "class", "svelte-hzesjv");
    			add_location(li28, file$d, 39, 20, 1410);
    			attr_dev(li29, "class", "svelte-hzesjv");
    			add_location(li29, file$d, 40, 20, 1446);
    			attr_dev(li30, "class", "svelte-hzesjv");
    			add_location(li30, file$d, 41, 20, 1480);
    			attr_dev(li31, "class", "svelte-hzesjv");
    			add_location(li31, file$d, 42, 20, 1520);
    			attr_dev(li32, "class", "svelte-hzesjv");
    			add_location(li32, file$d, 43, 20, 1557);
    			attr_dev(li33, "class", "svelte-hzesjv");
    			add_location(li33, file$d, 44, 20, 1595);
    			attr_dev(li34, "class", "svelte-hzesjv");
    			add_location(li34, file$d, 45, 20, 1634);
    			attr_dev(li35, "class", "svelte-hzesjv");
    			add_location(li35, file$d, 46, 20, 1671);
    			attr_dev(li36, "class", "svelte-hzesjv");
    			add_location(li36, file$d, 47, 20, 1710);
    			attr_dev(li37, "class", "svelte-hzesjv");
    			add_location(li37, file$d, 48, 20, 1748);
    			attr_dev(li38, "class", "svelte-hzesjv");
    			add_location(li38, file$d, 49, 20, 1783);
    			attr_dev(li39, "class", "svelte-hzesjv");
    			add_location(li39, file$d, 50, 20, 1824);
    			set_style(li40, "color", "aqua");
    			set_style(li40, "font-weight", "600", 1);
    			attr_dev(li40, "class", "svelte-hzesjv");
    			add_location(li40, file$d, 52, 20, 1903);
    			attr_dev(ul, "class", "scroll-animation svelte-hzesjv");
    			add_location(ul, file$d, 10, 16, 299);
    			attr_dev(div1, "class", "scrolling-content-mask svelte-hzesjv");
    			add_location(div1, file$d, 9, 12, 245);
    			attr_dev(div2, "class", "scrolling-content svelte-hzesjv");
    			add_location(div2, file$d, 8, 8, 200);
    			attr_dev(div3, "class", "left-content svelte-hzesjv");
    			add_location(div3, file$d, 6, 3, 118);
    			set_style(span, "color", "aqua");
    			add_location(span, file$d, 59, 87, 2195);
    			set_style(p, "margin-bottom", "2rem");
    			attr_dev(p, "class", "svelte-hzesjv");
    			add_location(p, file$d, 59, 12, 2120);
    			attr_dev(div4, "class", "description svelte-hzesjv");
    			add_location(div4, file$d, 58, 8, 2081);
    			attr_dev(div5, "class", "hero-split svelte-hzesjv");
    			add_location(div5, file$d, 57, 4, 2047);
    			attr_dev(section, "class", "hero svelte-hzesjv");
    			add_location(section, file$d, 4, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(ul, t13);
    			append_dev(ul, li6);
    			append_dev(ul, t15);
    			append_dev(ul, li7);
    			append_dev(ul, t17);
    			append_dev(ul, li8);
    			append_dev(ul, t19);
    			append_dev(ul, li9);
    			append_dev(ul, t21);
    			append_dev(ul, li10);
    			append_dev(ul, t23);
    			append_dev(ul, li11);
    			append_dev(ul, t25);
    			append_dev(ul, li12);
    			append_dev(ul, t27);
    			append_dev(ul, li13);
    			append_dev(ul, t29);
    			append_dev(ul, li14);
    			append_dev(ul, t31);
    			append_dev(ul, li15);
    			append_dev(ul, t33);
    			append_dev(ul, li16);
    			append_dev(ul, t35);
    			append_dev(ul, li17);
    			append_dev(ul, t37);
    			append_dev(ul, li18);
    			append_dev(ul, t39);
    			append_dev(ul, li19);
    			append_dev(ul, t41);
    			append_dev(ul, li20);
    			append_dev(ul, t43);
    			append_dev(ul, li21);
    			append_dev(ul, t45);
    			append_dev(ul, li22);
    			append_dev(ul, t47);
    			append_dev(ul, li23);
    			append_dev(ul, t49);
    			append_dev(ul, li24);
    			append_dev(ul, t51);
    			append_dev(ul, li25);
    			append_dev(ul, t53);
    			append_dev(ul, li26);
    			append_dev(ul, t55);
    			append_dev(ul, li27);
    			append_dev(ul, t57);
    			append_dev(ul, li28);
    			append_dev(ul, li29);
    			append_dev(ul, t60);
    			append_dev(ul, li30);
    			append_dev(ul, t62);
    			append_dev(ul, li31);
    			append_dev(ul, t64);
    			append_dev(ul, li32);
    			append_dev(ul, t66);
    			append_dev(ul, li33);
    			append_dev(ul, t68);
    			append_dev(ul, li34);
    			append_dev(ul, t70);
    			append_dev(ul, li35);
    			append_dev(ul, t72);
    			append_dev(ul, li36);
    			append_dev(ul, t74);
    			append_dev(ul, li37);
    			append_dev(ul, t76);
    			append_dev(ul, li38);
    			append_dev(ul, t78);
    			append_dev(ul, li39);
    			append_dev(ul, t80);
    			append_dev(ul, li40);
    			append_dev(section, t82);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p);
    			append_dev(p, t83);
    			append_dev(p, span);
    			append_dev(p, t85);
    			append_dev(div4, t86);
    			mount_component(newslettersignup, div4, null);
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
    			if (detaching) detach_dev(section);
    			destroy_component(newslettersignup);
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
    	validate_slots('Hero', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ NewsletterSignup });
    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/TeamCards.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;
    const file$c = "src/TeamCards.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i].name;
    	child_ctx[11] = list[i].position;
    	child_ctx[12] = list[i].descr;
    	child_ctx[13] = list[i].email;
    	child_ctx[14] = list[i].img;
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (24:12) {:else}
    function create_else_block(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "More Info";
    			attr_dev(a, "class", "info svelte-10f096x");
    			attr_dev(a, "data-card-id", /*i*/ ctx[16]);
    			add_location(a, file$c, 24, 12, 1325);
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
    		id: create_else_block.name,
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
    			attr_dev(a, "class", "info svelte-10f096x");
    			attr_dev(a, "data-card-id", /*i*/ ctx[16]);
    			add_location(a, file$c, 22, 12, 1218);
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

    // (2:2) {#each staff as {name, position, descr, email, img}
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
    	let t4;
    	let p;
    	let t6;
    	let div4;
    	let div3;
    	let div0;
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
    		if (/*selected*/ ctx[0] === /*i*/ ctx[16]) return create_if_block$1;
    		return create_else_block;
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
    			span.textContent = "Position";
    			t4 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test";
    			t6 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
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
    			if (!src_url_equal(img0.src, img0_src_value = "images/profile-bg-1.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "sample87");
    			attr_dev(img0, "class", "svelte-10f096x");
    			add_location(img0, file$c, 3, 8, 129);
    			if (!src_url_equal(img1.src, img1_src_value = /*img*/ ctx[14])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "profile-sample4");
    			attr_dev(img1, "class", "profile svelte-10f096x");
    			toggle_class(img1, "selected", /*selected*/ ctx[0] === /*i*/ ctx[16]);
    			add_location(img1, file$c, 5, 10, 269);
    			attr_dev(span, "class", "svelte-10f096x");
    			add_location(span, file$c, 6, 20, 377);
    			attr_dev(h2, "class", "svelte-10f096x");
    			add_location(h2, file$c, 6, 10, 367);
    			attr_dev(p, "class", "svelte-10f096x");
    			toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[16]);
    			add_location(p, file$c, 7, 10, 415);
    			if (!src_url_equal(img2.src, img2_src_value = "images/twitter-aqua.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-10f096x");
    			add_location(img2, file$c, 11, 20, 815);
    			attr_dev(div0, "class", "socials-item svelte-10f096x");
    			add_location(div0, file$c, 10, 16, 767);
    			if (!src_url_equal(img3.src, img3_src_value = "images/email-nocircle-aqua.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-10f096x");
    			add_location(img3, file$c, 14, 20, 940);
    			attr_dev(div1, "class", "socials-item svelte-10f096x");
    			add_location(div1, file$c, 13, 16, 892);
    			if (!src_url_equal(img4.src, img4_src_value = "images/linkedin-aqua.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-10f096x");
    			add_location(img4, file$c, 17, 20, 1072);
    			attr_dev(div2, "class", "socials-item svelte-10f096x");
    			add_location(div2, file$c, 16, 16, 1024);
    			attr_dev(div3, "class", "socials svelte-10f096x");
    			set_style(div3, "width", "45%");
    			add_location(div3, file$c, 9, 12, 710);
    			set_style(div4, "max-width", "100%");
    			set_style(div4, "display", "flex");
    			set_style(div4, "justify-content", "space-around");
    			set_style(div4, "max-height", "60px");
    			attr_dev(div4, "class", "svelte-10f096x");
    			add_location(div4, file$c, 8, 10, 605);
    			attr_dev(figcaption, "class", "slanted-bg svelte-10f096x");
    			toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[16]);
    			add_location(figcaption, file$c, 4, 8, 191);
    			attr_dev(figure, "class", "snip1336 svelte-10f096x");
    			add_location(figure, file$c, 2, 4, 94);
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
    			append_dev(figcaption, t4);
    			append_dev(figcaption, p);
    			append_dev(figcaption, t6);
    			append_dev(figcaption, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img2);
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
    				toggle_class(img1, "selected", /*selected*/ ctx[0] === /*i*/ ctx[16]);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(p, "hidden", /*selected*/ ctx[0] != /*i*/ ctx[16]);
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
    				toggle_class(figcaption, "bgselected", /*selected*/ ctx[0] === /*i*/ ctx[16]);
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
    		source: "(2:2) {#each staff as {name, position, descr, email, img}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
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

    			attr_dev(div, "class", "cards-container svelte-10f096x");
    			add_location(div, file$c, 0, 0, 0);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TeamCards', slots, []);

    	const staff = [
    		{
    			id: 0,
    			name: "Noah Goren",
    			position: "Position",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "test@example.com",
    			img: "images/Noah.jpg"
    		},
    		{
    			id: 0,
    			name: "Frank Sammut",
    			position: "Position",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "test@example.com",
    			img: "images/Frank.jpg"
    		},
    		{
    			id: 0,
    			name: "Christopher Thompson",
    			position: "Position",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "test@example.com",
    			img: "images/Christopher.jpg"
    		},
    		{
    			id: 0,
    			name: "Charles Hamelin",
    			position: "Position",
    			descr: "Some text that describes me lorem ipsum ipsum lorem.",
    			email: "test@example.com",
    			img: "images/Charles.jpg"
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TeamCards",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Roadmap.svelte generated by Svelte v3.44.3 */

    const file$b = "src/Roadmap.svelte";

    function create_fragment$b(ctx) {
    	let div16;
    	let div1;
    	let div0;
    	let h30;
    	let t1;
    	let ul0;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let li2;
    	let t7;
    	let li3;
    	let t9;
    	let div3;
    	let div2;
    	let h31;
    	let t11;
    	let ul1;
    	let li4;
    	let t13;
    	let li5;
    	let t15;
    	let div5;
    	let div4;
    	let h32;
    	let t17;
    	let ul2;
    	let li6;
    	let t19;
    	let li7;
    	let t21;
    	let div7;
    	let div6;
    	let h33;
    	let t23;
    	let ul3;
    	let li8;
    	let t25;
    	let li9;
    	let t27;
    	let li10;
    	let t29;
    	let li11;
    	let t31;
    	let div9;
    	let div8;
    	let h34;
    	let t33;
    	let ul4;
    	let li12;
    	let t35;
    	let li13;
    	let t37;
    	let li14;
    	let t39;
    	let li15;
    	let t41;
    	let li16;
    	let t43;
    	let li17;
    	let t45;
    	let li18;
    	let t47;
    	let div11;
    	let div10;
    	let h35;
    	let t49;
    	let ul5;
    	let li19;
    	let t51;
    	let li20;
    	let t53;
    	let li21;
    	let t55;
    	let div13;
    	let div12;
    	let h36;
    	let t57;
    	let ul6;
    	let li22;
    	let t59;
    	let li23;
    	let t61;
    	let li24;
    	let t63;
    	let div15;
    	let div14;
    	let h37;
    	let t65;
    	let ul7;
    	let li25;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "2019-2020";
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Coming together of co-founders and ideation";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Pitch deck and business plan developed";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Feasibility study";
    			t7 = space();
    			li3 = element("li");
    			li3.textContent = "Olympic skater Charles Hamelin joins project";
    			t9 = space();
    			div3 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			h31.textContent = "First Half 2021";
    			t11 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Markest research";
    			t13 = space();
    			li5 = element("li");
    			li5.textContent = "Reached out to potential investors and advisors";
    			t15 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Q3 2021";
    			t17 = space();
    			ul2 = element("ul");
    			li6 = element("li");
    			li6.textContent = "Backed by PME Montreal";
    			t19 = space();
    			li7 = element("li");
    			li7.textContent = "CTO Acquisition";
    			t21 = space();
    			div7 = element("div");
    			div6 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Q4 2021";
    			t23 = space();
    			ul3 = element("ul");
    			li8 = element("li");
    			li8.textContent = "Finalists in NBA Launchpad";
    			t25 = space();
    			li9 = element("li");
    			li9.textContent = "Pivot towards NFT based platform and stablecoin";
    			t27 = space();
    			li10 = element("li");
    			li10.textContent = "Launch website";
    			t29 = space();
    			li11 = element("li");
    			li11.textContent = "Release whitepaper and tokenomics";
    			t31 = space();
    			div9 = element("div");
    			div8 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Q1 2022";
    			t33 = space();
    			ul4 = element("ul");
    			li12 = element("li");
    			li12.textContent = "Announce partners";
    			t35 = space();
    			li13 = element("li");
    			li13.textContent = "Setup social accounts";
    			t37 = space();
    			li14 = element("li");
    			li14.textContent = "Release marketing plan";
    			t39 = space();
    			li15 = element("li");
    			li15.textContent = "Mint governance token";
    			t41 = space();
    			li16 = element("li");
    			li16.textContent = "Release plan for Ambassador program";
    			t43 = space();
    			li17 = element("li");
    			li17.textContent = "Trailer";
    			t45 = space();
    			li18 = element("li");
    			li18.textContent = "Token presale";
    			t47 = space();
    			div11 = element("div");
    			div10 = element("div");
    			h35 = element("h3");
    			h35.textContent = "Q2 2022";
    			t49 = space();
    			ul5 = element("ul");
    			li19 = element("li");
    			li19.textContent = "Mint stablecoin Vote token";
    			t51 = space();
    			li20 = element("li");
    			li20.textContent = "Launch closed beta";
    			t53 = space();
    			li21 = element("li");
    			li21.textContent = "Full release of challenge system and marketplace";
    			t55 = space();
    			div13 = element("div");
    			div12 = element("div");
    			h36 = element("h3");
    			h36.textContent = "Q3 2022";
    			t57 = space();
    			ul6 = element("ul");
    			li22 = element("li");
    			li22.textContent = "Add video editing features";
    			t59 = space();
    			li23 = element("li");
    			li23.textContent = "Unique Tap-to-Record feature";
    			t61 = space();
    			li24 = element("li");
    			li24.textContent = "Release of ambassador program";
    			t63 = space();
    			div15 = element("div");
    			div14 = element("div");
    			h37 = element("h3");
    			h37.textContent = "Q4 2022";
    			t65 = space();
    			ul7 = element("ul");
    			li25 = element("li");
    			li25.textContent = "Release of GM mode";
    			attr_dev(h30, "class", "svelte-1koktod");
    			add_location(h30, file$b, 3, 16, 120);
    			attr_dev(div0, "class", "header svelte-1koktod");
    			add_location(div0, file$b, 2, 12, 83);
    			attr_dev(li0, "class", "cleared svelte-1koktod");
    			add_location(li0, file$b, 6, 16, 191);
    			attr_dev(li1, "class", "cleared svelte-1koktod");
    			add_location(li1, file$b, 7, 16, 276);
    			attr_dev(li2, "class", "cleared svelte-1koktod");
    			add_location(li2, file$b, 8, 16, 356);
    			attr_dev(li3, "class", "cleared svelte-1koktod");
    			add_location(li3, file$b, 9, 16, 415);
    			attr_dev(ul0, "class", "svelte-1koktod");
    			add_location(ul0, file$b, 5, 12, 170);
    			attr_dev(div1, "class", "roadmap-card svelte-1koktod");
    			add_location(div1, file$b, 1, 8, 44);
    			attr_dev(h31, "class", "svelte-1koktod");
    			add_location(h31, file$b, 14, 16, 602);
    			attr_dev(div2, "class", "header svelte-1koktod");
    			add_location(div2, file$b, 13, 12, 565);
    			attr_dev(li4, "class", "cleared svelte-1koktod");
    			add_location(li4, file$b, 17, 16, 679);
    			attr_dev(li5, "class", "cleared svelte-1koktod");
    			add_location(li5, file$b, 18, 16, 737);
    			attr_dev(ul1, "class", "svelte-1koktod");
    			add_location(ul1, file$b, 16, 12, 658);
    			attr_dev(div3, "class", "roadmap-card svelte-1koktod");
    			add_location(div3, file$b, 12, 8, 526);
    			attr_dev(h32, "class", "svelte-1koktod");
    			add_location(h32, file$b, 23, 16, 930);
    			attr_dev(div4, "class", "header svelte-1koktod");
    			add_location(div4, file$b, 22, 12, 893);
    			attr_dev(li6, "class", "cleared svelte-1koktod");
    			add_location(li6, file$b, 26, 16, 999);
    			attr_dev(li7, "class", "cleared svelte-1koktod");
    			add_location(li7, file$b, 27, 16, 1064);
    			attr_dev(ul2, "class", "svelte-1koktod");
    			add_location(ul2, file$b, 25, 12, 978);
    			attr_dev(div5, "class", "roadmap-card svelte-1koktod");
    			add_location(div5, file$b, 21, 8, 854);
    			attr_dev(h33, "class", "svelte-1koktod");
    			add_location(h33, file$b, 32, 16, 1224);
    			attr_dev(div6, "class", "header svelte-1koktod");
    			add_location(div6, file$b, 31, 12, 1187);
    			attr_dev(li8, "class", "cleared svelte-1koktod");
    			add_location(li8, file$b, 35, 16, 1293);
    			attr_dev(li9, "class", "cleared svelte-1koktod");
    			add_location(li9, file$b, 36, 16, 1361);
    			attr_dev(li10, "class", "svelte-1koktod");
    			add_location(li10, file$b, 37, 16, 1450);
    			attr_dev(li11, "class", "svelte-1koktod");
    			add_location(li11, file$b, 38, 16, 1490);
    			attr_dev(ul3, "class", "svelte-1koktod");
    			add_location(ul3, file$b, 34, 12, 1272);
    			attr_dev(div7, "class", "roadmap-card svelte-1koktod");
    			add_location(div7, file$b, 30, 8, 1148);
    			attr_dev(h34, "class", "svelte-1koktod");
    			add_location(h34, file$b, 43, 16, 1652);
    			attr_dev(div8, "class", "header svelte-1koktod");
    			add_location(div8, file$b, 42, 12, 1615);
    			attr_dev(li12, "class", "svelte-1koktod");
    			add_location(li12, file$b, 46, 16, 1721);
    			attr_dev(li13, "class", "svelte-1koktod");
    			add_location(li13, file$b, 47, 16, 1764);
    			attr_dev(li14, "class", "svelte-1koktod");
    			add_location(li14, file$b, 48, 16, 1811);
    			attr_dev(li15, "class", "svelte-1koktod");
    			add_location(li15, file$b, 49, 16, 1859);
    			attr_dev(li16, "class", "svelte-1koktod");
    			add_location(li16, file$b, 50, 16, 1906);
    			attr_dev(li17, "class", "svelte-1koktod");
    			add_location(li17, file$b, 51, 16, 1967);
    			attr_dev(li18, "class", "svelte-1koktod");
    			add_location(li18, file$b, 52, 16, 2000);
    			attr_dev(ul4, "class", "svelte-1koktod");
    			add_location(ul4, file$b, 45, 12, 1700);
    			attr_dev(div9, "class", "roadmap-card svelte-1koktod");
    			add_location(div9, file$b, 41, 8, 1576);
    			attr_dev(h35, "class", "svelte-1koktod");
    			add_location(h35, file$b, 57, 16, 2142);
    			attr_dev(div10, "class", "header svelte-1koktod");
    			add_location(div10, file$b, 56, 12, 2105);
    			attr_dev(li19, "class", "svelte-1koktod");
    			add_location(li19, file$b, 60, 16, 2211);
    			attr_dev(li20, "class", "svelte-1koktod");
    			add_location(li20, file$b, 61, 16, 2263);
    			attr_dev(li21, "class", "svelte-1koktod");
    			add_location(li21, file$b, 62, 16, 2307);
    			attr_dev(ul5, "class", "svelte-1koktod");
    			add_location(ul5, file$b, 59, 12, 2190);
    			attr_dev(div11, "class", "roadmap-card svelte-1koktod");
    			add_location(div11, file$b, 55, 8, 2066);
    			attr_dev(h36, "class", "svelte-1koktod");
    			add_location(h36, file$b, 67, 16, 2484);
    			attr_dev(div12, "class", "header svelte-1koktod");
    			add_location(div12, file$b, 66, 12, 2447);
    			attr_dev(li22, "class", "svelte-1koktod");
    			add_location(li22, file$b, 70, 16, 2553);
    			attr_dev(li23, "class", "svelte-1koktod");
    			add_location(li23, file$b, 71, 16, 2605);
    			attr_dev(li24, "class", "svelte-1koktod");
    			add_location(li24, file$b, 72, 16, 2659);
    			attr_dev(ul6, "class", "svelte-1koktod");
    			add_location(ul6, file$b, 69, 12, 2532);
    			attr_dev(div13, "class", "roadmap-card svelte-1koktod");
    			add_location(div13, file$b, 65, 8, 2408);
    			attr_dev(h37, "class", "svelte-1koktod");
    			add_location(h37, file$b, 77, 16, 2817);
    			attr_dev(div14, "class", "header svelte-1koktod");
    			add_location(div14, file$b, 76, 12, 2780);
    			attr_dev(li25, "class", "svelte-1koktod");
    			add_location(li25, file$b, 80, 16, 2886);
    			attr_dev(ul7, "class", "svelte-1koktod");
    			add_location(ul7, file$b, 79, 12, 2865);
    			attr_dev(div15, "class", "roadmap-card svelte-1koktod");
    			add_location(div15, file$b, 75, 8, 2741);
    			attr_dev(div16, "class", "roadmap-container svelte-1koktod");
    			add_location(div16, file$b, 0, 4, 4);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h30);
    			append_dev(div1, t1);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			append_dev(ul0, t5);
    			append_dev(ul0, li2);
    			append_dev(ul0, t7);
    			append_dev(ul0, li3);
    			append_dev(div16, t9);
    			append_dev(div16, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h31);
    			append_dev(div3, t11);
    			append_dev(div3, ul1);
    			append_dev(ul1, li4);
    			append_dev(ul1, t13);
    			append_dev(ul1, li5);
    			append_dev(div16, t15);
    			append_dev(div16, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h32);
    			append_dev(div5, t17);
    			append_dev(div5, ul2);
    			append_dev(ul2, li6);
    			append_dev(ul2, t19);
    			append_dev(ul2, li7);
    			append_dev(div16, t21);
    			append_dev(div16, div7);
    			append_dev(div7, div6);
    			append_dev(div6, h33);
    			append_dev(div7, t23);
    			append_dev(div7, ul3);
    			append_dev(ul3, li8);
    			append_dev(ul3, t25);
    			append_dev(ul3, li9);
    			append_dev(ul3, t27);
    			append_dev(ul3, li10);
    			append_dev(ul3, t29);
    			append_dev(ul3, li11);
    			append_dev(div16, t31);
    			append_dev(div16, div9);
    			append_dev(div9, div8);
    			append_dev(div8, h34);
    			append_dev(div9, t33);
    			append_dev(div9, ul4);
    			append_dev(ul4, li12);
    			append_dev(ul4, t35);
    			append_dev(ul4, li13);
    			append_dev(ul4, t37);
    			append_dev(ul4, li14);
    			append_dev(ul4, t39);
    			append_dev(ul4, li15);
    			append_dev(ul4, t41);
    			append_dev(ul4, li16);
    			append_dev(ul4, t43);
    			append_dev(ul4, li17);
    			append_dev(ul4, t45);
    			append_dev(ul4, li18);
    			append_dev(div16, t47);
    			append_dev(div16, div11);
    			append_dev(div11, div10);
    			append_dev(div10, h35);
    			append_dev(div11, t49);
    			append_dev(div11, ul5);
    			append_dev(ul5, li19);
    			append_dev(ul5, t51);
    			append_dev(ul5, li20);
    			append_dev(ul5, t53);
    			append_dev(ul5, li21);
    			append_dev(div16, t55);
    			append_dev(div16, div13);
    			append_dev(div13, div12);
    			append_dev(div12, h36);
    			append_dev(div13, t57);
    			append_dev(div13, ul6);
    			append_dev(ul6, li22);
    			append_dev(ul6, t59);
    			append_dev(ul6, li23);
    			append_dev(ul6, t61);
    			append_dev(ul6, li24);
    			append_dev(div16, t63);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, h37);
    			append_dev(div15, t65);
    			append_dev(div15, ul7);
    			append_dev(ul7, li25);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Roadmap', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Roadmap> was created with unknown prop '${key}'`);
    	});

    	return [];
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
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let p;
    	let t2;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let t3;
    	let div2;
    	let ul;
    	let li0;
    	let span0;
    	let t5;
    	let li1;
    	let span1;
    	let t7;
    	let li2;
    	let span2;
    	let t9;
    	let li3;
    	let span3;
    	let t11;
    	let li4;
    	let span4;
    	let t13;
    	let li5;
    	let span5;
    	let t15;
    	let li6;
    	let span6;
    	let t17;
    	let div4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "100,000,000 Tokens";
    			t2 = space();
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Team 10%";
    			t5 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Advisors 5%";
    			t7 = space();
    			li2 = element("li");
    			span2 = element("span");
    			span2.textContent = "Seed Sale 10%";
    			t9 = space();
    			li3 = element("li");
    			span3 = element("span");
    			span3.textContent = "Private Sale 5%";
    			t11 = space();
    			li4 = element("li");
    			span4 = element("span");
    			span4.textContent = "Public Sale 20%";
    			t13 = space();
    			li5 = element("li");
    			span5 = element("span");
    			span5.textContent = "Liquidity Pool 20%";
    			t15 = space();
    			li6 = element("li");
    			span6 = element("span");
    			span6.textContent = "Foundation 30%";
    			t17 = space();
    			div4 = element("div");
    			set_style(div0, "width", "30%");
    			add_location(div0, file$9, 1, 4, 39);
    			set_style(p, "display", "inline");
    			set_style(p, "font-weight", "200");
    			set_style(p, "font-family", "'Montserrat'");
    			set_style(p, "width", "30%");
    			set_style(p, "position", "relative");
    			set_style(p, "top", "50%");
    			set_style(p, "z-index", "4");
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "margin-left", "auto");
    			set_style(p, "margin-right", "auto");
    			add_location(p, file$9, 3, 8, 109);
    			attr_dev(path0, "data-value", "Team 10,000,000");
    			attr_dev(path0, "class", "section svelte-1w1e6u8");
    			attr_dev(path0, "id", "0");
    			attr_dev(path0, "fill", "#003f5c");
    			attr_dev(path0, "d", "M150, 0 A150,150 0 0 1 238.1656698289039,28.64591204404894 L214.6548245411962,61.007002165635896 A110,110 0 0 0 150,40 Z");
    			add_location(path0, file$9, 5, 12, 405);
    			attr_dev(path1, "data-value", "Advisors 5,000,000");
    			attr_dev(path1, "class", "section svelte-1w1e6u8");
    			attr_dev(path1, "id", "1");
    			attr_dev(path1, "fill", "#374c80");
    			attr_dev(path1, "d", "M238.1656698289039, 28.64591204404894 A150,150 0 0 1 271.3502408873674,61.82903518403633 L238.9901766507361,85.3412924682933 A110,110 0 0 0 214.6548245411962,61.007002165635896 Z");
    			add_location(path1, file$9, 6, 12, 703);
    			attr_dev(path2, "data-value", "Seed Sale 10,000,000");
    			attr_dev(path2, "class", "section svelte-1w1e6u8");
    			attr_dev(path2, "id", "2");
    			attr_dev(path2, "fill", "#7a5195");
    			attr_dev(path2, "d", "M271.3502408873674, 61.82903518403633 A150,150 0 0 1 299.9999998572106,149.99345501530712 L259.9999998952878,149.99520034455855 A110,110 0 0 0 238.9901766507361,85.3412924682933 Z");
    			add_location(path2, file$9, 7, 12, 1062);
    			attr_dev(path3, "data-value", "Private Sale 5,000,000");
    			attr_dev(path3, "class", "section svelte-1w1e6u8");
    			attr_dev(path3, "id", "3");
    			attr_dev(path3, "fill", "#bc5090");
    			attr_dev(path3, "d", "M299.9999998572106, 149.99345501530712 A150,150 0 0 1 292.6609042625172,196.34507951229457 L254.61799645917927,183.98639164234936 A110,110 0 0 0 259.9999998952878,149.99520034455855 Z");
    			add_location(path3, file$9, 8, 12, 1424);
    			attr_dev(path4, "data-value", "Public Sale 20,000,000");
    			attr_dev(path4, "class", "section svelte-1w1e6u8");
    			attr_dev(path4, "id", "4");
    			attr_dev(path4, "fill", "#ef5675");
    			attr_dev(path4, "d", "M292.6609042625172, 196.34507951229457 A150,150 0 0 1 150.01308996937328,299.99999942884233 L150.00959931087374,259.9999995811511 A110,110 0 0 0 254.61799645917927,183.98639164234936 Z");
    			add_location(path4, file$9, 9, 12, 1792);
    			attr_dev(path5, "data-value", "Liquidity Pool 20,000,000");
    			attr_dev(path5, "class", "section svelte-1w1e6u8");
    			attr_dev(path5, "id", "5");
    			attr_dev(path5, "fill", "#ff764a");
    			attr_dev(path5, "d", "M150.01308996937328, 299.99999942884233 A150,150 0 0 1 7.34718665258751,196.36997783122493 L45.387936878564176,184.00465040956496 A110,110 0 0 0 150.00959931087374,259.9999995811511 Z");
    			add_location(path5, file$9, 10, 12, 2161);
    			attr_dev(path6, "data-value", "Foundation 30,000,000");
    			attr_dev(path6, "class", "section svelte-1w1e6u8");
    			attr_dev(path6, "id", "6");
    			attr_dev(path6, "fill", "#ffa600");
    			attr_dev(path6, "d", "M7.34718665258751, 196.36997783122493 A150,150 0 0 1 149.9738200613531,0.000002284630625126738 L149.9808013783256,40.000001675395794 A110,110 0 0 0 45.387936878564176,184.00465040956496 Z");
    			add_location(path6, file$9, 11, 12, 2532);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "id", "sv");
    			attr_dev(svg, "viewBox", "-50 -50 400 400");
    			add_location(svg, file$9, 4, 8, 318);
    			attr_dev(div1, "class", "svg-container svelte-1w1e6u8");
    			add_location(div1, file$9, 2, 4, 73);
    			attr_dev(span0, "class", "svelte-1w1e6u8");
    			add_location(span0, file$9, 16, 62, 3101);
    			attr_dev(li0, "class", "team svelte-1w1e6u8");
    			toggle_class(li0, "highlight", /*selected*/ ctx[0] === 0);
    			add_location(li0, file$9, 16, 12, 3051);
    			attr_dev(span1, "class", "svelte-1w1e6u8");
    			add_location(span1, file$9, 17, 66, 3194);
    			attr_dev(li1, "class", "advisors svelte-1w1e6u8");
    			toggle_class(li1, "highlight", /*selected*/ ctx[0] === 1);
    			add_location(li1, file$9, 17, 12, 3140);
    			attr_dev(span2, "class", "svelte-1w1e6u8");
    			add_location(span2, file$9, 18, 62, 3286);
    			attr_dev(li2, "class", "seed svelte-1w1e6u8");
    			toggle_class(li2, "highlight", /*selected*/ ctx[0] === 2);
    			add_location(li2, file$9, 18, 12, 3236);
    			attr_dev(span3, "class", "svelte-1w1e6u8");
    			add_location(span3, file$9, 19, 65, 3383);
    			attr_dev(li3, "class", "private svelte-1w1e6u8");
    			toggle_class(li3, "highlight", /*selected*/ ctx[0] === 3);
    			add_location(li3, file$9, 19, 12, 3330);
    			attr_dev(span4, "class", "svelte-1w1e6u8");
    			add_location(span4, file$9, 20, 64, 3481);
    			attr_dev(li4, "class", "public svelte-1w1e6u8");
    			toggle_class(li4, "highlight", /*selected*/ ctx[0] === 4);
    			add_location(li4, file$9, 20, 12, 3429);
    			attr_dev(span5, "class", "svelte-1w1e6u8");
    			add_location(span5, file$9, 21, 67, 3582);
    			attr_dev(li5, "class", "liquidity svelte-1w1e6u8");
    			toggle_class(li5, "highlight", /*selected*/ ctx[0] === 5);
    			add_location(li5, file$9, 21, 12, 3527);
    			attr_dev(span6, "class", "svelte-1w1e6u8");
    			add_location(span6, file$9, 22, 68, 3687);
    			attr_dev(li6, "class", "foundation svelte-1w1e6u8");
    			toggle_class(li6, "highlight", /*selected*/ ctx[0] === 6);
    			add_location(li6, file$9, 22, 12, 3631);
    			set_style(ul, "display", "table-cell");
    			set_style(ul, "vertical-align", "middle");
    			attr_dev(ul, "class", "svelte-1w1e6u8");
    			add_location(ul, file$9, 15, 8, 2981);
    			attr_dev(div2, "class", "list svelte-1w1e6u8");
    			set_style(div2, "width", "30%");
    			set_style(div2, "display", "table");
    			add_location(div2, file$9, 14, 4, 2921);
    			attr_dev(div3, "class", "tokenomics-container svelte-1w1e6u8");
    			add_location(div3, file$9, 0, 0, 0);
    			attr_dev(div4, "id", "tooltip");
    			attr_dev(div4, "display", "none");
    			set_style(div4, "position", "absolute");
    			set_style(div4, "display", "none");
    			attr_dev(div4, "class", "svelte-1w1e6u8");
    			add_location(div4, file$9, 26, 0, 3752);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(div1, t2);
    			append_dev(div1, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(svg, path6);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(li2, span2);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(li3, span3);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(li4, span4);
    			append_dev(ul, t13);
    			append_dev(ul, li5);
    			append_dev(li5, span5);
    			append_dev(ul, t15);
    			append_dev(ul, li6);
    			append_dev(li6, span6);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div4, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path0, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path0, "mousemove", showTooltip, false, false, false),
    					listen_dev(path0, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path1, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path1, "mousemove", showTooltip, false, false, false),
    					listen_dev(path1, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path2, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path2, "mousemove", showTooltip, false, false, false),
    					listen_dev(path2, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path3, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path3, "mousemove", showTooltip, false, false, false),
    					listen_dev(path3, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path4, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path4, "mousemove", showTooltip, false, false, false),
    					listen_dev(path4, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path5, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path5, "mousemove", showTooltip, false, false, false),
    					listen_dev(path5, "mouseleave", /*deselect*/ ctx[2], false, false, false),
    					listen_dev(path6, "mouseover", /*bringToFront*/ ctx[1], false, false, false),
    					listen_dev(path6, "mousemove", showTooltip, false, false, false),
    					listen_dev(path6, "mouseleave", /*deselect*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
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
    				toggle_class(li3, "highlight", /*selected*/ ctx[0] === 3);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li4, "highlight", /*selected*/ ctx[0] === 4);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li5, "highlight", /*selected*/ ctx[0] === 5);
    			}

    			if (dirty & /*selected*/ 1) {
    				toggle_class(li6, "highlight", /*selected*/ ctx[0] === 6);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
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

    	return [selected, bringToFront, deselect];
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
    	let div6;
    	let div4;
    	let div0;
    	let h30;
    	let t1;
    	let p0;
    	let t3;
    	let div1;
    	let h31;
    	let t5;
    	let p1;
    	let t7;
    	let div2;
    	let h32;
    	let t9;
    	let p2;
    	let t11;
    	let div3;
    	let h33;
    	let t13;
    	let p3;
    	let t15;
    	let div5;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Take videos showcasing your skills";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    			t3 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Put videos up for Challenge";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    			t7 = space();
    			div2 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Users vote to determine winner";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    			t11 = space();
    			div3 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Earn money from voting and winning challenges";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    			t15 = space();
    			div5 = element("div");
    			attr_dev(h30, "class", "svelte-16nbwyw");
    			add_location(h30, file$8, 3, 12, 105);
    			attr_dev(p0, "class", "svelte-16nbwyw");
    			add_location(p0, file$8, 4, 12, 161);
    			attr_dev(div0, "class", "tip svelte-16nbwyw");
    			add_location(div0, file$8, 2, 8, 75);
    			attr_dev(h31, "class", "svelte-16nbwyw");
    			add_location(h31, file$8, 7, 10, 343);
    			attr_dev(p1, "class", "svelte-16nbwyw");
    			add_location(p1, file$8, 8, 10, 390);
    			attr_dev(div1, "class", "tip svelte-16nbwyw");
    			add_location(div1, file$8, 6, 8, 315);
    			attr_dev(h32, "class", "svelte-16nbwyw");
    			add_location(h32, file$8, 11, 12, 574);
    			attr_dev(p2, "class", "svelte-16nbwyw");
    			add_location(p2, file$8, 12, 12, 626);
    			attr_dev(div2, "class", "tip svelte-16nbwyw");
    			add_location(div2, file$8, 10, 8, 544);
    			attr_dev(h33, "class", "svelte-16nbwyw");
    			add_location(h33, file$8, 15, 12, 810);
    			attr_dev(p3, "class", "svelte-16nbwyw");
    			add_location(p3, file$8, 16, 12, 877);
    			attr_dev(div3, "class", "tip svelte-16nbwyw");
    			add_location(div3, file$8, 14, 8, 780);
    			attr_dev(div4, "class", "challenge-tips svelte-16nbwyw");
    			add_location(div4, file$8, 1, 4, 38);
    			attr_dev(div5, "class", "video-container svelte-16nbwyw");
    			add_location(div5, file$8, 19, 4, 1038);
    			attr_dev(div6, "class", "challenge-container svelte-16nbwyw");
    			add_location(div6, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, h32);
    			append_dev(div2, t9);
    			append_dev(div2, p2);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, h33);
    			append_dev(div3, t13);
    			append_dev(div3, p3);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
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

    /* src/Challengev.svelte generated by Svelte v3.44.3 */

    const file$7 = "src/Challengev.svelte";

    function create_fragment$7(ctx) {
    	let div14;
    	let div2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let h30;
    	let t2;
    	let p0;
    	let t4;
    	let div5;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div4;
    	let h31;
    	let t7;
    	let p1;
    	let t9;
    	let div8;
    	let div6;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div7;
    	let h32;
    	let t12;
    	let p2;
    	let t14;
    	let div11;
    	let div9;
    	let img3;
    	let img3_src_value;
    	let t15;
    	let div10;
    	let h33;
    	let t17;
    	let p3;
    	let t19;
    	let div13;
    	let div12;
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			div14 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Take videos showcasing your skills";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "No matter if your skill is athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind, we want to see it. Setup your camera up to capture your finest moment and use our custom editing features to make it stand out even more.";
    			t4 = space();
    			div5 = element("div");
    			div3 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div4 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Put videos up for Challenge";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "After you’re satisfied with your video, it’s time to put it up for Challenge. Winning a challenge round is how your video becomes eligible for minting. Choose between putting your video up for Open Challenge or directly challenging another video or user. Round lengths can be either 24h or 72h.";
    			t9 = space();
    			div8 = element("div");
    			div6 = element("div");
    			img2 = element("img");
    			t10 = space();
    			div7 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Users vote to determine winner";
    			t12 = space();
    			p2 = element("p");
    			p2.textContent = "Over the duration of the challenge, users can use Vote tokens to cast their vote for which video they like most. Once the challenge is complete, the video with the most votes is declared the winner and minted as an NFT.";
    			t14 = space();
    			div11 = element("div");
    			div9 = element("div");
    			img3 = element("img");
    			t15 = space();
    			div10 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Earn money from voting and winning challenges";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is. Closer vote count = bigger cut.";
    			t19 = space();
    			div13 = element("div");
    			div12 = element("div");
    			iframe = element("iframe");
    			if (!src_url_equal(img0.src, img0_src_value = "")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$7, 3, 12, 106);
    			attr_dev(div0, "class", "image first svelte-jtp1hs");
    			add_location(div0, file$7, 2, 8, 68);
    			set_style(h30, "border-bottom", "2px solid aqua");
    			attr_dev(h30, "class", "svelte-jtp1hs");
    			add_location(h30, file$7, 6, 12, 185);
    			attr_dev(p0, "class", "svelte-jtp1hs");
    			add_location(p0, file$7, 7, 12, 280);
    			attr_dev(div1, "class", "content second svelte-jtp1hs");
    			add_location(div1, file$7, 5, 8, 144);
    			attr_dev(div2, "class", "section svelte-jtp1hs");
    			add_location(div2, file$7, 1, 4, 38);
    			if (!src_url_equal(img1.src, img1_src_value = "")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$7, 12, 12, 636);
    			attr_dev(div3, "class", "image second svelte-jtp1hs");
    			add_location(div3, file$7, 11, 8, 597);
    			set_style(h31, "border-bottom", "2px solid red");
    			attr_dev(h31, "class", "svelte-jtp1hs");
    			add_location(h31, file$7, 15, 12, 714);
    			attr_dev(p1, "class", "svelte-jtp1hs");
    			add_location(p1, file$7, 16, 12, 801);
    			attr_dev(div4, "class", "content first svelte-jtp1hs");
    			add_location(div4, file$7, 14, 8, 674);
    			attr_dev(div5, "class", "section svelte-jtp1hs");
    			add_location(div5, file$7, 10, 4, 567);
    			if (!src_url_equal(img2.src, img2_src_value = "")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$7, 21, 12, 1201);
    			attr_dev(div6, "class", "image first svelte-jtp1hs");
    			add_location(div6, file$7, 20, 8, 1163);
    			set_style(h32, "border-bottom", "2px solid purple");
    			attr_dev(h32, "class", "svelte-jtp1hs");
    			add_location(h32, file$7, 24, 12, 1280);
    			attr_dev(p2, "class", "svelte-jtp1hs");
    			add_location(p2, file$7, 25, 12, 1373);
    			attr_dev(div7, "class", "content second svelte-jtp1hs");
    			add_location(div7, file$7, 23, 8, 1239);
    			attr_dev(div8, "class", "section svelte-jtp1hs");
    			add_location(div8, file$7, 19, 4, 1133);
    			if (!src_url_equal(img3.src, img3_src_value = "")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$7, 30, 12, 1699);
    			attr_dev(div9, "class", "image second svelte-jtp1hs");
    			add_location(div9, file$7, 29, 8, 1660);
    			set_style(h33, "border-bottom", "2px solid gold");
    			attr_dev(h33, "class", "svelte-jtp1hs");
    			add_location(h33, file$7, 33, 12, 1777);
    			attr_dev(p3, "class", "svelte-jtp1hs");
    			add_location(p3, file$7, 34, 12, 1883);
    			attr_dev(div10, "class", "content first svelte-jtp1hs");
    			add_location(div10, file$7, 32, 8, 1737);
    			attr_dev(div11, "class", "section svelte-jtp1hs");
    			add_location(div11, file$7, 28, 4, 1630);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/tgbNymZ7vqY")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "class", "svelte-jtp1hs");
    			add_location(iframe, file$7, 39, 12, 2299);
    			attr_dev(div12, "class", "video svelte-jtp1hs");
    			add_location(div12, file$7, 38, 8, 2267);
    			attr_dev(div13, "class", "video-container svelte-jtp1hs");
    			add_location(div13, file$7, 37, 4, 2229);
    			attr_dev(div14, "class", "challenge-container svelte-jtp1hs");
    			add_location(div14, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div14, anchor);
    			append_dev(div14, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h30);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div14, t4);
    			append_dev(div14, div5);
    			append_dev(div5, div3);
    			append_dev(div3, img1);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, h31);
    			append_dev(div4, t7);
    			append_dev(div4, p1);
    			append_dev(div14, t9);
    			append_dev(div14, div8);
    			append_dev(div8, div6);
    			append_dev(div6, img2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, h32);
    			append_dev(div7, t12);
    			append_dev(div7, p2);
    			append_dev(div14, t14);
    			append_dev(div14, div11);
    			append_dev(div11, div9);
    			append_dev(div9, img3);
    			append_dev(div11, t15);
    			append_dev(div11, div10);
    			append_dev(div10, h33);
    			append_dev(div10, t17);
    			append_dev(div10, p3);
    			append_dev(div14, t19);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, iframe);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div14);
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
    	validate_slots('Challengev', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Challengev> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Challengev extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Challengev",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/VoteToken.svelte generated by Svelte v3.44.3 */

    const file$6 = "src/VoteToken.svelte";

    function create_fragment$6(ctx) {
    	let div9;
    	let div3;
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
    	let div4;
    	let h1;
    	let t22;
    	let img3;
    	let img3_src_value;
    	let t23;
    	let div8;
    	let div5;
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
    	let div6;
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
    	let div7;
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
    			div9 = element("div");
    			div3 = element("div");
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
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "1 $Vote ≈ $0.10";
    			t22 = space();
    			img3 = element("img");
    			t23 = space();
    			div8 = element("div");
    			div5 = element("div");
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
    			div6 = element("div");
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
    			div7 = element("div");
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
    			if (!src_url_equal(img0.src, img0_src_value = "images/vote.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1wwlkb6");
    			add_location(img0, file$6, 4, 12, 127);
    			attr_dev(h30, "class", "svelte-1wwlkb6");
    			add_location(h30, file$6, 5, 16, 173);
    			attr_dev(span0, "class", "title svelte-1wwlkb6");
    			add_location(span0, file$6, 3, 11, 94);
    			attr_dev(span1, "class", "highlight svelte-1wwlkb6");
    			add_location(span1, file$6, 7, 98, 315);
    			attr_dev(p0, "class", "svelte-1wwlkb6");
    			add_location(p0, file$6, 7, 11, 228);
    			attr_dev(div0, "class", "section svelte-1wwlkb6");
    			add_location(div0, file$6, 2, 7, 61);
    			if (!src_url_equal(img1.src, img1_src_value = "images/earnings.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1wwlkb6");
    			add_location(img1, file$6, 11, 12, 476);
    			attr_dev(h31, "class", "svelte-1wwlkb6");
    			add_location(h31, file$6, 12, 13, 523);
    			attr_dev(span2, "class", "title svelte-1wwlkb6");
    			add_location(span2, file$6, 10, 8, 443);
    			attr_dev(span3, "class", "highlight svelte-1wwlkb6");
    			add_location(span3, file$6, 14, 89, 658);
    			attr_dev(p1, "class", "svelte-1wwlkb6");
    			add_location(p1, file$6, 14, 8, 577);
    			attr_dev(div1, "class", "section svelte-1wwlkb6");
    			add_location(div1, file$6, 9, 7, 413);
    			if (!src_url_equal(img2.src, img2_src_value = "images/revenue.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1wwlkb6");
    			add_location(img2, file$6, 18, 12, 826);
    			attr_dev(h32, "class", "svelte-1wwlkb6");
    			add_location(h32, file$6, 19, 13, 872);
    			attr_dev(span4, "class", "title svelte-1wwlkb6");
    			add_location(span4, file$6, 17, 8, 793);
    			attr_dev(span5, "class", "highlight svelte-1wwlkb6");
    			add_location(span5, file$6, 21, 54, 973);
    			attr_dev(p2, "class", "svelte-1wwlkb6");
    			add_location(p2, file$6, 21, 8, 927);
    			attr_dev(div2, "class", "section svelte-1wwlkb6");
    			add_location(div2, file$6, 16, 4, 763);
    			attr_dev(div3, "class", "column svelte-1wwlkb6");
    			add_location(div3, file$6, 1, 4, 33);
    			attr_dev(h1, "id", "value");
    			attr_dev(h1, "class", "svelte-1wwlkb6");
    			add_location(h1, file$6, 25, 8, 1149);
    			if (!src_url_equal(img3.src, img3_src_value = "images/token.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1wwlkb6");
    			add_location(img3, file$6, 26, 8, 1193);
    			attr_dev(div4, "class", "column middle svelte-1wwlkb6");
    			add_location(div4, file$6, 24, 4, 1113);
    			if (!src_url_equal(img4.src, img4_src_value = "images/stable.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1wwlkb6");
    			add_location(img4, file$6, 31, 16, 1339);
    			attr_dev(h33, "class", "svelte-1wwlkb6");
    			add_location(h33, file$6, 32, 17, 1388);
    			attr_dev(span6, "class", "title svelte-1wwlkb6");
    			add_location(span6, file$6, 30, 12, 1302);
    			attr_dev(span7, "class", "highlight svelte-1wwlkb6");
    			add_location(span7, file$6, 34, 32, 1477);
    			attr_dev(p3, "class", "svelte-1wwlkb6");
    			add_location(p3, file$6, 34, 12, 1457);
    			attr_dev(div5, "class", "section svelte-1wwlkb6");
    			add_location(div5, file$6, 29, 8, 1268);
    			if (!src_url_equal(img5.src, img5_src_value = "images/stake.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "svelte-1wwlkb6");
    			add_location(img5, file$6, 38, 16, 1692);
    			attr_dev(h34, "class", "svelte-1wwlkb6");
    			add_location(h34, file$6, 39, 17, 1740);
    			attr_dev(span8, "class", "title svelte-1wwlkb6");
    			add_location(span8, file$6, 37, 12, 1655);
    			attr_dev(span9, "class", "highlight svelte-1wwlkb6");
    			add_location(span9, file$6, 41, 55, 1844);
    			attr_dev(p4, "class", "svelte-1wwlkb6");
    			add_location(p4, file$6, 41, 12, 1801);
    			attr_dev(div6, "class", "section svelte-1wwlkb6");
    			add_location(div6, file$6, 36, 8, 1621);
    			if (!src_url_equal(img6.src, img6_src_value = "images/replenish.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "class", "svelte-1wwlkb6");
    			add_location(img6, file$6, 45, 16, 2066);
    			attr_dev(h35, "class", "svelte-1wwlkb6");
    			add_location(h35, file$6, 46, 17, 2118);
    			attr_dev(span10, "class", "title svelte-1wwlkb6");
    			add_location(span10, file$6, 44, 12, 2029);
    			attr_dev(span11, "class", "highlight svelte-1wwlkb6");
    			add_location(span11, file$6, 48, 55, 2232);
    			attr_dev(p5, "class", "svelte-1wwlkb6");
    			add_location(p5, file$6, 48, 13, 2190);
    			attr_dev(div7, "class", "section svelte-1wwlkb6");
    			add_location(div7, file$6, 43, 8, 1995);
    			attr_dev(div8, "class", "column svelte-1wwlkb6");
    			add_location(div8, file$6, 28, 4, 1239);
    			attr_dev(div9, "class", "vote-container svelte-1wwlkb6");
    			add_location(div9, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(span0, img0);
    			append_dev(span0, t0);
    			append_dev(span0, h30);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, span1);
    			append_dev(p0, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, span2);
    			append_dev(span2, img1);
    			append_dev(span2, t7);
    			append_dev(span2, h31);
    			append_dev(div1, t9);
    			append_dev(div1, p1);
    			append_dev(p1, t10);
    			append_dev(p1, span3);
    			append_dev(p1, t12);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, span4);
    			append_dev(span4, img2);
    			append_dev(span4, t14);
    			append_dev(span4, h32);
    			append_dev(div2, t16);
    			append_dev(div2, p2);
    			append_dev(p2, t17);
    			append_dev(p2, span5);
    			append_dev(p2, t19);
    			append_dev(div9, t20);
    			append_dev(div9, div4);
    			append_dev(div4, h1);
    			append_dev(div4, t22);
    			append_dev(div4, img3);
    			append_dev(div9, t23);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, span6);
    			append_dev(span6, img4);
    			append_dev(span6, t24);
    			append_dev(span6, h33);
    			append_dev(div5, t26);
    			append_dev(div5, p3);
    			append_dev(p3, t27);
    			append_dev(p3, span7);
    			append_dev(p3, t29);
    			append_dev(div8, t30);
    			append_dev(div8, div6);
    			append_dev(div6, span8);
    			append_dev(span8, img5);
    			append_dev(span8, t31);
    			append_dev(span8, h34);
    			append_dev(div6, t33);
    			append_dev(div6, p4);
    			append_dev(p4, t34);
    			append_dev(p4, span9);
    			append_dev(p4, t36);
    			append_dev(div8, t37);
    			append_dev(div8, div7);
    			append_dev(div7, span10);
    			append_dev(span10, img6);
    			append_dev(span10, t38);
    			append_dev(span10, h35);
    			append_dev(div7, t40);
    			append_dev(div7, p5);
    			append_dev(p5, t41);
    			append_dev(p5, span11);
    			append_dev(p5, t43);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VoteToken",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Roadmapv2.svelte generated by Svelte v3.44.3 */

    const file$5 = "src/Roadmapv2.svelte";

    function create_fragment$5(ctx) {
    	let div15;
    	let div2;
    	let h30;
    	let t1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div1;
    	let ul0;
    	let li0;
    	let t4;
    	let li1;
    	let t6;
    	let li2;
    	let t8;
    	let li3;
    	let t10;
    	let div5;
    	let h31;
    	let t12;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let div4;
    	let ul1;
    	let li4;
    	let t15;
    	let li5;
    	let t17;
    	let li6;
    	let t19;
    	let li7;
    	let t21;
    	let li8;
    	let t23;
    	let li9;
    	let t25;
    	let li10;
    	let t27;
    	let div8;
    	let h32;
    	let t29;
    	let div6;
    	let img2;
    	let img2_src_value;
    	let t30;
    	let div7;
    	let ul2;
    	let li11;
    	let t32;
    	let li12;
    	let t34;
    	let li13;
    	let t36;
    	let li14;
    	let t38;
    	let li15;
    	let t40;
    	let li16;
    	let t42;
    	let li17;
    	let t44;
    	let div11;
    	let h33;
    	let t46;
    	let div9;
    	let img3;
    	let img3_src_value;
    	let t47;
    	let div10;
    	let ul3;
    	let li18;
    	let t49;
    	let li19;
    	let t51;
    	let li20;
    	let t53;
    	let div14;
    	let h34;
    	let t55;
    	let div12;
    	let img4;
    	let img4_src_value;
    	let t56;
    	let div13;
    	let ul4;
    	let li21;
    	let t58;
    	let li22;
    	let t60;
    	let li23;
    	let t62;
    	let li24;

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "2019 - 2020";
    			t1 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Ideation";
    			t4 = space();
    			li1 = element("li");
    			li1.textContent = "Business plan";
    			t6 = space();
    			li2 = element("li");
    			li2.textContent = "Feasibility study";
    			t8 = space();
    			li3 = element("li");
    			li3.textContent = "Olympic skater Charles Hamelin joins project";
    			t10 = space();
    			div5 = element("div");
    			h31 = element("h3");
    			h31.textContent = "2021";
    			t12 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t13 = space();
    			div4 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Markest research";
    			t15 = space();
    			li5 = element("li");
    			li5.textContent = "Acquired advisors & CTO";
    			t17 = space();
    			li6 = element("li");
    			li6.textContent = "Backed by PME Montreal";
    			t19 = space();
    			li7 = element("li");
    			li7.textContent = "Finalists in NBA Launchpad";
    			t21 = space();
    			li8 = element("li");
    			li8.textContent = "Pivot towards NFT platform";
    			t23 = space();
    			li9 = element("li");
    			li9.textContent = "Launch website";
    			t25 = space();
    			li10 = element("li");
    			li10.textContent = "Release whitepaper and tokenomics";
    			t27 = space();
    			div8 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Q1 2022";
    			t29 = space();
    			div6 = element("div");
    			img2 = element("img");
    			t30 = space();
    			div7 = element("div");
    			ul2 = element("ul");
    			li11 = element("li");
    			li11.textContent = "Announce partners";
    			t32 = space();
    			li12 = element("li");
    			li12.textContent = "Setup social accounts";
    			t34 = space();
    			li13 = element("li");
    			li13.textContent = "Release marketing plan";
    			t36 = space();
    			li14 = element("li");
    			li14.textContent = "Mint governance token";
    			t38 = space();
    			li15 = element("li");
    			li15.textContent = "Release plan for Ambassador program";
    			t40 = space();
    			li16 = element("li");
    			li16.textContent = "Trailer";
    			t42 = space();
    			li17 = element("li");
    			li17.textContent = "Token presale";
    			t44 = space();
    			div11 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Q2 2022";
    			t46 = space();
    			div9 = element("div");
    			img3 = element("img");
    			t47 = space();
    			div10 = element("div");
    			ul3 = element("ul");
    			li18 = element("li");
    			li18.textContent = "Mint stablecoin Vote token";
    			t49 = space();
    			li19 = element("li");
    			li19.textContent = "Launch closed beta";
    			t51 = space();
    			li20 = element("li");
    			li20.textContent = "Full release of challenge system and marketplace";
    			t53 = space();
    			div14 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Q3+ 2022";
    			t55 = space();
    			div12 = element("div");
    			img4 = element("img");
    			t56 = space();
    			div13 = element("div");
    			ul4 = element("ul");
    			li21 = element("li");
    			li21.textContent = "Add video editing features";
    			t58 = space();
    			li22 = element("li");
    			li22.textContent = "Unique Tap-to-Record feature";
    			t60 = space();
    			li23 = element("li");
    			li23.textContent = "Release of ambassador program";
    			t62 = space();
    			li24 = element("li");
    			li24.textContent = "Release of GM mode";
    			set_style(h30, "color", "white");
    			attr_dev(h30, "class", "svelte-4qm7co");
    			add_location(h30, file$5, 2, 8, 91);
    			if (!src_url_equal(img0.src, img0_src_value = "images/idea.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-4qm7co");
    			add_location(img0, file$5, 4, 12, 215);
    			attr_dev(div0, "class", "header svelte-4qm7co");
    			set_style(div0, "border-bottom", "5px solid #363636");
    			add_location(div0, file$5, 3, 8, 141);
    			attr_dev(li0, "class", "cleared");
    			add_location(li0, file$5, 8, 16, 320);
    			attr_dev(li1, "class", "cleared");
    			add_location(li1, file$5, 9, 16, 370);
    			attr_dev(li2, "class", "cleared");
    			add_location(li2, file$5, 10, 16, 425);
    			attr_dev(li3, "class", "cleared");
    			add_location(li3, file$5, 11, 16, 484);
    			attr_dev(ul0, "class", "svelte-4qm7co");
    			add_location(ul0, file$5, 7, 12, 299);
    			attr_dev(div1, "class", "text svelte-4qm7co");
    			add_location(div1, file$5, 6, 8, 268);
    			attr_dev(div2, "class", "roadmap-card svelte-4qm7co");
    			set_style(div2, "height", "60%");
    			add_location(div2, file$5, 1, 4, 36);
    			set_style(h31, "color", "#852ee7");
    			attr_dev(h31, "class", "svelte-4qm7co");
    			add_location(h31, file$5, 16, 8, 657);
    			if (!src_url_equal(img1.src, img1_src_value = "images/leadership.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-4qm7co");
    			add_location(img1, file$5, 18, 12, 775);
    			attr_dev(div3, "class", "header svelte-4qm7co");
    			set_style(div3, "border-bottom", "5px solid #852ee7");
    			add_location(div3, file$5, 17, 8, 701);
    			attr_dev(li4, "class", "cleared");
    			add_location(li4, file$5, 22, 16, 886);
    			attr_dev(li5, "class", "cleared");
    			add_location(li5, file$5, 23, 16, 944);
    			attr_dev(li6, "class", "cleared");
    			add_location(li6, file$5, 24, 16, 1009);
    			attr_dev(li7, "class", "cleared");
    			add_location(li7, file$5, 25, 16, 1074);
    			attr_dev(li8, "class", "cleared");
    			add_location(li8, file$5, 26, 16, 1142);
    			add_location(li9, file$5, 27, 16, 1210);
    			add_location(li10, file$5, 28, 16, 1250);
    			attr_dev(ul1, "class", "svelte-4qm7co");
    			add_location(ul1, file$5, 21, 12, 865);
    			attr_dev(div4, "class", "text svelte-4qm7co");
    			add_location(div4, file$5, 20, 8, 834);
    			attr_dev(div5, "class", "roadmap-card svelte-4qm7co");
    			set_style(div5, "height", "70%");
    			add_location(div5, file$5, 15, 4, 602);
    			set_style(h32, "color", "#e0573f");
    			attr_dev(h32, "class", "svelte-4qm7co");
    			add_location(h32, file$5, 33, 8, 1396);
    			if (!src_url_equal(img2.src, img2_src_value = "images/planning.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-4qm7co");
    			add_location(img2, file$5, 35, 12, 1517);
    			attr_dev(div6, "class", "header svelte-4qm7co");
    			set_style(div6, "border-bottom", "5px solid #e0573f");
    			add_location(div6, file$5, 34, 8, 1443);
    			add_location(li11, file$5, 39, 16, 1626);
    			add_location(li12, file$5, 40, 16, 1669);
    			add_location(li13, file$5, 41, 16, 1716);
    			add_location(li14, file$5, 42, 16, 1764);
    			add_location(li15, file$5, 43, 16, 1811);
    			add_location(li16, file$5, 44, 16, 1872);
    			add_location(li17, file$5, 45, 16, 1905);
    			attr_dev(ul2, "class", "svelte-4qm7co");
    			add_location(ul2, file$5, 38, 12, 1605);
    			attr_dev(div7, "class", "text svelte-4qm7co");
    			add_location(div7, file$5, 37, 8, 1574);
    			attr_dev(div8, "class", "roadmap-card svelte-4qm7co");
    			set_style(div8, "height", "80%");
    			add_location(div8, file$5, 32, 4, 1341);
    			set_style(h33, "color", "#ecec37");
    			attr_dev(h33, "class", "svelte-4qm7co");
    			add_location(h33, file$5, 50, 8, 2031);
    			if (!src_url_equal(img3.src, img3_src_value = "images/launch.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-4qm7co");
    			add_location(img3, file$5, 52, 12, 2153);
    			attr_dev(div9, "class", "header svelte-4qm7co");
    			set_style(div9, "border-bottom", "5px solid #ecec37");
    			add_location(div9, file$5, 51, 8, 2079);
    			add_location(li18, file$5, 56, 16, 2260);
    			add_location(li19, file$5, 57, 16, 2312);
    			add_location(li20, file$5, 58, 16, 2356);
    			attr_dev(ul3, "class", "svelte-4qm7co");
    			add_location(ul3, file$5, 55, 12, 2239);
    			attr_dev(div10, "class", "text svelte-4qm7co");
    			add_location(div10, file$5, 54, 8, 2208);
    			attr_dev(div11, "class", "roadmap-card svelte-4qm7co");
    			set_style(div11, "height", "90%");
    			add_location(div11, file$5, 49, 4, 1976);
    			set_style(h34, "color", "aqua");
    			attr_dev(h34, "class", "svelte-4qm7co");
    			add_location(h34, file$5, 63, 8, 2518);
    			if (!src_url_equal(img4.src, img4_src_value = "images/globalization.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-4qm7co");
    			add_location(img4, file$5, 65, 12, 2636);
    			attr_dev(div12, "class", "header svelte-4qm7co");
    			set_style(div12, "border-bottom", "5px solid aqua");
    			add_location(div12, file$5, 64, 8, 2565);
    			add_location(li21, file$5, 69, 16, 2750);
    			add_location(li22, file$5, 70, 16, 2802);
    			add_location(li23, file$5, 71, 16, 2856);
    			add_location(li24, file$5, 72, 16, 2911);
    			attr_dev(ul4, "class", "svelte-4qm7co");
    			add_location(ul4, file$5, 68, 12, 2729);
    			attr_dev(div13, "class", "text svelte-4qm7co");
    			add_location(div13, file$5, 67, 8, 2698);
    			attr_dev(div14, "class", "roadmap-card svelte-4qm7co");
    			set_style(div14, "height", "100%");
    			add_location(div14, file$5, 62, 4, 2462);
    			attr_dev(div15, "class", "roadmap-container svelte-4qm7co");
    			add_location(div15, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, img0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t4);
    			append_dev(ul0, li1);
    			append_dev(ul0, t6);
    			append_dev(ul0, li2);
    			append_dev(ul0, t8);
    			append_dev(ul0, li3);
    			append_dev(div15, t10);
    			append_dev(div15, div5);
    			append_dev(div5, h31);
    			append_dev(div5, t12);
    			append_dev(div5, div3);
    			append_dev(div3, img1);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div4, ul1);
    			append_dev(ul1, li4);
    			append_dev(ul1, t15);
    			append_dev(ul1, li5);
    			append_dev(ul1, t17);
    			append_dev(ul1, li6);
    			append_dev(ul1, t19);
    			append_dev(ul1, li7);
    			append_dev(ul1, t21);
    			append_dev(ul1, li8);
    			append_dev(ul1, t23);
    			append_dev(ul1, li9);
    			append_dev(ul1, t25);
    			append_dev(ul1, li10);
    			append_dev(div15, t27);
    			append_dev(div15, div8);
    			append_dev(div8, h32);
    			append_dev(div8, t29);
    			append_dev(div8, div6);
    			append_dev(div6, img2);
    			append_dev(div8, t30);
    			append_dev(div8, div7);
    			append_dev(div7, ul2);
    			append_dev(ul2, li11);
    			append_dev(ul2, t32);
    			append_dev(ul2, li12);
    			append_dev(ul2, t34);
    			append_dev(ul2, li13);
    			append_dev(ul2, t36);
    			append_dev(ul2, li14);
    			append_dev(ul2, t38);
    			append_dev(ul2, li15);
    			append_dev(ul2, t40);
    			append_dev(ul2, li16);
    			append_dev(ul2, t42);
    			append_dev(ul2, li17);
    			append_dev(div15, t44);
    			append_dev(div15, div11);
    			append_dev(div11, h33);
    			append_dev(div11, t46);
    			append_dev(div11, div9);
    			append_dev(div9, img3);
    			append_dev(div11, t47);
    			append_dev(div11, div10);
    			append_dev(div10, ul3);
    			append_dev(ul3, li18);
    			append_dev(ul3, t49);
    			append_dev(ul3, li19);
    			append_dev(ul3, t51);
    			append_dev(ul3, li20);
    			append_dev(div15, t53);
    			append_dev(div15, div14);
    			append_dev(div14, h34);
    			append_dev(div14, t55);
    			append_dev(div14, div12);
    			append_dev(div12, img4);
    			append_dev(div14, t56);
    			append_dev(div14, div13);
    			append_dev(div13, ul4);
    			append_dev(ul4, li21);
    			append_dev(ul4, t58);
    			append_dev(ul4, li22);
    			append_dev(ul4, t60);
    			append_dev(ul4, li23);
    			append_dev(ul4, t62);
    			append_dev(ul4, li24);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Roadmapv2",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src/Carousel.svelte generated by Svelte v3.44.3 */
    const file$4 = "src/Carousel.svelte";
    const get_right_control_slot_changes = dirty => ({});
    const get_right_control_slot_context = ctx => ({});
    const get_left_control_slot_changes = dirty => ({});
    const get_left_control_slot_context = ctx => ({});

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (51:4) {#each images as image (image.id)}
    function create_each_block(key_1, ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_id_value;
    	let img_style_value;
    	let rect;
    	let stop_animation = noop;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[16].path)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image*/ ctx[16].id);
    			attr_dev(img, "id", img_id_value = /*image*/ ctx[16].id);
    			attr_dev(img, "style", img_style_value = `width:${/*imageWidth*/ ctx[1]}px; margin: 0 ${/*imageSpacing*/ ctx[2]}px;`);
    			attr_dev(img, "class", "svelte-40bsvo");
    			add_location(img, file$4, 51, 6, 1399);
    			this.first = img;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "mouseover", /*stopAutoPlay*/ ctx[10], false, false, false),
    					listen_dev(img, "mouseout", /*startAutoPlay*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*images*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[16].path)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*images*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[16].id)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*images*/ 1 && img_id_value !== (img_id_value = /*image*/ ctx[16].id)) {
    				attr_dev(img, "id", img_id_value);
    			}

    			if (dirty & /*imageWidth, imageSpacing*/ 6 && img_style_value !== (img_style_value = `width:${/*imageWidth*/ ctx[1]}px; margin: 0 ${/*imageSpacing*/ ctx[2]}px;`)) {
    				attr_dev(img, "style", img_style_value);
    			}
    		},
    		r: function measure() {
    			rect = img.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(img);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(img, rect, flip, { duration: /*speed*/ ctx[3] });
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(51:4) {#each images as image (image.id)}",
    		ctx
    	});

    	return block;
    }

    // (62:2) {#if displayControls}
    function create_if_block(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	const left_control_slot_template = /*#slots*/ ctx[14]["left-control"];
    	const left_control_slot = create_slot(left_control_slot_template, ctx, /*$$scope*/ ctx[13], get_left_control_slot_context);
    	const left_control_slot_or_fallback = left_control_slot || fallback_block_1(ctx);
    	const right_control_slot_template = /*#slots*/ ctx[14]["right-control"];
    	const right_control_slot = create_slot(right_control_slot_template, ctx, /*$$scope*/ ctx[13], get_right_control_slot_context);
    	const right_control_slot_or_fallback = right_control_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			if (left_control_slot_or_fallback) left_control_slot_or_fallback.c();
    			t = space();
    			button1 = element("button");
    			if (right_control_slot_or_fallback) right_control_slot_or_fallback.c();
    			attr_dev(button0, "id", "left");
    			attr_dev(button0, "class", "svelte-40bsvo");
    			add_location(button0, file$4, 63, 4, 1718);
    			attr_dev(button1, "id", "right");
    			attr_dev(button1, "class", "svelte-40bsvo");
    			add_location(button1, file$4, 75, 4, 2365);
    			add_location(div, file$4, 62, 4, 1708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);

    			if (left_control_slot_or_fallback) {
    				left_control_slot_or_fallback.m(button0, null);
    			}

    			append_dev(div, t);
    			append_dev(div, button1);

    			if (right_control_slot_or_fallback) {
    				right_control_slot_or_fallback.m(button1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*rotateLeft*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*rotateRight*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (left_control_slot) {
    				if (left_control_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						left_control_slot,
    						left_control_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(left_control_slot_template, /*$$scope*/ ctx[13], dirty, get_left_control_slot_changes),
    						get_left_control_slot_context
    					);
    				}
    			} else {
    				if (left_control_slot_or_fallback && left_control_slot_or_fallback.p && (!current || dirty & /*controlScale, controlColor*/ 48)) {
    					left_control_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (right_control_slot) {
    				if (right_control_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						right_control_slot,
    						right_control_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(right_control_slot_template, /*$$scope*/ ctx[13], dirty, get_right_control_slot_changes),
    						get_right_control_slot_context
    					);
    				}
    			} else {
    				if (right_control_slot_or_fallback && right_control_slot_or_fallback.p && (!current || dirty & /*controlScale, controlColor*/ 48)) {
    					right_control_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_control_slot_or_fallback, local);
    			transition_in(right_control_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_control_slot_or_fallback, local);
    			transition_out(right_control_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (left_control_slot_or_fallback) left_control_slot_or_fallback.d(detaching);
    			if (right_control_slot_or_fallback) right_control_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(62:2) {#if displayControls}",
    		ctx
    	});

    	return block;
    }

    // (65:32)          
    function fallback_block_1(ctx) {
    	let svg;
    	let g;
    	let path;
    	let path_style_value;
    	let svg_transform_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			attr_dev(path, "style", path_style_value = `fill:none;stroke:${/*controlColor*/ ctx[4]};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`);
    			attr_dev(path, "d", "m 99.785711,100.30199 -23.346628,37.07648 c -7.853858,12.81098 -7.88205,12.81098 0,24.78902 l 23.346628,37.94647");
    			attr_dev(path, "id", "path1412");
    			add_location(path, file$4, 67, 12, 1963);
    			attr_dev(g, "id", "layer1");
    			attr_dev(g, "transform", "translate(-65.605611,-95.36949)");
    			add_location(g, file$4, 66, 10, 1891);
    			attr_dev(svg, "width", "39px");
    			attr_dev(svg, "height", "110px");
    			attr_dev(svg, "id", "svg8");
    			attr_dev(svg, "transform", svg_transform_value = `scale(${/*controlScale*/ ctx[5]})`);
    			add_location(svg, file$4, 65, 8, 1800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*controlColor*/ 16 && path_style_value !== (path_style_value = `fill:none;stroke:${/*controlColor*/ ctx[4]};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`)) {
    				attr_dev(path, "style", path_style_value);
    			}

    			if (dirty & /*controlScale*/ 32 && svg_transform_value !== (svg_transform_value = `scale(${/*controlScale*/ ctx[5]})`)) {
    				attr_dev(svg, "transform", svg_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(65:32)          ",
    		ctx
    	});

    	return block;
    }

    // (77:33)          
    function fallback_block(ctx) {
    	let svg;
    	let g;
    	let path;
    	let path_style_value;
    	let svg_transform_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path = svg_element("path");
    			attr_dev(path, "style", path_style_value = `fill:none;stroke:${/*controlColor*/ ctx[4]};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`);
    			attr_dev(path, "d", "m 99.785711,100.30199 -23.346628,37.07648 c -7.853858,12.81098 -7.88205,12.81098 0,24.78902 l 23.346628,37.94647");
    			attr_dev(path, "id", "path1412");
    			add_location(path, file$4, 79, 12, 2625);
    			attr_dev(g, "id", "layer1");
    			attr_dev(g, "transform", "translate(-65.605611,-95.36949)");
    			add_location(g, file$4, 78, 10, 2553);
    			attr_dev(svg, "width", "39px");
    			attr_dev(svg, "height", "110px");
    			attr_dev(svg, "id", "svg8");
    			attr_dev(svg, "transform", svg_transform_value = `rotate(180) scale(${/*controlScale*/ ctx[5]})`);
    			add_location(svg, file$4, 77, 8, 2450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*controlColor*/ 16 && path_style_value !== (path_style_value = `fill:none;stroke:${/*controlColor*/ ctx[4]};stroke-width:9.865;stroke-linecap:round;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1`)) {
    				attr_dev(path, "style", path_style_value);
    			}

    			if (dirty & /*controlScale*/ 32 && svg_transform_value !== (svg_transform_value = `rotate(180) scale(${/*controlScale*/ ctx[5]})`)) {
    				attr_dev(svg, "transform", svg_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(77:33)          ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*image*/ ctx[16].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	let if_block = /*displayControls*/ ctx[6] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "id", "carousel-images");
    			attr_dev(div0, "class", "svelte-40bsvo");
    			add_location(div0, file$4, 49, 2, 1327);
    			attr_dev(div1, "id", "carousel-container");
    			attr_dev(div1, "class", "svelte-40bsvo");
    			add_location(div1, file$4, 48, 0, 1295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*images, imageWidth, imageSpacing, stopAutoPlay, startAutoPlay*/ 1543) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, fix_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    			}

    			if (/*displayControls*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*displayControls*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block) if_block.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, ['left-control','right-control']);
    	let { images } = $$props;
    	let { imageWidth = 300 } = $$props;
    	let { imageSpacing = 20 } = $$props;
    	let { speed = 500 } = $$props;
    	let { controlColor = '#444' } = $$props;
    	let { controlScale = '0.5' } = $$props;
    	let { autoplay = false } = $$props;
    	let { autoplaySpeed = 5000 } = $$props;
    	let { displayControls = true } = $$props;
    	let interval;

    	const rotateLeft = e => {
    		const transitioningImage = images[images.length - 1];
    		document.getElementById(transitioningImage.id).style.opacity = 1;
    		$$invalidate(0, images = [images[images.length - 1], ...images.slice(0, images.length - 1)]);
    		setTimeout(() => document.getElementById(transitioningImage.id).style.opacity = 1, speed);
    	};

    	const rotateRight = e => {
    		const transitioningImage = images[0];
    		document.getElementById(transitioningImage.id).style.opacity = 1;
    		$$invalidate(0, images = [...images.slice(1, images.length), images[0]]);
    		setTimeout(() => document.getElementById(transitioningImage.id).style.opacity = 1, speed);
    	};

    	const startAutoPlay = () => {
    		if (autoplay) {
    			interval = setInterval(rotateLeft, autoplaySpeed);
    		}
    	};

    	const stopAutoPlay = () => {
    		clearInterval(interval);
    	};

    	if (autoplay) {
    		startAutoPlay();
    	}

    	onDestroy(() => {
    		stopAutoPlay();
    	});

    	const writable_props = [
    		'images',
    		'imageWidth',
    		'imageSpacing',
    		'speed',
    		'controlColor',
    		'controlScale',
    		'autoplay',
    		'autoplaySpeed',
    		'displayControls'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('imageWidth' in $$props) $$invalidate(1, imageWidth = $$props.imageWidth);
    		if ('imageSpacing' in $$props) $$invalidate(2, imageSpacing = $$props.imageSpacing);
    		if ('speed' in $$props) $$invalidate(3, speed = $$props.speed);
    		if ('controlColor' in $$props) $$invalidate(4, controlColor = $$props.controlColor);
    		if ('controlScale' in $$props) $$invalidate(5, controlScale = $$props.controlScale);
    		if ('autoplay' in $$props) $$invalidate(11, autoplay = $$props.autoplay);
    		if ('autoplaySpeed' in $$props) $$invalidate(12, autoplaySpeed = $$props.autoplaySpeed);
    		if ('displayControls' in $$props) $$invalidate(6, displayControls = $$props.displayControls);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		flip,
    		onDestroy,
    		images,
    		imageWidth,
    		imageSpacing,
    		speed,
    		controlColor,
    		controlScale,
    		autoplay,
    		autoplaySpeed,
    		displayControls,
    		interval,
    		rotateLeft,
    		rotateRight,
    		startAutoPlay,
    		stopAutoPlay
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('imageWidth' in $$props) $$invalidate(1, imageWidth = $$props.imageWidth);
    		if ('imageSpacing' in $$props) $$invalidate(2, imageSpacing = $$props.imageSpacing);
    		if ('speed' in $$props) $$invalidate(3, speed = $$props.speed);
    		if ('controlColor' in $$props) $$invalidate(4, controlColor = $$props.controlColor);
    		if ('controlScale' in $$props) $$invalidate(5, controlScale = $$props.controlScale);
    		if ('autoplay' in $$props) $$invalidate(11, autoplay = $$props.autoplay);
    		if ('autoplaySpeed' in $$props) $$invalidate(12, autoplaySpeed = $$props.autoplaySpeed);
    		if ('displayControls' in $$props) $$invalidate(6, displayControls = $$props.displayControls);
    		if ('interval' in $$props) interval = $$props.interval;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		images,
    		imageWidth,
    		imageSpacing,
    		speed,
    		controlColor,
    		controlScale,
    		displayControls,
    		rotateLeft,
    		rotateRight,
    		startAutoPlay,
    		stopAutoPlay,
    		autoplay,
    		autoplaySpeed,
    		$$scope,
    		slots
    	];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			images: 0,
    			imageWidth: 1,
    			imageSpacing: 2,
    			speed: 3,
    			controlColor: 4,
    			controlScale: 5,
    			autoplay: 11,
    			autoplaySpeed: 12,
    			displayControls: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*images*/ ctx[0] === undefined && !('images' in props)) {
    			console.warn("<Carousel> was created without expected prop 'images'");
    		}
    	}

    	get images() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageWidth() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageWidth(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageSpacing() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageSpacing(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get speed() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speed(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlColor() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlColor(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controlScale() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlScale(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplaySpeed() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplaySpeed(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayControls() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayControls(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Carouselv.svelte generated by Svelte v3.44.3 */

    const file$3 = "src/Carouselv.svelte";

    function create_fragment$3(ctx) {
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
    			attr_dev(input0, "class", "svelte-yshfei");
    			add_location(input0, file$3, 2, 8, 69);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "slider");
    			attr_dev(input1, "id", "item-2");
    			attr_dev(input1, "class", "svelte-yshfei");
    			add_location(input1, file$3, 3, 8, 132);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "slider");
    			attr_dev(input2, "id", "item-3");
    			attr_dev(input2, "class", "svelte-yshfei");
    			add_location(input2, file$3, 4, 8, 187);
    			if (!src_url_equal(img0.src, img0_src_value = "images/bass.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "card");
    			attr_dev(img0, "class", "svelte-yshfei");
    			add_location(img0, file$3, 7, 8, 320);
    			attr_dev(label0, "class", "card svelte-yshfei");
    			attr_dev(label0, "for", "item-1");
    			attr_dev(label0, "id", "card-1");
    			add_location(label0, file$3, 6, 8, 266);
    			if (!src_url_equal(img1.src, img1_src_value = "images/Dunk.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "card");
    			attr_dev(img1, "class", "svelte-yshfei");
    			add_location(img1, file$3, 10, 8, 438);
    			attr_dev(label1, "class", "card svelte-yshfei");
    			attr_dev(label1, "for", "item-2");
    			attr_dev(label1, "id", "card-2");
    			add_location(label1, file$3, 9, 8, 384);
    			if (!src_url_equal(img2.src, img2_src_value = "images/skateboard.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "card");
    			attr_dev(img2, "class", "svelte-yshfei");
    			add_location(img2, file$3, 13, 8, 556);
    			attr_dev(label2, "class", "card svelte-yshfei");
    			attr_dev(label2, "for", "item-3");
    			attr_dev(label2, "id", "card-3");
    			add_location(label2, file$3, 12, 8, 502);
    			attr_dev(div0, "class", "cards svelte-yshfei");
    			add_location(div0, file$3, 5, 4, 238);
    			attr_dev(div1, "class", "container svelte-yshfei");
    			add_location(div1, file$3, 1, 4, 37);
    			attr_dev(div2, "class", "carousel-container svelte-yshfei");
    			add_location(div2, file$3, 0, 0, 0);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carouselv', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carouselv> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Carouselv extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carouselv",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.44.3 */
    const file$2 = "src/Content.svelte";

    function create_fragment$2(ctx) {
    	let carouselv;
    	let t0;
    	let div18;
    	let h20;
    	let t2;
    	let div8;
    	let div1;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let h30;
    	let t5;
    	let p0;
    	let t7;
    	let div3;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let h31;
    	let t10;
    	let p1;
    	let t12;
    	let div5;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t13;
    	let h32;
    	let t15;
    	let p2;
    	let t17;
    	let div7;
    	let div6;
    	let img3;
    	let img3_src_value;
    	let t18;
    	let h33;
    	let t20;
    	let p3;
    	let t22;
    	let div9;
    	let h34;
    	let span0;
    	let t24;
    	let span1;
    	let t26;
    	let span2;
    	let t28;
    	let div10;
    	let h21;
    	let t30;
    	let challengev;
    	let t31;
    	let div11;
    	let h22;
    	let t33;
    	let votetoken;
    	let t34;
    	let div12;
    	let h23;
    	let t36;
    	let roadmapv;
    	let t37;
    	let div14;
    	let h24;
    	let t39;
    	let div13;
    	let tokenomics;
    	let t40;
    	let div15;
    	let h25;
    	let t42;
    	let teamcards;
    	let t43;
    	let div16;
    	let h26;
    	let t45;
    	let div17;
    	let h27;
    	let current;
    	carouselv = new Carouselv({ $$inline: true });
    	challengev = new Challengev({ $$inline: true });
    	votetoken = new VoteToken({ $$inline: true });
    	roadmapv = new Roadmapv2({ $$inline: true });
    	tokenomics = new Tokenomics({ $$inline: true });
    	teamcards = new TeamCards({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(carouselv.$$.fragment);
    			t0 = space();
    			div18 = element("div");
    			h20 = element("h2");
    			h20.textContent = "What We Provide";
    			t2 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			h30 = element("h3");
    			h30.textContent = "Skills Competition";
    			t5 = space();
    			p0 = element("p");
    			p0.textContent = "Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.";
    			t7 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t8 = space();
    			h31 = element("h3");
    			h31.textContent = "Earning Potential";
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.";
    			t12 = space();
    			div5 = element("div");
    			div4 = element("div");
    			img2 = element("img");
    			t13 = space();
    			h32 = element("h3");
    			h32.textContent = "NFT Collectibles";
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "Collect unique moments from talented creators. Winning challenge videos are minted into NFT collectibles that can be traded on our NFT marketplace.";
    			t17 = space();
    			div7 = element("div");
    			div6 = element("div");
    			img3 = element("img");
    			t18 = space();
    			h33 = element("h3");
    			h33.textContent = "NFT Marketplace";
    			t20 = space();
    			p3 = element("p");
    			p3.textContent = "Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters.";
    			t22 = space();
    			div9 = element("div");
    			h34 = element("h3");
    			span0 = element("span");
    			span0.textContent = "AllSkills";
    			t24 = text(" is powered by cryptocurrency, using ");
    			span1 = element("span");
    			span1.textContent = "future-proof blockchain & smart contract technology";
    			t26 = text(" to connect talented people and audiences, and foster skill development through competition, all while providing ");
    			span2 = element("span");
    			span2.textContent = "incentives for everyone involved.";
    			t28 = space();
    			div10 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Challenge System";
    			t30 = space();
    			create_component(challengev.$$.fragment);
    			t31 = space();
    			div11 = element("div");
    			h22 = element("h2");
    			h22.textContent = "AllSkills $Vote Token";
    			t33 = space();
    			create_component(votetoken.$$.fragment);
    			t34 = space();
    			div12 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Roadmap & Milestones";
    			t36 = space();
    			create_component(roadmapv.$$.fragment);
    			t37 = space();
    			div14 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Tokenomics";
    			t39 = space();
    			div13 = element("div");
    			create_component(tokenomics.$$.fragment);
    			t40 = space();
    			div15 = element("div");
    			h25 = element("h2");
    			h25.textContent = "The Team";
    			t42 = space();
    			create_component(teamcards.$$.fragment);
    			t43 = space();
    			div16 = element("div");
    			h26 = element("h2");
    			h26.textContent = "Partners";
    			t45 = space();
    			div17 = element("div");
    			h27 = element("h2");
    			h27.textContent = "News";
    			set_style(h20, "margin-left", "7%");
    			attr_dev(h20, "class", "svelte-15r7pse");
    			add_location(h20, file$2, 44, 4, 1326);
    			attr_dev(img0, "alt", "Handshake");
    			set_style(img0, "width", "100%");
    			if (!src_url_equal(img0.src, img0_src_value = "images/handshake.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$2, 47, 36, 1478);
    			attr_dev(div0, "class", "table-icon svelte-15r7pse");
    			add_location(div0, file$2, 47, 12, 1454);
    			attr_dev(h30, "class", "svelte-15r7pse");
    			add_location(h30, file$2, 48, 12, 1565);
    			attr_dev(p0, "class", "svelte-15r7pse");
    			add_location(p0, file$2, 49, 12, 1606);
    			attr_dev(div1, "class", "grid-item svelte-15r7pse");
    			add_location(div1, file$2, 46, 8, 1417);
    			attr_dev(img1, "alt", "Earnings");
    			set_style(img1, "width", "100%");
    			if (!src_url_equal(img1.src, img1_src_value = "images/earn.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$2, 52, 36, 1957);
    			attr_dev(div2, "class", "table-icon svelte-15r7pse");
    			add_location(div2, file$2, 52, 12, 1933);
    			attr_dev(h31, "class", "svelte-15r7pse");
    			add_location(h31, file$2, 53, 12, 2038);
    			attr_dev(p1, "class", "svelte-15r7pse");
    			add_location(p1, file$2, 54, 12, 2078);
    			attr_dev(div3, "class", "grid-item svelte-15r7pse");
    			add_location(div3, file$2, 51, 8, 1896);
    			attr_dev(img2, "alt", "Collectibles");
    			set_style(img2, "width", "100%");
    			if (!src_url_equal(img2.src, img2_src_value = "images/stamps.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$2, 57, 36, 2373);
    			attr_dev(div4, "class", "table-icon svelte-15r7pse");
    			add_location(div4, file$2, 57, 12, 2349);
    			attr_dev(h32, "class", "svelte-15r7pse");
    			add_location(h32, file$2, 58, 12, 2460);
    			attr_dev(p2, "class", "svelte-15r7pse");
    			add_location(p2, file$2, 59, 12, 2499);
    			attr_dev(div5, "class", "grid-item svelte-15r7pse");
    			add_location(div5, file$2, 56, 8, 2312);
    			attr_dev(img3, "alt", "Marketplace");
    			set_style(img3, "width", "100%");
    			if (!src_url_equal(img3.src, img3_src_value = "images/auction.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$2, 62, 36, 2740);
    			attr_dev(div6, "class", "table-icon svelte-15r7pse");
    			add_location(div6, file$2, 62, 12, 2716);
    			attr_dev(h33, "class", "svelte-15r7pse");
    			add_location(h33, file$2, 63, 12, 2827);
    			attr_dev(p3, "class", "svelte-15r7pse");
    			add_location(p3, file$2, 64, 12, 2865);
    			attr_dev(div7, "class", "grid-item svelte-15r7pse");
    			add_location(div7, file$2, 61, 8, 2679);
    			attr_dev(div8, "class", "table-content svelte-15r7pse");
    			add_location(div8, file$2, 45, 4, 1380);
    			set_style(span0, "color", "aqua");
    			add_location(span0, file$2, 68, 12, 3116);
    			set_style(span1, "background-color", "aqua");
    			set_style(span1, "color", "rgb(30,30,30)");
    			add_location(span1, file$2, 68, 91, 3195);
    			set_style(span2, "background-color", "aqua");
    			set_style(span2, "color", "rgb(30,30,30)");
    			add_location(span2, file$2, 68, 321, 3425);
    			attr_dev(h34, "class", "svelte-15r7pse");
    			add_location(h34, file$2, 68, 8, 3112);
    			attr_dev(div9, "class", "powered-by svelte-15r7pse");
    			add_location(div9, file$2, 67, 4, 3078);
    			attr_dev(h21, "class", "svelte-15r7pse");
    			add_location(h21, file$2, 71, 8, 3587);
    			attr_dev(div10, "id", "Challenge");
    			attr_dev(div10, "class", "section svelte-15r7pse");
    			add_location(div10, file$2, 70, 4, 3541);
    			set_style(h22, "text-align", "center");
    			attr_dev(h22, "class", "svelte-15r7pse");
    			add_location(h22, file$2, 75, 8, 3700);
    			attr_dev(div11, "id", "Stablecoin");
    			attr_dev(div11, "class", "section svelte-15r7pse");
    			add_location(div11, file$2, 74, 4, 3653);
    			attr_dev(h23, "class", "svelte-15r7pse");
    			add_location(h23, file$2, 79, 8, 3842);
    			attr_dev(div12, "id", "Roadmap");
    			attr_dev(div12, "class", "section svelte-15r7pse");
    			add_location(div12, file$2, 78, 4, 3798);
    			set_style(h24, "text-align", "center");
    			attr_dev(h24, "class", "svelte-15r7pse");
    			add_location(h24, file$2, 83, 8, 3957);
    			attr_dev(div13, "class", "section svelte-15r7pse");
    			add_location(div13, file$2, 84, 8, 4014);
    			attr_dev(div14, "id", "Tokenomics");
    			attr_dev(div14, "class", "section svelte-15r7pse");
    			add_location(div14, file$2, 82, 4, 3910);
    			attr_dev(h25, "class", "svelte-15r7pse");
    			add_location(h25, file$2, 89, 8, 4137);
    			attr_dev(div15, "id", "Team");
    			attr_dev(div15, "class", "section svelte-15r7pse");
    			add_location(div15, file$2, 88, 4, 4096);
    			set_style(h26, "margin-left", "7%");
    			attr_dev(h26, "class", "svelte-15r7pse");
    			add_location(h26, file$2, 93, 8, 4244);
    			attr_dev(div16, "id", "Partners");
    			set_style(div16, "width", "100%");
    			add_location(div16, file$2, 92, 4, 4194);
    			set_style(h27, "margin-left", "7%");
    			attr_dev(h27, "class", "svelte-15r7pse");
    			add_location(h27, file$2, 96, 8, 4348);
    			attr_dev(div17, "id", "News");
    			set_style(div17, "width", "100%");
    			add_location(div17, file$2, 95, 4, 4302);
    			attr_dev(div18, "class", "text-content svelte-15r7pse");
    			add_location(div18, file$2, 43, 0, 1294);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(carouselv, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div18, anchor);
    			append_dev(div18, h20);
    			append_dev(div18, t2);
    			append_dev(div18, div8);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img0);
    			append_dev(div1, t3);
    			append_dev(div1, h30);
    			append_dev(div1, t5);
    			append_dev(div1, p0);
    			append_dev(div8, t7);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div3, t8);
    			append_dev(div3, h31);
    			append_dev(div3, t10);
    			append_dev(div3, p1);
    			append_dev(div8, t12);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, img2);
    			append_dev(div5, t13);
    			append_dev(div5, h32);
    			append_dev(div5, t15);
    			append_dev(div5, p2);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, img3);
    			append_dev(div7, t18);
    			append_dev(div7, h33);
    			append_dev(div7, t20);
    			append_dev(div7, p3);
    			append_dev(div18, t22);
    			append_dev(div18, div9);
    			append_dev(div9, h34);
    			append_dev(h34, span0);
    			append_dev(h34, t24);
    			append_dev(h34, span1);
    			append_dev(h34, t26);
    			append_dev(h34, span2);
    			append_dev(div18, t28);
    			append_dev(div18, div10);
    			append_dev(div10, h21);
    			append_dev(div10, t30);
    			mount_component(challengev, div10, null);
    			append_dev(div18, t31);
    			append_dev(div18, div11);
    			append_dev(div11, h22);
    			append_dev(div11, t33);
    			mount_component(votetoken, div11, null);
    			append_dev(div18, t34);
    			append_dev(div18, div12);
    			append_dev(div12, h23);
    			append_dev(div12, t36);
    			mount_component(roadmapv, div12, null);
    			append_dev(div18, t37);
    			append_dev(div18, div14);
    			append_dev(div14, h24);
    			append_dev(div14, t39);
    			append_dev(div14, div13);
    			mount_component(tokenomics, div13, null);
    			append_dev(div18, t40);
    			append_dev(div18, div15);
    			append_dev(div15, h25);
    			append_dev(div15, t42);
    			mount_component(teamcards, div15, null);
    			append_dev(div18, t43);
    			append_dev(div18, div16);
    			append_dev(div16, h26);
    			append_dev(div18, t45);
    			append_dev(div18, div17);
    			append_dev(div17, h27);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carouselv.$$.fragment, local);
    			transition_in(challengev.$$.fragment, local);
    			transition_in(votetoken.$$.fragment, local);
    			transition_in(roadmapv.$$.fragment, local);
    			transition_in(tokenomics.$$.fragment, local);
    			transition_in(teamcards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carouselv.$$.fragment, local);
    			transition_out(challengev.$$.fragment, local);
    			transition_out(votetoken.$$.fragment, local);
    			transition_out(roadmapv.$$.fragment, local);
    			transition_out(tokenomics.$$.fragment, local);
    			transition_out(teamcards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(carouselv, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div18);
    			destroy_component(challengev);
    			destroy_component(votetoken);
    			destroy_component(roadmapv);
    			destroy_component(tokenomics);
    			destroy_component(teamcards);
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

    	const images = [
    		{ path: 'images/bass.jpg', id: 'image1' },
    		{ path: 'images/Dunk.jpg', id: 'image2' },
    		{
    			path: 'images/skateboard.jpg',
    			id: 'image3'
    		},
    		{ path: 'images/runner.jpg', id: 'image4' }
    	]; // {path: 'images/image6.jpg', id: 'image6'},

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TeamCards,
    		Roadmap,
    		Tokenomics,
    		Challenge,
    		Challengev,
    		VoteToken,
    		Roadmapv: Roadmapv2,
    		Carousel,
    		Carouselv,
    		images
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
    	let img0;
    	let img0_src_value;
    	let t21;
    	let img1;
    	let img1_src_value;
    	let t22;
    	let img2;
    	let img2_src_value;
    	let t23;
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
    			img0 = element("img");
    			t21 = space();
    			img1 = element("img");
    			t22 = space();
    			img2 = element("img");
    			t23 = space();
    			img3 = element("img");
    			t24 = space();
    			div6 = element("div");
    			img4 = element("img");
    			t25 = space();
    			h3 = element("h3");
    			h3.textContent = "AllSkills";
    			add_location(h40, file$1, 7, 12, 202);
    			attr_dev(a0, "href", "#Trailer");
    			attr_dev(a0, "class", "svelte-l7hg1f");
    			add_location(a0, file$1, 9, 20, 276);
    			attr_dev(li0, "class", "svelte-l7hg1f");
    			add_location(li0, file$1, 9, 16, 272);
    			attr_dev(a1, "href", "#Challenge");
    			attr_dev(a1, "class", "svelte-l7hg1f");
    			add_location(a1, file$1, 10, 20, 333);
    			attr_dev(li1, "class", "svelte-l7hg1f");
    			add_location(li1, file$1, 10, 16, 329);
    			attr_dev(a2, "href", "#Stablecoin");
    			attr_dev(a2, "class", "svelte-l7hg1f");
    			add_location(a2, file$1, 11, 20, 401);
    			attr_dev(li2, "class", "svelte-l7hg1f");
    			add_location(li2, file$1, 11, 16, 397);
    			attr_dev(a3, "href", "#Roadmap");
    			attr_dev(a3, "class", "svelte-l7hg1f");
    			add_location(a3, file$1, 12, 20, 469);
    			attr_dev(li3, "class", "svelte-l7hg1f");
    			add_location(li3, file$1, 12, 16, 465);
    			attr_dev(a4, "href", "#Tokenomics");
    			attr_dev(a4, "class", "svelte-l7hg1f");
    			add_location(a4, file$1, 13, 20, 526);
    			attr_dev(li4, "class", "svelte-l7hg1f");
    			add_location(li4, file$1, 13, 16, 522);
    			attr_dev(a5, "href", "#Team");
    			attr_dev(a5, "class", "svelte-l7hg1f");
    			add_location(a5, file$1, 14, 20, 589);
    			attr_dev(li5, "class", "svelte-l7hg1f");
    			add_location(li5, file$1, 14, 16, 585);
    			attr_dev(a6, "class", "svelte-l7hg1f");
    			add_location(a6, file$1, 15, 20, 640);
    			attr_dev(li6, "class", "svelte-l7hg1f");
    			add_location(li6, file$1, 15, 16, 636);
    			attr_dev(ul, "class", "col-content svelte-l7hg1f");
    			add_location(ul, file$1, 8, 12, 230);
    			attr_dev(div0, "class", "footer-col svelte-l7hg1f");
    			attr_dev(div0, "id", "links");
    			add_location(div0, file$1, 6, 8, 153);
    			add_location(h41, file$1, 19, 12, 753);
    			attr_dev(div1, "class", "col-content svelte-l7hg1f");
    			add_location(div1, file$1, 20, 12, 799);
    			attr_dev(div2, "class", "footer-col svelte-l7hg1f");
    			attr_dev(div2, "id", "register");
    			add_location(div2, file$1, 18, 8, 701);
    			add_location(h42, file$1, 26, 12, 986);
    			if (!src_url_equal(img0.src, img0_src_value = "images/email.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-l7hg1f");
    			add_location(img0, file$1, 28, 16, 1111);
    			if (!src_url_equal(img1.src, img1_src_value = "images/discord.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-l7hg1f");
    			add_location(img1, file$1, 29, 16, 1157);
    			if (!src_url_equal(img2.src, img2_src_value = "images/instagram.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-l7hg1f");
    			add_location(img2, file$1, 30, 16, 1205);
    			if (!src_url_equal(img3.src, img3_src_value = "images/twitter.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-l7hg1f");
    			add_location(img3, file$1, 31, 16, 1255);
    			attr_dev(div3, "class", "col-content svelte-l7hg1f");
    			set_style(div3, "display", "flex");
    			set_style(div3, "justify-content", "space-between");
    			add_location(div3, file$1, 27, 12, 1016);
    			attr_dev(div4, "class", "footer-col svelte-l7hg1f");
    			attr_dev(div4, "id", "connect");
    			add_location(div4, file$1, 25, 8, 935);
    			attr_dev(div5, "class", "footer-content svelte-l7hg1f");
    			add_location(div5, file$1, 5, 4, 115);
    			set_style(img4, "margin-right", "12px");
    			if (!src_url_equal(img4.src, img4_src_value = "images/logo-dark.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-l7hg1f");
    			add_location(img4, file$1, 36, 8, 1364);
    			attr_dev(h3, "class", "svelte-l7hg1f");
    			add_location(h3, file$1, 37, 8, 1436);
    			attr_dev(div6, "id", "logo");
    			attr_dev(div6, "class", "svelte-l7hg1f");
    			add_location(div6, file$1, 35, 4, 1339);
    			attr_dev(footer, "class", "footer svelte-l7hg1f");
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
    			append_dev(div3, img0);
    			append_dev(div3, t21);
    			append_dev(div3, img1);
    			append_dev(div3, t22);
    			append_dev(div3, img2);
    			append_dev(div3, t23);
    			append_dev(div3, img3);
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

    function create_fragment(ctx) {
    	let style;
    	let link0;
    	let link1;
    	let link2;
    	let t1;
    	let main;
    	let navbar;
    	let t2;
    	let hero;
    	let t3;
    	let content;
    	let t4;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	content = new Content({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "@font-face {\n\t\t\tfont-family: \"Oswald\";\n\t\t\tsrc: url(\"./fonts/Oswald-Regular.ttf\");\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Raleway\";\n\t\t\tsrc: url(\"./fonts/Raleway-Medium.ttf\");\n\t\t}\t\t\n\t\t@font-face {\n\t\t\tfont-family: \"BentonSans\";\n\t\t\tsrc: url(\"./fonts/BentonSans-Regular.otf\");\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"DINPro\";\n\t\t\tsrc: url(\"./fonts/DINPro.otf\");\n\t\t}\t\n\t\t@font-face {\n\t\t\tfont-family: \"Asphaltic\";\n\t\t\tsrc: url(\"./fonts/Asphaltic.ttf\");\n\t\t}\t\n\t";
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			t1 = space();
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t2 = space();
    			create_component(hero.$$.fragment);
    			t3 = space();
    			create_component(content.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    			add_location(style, file, 8, 1, 189);
    			attr_dev(link0, "rel", "preconnect");
    			attr_dev(link0, "href", "https://fonts.googleapis.com");
    			add_location(link0, file, 31, 1, 654);
    			attr_dev(link1, "rel", "preconnect");
    			attr_dev(link1, "href", "https://fonts.gstatic.com");
    			attr_dev(link1, "crossorigin", "");
    			add_location(link1, file, 32, 1, 715);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;1,100&family=Montserrat:wght@100;200;300&family=Open+Sans+Condensed:wght@300&family=Roboto:wght@100;300;400;500;700&family=Ultra&display=swap");
    			attr_dev(link2, "rel", "stylesheet");
    			add_location(link2, file, 33, 1, 785);
    			attr_dev(main, "class", "svelte-1n09gwf");
    			add_location(main, file, 36, 0, 1054);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, link2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t2);
    			mount_component(hero, main, null);
    			append_dev(main, t3);
    			mount_component(content, main, null);
    			append_dev(main, t4);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: noop,
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
    			detach_dev(style);
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(hero);
    			destroy_component(content);
    			destroy_component(footer);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, Hero, Content, Footer });
    	return [];
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

    return app;

})();
//# sourceMappingURL=bundle.js.map
