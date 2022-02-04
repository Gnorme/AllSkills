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
        <div class='coin'>
            <div class='front jump'>
              <div class='star'></div>
              <span class='currency'>10c</span>
              <div class='shapes'>
                <div class='shape_l'></div>
                <div class='shape_r'></div>
                <span class='top'>Vote</span>
                <span class='bottom'>Token</span>
              </div>
            </div>
            <div class='shadow'></div>
          </div>
          
        <!--<img id="token" alt="Vote Token" src="images/token.png" />-->
    </div>
        <div class="section right">
            <span class="title">
                <img alt="Stable value" src="images/stable.png" />
                 <h3>Stablecoin for all skills</h3>
             </span>
            <p>$Vote tokens are <span class="highlight">backed by fiat reserves</span> at 1:1 ratio and will always be redeemable at a stable value.</p>
        </div>
        <div class="section right">
            <span class="title">
                <img alt="Stake" src="images/stake.png" />
                 <h3>Stake to earn more</h3>
             </span>
            <p>Staking your $Skills tokens allows you to <span class="highlight">earn $Vote tokens.</span> $Skills tokens can also be used to participate in raffles, pay gas fees, and to declare how you think AllSkills should operate.</p>
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
:root {
  --face: #be9d66;
  --lowlight: #111;
  --side: #896c3b;
  --side-dark: #120e08;
  --coin-size: 15rem;
  --coin-face: url('../images/token.png');
}


/*
  everything above is positioning and variables.
  this is where the real fun begins...
*/

/*.coin {
  height: var(--coin-size);
  width: var(--coin-size);
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.coin::before {
  content: '';
  display: block;
  position: relative;
  height: var(--coin-size);
  width: var(--coin-size);
  border-radius: 50%;
  background-color: var(--face);
  animation: spin 1.5s linear infinite;
  -webkit-animation: spin 1.5s linear infinite;
  background-image: var(--coin-face);
  background-size: 100% 100%;
  background-position: center;
  background-blend-mode: overlay;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}*/


