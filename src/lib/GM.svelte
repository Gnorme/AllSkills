<script>
  import { t } from "$lib/translations/index.js";
  let modalShowing = false;
  let modalTitle = "modal";
  let modalDescription = "";
  let descriptions = {
    benefits: {
      title: "Level Rewards",
      description: "List of rewards users can earn from leveling up",
    },
    minting: {
      title: "Minting",
      description:
        "Minting of challenge videos allows our users to truly own their content. Non-Fungible Tokens (NFTs) and smart-contracts are used to wrap ownership of something in rules governed by programmable logic that allows it to be easily traded to others or brought to other platforms in a way that doesn’t rely on centralized control or servers and means your videos will last beyond AllSkills.",
    },
    leaderboard: {
      title: "Leaderboards",
      description: "Description of our various leaderboards",
    },
    token: {
      title: "Mint Token",
      description:
        "After you purchase a Mint Token, you can apply it to a challenge video you've already won to mint it into an NFT, or you can apply it to your next challenge making your next win a guaranteed mint.",
    },
    blockchains: {
      title: "Blockchains",
      description:
        "We want to give our users the freedom to use the blockchain and NFT marketplaces of their choice. Mint your winning challenge videos directly to either Ethereum, Polygon, NEAR, Tezos, or Flow blockchains.",
    },
    marketplaces: {
      title: "Marketplaces",
      description:
        "The option to mint to so many blockchains opens users up to selling their NFT on the worlds biggest NFT marketplaces like OpenSea and Rarible, on top of our own.",
    },
    ipfs: {
      title: "IPFS",
      description:
        "The InterPlanetary File System is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices.",
    },
    arweave: {
      title: "arweave",
      description:
        "Arweave is a new type of storage that backs data with sustainable and perpetual endowments, allowing users and developers to truly store data forever – for the very first time. As a collectively owned hard drive that never forgets, Arweave allows us to remember and preserve valuable information, apps, and history indefinitely. By preserving history, it prevents others from rewriting it.",
    },
    ardrive: { title: "ardrive", description: "description" },
  };
  function showModal(title) {
    modalShowing = true;
    modalTitle = descriptions[title].title;
    modalDescription = descriptions[title].description;
    //document.getElementById(target).style.display = "block";
    //document.getElementById("overlay").style.visibility = "visible";
  }
  function closeModal() {
    modalShowing = false;
  }
  /*function closeModal(ev) {
        document.getElementById("modal").style.display = "none";
        document.getElementById("overlay").style.visibility = "hidden";
        console.log("wtf")
    }*/
</script>

