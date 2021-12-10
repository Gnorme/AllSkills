
<script>
    import NewsletterSignup from "./NewsletterSignup.svelte";
</script>
<section class="hero">
   
   <div class="left-content">
        <div class="content">Built for</div>
        <div class='scrolling-content'>
            <div class="scrolling-content-mask">
                <ul class="scroll-animation">
                    <li>Archery</li>
                    <li>Badminton</li>
                    <li>Band</li>
                    <li>Baseball</li>
                    <li>Basketball</li>
                    <li>Bass</li>
                    <li>Bowling</li>
                    <li>Boxing</li>
                    <li>Chello</li>
                    <li>Cricket</li>
                    <li>Dance</li>
                    <li>Darts</li>
                    <li>Drums</li>
                    <li>ESports</li>
                    <li>Football</li>
                    <li>Golf</li>
                    <li>Guitar</li>
                    <li>Gymnastics</li>
                    <li>Harmonica</li>
                    <li>Hockey</li>
                    <li>Ice Skating</li>
                    <li>Lacrosse</li>
                    <li>Parkour</li>
                    <li>Piano</li>
                    <li>Rugby</li>
                    <li>Running</li>
                    <li>Saxophone</li>
                    <li>Singing</li>
                    <li>Skateboard
                    <li>Ski</li>
                    <li>Snowboard</li>
                    <li>Soccer</li>
                    <li>Surfing</li>
                    <li>Swimming</li>
                    <li>Tennis</li>
                    <li>Trombone</li>
                    <li>Trumpet</li>
                    <li>Tuba</li>
                    <li>Volleyball</li>
                    <li>Violin</li>                    
                    
                    <li style="color:aqua; font-weight: 600 !important">AllSkills</li>
                </ul>
            </div>
        </div>
    </div>
    <div class='hero-split'>
        <div class="description">
            <p style="margin-bottom:2rem;">AllSkills is a platform that looks to bring creativity and increased competition to the sport world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning money through our carefully crafted token based Vote and Challenge system and NFT marketplace.</p>
            <NewsletterSignup color='white' />
        </div>
    </div>

</section>
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

     .hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 55% 45%;
    justify-content: space-between;
    align-items: center;
    

}


p {
    font-size: 1.875rem;
line-height: 2.25rem;
}

.description {

    position: relative;
   font-weight: 400;
    width: 90%;
    height:auto;
}

.hero-split {
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
}

p {
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
    100% {margin-top: -2624px;}
}

@keyframes opacity {
  0%, 100% {opacity:0;}
  50% {opacity:1;}
}

@keyframes change {
    100% {margin-top: -2560px;}

}


.hero::before {
    content: "";
    position: absolute;
    mask-image: linear-gradient(to bottom, rgba(54,54,54,1) 40%, rgba(54,54,54,0));

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('../images/runner.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    filter: brightness(60%);
}

</style>

