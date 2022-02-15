<script defer>
    import TeamCards from './TeamCards.svelte'
    import Tokenomics from './Tokenomics.svelte';
    import Challenge from './Challenge.svelte';
    import VoteToken from './VoteToken.svelte';
    import Roadmap from './Roadmap.svelte';
    import Partners from './Partners.svelte';
    import Table from './Table.svelte';
    import News from './News.svelte';
    import NFT from './NFT.svelte';
    import Youtube from "./Youtube.svelte";
    import Ambassador from "./Ambassador.svelte";
    import Observers from "./Observers.svelte";
    import { _ } from 'svelte-i18n'
import { onMount } from 'svelte';
    let player1;
    let startingToPlay = false;
    let tryingToPause = false;
    let muted = true;

    function addObservers() {
        const videoObserver = new IntersectionObserver(entries => {       
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        console.log("Trying to playyyyy")
                            setTimeout(() => {
                                console.log(tryingToPause)
                                if (tryingToPause == false) {
                                    player1.play()
                                }
                                tryingToPause = false;
                            }, 1000);
                    } catch (e) {
                        console.log(e)
                    }                   
                } else {
                    console.log("trying to pause")
                    tryingToPause = true;
                    console.log(tryingToPause)
                    if (player1.getPlayerState() !== 2) {
                        setTimeout(() => {
                            player1.pause();
                            tryingToPause = false;
                        }, 1000);
                    }

                }               
                    //observer.disconnect()
            })
        
        });
    
        const players = document.querySelectorAll(".video");
        players.forEach(p => videoObserver.observe(p));
    } 
    function start() {
        player1.play();
        player1.unmute();
    }
    function unmute(e) {
        if (muted) {
            player1.unmute()
            e.target.style.backgroundImage = "url('../images/volume.png')";
        } else {
            player1.mute()
            e.target.style.backgroundImage = "url('../images/volume-mute.png')";
        }
        muted = !muted;
    }
</script>
<Observers/>

<div id="Trailer" class="video-container marker-highlight">
    <div id="mute" on:click={unmute}></div>
    <div class="img-frame"><img alt="Phone frame" src="images/iphone_frame.png"></div>
    <div class="video">
        <Youtube bind:this={player1} videoId="O2A5MIWsCFI" on:End={() => start()} on:Ready={() => addObservers()}></Youtube>
        <!--<iframe allow="autoplay" title="AllSkills Trailer Video" loading="lazy" src="https://www.youtube.com/embed/O2A5MIWsCFI?rel=0&amp;autoplay=1&amp;controls=0&amp;showinfo=0&amp;mute=1" frameborder="0" allowfullscreen></iframe>-->
    </div>  
</div>

<div class="text-content">
    <h2>What We Provide</h2>
    <Table />
    <div class="powered-by">
        <h3><span style="color:aqua;">{$_('home.highlighted.company')}</span> {$_('home.highlighted.start')} <span class="important">{$_('home.highlighted.highlight1')}</span>{$_('home.highlighted.middle')} <span class="important">{$_('home.highlighted.highlight2')}</span></h3>
    </div>
    <svg class="bMargin" viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: aqua;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: aqua;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="Challenge" class="section">
        <h2 style="text-decoration: underline aqua; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: aqua;">Challenge System</h2>
        <Challenge/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: gold;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: gold;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Vote" class="section">
        <h2 style="text-align: center; text-decoration: underline gold; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: gold;"><span style="font-family: 'Bebas Neue';">AllSkills</span> $Vote Token</h2>
        <VoteToken/>
    </section>
    <svg class="bMargin" viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: blueviolet;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: blueviolet;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="NFT" class="section">
        <h2 id="nftTitle" ><span style="font-family: 'Bebas Neue';">AllSkills</span> NFTs</h2>
        <NFT/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: #FF3333;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: #FF3333;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Ambassadors" class="section">
        <h2 style="text-decoration: underline #FF3333; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: #FF3333;">Ambassador Program</h2>
        <Ambassador/>
    </section>
    <svg class="bMargin" viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: white;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: white;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="Roadmap" class="section">
        <h2 style="text-decoration: underline white; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: white; margin-bottom: 75px;">Buildup to Launch & Beyond</h2>
        <Roadmap/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: #78FF78;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: #78FF78;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Tokenomics" class="section">
        <h2 style="text-align: center; text-decoration: underline #78FF78; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: #78FF78;">Tokenomics</h2>
        <div>
            <Tokenomics/>
        </div>
    </section>
    <svg class="bMargin" viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: white;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: white;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="Team" class="section">
        <h2 style="text-decoration: underline white; -webkit-text-decoration-line: underline;">The Team</h2>
        <TeamCards/>
    </section>
    <div class="top">
        <div class="triangle"></div>
    </div>
    <section id="Partners" class="white" style="width: 100%;">
        <h2 style="margin-left:7%; text-shadow:none;">Partners</h2>  
        <Partners />
        <!--<p style="margin-left:7%; font-size: 1.5rem;">Announcements coming soon</p>-->
    </section>
    <section id="News" class="white" style="width: 100%; ">
        <h2 style="margin-left:7%; text-shadow:none;">News</h2>
        <News />
    </section>
