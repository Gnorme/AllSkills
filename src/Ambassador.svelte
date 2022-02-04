<div class="ambassador-container">
    <Carousel/>
    <div class="info-container">
        <h4 class="ambassador-info slidedown">{$_('home.ambassador.line1')}</h4>
        <h4 class="ambassador-info slidedown">{$_('home.ambassador.line2')}</h4>
        <h4 style="text-decoration: underline white; -webkit-text-decoration: underline white;" class="ambassador-info slidedown">{$_('home.ambassador.line3')}</h4>
        <!--<h4 class="ambassador-info slidedown">Ambassadors release a Challenge video for the community to try and replicate</h4>
        <h4 class="ambassador-info slidedown">Watch them perform and submit your own attempts at outdoing the pros</h4>
        <h4 class="ambassador-info slidedown">Every submission has a chance to win an NFT of Ambassador’s Challenge + additional prizes</h4>
        <h4 class="ambassador-info slidedown">Top 10 submissions get minted as their own unique NFT and the creators receive a split of the reward pool</h4>-->
    </div>
</div>

<script>
    import Carousel from './Carousel.svelte';
    import { _ } from 'svelte-i18n'
</script>

<style>
    .info-container {
        margin-top:125px;
        text-align:center;
        overflow:hidden;
    }
    h4 {
        font-size: 24px;
    }
    @keyframes slidedown{
        to {transform: translateY(0)}
    }
    .ambassador-container {
        width:100%;
        margin-left: auto;
        margin-right:auto;
        margin-bottom:200px;
    }
    h4 {
        animation-fill-mode: forwards;
        animation-timing-function: ease;
        animation-duration: 1s;
    }
    :global(.slidedown) {
        display:block;
        animation-name: slidedown !important;
    }
    h4:nth-of-type(1) {
        transform: translateY(-500px);
        animation-delay: 0;      
    }
    h4:nth-of-type(2) {
        transform: translateY(-500px);
        animation-delay: 1s;
    }
    h4:nth-of-type(3) {
        transform: translateY(-500px);
        animation-delay: 2s;
    }
    h4:nth-of-type(4) {
        transform: translateY(-500px);
        animation-delay: 3s;
    }
    h4:nth-of-type(5) {
        transform: translateY(-500px);
        animation-delay: 4s;
    }
    @media screen and (max-width: 820px) {
    }
</style>