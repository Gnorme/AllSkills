<div class="vote-container">
    <div class="column">
       <div class="section">
           <span class="title">
            <img src="images/vote.png" />
                <h3>Cast your vote</h3>
            </span>
           <p>Show your support by voting for the challenge video you like most. All votes form a <span class="highlight">reward pool</span> and decide the winning video.</p>
       </div>
       <div class="section">
        <span class="title">
            <img src="images/earnings.png" />
             <h3>Earn through voting</h3>
         </span>
        <p>The reward pool is split between the winner and all those who voted for them. <span class="highlight">Earn up to 145%</span> back for votes cast on winning videos.</p>
    </div>
    <div class="section">
        <span class="title">
            <img src="images/revenue.png" />
             <h3>Share in the success</h3>
         </span>
        <p>Voters continue to share in the success by <span class="highlight">earning royalties</span> everytime a video they voted for is sold on any marketplace.</p>
    </div>
    </div>
    <div class="column middle">
        <h1 id="value">1 $Vote ≈ $0.10</h1>
        <img src="images/token.png" />
    </div>
    <div class="column">
        <div class="section">
            <span class="title">
                <img src="images/stable.png" />
                 <h3>Redeemable at stable value</h3>
             </span>
            <p>$Vote tokens are <span class="highlight">backed by fiat reserves</span> at 1:1 ratio and will always be redeemable at a stable value.</p>
        </div>
        <div class="section">
            <span class="title">
                <img src="images/stake.png" />
                 <h3>Stake to earn more</h3>
             </span>
            <p>Staking your $Vote tokens allows you to <span class="highlight">earn $Skills tokens.</span> Use $Skills tokens to participate in raffles and to voice your opinion.</p>
        </div>
        <div class="section">
            <span class="title">
                <img src="images/replenish.png" />
                 <h3>Easily replenish your wallet</h3>
             </span>
             <p>If you run out of Vote tokens, you can <span class="highlight">watch sponsored videos to earn more</span> and get right back in the game. </p>
        </div>
    </div>
</div>

<style>
    #value{
        font-family: 'Ultra'; 
        font-family: 'Asphaltic'; 
        font-family: 'Oswald';
    }
    .highlight {
        color: aqua;
    }
    .middle img {
        width: 90%;
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
    }
    h3 {
       margin:0;
       font-size:1.35rem;
       font-weight:400;
       font-family:"Raleway";
         /*font-family:'Lato'; */
    }
    .section p{
        margin-left: 42px;
        font-family: "Montserrat";
        font-size: 1.05rem;
        font-weight:100;
    }
    .section img{
        float:left;
        margin-right: 10px;
        width: 32px;
        height: 32px;
    }
    .section .title {
        display: inline-flex;
        align-items: center;
    }
    .section {
        height: 33%;
        width: 100%;
    }
    .icon {
        height: 100%
    }
    h1 {
        color: aqua;
        font: "Lato";
    }
    .column {
        width: 25%;
    }
    .vote-container{
        display:flex;
        height: 75vh;
        max-height: 600px;
        min-height:525px;
        margin-bottom:300px;
        margin-left:auto;
        margin-right:auto;
        justify-content: space-evenly;
    }
    @media screen and (max-width: 820px) {
        .vote-container {
            flex-direction: column;
            height: auto;
            max-height: 100%;
        }
        .column{
            width: 100%;
        }
    }
    .floated{
        float:right;
        width:25%;
        margin: 10px;
        height: 250px;
        background-color: black;
    }
</style>
