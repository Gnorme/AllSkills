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
