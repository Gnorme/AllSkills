<div class="challenge-container">
    <div class="section">
        <div class="image first">
            <img src="images/Edit_sw.webp" />
            <div class="tooltips" style="color:rgb(200,255,255)">
                <p id="music" class="extra-info"><span style="text-decoration:underline;">Music</span><br>Users will get to chose from a variety of song clips to add to their videos</p>
                <p id="filters" class="extra-info"><span style="text-decoration:underline;">Filters</span><br>Users will have access to a number of filters to put over their videos</p>
                <p id="effects" class="extra-info"><span style="text-decoration:underline;">Effects</span><br>A number of video effects will be available to enhance the quality of the users videos.</p>
                <p id="gifs" class="extra-info info-left"><span style="text-decoration:underline;">GIFs</span><br>To add a unique touch to your trickshots, add a GIF for a built-in reaction to the users skills.</p>
                <p id="crop" class="extra-info info-left"><span style="text-decoration:underline;">Crop</span><br>To cut and crop their videos, users are invited to use the trimming feature.</p>
            </div>
        </div>
        <div class="content second">
            <div>
            <h3 style="border-bottom: 2px solid aqua;">Take videos showcasing your skills</h3>
            <p>No matter if your skill is  <span style="color:aqua;">athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind,</span> we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.</p>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <img src="images/upload_sw.webp" />
            <div class="tooltips" style="color:rgb(255,150,150)">
                <p id="music" class="extra-info info-left">Users will have the option to save their video to their camera roll.</p>
                <p id="name" class="extra-info info-left">Choose a unique name for your trickshot.</p>
                <div id="tags" class="extra-info info-left">
                    <p>By adding SkillsTags to each video, users will be able to increase their reach and voting results.</p>
                    <p>Users will be able to use this area to search for or create their own SkillsTags for their video.</p>
                    <p>A total of 6 SkillsTags will be listed and added to each video.</p>
                </div>
            </div>
        </div>
        <div class="content first">
            <h3 style="border-bottom: 2px solid red;">Put videos up for Challenge</h3>
            <p>After you’re satisfied with your video, it’s time to put it up for Challenge.  <span style="color:red;">Winning a challenge round is how your video becomes eligible for minting.</span> Choose between putting your video up for Open Challenge or directly challenging another video or user. Rounds last 72h.</p>
        </div>
    </div>
    <div class="section">
        <div class="image first">
            <img src="images/challenge_sw.webp" />
            <div class="tooltips" style="color:rgb(225,175,255)">
                <p id="music" class="extra-info">Users will see freezeframe of the 2 videos and they can tap on the Play button to watch each video.</p>
            </div>
        </div>
        <div class="content second">
            <h3 style="border-bottom: 2px solid blueviolet;">Users vote to determine winner</h3>
            <p>Once the challenge starts, <span style="color:blueviolet;">the control is now in the voters hands.</span> Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and has the opportunity to be minted as an NFT.</p>
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
    .tooltips {
        position:absolute;
        width:100%;
        height:100%;
        top:0;
    }
    .extra-info {
        position:absolute;
        display:inline-block;
        width: 20%;
        font-size: 11px;
        left:0%;
        text-align: right;
    }
    .info-left {
        text-align: left;
        left:70%;
    }
    #music {
        top:-20%;
    }
    #effects {
        top: 20%;
    }
    #gifs {
        top:-20%;
    }
    #name {
        top: 15%;
    }
    #tags {
        top: 25%; 
        width: 25%;
    }
    #tags p {
        margin-block-end:0.25rem;
        margin-block-start:0.25rem;
    }
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
        width: 50%;
        position: relative;
    }
    .image img {
        position:relative;
        top: -125px;
        left: 20%;
        width: 300px;
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
        margin-top: 80px;
        height: 500px;
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
        .image {
            order:2 !important;
            width:auto;
            margin-top:30px;
            margin-right:auto;
            margin-left:auto;
        }
        .image img {
            top: 0;
            left: 0;
        }
        .second {
            order: 1;
        }
        .first{
            order:1;
            margin-left:auto;
        }
        .video-container{
            margin: 50px 0 0 0;
        }
        .tooltips {
            display: none;
        }
    }
</style>