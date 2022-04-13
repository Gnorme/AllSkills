var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Routes,
  prerender: () => prerender
});
module.exports = __toCommonJS(stdin_exports);
var import_index_4f192781 = require("../../chunks/index-4f192781.js");
var import_index_51131352 = require("../../chunks/index-51131352.js");
var NewsletterSignup_svelte_svelte_type_style_lang = "";
const css$g = {
  code: ".soft-mode input.svelte-1v0z8ns{border-color:white !important;color:white !important}.soft-mode button.svelte-1v0z8ns{border-color:white !important;color:white !important}.soft-mode input.svelte-1v0z8ns::placeholder{color:white !important}.signup.svelte-1v0z8ns{display:flex;width:100%}button.svelte-1v0z8ns{font-weight:500;padding-top:2rem;font-weight:500;padding-bottom:2rem;width:40%;letter-spacing:.1em;align-items:center;background-color:transparent;border:2px solid;background-image:none;text-align:center;cursor:pointer}input.svelte-1v0z8ns{padding-left:1.5rem;padding-right:1.5rem;padding-top:2rem;padding-bottom:2rem;font-size:1rem;background-color:transparent;width:60%;border:2px solid black;pointer-events:initial;cursor:pointer}@media screen and (max-width: 820px){input.svelte-1v0z8ns{padding-left:0.5rem;padding-right:0.5rem;padding-top:1rem;padding-bottom:1rem}}input.svelte-1v0z8ns::placeholder{color:var(--placeholder)}",
  map: null
};
const NewsletterSignup = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let { color } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  $$result.css.add(css$g);
  return `<form name="${"newsletter"}" data-netlify-honeypot="${"bot-field"}" method="${"POST"}" data-netlify="${"true"}" netlify class="${"signup svelte-1v0z8ns"}"><input type="${"hidden"}" name="${"form-name"}" value="${"newsletter"}" class="${"svelte-1v0z8ns"}">
    <input name="${"email"}" style="${"color: " + (0, import_index_4f192781.e)(color) + "; border-color: " + (0, import_index_4f192781.e)(color) + "; --placeholder: " + (0, import_index_4f192781.e)(color)}" placeholder="${"Sign up for our newsletter"}" class="${"svelte-1v0z8ns"}">
    <button style="${"color: " + (0, import_index_4f192781.e)(color) + "; border-color: " + (0, import_index_4f192781.e)(color)}" class="${"svelte-1v0z8ns"}">REGISTER NOW</button>
</form>`;
});
var Hero_svelte_svelte_type_style_lang = "";
const css$f = {
  code: `.soft-mode #hero.svelte-10651ky.svelte-10651ky{background-image:none !important;background-color:#ffa666}#socials.svelte-10651ky.svelte-10651ky{position:absolute;top:90%;z-index:10;color:white;font-family:"Oswald";font-size:24px;left:42%}#social-links.svelte-10651ky.svelte-10651ky{list-style:none;margin:0;cursor:pointer}.tooltip.svelte-10651ky.svelte-10651ky{display:none;position:absolute;padding:10px;width:150px;right:0px;font-size:1.5rem;background-color:rgb(34,34,34);color:white;font-family:"Oswald";overflow:hidden}#socials.svelte-10651ky:active .tooltip.svelte-10651ky,.tooltip.svelte-10651ky.svelte-10651ky:active{display:block}#socials.svelte-10651ky:hover .tooltip.svelte-10651ky,.tooltip.svelte-10651ky.svelte-10651ky:hover{display:block}#hero-logo.svelte-10651ky.svelte-10651ky{position:absolute;left:50%;transform:translateX(-50%);height:50%;max-width:100%;mix-blend-mode:soft-light}.scrolling-content.svelte-10651ky.svelte-10651ky{margin-left:10px;font-size:64px;height:64px;text-align:left;line-height:1;text-overflow:ellipsis;width:200px;white-space:nowrap;color:white}#socials.svelte-10651ky a.svelte-10651ky{color:var(--highlight)}.content.svelte-10651ky.svelte-10651ky{text-align:right;font-size:64px;line-height:64px;text-align:right;color:#ecf0f1;padding:0;white-space:nowrap;position:relative;display:inline-block;min-height:0;font-weight:600;overflow:hidden}.scrolling-content-mask.svelte-10651ky.svelte-10651ky{height:64px;overflow:hidden;position:relative;display:inline-block}.left-content.svelte-10651ky.svelte-10651ky{font-weight:500;margin:0px;height:64px;z-index:1;display:grid;grid-template-columns:48% 52%}#hero.svelte-10651ky.svelte-10651ky{position:relative;width:100%;height:100vh;display:grid;background-position:center;background-size:100% 100%;grid-template-columns:55% 45%;justify-content:space-between;align-items:center}@media screen and (max-width: 820px){.soft-mode #hero::before{background-image:none !important;background-color:#ffa666 !important}#hero.svelte-10651ky.svelte-10651ky::before{background-image:url('../images/mobile_hero.png')}#hero-logo.svelte-10651ky.svelte-10651ky{height:auto !important}#socials.svelte-10651ky.svelte-10651ky{display:table;margin-left:auto;margin-right:auto;padding-bottom:20px;position:relative;left:0}#hero.svelte-10651ky.svelte-10651ky{display:flex;flex-direction:column;height:auto;align-items:center;justify-content:center;min-height:100vh}.description.svelte-10651ky.svelte-10651ky{display:table-cell;text-align:center;padding:20px}.left-content.svelte-10651ky.svelte-10651ky{padding-top:100px;width:100%;display:flex;flex-direction:column;height:auto}.scrolling-content.svelte-10651ky.svelte-10651ky{margin-top:20px\r
        }.content.svelte-10651ky.svelte-10651ky{text-align:center}.scroll-animation.svelte-10651ky.svelte-10651ky{text-align:center !important}}.description.svelte-10651ky.svelte-10651ky{position:relative;font-weight:400;width:90%;height:auto}.hero-split.svelte-10651ky.svelte-10651ky{color:white}p.svelte-10651ky.svelte-10651ky{font-size:1.6rem;line-height:2.25rem;display:inline;float:left;margin:0}.scroll-animation.svelte-10651ky.svelte-10651ky{min-height:150px;max-height:150px;margin:0px;padding:0px;background-size:contain;font-size:64px;margin-top:0;position:relative;text-align:left;list-style:none;animation:svelte-10651ky-change 3.5s cubic-bezier(0.5, 0.2, 0.5, 1.0) 0.5s 1 normal forwards;-webkit-animation:svelte-10651ky-change 3.5s cubic-bezier(0.8, 0.3, 0.3, 1.0) 0.5s 1 normal forwards}.scroll-animation.svelte-10651ky li.svelte-10651ky{margin:0}@-webkit-keyframes svelte-10651ky-opacity{0%,100%{opacity:0}50%{opacity:1}}@-webkit-keyframes svelte-10651ky-change{100%{margin-top:-2688px}}@keyframes svelte-10651ky-opacity{0%,100%{opacity:0}50%{opacity:1}}@keyframes svelte-10651ky-change{100%{margin-top:-2694px}}.soft-mode #hero::before{background-image:none !important;background-color:#ffa666}@media screen and (max-width: 820px){.soft-mode #hero::before{background-image:none !important;background-color:#ffa666 !important}#hero.svelte-10651ky.svelte-10651ky::before{background-image:url('images/mobile_hero.png')}#hero-logo.svelte-10651ky.svelte-10651ky{height:auto !important}#socials.svelte-10651ky.svelte-10651ky{display:table;margin-left:auto;margin-right:auto;padding-bottom:20px;position:relative;left:0}#hero.svelte-10651ky.svelte-10651ky{display:flex;flex-direction:column;height:auto;align-items:center;justify-content:center;min-height:100vh}.description.svelte-10651ky.svelte-10651ky{display:table-cell;text-align:center;padding:20px}.left-content.svelte-10651ky.svelte-10651ky{padding-top:100px;display:flex;flex-direction:column;height:auto}.scrolling-content.svelte-10651ky.svelte-10651ky{margin-top:20px\r
        }.content.svelte-10651ky.svelte-10651ky{text-align:center}.scroll-animation.svelte-10651ky.svelte-10651ky{text-align:center !important}}`,
  map: null
};
const Hero = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
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
  $$result.css.add(css$f);
  $$unsubscribe_t();
  return `<div style="${"background-image:url('images/tags_hero_bg.png')"}" id="${"hero"}" class="${"svelte-10651ky"}"><img loading="${"lazy"}" alt="${"AllSkills logo"}" id="${"hero-logo"}" src="${"images/logo-border-2.png"}" class="${"svelte-10651ky"}">
   <div class="${"left-content svelte-10651ky"}"><div class="${"content svelte-10651ky"}">${(0, import_index_4f192781.e)($t("en.home.hero.title"))}</div>
        <div class="${"scrolling-content svelte-10651ky"}"><div class="${"scrolling-content-mask svelte-10651ky"}"><ul class="${"scroll-animation svelte-10651ky"}">${(0, import_index_4f192781.d)(skills, (skill) => {
    return `<li class="${"svelte-10651ky"}">${(0, import_index_4f192781.e)(skill)}</li>`;
  })}
                    <li style="${"color:var(--highlight); font-weight: 600 !important; font-family:'Bebas Neue'; margin-top:11px;"}" class="${"svelte-10651ky"}">AllSkills</li></ul></div></div></div>
    <div class="${"hero-split svelte-10651ky"}"><div class="${"description svelte-10651ky"}"><p style="${"margin-bottom:2rem; color: white !important;"}" class="${"svelte-10651ky"}">${(0, import_index_4f192781.e)($t("en.home.hero.description_start"))} <span style="${"color:var(--highlight)"}">${(0, import_index_4f192781.e)($t("en.home.hero.description_highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.hero.description_end"))}</p>
            ${(0, import_index_4f192781.v)(NewsletterSignup, "NewsletterSignup").$$render($$result, { color: "white" }, {}, {})}</div></div>
    <div id="${"socials"}" class="${"svelte-10651ky"}"><div class="${"tooltip svelte-10651ky"}"><ul id="${"social-links"}" class="${"svelte-10651ky"}"><a href="${"https://twitter.com/@AllSkillsNFT"}" class="${"svelte-10651ky"}">Twitter</a>
                <a href="${"https://www.instagram.com/AllSkillsNFT/"}" class="${"svelte-10651ky"}">Instagram</a>
                <a href="${"https://www.tiktok.com/@allskillsnft"}" class="${"svelte-10651ky"}">TikTok</a>
                <a href="${"https://www.facebook.com/AllSkillsNFT"}" class="${"svelte-10651ky"}">Facebook</a></ul></div>
          <span>Check us out <a class="${"svelte-10651ky"}">@AllSkillsNFT</a></span></div>
    
    
</div>`;
});
var Table_svelte_svelte_type_style_lang = "";
const css$e = {
  code: '@media screen and (max-width: 820px){.table-content.svelte-1dxsl2{display:block !important;border:2px solid aqua !important}h3.svelte-1dxsl2{font-size:2.5rem !important}.grid-item.svelte-1dxsl2{grid-template:"a b b"\n                "c c c"\n                "c c c" !important;padding:1.25rem !important;grid-template-columns:0.5fr 1fr !important;border:2px solid aqua !important}.table-icon.svelte-1dxsl2{width:75% !important;padding:0 !important}}.highlight.svelte-1dxsl2{color:var(--highlight)}h3.svelte-1dxsl2{font-size:3rem;margin-top:0;margin-block-start:0;margin-block-end:0;font-weight:500;font-family:var(--headerFont);grid-area:b}p.svelte-1dxsl2{font-size:1.2rem;line-height:1.5rem;font-weight:400;font-family:"Lato";padding-top:2.5rem;margin-block-start:0;grid-area:c}.table-icon.svelte-1dxsl2{align-items:center;grid-area:a;display:grid;padding-right:2rem}.grid-item.svelte-1dxsl2{display:grid;grid-template:"a b b"\n            "a c c"\n            "a c c";grid-template-columns:0.35fr 1fr;padding:2rem;border:3px solid aqua;background-size:100% 100%;background-repeat:no-repeat}.soft-mode .table-content, .soft-mode .grid-item{border:none !important}.soft-mode .table-content.svelte-1dxsl2{background-color:white;box-shadow:0px 2px 10px rgba(0,0,0,0.3)}.soft-mode div.svelte-1dxsl2{border-radius:30px !important;background-image:none !important}.table-content.svelte-1dxsl2{display:grid;margin-left:auto;margin-right:auto;max-width:1180px;margin-top:3rem;margin-bottom:3rem;border:3px solid aqua;grid-template-columns:repeat(2,minmax(0,1fr))}',
  map: null
};
const Table = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  let softTableIcons = [
    "handshake_soft.png",
    "earn_soft.png",
    "stamps_soft.png",
    "ambassador_soft.png"
  ];
  $$result.css.add(css$e);
  $$unsubscribe_t();
  return `<section id="${"About"}"><h2 class="${"section-title"}" style="${"text-decoration-line: none; -webkit-text-decoration-line:none"}">What We Provide</h2>
    <div class="${"table-content svelte-1dxsl2"}" id="${"Table"}"><div class="${"grid-item svelte-1dxsl2"}" style="${"background-image: url('../images/tags_hero_bg.png')"}"><div class="${"table-icon svelte-1dxsl2"}"><img alt="${"Handshake"}" style="${"width:100%"}" src="${"images/" + (0, import_index_4f192781.e)(softTableIcons[0])}"></div>
            <h3 class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.title1"))}</h3>
            <p class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p1_start"))} <span class="${"highlight svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p1_highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.table.p1_end"))}</p></div>
        <div class="${"grid-item svelte-1dxsl2"}" style="${"background-image: url('../images/tags_hero_bg.png')"}"><div class="${"table-icon svelte-1dxsl2"}"><img alt="${"Earnings"}" style="${"width:100%"}" src="${"images/" + (0, import_index_4f192781.e)(softTableIcons[1])}"></div>
            <h3 class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.title2"))}</h3>
            <p class="${"svelte-1dxsl2"}"><span class="${"highlight svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p2_start"))}</span> ${(0, import_index_4f192781.e)($t("en.home.table.p2_middle"))} <span class="${"highlight svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p2_highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.table.p2_end"))}</p></div>
        <div class="${"grid-item svelte-1dxsl2"}" style="${"background-image: url('../images/tags_hero_bg.png')"}"><div class="${"table-icon svelte-1dxsl2"}"><img alt="${"Collectibles"}" style="${"width:100%"}" src="${"images/" + (0, import_index_4f192781.e)(softTableIcons[2])}"></div>
            <h3 class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.title3"))}</h3>
            <p class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p3_start"))} <span class="${"highlight svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p3_highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.table.p3_end"))}</p></div>
        <div class="${"grid-item svelte-1dxsl2"}" style="${"background-image: url('../images/tags_hero_bg.png')"}"><div class="${"table-icon svelte-1dxsl2"}"><img alt="${"Marketplace"}" style="${"width:100%"}" src="${"images/" + (0, import_index_4f192781.e)(softTableIcons[3])}"></div>
            <h3 class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.title4"))}</h3>
            <p class="${"svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p4_start"))} <span class="${"highlight svelte-1dxsl2"}">${(0, import_index_4f192781.e)($t("en.home.table.p4_highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.table.p4_end"))}</p></div></div>
</section>`;
});
var Challenge_svelte_svelte_type_style_lang = "";
const css$d = {
  code: `.soft-mode .first span.svelte-182gcez.svelte-182gcez{color:blueviolet !important}.soft-mode .first.svelte-182gcez .title.svelte-182gcez{background-image:linear-gradient(gold,gold) !important}.soft-mode .second.svelte-182gcez .title.svelte-182gcez{background-image:linear-gradient(blueviolet, blueviolet) !important}.soft-mode .second span.svelte-182gcez.svelte-182gcez{color:blueviolet !important}.soft-mode .info-card{border-radius:20px;padding:20px;box-shadow:0px 2px 10px rgba(0,0,0,0.1);display:block !important}.soft-mode h3.svelte-182gcez.svelte-182gcez,.info-card.svelte-182gcez p.svelte-182gcez{color:white}.info-card.svelte-182gcez.svelte-182gcez{background-size:0 !important;display:contents}#resButton.svelte-182gcez.svelte-182gcez{position:absolute;background-color:blueviolet;border-radius:20px;color:white;border:none;font-family:'Bebas Neue';padding:10px;top:330px;left:80px;z-index:11;box-shadow:0px 0px 15px 5px #0ff}.shake.svelte-182gcez.svelte-182gcez{animation:svelte-182gcez-shake 1.8s cubic-bezier(.36,.07,.19,.97) infinite;transform:translate3d(0, 0, 0)}.open{animation:svelte-182gcez-shakefast 0.5s linear;animation-iteration-count:4}@keyframes svelte-182gcez-shake{0%,70%{transform:translate3d(-1px, 0, 0)}5%,60%{transform:translate3d(2px, 0, 0)}10%,30%,50%{transform:translate3d(-4px, 0, 0)}15%,40%{transform:translate3d(4px, 0, 0)}70%,100%{transform:translate3d(0, 0, 0)}}@keyframes svelte-182gcez-shakefast{0%{transform:translate(1px, 1px) rotate(0deg)}10%{transform:translate(-1px, -2px) rotate(-1deg)}20%{transform:translate(-3px, 0px) rotate(1deg)}30%{transform:translate(3px, 2px) rotate(0deg)}40%{transform:translate(1px, -1px) rotate(1deg)}50%{transform:translate(-1px, 2px) rotate(-1deg)}60%{transform:translate(-3px, 1px) rotate(0deg)}70%{transform:translate(3px, 1px) rotate(-1deg)}80%{transform:translate(-1px, -1px) rotate(1deg)}90%{transform:translate(1px, 2px) rotate(0deg)}100%{transform:translate(1px, -2px) rotate(-1deg)}}#doneModal.svelte-182gcez.svelte-182gcez{position:absolute;background-color:rgba(0,0,0,0.5) !important;width:250px;top:-58px;left:125px;z-index:10;height:390px}#winModal.svelte-182gcez.svelte-182gcez{position:absolute;background-color:rgba(0,0,0,0.5) !important;background-position-y:center !important;background-size:contain !important;background:url('../images/win_screen.png');background-repeat:no-repeat;border-radius:20px;width:250px;top:-110px;left:125px;z-index:11;height:490px}.title.svelte-182gcez.svelte-182gcez{background-size:0% 5px}.tooltips.svelte-182gcez.svelte-182gcez{position:absolute;width:100%;height:100%;top:0}.extra-info.svelte-182gcez.svelte-182gcez{position:absolute;display:inline-block;width:100px;font-size:13px;font-weight:300;text-align:right}.info-left.svelte-182gcez.svelte-182gcez{text-align:left;width:100px;left:400px}#music.svelte-182gcez.svelte-182gcez{top:-20%}#effects.svelte-182gcez.svelte-182gcez{top:23%}#gifs.svelte-182gcez.svelte-182gcez{top:-20%}#crop.svelte-182gcez.svelte-182gcez{margin-top:30px}#name.svelte-182gcez.svelte-182gcez{top:12%}#tags.svelte-182gcez.svelte-182gcez{top:28%;width:25%}#tags.svelte-182gcez p.svelte-182gcez{margin-block-end:0.4rem;margin-block-start:0.4rem}h3.svelte-182gcez.svelte-182gcez{font-size:2rem;padding-bottom:10px;font-family:"Oswald";text-decoration:none;background-position:0% 100%;background-size:0% 2px;background-repeat:no-repeat}.first.svelte-182gcez.svelte-182gcez{order:1;margin-left:-25px}.second.svelte-182gcez.svelte-182gcez{order:2}.content.svelte-182gcez p.svelte-182gcez{font-size:1.2rem;line-height:1.8rem;font-weight:300}.content.svelte-182gcez.svelte-182gcez{flex:0 0 50%}.image.svelte-182gcez.svelte-182gcez{flex:0 0 50%;width:50%;position:relative}.phone.svelte-182gcez.svelte-182gcez{position:relative;top:-125px;left:100px;width:300px}.challenge-container.svelte-182gcez.svelte-182gcez{max-width:1220px;margin-left:auto;margin-right:auto;display:flex;width:85%;margin-bottom:80px;flex-direction:column}.info-section.svelte-182gcez.svelte-182gcez{display:flex;gap:50px;margin-top:250px;height:500px}@media screen and (max-width: 820px){.info-section.svelte-182gcez.svelte-182gcez{width:100%;flex-direction:column;margin:0;gap:0;height:auto}.image.svelte-182gcez.svelte-182gcez{order:2 !important;width:auto;margin-top:30px;margin-right:auto;margin-left:auto}.phone.svelte-182gcez.svelte-182gcez{top:0;left:0}#doneModal.svelte-182gcez.svelte-182gcez{top:68px;left:25px}#winModal.svelte-182gcez.svelte-182gcez{top:15px;left:25px}.second.svelte-182gcez.svelte-182gcez{order:1}.first.svelte-182gcez.svelte-182gcez{order:1;margin-left:auto}.tooltips.svelte-182gcez.svelte-182gcez{display:none}}`,
  map: null
};
const Challenge = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$d);
  $$unsubscribe_t();
  return `<section id="${"Challenge"}"><h2 class="${"section-title"}" style="${"text-decoration-color: var(--firstColor); -webkit-text-decoration-color: var(--firstColor)"}">Challenge System</h2>
    <div class="${"challenge-container svelte-182gcez"}"><div class="${"info-section svelte-182gcez"}"><div class="${"image first svelte-182gcez"}"><img alt="${"Edit videos"}" class="${"phone svelte-182gcez"}" src="${"images/challenge_edit.png"}">
                <div class="${"tooltips svelte-182gcez"}" style="${"color:var(--firstColor); "}"><p id="${"music"}" class="${"extra-info svelte-182gcez"}"><span style="${"text-decoration:underline; color:white;"}" class="${"svelte-182gcez"}">Music</span><br>Users will get to chose from a variety of song clips to add to their videos</p>
                    <p id="${"filters"}" class="${"extra-info svelte-182gcez"}"><span style="${"text-decoration:underline;color:white;"}" class="${"svelte-182gcez"}">Filters</span><br>Users will have access to a number of filters to put over their videos</p>
                    <p id="${"effects"}" class="${"extra-info svelte-182gcez"}"><span style="${"text-decoration:underline;color:white;"}" class="${"svelte-182gcez"}">Effects</span><br>A number of video effects will be available to enhance the quality of the users videos.</p>
                    <p id="${"gifs"}" class="${"extra-info info-left svelte-182gcez"}"><span style="${"text-decoration:underline;color:white;"}" class="${"svelte-182gcez"}">GIFs</span><br>To add a unique touch to your trickshots, add a GIF for a built-in reaction to the users skills.</p>
                    <p id="${"crop"}" class="${"extra-info info-left svelte-182gcez"}"><span style="${"text-decoration:underline;color:white;"}" class="${"svelte-182gcez"}">Crop</span><br>To cut and crop their videos, users are invited to use the trimming feature.</p></div></div>
            <div class="${"content second svelte-182gcez"}"><div style="${"background-color: var(--firstColor);"}" class="${"info-card svelte-182gcez"}"><h3 class="${"title svelte-182gcez"}" style="${"background-image: linear-gradient(var(--firstColor), var(--firstColor));"}">${(0, import_index_4f192781.e)($t("en.home.challenges.videos.title"))}</h3>
                <p class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.videos.pStart"))} <span style="${"color:var(--firstColor);"}" class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.videos.highlighted"))}</span>${(0, import_index_4f192781.e)($t("en.home.challenges.videos.pEnd"))}</p></div></div></div>
        <div class="${"info-section svelte-182gcez"}"><div class="${"image second svelte-182gcez"}"><img alt="${"Upload videos"}" class="${"phone svelte-182gcez"}" src="${"images/challenge_upload.png"}">
                <div class="${"tooltips svelte-182gcez"}" style="${"color:var(--secondColor)"}"><p id="${"music"}" class="${"extra-info info-left svelte-182gcez"}">Users will have the option to save their video to their camera roll.</p>
                    <p id="${"name"}" class="${"extra-info info-left svelte-182gcez"}">Choose a unique name for your trickshot.</p>
                    <div id="${"tags"}" class="${"extra-info info-left svelte-182gcez"}"><p class="${"svelte-182gcez"}">By adding SkillsTags to each video, users will be able to increase their reach and voting results.</p>
                        <p class="${"svelte-182gcez"}">Users will be able to use this area to search for or create their own SkillsTags for their video.</p>
                        <p class="${"svelte-182gcez"}">A total of 6 SkillsTags will be listed and added to each video.</p></div></div></div>
            <div class="${"content first svelte-182gcez"}"><div class="${"info-card svelte-182gcez"}" style="${"background-color: var(--secondColor);"}"><h3 class="${"title svelte-182gcez"}" style="${"background-image: linear-gradient(var(--secondColor),var(--secondColor));"}">${(0, import_index_4f192781.e)($t("en.home.challenges.challenges.title"))}</h3>
                <p class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.challenges.pStart"))}  <span style="${"color:var(--secondColor);"}" class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.challenges.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.challenges.challenges.pEnd"))}</p></div></div></div>
        <div class="${"info-section svelte-182gcez"}"><div class="${"image first svelte-182gcez"}"><img alt="${"Users vote for winner"}" class="${"phone svelte-182gcez"}" src="${"images/challenge_current.png"}">
                <div class="${"tooltips svelte-182gcez"}" style="${"color:var(--thirdColor)"}"><p id="${"music"}" class="${"extra-info svelte-182gcez"}">Users will see freezeframe of the 2 videos and they can tap on the Play button to watch each video.</p></div></div>
            <div class="${"content second svelte-182gcez"}"><div class="${"info-card svelte-182gcez"}" style="${"background-color: var(--thirdColor);"}"><h3 class="${"title svelte-182gcez"}" style="${"background-image: linear-gradient(blueviolet,blueviolet);"}">${(0, import_index_4f192781.e)($t("en.home.challenges.votes.title"))}</h3>
                <p class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.votes.pStart"))} <span style="${"color:blueviolet;"}" class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.votes.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.challenges.votes.pEnd"))}</p></div></div></div>
        <div class="${"info-section svelte-182gcez"}"><div class="${"image second svelte-182gcez"}"><div id="${"winModal"}" style="${"display:none;"}" class="${"svelte-182gcez"}"></div>
                <div id="${"doneModal"}" class="${"svelte-182gcez"}"><button class="${"shake svelte-182gcez"}" id="${"resButton"}">View Results</button></div>
                <img alt="${"Rewards"}" class="${"phone svelte-182gcez"}" src="${"images/challenge_win.png"}"></div>
            <div class="${"content first svelte-182gcez"}"><div class="${"info-card svelte-182gcez"}" style="${"background-color: var(--fourthColor);"}"><h3 class="${"title svelte-182gcez"}" style="${"background-image: linear-gradient(gold,gold);"}">${(0, import_index_4f192781.e)($t("en.home.challenges.earn.title"))}</h3>
                <p class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.earn.pStart"))}<span style="${"color: gold;"}" class="${"svelte-182gcez"}">${(0, import_index_4f192781.e)($t("en.home.challenges.earn.highlighted"))}</span></p></div></div></div></div>
</section>`;
});
var Tokens_svelte_svelte_type_style_lang = "";
const css$c = {
  code: `.soft-mode #Tokens.svelte-fqgk3v.svelte-fqgk3v{padding-top:400px;color:var(--fourthColor);background-size:cover;background-repeat:no-repeat}#Tokens.svelte-fqgk3v.svelte-fqgk3v{background-size:0}.column-header.svelte-fqgk3v.svelte-fqgk3v{background:white;color:rgb(30,30,30);border-radius:40px;width:90%;text-align:center;margin-bottom:30px;margin-left:auto;margin-right:auto}.soft.svelte-fqgk3v.svelte-fqgk3v{display:none}.soft-mode .soft.svelte-fqgk3v.svelte-fqgk3v{display:block !important}.soft-mode .hard.svelte-fqgk3v.svelte-fqgk3v{display:none}.section.svelte-fqgk3v:hover h3.svelte-fqgk3v{text-decoration-line:underline;text-decoration-color:gold;-webkit-text-decoration-line:underline;-webkit-text-decoration-color:gold}#value.svelte-fqgk3v.svelte-fqgk3v{font-family:'Oswald';grid-area:value;color:var(--highlight)}.highlight.svelte-fqgk3v.svelte-fqgk3v{color:var(--highlight)}.middle.svelte-fqgk3v.svelte-fqgk3v{display:flex;flex-direction:column;align-items:center;justify-content:center;grid-area:middle;margin-left:auto;margin-right:auto}h3.svelte-fqgk3v.svelte-fqgk3v{margin:0;font-size:1.75vw;font-weight:400;font-family:"Oswald";color:var(--baseText)}.section.svelte-fqgk3v p.svelte-fqgk3v{margin-left:42px;font-family:"Lato";font-size:1.25vw;line-height:1.5vw;font-weight:400}.soft-mode .section p.svelte-fqgk3v.svelte-fqgk3v{background-color:white;border-radius:15px;font-size:1.2rem !important;padding:15px}.section.svelte-fqgk3v img.svelte-fqgk3v{float:left;margin-right:10px;width:32px;height:32px}.section.svelte-fqgk3v .title.svelte-fqgk3v{margin-right:-7%;display:inline-flex;align-items:center}h1.svelte-fqgk3v.svelte-fqgk3v{color:aqua;font:"Lato"}.column.svelte-fqgk3v.svelte-fqgk3v{width:80%}.vote-container.svelte-fqgk3v.svelte-fqgk3v{max-width:1220px;margin-top:100px;padding-bottom:100px;margin-left:auto;margin-right:auto;display:grid;min-height:525px;margin-bottom:200px;margin-left:auto;margin-right:auto;grid-template-columns:1fr 1.25fr 1fr !important;justify-content:space-evenly;grid-template:"left middle right"
            "left middle right"
            "left middle right"
            "left middle right";grid-auto-flow:column}@media screen and (min-width: 1920px){p.svelte-fqgk3v.svelte-fqgk3v{font-size:1rem !important}}@media screen and (max-width: 820px){.vote-container.svelte-fqgk3v.svelte-fqgk3v{display:flex;flex-direction:column;height:auto;width:90%;max-height:100%}.column.svelte-fqgk3v.svelte-fqgk3v{width:100%}p.svelte-fqgk3v.svelte-fqgk3v{font-size:1rem !important;line-height:1.5rem !important}h3.svelte-fqgk3v.svelte-fqgk3v{font-size:1.75rem !important}}span.svelte-fqgk3v.svelte-fqgk3v{font-family:"Montserrat", sans-serif}.jump.svelte-fqgk3v.svelte-fqgk3v{animation:svelte-fqgk3v-jump 1.5s infinite ease}@keyframes svelte-fqgk3v-jump{0%{top:0}50%{top:-15px}100%{top:0}}.coin.svelte-fqgk3v.svelte-fqgk3v{margin:auto;position:relative;bottom:0;left:0;right:0;top:50px;height:300px;width:150px}.coin.svelte-fqgk3v .front.svelte-fqgk3v{position:absolute;height:150px;width:150px;background:#ffbd0b;border-radius:50%;border-top:7px solid #ffd84c;border-left:7px solid #ffd84c;border-right:7px solid #d57e08;border-bottom:7px solid #d57e08;transform:rotate(44deg)}.coin.svelte-fqgk3v .front.svelte-fqgk3v:before{content:"";margin:35.5px 35.5px;position:absolute;width:70px;height:70px;background:#f0a608;border-radius:50%;border-bottom:5px solid #ffd84c;border-right:5px solid #ffd84c;border-left:5px solid #d57e08;border-top:5px solid #d57e08;z-index:2}.coin.svelte-fqgk3v .front .currency.svelte-fqgk3v,.coin.svelte-fqgk3v .back .currency.svelte-fqgk3v{overflow:hidden;position:absolute;color:#ffbd0b;font-size:32px;transform:rotate(-44deg);line-height:4.5;width:97%;height:99%;text-align:center;text-shadow:0 3px 0 #cb7407;z-index:3;border-radius:50%}.currency.svelte-fqgk3v.svelte-fqgk3v{background-repeat:no-repeat;background-size:30%;background-position:center}.coin.svelte-fqgk3v .front .currency.svelte-fqgk3v:after,.coin.svelte-fqgk3v .back .currency.svelte-fqgk3v:after{content:"";position:absolute;height:210px;width:40px;margin:20px -65px;box-shadow:50px -23px 0 -10px rgba(255, 255, 255, 0.22), 85px -10px 0 -16px rgba(255, 255, 255, 0.19);transform:rotate(-50deg);animation:svelte-fqgk3v-shine 1.5s infinite ease}@keyframes svelte-fqgk3v-shine{0%{margin:20px -65px}50%{margin:45px -75px}100%{margin:20px -65px}}.coin.svelte-fqgk3v .front .shapes.svelte-fqgk3v,.coin.svelte-fqgk3v .back .shapes.svelte-fqgk3v{transform:rotate(-44deg);position:absolute;top:0;left:0;width:100%;height:100%}.coin.svelte-fqgk3v .front .shapes div.svelte-fqgk3v,.coin.svelte-fqgk3v .back .shapes div.svelte-fqgk3v{margin:63px 0px;font-size:20px;color:#cb7407}.coin.svelte-fqgk3v .front .shape_l.svelte-fqgk3v,.coin.svelte-fqgk3v .back .shape_l.svelte-fqgk3v{float:left}.coin.svelte-fqgk3v .front .shape_r.svelte-fqgk3v,.coin.svelte-fqgk3v .back .shape_r.svelte-fqgk3v{float:right}.coin.svelte-fqgk3v .front .top.svelte-fqgk3v,.coin.svelte-fqgk3v .back .top.svelte-fqgk3v{font-size:24px;color:#d67f08;text-align:center;width:100%;position:absolute;top:0;font-family:"Oswald";left:0}.coin.svelte-fqgk3v .front .bottom.svelte-fqgk3v,.coin.svelte-fqgk3v .back .bottom.svelte-fqgk3v{font-size:24px;color:#d67f08;text-align:center;width:100%;position:absolute;font-family:"Oswald";left:0;bottom:5px}.coin.svelte-fqgk3v .shadow.svelte-fqgk3v{width:100%;height:20px;background:rgba(0, 0, 0, 0.4);left:0;bottom:-50px;border-radius:50%;z-index:-1;margin:185px 7px 0 7px;animation:svelte-fqgk3v-swift 1.5s infinite ease}@keyframes svelte-fqgk3v-swift{0%{opacity:0.8}50%{opacity:0.4;transform:scale(0.8)}100%{opacity:0.8}}`,
  map: null
};
const Tokens = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$c);
  $$unsubscribe_t();
  return `<section id="${"Tokens"}" style="${"background-image: url('images/bluewaves.svg')"}" class="${"svelte-fqgk3v"}"><h2 class="${"section-title center"}" style="${"text-decoration-color: var(--fourthColor); -webkit-text-decoration-color: var(--fourthColor)"}">ALLSKILLS Token System</h2>
  <div class="${"vote-container svelte-fqgk3v"}"><div class="${"column-header svelte-fqgk3v"}"><h2 style="${"color:blueviolet"}">$VOTE Token</h2></div>
        <div class="${"section left svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img alt="${"Stable value"}" src="${"images/stable.png"}" class="${"svelte-fqgk3v"}">
              <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.stable.title"))}</h3></span>
          <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.stable.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.stable.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.vote.stable.pEnd"))}</p></div>
      <div class="${"section left svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img class="${"soft svelte-fqgk3v"}" alt="${"Vote"}" src="${"images/vote_soft.png"}">
            <img class="${"hard svelte-fqgk3v"}" alt="${"Vote"}" src="${"images/vote.png"}">
            <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.cast.title"))}</h3></span>
        <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.cast.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.cast.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.vote.cast.pEnd"))}</p></div>
        <div class="${"section left svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img class="${"soft svelte-fqgk3v"}" alt="${"Earnings"}" src="${"images/earnings_soft.png"}">
              <img class="${"hard svelte-fqgk3v"}" alt="${"Earnings"}" src="${"images/earnings.png"}">
              <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.win.title"))}</h3></span>
            <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.win.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.win.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.vote.win.pEnd"))}</p></div>
      <div class="${"column middle svelte-fqgk3v"}"><h1 id="${"value"}" class="${"svelte-fqgk3v"}">1 $Vote \u2248 $0.10</h1>
          <div class="${"coin svelte-fqgk3v"}"><div class="${"front jump svelte-fqgk3v"}"><div class="${"star svelte-fqgk3v"}"></div>
                <span class="${"currency svelte-fqgk3v"}" style="${"background-image:url('../images/logo-yellow-s.png')"}"></span>
                <div class="${"shapes svelte-fqgk3v"}"><div class="${"shape_l svelte-fqgk3v"}">10\xA2</div>
                  <div class="${"shape_r svelte-fqgk3v"}">10\xA2</div>
                  <span class="${"top svelte-fqgk3v"}">Vote</span>
                  <span class="${"bottom svelte-fqgk3v"}">Token</span></div></div>
              <div class="${"shadow svelte-fqgk3v"}"></div></div>
            
          </div>
      <div class="${"column-header svelte-fqgk3v"}"><h2 style="${"color:blueviolet"}">$SKILL Token</h2></div>
      <div class="${"section right svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img class="${"soft svelte-fqgk3v"}" alt="${"Stake"}" src="${"images/stake_soft.png"}">
            <img class="${"hard svelte-fqgk3v"}" alt="${"Stake"}" src="${"images/stake.png"}">
            <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.earn.title"))}</h3></span>
        <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.earn.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.earn.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.vote.earn.pEnd"))}</p></div>
          <div class="${"section right svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img class="${"soft svelte-fqgk3v"}" alt="${"Royalties"}" src="${"images/revenue_soft.png"}">
                <img class="${"hard svelte-fqgk3v"}" alt="${"Royalties"}" src="${"images/revenue.png"}">
                  <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.marketplace.title"))}</h3></span>
              <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.marketplace.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.marketplace.highlighted"))}</span> ${(0, import_index_4f192781.e)($t("en.home.vote.marketplace.pEnd"))}</p></div>
          <div class="${"section right svelte-fqgk3v"}"><span class="${"title svelte-fqgk3v"}"><img class="${"soft svelte-fqgk3v"}" alt="${"Replenish"}" src="${"images/replenish_soft.png"}">
                  <img class="${"hard svelte-fqgk3v"}" alt="${"Replenish"}" src="${"images/replenish.png"}">
                  <h3 class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.utility.title"))}</h3></span>
              <p class="${"svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.utility.pStart"))} <span class="${"highlight svelte-fqgk3v"}">${(0, import_index_4f192781.e)($t("en.home.vote.utility.highlighted"))}</span></p></div></div>
</section>`;
});
var NFT_svelte_svelte_type_style_lang = "";
const css$b = {
  code: `.soft-mode .info.svelte-afve9w.svelte-afve9w{border:none;overflow:hidden;border-radius:20px;color:white;box-shadow:2px 2px 10px rgba(0,0,0,0.3)}.soft-mode .right.svelte-afve9w.svelte-afve9w{background-color:#5497f0}.soft-mode #nft-info.svelte-afve9w.svelte-afve9w{margin-top:75px}.soft-mode .right.svelte-afve9w a.svelte-afve9w{color:gold}.soft-mode .right.svelte-afve9w h4.svelte-afve9w{font-family:'Varela'}.marker-highlight.svelte-afve9w.svelte-afve9w{background:url('../images/purple-brush4-v2.png');background-position:center;background-repeat:no-repeat;background-size:80% 80%}.soft-mode div.right.svelte-afve9w>.waves.svelte-afve9w{display:block !important;position:absolute !important;top:-50px;left:-250px;width:100%;transform:rotate(345deg)}.soft-mode .marker-highlight.svelte-afve9w.svelte-afve9w{background-position:center !important;background-repeat:no-repeat !important;background-size:70% 70% !important;background:url("../images/paint_splatter_notes.png")}.soft-mode .lines.svelte-afve9w.svelte-afve9w{display:none}#overlay.svelte-afve9w.svelte-afve9w{position:fixed;z-index:9;top:0;left:0;height:100vh;width:100%;opacity:0.6;background-color:#000;visibility:visible}.modal.svelte-afve9w.svelte-afve9w{padding:20px;z-index:10;max-width:300px;max-height:500px;top:50%;left:50%;transform:translate(-50%, -50%);border-radius:20px;position:fixed;background-color:rgb(34,34,34);display:block}h4.svelte-afve9w.svelte-afve9w{padding-left:20px;padding-right:20px;line-height:30px}.right.svelte-afve9w h4.svelte-afve9w{margin-top:0;margin-bottom:20px}.info.svelte-afve9w.svelte-afve9w{background-color:rgb(14,14,14);position:relative;margin-bottom:20px;text-align:center;box-shadow:0px 10px 5px 3px rgb(0,0,0,0.5)}.right.svelte-afve9w.svelte-afve9w{border:3px solid rgba(0,255,255,0.5);transform:translateX(290px)}ul.svelte-afve9w.svelte-afve9w{font-size:1.3rem;list-style:none;text-align:left;padding-inline-start:0}.image.svelte-afve9w.svelte-afve9w{flex:0 0 50%;width:50%;display:flex;justify-content:center;position:relative}.image.svelte-afve9w img.svelte-afve9w{position:relative;align-self:center;width:300px;box-shadow:0px 5px 10px rgba(0,0,0,0.5)}.blurred.svelte-afve9w.svelte-afve9w{filter:blur(20px)}.NFT-container.svelte-afve9w.svelte-afve9w{display:flex;max-width:1220px;margin-right:auto;margin-left:auto;width:100%;flex-direction:column}.nft-section.svelte-afve9w.svelte-afve9w{display:flex;gap:50px;margin-top:80px}.first.svelte-afve9w.svelte-afve9w{order:1;margin-left:-25px}.second.svelte-afve9w.svelte-afve9w{order:2}.content.svelte-afve9w.svelte-afve9w{flex:0 0 50%;overflow:hidden}a.svelte-afve9w.svelte-afve9w{color:blueviolet;text-decoration:underline;cursor:pointer}@media screen and (max-width: 820px){.soft-mode div.right.svelte-afve9w>svg.svelte-afve9w{left:-15% !important}.NFT-container.svelte-afve9w.svelte-afve9w{width:90%}.nft-section.svelte-afve9w.svelte-afve9w{width:100%;flex-direction:column;gap:0;height:auto}.modal.svelte-afve9w.svelte-afve9w{width:100% !important}.soft-mode .marker-highlight.svelte-afve9w.svelte-afve9w{padding-top:30px;padding-bottom:30px;background-size:100% 100% !important}.marker-highlight.svelte-afve9w.svelte-afve9w{background-size:100% 100% !important}.image.svelte-afve9w.svelte-afve9w{order:1 !important;width:auto;margin-top:30px;margin-bottom:30px;margin-right:auto;margin-left:auto}.image.svelte-afve9w img.svelte-afve9w{top:0;left:0;width:75%}.second.svelte-afve9w.svelte-afve9w{order:1}.first.svelte-afve9w.svelte-afve9w{order:1;margin-left:auto}}`,
  map: null
};
const NFT = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$b);
  $$unsubscribe_t();
  return `<section id="${"NFT"}"><h2 class="${"section-title"}" style="${"text-decoration-color: var(--thirdColor); -webkit-text-decoration-color: var(--thirdColor)"}">ALLSKILLS NFTs</h2>
    <div class="${"NFT-container svelte-afve9w"}"><div class="${"nft-section svelte-afve9w"}" style="${"margin-bottom:50px;"}"><div class="${"image first marker-highlight svelte-afve9w"}"><h1 style="${"position: absolute; top: 40%; z-index:2; font-size: 2rem; font-family: var(--headerFont); color: white;"}">Coming soon</h1>
                <img class="${"blurred svelte-afve9w"}" alt="${"NFT card"}" src="${"images/frame.png"}"></div>
            <div class="${"content second svelte-afve9w"}"><div class="${"info right svelte-afve9w"}"><svg class="${"waves svelte-afve9w"}" style="${"display:none;"}" viewBox="${"0 0 900 173"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M0 45.604L21.5 45.0841C43 44.4992 86 43.4594 128.8 39.235C171.7 35.0107 214.3 27.6019 257.2 20.778C300 13.9541 343 7.71508 385.8 3.68573C428.7 -0.343628 471.3 -2.03335 514.2 5.1155C557 12.2644 600 28.2518 642.8 28.8367C685.7 29.3566 728.3 14.409 771.2 8.36498C814 2.25596 857 5.11549 878.5 6.48027L900 7.91005V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V45.604Z"}" fill="${"#C62368"}"></path><path d="${"M0 30.0065L21.5 34.0359C43 38.0002 86 46.0589 128.8 50.6732C171.7 55.3524 214.3 56.6522 257.2 51.908C300 47.0988 343 36.3105 385.8 35.4006C428.7 34.5558 471.3 43.6543 514.2 48.6585C557 53.5977 600 54.5076 642.8 53.5327C685.7 52.5579 728.3 49.6983 771.2 48.5285C814 47.3587 857 47.7487 878.5 48.0086L900 48.2036V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V30.0065Z"}" fill="${"#DA3F67"}"></path><path d="${"M0 100.845L21.5 96.1659C43 91.5516 86 82.1931 128.8 78.9437C171.7 75.6942 214.3 78.5537 257.2 76.929C300 75.3043 343 69.1952 385.8 71.7948C428.7 74.3944 471.3 85.7026 514.2 84.7277C557 83.7529 600 70.495 642.8 65.4258C685.7 60.3566 728.3 63.3462 771.2 67.5705C814 71.7948 857 77.2539 878.5 79.9185L900 82.6481V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V100.845Z"}" fill="${"#EB5967"}"></path><path d="${"M0 106.694L21.5 105.589C43 104.55 86 102.34 128.8 105.524C171.7 108.644 214.3 117.093 257.2 121.512C300 125.996 343 126.386 385.8 125.411C428.7 124.436 471.3 122.097 514.2 116.573C557 111.048 600 102.34 642.8 103.77C685.7 105.199 728.3 116.638 771.2 118.262C814 119.887 857 111.698 878.5 107.539L900 103.445V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V106.694Z"}" fill="${"#FA7268"}"></path><path d="${"M0 169.915L21.5 170.964C43 171.951 86 174.049 128.8 171.026C171.7 168.064 214.3 160.043 257.2 155.848C300 151.59 343 151.22 385.8 152.146C428.7 153.071 471.3 155.292 514.2 160.537C557 165.781 600 174.049 642.8 172.692C685.7 171.334 728.3 160.475 771.2 158.933C814 157.39 857 165.164 878.5 169.113L900 173V129.194H878.5C857 129.194 814 129.194 771.2 129.194C728.3 129.194 685.7 129.194 642.8 129.194C600 129.194 557 129.194 514.2 129.194C471.3 129.194 428.7 129.194 385.8 129.194C343 129.194 300 129.194 257.2 129.194C214.3 129.194 171.7 129.194 128.8 129.194C86 129.194 43 129.194 21.5 129.194H0V169.915Z"}" fill="${"#FA7268"}"></path></svg>
                        <svg class="${"lines svelte-afve9w"}" viewBox="${"3 30 500.35 50.328"}" xmlns="${"http://www.w3.org/2000/svg"}"><polygon style="${"fill: var(--firstColor); opacity: 0.7;"}" points="${"70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"}"></polygon><polygon style="${"fill: var(--firstColor); opacity: 0.7;"}" points="${"120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"}"></polygon></svg>
                        <ul id="${"nft-info"}" class="${"svelte-afve9w"}"><li><h4 class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.1.pStart"))} <span style="${"color:blueviolet"}">${(0, import_index_4f192781.e)($t("en.home.nft.1.highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.nft.1.pEnd"))}</h4></li>
                            <li><h4 class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.2.pStart"))} <span style="${"color:blueviolet"}">${(0, import_index_4f192781.e)($t("en.home.nft.2.highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.nft.2.pEnd"))}</h4></li> 
                            <li><h4 class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.3.pStart"))} <span style="${"color:blueviolet"}">${(0, import_index_4f192781.e)($t("en.home.nft.3.highlight"))}</span></h4></li>  
                            <li><h4 class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.4.pStart"))} <span style="${"color:blueviolet"}">${(0, import_index_4f192781.e)($t("en.home.nft.4.highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.nft.4.pEnd"))}</h4></li></ul>
                        <h4 style="${"font-size: 0.8rem; line-height:normal;"}" class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.5.pStart"))} <a class="${"svelte-afve9w"}">${(0, import_index_4f192781.e)($t("en.home.nft.5.link"))}</a></h4></div></div></div>
        ${``}</div>
</section>`;
});
var GM_svelte_svelte_type_style_lang = "";
const css$a = {
  code: ".soft-mode .info.svelte-rnrs8k.svelte-rnrs8k{border:none;overflow:hidden;border-radius:20px;color:white;box-shadow:2px 2px 10px rgba(0,0,0,0.3)}.soft-mode .left.svelte-rnrs8k.svelte-rnrs8k{background-color:#FF9696}.soft-mode #gm-info.svelte-rnrs8k.svelte-rnrs8k{margin-bottom:90px}.soft-mode div.left.svelte-rnrs8k>svg.svelte-rnrs8k{display:block !important;position:absolute !important;bottom:-50px;left:-200px;width:100%;transform:rotate(15deg)}.soft-mode .lines.svelte-rnrs8k.svelte-rnrs8k{display:none}#overlay.svelte-rnrs8k.svelte-rnrs8k{position:fixed;z-index:9;top:0;left:0;height:100vh;width:100%;opacity:0.6;background-color:#000;visibility:visible}.modal.svelte-rnrs8k.svelte-rnrs8k{padding:20px;z-index:10;max-width:300px;max-height:500px;top:50%;left:50%;transform:translate(-50%, -50%);border-radius:20px;position:fixed;background-color:rgb(34,34,34);display:block}h4.svelte-rnrs8k.svelte-rnrs8k{padding-left:20px;padding-right:20px;line-height:30px}.left.svelte-rnrs8k h4.svelte-rnrs8k{margin-top:20px;margin-bottom:0px}.info.svelte-rnrs8k.svelte-rnrs8k{background-color:rgb(14,14,14);position:relative;margin-bottom:20px;text-align:center;box-shadow:0px 10px 5px 3px rgb(0,0,0,0.5)}.left.svelte-rnrs8k.svelte-rnrs8k{border:3px solid rgba(138,43,226,0.5);transform:translateX(-290px)}ul.svelte-rnrs8k.svelte-rnrs8k{font-size:1.3rem;text-align:left;list-style:none;padding-inline-start:0}.image.svelte-rnrs8k.svelte-rnrs8k{flex:0 0 50%;width:50%;display:flex;justify-content:center;position:relative}.image.svelte-rnrs8k img.svelte-rnrs8k{position:relative;align-self:center;width:500px}.GM-container.svelte-rnrs8k.svelte-rnrs8k{display:flex;max-width:1220px;margin-right:auto;margin-left:auto;width:100%;flex-direction:column}.GM-section.svelte-rnrs8k.svelte-rnrs8k{display:flex;gap:50px;margin-top:20px;margin-bottom:50px}.first.svelte-rnrs8k.svelte-rnrs8k{order:1;margin-left:-25px}.second.svelte-rnrs8k.svelte-rnrs8k{order:2}.content.svelte-rnrs8k.svelte-rnrs8k{flex:0 0 50%;overflow:hidden}@media screen and (max-width: 820px){.soft-mode div.left.svelte-rnrs8k>svg.svelte-rnrs8k{bottom:-40px !important;left:-15% !important}.GM-container.svelte-rnrs8k.svelte-rnrs8k{width:90%}.GM-section.svelte-rnrs8k.svelte-rnrs8k{width:100%;flex-direction:column;gap:0;height:auto}.modal.svelte-rnrs8k.svelte-rnrs8k{width:100% !important}.image.svelte-rnrs8k.svelte-rnrs8k{order:1 !important;width:auto;margin-top:30px;margin-bottom:30px;margin-right:auto;margin-left:auto}.image.svelte-rnrs8k img.svelte-rnrs8k{top:0;left:0;width:75%}.second.svelte-rnrs8k.svelte-rnrs8k{order:1}.first.svelte-rnrs8k.svelte-rnrs8k{order:1;margin-left:auto}}",
  map: null
};
const GM = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$a);
  $$unsubscribe_t();
  return `<section id="${"GM"}"><h2 class="${"section-title"}" style="${"text-decoration-color: var(--firstColor); -webkit-text-decoration-color: var(--firstColor)"}">GM Mode</h2>
    <div class="${"GM-container svelte-rnrs8k"}"><div class="${"GM-section svelte-rnrs8k"}"><div class="${"image second svelte-rnrs8k"}"><img src="${"images/gm_mode.png"}" class="${"svelte-rnrs8k"}"></div>
            <div class="${"content first svelte-rnrs8k"}"><div><div class="${"info left svelte-rnrs8k"}"><ul id="${"gm-info"}" class="${"svelte-rnrs8k"}"><li><h4 class="${"svelte-rnrs8k"}">${(0, import_index_4f192781.e)($t("en.home.gm.1.pStart"))} <span style="${"color:aqua"}">${(0, import_index_4f192781.e)($t("en.home.gm.1.highlight"))}</span></h4></li>
                                <li><h4 class="${"svelte-rnrs8k"}">${(0, import_index_4f192781.e)($t("en.home.gm.2.pStart"))} ${(0, import_index_4f192781.e)($t("en.home.gm.2.highlight"))} ${(0, import_index_4f192781.e)($t("en.home.gm.2.pEnd"))}</h4></li>
                                <li><h4 class="${"svelte-rnrs8k"}">${(0, import_index_4f192781.e)($t("en.home.gm.3.pStart"))} <span style="${"color:aqua"}">${(0, import_index_4f192781.e)($t("en.home.gm.3.highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.gm.3.pEnd"))}</h4></li>
                                <li><h4 class="${"svelte-rnrs8k"}">${(0, import_index_4f192781.e)($t("en.home.gm.4.pStart"))} <span style="${"color:aqua"}">${(0, import_index_4f192781.e)($t("en.home.gm.4.highlight"))}</span> ${(0, import_index_4f192781.e)($t("en.home.gm.4.pEnd"))}</h4></li></ul>
                            <svg class="${"waves svelte-rnrs8k"}" style="${"display:none; margin-top:80px;"}" viewBox="${"0 0 900 173"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M0 45.604L21.5 45.0841C43 44.4992 86 43.4594 128.8 39.235C171.7 35.0107 214.3 27.6019 257.2 20.778C300 13.9541 343 7.71508 385.8 3.68573C428.7 -0.343628 471.3 -2.03335 514.2 5.1155C557 12.2644 600 28.2518 642.8 28.8367C685.7 29.3566 728.3 14.409 771.2 8.36498C814 2.25596 857 5.11549 878.5 6.48027L900 7.91005V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V45.604Z"}" fill="${"#77AED7"}"></path><path d="${"M0 30.0065L21.5 34.0359C43 38.0002 86 46.0589 128.8 50.6732C171.7 55.3524 214.3 56.6522 257.2 51.908C300 47.0988 343 36.3105 385.8 35.4006C428.7 34.5558 471.3 43.6543 514.2 48.6585C557 53.5977 600 54.5076 642.8 53.5327C685.7 52.5579 728.3 49.6983 771.2 48.5285C814 47.3587 857 47.7487 878.5 48.0086L900 48.2036V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V30.0065Z"}" fill="${"#083B60"}"></path><path d="${"M0 100.845L21.5 96.1659C43 91.5516 86 82.1931 128.8 78.9437C171.7 75.6942 214.3 78.5537 257.2 76.929C300 75.3043 343 69.1952 385.8 71.7948C428.7 74.3944 471.3 85.7026 514.2 84.7277C557 83.7529 600 70.495 642.8 65.4258C685.7 60.3566 728.3 63.3462 771.2 67.5705C814 71.7948 857 77.2539 878.5 79.9185L900 82.6481V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V100.845Z"}" fill="${"#001E35"}"></path><path d="${"M0 106.694L21.5 105.589C43 104.55 86 102.34 128.8 105.524C171.7 108.644 214.3 117.093 257.2 121.512C300 125.996 343 126.386 385.8 125.411C428.7 124.436 471.3 122.097 514.2 116.573C557 111.048 600 102.34 642.8 103.77C685.7 105.199 728.3 116.638 771.2 118.262C814 119.887 857 111.698 878.5 107.539L900 103.445V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V106.694Z"}" fill="${"#001220"}"></path><path d="${"M0 169.915L21.5 170.964C43 171.951 86 174.049 128.8 171.026C171.7 168.064 214.3 160.043 257.2 155.848C300 151.59 343 151.22 385.8 152.146C428.7 153.071 471.3 155.292 514.2 160.537C557 165.781 600 174.049 642.8 172.692C685.7 171.334 728.3 160.475 771.2 158.933C814 157.39 857 165.164 878.5 169.113L900 173V129.194H878.5C857 129.194 814 129.194 771.2 129.194C728.3 129.194 685.7 129.194 642.8 129.194C600 129.194 557 129.194 514.2 129.194C471.3 129.194 428.7 129.194 385.8 129.194C343 129.194 300 129.194 257.2 129.194C214.3 129.194 171.7 129.194 128.8 129.194C86 129.194 43 129.194 21.5 129.194H0V169.915Z"}" fill="${"#001220"}"></path></svg>                    
                            <svg class="${"lines svelte-rnrs8k"}" style="${"margin-bottom:-6px; margin-right:-7px; z-index:-1;"}" viewBox="${"3 10 501.79 50.114"}" xmlns="${"http://www.w3.org/2000/svg"}"><polygon style="${"fill: var(--thirdColor); opacity: 0.7;"}" points="${"500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"}"></polygon><polygon style="${"fill: var(--thirdColor); opacity: 0.7;"}" points="${"352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"}"></polygon></svg></div></div></div></div>
        ${``}
        </div>
</section>`;
});
var Carousel_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ".svelte-1ki2tws.svelte-1ki2tws{box-sizing:border-box}@media screen and (max-width: 820px){.container.svelte-1ki2tws.svelte-1ki2tws{overflow-x:hidden}.carousel-container.svelte-1ki2tws.svelte-1ki2tws{width:100% !important}}.overlay-text.svelte-1ki2tws.svelte-1ki2tws{flex-grow:1;position:relative;z-index:10;font-size:2rem;font-family:'Oswald';color:white}.text-holder.svelte-1ki2tws.svelte-1ki2tws{display:flex;position:absolute;align-items:center;width:100%;height:100%;text-align:center}label.svelte-1ki2tws.svelte-1ki2tws{display:inline-table}.blurred.svelte-1ki2tws.svelte-1ki2tws{filter:blur(10px)}.carousel-container.svelte-1ki2tws.svelte-1ki2tws{width:75%;margin-right:auto;margin-left:auto}input[type=radio].svelte-1ki2tws.svelte-1ki2tws{display:none}.card.svelte-1ki2tws.svelte-1ki2tws{position:absolute;max-width:80%;height:300px;left:0;right:0;margin:auto;transition:transform .4s ease;cursor:pointer}.container.svelte-1ki2tws.svelte-1ki2tws{width:100%;max-width:800px;margin-left:auto;margin-right:auto;justify-content:center;display:flex}.cards.svelte-1ki2tws.svelte-1ki2tws{position:relative;width:100%;height:300px;margin-bottom:20px}img.svelte-1ki2tws.svelte-1ki2tws{width:100%;height:300px;border-radius:10px;object-fit:contain}#item-1:checked~.cards.svelte-1ki2tws #card-3.svelte-1ki2tws,#item-2:checked~.cards.svelte-1ki2tws #card-1.svelte-1ki2tws,#item-3:checked~.cards.svelte-1ki2tws #card-2.svelte-1ki2tws{transform:translatex(-40%) scale(.8);opacity:.4;z-index:0}#item-1:checked~.cards.svelte-1ki2tws #card-2.svelte-1ki2tws,#item-2:checked~.cards.svelte-1ki2tws #card-3.svelte-1ki2tws,#item-3:checked~.cards.svelte-1ki2tws #card-1.svelte-1ki2tws{transform:translatex(40%) scale(.8);opacity:.4;z-index:0}#item-1:checked~.cards.svelte-1ki2tws #card-1.svelte-1ki2tws,#item-2:checked~.cards.svelte-1ki2tws #card-2.svelte-1ki2tws,#item-3:checked~.cards.svelte-1ki2tws #card-3.svelte-1ki2tws{transform:translatex(0) scale(1);opacity:1;z-index:1}",
  map: null
};
const Carousel = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$9);
  return `<div class="${"carousel-container svelte-1ki2tws"}"><div class="${"container svelte-1ki2tws"}"><input type="${"radio"}" name="${"slider"}" id="${"item-1"}" checked class="${"svelte-1ki2tws"}">
        <input type="${"radio"}" name="${"slider"}" id="${"item-2"}" class="${"svelte-1ki2tws"}">
        <input type="${"radio"}" name="${"slider"}" id="${"item-3"}" class="${"svelte-1ki2tws"}">
    <div class="${"cards svelte-1ki2tws"}"><label class="${"card svelte-1ki2tws"}" for="${"item-1"}" id="${"card-1"}"><img src="${"images/Chris_Boucher.jpeg"}" alt="${"NFT Trading Card"}" class="${"svelte-1ki2tws"}"></label>
        <label class="${"card svelte-1ki2tws"}" for="${"item-2"}" id="${"card-2"}"><div class="${"text-holder svelte-1ki2tws"}"><h1 class="${"overlay-text svelte-1ki2tws"}">Coming soon</h1></div>
          <img class="${"blurred svelte-1ki2tws"}" src="${"images/Dunk.webp"}" alt="${"NFT Trading Card"}"></label>
        <label class="${"card svelte-1ki2tws"}" for="${"item-3"}" id="${"card-3"}"><div class="${"text-holder svelte-1ki2tws"}"><h1 class="${"overlay-text svelte-1ki2tws"}">Coming soon</h1></div>
          <img class="${"blurred svelte-1ki2tws"}" src="${"images/skateboard.webp"}" alt="${"NFT Trading Card"}"></label></div></div>
</div>`;
});
var Ambassador_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: `.full-highlight.svelte-1qamv2f{background:url(https://s2.svgbox.net/pen-brushes.svg?ic=brush-4&color=FF3333);background-position:center;background-repeat:no-repeat;padding:50px}.soft-mode #Ambassadors.svelte-1qamv2f{background-size:cover;background-repeat:no-repeat;padding-top:50px;margin-bottom:0}#Ambassadors.svelte-1qamv2f{background-size:0}.soft-mode .full-highlight.svelte-1qamv2f{background:none;border-radius:30px;margin:0;padding-bottom:500px;color:white}.soft-mode h4.svelte-1qamv2f{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif}.info-container.svelte-1qamv2f{text-align:center;overflow:hidden;margin-top:150px}h4.svelte-1qamv2f{font-size:30px;font-family:'Bebas Neue';animation-fill-mode:forwards;animation-timing-function:ease;animation-duration:1s;text-shadow:3px 5px rgba(0,0,0,0.5)}@keyframes svelte-1qamv2f-slidedown{to{transform:translateY(0)}}.ambassador-container.svelte-1qamv2f{width:100%;margin-bottom:150px;margin-left:auto;margin-right:auto}.slidedown{display:block;animation-name:svelte-1qamv2f-slidedown !important}h4.svelte-1qamv2f:nth-of-type(1){transform:translateY(-500px);animation-delay:0}h4.svelte-1qamv2f:nth-of-type(2){transform:translateY(-500px);animation-delay:1s !important}h4.svelte-1qamv2f:nth-of-type(3){transform:translateY(-500px);animation-delay:2s !important}h4.svelte-1qamv2f:nth-of-type(4){transform:translateY(-500px);animation-delay:3s}h4.svelte-1qamv2f:nth-of-type(5){transform:translateY(-500px);animation-delay:4s}@media screen and (max-width: 820px){.info-container.svelte-1qamv2f{margin-top:0px}.soft-mode .ambassador-info.svelte-1qamv2f{background:none;padding:0}.ambassador-info.svelte-1qamv2f{background:url(https://s2.svgbox.net/pen-brushes.svg?ic=brush-4&color=FF3333);background-size:100% 80%;background-position:center;background-repeat:no-repeat;padding:50px  20px}.full-highlight.svelte-1qamv2f{background:none}}`,
  map: null
};
const Ambassador = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$8);
  $$unsubscribe_t();
  return `<section id="${"Ambassadors"}" style="${"background-image: url('images/orangewaves_navy.svg')"}" class="${"svelte-1qamv2f"}"><h2 class="${"section-title"}" style="${"text-decoration-color: red; -webkit-text-decoration-color: red"}">Ambassador Challenge</h2>
    <div class="${"ambassador-container svelte-1qamv2f"}">${(0, import_index_4f192781.v)(Carousel, "Carousel").$$render($$result, {}, {}, {})}
        <div class="${"info-container full-highlight svelte-1qamv2f"}"><div class="${"ambassador-info svelte-1qamv2f"}"><h4 class="${"slidedown svelte-1qamv2f"}">${(0, import_index_4f192781.e)($t("en.home.ambassador.line1"))}</h4></div>
            <div class="${"ambassador-info svelte-1qamv2f"}"><h4 class="${"slidedown svelte-1qamv2f"}">${(0, import_index_4f192781.e)($t("en.home.ambassador.line2"))}</h4></div>
            <div class="${"ambassador-info svelte-1qamv2f"}"><h4 style="${"text-decoration: underline white; -webkit-text-decoration: underline white;"}" class="${"slidedown svelte-1qamv2f"}">${(0, import_index_4f192781.e)($t("en.home.ambassador.line3"))}</h4></div>
            </div></div>
</section>`;
});
var Tokenomics_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: '.highlight.svelte-kth7oo.svelte-kth7oo{color:#78FF78}.soft-mode .highlight.svelte-kth7oo.svelte-kth7oo{color:var(--highlight)}.soft-mode .tokenomics-container.svelte-kth7oo.svelte-kth7oo{color:#001E35}#notice.svelte-kth7oo.svelte-kth7oo{position:absolute;width:50%;text-align:center;bottom:-20%}#left-container.svelte-kth7oo.svelte-kth7oo{align-self:center}h2.svelte-kth7oo.svelte-kth7oo{font-family:"Oswald";font-size:2rem}p.svelte-kth7oo.svelte-kth7oo{font-size:1.2rem}.soft-mode #left-container.svelte-kth7oo p.svelte-kth7oo{color:#001E35 !important}path.svelte-kth7oo.svelte-kth7oo{stroke:rgb(34,34,34);stroke-width:2px;stroke-linejoin:round}#coin.svelte-kth7oo.svelte-kth7oo{position:absolute;width:50%;left:25%;top:25%;z-index:-1;transition-delay:1s;transition-timing-function:ease;transition:all 1.5s}.svg-container.svelte-kth7oo.svelte-kth7oo{text-align:center;margin-left:auto;margin-right:auto;width:80%;position:relative;max-width:500px}#tooltip.svelte-kth7oo.svelte-kth7oo{padding:5px;background-color:#141414}.team.svelte-kth7oo.svelte-kth7oo{fill:#003f5c}ul.svelte-kth7oo.svelte-kth7oo{list-style:none;font-size:1.2rem}.box.svelte-kth7oo.svelte-kth7oo{margin:-2px;border:2px solid gold}ul.svelte-kth7oo li.svelte-kth7oo:before{content:"\\2022";font-size:5rem;vertical-align:text-bottom;line-height:0.4em}span.svelte-kth7oo.svelte-kth7oo{font-weight:100;letter-spacing:0.5px;font-size:1.3rem;margin-left:10px !important;padding-right:10px}.team.svelte-kth7oo.svelte-kth7oo:before{color:white}.advisors.svelte-kth7oo.svelte-kth7oo:before{color:#8a2be2}.private.svelte-kth7oo.svelte-kth7oo:before{color:#FF3333}.public.svelte-kth7oo.svelte-kth7oo:before{color:#FFDD33}.liquidity.svelte-kth7oo.svelte-kth7oo:before{color:#4dFFFF}.foundation.svelte-kth7oo.svelte-kth7oo:before{color:#78FF78}li.svelte-kth7oo.svelte-kth7oo{list-style-type:none}.tokenomics-container.svelte-kth7oo.svelte-kth7oo{position:relative;display:flex;max-width:1220px;margin-left:auto;margin-right:auto;margin-top:-50px;margin-bottom:200px;justify-content:space-evenly}@media screen and (max-width: 820px){#notice.svelte-kth7oo.svelte-kth7oo{width:100%}#left-container.svelte-kth7oo.svelte-kth7oo{text-align:center}.tokenomics-container.svelte-kth7oo.svelte-kth7oo{flex-direction:column}.list.svelte-kth7oo.svelte-kth7oo{width:100% !important}.svg-container.svelte-kth7oo.svelte-kth7oo{width:100%}}',
  map: null
};
const Tokenomics = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<section id="${"Tokenomics"}"><h2 class="${"section-title center svelte-kth7oo"}" style="${"text-decoration-color: var(--firstColor); -webkit-text-decoration-color: var(--firstColor)"}">Tokenomics</h2>
    <div class="${"tokenomics-container svelte-kth7oo"}"><div class="${"list svelte-kth7oo"}" style="${"width:30%; display: flex;"}"><div id="${"left-container"}" class="${"svelte-kth7oo"}"><h2 class="${"svelte-kth7oo"}">10,000,000,000 $Skills Tokens</h2>
                <p class="${"svelte-kth7oo"}">With a max supply of 10,000,000,000 our <span class="${"highlight svelte-kth7oo"}">$Skills token</span> will be used for voting on how you think AllSkills should operate, getting access to our beta and early access to new features, entering raffles to earn exclusive prizes, staking to earn $Vote tokens, and paying gas fees.</p></div></div>
        <div class="${"svg-container svelte-kth7oo"}"><img alt="${"$Skills Token"}" id="${"coin"}" src="${"images/coin.png"}" class="${"svelte-kth7oo"}">
            <svg xmlns="${"http://www.w3.org/2000/svg"}" id="${"sv"}" viewBox="${"-50 -50 400 400"}"><path data-value="${"Team 10,000,000"}" id="${"0"}" class="${"test svelte-kth7oo"}" fill="${"#ffffff"}" d="${"M150, 0 A150,150 0 0 1 234.49594861401022,26.062779328328688 L206.33063240934013,67.3751862188858 A100,100 0 0 0 150,50 Z"}"></path><path data-value="${"Partners 10,000,000"}" id="${"1"}" fill="${"#8a2be2"}" d="${"M234.49594861401022, 26.062779328328688 A150,150 0 0 1 289.62924038982374,95.19420442908603 L243.0861602598825,113.46280295272402 A100,100 0 0 0 206.33063240934013,67.3751862188858 Z"}" class="${"svelte-kth7oo"}"></path><path data-value="${"Private Sale 15,000,000"}" id="${"2"}" fill="${"#FF3333"}" d="${"M289.62924038982374, 95.19420442908603 A150,150 0 0 1 279.9081736709546,224.99244237572935 L236.60544911396977,199.99496158381956 A100,100 0 0 0 243.0861602598825,113.46280295272402 Z"}" class="${"svelte-kth7oo"}"></path><path data-value="${"Public Sale 20,000,000"}" id="${"3"}" fill="${"#FFDD33"}" d="${"M279.9081736709546, 224.99244237572935 A150,150 0 0 1 127.65722030200284,298.32666717541645 L135.10481353466855,248.88444478361097 A100,100 0 0 0 236.60544911396977,199.99496158381956 Z"}" class="${"svelte-kth7oo"}"></path><path data-value="${"Liquidity Pool 15,000,000"}" id="${"4"}" fill="${"#00ddff"}" d="${"M127.65722030200284, 298.32666717541645 A150,150 0 0 1 3.7649754408533056,183.39637094334898 L52.50998362723553,172.26424729556598 A100,100 0 0 0 135.10481353466855,248.88444478361097 Z"}" class="${"svelte-kth7oo"}"></path><path data-value="${"Foundation 30,000,000"}" id="${"5"}" fill="${"#78FF78"}" d="${"M3.7649754408533056, 183.39637094334898 A150,150 0 0 1 149.97382006135282,0.000002284630625126738 L149.98254670756856,50.00000152308709 A100,100 0 0 0 52.50998362723553,172.26424729556598 Z"}" class="${"svelte-kth7oo"}"></path></svg>
            
            </div>
        <div class="${"list svelte-kth7oo"}" style="${"width:30%; display:flex;"}"><ul style="${"align-self:center;"}" class="${"svelte-kth7oo"}"><li class="${["team svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Team 10%</span></li>
                <li class="${["advisors svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Advisors &amp; Partners 10%</span></li>
                <li class="${["private svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Private Sale 15%</span></li>
                <li class="${["public svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Public Sale 20%</span></li>
                <li class="${["liquidity svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Liquidity Pool 15%</span></li>
                <li class="${["foundation svelte-kth7oo", ""].join(" ").trim()}"><span class="${"svelte-kth7oo"}">Foundation 30%</span></li></ul></div>
        <div id="${"notice"}" class="${"svelte-kth7oo"}">The presale is scheduled to take place a week before the launch of our beta. Beta access will be granted to users with $Skills tokens in their wallet. The public sale of the $Skills token is scheduled for 1 month after the release of our beta.</div></div>

    <div id="${"tooltip"}" display="${"none"}" style="${"position: absolute; display: none;"}" class="${"svelte-kth7oo"}"></div>
