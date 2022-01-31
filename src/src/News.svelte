<div class="news-container">
    <!--<div style="width:90vw"><div class="arrow"></div></div>-->

    {#each news as {img, title, content}}
        <div class="card">
            <div class="image">
                <img src="images/profile-bg-1.jpg" />
            </div>
            <h2 class="title">{title}</h2>
            <div class="content">
                <p>{content}</p>
            </div>
        </div>
    {/each}
</div>

<script>
    const news = [
        {
            img: "",
            title: "Soft Launch!",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            img: "",
            title: "First videoshoot with local hockey phenom",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            img: "",
            title: "Charles Hammelin leaves for Olympics",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            img: "",
            title: "Charles Hammelin leaves for Olympics",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            img: "",
            title: "Charles Hammelin leaves for Olympics",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
            img: "",
            title: "Charles Hammelin leaves for Olympics",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        }
    ]
</script>

<style>
    .arrow {    
        right: 10px;
        top: 50%;
        display: none;
        position:absolute;
        color: rgba(0,0,0,0.3);
        font-size: 64px;
    }
    .arrow::after {
        content: '\00BB';
    }
    @media screen and (max-width: 820px) {
        .arrow {
            display: block;
        }
        .image img {
            width: auto !important;
        }
        .news-container {
            width: 95% !important;
            -webkit-overflow-scrolling:auto;
        }
        .news-container::-webkit-scrollbar:vertical {
            width:12px;
        }
        .news-container::-webkit-scrollbar-thumb {
            background-color: black;
            border-radius: 10px;
            border: 2px solid white;
        }
        .news-container::-webkit-scrollbar-track {
            background-color: black;
            border-radius: 10px;
        }
        .news-container::-webkit-scrollbar:horizontal {
            height: 12px;
        }
    }
    .image {
        height:150px;
    }
    .image img {      
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius:10px;
    }
    .title {
        padding-left: 10px;
        padding-right: 10px;
    }
    h2 {
        margin-bottom: 0;
    }
    .content {
        padding: 10px;
        overflow:hidden;
    }
    .card {
        border-radius: 10px;
        margin-bottom:20px;
        margin-top:30px;
        text-align: center;
        min-width: 350px;
        max-width: 400px;
        max-height: 550px;
        display: grid;
        transition: box-shadow 0.2s;
        grid-template-areas: 
            "image"
            "title"
            "content";
    }
    .card:hover {
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.4);
    }
    .news-container {
        position:relative;
        width: 85%;
        padding-top:30px;
        margin-left:auto;
        margin-right: auto;
        display: flex; 
        flex-wrap:no-wrap;
        overflow-x: scroll;
        overflow-y:hidden;
        gap: 12px;
    }
</style>