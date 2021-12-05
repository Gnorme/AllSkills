
<section class="hero">
   
   <div class="left-content">
        <div class="content">Built for</div>
        <div class='scrolling-content'>
            <div class="scrolling-content-mask">
                <ul class="scroll-animation">
                    <li>Stick handles</li>
                    <li>Ball juggling</li>
                    <li>Trick shots</li>
                    <li>Dribbling</li>
                    <li>Piano playing</li>
                    <li>Gymnists</li>
                    <li>Guitar</li>
                    <li>Billiards</li>
                    <li>Parkour</li>
                    <li style="color:aqua; font-weight: 600 !important">All Skills</li>
                </ul>
            </div>
        </div>
    </div>
    <div class='hero-split'>
        <div class="description">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <div class="signup">
            <input placeholder="Sign up for our newsletter">
            <button onclick="alert('test')">REGISTER NOW</button>
        </div>
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
        grid-template-columns: 60% 40%;
     }

     .hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 50% 50%;
    justify-content: space-between;
    align-items: center;
    

}
.signup {
    display:flex;
    width: 100%;
}

p {
    font-size: 1.875rem;
line-height: 2.25rem;
}

button {
    margin-top: 2rem;
    font-weight: 500;
    padding-top: 2rem;
    font-weight: 500;
    padding-bottom: 2rem;
    width: 40%;
    letter-spacing: .1em;
    align-items: center;
    background-color:transparent;
    border: 2px solid white;
    background-image: none;
    color:white;
    text-align: center;
    cursor: pointer;
}

input {
    margin-top:2rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 2rem;
    padding-bottom:2rem;
    font-size: 1rem;
    background-color:transparent;
    width: 60%;
    border: 2px solid white;
    color:white;
    pointer-events:initial;
    cursor:pointer;
}

.description {

    position: relative;
   font-weight: 400;
    width: 70%;
    height:auto;
    padding-left: 5%;
}

.hero-split {
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
}
.hero-content {
   position: relative;
   align-items: center;
   font-weight: 600;
    width: 100%;
}



.visible {
  font-weight:600;
  overflow:visible;
  height:40px;
  padding:0 40px;
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
  animation: change 4s cubic-bezier(0.25, 0.2, 0.5, 1.0) 0.1s 1 normal forwards;
  -webkit-animation: change 4s cubic-bezier(0.25, 0.2, 0.5, 1.0) 0.1s 1 normal forwards;
}

ul li {
  margin:0;
}

@-webkit-keyframes opacity {
  0%, 100% {opacity:0;}
  50% {opacity:1;}
}

@-webkit-keyframes change {
    0%, 7% {transform:translateY(0);}
  90%,100% {transform:translateY(-90%);}

}

@keyframes opacity {
  0%, 100% {opacity:0;}
  50% {opacity:1;}
}

@keyframes change {
    100% {margin-top: -576px;}

}



.hero-title {
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 0;
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

