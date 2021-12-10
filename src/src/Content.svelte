<script>
    import TeamCards from './TeamCards.svelte'
    import Roadmap from './Roadmap.svelte'
</script>


<div class="content">
    <div class="card"><img src="images/bass.jpg" /></div>
    <div class="card"><img src="images/Dunk.jpg" /></div>
    <div class="card"><img src="images/skateboard.jpg" /></div>
    <div class="card"><img src="images/runner.jpg" /></div>
</div>

<div class="text-content">
    <h2>What We Provide</h2>
    <div class="table-content">
        <div class="grid-item">
            <div class="table-icon"><img alt="Handshake" style="width:100%" src="images/handshake.png"></div>
            <div class="grid-item-text">
                <h3>Skills Competition</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Earnings" style="width:100%" src="images/earn.png"></div>
            <div class="grid-item-text">
                <h3>Earning Potential</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Collectibles" style="width:100%" src="images/stamps.png"></div>
            <div class="grid-item-text">
                <h3>NFT Collectibles</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="table-icon"><img alt="Marketplace" style="width:100%" src="images/auction.png"></div>
            <div class="grid-item-text">
                <h3>NFT Marketplace</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
    </div>
    <div class="powered-by">
        <h3>AllSkills is powered by cryptocurrency, using <span style="background-color:aqua;">future-proof blockchain & smart contract technology</span> to connect talented people and audiences, and foster skill development through competition, all while providing <span style="background-color: aqua">incentives for everyone involved.</h3>
    </div>
    <Roadmap/>
    <TeamCards/>
    <div class="partners">
        <h2>Partners</h2>
    </div>
    <div class="partners">
        <h2>News</h2>
    </div>
</div>
<style>
    /* rgb(143,255,238) */
    p {
        font-size: 1.5rem;
    }
    .table-icon {
        padding-right:2.5rem;
    }
    h3 {
        font-size: 3rem;
        line-height: 1.5;
        margin-bottom: 2rem;
        font-weight: 500;
    }
    .powered-by{
        margin-top: 20rem;
        margin-bottom: 20rem;
        text-align: center;
    }
    .grid-item{
        display:grid;
        grid-template-columns: 25% 75%;
        align-items: center;
        padding: 2.5rem;
        border: 1px solid aqua;
    }
    .table-content{
        display:grid;
        margin-top:3rem;
        margin-bottom:3rem;
        color: white;
        border: 1px solid aqua;
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
    h2 {
        text-align:left;
        min-width:50%;
        font-size: 4.5rem;
        line-height: 1;
    }
    .text-content {
        margin-left: auto;
        margin-right: auto;
  align-items: center; 
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
   padding-left: 1rem;
   padding-right: 1rem;
   max-width: 80rem;
   box-sizing: border-box;
    }

    img {
        height: 100%;
    }

 .card{
     height: 800px;
     max-width: 23%;
     background: rgb(56,56,56);
     transform: skewX(-5deg);
     margin-top:-20px;
     min-width:10%;
     box-shadow: 10px 10px rgba(0,0,0,0.3);
    transition-property: min-width;
    transition: 500ms linear;
     overflow:hidden;
    }

    .card:hover {
        min-width:75%;
        
    }
.content{
    margin-top:100px;
    margin-right:2%;
    max-width:100%;
    margin-left:1%;
    background-color:rgb(54,54,54);
    flex-direction:row;
    height: 900px;
    display:flex;
    width: 100%;
    justify-content: center;
}
</style>