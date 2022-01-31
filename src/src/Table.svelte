<div class="table-content" id="Table">
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
        <p>Collect unique moments from talented creators. Winning challenge videos have the opportunity to be minted into NFT collectibles that can be traded on our NFT marketplace.</p>
    </div>
    <div class="grid-item">
        <div class="table-icon"><img alt="Marketplace" style="width:100%" src="images/auction.png"></div>
        <h3>NFT Marketplace</h3>
        <p>Buy and Sell winning challenge moments on our NFT Marketplace to increase your collection. Royalties from collectible sales are distributed to the video creator and voters.</p>
    </div>
</div>

<style>
    @media screen and (max-width: 820px) {
        .table-content {
            display:block !important;
            border: 2px solid aqua !important;
        }
        h3 {
            font-size: 2.5rem !important;
        }
        .grid-item{
            grid-template: 
                "a b b"
                "c c c"
                "c c c" !important;
            padding: 1.25rem !important;
            border: 2px solid aqua !important;
        }
        .table-icon {
            padding-right:1.25rem !important;
            height:100px !important;
            min-width: 50px !important;
        }
    }
    h3 {
        font-size: 3rem;
        margin-top:0;
        margin-block-start:0;
        margin-block-end:0;
        font-weight: 500;
        font-family: "Oswald";
        grid-area: b;
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
        margin-left:auto;
        margin-right:auto;
        max-width: 1180px;
        margin-top:3rem;
        margin-bottom:3rem;
        color: white;
        border: 3px solid aqua;
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
</style>