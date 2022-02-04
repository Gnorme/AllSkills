<script defer>
    import TeamCards from './TeamCards.svelte'
    import Tokenomics from './Tokenomics.svelte';
    import Challenge from './Challenge.svelte';
    import VoteToken from './VoteToken.svelte';
    import Roadmap from './Roadmap.svelte';
    import Carousel from './Carousel.svelte';
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

    function addObservers() {
        const videoObserver = new IntersectionObserver(entries => {
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        //startingToPlay = true
                        console.log("Trying to playyyyy")
                            setTimeout(() => {
                                console.log(tryingToPause)
                                if (tryingToPause == false) {
                                    player1.play()
                                }
                                tryingToPause = false;
                            }, 1000);
                        /*if (player1.getPlayerState() == 1) {
                            console.log("disconnecting")
                            //videoObserver.disconnect()
                        }*/
                        
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
    }
</script>
<Observers/>

<div id="Trailer" class="video-container">
    <div class="img-frame"><img src="images/iphone_frame.png"></div>
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
    <svg viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: rgb(255, 0, 0);" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: rgb(255, 0, 0);" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="Challenge" class="section">
        <h2 style="text-decoration: underline red; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: red;">Challenge System</h2>
        <Challenge/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: rgb(0, 255, 255);" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: rgb(0, 255, 255);" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Vote" class="section">
        <h2 style="text-align: center; text-decoration: underline aqua; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: aqua;"><span style="font-family: 'Bebas Neue';">AllSkills</span> $Vote Token</h2>
        <VoteToken/>
    </section>
    <svg viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: blueviolet;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: blueviolet;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="NFT" class="section">
        <h2 id="nftTitle" ><span style="font-family: 'Bebas Neue';">AllSkills</span> NFTs</h2>
        <NFT/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: #004D0D;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: #004D0D;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Ambassadors" class="section bMargin">
        <h2 style="text-decoration: underline #004D0D; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: #004D0D;">Ambassador Program</h2>
        <Ambassador/>
    </section>
    <svg viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: white;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
        <polygon style="fill: white;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
      </svg>
    <section id="Roadmap" class="section">
        <h2 style="text-decoration: underline white; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: white; margin-bottom: 75px;">Buildup to Launch & Beyond</h2>
        <Roadmap/>
    </section>
    <svg class="bMargin" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
        <polygon style="fill: gold;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
        <polygon style="fill: gold;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
      </svg>
    <section id="Tokenomics" class="section">
        <h2 style="text-align: center; text-decoration: underline gold; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: gold;">Tokenomics</h2>
        <div>
            <Tokenomics/>
        </div>
    </section>
    <svg viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
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
        <h2 style="margin-left:7%">Partners</h2>  
        <p style="margin-left:7%; font-size: 1.5rem;">Announcements coming soon</p>
    </section>
    <section id="News" class="white" style="width: 100%; ">
        <h2 style="margin-left:7%">News</h2>
        <News />
    </section>
</div>


<style>   /* rgb(143,255,238) #00DFFC*/

.img-frame {
    position:relative;
}
.img-frame img {
    position:absolute;
    top:50%;
    left: 50%;
    width:460px;
    height:750px;
    margin-left:-230px;
    z-index:1000;
    pointer-events: none;
}

.bMargin {
    margin-bottom: 100px;
}

.video {
    border-radius: 0.5rem;
    display:flex;
    justify-content: center;
    position:relative;
    width:100%;
    height:710px;
    margin-top:10rem;
    margin-bottom:10rem;
}

#background {
    position:fixed;
    width: 100%;
    height: 100vh;
    z-index:-1;
    top:50%;
    font-family:"Oswald";
    display:none;
}
#nftTitle {
    margin-bottom: 1rem; 
    margin-left: 6rem; 
    text-decoration: underline blueviolet; 
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
        margin-top: 20rem;
        max-width: 1200px;
        margin-bottom: 20rem;
        width:85%;
        margin-left:auto;
        margin-right:auto;
        text-align: center;
        font-size: 2.5rem;
        font-family: "Oswald";
    }
    @media screen and (max-width: 820px) {
        .img-frame img {
            display:none;
        }
        iframe{
            width:338px;
            height:600px;
            border-radius: 45px;
            position:relative;
            pointer-events: auto !important;
            position:relative;
            border:none;
            z-index:1;
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
            text-align:center !important;
        }
        .white {
            text-align: center;
        }
        .white h2 {
            margin-left: 0!important;
        }
        p {
            text-align: center !important;
        }
    }
    h2 {
        margin-left:auto; 
        margin-right:auto; 
        max-width: 1200px;
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
