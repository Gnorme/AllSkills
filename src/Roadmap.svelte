<div class="roadmap-container">
    <div class="roadmap-card" style="height:60%;">
        <h3 style="color:white;">2019 - 2020</h3>
        <div class="header" style="border-bottom: 5px solid #363636">
            <img alt="Idea" src="images/idea_sw.png" />
        </div>
        <div class="text">
            <ul>
                <li class="cleared">Ideation</li>
                <li class="cleared">Business plan</li>
                <li class="cleared">Feasibility study</li>
                <li class="cleared">Olympic skater Charles Hamelin joins project</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:70%;">
        <h3 style="color:#852ee7">2021</h3>
        <div class="header" style="border-bottom: 5px solid #852ee7">
            <img alt="New Direction" src="images/leadership_sw.png" />
        </div>
        <div class="text">
            <ul>
                <li class="cleared">Markest research</li>
                <li class="cleared">Acquired advisors & CTO</li>
                <li class="cleared">Backed by PME Montreal </li>
                <li class="cleared">Finalists in NBA Launchpad</li>
                <li class="cleared">Pivot towards NFT platform</li>
                <li class="cleared">Launch website</li>
                <li class="cleared">Release whitepaper and tokenomics</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:80%;">
        <h3 style="color:#e0573f">Q1 2022</h3>
        <div class="header" style="border-bottom: 5px solid #e0573f">
            <img alt="Pre-launch plan" src="images/planning_sw.png" />
        </div>
        <div class="text">
            <ul>
                <li>Announce partners</li>
                <li class="cleared">Setup social accounts</li>
                <li class="cleared">Release marketing plan</li>
                <li>Reveal plan for Ambassador program</li>
                <li>Reveal first AllSkills Ambassadors</li>
                <li>Mint governance token</li>
                <li>Trailer</li>
                <li>Token presale</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:90%;">
        <h3 style="color:#ecec37;">Q2 2022</h3>
        <div class="header" style="border-bottom: 5px solid #ecec37">
            <div style="position:relative; display:inline-grid;">
                <img style="max-height:100px;" alt="Launch plans" src="images/launch_no_ex.png" />
                <div class="test" style="transform: rotate(-140deg) scale(0.7) translate(70px,0px); z-index: -1;">
                    <div class="container">
                        <div class="red flame"></div>
                        <div class="orange flame"></div>
                        <div class="yellow flame"></div>
                        <div class="white flame"></div>
                        <div class="blue circle"></div>
                        <div class="black circle"></div>
                    </div>
                </div>
            </div>  
        </div>
        <div class="text">
            <ul>
                <li>Mint stablecoin Vote token</li>
                <li>Launch closed beta</li>
                <li>Full release of challenge system and marketplace</li>
                <li>Release of ambassador program</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:100%;">
        <h3 style="color: aqua;">Q3+ 2022</h3>
        <div class="header" style="border-bottom: 5px solid aqua">
            <img alt="Post launch plans" src="images/globalization_sw.png" />
        </div>
        <div class="text">
            <ul>
                <li>Release unique Tap-to-Record feature</li>
                <li>Release Scout mode</li>
                <li>Add more cosmetics and editing features</li>
                <li>Release GM mode</li>
            </ul>
        </div>
    </div>
    <div class="info">
        <p>Join our Discord and follow our Twitter to get access to the latest announcements and enter raffles to earn prizes from our Ambassadors</p>
    </div>
</div>

<style>
    /* <img alt="Launch plans" src="images/launch_sw.png" />*/
    .rocket {
        background-image: url("../images/launch_sw.png");
        background-size: 45% 45%;
        background-repeat: no-repeat;
        background-position-x: center;
    }
.container::after {
    content: '';
    background-image: url("../images/launch_sw.png");
        background-size: 45% 45%;
        background-repeat: no-repeat;
        background-position-x: center;    
}
.container{
  position:relative;
  transform-origin:center bottom;
  animation-name: flicker;
  animation-duration:3ms;
  animation-delay:200ms;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.flame{
  bottom:0;
  position:absolute;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  transform:rotate(-45deg);
}

.yellow{
  left:15px; 
  width: 30px;
  height: 30px;
  background:gold;
  box-shadow: 0px 0px 9px 4px gold;
}

.orange{
  left:10px; 
  width: 40px;
  height: 40px;
  background:orange;
  box-shadow: 0px 0px 9px 4px orange;
}

.red{
  left:5px;
  width: 50px;
  height: 50px;
  background:OrangeRed;
  box-shadow: 0px 0px 5px 4px OrangeRed;
}

.white{
  left:15px; 
  bottom:-4px;
  width: 30px;
  height: 30px;
  background:white;
  box-shadow: 0px 0px 9px 4px white;
}

.circle{
  border-radius: 50%;
  position:absolute;  
  transform:rotate(180deg) 
}

.blue{
  width: 10px;
  height: 10px;
  left:25px;
  bottom:-25px; 
  background: SlateBlue;
  box-shadow: 0px 0px 15px 10px SlateBlue;
}

.black{
  width: 40px;
  height: 40px;
  left:10px;
  bottom:-60px;  
  background: black;
  box-shadow: 0px 0px 15px 10px black;
}

@keyframes flicker{
  0%   {transform: rotate(-1deg);}
  20%  {transform: rotate(1deg);}
  40%  {transform: rotate(-1deg);}
  60%  {transform: rotate(1deg) scaleY(1.04);}
  80%  {transform: rotate(-2deg) scaleY(0.92);}
  100% {transform: rotate(1deg);}
}
    .cleared::after {
        margin-left: 10px;
        font-weight: 600;
        font-size:16px;
        opacity: 0;
        content: '\2713';
        color: aqua;
    }
    .info {
        position:absolute;
        color: #852ee7 ;
        top:0%;
        left:2%;
        width: 30%;
    }
    .info p {
        padding: 10px;
        font-weight: 600;
        font-size: 13px;
        font-family: "Raleway";
        letter-spacing: 0.5px;
    }
    img {
        height: 100%;
    }
    ul{
        list-style:none;
        margin-left:0;
        padding-left:0;
        letter-spacing: 0.8px;
        line-height:1.2rem;
        font-size: 0.9rem;
        margin-top:3px;
        font-weight:200;
        /*font-family:"Roboto", "Lato", sans-serif;*/
    }
    h3 {
        font-family: "Oswald";
        text-align:center;
        letter-spacing:1px;
        margin-bottom:2rem;
        margin-top: 30px;
        font-size:1.3em;
        font-weight:100;
        text-shadow: 0px 4px 3px black;
    }
    .header {
        height: 100px;
        padding-bottom: 20px;
        text-align:center;
    }
    .text {
        flex-grow: 1;
        margin-top: 1rem;
    }
    .roadmap-container {
        display:flex;
        padding-top:20px;
        margin-bottom:200px;
        justify-content: space-between;
        width: 100%;
        height: 80vh;
        align-items: flex-end;
        position:relative;
    }
    .roadmap-card {
        width:18%;
        display:flex;
        flex-direction: column;
        transition: transform 0.2s;
    }
    .roadmap-card:hover .header {
        transform: scale(1.05);
    }
    .roadmap-card:hover h3{
        text-shadow: 0px 0px 15px rgba(255,255,255,0.5);
    }
    @media screen and (max-width: 820px) {
        .roadmap-card {
            width: 100%;
        }
        .roadmap-container {
            flex-direction: column;
            height: auto;
        }
        ul {
            font-size: 1rem;
        }
        .info {
            position:relative;
            width:auto;
            margin-top: 30px;
        }
        .info p {
            font-size:16px !important;
        }
    }
</style>