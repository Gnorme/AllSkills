<div class="team">
    <h2>The Team</h2>
</div>
<div class="cards-container">
    <div class="card">
        <div class="photo">
            <img src="images/Noah.jpg"/>
        </div>
        <h3>Noah Goren</h3>
        <h4>Position</h4>
        <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test</p>
    </div>
    <div class="card">
        <div class="photo">
            <img src="images/Frank.jpg"/>
        </div>  
        <h3>Frank Sammut</h3>
        <h4>Position</h4>
        <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test</p>
    </div>
    <div class="card">
        <div class="photo">
            <img src="images/Christopher.jpg"/>
        </div> 
        <h3>Christopher Thompson</h3>  
        <h4>Position</h4>
        <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test</p>
    </div>
    <div class="card">
        <div class="photo">
            <img src="images/Charles.jpg"/>
        </div>
        <h3>Charles Hamelin</h3>
        <h4>Position</h4>
        <p>Lorem ipsum test test test test test test test test test test test test test test test test test test test test test test test test test test</p>
    </div>            
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
p {
    margin-left:2rem;
    margin-right:2rem;
    color: black;
    font-size: 0.8rem;
    text-align: center;
}
h3 {
    color:black;
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 0.5px;
}
h4 {
    font-size: 0.9rem;
    color:grey;
}
img{
    width: 100%;
    height: 125px;
    object-fit:cover;
    border-radius: 50%;
}
.photo {
    margin-left:auto;
    margin-right:auto;
    margin-top: 1rem;
    margin-bottom:1rem;
    width: 125px;
    height: 125px;
    border-radius: 50px;
}

h2 {
    text-align:left;
    min-width:50%;
    font-size: 4.5rem;
    line-height: 1;
}

.cards-container{
    display:flex;
    flex-wrap: wrap;
    margin-left:1rem;
    margin-right: 1rem;
    justify-content: space-between;
    margin-bottom: 10rem;
}

.card{
    justify-items: center;
    display: grid;
    grid-template-rows: 40% 10% 10% 30% 10%;
    width: 275px;
    height: 400px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0px 3px 5px black;
}

</style>