<script defer>
    import TeamCards from './TeamCards.svelte'
    import Tokenomics from './Tokenomics.svelte';
    import Challenge from './Challenge.svelte';
    import VoteToken from './VoteToken.svelte';
    import Roadmap from './Roadmapv2.svelte';
    import Carousel from './Carousel.svelte';
    import Table from './Table.svelte';
    import News from './News.svelte';
    import NFT from './NFT.svelte';
import { onMount } from 'svelte';
    onMount(() => {
        const observer = new IntersectionObserver(entries => {
            // Loop over the entries
            let showing = 0;
            entries.forEach(entry => {
                // If the element is visible
                if (entry.isIntersecting) {
                    // Add the animation class
                    entry.target.classList.add('type');
                    showing += 1;
                }
            });
            if (showing >= importants.length) {
                observer.disconnect()
            }
        });
        const importants = document.querySelectorAll('.important')
        importants.forEach(important => observer.observe(important));
    })
</script>

<div id="background">
    <h1 class="highlight">A NEW ERA OF TALENT.</h1>
    <h1>TOKENIZE YOUR SKILL.</h1>
    <h1>COMPETITION REIMAGINED.</h1>
    <h1>VOTE.WIN.EARN.</h1>
    <h1>EARN WITH YOUR FAVOURITE CREATORS.</h1>
    <h1>CENTRALIZE THE COMMUNITY.</h1>
    <h1>DECENTRALIZE AND OWN YOUR CONTENT.</h1>
</div>

<!--<div style="text-align:center !important; color: white; margin-top: 5rem; margin-bottom: 3rem;">
    <h2 style="text-align:center; margin-bottom: 10px;">Ambassadors</h2>
    <p>Details below, more coming soon</p>
</div>

<Carousel />-->

<div id="Trailer" class="video-container">
    <div class="video">
        <iframe title="AllSkills Trailer Video" loading="lazy" src="https://www.youtube.com/embed/O2A5MIWsCFI"></iframe>
    </div>
</div>


<div class="text-content">

    <h2>What We Provide</h2>
    <Table />

    <div class="powered-by">
        <h3><span style="color:aqua;">AllSkills</span> is powered by cryptocurrency, using future-proof blockchain & smart contract technology to <span class="important">connect talented people & audiences</span>, and foster skill development through competition, all while providing <span class="important">incentives for everyone involved.</span></h3>
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
    <section id="Ambassador Program" class="section">
        <h2 style="text-decoration: underline #004D0D; -webkit-text-decoration-line: underline; -webkit-text-decoration-color: #004D0D;">Ambassador Program</h2>
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
        <div class="section">
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
:global(.type) {
    color:#0000;
    background:
        linear-gradient(aqua 0 0) 0 50%/150% 95%,
        linear-gradient(aqua 0 0) 0 0  /100% 100%;
    -webkit-background-clip:padding-box,text;
    background-clip:padding-box,text;
    background-repeat:no-repeat;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    animation: 
    t 1s forwards,
    b 1s 1s forwards;
}

@keyframes t{
  from {background-size:0 95%,0 100%}
}
@keyframes b{
  100% {background-position:-200% 50%,0 0}
}
.bMargin {
    margin-bottom: 100px;
}
iframe{
    width:400px;
    height:710px;
    border-radius: 0.5rem;
}
.video {
    border-radius: 0.5rem;
    display:flex;
    justify-content: center;
    position:relative;
    width:100%;
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
    border-left: 50vw solid transparent;
    border-right: 50vw solid transparent;
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
        font-family: "Roboto", "Lato", sans-serif;
        color: white;
        box-sizing: border-box;
    }
</style>
