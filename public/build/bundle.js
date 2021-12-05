
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
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
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

    /* src\Navbar.svelte generated by Svelte v3.44.2 */

    const file$3 = "src\\Navbar.svelte";

    function create_fragment$3(ctx) {
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
    			add_location(img, file$3, 1, 4, 26);
    			attr_dev(rect, "width", "48");
    			attr_dev(rect, "height", "48");
    			attr_dev(rect, "fill", "white");
    			attr_dev(rect, "fill-opacity", "0");
    			attr_dev(rect, "class", "svelte-1xk5cw1");
    			add_location(rect, file$3, 5, 12, 258);
    			attr_dev(path0, "d", "M7.94977 11.9498H39.9498");
    			attr_dev(path0, "stroke", "white");
    			attr_dev(path0, "stroke-width", "4");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "class", "svelte-1xk5cw1");
    			add_location(path0, file$3, 6, 12, 332);
    			attr_dev(path1, "d", "M7.94977 23.9498H39.9498");
    			attr_dev(path1, "stroke", "white");
    			attr_dev(path1, "stroke-width", "4");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "class", "svelte-1xk5cw1");
    			add_location(path1, file$3, 7, 12, 461);
    			attr_dev(path2, "d", "M7.94977 35.9498H39.9498");
    			attr_dev(path2, "stroke", "white");
    			attr_dev(path2, "stroke-width", "4");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "class", "svelte-1xk5cw1");
    			add_location(path2, file$3, 8, 12, 590);
    			attr_dev(svg, "width", "48px");
    			attr_dev(svg, "height", "48px");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-1xk5cw1");
    			add_location(svg, file$3, 4, 8, 145);
    			attr_dev(button, "class", "hamburger svelte-1xk5cw1");
    			add_location(button, file$3, 3, 4, 86);
    			attr_dev(nav, "class", "navbar svelte-1xk5cw1");
    			add_location(nav, file$3, 0, 0, 0);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleClick() {
    	alert('clicked');
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Hero.svelte generated by Svelte v3.44.2 */

    const file$2 = "src\\Hero.svelte";

    function create_fragment$2(ctx) {
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
    	let div6;
    	let div5;
    	let p;
    	let t23;
    	let div4;
    	let input;
    	let t24;
    	let button;

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
    			li0.textContent = "Stick handles";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Ball juggling";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Trick shots";
    			t7 = space();
    			li3 = element("li");
    			li3.textContent = "Dribbling";
    			t9 = space();
    			li4 = element("li");
    			li4.textContent = "Piano playing";
    			t11 = space();
    			li5 = element("li");
    			li5.textContent = "Gymnists";
    			t13 = space();
    			li6 = element("li");
    			li6.textContent = "Guitar";
    			t15 = space();
    			li7 = element("li");
    			li7.textContent = "Billiards";
    			t17 = space();
    			li8 = element("li");
    			li8.textContent = "Parkour";
    			t19 = space();
    			li9 = element("li");
    			li9.textContent = "All Skills";
    			t21 = space();
    			div6 = element("div");
    			div5 = element("div");
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    			t23 = space();
    			div4 = element("div");
    			input = element("input");
    			t24 = space();
    			button = element("button");
    			button.textContent = "REGISTER NOW";
    			attr_dev(div0, "class", "content svelte-1pmapkf");
    			add_location(div0, file$2, 4, 8, 70);
    			attr_dev(li0, "class", "svelte-1pmapkf");
    			add_location(li0, file$2, 8, 20, 266);
    			attr_dev(li1, "class", "svelte-1pmapkf");
    			add_location(li1, file$2, 9, 20, 310);
    			attr_dev(li2, "class", "svelte-1pmapkf");
    			add_location(li2, file$2, 10, 20, 354);
    			attr_dev(li3, "class", "svelte-1pmapkf");
    			add_location(li3, file$2, 11, 20, 396);
    			attr_dev(li4, "class", "svelte-1pmapkf");
    			add_location(li4, file$2, 12, 20, 436);
    			attr_dev(li5, "class", "svelte-1pmapkf");
    			add_location(li5, file$2, 13, 20, 480);
    			attr_dev(li6, "class", "svelte-1pmapkf");
    			add_location(li6, file$2, 14, 20, 519);
    			attr_dev(li7, "class", "svelte-1pmapkf");
    			add_location(li7, file$2, 15, 20, 556);
    			attr_dev(li8, "class", "svelte-1pmapkf");
    			add_location(li8, file$2, 16, 20, 596);
    			set_style(li9, "color", "aqua");
    			set_style(li9, "font-weight", "600", 1);
    			attr_dev(li9, "class", "svelte-1pmapkf");
    			add_location(li9, file$2, 17, 20, 634);
    			attr_dev(ul, "class", "scroll-animation svelte-1pmapkf");
    			add_location(ul, file$2, 7, 16, 215);
    			attr_dev(div1, "class", "scrolling-content-mask svelte-1pmapkf");
    			add_location(div1, file$2, 6, 12, 161);
    			attr_dev(div2, "class", "scrolling-content svelte-1pmapkf");
    			add_location(div2, file$2, 5, 8, 116);
    			attr_dev(div3, "class", "left-content svelte-1pmapkf");
    			add_location(div3, file$2, 3, 3, 34);
    			attr_dev(p, "class", "svelte-1pmapkf");
    			add_location(p, file$2, 24, 12, 851);
    			attr_dev(input, "placeholder", "Sign up for our newsletter");
    			attr_dev(input, "class", "svelte-1pmapkf");
    			add_location(input, file$2, 26, 12, 1133);
    			attr_dev(button, "onclick", "alert('test')");
    			attr_dev(button, "class", "svelte-1pmapkf");
    			add_location(button, file$2, 27, 12, 1195);
    			attr_dev(div4, "class", "signup svelte-1pmapkf");
    			add_location(div4, file$2, 25, 8, 1099);
    			attr_dev(div5, "class", "description svelte-1pmapkf");
    			add_location(div5, file$2, 23, 8, 812);
    			attr_dev(div6, "class", "hero-split svelte-1pmapkf");
    			add_location(div6, file$2, 22, 4, 778);
    			attr_dev(section, "class", "hero svelte-1pmapkf");
    			add_location(section, file$2, 1, 0, 2);
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
    			append_dev(section, t21);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    			append_dev(div5, t23);
    			append_dev(div5, div4);
    			append_dev(div4, input);
    			append_dev(div4, t24);
    			append_dev(div4, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Content.svelte generated by Svelte v3.44.2 */

    const file$1 = "src\\Content.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let div3;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let div14;
    	let h2;
    	let t5;
    	let div13;
    	let div6;
    	let div5;
    	let h30;
    	let t7;
    	let p0;
    	let t9;
    	let div8;
    	let div7;
    	let h31;
    	let t11;
    	let p1;
    	let t13;
    	let div10;
    	let div9;
    	let h32;
    	let t15;
    	let p2;
    	let t17;
    	let div12;
    	let div11;
    	let h33;
    	let t19;
    	let p3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t1 = space();
    			div2 = element("div");
    			img2 = element("img");
    			t2 = space();
    			div3 = element("div");
    			img3 = element("img");
    			t3 = space();
    			div14 = element("div");
    			h2 = element("h2");
    			h2.textContent = "What We Provide";
    			t5 = space();
    			div13 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Test";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst";
    			t9 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Test";
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst";
    			t13 = space();
    			div10 = element("div");
    			div9 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Test";
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst";
    			t17 = space();
    			div12 = element("div");
    			div11 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Test";
    			t19 = space();
    			p3 = element("p");
    			p3.textContent = "test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst";
    			if (!src_url_equal(img0.src, img0_src_value = "images/runner.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-14yrc1a");
    			add_location(img0, file$1, 1, 22, 45);
    			attr_dev(div0, "class", "card svelte-14yrc1a");
    			add_location(div0, file$1, 1, 4, 27);
    			if (!src_url_equal(img1.src, img1_src_value = "images/Dunk.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-14yrc1a");
    			add_location(img1, file$1, 2, 22, 106);
    			attr_dev(div1, "class", "card svelte-14yrc1a");
    			add_location(div1, file$1, 2, 4, 88);
    			if (!src_url_equal(img2.src, img2_src_value = "images/runner.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-14yrc1a");
    			add_location(img2, file$1, 3, 22, 165);
    			attr_dev(div2, "class", "card svelte-14yrc1a");
    			add_location(div2, file$1, 3, 4, 147);
    			if (!src_url_equal(img3.src, img3_src_value = "images/runner.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-14yrc1a");
    			add_location(img3, file$1, 4, 22, 226);
    			attr_dev(div3, "class", "card svelte-14yrc1a");
    			add_location(div3, file$1, 4, 4, 208);
    			attr_dev(div4, "class", "content svelte-14yrc1a");
    			add_location(div4, file$1, 0, 0, 0);
    			attr_dev(h2, "class", "svelte-14yrc1a");
    			add_location(h2, file$1, 8, 4, 307);
    			attr_dev(h30, "class", "svelte-14yrc1a");
    			add_location(h30, file$1, 12, 16, 457);
    			add_location(p0, file$1, 13, 16, 488);
    			attr_dev(div5, "class", "grid-item-text");
    			add_location(div5, file$1, 11, 12, 411);
    			attr_dev(div6, "class", "grid-item svelte-14yrc1a");
    			add_location(div6, file$1, 10, 8, 374);
    			attr_dev(h31, "class", "svelte-14yrc1a");
    			add_location(h31, file$1, 18, 16, 710);
    			add_location(p1, file$1, 19, 16, 741);
    			attr_dev(div7, "class", "grid-item-text");
    			add_location(div7, file$1, 17, 12, 664);
    			attr_dev(div8, "class", "grid-item svelte-14yrc1a");
    			add_location(div8, file$1, 16, 8, 627);
    			attr_dev(h32, "class", "svelte-14yrc1a");
    			add_location(h32, file$1, 24, 16, 963);
    			add_location(p2, file$1, 25, 16, 994);
    			attr_dev(div9, "class", "grid-item-text");
    			add_location(div9, file$1, 23, 12, 917);
    			attr_dev(div10, "class", "grid-item svelte-14yrc1a");
    			add_location(div10, file$1, 22, 8, 880);
    			attr_dev(h33, "class", "svelte-14yrc1a");
    			add_location(h33, file$1, 30, 16, 1216);
    			add_location(p3, file$1, 31, 16, 1247);
    			attr_dev(div11, "class", "grid-item-text");
    			add_location(div11, file$1, 29, 12, 1170);
    			attr_dev(div12, "class", "grid-item svelte-14yrc1a");
    			add_location(div12, file$1, 28, 8, 1133);
    			attr_dev(div13, "class", "table-content svelte-14yrc1a");
    			add_location(div13, file$1, 9, 4, 337);
    			attr_dev(div14, "class", "text-content svelte-14yrc1a");
    			add_location(div14, file$1, 7, 0, 275);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, img0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, img1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, img2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, img3);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, h2);
    			append_dev(div14, t5);
    			append_dev(div14, div13);
    			append_dev(div13, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h30);
    			append_dev(div5, t7);
    			append_dev(div5, p0);
    			append_dev(div13, t9);
    			append_dev(div13, div8);
    			append_dev(div8, div7);
    			append_dev(div7, h31);
    			append_dev(div7, t11);
    			append_dev(div7, p1);
    			append_dev(div13, t13);
    			append_dev(div13, div10);
    			append_dev(div10, div9);
    			append_dev(div9, h32);
    			append_dev(div9, t15);
    			append_dev(div9, p2);
    			append_dev(div13, t17);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, h33);
    			append_dev(div11, t19);
    			append_dev(div11, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div14);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let hero;
    	let t1;
    	let content;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	content = new Content({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    			attr_dev(main, "class", "svelte-17gw0bu");
    			add_location(main, file, 8, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			mount_component(hero, main, null);
    			append_dev(main, t1);
    			mount_component(content, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(hero);
    			destroy_component(content);
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
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Navbar, Hero, Content, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
