<div class="cards-container">
  {#each staff as {name, position, descr, email, img}, i}
    <figure class="snip1336">
        <img src="images/profile-bg-1.jpg" alt="sample87" />
        <figcaption class="slanted-bg" class:bgselected={selected === i} >
          <img src={img} alt="profile-sample4" class="profile" class:selected={selected === i}/>
          <h2>{name}<span>Position</span></h2>
          <p class:hidden={selected != i}>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test </p>
          <div style="max-width:100%; display:flex; justify-content:space-around; max-height:60px; ">
            <div class="socials" style="width:45%">
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
		position: "Position",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "test@example.com",
		img: "images/Noah.jpg"	
	},
  {
	  id: 0,
		name: "Frank Sammut",
		position: "Position",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "test@example.com",
		img: "images/Frank.jpg"	
	},
  {
	  id: 0,
		name: "Christopher Thompson",
		position: "Position",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "test@example.com",
		img: "images/Christopher.jpg"	
	},
  {
	  id: 0,
		name: "Charles Hamelin",
		position: "Position",
		descr: "Some text that describes me lorem ipsum ipsum lorem.",
		email: "test@example.com",
		img: "images/Charles.jpg"	
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
.show-back {
		transform: rotateY(180deg);
	}
.content {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  background-color: #141414;
  transition: all 0.25s !important;
  transform-style: preserve-3d;
}
.front,
.back {
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
}

.back {
  background: #03446A;
  color: white;
  transform: rotateY( 180deg );
}
.hidden{
  max-height:0px !important;
  overflow:hidden !important;
}
.selected {
  left:25% !important;
}

.snip1336 .bgselected::before {
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
    max-width:25px;
    align-self:center;
}
.socials img {
    display: block;
}
.snip1336 {
  perspective: 1000px;
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
.snip1336:hover{
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
  padding: 25px;
  position: relative;
  transition: all 0.25s ease !important;
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
  transition: border-width 0.25s ease !important;
}
a {
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
a:hover {
  opacity: 1;
}
.snip1336 .profile {
  border-radius: 50%;
  position: absolute;
  bottom: 100%;
  z-index: 1;
  left:25px;
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
  margin: 0 0 15px;
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
  max-height: 7em;
  overflow:auto;
  transition: max-height 0.25s, overflow 0.25s 0.25s !important;
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
    align-items:flex-start;
    justify-content: space-between;
    padding-bottom:300px;
    margin-top:100px;
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