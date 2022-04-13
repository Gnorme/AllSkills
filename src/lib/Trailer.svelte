<div id="trailer-container" style="background-image:var(--trailerBg);" data-embed="O2A5MIWsCFI">
    <div id="trailer"></div>
</div>

<script>
    import { onMount } from "svelte";
    onMount(() => {
      //Load YouTube Videos on page...
      var youTubeVideo = document.getElementById("trailer");
          var thumbnail = "https://img.youtube.com/vi/O2A5MIWsCFI/maxresdefault.jpg";
          //set CSS
          youTubeVideo.style.cssText = "max-width: 560px;margin: 60px auto;";

          //set microdata attributes for SEO
          youTubeVideo.setAttribute("itemprop", "video");
          youTubeVideo.setAttribute("itemscope", '');
          youTubeVideo.setAttribute("itemtype", "http://schema.org/VideoObject");

          //set HTML
          youTubeVideo.innerHTML = '<div class="play"></div>' +
              '<meta itemprop="embedURL" content="https://www.youtube.com/embed/O2A5MIWsCFI" />' +
              '<img style="cursor: pointer; border-radius:25px;" class="trailer" src="' + thumbnail + '" />';

          //add click event that will load YouTube video
          youTubeVideo.addEventListener( "click", function() {
              this.innerHTML = '<iframe class="trailer" frameBorder="0" style="border-radius:25px; width:100%"' +
                  'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' +
                  'src="https://www.youtube.com/embed/O2A5MIWsCFI?enablejsapi=1&rel=0&showinfo=0&autoplay=1"' +
                  ' allowFullScreen="allowfullscreen"></iframe>';
          } );
      });
</script>

<style>
    :global(.youtube:hover .play){
        cursor: pointer;
    background: red;
    opacity: 0.9;
    }

:global(.play) {
  font-size: 1.1em; /* change this to change size */
  transform: translateY(130px);
  position: absolute;
  left:0;
  right:0;
  margin:auto;
  background: #3b3636;
  opacity: 0.75;
  border-radius: 50% / 10%;
  color: #FFFFFF;
  height: 3em;
  padding: 0;
  text-align: center;
  text-indent: 0.1em;
  transition: all 150ms ease-out;
  width: 4em;
  top:25%;
}

:global(.play::before) {
  background: inherit;
  border-radius: 5% / 50%;
  bottom: 9%;
  content: "";
  left: -5%;
  position: absolute;
  right: -5%;
  top: 9%;
}

:global(.play::after) {
  border-style: solid;
  border-width: 1em 0 1em 1.732em;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.75);
  content: ' ';
  font-size: 0.75em;
  height: 0;
  margin: -1em 0 0 -0.75em;
  top: 50%;
  position: absolute;
  width: 0;
}
    #trailer-container {
        margin-top:100px;
        height: 600px;
        display: flex;
        justify-content: center;
        position:relative;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 35% 90%;
    } 
    #trailer {
        display: flex;
        margin: 60px auto;
        overflow: hidden;
        justify-content: center;
        width: 300px;
    }
    :global(.trailer) {
        overflow:hidden;
        object-fit:cover;
    }
    @media screen and (max-width: 820px) {
        :global(#trailer-container) {
            width: auto !important;
            padding:10px;
            background-size: 100% 90% !important;
        }
    }
</style>