<section id="GM">
  <h2
    class="section-title"
    style="text-decoration-color: var(--firstColor); -webkit-text-decoration-color: var(--firstColor)"
  >
    {$t("content.home.gm.main_title")}
  </h2>
  <div class="GM-container">
    <div class="GM-section">
      <div class="image second">
        <img alt="GM Mode" src="images/gm_mode.png" />
      </div>
      <div class="content first">
        <div>
          <div class="info left">
            <ul id="gm-info">
              <li>
                <h4>
                  {$t("content.home.gm.1.pStart")}
                  <span style="color:aqua"
                    >{$t("content.home.gm.1.highlight")}</span
                  >
                </h4>
              </li>
              <li>
                <h4>
                  {$t("content.home.gm.2.pStart")}
                  {$t("content.home.gm.2.highlight")}
                  {$t("content.home.gm.2.pEnd")}
                </h4>
              </li>
              <li>
                <h4>
                  {$t("content.home.gm.3.pStart")}
                  <span style="color:aqua"
                    >{$t("content.home.gm.3.highlight")}</span
                  >
                  {$t("content.home.gm.3.pEnd")}
                </h4>
              </li>
              <li>
                <h4>
                  {$t("content.home.gm.4.pStart")}
                  <span style="color:aqua"
                    >{$t("content.home.gm.4.highlight")}</span
                  >
                  {$t("content.home.gm.4.pEnd")}
                </h4>
              </li>
            </ul>
            <svg
              class="waves"
              style="display:none; margin-top:80px;"
              viewBox="0 0 900 173"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 45.604L21.5 45.0841C43 44.4992 86 43.4594 128.8 39.235C171.7 35.0107 214.3 27.6019 257.2 20.778C300 13.9541 343 7.71508 385.8 3.68573C428.7 -0.343628 471.3 -2.03335 514.2 5.1155C557 12.2644 600 28.2518 642.8 28.8367C685.7 29.3566 728.3 14.409 771.2 8.36498C814 2.25596 857 5.11549 878.5 6.48027L900 7.91005V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V45.604Z"
                fill="#77AED7"
              />
              <path
                d="M0 30.0065L21.5 34.0359C43 38.0002 86 46.0589 128.8 50.6732C171.7 55.3524 214.3 56.6522 257.2 51.908C300 47.0988 343 36.3105 385.8 35.4006C428.7 34.5558 471.3 43.6543 514.2 48.6585C557 53.5977 600 54.5076 642.8 53.5327C685.7 52.5579 728.3 49.6983 771.2 48.5285C814 47.3587 857 47.7487 878.5 48.0086L900 48.2036V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V30.0065Z"
                fill="#083B60"
              />
              <path
                d="M0 100.845L21.5 96.1659C43 91.5516 86 82.1931 128.8 78.9437C171.7 75.6942 214.3 78.5537 257.2 76.929C300 75.3043 343 69.1952 385.8 71.7948C428.7 74.3944 471.3 85.7026 514.2 84.7277C557 83.7529 600 70.495 642.8 65.4258C685.7 60.3566 728.3 63.3462 771.2 67.5705C814 71.7948 857 77.2539 878.5 79.9185L900 82.6481V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V100.845Z"
                fill="#001E35"
              />
              <path
                d="M0 106.694L21.5 105.589C43 104.55 86 102.34 128.8 105.524C171.7 108.644 214.3 117.093 257.2 121.512C300 125.996 343 126.386 385.8 125.411C428.7 124.436 471.3 122.097 514.2 116.573C557 111.048 600 102.34 642.8 103.77C685.7 105.199 728.3 116.638 771.2 118.262C814 119.887 857 111.698 878.5 107.539L900 103.445V149.587H878.5C857 149.587 814 149.587 771.2 149.587C728.3 149.587 685.7 149.587 642.8 149.587C600 149.587 557 149.587 514.2 149.587C471.3 149.587 428.7 149.587 385.8 149.587C343 149.587 300 149.587 257.2 149.587C214.3 149.587 171.7 149.587 128.8 149.587C86 149.587 43 149.587 21.5 149.587H0V106.694Z"
                fill="#001220"
              />
              <path
                d="M0 169.915L21.5 170.964C43 171.951 86 174.049 128.8 171.026C171.7 168.064 214.3 160.043 257.2 155.848C300 151.59 343 151.22 385.8 152.146C428.7 153.071 471.3 155.292 514.2 160.537C557 165.781 600 174.049 642.8 172.692C685.7 171.334 728.3 160.475 771.2 158.933C814 157.39 857 165.164 878.5 169.113L900 173V129.194H878.5C857 129.194 814 129.194 771.2 129.194C728.3 129.194 685.7 129.194 642.8 129.194C600 129.194 557 129.194 514.2 129.194C471.3 129.194 428.7 129.194 385.8 129.194C343 129.194 300 129.194 257.2 129.194C214.3 129.194 171.7 129.194 128.8 129.194C86 129.194 43 129.194 21.5 129.194H0V169.915Z"
                fill="#001220"
              />
            </svg>
            <svg
              class="lines"
              style="margin-bottom:-6px; margin-right:-7px; z-index:-1;"
              viewBox="3 10 501.79 50.114"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                style="fill: var(--thirdColor); opacity: 0.7;"
                points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"
              />
              <polygon
                style="fill: var(--thirdColor); opacity: 0.7;"
                points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
    {#if modalShowing}
      <div class="modal">
        <h2>{modalTitle}</h2>
        <p>{modalDescription}</p>
      </div>
      <div id="overlay" on:click={() => (modalShowing = false)} />
    {/if}
    <!--<div display="none" use:closeModal on:click={closeModal} id="modal">
            <h2>Modal title</h2>
            <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test</p>
        </div>-->
  </div>
</section>

<style>
  :global(.soft-mode) .info {
    border: none;
    overflow: hidden;
    border-radius: 20px;
    color: white;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }
  :global(.soft-mode) .left {
    background-color: #ff9696;
  }
  :global(.soft-mode) #gm-info {
    margin-bottom: 90px;
  }
  .marker-highlight {
    background: url("../images/purple-brush4-v2.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80% 80%;
  }
  :global(.soft-mode) div.left > svg {
    display: block !important;
    position: absolute !important;
    bottom: -50px;
    left: -200px;
    width: 100%;
    transform: rotate(15deg);
  }
  :global(.soft-mode) .marker-highlight {
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: 70% 70% !important;
    background: url("../images/paint_splatter_notes.png");
  }
  :global(.soft-mode) .lines {
    display: none;
  }
  #overlay {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    opacity: 0.6;
    background-color: #000;
    visibility: visible;
  }
  .modal {
    padding: 20px;
    z-index: 10;
    max-width: 300px;
    max-height: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    position: fixed;
    background-color: rgb(34, 34, 34);
    display: block;
  }
  h4 {
    padding-left: 20px;
    padding-right: 20px;
    line-height: 30px;
    /*font-family:"Oswald";*/
  }
  .left h4 {
    margin-top: 20px;
    margin-bottom: 0px;
  }
  .info {
    background-color: rgb(14, 14, 14);
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    box-shadow: 0px 10px 5px 3px rgb(0, 0, 0, 0.5);
  }
  .left {
    border: 3px solid rgba(138, 43, 226, 0.5);
    transform: translateX(-290px);
  }
  ul {
    font-size: 1.3rem;
    /*font-family: "Oswald";*/
    text-align: left;
    list-style: none;
    padding-inline-start: 0;
  }
  .image {
    flex: 0 0 50%;
    width: 50%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .image img {
    position: relative;
    align-self: center;
    width: 500px;
  }
  .blurred {
    filter: blur(20px);
  }
  .GM-container {
    display: flex;
    max-width: 1220px;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    flex-direction: column;
  }
  .GM-section {
    display: flex;
    gap: 50px;
    margin-top: 20px;
    margin-bottom: 50px;
  }
  .first {
    order: 1;
    margin-left: -25px;
  }
  .second {
    order: 2;
  }
  .content {
    flex: 0 0 50%;
    overflow: hidden;
  }
  a {
    color: blueviolet;
    text-decoration: underline;
    cursor: pointer;
  }
  @media screen and (max-width: 820px) {
    :global(.soft-mode) div.left > svg {
      bottom: -40px !important;
      left: -15% !important;
    }
    .GM-container {
      width: 90%;
    }
    .GM-section {
      width: 100%;
      flex-direction: column;
      gap: 0;
      height: auto;
    }
    .modal {
      width: 100% !important;
    }
    :global(.soft-mode) .marker-highlight {
      padding-top: 30px;
      padding-bottom: 30px;
      background-size: 100% 100% !important;
    }
    .marker-highlight {
      background-size: 100% 100% !important;
    }
    .image {
      order: 1 !important;
      width: auto;
      margin-top: 30px;
      margin-bottom: 30px;
      margin-right: auto;
      margin-left: auto;
    }
    .image img {
      top: 0;
      left: 0;
      width: 75%;
    }
    .second {
      order: 1;
    }
    .first {
      order: 1;
      margin-left: auto;
    }
  }
</style>
