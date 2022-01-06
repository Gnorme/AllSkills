<div class="challenge-container">
    <div class="section">
        <div class="image first">
            <img src="" />
        </div>
        <div class="content second">
            <h3 style="border-bottom: 2px solid aqua;">Take videos showcasing your skills</h3>
            <p>No matter if your skill is  <span style="color:aqua;">athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind,</span> we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.</p>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <img src="" />
        </div>
        <div class="content first">
            <h3 style="border-bottom: 2px solid red;">Put videos up for Challenge</h3>
            <p>After you’re satisfied with your video, it’s time to put it up for Challenge.  <span style="color:red;">Winning a challenge round is how your video becomes eligible for minting.</span> Choose between putting your video up for Open Challenge or directly challenging another video or user. Round lengths can be either 24h or 72h.</p>
        </div>
    </div>
    <div class="section">
        <div class="image first">
            <img src="" />
        </div>
        <div class="content second">
            <h3 style="border-bottom: 2px solid blueviolet;">Users vote to determine winner</h3>
            <p>Once the challenge starts, <span style="color:blueviolet;">the control is now in the voters hands.</span> Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and minted as an NFT.</p>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <img src="" />
        </div>
        <div class="content first">
            <h3 style="border-bottom: 2px solid gold;">Earn money from voting and winning challenges</h3>
            <p>Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the rest is rewarded to all those who voted for the winning video. The creators cut changes based on how close the vote is. <span style="color: gold;">Closer vote count = bigger cut.</span></p>
        </div>
    </div>
    <div id="Trailer" class="video-container">
        <div class="video">
            <iframe title="AllSkills Trailer Video" loading="lazy" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
        </div>
    </div>
</div>

<style>
    iframe{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        border-radius: 0.5rem;
    }
    .video::after{
        display:block;
        content:"";
        padding-top: 56.25%;
    }
    .video {
        border-radius: 0.5rem;
        position:relative;
        width:100%;
    }
    h3 {
        font-size: 2rem;
        padding-bottom:10px;
        font-family:"Oswald";
    }
    p{
        font-family:"BentonSans";
    }
    .first{
        order:1;
        margin-left:-25px;
    }
    .second{
        order:2;
    }
    .content p {
        font-size: 1rem;
        line-height: 1.8rem;
    }
    .content{
        flex: 0 0 50%;
    }
    .image{
        flex: 0 0 50%;
    }
    .challenge-container{
        display:flex;
        width:100%;
        margin-bottom:200px;
        flex-direction: column;
    }
    .section{
        display:flex;
        gap:50px;
        margin: 80px;
        height: 250px;
    }
    .video-container{
        margin: 200px 100px 150px 100px;
    }
    @media screen and (max-width: 820px) {
        .section {
            width: 100%;
            flex-direction: column;
            margin:0;
            gap:0;
            height:auto;
        }
        .first{
            margin-left:0;
        }
        .video-container{
            margin: 50px 0 0 0;
        }
    }
</style>