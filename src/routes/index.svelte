<script context="module">
  export const prerender = true;
</script>

<script>
  import { t } from "$lib/translations";
  import Hero from "$lib/Hero.svelte";
  import Table from "$lib/Table.svelte";
  import Challenge from "$lib/Challenge.svelte";
  import Tokens from "$lib/Tokens.svelte";
  import NFT from "$lib/NFT.svelte";
  import GM from "$lib/GM.svelte";
  import Ambassador from "$lib/Ambassador.svelte";
  import Tokenomics from "$lib/Tokenomics.svelte";
  import TeamCards from "$lib/TeamCards.svelte";
  import Partners from "$lib/Partners.svelte";
  import Footer from "$lib/Footer.svelte";
  import TopLines from "$lib/TopLines.svelte";
  import BotLines from "$lib/BotLines.svelte";
  import Observers from "$lib/Observers.svelte";
  import Trailer from "$lib/Trailer.svelte";
  import Navbar from "$lib/Navbar.svelte";
  import LiveVote from "$lib/LiveVote.svelte";
</script>

<svelte:head>
  <link rel="preload" as="image" href="images/tags_hero_bg.png" />
  <link rel="preload" as="image" href="images/logo-border-2.png" />
  <style>
    @font-face {
      font-family: "Oswald";
      src: url("./fonts/Oswald-Regular.woff2");
      font-display: optional;
    }
    @font-face {
      font-family: "Bebas Neue";
      src: url("./fonts/BebasNeue-Regular.woff2");
      font-display: optional;
    }
    @font-face {
      font-family: "Raleway";
      src: url("./fonts/Raleway-Medium.ttf");
      font-display: optional;
    }
    @font-face {
      font-family: "Roboto";
      src: url("./fonts/Roboto-Light.woff2");
      font-display: optional;
      font-weight: 100;
    }
    @font-face {
      font-family: "Lato";
      src: url("./fonts/Lato-Light.woff2");
      font-display: optional;
      font-weight: 300;
    }
    @font-face {
      font-family: "Lato";
      src: url("./fonts/Lato-Regular.woff2");
      font-display: optional;
      font-weight: 400;
    }
    @font-face {
      font-family: "Lato";
      src: url("./fonts/Lato-Bold.woff2");
      font-display: optional;
      font-weight: 600;
    }
    @font-face {
      font-family: "Varela";
      src: url("./fonts/VarelaRound-Regular.ttf");
      font-display: swap;
    }
    body {
      margin: 0;
      font-family: "Lato", "Roboto", sans-serif;
      font-weight: 200;
      background-color: var(--bgColor);
      color: var(--baseText);
      --highlight: aqua;
      --headerColor: aqua;
      --firstColor: aqua;
      --secondColor: #ff3333;
      --thirdColor: blueviolet;
      --extraColor: rgb(236, 236, 55);
      --fourthColor: gold;
      --baseText: white;
      --headerFont: "Oswald";
      --bgColor: rgb(30, 30, 30);
      --trailerBg: url("images/aqua-brush4-v.png");
      --twitterImg: url("images/twitter.png");
      --emailImg: url("images/email.png");
      --discordImg: url("images/discord.png");
      --instaImg: url("images/instagram.png");
    }

    body.soft-mode {
      --highlight: #b061ff;
      --trailerBg: url("../images/paint_splatter_notes.png");
      --headerColor: #20c8d4;
      --firstColor: #ff8b58;
      --secondColor: #ff6680;
      --thirdColor: #20c8d4;
      --fourthColor: #5497f0;
      --baseText: #5497f0;
      --bgColor: rgb(225, 225, 255) !important;
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
    .powered-by h3 {
      padding-top: 20rem;
      max-width: 1200px;
      padding-bottom: 20rem;
      width: 85%;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      font-size: 2.5rem;
      font-family: var(--headerFont);
    }
    .powered-by {
      background-size: cover;
      background-position: bottom;
      background-repeat: no-repeat;
    }
    h3 {
      color: var(--baseText);
    }
    h2 {
      color: var(--baseText);
    }
    .soft-mode h4 {
      font-family: "Varela" !important;
    }
    .soft-mode h3 {
      color: var(--headerColor);
    }
  </style>
  <link
    rel="preload"
    href="/fonts/Roboto-Light.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/BebasNeue-Regular.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Oswald-Regular.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Lato-Regular.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Lato-Light.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Lato-Bold.woff2"
    as="font"
    type="font/woff"
    crossorigin="anonymous"
  />
  <!--<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400&family=Roboto:wght@100&display=swap"
    rel="stylesheet"
  />-->
</svelte:head>
<!--<LiveVote />-->
<Navbar />
<Observers />
<Hero />
<Trailer />
<Table />
<div class="powered-by" style="background-image: var(--bgImage);">
  <h3>
    <span style="color:var(--highlight);"
      >{$t("content.home.highlighted.company")}</span
    >
    {$t("content.home.highlighted.start")}
    <span class="important">{$t("content.home.highlighted.highlight1")}</span
    >{$t("content.home.highlighted.middle")}
    <span class="important">{$t("content.home.highlighted.highlight2")}</span>
  </h3>
</div>
<TopLines color="aqua" />
<Challenge />
<BotLines color="gold" />
<Tokens />
<TopLines color="blueviolet" />
<NFT />
<GM />
<BotLines color="red" />
<Ambassador />
<div id="Tokenomics">
  <Tokenomics />
</div>
<TopLines color="white" />
<TeamCards />
<div class="top">
  <div class="triangle" />
</div>
<Partners />
<Footer />

<style>
  #Tokenomics {
    display: none;
  }
  .top {
    position: relative;
  }
  .triangle {
    border-top: 150px solid rgb(30, 30, 30);
    background-color: white;
    border-left: 50vw solid transparent;
    border-right: 50vw solid transparent;
    width: 0;
    height: 0;
    bottom: -150px;
    content: "";
    display: block;
    position: absolute;
    overflow: hidden;
    left: 0;
    right: 0;
    margin: auto;
  }
  :global(.soft-mode) .triangle {
    display: none;
  }
  :global(.section-title) {
    margin-left: 10%;
    font-size: 4rem;
    font-family: "Oswald";
    text-decoration-line: underline;
    -webkit-text-decoration-line: underline;
  }
  :global(.center) {
    text-align: center;
    margin-left: 0;
  }
</style>
