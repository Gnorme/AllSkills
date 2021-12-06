<script>
    import NewsletterSignup from "./NewsletterSignup.svelte";
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-col">
            <h4>Links</h4>
            <ul class="col-content">
                <li><a>Test</a></li>
                <li><a>Test</a></li>
                <li><a>Test</a></li>
                <li><a>Test</a></li>
                <li><a>Test</a></li>
                <li><a>Test</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Newsletter Subscription</h4>
            <div class="col-content">
                <NewsletterSignup color='black'/>
            </div>
            
        </div>
        <div class="footer-col">
            <h4>Connect</h4>
            <div class="col-content" style="display:flex; justify-content:space-between">
                <img src="images/email.png">
                <img src="images/discord.png">
                <img src="images/instagram.png">
                <img src="images/twitter.png">
            </div>
        </div>

    </div>
</footer>

<style>

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
    grid-template-columns: 0.8fr 3fr 0.8fr;
}
</style>