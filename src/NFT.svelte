<div class="NFT-container">
    <div class="section">
        <div class="image first">
            <img src="images/frame.png" />
        </div>
        <div class="content second">
            <ul>
                <h4 class="info right">{$_('home.nft.1.pStart')} <a on:click={() => showModal("benefits")}>{$_('home.nft.1.link')}</a></h4>
                <h4 class="info right">{$_('home.nft.2.pStart')} <a on:click={() => showModal("minting")}>{$_('home.nft.2.link')}</a> {$_('home.nft.2.pEnd')}</h4>
                <h4 class="info right">{$_('home.nft.3.pStart')} <a on:click={() => showModal("leaderboard")}>{$_('home.nft.3.link')}</a> {$_('home.nft.3.pEnd')}</h4>
                <h4 class="info right">{$_('home.nft.4.pStart')} <a on:click={() => showModal("token")}>{$_('home.nft.4.link')}</a> {$_('home.nft.4.pEnd')}</h4>
            </ul>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <h1 style="position: absolute; top: 40%; z-index:2; font-size: 2rem; font-family: 'Oswald'">Coming soon</h1>
            <img class="blurred" src="images/frame.png" />
        </div>
        <div class="content first">
            <div>
                <ul>
                    <h4 class="info left">{$_('home.nft.5.pStart')} <a on:click={() => showModal("blockchains")}>{$_('home.nft.5.link')}</a></h4>
                    <h4 class="info left">{$_('home.nft.6.pStart')} <a on:click={() => showModal("marketplaces")}>{$_('home.nft.6.link')}</a></h4>
                    <h4 class="info left">{$_('home.nft.7.pStart')} <a on:click={() => showModal("ipfs")}>{$_('home.nft.7.link')}</a></h4>
                    <h4 class="info left">{$_('home.nft.8.pStart')} <a on:click={() => showModal("arweave")}>{$_('home.nft.8.link')}</a></h4>
                </ul>
            </div>
        </div>
    </div>
    {#if modalShowing}
	<div class="modal">
        <h2>{modalTitle}</h2>
        <p>{modalDescription}</p>
	</div>
    <div id="overlay" on:click={() => modalShowing = false}></div>
    {/if}
    <!--<div display="none" use:closeModal on:click={closeModal} id="modal">
        <h2>Modal title</h2>
        <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test</p>
    </div>-->
    
</div>

<script>
    import { _ } from 'svelte-i18n'
    let modalShowing = false;
    let modalTitle = "modal";
    let modalDescription = "";
    let descriptions = {
        benefits: {title:"Level Rewards", description: "List of rewards users can earn from leveling up"},
        minting: {title:"Minting", description: "Description of minting process and NFTs"},
        leaderboard: {title:"Leaderboards", description: "Description of our various leaderboards"},
        token: {title:"Mint Token", description: "After you purchase a Mint Token, you can apply it to a challenge video you've already won to mint it into an NFT, or you can apply it to your next challenge making your next win a guaranteed mint."},
        blockchains: {title:"Blockchains", description: "We want to give our users the freedom to use the blockchain and NFT marketplaces of their choice. Mint your winning challenge videos directly to either Ethereum, Polygon, NEAR, Tezos, or Flow blockchains."},
        marketplaces: {title:"Marketplaces", description: "The option to mint to so many blockchains opens users up to selling their NFT on the worlds biggest NFT marketplaces like OpenSea and Rarible, on top of our own."},
        ipfs: {title:"IPFS", description: "The InterPlanetary File System is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices."},
        arweave: {title:"arweave", description: "Arweave is a new type of storage that backs data with sustainable and perpetual endowments, allowing users and developers to truly store data forever – for the very first time. As a collectively owned hard drive that never forgets, Arweave allows us to remember and preserve valuable information, apps, and history indefinitely. By preserving history, it prevents others from rewriting it."},
        ardrive: {title:"ardrive", description: "description"},
    }
    function showModal(title) {
        modalShowing = true;
        modalTitle = descriptions[title].title
        modalDescription = descriptions[title].description
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

<style>
    .card {
        display:block;
    }

    #overlay {
        position:fixed;
        z-index: 9;
        top:0;
        left:0;
        height:100vh;
        width:100%;
        opacity:0.6;
        background-color:#000;
        visibility: visible;
    }
    .modal {
        padding: 20px;
        z-index: 10;
        max-width: 300px;
        max-height: 500px;
        top:50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        position:fixed;
        background-color: rgb(34,34,34);
        display:block;
    }
    h4 {
        padding:20px;
        background-color: rgb(14,14,14);
        margin-bottom: 20px; 
        text-align:center;
        border: 3px solid rgba(0,255,255,0.5);
        box-shadow: 0px 10px 5px 3px rgb(0,0,0,0.5);       
    }
    .left {
        transform: translateX(-300px);  
    }
    .right {
        transform: translateX(300px); 
    }

    ul {
        font-size: 1.5rem;
        /*font-family: "Oswald";*/
        list-style: none;
        padding-inline-start:0;
    }
    .image{
        flex: 0 0 50%;
        width: 50%;
        display:flex;
        justify-content: center;
        position: relative;
        
    }
    .image img {
        position:relative;
        align-self:center;
        width: 300px;
        
    }
    .blurred {
        filter: blur(20px);
    }
    .NFT-container{
        display:flex;
        width:100%;
        margin-bottom:200px;
        flex-direction: column;
    }
    .section{
        display:flex;
        gap:50px;
        margin-top: 80px;
    }
    .first{
        order:1;
        margin-left:-25px;
    }
    .second{
        order:2;
    }
    .content{
        flex: 0 0 50%;
        overflow:hidden;
    }
    @media screen and (max-width: 820px) {
        .section {
            width: 100%;
            flex-direction: column;
            margin:0;
            gap:0;
            height:auto;
        }
        .modal {
            width: 100% !important;
        }
        .image {
            order:1 !important;
            width:auto;
            margin-top:30px;
            margin-bottom:30px;
            margin-right:auto;
            margin-left:auto;
        }
        .image img {
            top: 0;
            left: 0;
        }
        .second {
            order: 1;
        }
        .second img {
            margin-top: 75px;
        }
        .first{
            order:1;
            margin-left:auto;
        }
        .tooltips {
            display: none;
        }
        
    }
</style>