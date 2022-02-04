<script>
    import NewsletterSignup from "./NewsletterSignup.svelte";
    import { _ } from 'svelte-i18n'
    const skills = [
        "Gymnastics",
        "Volleyball",
        "Hockey",
        "Chello",
        "Ice Skating",
        "Badminton",
        "ESports",
        "Drums",
        "Dance",
        "Football",
        "Basketball",
        "Water Sports",
        "Snowboard",
        "Swimming",
        "Darts",
        "Piano",
        "Harmonica",
        "Lacrosse",
        "Rugby",
        "Bass",
        "Bowling",
        "Running",
        "Saxophone",
        "Trumpet",
        "Golf",
        "Violin",
        "Parkour",
        "Tuba",
        "Band",
        "Surfing",
        "Singing",
        "Baseball",
        "Tennis",
        "Archery" ,
        "Trombone",
        "Cricket",
        "Ski",
        "Boxing",
        "Skateboard",
        "Soccer",
        "Guitar",
        "Trickshots",
    ]

</script>
<div id="hero">
   <div class="left-content">
        <div class="content">{$_('home.hero.title')}</div>
        <div class='scrolling-content'>
            <div class="scrolling-content-mask">
                <ul class="scroll-animation">
                    {#each skills as skill}
                        <li>{skill}</li>
                    {/each}
                    <li style="color:#00F3FF; font-weight: 600 !important; font-family:'Bebas Neue'; margin-top:11px;">AllSkills</li>
                </ul>
            </div>
        </div>
    </div>
    <div class='hero-split'>
        <div class="description">
            <p style="margin-bottom:2rem;">{$_('home.hero.description_start')} <span style="color:#00F3FF">{$_('home.hero.description_highlight')}</span> {$_('home.hero.description_end')}</p>
            <NewsletterSignup color='white' />
            
        </div>
    </div>
    <span class="countdown">Big news coming soon...<a href="https://twitter.com/@AllSkillsNFT">@AllSkillsNFT</a></span>
</div>
<style>
     @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
     .scrolling-content{
    margin-left: 10px;
        font-size: 64px;
        height:64px;
    text-align:left;
    line-height:1;
    text-overflow: ellipsis;
    white-space:nowrap;
    color:white;

}
.logo {
    position:absolute;
    top:2%;
    left:10%;
    filter:blur(10px) brightness(60%);
}
.countdown {
    position:absolute;
    top:90%;
    z-index:10;
    color:white;
    font-family: "Oswald";
    font-size: 24px;
    left:42%;
}
.countdown a {
    color: aqua;
}

.content {
    text-align: right;
    font-size: 64px;
    line-height:64px;
    text-align:right;
    color: #ecf0f1;
    padding:0;
    white-space:nowrap;
    position:relative;
    display:inline-block;
    min-height:0;
    font-weight: 600;
    overflow:hidden;
}
.scrolling-content-mask{
    width: 100%;
    height: 64px;
    overflow: hidden; 
    position: relative;
    display: inline-block;
}
     .left-content {
         font-weight: 500;
         margin:0px;
         height: 64px;
         z-index: 1;
        display:grid;
        grid-template-columns: 48% 52%;
     }

#hero {
    position: relative;
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 55% 45%;
    justify-content: space-between;
    align-items: center;
}
@media screen and (max-width: 820px) {
        .countdown {
            display:table;
            margin-left:auto;
            margin-right:auto;
            padding-bottom:20px;
            position:relative;
            left:0;
        }
        #hero {
            display:block;
            height: auto;
        }
        .description {
            display: table-cell;
            text-align: center;
            padding: 20px;
        }
        .left-content {
            padding-top: 100px;
            display: flex;
            flex-direction:column;
            height: auto;
        }
        .scrolling-content {
            margin-top:20px
        }
        .content {
            text-align:center;
        }
        .scroll-animation {
            text-align:center;
        }
    }
.description {
    position: relative;
    font-weight: 400;
    width: 90%;
    height:auto;
}

.hero-split {
   color: white;
}

p {
    font-size: 1.6rem;
    line-height: 2.25rem;
  display:inline;
  float:left;
  margin:0;
}

ul {
    min-height: 150px;
    max-height: 150px;
    margin: 0px;
    padding: 0px;
    background-size: contain;
    font-size:64px;
  margin-top:0;
  position:relative;
  text-align:left;
  list-style:none;
  animation: change 5s cubic-bezier(0.5, 0.2, 0.5, 1.0) 0.5s 1 normal forwards;
  -webkit-animation: change 5s cubic-bezier(0.5, 0.2, 0.5, 1.0) 0.5s 1 normal forwards;
}

ul li {
  margin:0;
}

@-webkit-keyframes opacity {
  0%, 100% {opacity:0;}
  50% {opacity:1;}
}

@-webkit-keyframes change {
    100% {margin-top: -2688px;}
}

@keyframes opacity {
  0%, 100% {opacity:0;}
  50% {opacity:1;}
}

@keyframes change {
    100% {margin-top: -2694px;}

}


#hero::before {
    content: "";
    position: absolute;
    /*mask-image: linear-gradient(to bottom, rgba(54,54,54,1) 100%, rgba(54,54,54,0));
    -webkit-mask-image: linear-gradient(to bottom, rgba(54,54,54,1) 40%, rgba(54,54,54,0));*/
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 150% !important;
    background-image: url('../images/logo_bg.webp');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    filter: brightness(60%) blur(12px);
}

</style>

