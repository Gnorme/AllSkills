<script>
  import { t, locales, locale } from "$lib/translations";
  let value = "fr";

  function revealTokenomics(e) {
    document.getElementById("Tokenomics").classList.toggle("reveal");
  }
  function revealRoadmap(e) {
    document.getElementById("Roadmap").classList.toggle("reveal");
  }
  function changeMode() {
    window.document.body.classList.toggle("soft-mode");
  }

  /* Set the width of the side navigation to 250px */
  function openNav() {
    document.getElementById("sidenav").style.width = "250px";
    document.getElementById("overlay").style.visibility = "visible";
  }

  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("overlay").style.visibility = "hidden";
  }

  const handleLocaleChange = (e) => {
    e.preventDefault();
    locale.set(e.target.value);
    closeNav();
  };
  function handleClick() {
    alert("clicked");
  }
</script>

<div class="navbar">
  <div class="logo-container">
    <img alt="Logo" class="logo" on:click={changeMode} src="images/logo.png" />
    <div class="locale-selector">
      <select on:change={handleLocaleChange} bind:value={$locale}>
        {#each $locales as value}
          <option {value}>{$t(`lang.${value}`)}</option>
        {/each}
      </select>
    </div>
  </div>
  <button class="hamburger" aria-label="Navigation button" on:click={openNav}>
    <svg
      width="48px"
      height="48px"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" fill="white" fill-opacity="0" />
      <path
        d="M7.94977 11.9498H39.9498"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.94977 23.9498H39.9498"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.94977 35.9498H39.9498"
        stroke="white"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <!--<svg id="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="aqua" d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"/></svg>-->
  </button>
  <div id="sidenav">
    <div on:click={changeMode} class="tumbler__wrapper">
      <div class="tumbler" />
      <svg
        version="1.1"
        id="sun_change"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 60 60"
        style="enable-background:new 0 0 60 60;"
        xml:space="preserve"
      >
        <g>
          <path
            style="fill:#F0C419;"
            d="M30,0c-0.552,0-1,0.448-1,1v6c0,0.552,0.448,1,1,1s1-0.448,1-1V1C31,0.448,30.552,0,30,0z"
          />
          <path
            style="fill:#F0C419;"
            d="M30,52c-0.552,0-1,0.448-1,1v6c0,0.552,0.448,1,1,1s1-0.448,1-1v-6C31,52.448,30.552,52,30,52z"
          />
          <path
            style="fill:#F0C419;"
            d="M59,29h-6c-0.552,0-1,0.448-1,1s0.448,1,1,1h6c0.552,0,1-0.448,1-1S59.552,29,59,29z"
          />
          <path
            style="fill:#F0C419;"
            d="M8,30c0-0.552-0.448-1-1-1H1c-0.552,0-1,0.448-1,1s0.448,1,1,1h6C7.552,31,8,30.552,8,30z"
          />
          <path
            style="fill:#F0C419;"
            d="M46.264,14.736c0.256,0,0.512-0.098,0.707-0.293l5.736-5.736c0.391-0.391,0.391-1.023,0-1.414
                 s-1.023-0.391-1.414,0l-5.736,5.736c-0.391,0.391-0.391,1.023,0,1.414C45.752,14.639,46.008,14.736,46.264,14.736z"
          />
          <path
            style="fill:#F0C419;"
            d="M13.029,45.557l-5.736,5.736c-0.391,0.391-0.391,1.023,0,1.414C7.488,52.902,7.744,53,8,53
                 s0.512-0.098,0.707-0.293l5.736-5.736c0.391-0.391,0.391-1.023,0-1.414S13.42,45.166,13.029,45.557z"
          />
          <path
            style="fill:#F0C419;"
            d="M46.971,45.557c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l5.736,5.736
                 C51.488,52.902,51.744,53,52,53s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L46.971,45.557z"
          />
          <path
            style="fill:#F0C419;"
            d="M8.707,7.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l5.736,5.736
                 c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L8.707,7.293z"
          />
          <path
            style="fill:#F0C419;"
            d="M50.251,21.404c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08l2.762-1.172
                 c0.508-0.216,0.746-0.803,0.53-1.311s-0.804-0.746-1.311-0.53l-2.762,1.172C50.272,20.309,50.035,20.896,50.251,21.404z"
          />
          <path
            style="fill:#F0C419;"
            d="M9.749,38.596c-0.216-0.508-0.803-0.746-1.311-0.53l-2.762,1.172
                 c-0.508,0.216-0.746,0.803-0.53,1.311c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08l2.762-1.172
                 C9.728,39.691,9.965,39.104,9.749,38.596z"
          />
          <path
            style="fill:#F0C419;"
            d="M54.481,38.813L51.7,37.688c-0.511-0.207-1.095,0.041-1.302,0.553
                 c-0.207,0.512,0.041,1.095,0.553,1.302l2.782,1.124c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626
                 C55.241,39.603,54.994,39.02,54.481,38.813z"
          />
          <path
            style="fill:#F0C419;"
            d="M5.519,21.188L8.3,22.312c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626
                 c0.207-0.512-0.041-1.095-0.553-1.302l-2.782-1.124c-0.513-0.207-1.095,0.04-1.302,0.553C4.759,20.397,5.006,20.98,5.519,21.188z"
          />
          <path
            style="fill:#F0C419;"
            d="M39.907,50.781c-0.216-0.508-0.803-0.745-1.311-0.53c-0.508,0.216-0.746,0.803-0.53,1.311
                 l1.172,2.762c0.162,0.381,0.532,0.61,0.921,0.61c0.13,0,0.263-0.026,0.39-0.08c0.508-0.216,0.746-0.803,0.53-1.311L39.907,50.781z"
          />
          <path
            style="fill:#F0C419;"
            d="M21.014,9.829c0.13,0,0.263-0.026,0.39-0.08c0.508-0.216,0.746-0.803,0.53-1.311l-1.172-2.762
                 c-0.215-0.509-0.802-0.747-1.311-0.53c-0.508,0.216-0.746,0.803-0.53,1.311l1.172,2.762C20.254,9.6,20.625,9.829,21.014,9.829z"
          />
          <path
            style="fill:#F0C419;"
            d="M21.759,50.398c-0.511-0.205-1.095,0.04-1.302,0.553l-1.124,2.782
                 c-0.207,0.512,0.041,1.095,0.553,1.302c0.123,0.049,0.25,0.073,0.374,0.073c0.396,0,0.771-0.236,0.928-0.626l1.124-2.782
                 C22.519,51.188,22.271,50.605,21.759,50.398z"
          />
          <path
            style="fill:#F0C419;"
            d="M38.615,9.675c0.396,0,0.771-0.236,0.928-0.626l1.124-2.782c0.207-0.512-0.041-1.095-0.553-1.302
                 c-0.511-0.207-1.095,0.041-1.302,0.553L37.688,8.3c-0.207,0.512,0.041,1.095,0.553,1.302C38.364,9.651,38.491,9.675,38.615,9.675z"
          />
        </g>
        <circle style="fill:#F0C419;" cx="30" cy="30" r="20" />
        <circle style="fill:#EDE21B;" cx="30" cy="30" r="15" />
      </svg>
      <svg
        version="1.1"
        id="moon_change"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 499.712 499.712"
        style="enable-background:new 0 0 499.712 499.712;"
        xml:space="preserve"
      >
        <path
          style="fill:#FFD93B;"
          d="M146.88,375.528c126.272,0,228.624-102.368,228.624-228.64c0-55.952-20.16-107.136-53.52-146.88
               C425.056,33.096,499.696,129.64,499.696,243.704c0,141.392-114.608,256-256,256c-114.064,0-210.608-74.64-243.696-177.712
               C39.744,355.368,90.944,375.528,146.88,375.528z"
        />
        <path
          style="fill:#F4C534;"
          d="M401.92,42.776c34.24,43.504,54.816,98.272,54.816,157.952c0,141.392-114.608,256-256,256
               c-59.68,0-114.448-20.576-157.952-54.816c46.848,59.472,119.344,97.792,200.928,97.792c141.392,0,256-114.608,256-256
               C499.712,162.12,461.392,89.64,401.92,42.776z"
        />
        <g>
          <polygon
            style="fill:#FFD83B;"
            points="128.128,99.944 154.496,153.4 213.472,161.96 170.8,203.56 180.864,262.296 
                 128.128,234.568 75.376,262.296 85.44,203.56 42.768,161.96 101.744,153.4   "
          />
          <polygon
            style="fill:#FFD83B;"
            points="276.864,82.84 290.528,110.552 321.104,114.984 298.976,136.552 304.208,166.984 
                 276.864,152.616 249.52,166.984 254.752,136.552 232.624,114.984 263.2,110.552  "
          />
        </g></svg
      >
    </div>
    <a href="javascript:void(0)" on:click={closeNav} class="closebtn">&times;</a
    >
    <a href="#Trailer">Trailer</a>
    <a href="#About">About</a>
    <a href="#Challenge">Challenge System</a>
    <a href="#Tokens">Vote Token</a>
    <a href="#NFT">NFTs</a>
    <a href="#Ambassadors">Ambassador Program</a>
    <a on:click={revealRoadmap} href="#Roadmap">Roadmap</a>
    <a on:click={revealTokenomics} href="#Tokenomics">Tokenomics</a>
    <a href="/whitepaper_2022.pdf">Whitepaper</a>
    <a href="#Team">Team</a>
    <a href="#News">News</a>
    <a href="#Contact">Contact</a>
    <div class="locale-selector">
      <select bind:value={$locale}>
        {#each $locales as value}
          <option {value}>{$t(`lang.${value}`)}</option>
        {/each}
      </select>
    </div>
  </div>
  <div on:click={closeNav} id="overlay" />
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,400&display=swap");
  .tumbler__wrapper {
    margin-left: auto;
    width: 60px;
    height: 40px;
    background-color: black;
    border: #1d92b2;
    border-radius: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    cursor: pointer;
    display: flex;
    position: absolute;
    top: 25px;
    right: 75px;
  }
  .logo-container {
    max-width: 100px;
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 10px;
    max-height: 100%;
    flex-direction: column;
  }
  #moon {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 25px;
    content: url("../images/moon.svg");
  }
  :global(.soft-mode) #moon {
    content: url("../images/sun.svg") !important;
  }
  .tumbler__wrapper svg {
    width: 20px;
    height: 20px;
  }
  .tumbler {
    position: absolute;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.5s, background-color 0.5s;
    will-change: transform;
  }
  .sun-svg,
  .moon-svg {
    display: none;
  }
  :global(.soft-mode) .tumbler {
    transform: translateX(calc(100%));
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    opacity: 0.6;
    background-color: #000;
    visibility: hidden;
  }
  .locale-selector {
    display: flex;
    margin-top: 10px;
    font-size: 1rem;
    flex-direction: row-reverse;
  }
  select {
    background-color: transparent !important;
    color: aqua;
    border: none;
    -webkit-appearance: none;
  }
  @media screen and (max-width: 820px) {
    .logo {
      /*visibility: hidden;*/
      width: 40px;
      height: 40px;
    }
  }
  .logo {
    max-height: 100%;
    background-image: url();
    cursor: pointer;
  }

  .navbar {
    z-index: 2;
    position: fixed;
    box-sizing: border-box;
    flex-direction: row-reverse;
    display: flex;
    top: 0;
    width: 100%;
    height: 100px;
    justify-content: space-between;
    padding-top: 1rem;
  }

  .hamburger {
    background: none;
    position: relative;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    display: none;
  }
  #sidenav {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    right: 0;
    font-family: "Oswald";
    background-color: #111; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 60px; /* Place content 60px from the top */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  }
  #sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 64px;
    line-height: 64px;
    margin-left: 50px;
  }
  #sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    white-space: nowrap;
  }
  #sidenav a:hover {
    color: aqua;
  }
</style>
