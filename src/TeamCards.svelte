<div class="cards-container">
    <div class="snip1336" style="max-height: 350px;">
        <div style="max-height: 150px; overflow:hidden;"><img src="images/profile-bg-1.jpg" /></div>
      
        <div style="text-align:center; padding: 25px;">
          <img src="images/Christopher.jpg" alt="profile-sample4" class="profile2" />
          <h2 style="margin-top: 1rem;">Christopher Thompson<span>Position</span></h2>
          <div style="max-width:100%; display:flex; justify-content:space-between; align-items: center;">
            <div class="socials">
                  <div class="socials-item">
                      <img src="images/twitter-aqua.png">
                  </div>
                  <div class="socials-item">
                      <img src="images/email-nocircle-aqua.png">
                  </div>
                  <div class="socials-item">
                      <img src="images/linkedin-aqua.png">
                  </div>
                  
              </div>
              <a href="#" class="info">More Info</a>
          </div>
        </div>
    </div>
    <figure class="snip1336" style="max-height: 350px;">
        <img src="images/profile-bg-1.jpg" alt="sample87" />
        <figcaption class="slanted-bg">
          <img src="images/Christopher.jpg" alt="profile-sample4" class="profile" />
          <h2>Christopher Thompson<span>Position</span></h2>
          <div style="max-width:100%; display:flex; justify-content:space-between; align-items: center;">
          <div class="socials">
                <div class="socials-item">
                    <img src="images/twitter-aqua.png">
                </div>
                <div class="socials-item">
                    <img src="images/email-nocircle-aqua.png">
                </div>
                <div class="socials-item">
                    <img src="images/linkedin-aqua.png">
                </div>
                
            </div>
            <a href="#" class="info">More Info</a>
        </div>
        </figcaption>
      </figure>
    <figure class="snip1336">
        <img src="images/profile-bg-1.jpg" alt="sample87" />
        <figcaption class="slanted-bg">
          <img src="images/Christopher.jpg" alt="profile-sample4" class="profile" />
          <h2>Christopher Thompson<span>Position</span></h2>
          <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test </p>
          <a href="#" class="follow">Follow</a>
          <a href="#" class="info">More Info</a>
        </figcaption>
      </figure>
      <div class="snip1336">
          <div style="max-height: 150px; overflow:hidden;"><img src="images/profile-bg-1.jpg" /></div>
        
          <div style="text-align:center; padding: 25px;">
            <img src="images/Christopher.jpg" alt="profile-sample4" class="profile2" />
            <h2 style="margin-top: 1rem;">Christopher Thompson<span>Position</span></h2>
            <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test </p>
            <a href="#" class="follow">Follow</a>
            <a href="#" class="info">More Info</a>
          </div>
      </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
.socials {
    display: flex;
    max-width:45%;
}
.socials-item{
    flex: 1;
    padding-left:2px;
    padding-right:2px;
}
.socials img {
    display: block;
    height: 100%;
}
.snip1336 {
  font-family: 'Roboto', Arial, sans-serif;
  position: relative;
  overflow: hidden;
  margin: 10px;
  min-width: 230px;
  max-width: 280px;
  width: 100%;
  color: #ffffff;
  text-align: left;
  line-height: 1.4em;
  border-radius: 15px;
  background-color: #141414;
  transition: all 0.25s ease;
}
.snip1336:hover {
    transform: scale(1.05);
}
.snip1336 * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.snip1336 img {
  max-width: 100%;
  vertical-align: top;
  opacity: 0.85;
}
.snip1336 figcaption {
  width: 100%;
  background-color: #141414;
  padding: 25px;
  position: relative;
}
.snip1336 .slanted-bg:before {
  position: absolute;
  content: '';
  bottom: 100%;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 55px 0 0 400px;
  border-color: transparent transparent transparent #141414;
}
a {
  padding: 5px;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-size: 0.7em;
  text-transform: uppercase;
  margin: 10px 0;
  display: inline-block;
  opacity: 0.65;
  width: 47%;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
}
a:hover {
  opacity: 1;
}
.snip1336 .profile {
  border-radius: 50%;
  position: absolute;
  bottom: 100%;
  left: 25px;
  z-index: 1;
  max-width: 150px;
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.snip1336 .profile2 {
    position:relative;
    opacity: 1;
  border-radius: 50%;
  object-fit:cover;
  margin-top: -125px;
  z-index: 1;
  max-width: 150px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.follow {
  margin-right: 4%;
  border-color: aqua;
  color: aqua;
}
.snip1336 h2 {
  margin: 0 0 5px;
  font-size: 1.4em;
  font-weight: 300;
}
.snip1336 h2 span {
  display: block;
  font-size: 0.6em;
  color: aqua;
}
.snip1336 p {
  margin: 0 0 10px;
  font-size: 0.8em;
  letter-spacing: 1px;
  opacity: 0.8;
}
/* p {
    margin-left:2rem;
    margin-right:2rem;
    color: black;
    font-size: 0.8rem;
    text-align: center;
} */
h3 {
    color:black;
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 0.5px;
}
h4 {
    font-size: 0.9rem;
    color:grey;
}
.profile-pic{
    width: 100%;
    height: 125px;
    object-fit:cover;
    border-radius: 50%;
}
.photo {
    margin-left:auto;
    margin-right:auto;
    margin-top: 1rem;
    margin-bottom:1rem;
    width: 125px;
    height: 125px;
    border-radius: 50px;
}

/* h2 {
    text-align:left;
    min-width:50%;
    font-size: 4.5rem;
    line-height: 1;
} */

.cards-container{
    display:flex;
    flex-wrap: wrap;
    margin-left:1rem;
    margin-right: 1rem;
    justify-content: space-between;
    margin-bottom: 10rem;
}

.card{
    justify-items: center;
    display: grid;
    grid-template-rows: 40% 10% 10% 30% 10%;
    width: 275px;
    height: 400px;
    background-color:#222222;
    border-radius: 15px;
    box-shadow: 0px 3px 5px black;
}

</style>