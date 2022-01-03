<script>
    import TeamCards from './TeamCards.svelte'
    import Roadmap from './Roadmap.svelte'
    import Tokenomics from './Tokenomics.svelte';
    import Challenge from './Challenge.svelte';
    import Challengev from './Challengev.svelte';
    import VoteToken from './VoteToken.svelte';
    import Roadmapv from './Roadmapv2.svelte';
    import Carousel from './Carousel.svelte';
    import Carouselv from './Carouselv.svelte';

	const images = [
		{path: 'images/bass.jpg', id: 'image1'},
		{path: 'images/Dunk.jpg', id: 'image2'},
		{path: 'images/skateboard.jpg', id: 'image3'},
		{path: 'images/runner.jpg', id: 'image4'},
		// {path: 'images/image6.jpg', id: 'image6'},
	]
</script>

<!-- 
 <div id="Trailer" class="content">
    <div class="card"><img src="images/bass.jpg" /></div>
    <div class="card"><img src="images/Dunk.jpg" /></div>
    <div class="card"><img src="images/skateboard.jpg" /></div>
    <div class="card"><img src="images/runner.jpg" /></div>
</div>
-->

    <Carouselv />
    <!--<Carousel 
        {images}
        imageWidth={350}
        imageSpacing={15}
        controlColor={'white'}
        controlScale={0.8}
        displayControls={true}
        autoplay={true}
        autoplaySpeed={3000}
    />-->



<div class="text-content">
    <h2 style="margin-left:7%;">What We Provide</h2>
    <div class="table-content">
        <div class="grid-item">
            <div class="table-icon"><img alt="Handshake" style="width:100%" src="images/handshake.png"></div>
            <h3>Skills Competition</h3>
            <p>Using our platform, creators can challenge others using a video showcasing their talents. Challenge winners are decided by a community vote and all votes enter a reward pool that gets distrubuted to the winning creator and all those who voted for it to win.</p>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Earnings" style="width:100%" src="images/earn.png"></div>
            <h3>Earning Potential</h3>
            <p>Our carefully crafted royalties system and stablecoin Vote token will allow both creators and consumers of content to earn money. Creators can earn by winning challenges and viewers can earn by voting.</p>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Collectibles" style="width:100%" src="images/stamps.png"></div>
            <h3>NFT Collectibles</h3>
            <p>Collect unique moments from talented creators. Winning challenge videos are minted into NFT collectibles that can be traded on our NFT marketplace.</p>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Marketplace" style="width:100%" src="images/auction.png"></div>
            <h3>NFT Marketplace</h3>
            <p>Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters.</p>
        </div>
    </div>
    <div class="powered-by">
        <h3><span style="color:aqua;">AllSkills</span> is powered by cryptocurrency, using <span style="background-color:aqua; color: rgb(30,30,30);">future-proof blockchain & smart contract technology</span> to connect talented people and audiences, and foster skill development through competition, all while providing <span style="background-color: aqua; color: rgb(30,30,30);">incentives for everyone involved.</h3>
    </div>
    <div id="Challenge" class="section">
        <h2>Challenge System</h2>
        <Challengev/>
    </div>
    <div id="Stablecoin" class="section">
        <h2 style="text-align: center;">AllSkills $Vote Token</h2>
        <VoteToken/>
    </div>
    <div id="Roadmap" class="section">
        <h2>Roadmap & Milestones</h2>
        <Roadmapv/>
    </div>
    <div id="Tokenomics" class="section">
        <h2 style="text-align: center;">Tokenomics</h2>
        <div class="section">
            <Tokenomics/>
        </div>
    </div>
    <div id="Team" class="section">
        <h2>The Team</h2>
        <TeamCards/>
    </div>
    <div id="Partners" style="width: 100%;">
        <h2 style="margin-left:7%">Partners</h2>
    </div>
    <div id="News" style="width: 100%;">
        <h2 style="margin-left:7%">News</h2>
    </div>
</div>
<style>   /* rgb(143,255,238) */
.section {
    width: 85%;
    padding-left:7%;
    padding-right:7%;
}
    p {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight:100;
        font-family: "BentonSans";
        padding-top:2.5rem;
        margin-block-start:0;
        grid-area: c;
    }
    .table-icon {
        align-items: center;
        grid-area:a;
        display:grid;
        padding-right:2rem;
    }
    h3 {
        font-size: 3rem;
        line-height: 1.5;
        margin-top:0;
        margin-block-start:0;
        margin-block-end:0;
        font-weight: 500;
        font-family: "Oswald";
        grid-area: b;
    }
    .powered-by{
        margin-top: 20rem;
        margin-bottom: 20rem;
        width:85%;
        padding-left:7%;
        padding-right:7%;
        text-align: center;
    }
    .grid-item{
        display:grid;
        grid-template:
            "a b b"
            "a c c"
            "a c c";
        padding: 2rem;
        border: 3px solid aqua;
    }
    .table-content{
        display:grid;
        margin-left:10%;
        margin-right:10%;
        margin-top:3rem;
        margin-bottom:3rem;
        color: white;
        border: 3px solid aqua;
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
    @media screen and (max-width: 820px) {
        .table-content {
            display:block;
        }
        h3 {
            font-size: 2.5rem;
        }
        h2 {
            text-align:center !important;
        }
        .grid-item{
            grid-template: 
                "a b b"
                "c c c"
                "c c c";
            padding: 1.25rem;
        }
        .table-icon {
            padding-right:1.25rem;
            height:100px;
            min-width: 50px;
        }
    }
    h2 {
        text-align:left;
        min-width:50%;
        font-size: 4.5rem;
        line-height: 1;
        font-family:'Oswald';
        margin-bottom:125px;
        /*font-family: 'Lato', sans-serif !important;
        font-family: 'Roboto', sans-serif;*/
    }
    .text-content {
        margin-left: auto;
        margin-right: auto;
  align-items: center; 
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
   box-sizing: border-box;
    }
 .card{
     height: 800px;
     max-width: 23%;
     background: rgb(56,56,56);
     transform: skewX(-5deg);
     margin-top:-20px;
     min-width:10%;
     box-shadow: 10px 10px rgba(0,0,0,0.3);
    transition-property: min-width;
    transition: 500ms linear;
     overflow:hidden;
    }

    .card:hover {
        min-width:75%;
        
    }
.content{
    margin-top:100px;
    margin-right:2%;
    max-width:100%;
    margin-left:1%;
    background-color:rgb(30,30,30);
    flex-direction:row;
    height: 900px;
    display:flex;
    width: 100%;
    justify-content: center;
}
</style>