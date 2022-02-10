
  
  <script>
    import { createEventDispatcher, onMount } from "svelte";
    onMount(() => {
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
        window.onYouTubeIframeAPIReady = () =>
        window.dispatchEvent(new Event("iframeApiReady"));
    })
    export let videoId;
    let player;
    let divId = "player-1";
    export function play(){
        console.log("trying to play");
        if (player.getPlayerState() !== 1) {
            player.playVideo();
        }
    }
    export function stop() {
        player.stopVideo()
    }
    export function pause() {
        player.pauseVideo()
    }
    export function unmute() {
        player.unMute()
    }
    export function mute() {
        player.mute()
    }
    export function getPlayerState() {
        return player.getPlayerState()
    }
    const dispatch = createEventDispatcher();
    window.addEventListener("iframeApiReady", function(e) {
      player = new YT.Player(divId, {
        height: "645",
        width: "345",
        videoId,
        playerVars: { 'autoplay': 1, 'controls': 0, 'enablejsapi': 1, 'modestbranding': 1, 'rel': 0 , 'playsinline':1},
        events: {
          onReady: playerIsReady,
          onStateChange: playerStateChange
        }
      });
    });
    function playerStateChange({data}){
      dispatch("PlayerStateChange", data)
      console.log(data)
      let strReturn = "";
      if(data== -1){ 
          strReturn = "(unstarted)";
          //console.log("playing because unstarted")
          //player.playVideo()
        }
      if(data== 0 ){ strReturn = "(ended)"}
      if(data== 1 ){ strReturn = "(playing)"}
      if(data== 2 ){ strReturn = "(paused)"}
      if(data== 3 ){ 
          strReturn = "(buffering)"
          //console.log("playing because of buffer")
          player.playVideo()
        }
      if(data== 5 ){ strReturn = "(video cued)."}
      dispatch("PlayerStateChangeString", strReturn)
    }
    function playerIsReady(event) {
        dispatch("Ready");
        console.log("playing because ready")
        event.target.mute();
        event.target.playVideo();
    }
  </script>
  
  <div style="border-radius:40px; padding-top:19px; padding-left: 5px;" id={divId} />