</section>`;
});
var TeamCards_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".card.svelte-ttmbh5 h2.svelte-ttmbh5{color:white}a.svelte-ttmbh5.svelte-ttmbh5{cursor:pointer}.hidden.svelte-ttmbh5.svelte-ttmbh5{max-height:0px !important;overflow:hidden !important}.selected.svelte-ttmbh5.svelte-ttmbh5{left:25% !important}.card.svelte-ttmbh5 .bgselected.svelte-ttmbh5::before{transition:border-width 0.25s linear !important;border-width:55px 0px 0px 5000px !important}.socials.svelte-ttmbh5.svelte-ttmbh5{display:flex;max-width:45%;justify-content:space-around}.socials-item.svelte-ttmbh5.svelte-ttmbh5{padding-left:2px;padding-right:2px;max-width:30%;align-self:center}.socials.svelte-ttmbh5 img.svelte-ttmbh5{display:block}.card.svelte-ttmbh5.svelte-ttmbh5{font-family:'Roboto', Arial, sans-serif;align-items:flex-start;overflow:hidden;margin:0 auto 20px auto;min-width:230px;max-width:280px;line-height:1.2em;border-radius:15px;background-color:#141414;transition:all 0.3s ease;box-shadow:0px 0px 7px 1px rgba(0,0,0,0.3)}.card.svelte-ttmbh5.svelte-ttmbh5:hover{box-shadow:0px 0px 15px 0px rgba(0, 238, 255, 0.2)}.card.svelte-ttmbh5 .svelte-ttmbh5{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:all 0.25s ease;transition:all 0.25s ease}.card.svelte-ttmbh5 img.svelte-ttmbh5{max-width:100%;vertical-align:top;opacity:0.85}.card.svelte-ttmbh5 figcaption.svelte-ttmbh5{padding:25px;padding-bottom:0px;position:relative;transition:all 0.25s ease !important}.card.svelte-ttmbh5 .slanted-bg.svelte-ttmbh5:before{position:absolute;content:'';bottom:100%;left:0;width:0;height:0;border-style:solid;border-width:55px 0 0 400px;border-color:transparent transparent transparent #141414;transition:border-width 0.25s ease !important}a.svelte-ttmbh5.svelte-ttmbh5:hover{opacity:1}.card.svelte-ttmbh5 .profile.svelte-ttmbh5{border-radius:50%;position:absolute;bottom:100%;z-index:1;left:25px;max-width:150px;opacity:1;box-shadow:0 0 15px rgba(0, 0, 0, 0.3)}.card.svelte-ttmbh5 h2.svelte-ttmbh5{margin:0 0 15px;font-size:1.4em;font-weight:300}.card.svelte-ttmbh5 h2 span.svelte-ttmbh5{display:block;font-size:0.6em;color:aqua}.card.svelte-ttmbh5 p.svelte-ttmbh5{margin:0 0 10px;font-size:0.9em;letter-spacing:1px;max-height:25em;overflow:auto;transition:max-height 0.25s, overflow 0.25s 0.25s !important;scrollbar-width:none;-ms-overflow-style:none}.card.svelte-ttmbh5.svelte-ttmbh5::-webkit-scrollbar{display:none}.cards-container.svelte-ttmbh5.svelte-ttmbh5{display:flex;margin-bottom:100px;max-width:1220px;margin-left:auto;margin-right:auto;width:90%;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;margin-top:100px}.more-info.svelte-ttmbh5.svelte-ttmbh5{padding:10px;background-color:transparent;border:2px solid;color:#ffffff;font-size:0.7em;text-transform:uppercase;display:inline-block;opacity:0.65;width:47%;text-align:center;text-decoration:none;font-weight:600;letter-spacing:1px;cursor:pointer}@media screen and (max-width: 1350px){.card.svelte-ttmbh5.svelte-ttmbh5{max-width:280px}.card.svelte-ttmbh5 h2.svelte-ttmbh5{font-size:1.1em}a.svelte-ttmbh5.svelte-ttmbh5{font-size:0.55rem}.card.svelte-ttmbh5 p.svelte-ttmbh5{font-size:0.8em}}",
  map: null
};
const TeamCards = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  const staff = [
    {
      id: 0,
      name: "Noah Goren",
      position: "Co-Founder",
      descr: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University\u2019s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah\u2019s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him. ",
      email: "ngoren@allskills.ca",
      twitter: "https://twitter.com/@NoGoren",
      linkedin: "https://www.linkedin.com/in/noahgoren/",
      img: "images/noah_s.png",
      bg: "aqua"
    },
    {
      id: 0,
      name: "Fran\xE7ois Sammut",
      position: "Co-Founder",
      descr: "A director, conceptualist and creative, Fran\xE7ois, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, Fran\xE7ois has learned from them all and applies this knowledge and passion to AllSkills.",
      email: "fsammut@allskills.ca",
      twitter: "https://twitter.com/@Sammut_frank",
      linkedin: "https://www.linkedin.com/in/fsammut/",
      img: "images/frank_s.png",
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
      img: "images/christopher_s.png",
      bg: "blueviolet"
    },
    {
      id: 0,
      name: "Charles Hamelin",
      position: "Co-Founder",
      descr: "A \uFB01ve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world\u2019s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers.",
      email: "chamelin@allskills.ca",
      twitter: "https://twitter.com/@Speedskater01",
      linkedin: "https://www.linkedin.com/in/charles-hamelin-70600816a/",
      img: "images/charles_s.png",
      bg: "gold"
    }
  ];
  let selected;
  let selectedFlip;
  $$result.css.add(css$6);
  {
    console.log(selectedFlip);
  }
  return `<section id="${"Team"}"><h2 class="${"section-title"}" style="${"text-decoration-color: var(--baseText); -webkit-text-decoration-color: var(--baseText)"}">The Team</h2>
  <div class="${"cards-container svelte-ttmbh5"}">${(0, import_index_4f192781.d)(staff, ({ name, position, descr, email, twitter, linkedin, img, bg }, i) => {
    return `<figure class="${"card svelte-ttmbh5"}">
          <div style="${"height:200px;"}" class="${"svelte-ttmbh5"}"><svg viewBox="${"-0.35 0 500.35 78.328"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-ttmbh5"}"><polygon style="${"fill: " + (0, import_index_4f192781.e)(bg) + ";"}" points="${"70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"}" class="${"svelte-ttmbh5"}"></polygon><polygon style="${"fill: " + (0, import_index_4f192781.e)(bg) + ";"}" points="${"120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"}" class="${"svelte-ttmbh5"}"></polygon></svg></div>
          <figcaption class="${["slanted-bg svelte-ttmbh5", selected === i ? "bgselected" : ""].join(" ").trim()}"><img${(0, import_index_4f192781.f)("src", img, 0)} alt="${"profile-sample4"}" style="${"border: 3px solid " + (0, import_index_4f192781.e)(bg)}" class="${["profile svelte-ttmbh5", selected === i ? "selected" : ""].join(" ").trim()}">
            <h2 class="${"svelte-ttmbh5"}">${(0, import_index_4f192781.e)(name)}<span class="${"svelte-ttmbh5"}">${(0, import_index_4f192781.e)(position)}</span></h2>
            <p class="${["svelte-ttmbh5", selected != i ? "hidden" : ""].join(" ").trim()}">${(0, import_index_4f192781.e)(descr)}</p>
            <div style="${"max-width:100%; display:flex; justify-content:space-around; max-height:60px; "}" class="${"svelte-ttmbh5"}"><div class="${"socials svelte-ttmbh5"}" style="${"width:45%"}"><div class="${"socials-item svelte-ttmbh5"}"><a${(0, import_index_4f192781.f)("href", twitter, 0)} class="${"twitter svelte-ttmbh5"}"><img alt="${"Twitter"}" src="${"images/twitter-aqua.png"}" class="${"svelte-ttmbh5"}"></a></div>
                  <div class="${"socials-item svelte-ttmbh5"}"><a href="${"mailto:" + (0, import_index_4f192781.e)(email)}" class="${"svelte-ttmbh5"}"><img${(0, import_index_4f192781.f)("alt", email, 0)} src="${"images/email-nocircle-aqua.png"}" class="${"svelte-ttmbh5"}"><a class="${"svelte-ttmbh5"}"></a>
                  </a></div>
                  <div class="${"socials-item svelte-ttmbh5"}"><a${(0, import_index_4f192781.f)("href", linkedin, 0)} class="${"svelte-ttmbh5"}"><img alt="${"LinkedIn"}" src="${"images/linkedin-aqua.png"}" class="${"svelte-ttmbh5"}"></a>
                  </div></div>
              ${selected === i ? `<button class="${"more-info svelte-ttmbh5"}" style="${"border-color: " + (0, import_index_4f192781.e)(bg)}"${(0, import_index_4f192781.f)("data-card-id", i, 0)}>Less Info</button>` : `<button class="${"more-info svelte-ttmbh5"}" style="${"border-color: " + (0, import_index_4f192781.e)(bg)}"${(0, import_index_4f192781.f)("data-card-id", i, 0)}>More Info</button>`}
          </div></figcaption>
          <svg viewBox="${"-1.79 0 501.79 94.114"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-ttmbh5"}"><polygon style="${"fill: " + (0, import_index_4f192781.e)(bg) + ";"}" points="${"500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"}" class="${"svelte-ttmbh5"}"></polygon><polygon style="${"fill: " + (0, import_index_4f192781.e)(bg)}" points="${"352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"}" class="${"svelte-ttmbh5"}"></polygon></svg>
        </figure>`;
  })}</div>
