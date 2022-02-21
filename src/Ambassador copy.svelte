<div class="ambassador-container">
    <div class="portraits">
        {#each {length: ambassadors} as _, i}
            <div class="portait">
                <div class="question"><span>?</span></div>
                <div class="image"></div>
            </div>
        {/each}
    </div>
</div>

<script>
    let ambassadors = 52;
</script>

<style>
    .question {
        position:absolute;
        display: table;
        width: 70px;
        height: 70px;
        text-align:center;
        color: black;
        z-index:100;
        font-size: 50px;
        font-family: "Raleway";
        font-weight: 600px;
    }
    .image {
        width: 100%;
        height: 100%;
        filter: blur(5px);
        position:relative;
        background-color:white;
    }
    span {
        display: table-cell;
        vertical-align: middle;
    }
    .portraits {
        display: flex;
        width:60%;
        justify-content: center;
        flex-wrap:wrap;
        gap: 10px;
    }
    .portait {
        width: 70px;
        height: 70px;
    }
    .ambassador-container {
        width:100%;
        margin-left: auto;
        margin-right:auto;
        margin-bottom:200px;
    }
    @media screen and (max-width: 820px) {
        .portraits {
            width: 100%;
        }
        .portrait {
            width: 50px;
            height: 50px;
        }
    }
</style>