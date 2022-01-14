<div class="news-container">
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
        }
    ]
</script>

<style>
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
        margin-top:30px;
        text-align: center;
        max-width: 400px;
        max-height: 500px;
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
        width: 85%;
        padding-top:30px;
        margin-left:auto;
        margin-right: auto;
    }
</style>