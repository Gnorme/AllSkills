<script>
    import NewsletterSignup from "./NewsletterSignup.svelte";
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-col" id="links">
            <h4>Links</h4>
            <ul class="col-content">
                <li><a href="#Trailer">Trailer</a></li>
                <li><a href="#Challenge">Challenge System</a></li>
                <li><a href="#Stablecoin">Vote Stablecoin</a></li>
                <li><a href="#Roadmap">Roadmap</a></li>
                <li><a href="#Tokenomics">Tokenomics</a></li>
                <li><a href="#Team">Team</a></li>
                <li><a>Blog</a></li>
            </ul>
        </div>
        <div class="footer-col" id="register">
            <h4>Newsletter Subscription</h4>
            <div class="col-content">
                <NewsletterSignup color='black'/>
            </div>
            
        </div>
        <div class="footer-col" id="connect">
            <h4>Connect</h4>
            <div class="col-content" style="display:flex; justify-content:space-between">
                <img src="images/email.png">
                <img src="images/discord.png">
                <img src="images/instagram.png">
                <img src="images/twitter.png">
            </div>
        </div>
    </div>
    <div id="logo">
        <img style="margin-right: 12px;" src="images/logo-dark.png" />
        <h3>AllSkills</h3>
    </div>
</footer>

<style>
@media screen and (max-width: 820px) {
    .footer-content {
        grid-template: 
            "connect"
            "register" !important;
        padding-top: 2rem !important;
    }
    #links{
        display:none;
    }
    .footer {
        height: auto !important;
    }
    #logo {
        display: flex !important;
        align-items: center;
        justify-content: center;
    }
}
h3 {
    font-family: "Oswald";
    font-size: 3rem;
}
#logo {
    display:none;
}
#connect {
    grid-area: connect;
}
#register{
    grid-area: register;
}
#links {
    grid-area: links;
}

img{
    width:20%;

}
.col-content{
    margin-top: 3rem;
}

li{
    text-decoration: underline black;
}
a{
    color: black;
}
ul{
    list-style: none;
    margin: 0px;
    padding: 0px;
    text-align: left;
}
.footer-col{
    margin-left: 1rem;
    margin-right: 1rem;
}
.footer{
    width:100%;
    height: 400px;
    background-color: aqua;
}
.footer-content{
    padding-top: 5rem;
    margin-left: auto;
    margin-right:auto;
    max-width: 80rem;
    display:grid;
    align-items: start;
    grid-template: "links register connect" auto / 0.8fr 3fr 0.8fr;
    /*grid-template-columns: 0.8fr 3fr 0.8fr;*/
}
</style>