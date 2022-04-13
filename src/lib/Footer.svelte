<script>
    import NewsletterSignup from "./NewsletterSignup.svelte";
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-col" id="links">
            <h4>Links</h4>
            <ul class="col-content">
                <li><a href="#Trailer">Trailer</a></li>
                <li><a href="#Table">About</a></li>
                <li><a href="#Challenge">Challenge System</a></li>
                <li><a href="#Vote">Vote Token</a></li>
                <li><a href="#NFT">NFTs</a></li>
                <li><a href="#Ambassadors">Ambassador Program</a></li>
                <li><a href="#Roadmap">Roadmap</a></li>
                <li><a href="#Tokenomics">Tokenomics</a></li>
            </ul>
        </div>
        <div class="footer-col" id="register">
            <h4 id="links">Newsletter Subscription</h4>
            <div class="col-content">
                <NewsletterSignup color='black'/>
            </div>
            
        </div>
        <div class="footer-col" id="Contact">
            <h4 id="links">Connect</h4>
            <div class="col-content" style="display:flex; justify-content:space-between">
                <a href="mailto:info@allskills.ca"><img alt="Email" src="images/email.png" id="email"></a>
                <a href="https://www.twitter.com/@AllSkillsNFT"><img alt="Discord" src="images/discord.png" id="discord"></a>
                <a href="https://www.instagram.com/AllSkillsNFT"><img alt="Instagram" src="images/instagram.png" id="instagram"></a>
                <a href="https://www.twitter.com/@AllSkillsNFT"><img alt="Twitter" src="images/twitter.png" id="twitter"></a>
            </div>
        </div>
    </div>
    <div id="logo">
        <img class="soft" alt="Logo" style="margin-right: 12px;" src="images/logo-white-bottom.png" />
        <img class="hard" alt="Logo" style="margin-right: 12px;" src="images/logo-dark-bottom.png" />
    </div>
</footer>

<style>

:global(.soft-mode) .soft {
    display: block !important;
}
:global(.soft-mode) .hard {
    display: none !important;
}
.soft {
    display: none;
}

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
    .col-content {
        margin-top: 0 !important;
        margin-bottom: 10px !important;
    }
    .col-content a {
        width: 18% !important;
    }   
}
h4 {
    font-size: 1.2rem;
    color: black;
    margin-bottom:0;
}
:global(.soft-mode) h4 {
    color: white;
}
.col-content a {
    width: 25%;
    margin-left:5px;
}
a > img {
    width:100%;
}
#logo {
    display:none;
}
#Contact {
    grid-area: connect;
}
#register{
    grid-area: register;
}
#links {
    grid-area: links;
}

img{
    width:50%;
    margin-bottom: 20px;
    margin-top:10px;

}
.col-content{
    margin-top: 3rem;
}

li{
    text-decoration: underline black;
}
a{
    color: black;
    font-weight:300;
}
:global(.soft-mode) a {
    color: white !important;
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
.footer a {
    color: black;
}
.footer{
    width:100%;
    height: 400px;
    background-color: aqua;
    border-top: 1px solid black;
}
:global(.soft-mode) .footer {
    background-color: #001220;
    color:white;
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