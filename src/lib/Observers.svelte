<script>
    import { onMount } from "svelte";
    onMount(() => {
        //window.document.body.classList.toggle('soft-mode')
        
        const observer = new IntersectionObserver(entries => {
            // Loop over the entries
            let highlightShowing = 0;
            entries.forEach(entry => {
                // If the element is visible
                if (entry.isIntersecting) {
                    // Add the animation class
                    entry.target.classList.add('type');
                    highlightShowing += 1;
                }
            });
            if (highlightShowing >= 2) {
                observer.disconnect()
            }
        });
        const underlineObserver = new IntersectionObserver(entries => {
            // Loop over the entries
            let titlesShowing = 0;
            entries.forEach(entry => {
                // If the element is visible
                if (entry.isIntersecting) {
                    // Add the animation class
                    entry.target.classList.add('underline');
                    titlesShowing += 1;
                }
            });
            if (titlesShowing >= titles.length) {
                underlineObserver.disconnect()
            }
        });

        const cardObserver = new IntersectionObserver(entries => {
            // Loop over the entries
            let infoShowing = 0;
            entries.forEach(entry => {
                // If the element is visible
                if (entry.isIntersecting) {
                    // Add the animation class
                    entry.target.classList.add('slide-in');
                    infoShowing += 1;
                }
            });
            if (infoShowing >= cards.length) {
                cardObserver.disconnect()
            }
        });
        const coinObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('grow');
                    coinObserver.disconnect()
                }
            })
        })
        const checksObserver = new IntersectionObserver(entries => {
            let cardsShowing = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('growshrink')
                    var styleElem = document.head.appendChild(document.createElement("style"));
                    styleElem.innerHTML = ".cleared::after {animation: appear 4s forwards ease}";
                    cardsShowing += 1;
                    //checksObserver.disconnect()
                }
            });
            if (cardsShowing >= 5) {
                checksObserver.disconnect()
            }

        })


        const checks = document.querySelectorAll(".header");
        checks.forEach(check => checksObserver.observe(check))

        const coin = document.querySelector("#coin");
        coinObserver.observe(coin);

        const cards = document.querySelectorAll('.info')
        console.log("cards: " + cards.length.toString())
        cards.forEach(card => cardObserver.observe(card));

        const importants = document.querySelectorAll('.important')
        importants.forEach(important => observer.observe(important));

        const titles = document.querySelectorAll('.title')
        titles.forEach(title => underlineObserver.observe(title));
    })


    //coin.forEach(p => videoObserver.observe(p));
</script>
<style>
    :global(.growshrink) {
        animation: grow 2s 0.2s ease;
    }
    :global(.grow) {
        transform: scale(1.33);
        z-index: -1;
    } 
    :global(.underline) {
        animation: ul 0.7s 0.2s linear forwards;
    } 

    :global(.type) {
        color:#0000;
        background:
            linear-gradient(var(--highlight) 0 0) 0 50%/150% 95%,
            linear-gradient(var(--highlight) 0 0) 0 0  /100% 100%;
        -webkit-background-clip:padding-box,text;
        background-clip:padding-box,text;
        background-repeat:no-repeat;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
        animation: 
        t 1s forwards,
        b 1s 0.7s forwards;
    } 
    :global(.slide-in) {
        animation: slidein 0.5s forwards linear;  
    }
    @keyframes -global-ul{
        to {background-size: 100% 5px}
    }
    @keyframes -global-t{
    from {background-size:0 95%,0 100%}
    }
    @keyframes -global-b{
    100% {background-position:-200% 50%,0 0}
    }
    @keyframes -global-slidein {
        to {transform:translateX(0);}
    }
    @keyframes -global-appear {
        to {opacity: 1}
    }
    @keyframes -global-grow {
        0% {}
        50% {transform:scale(1.2)}
        100% {transform:scale(1)}
    }
</style>