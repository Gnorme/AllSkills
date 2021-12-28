<script>
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Content from './Content.svelte';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;1,100&family=Montserrat:wght@100;200;300&family=Open+Sans+Condensed:wght@300&family=Roboto:wght@100;300;400;500;700&family=Ultra&display=swap" rel="stylesheet">
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