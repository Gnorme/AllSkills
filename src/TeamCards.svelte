<div class="cards-container">
  {#each staff as {name, position, descr, email, twitter, img, bg}, i}
    <figure class="card">
        <img class="background" src={bg} alt="sample87" />
        <figcaption class="slanted-bg" class:bgselected={selected === i} >
          <img src={img} alt="profile-sample4" class="profile" class:selected={selected === i}/>
          <h2>{name}<span>{position}</span></h2>
          <p class:hidden={selected != i}>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test </p>
          <div style="max-width:100%; display:flex; justify-content:space-around; max-height:60px; ">
            <div class="socials" style="width:45%">
                <div class="socials-item">
                  <a href={twitter} class="twitter"><img alt="Twitter" src="images/twitter-aqua.png"></a>
                </div>
                <div class="socials-item">
                    <img alt="Email" src="images/email-nocircle-aqua.png">
                </div>
                <div class="socials-item">
                    <img alt="LinkedIn" src="images/linkedin-aqua.png">
                </div>
                
            </div>
            {#if selected === i}
            <a class="info" on:click={toggleMoreInfo} data-card-id={i}>Less Info</a>
            {:else}
            <a class="info" on:click={toggleMoreInfo} data-card-id={i}>More Info</a>
            {/if}
        </div>
        </figcaption>
      </figure>
      {/each}
</div>

<script>
  const staff = [
    {
	  id: 0,
		name: "Noah Goren",
		position: "Co-Founder",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "ngoren@allskills.ca",
    twitter:"https://twitter.com/@NoGoren",
		img: "images/Noah_s.webp",	
    bg: "images/summer_bg_s.webp"
	},
  {
	  id: 0,
		name: "Frank Sammut",
		position: "Co-Founder",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "fsammut@allskills.ca",
    twitter:"https://twitter.com/@Sammut_frank",
		img: "images/Frank_s.webp",	
    bg: "images/fall_bg_s.webp"	
	},
  {
	  id: 0,
		name: "Christopher Thompson",
		position: "Co-Founder",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "cthompson@allskills.ca",
    twitter:"",
		img: "images/Christopher_s.webp",	
    bg: "images/winter_bg_s.webp"	
	},
  {
	  id: 0,
		name: "Charles Hamelin",
		position: "Co-Founder",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "chamelin@allskills.ca",
    twitter:"https://twitter.com/@Speedskater01",
		img: "images/Charles_s.webp",	
    bg: "images/rings_s.webp"	
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
  .background {
    height:200px;
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
  line-height: 1.4em;
  border-radius: 15px;
  background-color: #141414;
  transition: all 0.25s ease;
  box-shadow: 0px 0px 7px 1px rgba(0,0,0,0.3);
}
.card:hover{
  transform: scale(1.05);
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
  font-size: 0.8em;
  letter-spacing: 1px;
  max-height: 7em;
  overflow:auto;
  transition: max-height 0.25s, overflow 0.25s 0.25s !important;
  opacity: 0.8;
}
.cards-container{
    display:flex;
    flex-wrap: wrap;
    align-items:flex-start;
    justify-content: space-between;
    padding-bottom:100px;
    margin-top:100px;

}

.info {
  padding: 5px;
  border: 1px solid #ffffff;
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
    max-width: 230px;
  }
  .card h2{
    font-size: 1.1em;
  }
  a {
    font-size: 0.55rem;
  }
  .card p {
    font-size: 0.65em;
  }
}
</style>