<div class="roadmap-container">
    <div class="roadmap-card" style="height:60%;">
        <h3 style="color:var(--baseText);">2019 - 2020</h3>
        <div class="header" style="border-bottom: 5px solid var(--baseText)">
            <img class="soft" alt="Idea" src="images/idea_soft.png" />
            <img class="hard" alt="Idea" src="images/idea_sw.png" />
        </div>
        <div class="text">
            <ul>
                {#each $json('home.roadmap.idea.cleared') as step}
                    <li class="cleared">{step}</li>
                {/each}
                <!--<li class="cleared">Business plan</li>
                <li class="cleared">Feasibility study</li>
                <li class="cleared">Olympic skater Charles Hamelin joins project</li>-->
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:70%;">
        <h3 style="color:#852ee7">2021</h3>
        <div class="header" style="border-bottom: 5px solid #852ee7">
            <img class="soft" alt="New Direction" src="images/leadership_soft.png" />
            <img class="hard" alt="New Direction" src="images/leadership_sw.png" />
        </div>
        <div class="text">
            <ul>
                {#each $json('home.roadmap.research.cleared') as step}
                    <li class="cleared">{step}</li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:80%;">
        <h3 style="color:var(--secondColor)">Q1 2022</h3>
        <div class="header" style="border-bottom: 5px solid var(--secondColor)">
            <img class="soft" alt="Pre-launch plan" src="images/planning_soft.png" />
            <img class="hard" alt="Pre-launch plan" src="images/planning_sw.png" />
        </div>
        <div class="text">
            <ul>
                {#each $json('home.roadmap.plan.cleared') as step}
                    <li class="cleared">{step}</li>
                {/each}
                {#each $json('home.roadmap.plan.uncleared') as step}
                    <li>{step}</li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:90%;">
        <h3 style="color:var(--extraColor);">Q2 2022</h3>
        <div class="header" style="border-bottom: 5px solid var(--extraColor)">
            <div style="position:relative; display:inline-grid;">
                <img class="soft" style="max-height:100px; position:relative;" alt="Launch plans" src="images/rocket_soft.png" />
                <img class="hard" style="max-height:100px; position:relative;" alt="Launch plans" src="images/launch_no_ex.png" />
                <div class="exhaust">
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
                {#each $json('home.roadmap.launch.uncleared') as step}
                    <li>{step}</li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="roadmap-card" style="height:100%;">
        <h3 style="color: var(--headerColor);">Q3+ 2022</h3>
        <div class="header" style="border-bottom: 5px solid var(--headerColor)">
            <img class="soft" alt="Post launch plans" src="images/globalization_soft.png" />
            <img class="hard" alt="Post launch plans" src="images/globalization_sw.png" />
        </div>
        <div class="text">
            <ul>
                {#each $json('home.roadmap.post.uncleared') as step}
                    <li>{step}</li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="social-info">
        <p>{$_('home.roadmap.socials')}</p>
    </div>
</div>
<script>
    import { _ , json } from 'svelte-i18n'
</script>
<style>
    /* <img alt="Launch plans" src="images/launch_sw.png" />*/
:global(.soft-mode) .soft {
    display: inline-block !important;
}
:global(.soft-mode) .hard {
    display: none !important;
}
.soft {
    display: none;
}
.exhaust {
    transform: rotate(-140deg) scale(0.7);
    -webkit-transform: rotate(-140deg) scale(0.7);
    z-index: -1; 
    top: -80px;
    width:70px;
    height:70px; 
    position:relative;
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
        color: var(--highlight);
    }
    .social-info {
        position:absolute;
        color: #852ee7 ;
        top:0%;
        left:2%;
        width: 30%;
    }
    .social-info p {
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
    :global(.soft-mode) h3 {
        text-shadow: 0px 0px 15px rgba(255,255,255,0.5);
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
    :global(.soft-mode) .text {
        color: #083B60;
    }
    .roadmap-container {
        display:flex;
        max-width:1220px;
        margin-left:auto;
        margin-right:auto;
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
        .social-info {
            position:relative;
            left:0;
            width:auto;
            margin-top: 30px;
        }
        .social-info p {
            font-size:16px !important;
        }
    }
</style>