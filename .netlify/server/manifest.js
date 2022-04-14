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
  manifest: () => manifest
});
module.exports = __toCommonJS(stdin_exports);
const manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set([".DS_Store", "favicon.png", "fonts/.DS_Store", "fonts/BebasNeue-Regular.ttf", "fonts/Oswald-Bold.ttf", "fonts/Oswald-Regular.ttf", "fonts/Raleway-BlackItalic.ttf", "fonts/Raleway-Bold.ttf", "fonts/Raleway-Medium.ttf", "fonts/Raleway-MediumItalic.ttf", "fonts/Roboto-Bold.ttf", "fonts/Roboto-Light.ttf", "fonts/Roboto-Medium.ttf", "fonts/Roboto-Thin.ttf", "fonts/VarelaRound-Regular.ttf", "images/.DS_Store", "images/Challenge.png", "images/Charles_s.webp", "images/Chris_Boucher.jpeg", "images/Christopher_s.webp", "images/Dunk.webp", "images/Frank_s.webp", "images/Logo_bg.webp", "images/Noah_s.webp", "images/ambassador.png", "images/ambassador.webp", "images/ambassador_soft.png", "images/ambassador_soft.webp", "images/aqua-brush4-v.png", "images/aqua-brush4-v.svg", "images/auction.png", "images/bass.webp", "images/black_bg_s.png", "images/black_bg_s.webp", "images/bluewaves.svg", "images/challenge_complete.png", "images/challenge_current.png", "images/challenge_current.webp", "images/challenge_edit.png", "images/challenge_edit.webp", "images/challenge_sw.webp", "images/challenge_upload.png", "images/challenge_upload.webp", "images/challenge_win.png", "images/challenge_win.webp", "images/charles_s.png", "images/charly_iacono.png", "images/christopher_s.png", "images/coin.png", "images/coin.webp", "images/discord.png", "images/discord_white.png", "images/earn.png", "images/earn_soft.png", "images/earn_soft.webp", "images/earnings.png", "images/earnings_soft.png", "images/email-nocircle-aqua.png", "images/email.png", "images/email_white.png", "images/frame.png", "images/frank_s.png", "images/global.png", "images/globalization.png", "images/globalization_soft.png", "images/globalization_sw.png", "images/gm_mode.png", "images/green-brush4.png", "images/green-brush4.svg", "images/handshake.png", "images/handshake_soft.png", "images/handshake_soft.webp", "images/header.svg", "images/idea.png", "images/idea_soft.png", "images/idea_sw.png", "images/instagram.png", "images/instagram_white.png", "images/iphone_frame.png", "images/launch.png", "images/launch_no_ex.png", "images/launch_sw.png", "images/leadership.png", "images/leadership_soft.png", "images/leadership_sw.png", "images/linkedin-aqua.png", "images/logo-border-2.png", "images/logo-dark-bottom.png", "images/logo-dark.png", "images/logo-white-bottom.png", "images/logo-yellow-s.png", "images/logo.png", "images/mobile_hero.png", "images/mobile_hero.webp", "images/mobile_hero_logo.png", "images/montreal_alliance.png", "images/moon.svg", "images/noah_s.png", "images/orangewaves_navy.svg", "images/orangewaves_navy_short.svg", "images/paint_splatter_notes.png", "images/planning.png", "images/planning_soft.png", "images/planning_sw.png", "images/profile-bg-1.jpg", "images/purple-brush4-v2.png", "images/purple-brush4-v2.svg", "images/replay_logo.png", "images/replenish.png", "images/replenish_soft.png", "images/revenue.png", "images/revenue_soft.png", "images/rocket_soft.png", "images/skateboard.png", "images/skateboard.webp", "images/stable.png", "images/stake.png", "images/stake_soft.png", "images/stamps.png", "images/stamps_soft.png", "images/stamps_soft.webp", "images/sun.svg", "images/tags_bg_gradient.png", "images/tags_hero_bg.png", "images/tags_hero_bg.webp", "images/token.png", "images/twitter-aqua.png", "images/twitter.png", "images/twitter_white.png", "images/upload.png", "images/upload.webp", "images/upload_sw.webp", "images/vantage_logo.png", "images/volume-mute.png", "images/volume.png", "images/vote.png", "images/vote_soft.png", "images/vote_token.png", "images/wave_upside-down.svg", "images/waves_reversed.svg", "images/win_bg.png", "images/win_screen.png", "robots.txt", "whitepaper_2022.pdf"]),
  mimeTypes: { ".png": "image/png", ".ttf": "font/ttf", ".webp": "image/webp", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".txt": "text/plain", ".pdf": "application/pdf" },
  _: {
    entry: { "file": "start-3de2f2ff.js", "js": ["start-3de2f2ff.js", "chunks/index-98f0d29c.js", "chunks/preload-helper-26918c37.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js")))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};
