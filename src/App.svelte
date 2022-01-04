<script>
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Content from './Content.svelte';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<style>
		@font-face {
			font-family: "Oswald";
			src: url("./fonts/Oswald-Regular.ttf");
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
</svelte:head>

<main>

	<Navbar/>
	<Hero/>
	<Content/>
	<Footer/>
</main>

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