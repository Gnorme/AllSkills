<script>
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Content from './Content.svelte';
	import Footer from './Footer.svelte';
</script>


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
		background-color: rgb(54,54,54);
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