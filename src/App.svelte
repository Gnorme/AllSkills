<script>
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Content from './Content.svelte';
	import Footer from './Footer.svelte';
	
	import {
		_,
		getLocaleFromNavigator,
		isLoading,
		register,
		init,
		locale
	} from "svelte-i18n";
	register("en", () => import("./langs/en.json"));
	register("es", () => import("./langs/es.json"));
	register("fr", () => import("./langs/fr.json"));
	let page = document.location.hash;

	init({
		fallbackLocale: "en",
		initialLocale: getLocaleFromNavigator()
	});
	window.onpopstate = function(event) {
        page = document.location.hash;
    };
</script>

<svelte:head>
	<style>
		@font-face {
			font-family: "Roboto Mono";
			src: url("./fonts/RobotoMono.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Varela";
			src: url("./fonts/VarelaRound-Regular.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Consolate Elf";
			src: url("./fonts/ConsolateElf.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Oswald";
			src: url("./fonts/Oswald-Regular.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Bebas Neue";
			src: url("./fonts/BebasNeue-Regular.ttf");
			font-display: swap;
		}	
		@font-face {
			font-family: "Raleway";
			src: url("./fonts/Raleway-Medium.ttf");
			font-display: swap;
		}		
		@font-face {
			font-family: "BentonSans";
			src: url("./fonts/BentonSans-Regular.otf");
			font-display: swap;
		}	
		@font-face {
			font-family: "DINPro";
			src: url("./fonts/DINPro.otf");
			font-display: swap;
		}	
	</style>
	<script defer data-domain="allskills.ca" src="https://plausible.io/js/plausible.js"></script>
	<link rel="canonical" href="https://allskills.ca/" />
	<title>AllSkills - Competition based NFT Platform for showcasing all skills.</title>
	<meta name="description" content="AllSkills is a competition based NFT platform where both talented creators and consumers of content can earn money.">
</svelte:head>

{#if $isLoading}
  <p>Loading</p>
{:else}
	<main>
		<Navbar/>
		<Hero/>
		<Content/>
		<Footer/>
	</main>
{/if}
<style>

	:global(body) { 
		margin:0;
		padding: 0;
		color:var(--baseText);
		background-color: var(--bgColor);
	}
	:global(body.soft-mode) {
		--highlight: #b061ff;
		--headerColor: #20c8d4;
		--firstColor:#ff8b58;
		--secondColor: #ff6680;
		--thirdColor: #20c8d4;
		--fourthColor: #5497f0;
		--baseText: #ff8b58;
		--bgColor: rgb(225,225,255);
		--headerFont: "Varela";
		font-family: "Varela" !important;
		background-color: var(--bgColor) !important;
	}
	:root {
		--highlight: aqua;
		--headerColor: aqua;
		--firstColor: aqua;
		--secondColor: #FF3333;
		--thirdColor: blueviolet;
		--fourthColor: gold;
		--baseText: white;
		--headerFont: "Oswald";
		--bgColor: rgb(30,30,30);
	}

	main {
		padding:0;
		margin:0;
		width:100%;
		height:100%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>