@keyframes spin {
  0% {
    width: var(--coin-size);
    box-shadow:
      0 0 0 var(--side-dark);
    animation-timing-function: ease-in;
    -webkit-animation-timing-function: ease-in;
  }
  
  49.999% {
    width: 0.1rem;
    box-shadow:
      0.05rem 0 0 var(--side),
      0.1rem 0 0 var(--side),
      0.15rem 0 0 var(--side),
      0.2rem 0 0 var(--side),
      0.25rem 0 0 var(--side),
      0.3rem 0 0 var(--side),
      0.35rem 0 0 var(--side),
      0.4rem 0 0 var(--side),
      0.45rem 0 0 var(--side),
      0.5rem 0 0 var(--side),
      0.55rem 0 0 var(--side),
      0.6rem 0 0 var(--side),
      0.65rem 0 0 var(--side),
      0.7rem 0 0 var(--side),
      0.75rem 0 0 var(--side);
      transform: translate3d(-0.375rem, 0, 0);
    -webkit-transform: translate3d(-0.375rem, 0, 0);
    background-color: var(--lowlight);
    animation-timing-function: linear;
    -webkit-animation-timing-function: linear;
  }
  
  50.001% {
    width: 0.1rem;
    box-shadow:
      -0.05rem 0 0 var(--side),
      -0.1rem 0 0 var(--side),
      -0.15rem 0 0 var(--side),
      -0.2rem 0 0 var(--side),
      -0.25rem 0 0 var(--side),
      -0.3rem 0 0 var(--side),
      -0.35rem 0 0 var(--side),
      -0.4rem 0 0 var(--side),
      -0.45rem 0 0 var(--side),
      -0.5rem 0 0 var(--side),
      -0.55rem 0 0 var(--side),
      -0.6rem 0 0 var(--side),
      -0.65rem 0 0 var(--side),
      -0.7rem 0 0 var(--side),
      -0.75rem 0 0 var(--side);
    transform: translate3d(0.375rem, 0, 0);
    -webkit-transform: translate3d(0.375rem, 0, 0);
    background-color: var(--lowlight);
    animation-timing-function: ease-out;
    -webkit-animation-timing-function: ease-out;
  }
  
  100% {
    width: var(--coin-size);
    box-shadow:
      0 0 0 var(--side-dark);
  }
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
    .middle {
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
        margin-bottom:200px;
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
span {
  font-family: "Montserrat", sans-serif;
}

.jump {
  animation: jump 1.5s infinite ease;
}
@keyframes jump {
  0% {
    top: 0;
  }
  50% {
    top: -40px;
  }
  100% {
    top: 0;
  }
}

.coin {
  margin: auto;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  top: 50px;
  height: 300px;
  width: 150px;
}

.coin .front, .coin .back {
  position: absolute;
  height: 150px;
  width: 150px;
  background: #ffbd0b;
  border-radius: 50%;
  border-top: 7px solid #ffd84c;
  border-left: 7px solid #ffd84c;
  border-right: 7px solid #d57e08;
  border-bottom: 7px solid #d57e08;
  transform: rotate(44deg);
}
.coin .front:before, .coin .back:before {
  content: "";
  margin: 35.5px 35.5px;
  position: absolute;
  width: 70px;
  height: 70px;
  background: #f0a608;
  border-radius: 50%;
  border-bottom: 5px solid #ffd84c;
  border-right: 5px solid #ffd84c;
  border-left: 5px solid #d57e08;
  border-top: 5px solid #d57e08;
  z-index: 2;
}
.coin .front .currency, .coin .back .currency {
  overflow: hidden;
  position: absolute;
  color: #ffbd0b;
  font-size: 32px;
  transform: rotate(-44deg);
  line-height: 4.5;
  width: 100%;
  height: 100%;
  text-align: center;
  text-shadow: 0 3px 0 #cb7407;
  z-index: 3;
  border-radius: 50%;
}
/*.currency {
    background-repeat: no-repeat;
    background-size: 69%;
    background-position: center;
    background-image: url("../images/coin.png")
}*/
.coin .front .currency:after, .coin .back .currency:after {
  content: "";
  position: absolute;
  height: 200px;
  width: 40px;
  margin: 20px -65px;
  box-shadow: 50px -23px 0 -10px rgba(255, 255, 255, 0.22), 85px -10px 0 -16px rgba(255, 255, 255, 0.19);
  transform: rotate(-50deg);
  animation: shine 1.5s infinite ease;
}
@keyframes shine {
  0% {
    margin: 20px -65px;
  }
  50% {
    margin: 70px -85px;
  }
  100% {
    margin: 20px -65px;
  }
}
.coin .front .shapes, .coin .back .shapes {
  transform: rotate(-44deg);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.coin .front .shapes div, .coin .back .shapes div {
  width: 20px;
  height: 4px;
  background: #d57e08;
  border-top: 2px solid #c47207;
  margin: 75px 7px;
}
.coin .front .shapes div:before, .coin .back .shapes div:before {
  content: "";
  position: absolute;
  width: 20px;
  height: 4px;
  background: #d57e08;
  border-top: 2px solid #c47207;
  margin: -10px 0;
}
.coin .front .shapes div:after, .coin .back .shapes div:after {
  content: "";
  position: absolute;
  width: 20px;
  height: 4px;
  background: #d57e08;
  border-top: 2px solid #c47207;
  margin: 8px 0;
}
.coin .front .shape_l, .coin .back .shape_l {
  float: left;
}
.coin .front .shape_r, .coin .back .shape_r {
  float: right;
}
.coin .front .top, .coin .back .top {
  font-size: 24px;
  color: #d67f08;
  text-align: center;
  width: 100%;
  position: absolute;
  left: 0;
}
.coin .front .bottom, .coin .back .bottom {
  font-size: 24px;
  color: #d67f08;
  text-align: center;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}

.coin .shadow {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.4);
  left: 0;
  bottom: -50px;
  border-radius: 50%;
  z-index: -1;
  margin: 185px 7px 0 7px;
  animation: swift 1.5s infinite ease;
}
@keyframes swift {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.8;
  }
}
</style>
