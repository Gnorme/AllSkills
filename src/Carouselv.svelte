<div class="carousel-container">
    <div class="container">
        <input type="radio" name="slider" id="item-1" checked>
        <input type="radio" name="slider" id="item-2">
        <input type="radio" name="slider" id="item-3">
    <div class="cards">
        <label class="card" for="item-1" id="card-1">
        <img src="images/bass.avif" alt="card">
        </label>
        <label class="card" for="item-2" id="card-2">
        <img src="images/Dunk.avif" alt="card">
        </label>
        <label class="card" for="item-3" id="card-3">
        <img src="images/skateboard.avif" alt="card">
        </label>
        
    </div>
    </div>
</div>
<style>
@import url("https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap");

* {
  box-sizing: border-box;
}

@media screen and (max-width: 820px) { 
    .card {
        width: 100% !important;
    }
    .cards {
        width: 80% !important;
    }
    .container {
        overflow-x: hidden;
    }
    .carousel-container {
        width: 100% !important;
    }
}
.carousel-container {
        width: 75%; 
        margin-right:auto; 
        margin-left:auto; 
        margin-top: 10rem; 
        margin-bottom: 10rem;
    }
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
  font-family: 'DM Sans', sans-serif;
  transition: background .4s ease-in;
  background-color: #c394f8;
}

input[type=radio] {
  display: none;
}

.card {
  position: absolute;
  width: 60%;
  height: 100%;
  left: 0;
  right: 0;
  margin: auto;
  transition: transform .4s ease;
  cursor: pointer;
}

.container {
  width: 100%;
  max-width: 800px;
  max-height: 600px;
  height: 70vh;
  margin-left:auto;
  margin-right:auto;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.cards {
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

#item-1:checked ~ .cards #card-3, #item-2:checked ~ .cards #card-1, #item-3:checked ~ .cards #card-2 {
  transform: translatex(-40%) scale(.8);
  opacity: .4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-2, #item-2:checked ~ .cards #card-3, #item-3:checked ~ .cards #card-1 {
  transform: translatex(40%) scale(.8);
  opacity: .4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-1, #item-2:checked ~ .cards #card-2, #item-3:checked ~ .cards #card-3 {
  transform: translatex(0) scale(1);
  opacity: 1;
  z-index: 1;
}
</style>