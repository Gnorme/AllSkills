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

			(function(w,d,s,a,m,t) {
		  a = d.createElement(s);m = d.getElementsByTagName(s)[0];a.defer = true;a.id = 'auditor_app';a.src = 'https://auditor.sitelint.com/auditor.bundle.js?tokenId=db251422c5b58829a1106ab18a32994e3d9ac3f4c04029c5c0e72e75a2065822-allskills';
	function onPageLoaded() {
		w.clearTimeout(t);
		w.removeEventListener('DOMContentLoaded', onPageLoaded);
	
		function loadSiteLintAuditor() {
		  m.parentNode.insertBefore(a, m);
		}
		w.setTimeout(loadSiteLintAuditor, 3500);
	  }
	  function onAuditorLoaded(){
		auditor.config({
		  includeHidden: true,
		  stripTextFromReport: false
		}).run();
	  }
	
	  a.addEventListener('load', onAuditorLoaded);
	
	  if (d.readyState !== 'loading') {
		onPageLoaded();
		return;
	  }
	
	  w.addEventListener('DOMContentLoaded', onPageLoaded);
	})(window, document, 'script');
</script>

<svelte:head>
	<style>
		@font-face {
			font-family: "Roboto Mono";
			src: url("./fonts/RobotoMono.ttf");
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
		background-color: rgb(30,30,30);
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