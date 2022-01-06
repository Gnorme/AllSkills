<nav class="navbar">
    <img alt="Logo" class="logo" src="images/logo.png"/>
    <button class="hamburger" on:click={openNav}>
        <svg width="48px" height="48px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" fill="white" fill-opacity="0"/>
            <path d="M7.94977 11.9498H39.9498" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.94977 23.9498H39.9498" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.94977 35.9498H39.9498" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>      
    </button>
    <div id="sidenav">
        <a href="javascript:void(0)" class="closebtn" on:click={closeNav}>&times;</a>
        <a href="#Table">About</a>
        <a href="#Challenge">Challenge System</a>
        <a href="#Trailer">Trailer</a>
        <a href="#Vote">Vote Token</a>
        <a href="#Roadmap">Roadmap</a>
        <a href="#Team">Team</a>
        <a href="#Contact">Contact</a>
        <div class="locale-selector">
            <div class="select">
                <select value={value} on:change={handleLocaleChange}>
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                </select>
            </div>
        </div>
    </div>
    <div id="overlay"></div>
    
</nav>


<script>
    import { locale } from "svelte-i18n";
    let value = "en";

    /* Set the width of the side navigation to 250px */
    function openNav() {
        document.getElementById("sidenav").style.width = "250px";
        document.getElementById("overlay").style.visibility = "visible";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
        document.getElementById("sidenav").style.width = "0";
        document.getElementById("overlay").style.visibility = "hidden";
    }

	const handleLocaleChange = e => {
		e.preventDefault();
		locale.set(e.target.value);
        closeNav();
	};
    function handleClick(){
        alert('clicked');
    }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,400&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#overlay {
    position:fixed;
    top:0;
    left:0;
    height:100vh;
    width:100%;
    opacity:0.6;
    background-color:#000;
    visibility: hidden;
}
select {
    background-color: transparent !important;
    color: aqua;
    border: none;
}
.logo{
    max-height:100%;
}
.locale-selector{
    position:absolute;
    top:20px;
    left:20px;
}
.navbar {
    z-index:5;
    position: fixed;
    box-sizing: border-box;
    display:flex;
    top: 0;
    left:0;
    width: 100%;
    height: 100px;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1rem;
}


.hamburger {
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor:pointer;
}
#sidenav {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  right: 0;
  font-family:"Oswald";
  background-color: #111; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}
#sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 64px;
  line-height: 64px;
  margin-left: 50px;
}
#sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  white-space: nowrap;
}
#sidenav a:hover {
  color: aqua;
}
</style>