</div>


<style>   /* rgb(143,255,238) #00DFFC*/
.section {
    margin-bottom:15rem;
}
#Roadmap {
    margin-bottom: 10rem !important;
}
#mute {
    position:absolute;
    width: 50px;
    height:50px;
    bottom: 8%;
    z-index:9999;
    left: calc(50% - 150px);
    background-image: url("../images/volume-mute.png");
}
.marker-highlight {
        background: url(../images/aqua-brush4-v.png);
        background-position: center;
        background-repeat:no-repeat;
        background-size: 50% 90%;
    }
.video-container {
    position:relative;
}
.img-frame {
    position:relative;
}
.img-frame img {
    position:absolute;
    top:50%;
    left: 50%;
    width:400px;
    height:700px;
    margin-left:-200px;
    z-index:1000;
    pointer-events: none;
}

.bMargin {
    margin-bottom: 7.5rem;
}

.video {
    border-radius: 0.5rem;
    display:flex;
    justify-content: center;
    position:relative;
    width:100%;
    height:710px;
    margin-top:15rem;
    margin-bottom:15rem;
}
#nftTitle {
    margin-bottom: 1rem; 
    margin-left: 6rem; 
    text-decoration-line: underline;
    text-decoration-color: blueviolet;
    -webkit-text-decoration-line: underline; 
    -webkit-text-decoration-color: blueviolet;
}
.white {
    background-color:white;
    color: rgb(30,30,30);
    padding-bottom:100px;
}
.white h2 {
    margin:0;
}
#Partners {
    padding-top:200px;
}
.section {
    width: 85%;
    margin-left:auto;
    margin-right:auto;
    max-width:1220px
}
.top {
    position: relative;
}
.triangle {
    border-top: 150px solid rgb(30,30,30);
    background-color:white;
    border-left: 49.5vw solid transparent;
    border-right: 49vw solid transparent;
    width: 0;
    height: 0;
    bottom: -150px;
    content: "";
    display: block;
    position: absolute;
    overflow: hidden;
    left:0;right:0;
    margin:auto;
}
    .powered-by{
        margin-top: 27rem;
        max-width: 1200px;
        margin-bottom: 27rem;
        width:85%;
        margin-left:auto;
        margin-right:auto;
        text-align: center;
        font-size: 2.5rem;
        font-family: "Oswald";
    }
    @media screen and (max-width: 820px) {
        .powered-by{
            margin-top:20rem !important;
            margin-bottom:20rem !important;
        }
        .img-frame img {
            display:none;
        }
        .bMargin {
            margin-bottom: 50px !important;
        }
        #nftTitle {
            margin-left:0;
        }
        h3 {
            font-size: 2.5rem !important;
        }
        h2 {
            font-size: 4rem !important; 
            text-align:center !important;
        }
        .white {
            text-align: center;
        }
        .white h2 {
            margin-left: 0!important;
        }
    }
    h2 {
        margin-left:auto; 
        margin-right:auto; 
        max-width: 1200px;
        text-shadow: 5px 5px rgba(0,0,0,0.5);
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
        /*font-family: "Roboto", "Lato", sans-serif;*/
        color: white;
        box-sizing: border-box;
    }
</style>
