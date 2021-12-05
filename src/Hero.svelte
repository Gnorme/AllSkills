<section class="hero">
    <div class="hero-split">
        <div class="hero-content">
            <div class="content">Built for</div>
                <div class='scrolling-content'>
                    <ul>
                    <li>Stick handles</li>
                    <li>Ball juggling</li>
                    <li>Trick shots</li>
                    <li>Dribbling</li>
                    <li>Piano playing</li>
                    <li>Gymnists</li>
                    <li>Guitar</li>
                    <li>Billiards</li>
                    <li>Parkour</li>
                    <li style="color:aqua; font-size: 5rem">All Skills</li>
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
    width:50%;
    display: flex;
  align-items: center; 
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
}
.hero-content {
   position: relative;
   font-size: 4rem;
   font-weight: 600;
    width: 100%;
}
.scrolling-content{
    font-size:4rem;
    width: 50%;
    height:220px;
    text-align:left;
    overflow:hidden;
}
.content {
    float:left;
    text-align: right;
  width: 50%;
  color: #ecf0f1;
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
  margin-top:0;
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
    0%, 7% {transform:translateY(0);}
  90%,100% {transform:translateY(-90%);}

}

.hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    

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