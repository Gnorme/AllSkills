<div class="roadmap-container">
    <div class="roadmap-card" style="height:60%;">
        <h3 style="color:white;">2019 - 2020</h3>
        <div class="header" style="border-bottom: 5px solid #363636">
            <img alt="Idea" src="images/idea.png" />
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
            <img alt="New Direction" src="images/leadership.png" />
        </div>
        <div class="text">
            <ul>
                <li class="cleared">Markest research</li>
                <li class="cleared">Acquired advisors & CTO</li>
                <li class="cleared">Backed by PME Montreal </li>
                <li class="cleared">Finalists in NBA Launchpad</li>
                <li class="cleared">Pivot towards NFT platform</li>
                <li>Launch website</li>
                <li>Release whitepaper and tokenomics</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:80%;">
        <h3 style="color:#e0573f">Q1 2022</h3>
        <div class="header" style="border-bottom: 5px solid #e0573f">
            <img alt="Pre-launch plan" src="images/planning.png" />
        </div>
        <div class="text">
            <ul>
                <li>Announce partners</li>
                <li>Setup social accounts</li>
                <li>Release marketing plan</li>
                <li>Mint governance token</li>
                <li>Release plan for Ambassador program</li>
                <li>Trailer</li>
                <li>Token presale</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:90%;">
        <h3 style="color:#ecec37;">Q2 2022</h3>
        <div class="header" style="border-bottom: 5px solid #ecec37">
            <img alt="Launch plans" src="images/launch.png" />
        </div>
        <div class="text">
            <ul>
                <li>Mint stablecoin Vote token</li>
                <li>Launch closed beta</li>
                <li>Full release of challenge system and marketplace</li>
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:100%;">
        <h3 style="color: aqua;">Q3+ 2022</h3>
        <div class="header" style="border-bottom: 5px solid aqua">
            <img alt="Post launch plans" src="images/globalization.png" />
        </div>
        <div class="text">
            <ul>
                <li>Add video editing features</li>
                <li>Unique Tap-to-Record feature</li>
                <li>Release of ambassador program</li>
                <li>Release of GM mode</li>
            </ul>
        </div>
    </div>
</div>

<style>
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
        font-family: "BentonSans", sans-serif;;
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
        padding-top:25px;
        margin-bottom:200px;
        justify-content: space-between;
        width: 100%;
        height: 80vh;
        align-items: flex-end;
    }
    .roadmap-card {
        width:18%;
        display:flex;
        flex-direction: column;
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
    }
</style>