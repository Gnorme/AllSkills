
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
            <h3 class="title" style="background-image: linear-gradient(aqua, aqua);">{$_('home.challenges.videos.title')}</h3>
            <p>{$_('home.challenges.videos.pStart')} <span style="color:aqua;">{$_('home.challenges.videos.highlighted')}</span>{$_('home.challenges.videos.pEnd')}</p>
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
            <h3 class="title" style="background-image: linear-gradient(red,red);">{$_('home.challenges.challenges.title')}</h3>
            <p>{$_('home.challenges.challenges.pStart')}  <span style="color:red;">{$_('home.challenges.challenges.highlighted')}</span> {$_('home.challenges.challenges.pEnd')}</p>
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
            <h3 class="title" style="background-image: linear-gradient(blueviolet,blueviolet);">{$_('home.challenges.votes.title')}</h3>
            <p>{$_('home.challenges.votes.pStart')} <span style="color:blueviolet;">{$_('home.challenges.votes.highlighted')}</span> {$_('home.challenges.votes.pEnd')}</p>
        </div>
    </div>
    <div class="section">
        <div class="image second">
            <img src="" />
        </div>
        <div class="content first">
            <h3 class="title" style="background-image: linear-gradient(gold,gold);">{$_('home.challenges.earn.title')}</h3>
            <p>{$_('home.challenges.earn.pStart')}<span style="color: gold;">{$_('home.challenges.earn.highlighted')}</span></p>
        </div>
    </div>

</div>

<script>
    import { _ } from 'svelte-i18n'
</script>

<style>
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
    .image img {
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