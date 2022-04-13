<section id="Tokens" style="background-image: url('images/bluewaves.svg')">
  <h2 class="section-title center" style="text-decoration-color: var(--fourthColor); -webkit-text-decoration-color: var(--fourthColor)">ALLSKILLS Token System</h2>
  <div class="vote-container">
    <div class="column-header"><h2 style="color:blueviolet">$VOTE Token</h2></div>
        <div class="section left">
          <span class="title">
              <img alt="Stable value" src="images/stable.png" />
              <h3>{$t('en.home.vote.stable.title')}</h3>
          </span>
          <p>{$t('en.home.vote.stable.pStart')} <span class="highlight">{$t('en.home.vote.stable.highlighted')}</span> {$t('en.home.vote.stable.pEnd')}</p>
      </div>
      <div class="section left">
        <span class="title">
            <img class="soft" alt="Vote" src="images/vote_soft.png" />
            <img class="hard" alt="Vote" src="images/vote.png" />
            <h3>{$t('en.home.vote.cast.title')}</h3>
        </span>
        <p>{$t('en.home.vote.cast.pStart')} <span class="highlight">{$t('en.home.vote.cast.highlighted')}</span> {$t('en.home.vote.cast.pEnd')}</p>
    </div>
        <div class="section left">
            <span class="title">
              <img class="soft" alt="Earnings" src="images/earnings_soft.png" />
              <img class="hard" alt="Earnings" src="images/earnings.png" />
              <h3>{$t('en.home.vote.win.title')}</h3>
              </span>
            <p>{$t('en.home.vote.win.pStart')} <span class="highlight">{$t('en.home.vote.win.highlighted')}</span> {$t('en.home.vote.win.pEnd')}</p>
        </div>
      <div class="column middle">
          <h1 id="value">1 $Vote ≈ $0.10</h1>
          <div class='coin'>
              <div class='front jump'>
                <div class='star'></div>
                <span class='currency' style="background-image:url('../images/logo-yellow-s.png')"></span>
                <div class='shapes'>
                  <div class='shape_l'>10¢</div>
                  <div class='shape_r'>10¢</div>
                  <span class='top'>Vote</span>
                  <span class='bottom'>Token</span>
                </div>
              </div>
              <div class='shadow'></div>
            </div>
            
          <!--<img id="token" alt="Vote Token" src="images/token.png" />-->
      </div>
      <div class="column-header"><h2 style="color:blueviolet">$SKILL Token</h2></div>
      <div class="section right">
        <span class="title">
            <img class="soft" alt="Stake" src="images/stake_soft.png" />
            <img class="hard" alt="Stake" src="images/stake.png" />
            <h3>{$t('en.home.vote.earn.title')}</h3>
        </span>
        <p>{$t('en.home.vote.earn.pStart')} <span class="highlight">{$t('en.home.vote.earn.highlighted')}</span> {$t('en.home.vote.earn.pEnd')}</p>
    </div>
          <div class="section right">
              <span class="title">
                <img class="soft" alt="Royalties" src="images/revenue_soft.png" />
                <img class="hard" alt="Royalties" src="images/revenue.png" />
                  <h3>{$t('en.home.vote.marketplace.title')}</h3>
              </span>
              <p>{$t('en.home.vote.marketplace.pStart')} <span class="highlight">{$t('en.home.vote.marketplace.highlighted')}</span> {$t('en.home.vote.marketplace.pEnd')}</p>
          </div>
          <div class="section right">
              <span class="title">
                  <img class="soft" alt="Replenish" src="images/replenish_soft.png" />
                  <img class="hard" alt="Replenish" src="images/replenish.png" />
                  <h3>{$t('en.home.vote.utility.title')}</h3>
              </span>
              <p>{$t('en.home.vote.utility.pStart')} <span class="highlight">{$t('en.home.vote.utility.highlighted')}</span></p>
          </div>
  </div>
</section>
<script>
    import { t } from '$lib/translations/index.js';
</script>
<style>
    :global(.soft-mode) #Tokens{
        padding-top: 400px;
        color: var(--fourthColor);
        background-size:cover;
        background-repeat: no-repeat;
    }
    #Tokens {
      background-size: 0;
    }
    .column-header {
      background:white;
      color: rgb(30,30,30);
      border-radius: 40px;
      width: 90%;
      text-align: center;
      margin-bottom:30px;
      margin-left:auto;
      margin-right:auto;
    }
    .soft {
        display: none;
    }
    :global(.soft-mode) .soft {
        display: block !important;
    }
    :global(.soft-mode) .hard {
        display: none;
    }
    .section:hover h3 {
        text-decoration-line: underline;
        text-decoration-color:gold;
        -webkit-text-decoration-line: underline;
        -webkit-text-decoration-color: gold;
    }
    #value{
        font-family: 'Oswald';
        grid-area: value;
        color: var(--highlight);
    }
    .highlight {
        color: var(--highlight);
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
       color: var(--baseText);
         /*font-family:'Lato'; */
    }
    .section p{
        margin-left: 42px;
        font-family: "Lato";
        font-size: 1.25vw;
        line-height: 1.5vw;
        font-weight:400;
    }
    :global(.soft-mode .section) p {
        background-color: white;
        border-radius: 15px;
        font-size: 1.2rem !important;
        padding: 15px;
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
        max-width: 1220px;
        margin-top:100px;
        padding-bottom:100px;
        margin-left:auto;
        margin-right:auto;
        display:grid;
        min-height:525px;
        margin-bottom:200px;
        margin-left:auto;
        margin-right:auto;
        grid-template-columns: 1fr 1.25fr 1fr !important;
        justify-content: space-evenly;
        grid-template:
            "left middle right"
            "left middle right"
            "left middle right"
            "left middle right";
          grid-auto-flow:column;
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
            width: 90%;
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
    top: -15px;
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
  width: 97%;
  height: 99%;
  text-align: center;
  text-shadow: 0 3px 0 #cb7407;
  z-index: 3;
  border-radius: 50%;
}
.currency {
    background-repeat: no-repeat;
    background-size: 30%;
    background-position: center;
}
.coin .front .currency:after, .coin .back .currency:after {
  content: "";
  position: absolute;
  height: 210px;
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
    margin: 45px -75px;
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
  margin: 63px 0px;
  font-size: 20px;
  color: #cb7407;
}
/*.coin .front .shapes div:before, .coin .back .shapes div:before {
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
}*/
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
  top: 0;
  font-family:"Oswald";
  left: 0;
}
.coin .front .bottom, .coin .back .bottom {
  font-size: 24px;
  color: #d67f08;
  text-align: center;
  width: 100%;
  position: absolute;
  font-family:"Oswald";
  left: 0;
  bottom: 5px;
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