</section>`;
});
var Partners_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: `@media screen and (max-width: 820px){span.svelte-1gp5ozk.svelte-1gp5ozk{display:block !important}#partner-images.svelte-1gp5ozk.svelte-1gp5ozk{flex-direction:column;gap:60px}}.soft-mode #Partners.svelte-1gp5ozk.svelte-1gp5ozk{background-color:var(--bgColor)}#partner-images.svelte-1gp5ozk.svelte-1gp5ozk{display:flex;gap:60px;align-items:center;margin-bottom:100px}#partner-images.svelte-1gp5ozk img.svelte-1gp5ozk{height:100%}span.svelte-1gp5ozk.svelte-1gp5ozk{position:absolute;top:50px;right:30px;font-size:1.7rem;color:white;display:none;cursor:pointer}#submit.svelte-1gp5ozk.svelte-1gp5ozk{position:absolute;left:42px;bottom:25px;background-color:blueviolet;color:white;border:none;padding:10px;font-size:1.2rem;font-family:"Oswald"}.bottom.svelte-1gp5ozk.svelte-1gp5ozk{position:relative;bottom:-15px;left:20px}form.svelte-1gp5ozk.svelte-1gp5ozk{margin:20px;display:flex;font-size:1.2rem;flex-direction:column}.top.svelte-1gp5ozk.svelte-1gp5ozk{position:relative;top:-20px;left:-20px}select.svelte-1gp5ozk.svelte-1gp5ozk{background:url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;border:3px solid gold;background-color:white;min-width:150px;padding:10px;-webkit-appearance:none;-moz-appearance:none;appearance:none}input.svelte-1gp5ozk.svelte-1gp5ozk{border:3px solid blueviolet;padding:10px;min-width:220px}label.svelte-1gp5ozk.svelte-1gp5ozk{margin-bottom:10px;margin-top:10px;font-size:1.4rem;font-family:"Oswald"}textarea.svelte-1gp5ozk.svelte-1gp5ozk{width:100%;border:3px solid black;min-width:300px;max-width:100%;min-height:75px;max-height:200px}#overlay.svelte-1gp5ozk.svelte-1gp5ozk{position:fixed;z-index:9;top:0;left:0;height:100vh;width:100%;opacity:0.6;background-color:#000;visibility:visible}.modal.svelte-1gp5ozk.svelte-1gp5ozk{color:white;padding:20px;z-index:10;min-width:300px;max-width:500px;max-height:800px;overflow:hidden;top:50%;left:50%;transform:translate(-50%, -50%);border-radius:20px;position:fixed;background-color:rgb(34,34,34);display:block;padding-bottom:0px}#reach-out.svelte-1gp5ozk.svelte-1gp5ozk{background-color:blueviolet;font-family:'Bebas Neue';color:white;font-size:32px;margin-top:30px;padding:20px;border-radius:30px;border:none;cursor:pointer}#partner-form.svelte-1gp5ozk.svelte-1gp5ozk{display:none}#partner-container.svelte-1gp5ozk.svelte-1gp5ozk{padding-left:7%;padding-right:7%;background-color:white;margin-top:150px;padding-bottom:100px;padding-top:100px;color:black}h3.svelte-1gp5ozk.svelte-1gp5ozk{color:black}#partner-container.svelte-1gp5ozk h2.svelte-1gp5ozk{color:black}.soft-mode #partner-container.svelte-1gp5ozk h2.svelte-1gp5ozk{color:var(--headerColor)}`,
  map: null
};
const Partners = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$5);
  $$unsubscribe_t();
  return `<section id="${"Partners"}" class="${"svelte-1gp5ozk"}"><div id="${"partner-container"}" class="${"svelte-1gp5ozk"}"><h2 style="${"font-size:4rem; font-family:'Oswald'"}" class="${"svelte-1gp5ozk"}">Partners</h2>
        <div id="${"partner-images"}" class="${"svelte-1gp5ozk"}"><a href="${"https://vantagesports.ca/"}"><img alt="${"VantageSportsManagement"}" src="${"images/vantage_logo.png"}" class="${"svelte-1gp5ozk"}"></a>
            <a href="${"https://www.alliancemontreal.ca/"}"><img alt="${"MontrealAllianceBasketball"}" src="${"images/montreal_alliance.png"}" class="${"svelte-1gp5ozk"}"></a>
            <a href="${"https://www.instagram.com/charlyiacono/"}"><img alt="${"Charly Iacono"}" src="${"images/charly_iacono.png"}" class="${"svelte-1gp5ozk"}"></a>
            <a href="${"https://imaginereplay.com/"}"><img alt="${"ReplayNow"}" src="${"images/replay_logo.png"}" class="${"svelte-1gp5ozk"}"></a></div>
        <h3 style="${"font-size: 1.7rem; font-weight: 400;"}" class="${"svelte-1gp5ozk"}">${(0, import_index_4f192781.e)($t("en.home.partners.reach"))}</h3>
        <div><button id="${"reach-out"}" class="${"svelte-1gp5ozk"}">${(0, import_index_4f192781.e)($t("en.home.partners.buttonText"))}</button></div>
        <div id="${"partner-form"}" class="${"svelte-1gp5ozk"}"><form class="${"svelte-1gp5ozk"}"><label for="${"name"}" class="${"svelte-1gp5ozk"}">Test</label>
                <input name="${"name"}" class="${"svelte-1gp5ozk"}"></form></div>
        ${``}</div>
</section>`;
});
var Footer_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: '.soft-mode .soft.svelte-1fu8vze.svelte-1fu8vze{display:block !important}.soft-mode .hard.svelte-1fu8vze.svelte-1fu8vze{display:none !important}.soft.svelte-1fu8vze.svelte-1fu8vze{display:none}@media screen and (max-width: 820px){.footer-content.svelte-1fu8vze.svelte-1fu8vze{grid-template:"connect"\r\n            "register" !important;padding-top:2rem !important}#links.svelte-1fu8vze.svelte-1fu8vze{display:none}.footer.svelte-1fu8vze.svelte-1fu8vze{height:auto !important}#logo.svelte-1fu8vze.svelte-1fu8vze{display:flex !important;align-items:center;justify-content:center}.col-content.svelte-1fu8vze.svelte-1fu8vze{margin-top:0 !important;margin-bottom:10px !important}.col-content.svelte-1fu8vze a.svelte-1fu8vze{width:18% !important}}h4.svelte-1fu8vze.svelte-1fu8vze{font-size:1.2rem;color:black;margin-bottom:0}.soft-mode h4.svelte-1fu8vze.svelte-1fu8vze{color:white}.col-content.svelte-1fu8vze a.svelte-1fu8vze{width:25%;margin-left:5px}a.svelte-1fu8vze>img.svelte-1fu8vze{width:100%}#logo.svelte-1fu8vze.svelte-1fu8vze{display:none}#Contact.svelte-1fu8vze.svelte-1fu8vze{grid-area:connect}#register.svelte-1fu8vze.svelte-1fu8vze{grid-area:register}#links.svelte-1fu8vze.svelte-1fu8vze{grid-area:links}img.svelte-1fu8vze.svelte-1fu8vze{width:50%;margin-bottom:20px;margin-top:10px}.col-content.svelte-1fu8vze.svelte-1fu8vze{margin-top:3rem}li.svelte-1fu8vze.svelte-1fu8vze{text-decoration:underline black}a.svelte-1fu8vze.svelte-1fu8vze{color:black;font-weight:300}.soft-mode a.svelte-1fu8vze.svelte-1fu8vze{color:white !important}ul.svelte-1fu8vze.svelte-1fu8vze{list-style:none;margin:0px;padding:0px;text-align:left}.footer-col.svelte-1fu8vze.svelte-1fu8vze{margin-left:1rem;margin-right:1rem}.footer.svelte-1fu8vze a.svelte-1fu8vze{color:black}.footer.svelte-1fu8vze.svelte-1fu8vze{width:100%;height:400px;background-color:aqua;border-top:1px solid black}.soft-mode .footer.svelte-1fu8vze.svelte-1fu8vze{background-color:#001220;color:white}.footer-content.svelte-1fu8vze.svelte-1fu8vze{padding-top:5rem;margin-left:auto;margin-right:auto;max-width:80rem;display:grid;align-items:start;grid-template:"links register connect" auto / 0.8fr 3fr 0.8fr}',
  map: null
};
const Footer = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<footer class="${"footer svelte-1fu8vze"}"><div class="${"footer-content svelte-1fu8vze"}"><div class="${"footer-col svelte-1fu8vze"}" id="${"links"}"><h4 class="${"svelte-1fu8vze"}">Links</h4>
            <ul class="${"col-content svelte-1fu8vze"}"><li class="${"svelte-1fu8vze"}"><a href="${"#Trailer"}" class="${"svelte-1fu8vze"}">Trailer</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Table"}" class="${"svelte-1fu8vze"}">About</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Challenge"}" class="${"svelte-1fu8vze"}">Challenge System</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Vote"}" class="${"svelte-1fu8vze"}">Vote Token</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#NFT"}" class="${"svelte-1fu8vze"}">NFTs</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Ambassadors"}" class="${"svelte-1fu8vze"}">Ambassador Program</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Roadmap"}" class="${"svelte-1fu8vze"}">Roadmap</a></li>
                <li class="${"svelte-1fu8vze"}"><a href="${"#Tokenomics"}" class="${"svelte-1fu8vze"}">Tokenomics</a></li></ul></div>
        <div class="${"footer-col svelte-1fu8vze"}" id="${"register"}"><h4 id="${"links"}" class="${"svelte-1fu8vze"}">Newsletter Subscription</h4>
            <div class="${"col-content svelte-1fu8vze"}">${(0, import_index_4f192781.v)(NewsletterSignup, "NewsletterSignup").$$render($$result, { color: "black" }, {}, {})}</div></div>
        <div class="${"footer-col svelte-1fu8vze"}" id="${"Contact"}"><h4 id="${"links"}" class="${"svelte-1fu8vze"}">Connect</h4>
            <div class="${"col-content svelte-1fu8vze"}" style="${"display:flex; justify-content:space-between"}"><a href="${"mailto:info@allskills.ca"}" class="${"svelte-1fu8vze"}"><img alt="${"Email"}" src="${"images/email.png"}" id="${"email"}" class="${"svelte-1fu8vze"}"></a>
                <a href="${"https://www.twitter.com/@AllSkillsNFT"}" class="${"svelte-1fu8vze"}"><img alt="${"Discord"}" src="${"images/discord.png"}" id="${"discord"}" class="${"svelte-1fu8vze"}"></a>
                <a href="${"https://www.instagram.com/AllSkillsNFT"}" class="${"svelte-1fu8vze"}"><img alt="${"Instagram"}" src="${"images/instagram.png"}" id="${"instagram"}" class="${"svelte-1fu8vze"}"></a>
                <a href="${"https://www.twitter.com/@AllSkillsNFT"}" class="${"svelte-1fu8vze"}"><img alt="${"Twitter"}" src="${"images/twitter.png"}" id="${"twitter"}" class="${"svelte-1fu8vze"}"></a></div></div></div>
    <div id="${"logo"}" class="${"svelte-1fu8vze"}"><img class="${"soft svelte-1fu8vze"}" alt="${"Logo"}" style="${"margin-right: 12px;"}" src="${"images/logo-white-bottom.png"}">
        <img class="${"hard svelte-1fu8vze"}" alt="${"Logo"}" style="${"margin-right: 12px;"}" src="${"images/logo-dark-bottom.png"}"></div>
