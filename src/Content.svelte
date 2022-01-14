<script>
    import TeamCards from './TeamCards.svelte'
    import Tokenomics from './Tokenomics.svelte';
    import Challenge from './Challenge.svelte';
    import VoteToken from './VoteToken.svelte';
    import Roadmap from './Roadmapv2.svelte';
    import Carousel from './Carousel.svelte';
    import Table from './Table.svelte';
    import News from './News.svelte';

</script>

<Carousel />

<div class="text-content">
    <h2>What We Provide</h2>
    <Table />
    <div class="powered-by">
        <h3><span style="color:aqua;">AllSkills</span> is powered by cryptocurrency, using <span style="background-color:aqua; color: rgb(30,30,30);">future-proof blockchain & smart contract technology</span> to connect talented people and audiences, and foster skill development through competition, all while providing <span style="background-color: aqua; color: rgb(30,30,30);">incentives for everyone involved.</h3>
    </div>
    <div id="Challenge" class="section">
        <h2 style="text-decoration: underline red;">Challenge System</h2>
        <Challenge/>
    </div>
    <div id="Vote" class="section">
        <h2 style="text-align: center; text-decoration: underline aqua;">AllSkills $Vote Token</h2>
        <VoteToken/>
    </div>
    <div id="Roadmap" class="section">
        <h2 style="text-decoration: underline blueviolet; margin-bottom: 75px;">Buildup to Launch & Beyond</h2>
        <Roadmap/>
    </div>
    <div id="Tokenomics" class="section">
        <h2 style="text-align: center; text-decoration: underline gold;">Tokenomics</h2>
        <div class="section">
            <Tokenomics/>
        </div>
    </div>
    <div id="Team" class="section">
        <h2 style="text-decoration: underline white;">The Team</h2>
        <TeamCards/>
    </div>
    <div class="top">
        <div class="triangle"></div>
    </div>
    <div id="Partners" class="white" style="width: 100%;">
        <h2 style="margin-left:7%">Partners</h2>
    </div>
    <div id="News" class="white" style="width: 100%; ">
        <h2 style="margin-left:7%">News</h2>
        <News />
    </div>
</div>
<style>   /* rgb(143,255,238) */
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
        max-width: 1220px;
        margin-bottom: 20rem;
        width:85%;
        margin-left:auto;
        margin-right:auto;
        text-align: center;
        font-size: 2.5rem;
        font-family: "Oswald";
    }
    @media screen and (max-width: 820px) {
        h3 {
            font-size: 2.5rem !important;
        }
        h2 {
            text-align:center !important;
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