<div class="vote-container">
       <div class="section left">
           <span class="title">
            <img alt="Vote" src="images/vote.png" />
                <h3>Cast your vote</h3>
            </span>
           <p>Show your support by voting for the challenge video you like most. All votes form a <span class="highlight">reward pool</span> and decide the winning video.</p>
       </div>
       <div class="section left">
        <span class="title">
            <img alt="Earnings" src="images/earnings.png" />
             <h3>Earn through voting</h3>
         </span>
        <p>The reward pool is split between the winner and all those who voted for them. <span class="highlight">Earn up to 145%</span> back for votes cast on winning videos.</p>
    </div>
    <div class="section left">
        <span class="title">
            <img alt="Royalties" src="images/revenue.png" />
             <h3>Share in the success</h3>
         </span>
        <p>Voters continue to share in the success by <span class="highlight">earning royalties</span> everytime a video they voted for is sold on any marketplace.</p>
    </div>
    <div class="column middle">
        <h1 id="value">1 $Vote ≈ $0.10</h1>
        <img id="token" alt="Vote Token" src="images/token.png" />
    </div>
        <div class="section right">
            <span class="title">
                <img alt="Stable value" src="images/stable.png" />
                 <h3>Redeemable at stable value</h3>
             </span>
            <p>$Vote tokens are <span class="highlight">backed by fiat reserves</span> at 1:1 ratio and will always be redeemable at a stable value.</p>
        </div>
        <div class="section right">
            <span class="title">
                <img alt="Stake" src="images/stake.png" />
                 <h3>Stake to earn more</h3>
             </span>
            <p>Staking your $Vote tokens allows you to <span class="highlight">earn $Skills tokens.</span> Use $Skills tokens to participate in raffles and to voice your opinion.</p>
        </div>
        <div class="section right">
            <span class="title">
                <img alt="Replenish" src="images/replenish.png" />
                 <h3>Easily replenish your wallet</h3>
             </span>
             <p>If you run out of Vote tokens, you can <span class="highlight">watch sponsored videos to earn more</span> and get right back in the game. </p>
        </div>
</div>

<style>
    .middle:hover h1 {
        text-decoration: underline aqua;
    }
    .section:hover h3 {
        text-decoration: underline aqua;
        -webkit-text-decoration-line: underline;
        -webkit-text-decoration-color: aqua;
    }
    #token {
        grid-area: token;
    }
    #value{
        font-family: 'Ultra'; 
        font-family: 'Asphaltic'; 
        font-family: 'Oswald';
        grid-area: value;
    }
    .highlight {
        color: aqua;
    }
    .middle img {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
        margin-bottom: 50px;
        height: auto;
    }
    .middle {
        text-align:center; 
        display:flex; 
        flex-direction: column;
        align-items:center;
        justify-content: center;
        grid-area:middle;
        margin-left:auto;
        margin-right:auto;
    }
    h3 {
       margin:0;
       font-size:1.75vw;
       font-weight:400;
       font-family:"Oswald";
         /*font-family:'Lato'; */
    }
    .section p{
        margin-left: 42px;
        font-family: "BentonSans";
        font-size: 1.25vw;
        line-height: 1.5vw;
        font-weight:100;
    }
    .section img{
        float:left;
        margin-right: 10px;
        width: 32px;
        height: 32px;
    }
    .section .title {
        margin-right: -7%;
        display: inline-flex;
        align-items: center;
    }
    h1 {
        color: aqua;
        font: "Lato";
    }
    .column {
        width: 80%;
    }
    .vote-container{
        display:grid;
        min-height:525px;
        margin-bottom:300px;
        margin-left:auto;
        margin-right:auto;
        grid-template-rows: 33% !important;
        grid-template-columns: 1fr 1.25fr 1fr !important;
        justify-content: space-evenly;
        grid-template:
            "left middle right"
            "left middle right"
            "left middle right";
    }
    @media screen and (min-width: 1920px) {
        p {
            font-size: 1rem !important;
        }
    }
    @media screen and (max-width: 820px) {
        .vote-container {
            display:flex;
            flex-direction: column;
            height: auto;
            max-height: 100%;
        }
        .column{
            width: 100%;
        }
        p {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
        }
        h3 {
            font-size: 1.75rem !important;
        }
    }
</style>
