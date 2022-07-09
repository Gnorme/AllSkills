<script>
  import NewsletterSignup from "./NewsletterSignup.svelte";
  import { t } from "$lib/translations/index.js";
  import RequestAccess from "./RequestAccess.svelte";
  let requestingAccess = false;
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
    "Trickshots",
  ];
  let string = "<a>Twitter</a>";
</script>

{#if requestingAccess}
  <RequestAccess bind:requestingAccess />
{/if}
<div style="background-image:url('images/tags_hero_bg.png')" id="hero">
  <img
    loading="lazy"
    alt="AllSkills logo"
    id="hero-logo"
    src="images/logo-border-2.png"
  />
  <div class="left-content">
    <div class="content">{$t("content.home.hero.title")}</div>
    <div class="scrolling-content">
      <div class="scrolling-content-mask">
        <ul class="scroll-animation">
          {#each skills as skill}
            <li>{skill}</li>
          {/each}
          <li
            style="color:var(--highlight); font-weight: 600 !important; font-family:'Bebas Neue'; margin-top:11px;"
          >
            <h1 style="margin:0; font-size:64px;">AllSkills</h1>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="hero-split">
    <div class="description">
      <p style="margin-bottom:2rem; color: white !important;">
        {$t("content.home.hero.description_start")}
        <span style="color:var(--highlight)"
          >{$t("content.home.hero.description_highlight")}</span
        >
        {$t("content.home.hero.description_end")}
      </p>
      <NewsletterSignup color="white" />
    </div>
  </div>
  <button class="request-access" on:click={() => (requestingAccess = true)}
    >Request access to beta</button
  >
  <div id="socials">
    <div class="tooltip">
      <ul id="social-links">
        <a href="https://twitter.com/@AllSkillsca">Twitter</a>
        <a href="https://www.instagram.com/AllSkills.ca">Instagram</a>
        <a href="https://www.tiktok.com/@allskillsnft">TikTok</a>
        <a href="https://www.facebook.com/AllSkills.ca">Facebook</a>
      </ul>
    </div>
    <span>Check us out <a>@AllSkills.ca</a></span>
  </div>
</div>

<style>
  .request-access {
    position: absolute;
    border: none;
    padding: 10px;
    border-radius: 6px;
    background: blueviolet;
    color: white;
    margin: 10px;
    bottom: 0;
  }
  :global(.soft-mode) #hero {
    background-image: none !important;
    background-color: #ffa666;
  }
  #socials {
    position: absolute;
    top: 90%;
    z-index: 10;
    color: white;
    font-family: "Oswald";
    font-size: 24px;
    left: 42%;
  }
  #social-links {
    list-style: none;
    margin: 0;
    cursor: pointer;
  }
  .tooltip {
    display: none;
    position: absolute;
    padding: 10px;
    width: 150px;
    right: 0px;
    font-size: 1.5rem;
    background-color: rgb(34, 34, 34);
    color: white;
    font-family: "Oswald";
    overflow: hidden;
  }
  #socials:active .tooltip,
  .tooltip:active {
    display: block;
  }
  #socials:hover .tooltip,
  .tooltip:hover {
    display: block;
  }
  #hero-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 50%;
    max-width: 100%;
    mix-blend-mode: soft-light;
  }
  .scrolling-content {
    margin-left: 10px;
    font-size: 64px;
    height: 64px;
    text-align: left;
    line-height: 1;
    text-overflow: ellipsis;
    width: 200px;
    white-space: nowrap;
    color: white;
  }
  #socials a {
    color: var(--highlight);
  }

  .content {
    text-align: right;
    font-size: 64px;
    line-height: 64px;
    text-align: right;
    color: #ecf0f1;
    padding: 0;
    white-space: nowrap;
    position: relative;
    display: inline-block;
    min-height: 0;
    font-weight: 600;
    overflow: hidden;
  }
  .scrolling-content-mask {
    height: 64px;
    overflow: hidden;
    position: relative;
    display: inline-block;
  }
  .left-content {
    font-weight: 500;
    margin: 0px;
    height: 64px;
    z-index: 1;
    display: grid;
    grid-template-columns: 48% 52%;
  }

  #hero {
    position: relative;
    width: 100%;
    height: 100vh;
    display: grid;
    background-position: center;
    background-size: 100% 100%;
    grid-template-columns: 55% 45%;
    justify-content: space-between;
    align-items: center;
  }
  @media screen and (max-width: 820px) {
    .request-access {
      bottom: -60px;
    }
    :global(.soft-mode #hero::before) {
      background-image: none !important;
      background-color: #ffa666 !important;
    }
    #hero::before {
      background-image: url("../images/mobile_hero.png");
    }
    #hero-logo {
      height: auto !important;
    }
    #socials {
      display: table;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 20px;
      position: relative;
      left: 0;
    }
    #hero {
      display: flex;
      flex-direction: column;
      height: auto;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .description {
      display: table-cell;
      text-align: center;
      padding: 20px;
    }
    .left-content {
      padding-top: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      height: auto;
    }
    .scrolling-content {
      margin-top: 20px;
    }
    .content {
      text-align: center;
    }
    .scroll-animation {
      text-align: center !important;
    }
  }
  .description {
    position: relative;
    font-weight: 400;
    width: 90%;
    height: auto;
  }

  .hero-split {
    color: white;
  }

  p {
    font-size: 1.6rem;
    line-height: 2.25rem;
    display: inline;
    float: left;
    margin: 0;
  }

  .scroll-animation {
    min-height: 150px;
    max-height: 150px;
    margin: 0px;
    padding: 0px;
    background-size: contain;
    font-size: 64px;
    margin-top: 0;
    position: relative;
    text-align: left;
    list-style: none;
    animation: change 3.5s cubic-bezier(0.5, 0.2, 0.5, 1) 0.5s 1 normal forwards;
    -webkit-animation: change 3.5s cubic-bezier(0.8, 0.3, 0.3, 1) 0.5s 1 normal
      forwards;
  }

  .scroll-animation li {
    margin: 0;
  }

  @-webkit-keyframes opacity {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @-webkit-keyframes change {
    100% {
      margin-top: -2688px;
    }
  }

  @keyframes opacity {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes change {
    100% {
      margin-top: -2694px;
    }
  }

  :global(.soft-mode #hero::before) {
    background-image: none !important;
    background-color: #ffa666;
  }

  @media screen and (max-width: 820px) {
    :global(.soft-mode #hero::before) {
      background-image: none !important;
      background-color: #ffa666 !important;
    }
    #hero::before {
      background-image: url("images/mobile_hero.png");
    }
    #hero-logo {
      height: auto !important;
    }
    #socials {
      display: table;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 20px;
      position: relative;
      left: 0;
    }
    #hero {
      display: flex;
      flex-direction: column;
      height: auto;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .description {
      display: table-cell;
      text-align: center;
      padding: 20px;
    }
    .left-content {
      padding-top: 100px;
      display: flex;
      flex-direction: column;
      height: auto;
    }
    .scrolling-content {
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .content {
      text-align: center;
    }
    .scroll-animation {
      text-align: center !important;
    }
  }
</style>
