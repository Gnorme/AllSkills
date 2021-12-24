<div class="tokenomics-container">
    <div style="width:25%"></div>
    <div style="text-align:center;">
        <p style="display:inline; width: 30%; position:relative; top:50%; z-index:4; font-size: 1.5em; margin-left: auto; margin-right:auto">100,000,000 Tokens</p>
        <svg xmlns="http://www.w3.org/2000/svg" id="sv" width="500" height="500" viewBox="-50 -50 400 400">
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Team 10,000,000" on:mouseleave={deselect} class="section" id="0" fill="#003f5c" d="M150, 0 A150,150 0 0 1 238.1656698289039,28.64591204404894 L214.6548245411962,61.007002165635896 A110,110 0 0 0 150,40 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Advisors 5,000,000" on:mouseleave={deselect} class="section" id="1" fill="#374c80" d="M238.1656698289039, 28.64591204404894 A150,150 0 0 1 271.3502408873674,61.82903518403633 L238.9901766507361,85.3412924682933 A110,110 0 0 0 214.6548245411962,61.007002165635896 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Seed Sale 10,000,000" on:mouseleave={deselect} class="section" id="2" fill="#7a5195" d="M271.3502408873674, 61.82903518403633 A150,150 0 0 1 299.9999998572106,149.99345501530712 L259.9999998952878,149.99520034455855 A110,110 0 0 0 238.9901766507361,85.3412924682933 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Private Sale 5,000,000" on:mouseleave={deselect} class="section" id="3" fill="#bc5090" d="M299.9999998572106, 149.99345501530712 A150,150 0 0 1 292.6609042625172,196.34507951229457 L254.61799645917927,183.98639164234936 A110,110 0 0 0 259.9999998952878,149.99520034455855 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Public Sale 20,000,000" on:mouseleave={deselect} class="section" id="4" fill="#ef5675" d="M292.6609042625172, 196.34507951229457 A150,150 0 0 1 150.01308996937328,299.99999942884233 L150.00959931087374,259.9999995811511 A110,110 0 0 0 254.61799645917927,183.98639164234936 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Liquidity Pool 20,000,000" on:mouseleave={deselect} class="section" id="5" fill="#ff764a" d="M150.01308996937328, 299.99999942884233 A150,150 0 0 1 7.34718665258751,196.36997783122493 L45.387936878564176,184.00465040956496 A110,110 0 0 0 150.00959931087374,259.9999995811511 Z"></path>
            <path on:mouseover={bringToFront} on:mousemove={showTooltip} data-value="Foundation 30,000,000" on:mouseleave={deselect} class="section" id="6" fill="#ffa600" d="M7.34718665258751, 196.36997783122493 A150,150 0 0 1 149.9738200613531,0.000002284630625126738 L149.9808013783256,40.000001675395794 A110,110 0 0 0 45.387936878564176,184.00465040956496 Z"></path>
        </svg>
    </div>
    <div style="width:25%; display:table">
        <ul style="display: table-cell; vertical-align: middle;">
            <li class:highlight={selected === 0} class="team"><span>Team 10%</span></li>
            <li class:highlight={selected === 1} class="advisors"><span>Advisors 5%</span></li>
            <li class:highlight={selected === 2} class="seed"><span>Seed Sale 10%</span></li>
            <li class:highlight={selected === 3} class="private"><span>Private Sale 5%</span></li>
            <li class:highlight={selected === 4} class="public"><span>Public Sale 20%</span></li>
            <li class:highlight={selected === 5} class="liquidity"><span>Liquidity Pool 20%</span></li>
            <li class:highlight={selected === 6} class="foundation"><span>Foundation 30%</span></li>
        </ul>
    </div>
</div>
<div id="tooltip" display="none" style="position: absolute; display: none;"></div>


<style>
    #tooltip {
        padding:5px;
        background-color:#141414;
    }
    .team{
        fill:#003f5c;
    }
    ul {
        list-style:none;
        letter-spacing: 1.5px;
    }
    .highlight{
        margin: -2px;
        border: 2px solid aqua;
    }
    ul li:before{
        margin: 0 0.2em 0 -0.5em;
        content:"\2022";
        font-size: 4rem;
        vertical-align: middle;
        line-height: 0.9em;
    }
    span {
        font-size: 20px;
        margin-left:10px !important;
        padding-right:10px;
    }

    .team:before {
        color:#003f5c;
    }
    .advisors:before{
        color:#374c80;
    }
    .seed:before {
        color:#7a5195;
    }
    .private:before {
        color:#bc5090;
    }
    .public:before {
        color:#ef5675;
    }
    .liquidity:before {
        color:#ff764a;
    }
    .foundation:before {
        color:#ffa600;
    }
    li {
        list-style-type:none;
    }
    .section {
        transform-origin: 50% 50%;
        transform-box: fill-box;
    }
    .section:hover {
        transform:scale(1.05);
        stroke: aqua;
        stroke-width: 2px;
        stroke-linejoin: round;
        box-shadow: 120px, 80px, 40px, 20px, aqua;
        z-index:2;
    }
    .tokenomics-container{
        display:flex;
        margin-left:auto;
        margin-right:auto;
        justify-content: space-evenly;
    }
</style>

<script>
    function showTooltip(evt, text) {
  let tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = evt.target.dataset.value;
  tooltip.style.display = "block";
  tooltip.style.left = evt.pageX + 15 + 'px';
  tooltip.style.top = evt.pageY - 20 + 'px';
}
function hideTooltip() {
  var tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}
    let selected;
    import Chart from 'svelte-frappe-charts';
    function bringToFront(e) {
        selected = Number(e.target.id)
        console.log(e.target.id);
        e.target.parentNode.appendChild(e.target);
    }

    function deselect() {
        selected = null;
        hideTooltip();
    }

    let data = {
        labels: ['Team','Advisors', 'Foundation', 'Seed Sale', 'Private Sale', 'Public Sale', 'Liquidity Pool'],
        datasets: [
            {
                name:"Test", values: [10,5,10,10,10,15,40]
            }
        ]
    }
</script>