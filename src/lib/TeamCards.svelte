<section id="Team">
  <h2 class="section-title" style="text-decoration-color: var(--baseText); -webkit-text-decoration-color: var(--baseText)">The Team</h2>
  <div class="cards-container">
    {#each staff as {name, position, descr, email, twitter, linkedin, img, bg}, i}
      <figure class="card">
          <!--<img class="background" src={bg} alt="sample87" />-->
          <div style="height:200px;">
            <svg viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
              <polygon style="fill: {bg};" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
              <polygon style="fill: {bg};" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
            </svg>  
          </div>
          <figcaption class="slanted-bg" class:bgselected={selected === i} >
            <img src={img} alt="profile-sample4" style="border: 3px solid {bg}" class="profile" class:selected={selected === i}/>
            <h2>{name}<span>{position}</span></h2>
            <p class:hidden={selected != i}>{descr}</p>
            <div style="max-width:100%; display:flex; justify-content:space-around; max-height:60px; ">
              <div class="socials" style="width:45%">
                  <div class="socials-item">
                    <a href={twitter} class="twitter"><img alt="Twitter" src="images/twitter-aqua.png"></a>
                  </div>
                  <div class="socials-item">
                      <a href="mailto:{email}"><img alt="{email}" src="images/email-nocircle-aqua.png"><a></a>
                  </div>
                  <div class="socials-item">
                      <a href={linkedin}><img alt="LinkedIn" src="images/linkedin-aqua.png"></a>
                  </div>
                  
              </div>
              {#if selected === i}
              <button class="more-info" style="border-color: {bg}" on:click={toggleMoreInfo} data-card-id={i}>Less Info</button>
              {:else}
              <button class="more-info" style="border-color: {bg}" on:click={toggleMoreInfo} data-card-id={i}>More Info</button>
              {/if}
          </div>
          </figcaption>
          <svg viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
            <polygon style="fill: {bg};" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
            <polygon style="fill: {bg}" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
          </svg>
        </figure>
        {/each}
  </div>
</section>

<script>
  const staff = [
    {
	  id: 0,
		name: "Noah Goren",
		position: "Co-Founder",
		descr: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University’s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah’s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him. ",
		email: "ngoren@allskills.ca",
    twitter:"https://twitter.com/@NoGoren",
    linkedin:"https://www.linkedin.com/in/noahgoren/",
		img: "images/noah_s.png",	
    bg: "aqua"
	},
  {
	  id: 0,
		name: "François Sammut",
		position: "Co-Founder",
		descr: "A director, conceptualist and creative, François, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, François has learned from them all and applies this knowledge and passion to AllSkills.",
		email: "fsammut@allskills.ca",
    twitter:"https://twitter.com/@Sammut_frank",
    linkedin:"https://www.linkedin.com/in/fsammut/",
		img: "images/frank_s.png",	
    bg: "#FF3333"	
	},
  {
	  id: 0,
		name: "Christopher Thompson",
		position: "Co-Founder",
		descr: "Christopher has a wide range of interests and knowledge.  On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
		email: "cthompson@allskills.ca",
    twitter:"",
    linkedin:"https://www.linkedin.com/in/christopher-thompson-b48b7b8b/",
		img: "images/christopher_s.png",	
    bg: "blueviolet"	
	},
  {
	  id: 0,
		name: "Charles Hamelin",
		position: "Co-Founder",
		descr: "A ﬁve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world’s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers.",
		email: "chamelin@allskills.ca",
    twitter:"https://twitter.com/@Speedskater01",
    linkedin:"https://www.linkedin.com/in/charles-hamelin-70600816a/",
		img: "images/charles_s.png",	
    bg: "gold"	
	},
  ]
  let selected
  let infoShowing = false;
  let hidden = true;
  let buttonText = "More Info";
  const toggleMoreInfo = (e) => {
		// if same card clicked twice to toggle front and back
		if (selected === Number(e.target.dataset.cardId)) {
			selected = null;
			infoShowing = !infoShowing;
      hidden = !hidden;
		} else {
      hidden = !hidden;
			infoShowing = !infoShowing;
			selected = Number(e.target.dataset.cardId)

		}
	}
  function clickMoreInfo() {
    selected = !selected
    bgselected = !bgselected
    hidden = !hidden
  }

	let selectedFlip;
	$:console.log(selectedFlip)
	
	let cardBackShowing = false;
	
	const toggleBackFront = (e) => {
		// if same card clicked twice to toggle front and back
		if (selectedFlip === Number(e.target.dataset.cardId)) {
			selectedFlip = null;
			cardBackShowing = !cardBackShowing;
		} else {
			cardBackShowing = !cardBackShowing;
			selectedFlip = Number(e.target.dataset.cardId)
		}
	}

</script>

<style>
  .card h2 {
    color: white;
  }
  a {
    cursor:pointer;
  }
.hidden{
  max-height:0px !important;
  overflow:hidden !important;
}
.selected {
  left:25% !important;
}

.card .bgselected::before {
  transition: border-width 0.25s linear !important;
  border-width: 55px 0px 0px 5000px !important;
}
.socials {
    display: flex;
    max-width:45%;
    justify-content: space-around;
}
.socials-item{
    padding-left:2px;
    padding-right:2px;
    max-width:30%;
    align-self:center;
}
.socials img {
    display: block;
}
.card {
  font-family: 'Roboto', Arial, sans-serif;
  align-items: flex-start;
  overflow: hidden;
  margin: 0 auto 20px auto;
  min-width: 230px;
  max-width: 280px;
  line-height: 1.2em;
  border-radius: 15px;
  background-color: #141414;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 7px 1px rgba(0,0,0,0.3);
}
.card:hover{
  box-shadow: 0px 0px 15px 0px rgba(0, 238, 255, 0.2);
}
.card * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.card img {
  max-width: 100%;
  vertical-align: top;
  opacity: 0.85;
}
.card figcaption {
  padding: 25px;
  padding-bottom: 0px;
  position: relative;
  transition: all 0.25s ease !important;
}
.card .slanted-bg:before {
  position: absolute;
  content: '';
  bottom: 100%;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 55px 0 0 400px;
  border-color: transparent transparent transparent #141414;
  transition: border-width 0.25s ease !important;
}
a:hover {
  opacity: 1;
}
.card .profile {
  border-radius: 50%;
  position: absolute;
  bottom: 100%;
  z-index: 1;
  left:25px;
  max-width: 150px;
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
.card h2 {
  margin: 0 0 15px;
  font-size: 1.4em;
  font-weight: 300;
}
.card h2 span {
  display: block;
  font-size: 0.6em;
  color: aqua;
}
.card p {
  margin: 0 0 10px;
  font-size: 0.9em;
  letter-spacing: 1px;
  max-height: 25em;
  overflow:auto;
  transition: max-height 0.25s, overflow 0.25s 0.25s !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.card::-webkit-scrollbar {
  display:none;
}
.cards-container{
    display:flex;
    margin-bottom: 100px;
    max-width: 1220px;
    margin-left:auto;
    margin-right:auto;
    width:90%;
    flex-wrap: wrap;
    align-items:flex-start;
    justify-content: space-between;
    margin-top:100px;
}

.more-info {
  padding: 10px;
  background-color: transparent;
  border: 2px solid;
  color: #ffffff;
  font-size: 0.7em;
  text-transform: uppercase;
  display: inline-block;
  opacity: 0.65;
  width: 47%;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
  cursor:pointer;
}
@media screen and (max-width: 1350px) {
  .card {
    max-width: 280px;
  }
  .card h2{
    font-size: 1.1em;
  }
  a {
    font-size: 0.55rem;
  }
  .card p {
    font-size: 0.8em;
  }
}
</style>