</footer>`;
});
const TopLines = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let { color } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg class="${"lines"}" style="${"margin-bottom: 50px;"}" viewBox="${"-0.35 0 500.35 78.328"}" xmlns="${"http://www.w3.org/2000/svg"}"><polygon style="${"fill: " + (0, import_index_4f192781.e)(color) + ";"}" points="${"70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"}"></polygon><polygon style="${"fill: " + (0, import_index_4f192781.e)(color) + ";"}" points="${"120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"}"></polygon></svg>`;
});
const BotLines = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let { color } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg class="${"lines"}" style="${"margin-bottom: 50px;"}" viewBox="${"-1.79 0 501.79 94.114"}" xmlns="${"http://www.w3.org/2000/svg"}"><polygon style="${"fill: " + (0, import_index_4f192781.e)(color) + ";"}" points="${"500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"}"></polygon><polygon style="${"fill: " + (0, import_index_4f192781.e)(color) + ";"}" points="${"352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"}"></polygon></svg>`;
});
var Observers_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".growshrink{animation:grow 2s 0.2s ease}.grow{transform:scale(1.33);z-index:-1}.underline{animation:ul 0.7s 0.2s linear forwards}.type{color:#0000;background:linear-gradient(var(--highlight) 0 0) 0 50%/150% 95%,\n            linear-gradient(var(--highlight) 0 0) 0 0  /100% 100%;-webkit-background-clip:padding-box,text;background-clip:padding-box,text;background-repeat:no-repeat;-webkit-box-decoration-break:clone;box-decoration-break:clone;animation:t 1s forwards,\n        b 1s 0.7s forwards}.slide-in{animation:slidein 0.5s forwards linear}@keyframes ul{to{background-size:100% 5px}}@keyframes t{from{background-size:0 95%,0 100%}}@keyframes b{100%{background-position:-200% 50%,0 0}}@keyframes slidein{to{transform:translateX(0)}}@keyframes appear{to{opacity:1}}@keyframes grow{0%{}50%{transform:scale(1.2)}100%{transform:scale(1)}}",
  map: null
};
const Observers = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return ``;
});
var Trailer_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "#trailer-container.svelte-1hi99lz.svelte-1hi99lz{display:flex;justify-content:center;background-size:50% 85%;background-position:bottom;background-repeat:no-repeat}#trailer-container.svelte-1hi99lz iframe.svelte-1hi99lz{width:25%;border-radius:20px;margin-top:100px;height:600px}@media screen and (max-width: 820px){#trailer-container.svelte-1hi99lz iframe.svelte-1hi99lz{width:auto !important}}",
  map: null
};
const Trailer = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div id="${"trailer-container"}" style="${"background-image:var(--trailerBg);"}" class="${"svelte-1hi99lz"}"><iframe title="${"AllSkills Trailer Video"}" loading="${"lazy"}" src="${"https://www.youtube.com/embed/O2A5MIWsCFI?rel=0&controls=0&showinfo=0"}" frameborder="${"0"}" allowfullscreen class="${"svelte-1hi99lz"}"></iframe>
</div>`;
});
var Navbar_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: `@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,400&display=swap');.tumbler__wrapper.svelte-9bsdox.svelte-9bsdox{margin-left:auto;width:60px;height:40px;background-color:black;border:#1d92b2;border-radius:30px;display:flex;justify-content:space-between;align-items:center;padding:0 6px;cursor:pointer;display:flex;position:absolute;top:25px;right:75px}.tumbler__wrapper.svelte-9bsdox svg.svelte-9bsdox{width:20px;height:20px}.tumbler.svelte-9bsdox.svelte-9bsdox{position:absolute;height:25px;width:25px;border-radius:50%;background-color:#fff;transition:transform .5s, background-color .5s;will-change:transform}.soft-mode .tumbler.svelte-9bsdox.svelte-9bsdox{transform:translateX(calc(100%))}.svelte-9bsdox.svelte-9bsdox{margin:0;padding:0;box-sizing:border-box}#overlay.svelte-9bsdox.svelte-9bsdox{position:fixed;top:0;left:0;height:100vh;width:100%;opacity:0.6;background-color:#000;visibility:hidden}select.svelte-9bsdox.svelte-9bsdox{background-color:transparent !important;color:aqua;border:none}@media screen and (max-width: 820px){.logo.svelte-9bsdox.svelte-9bsdox{visibility:hidden}}.logo.svelte-9bsdox.svelte-9bsdox{max-height:100%;background-image:url();cursor:pointer}.locale-selector.svelte-9bsdox.svelte-9bsdox{position:absolute;top:20px;left:20px}.navbar.svelte-9bsdox.svelte-9bsdox{z-index:5;position:fixed;box-sizing:border-box;display:flex;top:0;left:0;width:100%;height:100px;justify-content:space-between;align-items:center;padding:1rem 1rem}.hamburger.svelte-9bsdox.svelte-9bsdox{background:none;position:relative;border:none;margin:0;padding:0;cursor:pointer}#sidenav.svelte-9bsdox.svelte-9bsdox{height:100%;width:0;position:fixed;z-index:1;top:0;right:0;font-family:"Oswald";background-color:#111;overflow-x:hidden;padding-top:60px;transition:0.5s}#sidenav.svelte-9bsdox .closebtn.svelte-9bsdox{position:absolute;top:0;right:25px;font-size:64px;line-height:64px;margin-left:50px}#sidenav.svelte-9bsdox a.svelte-9bsdox{padding:8px 8px 8px 32px;text-decoration:none;font-size:25px;color:#818181;display:block;white-space:nowrap}#sidenav.svelte-9bsdox a.svelte-9bsdox:hover{color:aqua}`,
  map: null
};
const Navbar = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_locale;
  let $locales, $$unsubscribe_locales;
  let $t, $$unsubscribe_t;
  $$unsubscribe_locale = (0, import_index_4f192781.b)(import_index_51131352.a, (value) => value);
  $$unsubscribe_locales = (0, import_index_4f192781.b)(import_index_51131352.b, (value) => $locales = value);
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css$1);
  $$unsubscribe_locale();
  $$unsubscribe_locales();
  $$unsubscribe_t();
  return `<div class="${"navbar svelte-9bsdox"}"><img alt="${"Logo"}" class="${"logo svelte-9bsdox"}" src="${"images/logo.png"}">
    <button class="${"hamburger svelte-9bsdox"}" aria-label="${"Navigation button"}"><svg width="${"48px"}" height="${"48px"}" viewBox="${"0 0 48 48"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-9bsdox"}"><rect width="${"48"}" height="${"48"}" fill="${"white"}" fill-opacity="${"0"}" class="${"svelte-9bsdox"}"></rect><path d="${"M7.94977 11.9498H39.9498"}" stroke="${"white"}" stroke-width="${"4"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"svelte-9bsdox"}"></path><path d="${"M7.94977 23.9498H39.9498"}" stroke="${"white"}" stroke-width="${"4"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"svelte-9bsdox"}"></path><path d="${"M7.94977 35.9498H39.9498"}" stroke="${"white"}" stroke-width="${"4"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"svelte-9bsdox"}"></path></svg> 
</button>
    <div id="${"sidenav"}" class="${"svelte-9bsdox"}"><div class="${"tumbler__wrapper svelte-9bsdox"}"><div class="${"tumbler svelte-9bsdox"}"></div>
                <svg version="${"1.1"}" id="${"sun_change"}" xmlns="${"http://www.w3.org/2000/svg"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}" x="${"0px"}" y="${"0px"}" viewBox="${"0 0 60 60"}" style="${"enable-background:new 0 0 60 60;"}" xml:space="${"preserve"}" class="${"svelte-9bsdox"}"><g class="${"svelte-9bsdox"}"><path style="${"fill:#F0C419;"}" d="${"M30,0c-0.552,0-1,0.448-1,1v6c0,0.552,0.448,1,1,1s1-0.448,1-1V1C31,0.448,30.552,0,30,0z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M30,52c-0.552,0-1,0.448-1,1v6c0,0.552,0.448,1,1,1s1-0.448,1-1v-6C31,52.448,30.552,52,30,52z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M59,29h-6c-0.552,0-1,0.448-1,1s0.448,1,1,1h6c0.552,0,1-0.448,1-1S59.552,29,59,29z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M8,30c0-0.552-0.448-1-1-1H1c-0.552,0-1,0.448-1,1s0.448,1,1,1h6C7.552,31,8,30.552,8,30z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M46.264,14.736c0.256,0,0.512-0.098,0.707-0.293l5.736-5.736c0.391-0.391,0.391-1.023,0-1.414\r\n                 s-1.023-0.391-1.414,0l-5.736,5.736c-0.391,0.391-0.391,1.023,0,1.414C45.752,14.639,46.008,14.736,46.264,14.736z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M13.029,45.557l-5.736,5.736c-0.391,0.391-0.391,1.023,0,1.414C7.488,52.902,7.744,53,8,53\r\n                 s0.512-0.098,0.707-0.293l5.736-5.736c0.391-0.391,0.391-1.023,0-1.414S13.42,45.166,13.029,45.557z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M46.971,45.557c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l5.736,5.736\r\n                 C51.488,52.902,51.744,53,52,53s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L46.971,45.557z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M8.707,7.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l5.736,5.736\r\n                 c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L8.707,7.293z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M50.251,21.404c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08l2.762-1.172\r\n                 c0.508-0.216,0.746-0.803,0.53-1.311s-0.804-0.746-1.311-0.53l-2.762,1.172C50.272,20.309,50.035,20.896,50.251,21.404z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M9.749,38.596c-0.216-0.508-0.803-0.746-1.311-0.53l-2.762,1.172\r\n                 c-0.508,0.216-0.746,0.803-0.53,1.311c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08l2.762-1.172\r\n                 C9.728,39.691,9.965,39.104,9.749,38.596z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M54.481,38.813L51.7,37.688c-0.511-0.207-1.095,0.041-1.302,0.553\r\n                 c-0.207,0.512,0.041,1.095,0.553,1.302l2.782,1.124c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626\r\n                 C55.241,39.603,54.994,39.02,54.481,38.813z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M5.519,21.188L8.3,22.312c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626\r\n                 c0.207-0.512-0.041-1.095-0.553-1.302l-2.782-1.124c-0.513-0.207-1.095,0.04-1.302,0.553C4.759,20.397,5.006,20.98,5.519,21.188z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M39.907,50.781c-0.216-0.508-0.803-0.745-1.311-0.53c-0.508,0.216-0.746,0.803-0.53,1.311\r\n                 l1.172,2.762c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08c0.508-0.216,0.746-0.803,0.53-1.311L39.907,50.781z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M21.014,9.829c0.13,0,0.263-0.026,0.39-0.08c0.508-0.216,0.746-0.803,0.53-1.311l-1.172-2.762\r\n                 c-0.215-0.509-0.802-0.747-1.311-0.53c-0.508,0.216-0.746,0.803-0.53,1.311l1.172,2.762C20.254,9.6,20.625,9.829,21.014,9.829z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M21.759,50.398c-0.511-0.205-1.095,0.04-1.302,0.553l-1.124,2.782\r\n                 c-0.207,0.512,0.041,1.095,0.553,1.302c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626l1.124-2.782\r\n                 C22.519,51.188,22.271,50.605,21.759,50.398z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F0C419;"}" d="${"M38.615,9.675c0.396,0,0.771-0.236,0.928-0.626l1.124-2.782c0.207-0.512-0.041-1.095-0.553-1.302\r\n                 c-0.511-0.207-1.095,0.041-1.302,0.553L37.688,8.3c-0.207,0.512,0.041,1.095,0.553,1.302C38.364,9.651,38.491,9.675,38.615,9.675z"}" class="${"svelte-9bsdox"}"></path></g><circle style="${"fill:#F0C419;"}" cx="${"30"}" cy="${"30"}" r="${"20"}" class="${"svelte-9bsdox"}"></circle><circle style="${"fill:#EDE21B;"}" cx="${"30"}" cy="${"30"}" r="${"15"}" class="${"svelte-9bsdox"}"></circle></svg>
                   <svg version="${"1.1"}" id="${"moon_change"}" xmlns="${"http://www.w3.org/2000/svg"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}" x="${"0px"}" y="${"0px"}" viewBox="${"0 0 499.712 499.712"}" style="${"enable-background:new 0 0 499.712 499.712;"}" xml:space="${"preserve"}" class="${"svelte-9bsdox"}"><path style="${"fill:#FFD93B;"}" d="${"M146.88,375.528c126.272,0,228.624-102.368,228.624-228.64c0-55.952-20.16-107.136-53.52-146.88\r\n               C425.056,33.096,499.696,129.64,499.696,243.704c0,141.392-114.608,256-256,256c-114.064,0-210.608-74.64-243.696-177.712\r\n               C39.744,355.368,90.944,375.528,146.88,375.528z"}" class="${"svelte-9bsdox"}"></path><path style="${"fill:#F4C534;"}" d="${"M401.92,42.776c34.24,43.504,54.816,98.272,54.816,157.952c0,141.392-114.608,256-256,256\r\n               c-59.68,0-114.448-20.576-157.952-54.816c46.848,59.472,119.344,97.792,200.928,97.792c141.392,0,256-114.608,256-256\r\n               C499.712,162.12,461.392,89.64,401.92,42.776z"}" class="${"svelte-9bsdox"}"></path><g class="${"svelte-9bsdox"}"><polygon style="${"fill:#FFD83B;"}" points="${"128.128,99.944 154.496,153.4 213.472,161.96 170.8,203.56 180.864,262.296 \r\n                 128.128,234.568 75.376,262.296 85.44,203.56 42.768,161.96 101.744,153.4   "}" class="${"svelte-9bsdox"}"></polygon><polygon style="${"fill:#FFD83B;"}" points="${"276.864,82.84 290.528,110.552 321.104,114.984 298.976,136.552 304.208,166.984 \r\n                 276.864,152.616 249.52,166.984 254.752,136.552 232.624,114.984 263.2,110.552  "}" class="${"svelte-9bsdox"}"></polygon></g></svg></div>
        <a href="${"javascript:void(0)"}" class="${"closebtn svelte-9bsdox"}">\xD7</a>
        <a href="${"#Trailer"}" class="${"svelte-9bsdox"}">Trailer</a>
        <a href="${"#About"}" class="${"svelte-9bsdox"}">About</a>
        <a href="${"#Challenge"}" class="${"svelte-9bsdox"}">Challenge System</a>
        <a href="${"#Tokens"}" class="${"svelte-9bsdox"}">Vote Token</a>
        <a href="${"#NFT"}" class="${"svelte-9bsdox"}">NFTs</a>
        <a href="${"#Ambassadors"}" class="${"svelte-9bsdox"}">Ambassador Program</a>
        <a href="${"#Roadmap"}" class="${"svelte-9bsdox"}">Roadmap</a>
        <a href="${"#Tokenomics"}" class="${"svelte-9bsdox"}">Tokenomics</a>
        <a href="${"/whitepaper_2022.pdf"}" class="${"svelte-9bsdox"}">Whitepaper</a>
        <a href="${"#Team"}" class="${"svelte-9bsdox"}">Team</a>
        <a href="${"#News"}" class="${"svelte-9bsdox"}">News</a>
        <a href="${"#Contact"}" class="${"svelte-9bsdox"}">Contact</a>
        <div class="${"locale-selector svelte-9bsdox"}"><select class="${"svelte-9bsdox"}">${(0, import_index_4f192781.d)($locales, (value) => {
    return `<option${(0, import_index_4f192781.f)("value", value, 0)} class="${"svelte-9bsdox"}">${(0, import_index_4f192781.e)($t(`lang.${value}`))}</option>`;
  })}</select></div></div>
    <div id="${"overlay"}" class="${"svelte-9bsdox"}"></div>
    
</div>`;
});
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: `#Tokenomics.svelte-1s4ogtb{display:none}.top.svelte-1s4ogtb{position:relative}.triangle.svelte-1s4ogtb{border-top:150px solid rgb(30,30,30);background-color:white;border-left:50vw solid transparent;border-right:50vw solid transparent;width:0;height:0;bottom:-150px;content:"";display:block;position:absolute;overflow:hidden;left:0;right:0;margin:auto}.soft-mode .triangle.svelte-1s4ogtb{display:none}.section-title{margin-left:10%;font-size:4rem;font-family:'Oswald';text-decoration-line:underline;-webkit-text-decoration-line:underline}.center{text-align:center;margin-left:0}`,
  map: null
};
const prerender = true;
const Routes = (0, import_index_4f192781.c)(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = (0, import_index_4f192781.b)(import_index_51131352.t, (value) => $t = value);
  $$result.css.add(css);
  $$unsubscribe_t();
  return `${$$result.head += `${$$result.title = `<title>Recover Account</title>`, ""}<meta name="${"description"}" content="${""}" data-svelte="svelte-o7ivo"><style data-svelte="svelte-o7ivo">@font-face {
			font-family: "Oswald";
			src: url("./fonts/Oswald-Regular.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Bebas Neue";
			src: url("./fonts/BebasNeue-Regular.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Raleway";
			src: url("./fonts/Raleway-Medium.ttf");
			font-display: swap;
		}		
    @font-face {
			font-family: "Roboto";
			src: url("./fonts/Roboto-Light.ttf");
			font-display: swap;
		}		
    @font-face {
			font-family: "Varela";
			src: url("./fonts/VarelaRound-Regular.ttf");
			font-display: swap;
		}	
    body {
      margin: 0;
      font-family:"Lato","Roboto", sans-serif;
      font-weight:200;
      background-color:var(--bgColor);
      color:var(--baseText);
      --highlight: aqua;
      --headerColor: aqua;
      --firstColor: aqua;
      --secondColor: #FF3333;
      --thirdColor: blueviolet;
      --extraColor: rgb(236, 236, 55);
      --fourthColor: gold;
      --baseText: white;
      --headerFont: "Oswald";
      --bgColor: rgb(30,30,30);    
      --trailerBg: url('images/aqua-brush4-v.png');
      --twitterImg: url("images/twitter.png");
      --emailImg: url("images/email.png");
      --discordImg: url("images/discord.png");
      --instaImg: url("images/instagram.png");
    }

  body.soft-mode {
		--highlight: #b061ff;
    --trailerBg:url('../images/paint_splatter_notes.png');
		--headerColor: #20c8d4;
		--firstColor:#ff8b58;
		--secondColor: #ff6680;
		--thirdColor: #20c8d4;
		--fourthColor: #5497f0;
		--baseText: #5497f0;
		--bgColor: rgb(225,225,255) !important;
		--extraColor: #f5cf03;
		--headerFont: "Varela";
		font-family: "Varela" !important;
    --bgImage: url("images/orangewaves_navy_short.svg");
    --twitterImg: url("images/twitter_white.png");
    --emailImg: url("images/email_white.png");
    --discordImg: url("images/discord_white.png");
    --instaImg: url("images/instagram_white.png");
		background-color: var(--bgColor) !important;
	}
  .soft-mode .lines {
    display: none;
  }
  .powered-by h3{
        padding-top: 20rem;
        max-width: 1200px;
        padding-bottom: 20rem;
        width:85%;
        margin-left:auto;
        margin-right:auto;
        text-align: center;
        font-size: 2.5rem;
        font-family: var(--headerFont);
    }
    .powered-by {
      background-size:cover;
        background-position:bottom;
        background-repeat: no-repeat;
    }
    h3 {
      color: var(--baseText);
    }
    h2 {
      color: var(--baseText);
    }
    .soft-mode h4 {
      font-family: 'Varela' !important;
    }
    .soft-mode h3 {
      color: var(--headerColor);
    }
	</style><script data-svelte="svelte-o7ivo">var tag = document.createElement("script");
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  <\/script><link rel="${"preconnect"}" href="${"https://fonts.googleapis.com"}" data-svelte="svelte-o7ivo"><link rel="${"preconnect"}" href="${"https://fonts.gstatic.com"}" crossorigin data-svelte="svelte-o7ivo"><link href="${"https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400&family=Roboto:wght@100&display=swap"}" rel="${"stylesheet"}" data-svelte="svelte-o7ivo">`, ""}
${(0, import_index_4f192781.v)(Navbar, "Navbar").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(Observers, "Observers").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(Hero, "Hero").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(Trailer, "Trailer").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(Table, "Table").$$render($$result, {}, {}, {})}
<div class="${"powered-by"}" style="${"background-image: var(--bgImage);"}"><h3><span style="${"color:var(--highlight);"}">${(0, import_index_4f192781.e)($t("en.home.highlighted.company"))}</span> ${(0, import_index_4f192781.e)($t("en.home.highlighted.start"))} <span class="${"important"}">${(0, import_index_4f192781.e)($t("en.home.highlighted.highlight1"))}</span>${(0, import_index_4f192781.e)($t("en.home.highlighted.middle"))} <span class="${"important"}">${(0, import_index_4f192781.e)($t("en.home.highlighted.highlight2"))}</span></h3></div>
${(0, import_index_4f192781.v)(TopLines, "TopLines").$$render($$result, { color: "aqua" }, {}, {})}
${(0, import_index_4f192781.v)(Challenge, "Challenge").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(BotLines, "BotLines").$$render($$result, { color: "gold" }, {}, {})}
${(0, import_index_4f192781.v)(Tokens, "Tokens").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(TopLines, "TopLines").$$render($$result, { color: "blueviolet" }, {}, {})}
${(0, import_index_4f192781.v)(NFT, "NFT").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(GM, "GM").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(BotLines, "BotLines").$$render($$result, { color: "red" }, {}, {})}
${(0, import_index_4f192781.v)(Ambassador, "Ambassador").$$render($$result, {}, {}, {})}
<div id="${"Tokenomics"}" class="${"svelte-1s4ogtb"}">${(0, import_index_4f192781.v)(Tokenomics, "Tokenomics").$$render($$result, {}, {}, {})}</div>
${(0, import_index_4f192781.v)(TopLines, "TopLines").$$render($$result, { color: "white" }, {}, {})}
${(0, import_index_4f192781.v)(TeamCards, "TeamCards").$$render($$result, {}, {}, {})}
<div class="${"top svelte-1s4ogtb"}"><div class="${"triangle svelte-1s4ogtb"}"></div></div>
${(0, import_index_4f192781.v)(Partners, "Partners").$$render($$result, {}, {}, {})}
${(0, import_index_4f192781.v)(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
