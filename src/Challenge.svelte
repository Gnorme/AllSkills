
<div class="challenge-container">
    
    <div class="section">
        <div class="image first">
            <img class="phone" src="images/Edit_sw.webp" />
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
            <h3 class="title" style="background-image: linear-gradient(aqua, aqua);">{$_('home.challenges.videos.title')}</h3>
            <p>{$_('home.challenges.videos.pStart')} <span style="color:aqua;">{$_('home.challenges.videos.highlighted')}</span>{$_('home.challenges.videos.pEnd')}</p>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <img class="phone" src="images/upload_sw.webp" />
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
            <h3 class="title" style="background-image: linear-gradient(red,red);">{$_('home.challenges.challenges.title')}</h3>
            <p>{$_('home.challenges.challenges.pStart')}  <span style="color:red;">{$_('home.challenges.challenges.highlighted')}</span> {$_('home.challenges.challenges.pEnd')}</p>
        </div>
    </div>
    <div class="section">
        <div class="image first">
            <img class="phone" src="images/challenge_sw.webp" />
            <div class="tooltips" style="color:rgb(225,175,255)">
                <p id="music" class="extra-info">Users will see freezeframe of the 2 videos and they can tap on the Play button to watch each video.</p>
            </div>
        </div>
        <div class="content second">
            <h3 class="title" style="background-image: linear-gradient(blueviolet,blueviolet);">{$_('home.challenges.votes.title')}</h3>
            <p>{$_('home.challenges.votes.pStart')} <span style="color:blueviolet;">{$_('home.challenges.votes.highlighted')}</span> {$_('home.challenges.votes.pEnd')}</p>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <div id="winModal" style="display:none;">
                <div id="prizes">
                </div>
                <!--<h4>CONGRATS on your Challenge win!</h4>
                <p>Total votes cast: 1148</p>
                <p>Votes you received: 746 (65%)</p>
                <p>Calculated cut: 15.6%</p>
                <div id="prizes"><img src="images/vote_token.png"></div>-->
            </div>
            <div id="doneModal"><button on:click={showResults} class="shake" id="resButton">View Results</button></div>
            <img class="phone" src="images/challenge_complete.png" />
        </div>
        <div class="content first">
            <h3 class="title" style="background-image: linear-gradient(gold,gold);">{$_('home.challenges.earn.title')}</h3>
            <p>{$_('home.challenges.earn.pStart')}<span style="color: gold;">{$_('home.challenges.earn.highlighted')}</span></p>
        </div>
    </div>

</div>

<script>
    import { _ } from 'svelte-i18n'

    function showResults(e) {
        //e.target.style.zIndex = "5";
        e.target.classList.remove('shake')
        e.target.classList.add('open');
        setTimeout(() => {
            e.target.style.zIndex = "5";
            document.getElementById("winModal").style.display = "block";
        }, 2000);
        //document.getElementById("winModal").style.display = "block";
    }
</script>

<style>
    #prizes {
        position:relative;
        width: 100%;
        top:300px;
        height: 110px;
    }
    #prizes img {
        width: 30%;
    }
    #resButton {
        position: absolute;
        background-color: blueviolet;
        border-radius: 20px;
        color: white;
        border: none;
        font-family: 'Bebas Neue';
        padding: 10px;
        top: 300px;
        left: 80px;
        z-index: 11;
        box-shadow: 0px 0px 15px 5px #0ff;
    }
    .shake {
        animation: shake 1.8s cubic-bezier(.36,.07,.19,.97) infinite;
        transform: translate3d(0, 0, 0);
    }
    :global(.open) {
        animation: shakefast 0.5s linear;
        animation-iteration-count: 4;
    }
    @keyframes shake {
        0%, 70% {
            transform: translate3d(-1px, 0, 0);
        }
        
        5%, 60% {
            transform: translate3d(2px, 0, 0);
        }

        10%, 30%, 50% {
            transform: translate3d(-4px, 0, 0);
        }

        15%, 40% {
            transform: translate3d(4px, 0, 0);
        }
        70%,100% {
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes shakefast {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }    
    }
    #doneModal {
        position:absolute;
        background-color: rgba(0,0,0,0.5) !important;
        width: 250px;
        top:-60px;
        left: 125px;
        z-index:10;
        height: 350px;       
    }
    #winModal {
        position:absolute;
        background-color: rgba(0,0,0,0.5) !important;
        background: url('../images/win_bg-2.png');
        border-radius:20px;
        width: 250px;
        top:-110px;
        left: 125px;
        z-index:11;
        height: 440px;
    }
    .title {
        background-size: 0% 5px;
    }
    .tooltips {
        position:absolute;
        width:100%;
        height:100%;
        top:0;
    }
    .extra-info {
        position:absolute;
        display:inline-block;
        width: 100px;
        font-size: 11px;
        text-align: right;
    }
    .info-left {
        text-align: left;
        width: 100px;
        left: 400px;
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
    #crop {
        margin-top:30px;
    }
    #name {
        top: 12%;
    }
    #tags {
        top: 25%; 
        width: 25%;
    }
    #tags p {
        margin-block-end:0.25rem;
        margin-block-start:0.25rem;
    }
    h3 {
        font-size: 2rem;
        padding-bottom:10px;
        font-family:"Oswald";
        text-decoration: none;
    background-position: 0% 100%;
    background-size: 0% 2px;
    background-repeat: no-repeat;
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
        font-size: 1.2rem;
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
    .phone {
        position:relative;
        top: -125px;
        left: 100px;
        width: 300px;
    }
    .challenge-container{
        
        display:flex;
        width:100%;
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
        .phone{
            top: 0;
            left: 0;
        }
        #doneModal {
            top:63px;
            left:25px;
        }
        #winModal {
            top:15px;
            left:25px;
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