<div id="partner-container">
    <div id="partner-images">
        <a href="https://vantagesports.ca/"><img alt="Vantage Sports Management" src="images/vantage_logo.png" /></a>
        <a href="https://www.alliancemontreal.ca/"><img alt="Montreal Alliance Basketball" src="images/montreal_alliance.png" /></a>
        <a href="https://www.instagram.com/charlyiacono/"><img alt="Charly Iacono" src="images/charly_iacono.png" /></a>
        <a href="https://imaginereplay.com/"><img alt="ReplayNow" src="images/replay_logo.png" /></a>
    </div>
    <h3 style="font-size: 1.7rem; font-weight: 400;">{$_('home.partners.reach')}</h3>
    <div>
        <button on:click="{showForm}" id="reach-out">{$_('home.partners.buttonText')}</button>
    </div>
    <div id="partner-form">
        <form>
            <label for="name">Test</label>
            <input name="name">
        </form>
    </div>
    {#if formShowing}
	<div class="modal">
        <svg class="top" viewBox="-0.35 0 500.35 78.328" xmlns="http://www.w3.org/2000/svg">
            <polygon style="fill: aqua;" points="70.086 0.382 53.904 51.969 -0.944 61.327 -1.27 75.069 63.124 65.518 83.649 -0.101"/>
            <polygon style="fill: aqua;" points="120.568 -0.003 99.057 64.191 500.785 2.143 499.522 0.721 117.904 49.127 134.741 0.134"/>
          </svg>
          <span on:click="{hideForm}">X</span>
        <h2 style="color: white">Thank you for reaching out</h2>
        <form name="partnerships" data-netlify-honeypot="bot-field" method="POST" data-netlify="true" netlify class="signup">
            <input type="hidden" name="form-name" value="partnerships" />
            <label style="text-decoration-color: aqua;" for="name">Name</label>
            <input bind:value={nameValue} name="name">
            <label style="text-decoration-color: gold;" for="email">Email</label>
            <input bind:value={emailValue} name="email">        
            <label style="text-decoration-color: blueviolet;" for="type">Type of partnership</label>
            <select bind:value={typeValue} name="type">
                <option>Ambassador</option>
                <option>Business</option>
                <option>General</option>
            </select>
            <label style="text-decoration-color: #FF3333;" for="messsage">Message</label>
            <textarea bind:value={textValue} name="message"></textarea>
            <button id="submit">Submit</button>
        </form>

        <svg class="bottom" viewBox="-1.79 0 501.79 94.114" xmlns="http://www.w3.org/2000/svg">
            <polygon style="fill: aqua;" points="500.159 16.553 432.482 24.328 392.825 93.844 409.667 93.703 443.069 37.609 499.889 30.393"/>
            <polygon style="fill: aqua;" points="352.106 94.674 335.059 94.797 363.621 47.452 -1.746 94.183 -1.798 80.123 390.963 29.985"/>
          </svg>
	</div>
    <div id="overlay" on:click={() => formShowing = false}></div>
    {/if}
</div>

<script>
    import { _ } from 'svelte-i18n'
    let formShowing = false;
    let textValue = "";
    let emailValue = "";
    let nameValue = "";
    let typeValue = "Ambassador";

    function showForm() {
        
        formShowing = true;
    }
    function hideForm() {
        formShowing = false;
    }

</script>

<style>
    @media screen and (max-width: 820px) {
        span {
            display: block !important;
        }
        #partner-images {
            flex-direction: column;
            gap: 60px;
        }
    }
    #partner-images {
        display:flex;
        gap: 60px;
        align-items: center;
        margin-bottom:100px;
    }
    #partner-images img {
        height: 100%;
    }
    span {
        position:absolute;
        top: 50px;
        right: 30px;
        font-size:1.7rem;
        color:white;
        display:none;
        cursor:pointer;
    }
    #submit {
        position: absolute;
        left: 42px;
        bottom: 25px;
        background-color:blueviolet;
        color:white;
        border: none;
        padding:10px;
        font-size: 1.2rem;
        font-family: "Oswald";
    }
    .bottom {
        position:relative;
        bottom:-15px;
        left:20px;
    }
    form {
        margin: 20px;
    }
    .top {
        position:relative;
        top:-20px;
        left:-20px;
    }
    select {
        background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;
        border: 3px solid gold;
        background-color:white;
        min-width: 150px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    input {
        border: 3px solid blueviolet;
        min-width: 220px;
    }
    label {
        margin-bottom: 10px;
        margin-top: 10px;
        font-size: 1.4rem;
        font-family: "Oswald";
    }
    textarea {
        width: 100%;
        border: 3px solid black;
        min-width: 300px;
        max-width: 100%;
        min-height: 75px;
        max-height: 200px;
    }
    #overlay {
        position:fixed;
        z-index: 9;
        top:0;
        left:0;
        height:100vh;
        width:100%;
        opacity:0.6;
        background-color:#000;
        visibility: visible;
    }
    .modal {
        color: white;
        padding: 20px;
        z-index: 10;
        min-width: 300px;
        max-width: 500px;
        max-height: 800px;
        overflow:hidden;
        top:50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        position:fixed;
        background-color: rgb(34,34,34);
        display:block;
        padding-bottom: 0px;
    }
    #reach-out {
        background-color: blueviolet;
        font-family: 'Bebas Neue';
        color: white;
        font-size: 32px;
        margin-top:30px;
        padding: 20px;
        border-radius: 30px;
        cursor: pointer;
    }
    #partner-form {
        display:none;
    }
    #partner-container {
        margin-left:7%;
        margin-right:7%;
        margin-top:100px;
    }
    #partner-container h2 {
        color: black;
    }
    :global(.soft-mode) #partner-container h2 {
        color: var(--headerColor);
    }
</style>
