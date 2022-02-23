<div class="table-content" id="Table">
    <div class="grid-item">
        <div class="table-icon"><img alt="Handshake" style="width:100%" src="images/{softTableIcons[0]}"></div>
        <h3>{$_('home.table.title1')}</h3>
        <p>{$_('home.table.p1')}</p>
    </div>
    <div class="grid-item">
        <div class="table-icon"><img alt="Earnings" style="width:100%" src="images/{softTableIcons[1]}"></div>
        <h3>{$_('home.table.title2')}</h3>
        <p>{$_('home.table.p2')}</p>
    </div>
    <div class="grid-item">
        <div class="table-icon"><img alt="Collectibles" style="width:100%" src="images/{softTableIcons[2]}"></div>
        <h3>{$_('home.table.title3')}</h3>
        <p>{$_('home.table.p3')}</p>
    </div>
    <div class="grid-item">
        <div class="table-icon"><img alt="Marketplace" style="width:100%" src="images/{softTableIcons[3]}"></div>
        <h3>{$_('home.table.title4')}</h3>
        <p>{$_('home.table.p4')}</p>
    </div>
</div>

<script>
    import { _ } from 'svelte-i18n'
    let tableIcons = ["handshake.png", "earn.png", "stamps.png", "ambassador.webp"]
    let softTableIcons = ["handshake_soft.webp", "earn_soft.webp", "stamps_soft.webp", "ambassador_soft.webp"]
    
</script>

<style>
    @media screen and (max-width: 820px) {
        .table-content {
            display:block !important;
            border: 2px solid aqua !important;
        }
        h3 {
            font-size: 2.5rem !important;
        }
        .grid-item{
            grid-template: 
                "a b b"
                "c c c"
                "c c c" !important;
            padding: 1.25rem !important;
            border: 2px solid aqua !important;
        }
        .table-icon {
            width:50% !important;
        }
    }
    h3 {
        font-size: 3rem;
        margin-top:0;
        margin-block-start:0;
        margin-block-end:0;
        font-weight: 500;
        font-family: var(--headerFont);
        grid-area: b;
    }
    p {
        font-size: 1.2rem;
        line-height: 1.5rem;
        font-weight:100;
        font-family: "BentonSans";
        padding-top:2.5rem;
        margin-block-start:0;
        grid-area: c;
    }
    .table-icon {
        align-items: center;
        grid-area:a;
        display:grid;
        padding-right:2rem;
    }
    .grid-item{
        display:grid;
        grid-template:
            "a b b"
            "a c c"
            "a c c";
        padding: 2rem;
        border: 3px solid aqua;
        background-size:100% 100%;
        background-repeat: no-repeat;
        background-image: url("../images/black_bg_s.webp")
    }
    :global(.soft-mode .table-content, .soft-mode .grid-item) {
        border: none !important;
    }
    :global(.soft-mode) .table-content {
        background-color: white;
        box-shadow: 0px 2px 10px rgba(0,0,0,0.3);
    }
    :global(.soft-mode) div{
        border-radius: 30px !important;
        background-image: none;
    }
    .table-content{
        display:grid;
        margin-left:auto;
        margin-right:auto;
        max-width: 1180px;
        margin-top:3rem;
        margin-bottom:3rem;
        border: 3px solid aqua;
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
</style>