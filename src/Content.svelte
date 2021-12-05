<div class="content">
    <div class="card"><img src="images/runner.jpg" /></div>
    <div class="card"><img src="images/Dunk.jpg" /></div>
    <div class="card"><img src="images/runner.jpg" /></div>
    <div class="card"><img src="images/runner.jpg" /></div>
</div>

<div class="text-content">
    <h2>What We Provide</h2>
    <div class="table-content">
        <div class="grid-item">
            <div class="grid-item-text">
                <h3>Test</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="grid-item-text">
                <h3>Test</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="grid-item-text">
                <h3>Test</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
        <div class="grid-item">
            <div class="grid-item-text">
                <h3>Test</h3>
                <p>test test testtesttest testtesttesttestte testtesttest  test  test  test  test  testst</p>
            </div>
        </div>
    </div>
</div>
<style>
    h3 {
        font-size: 3rem;
        line-height: 1;
        margin-bottom: 2rem;
        font-weight: 500;
    }
    .grid-item{
        display:flex;
        flex: 1 1 0%;
        align-items: center;
        padding: 2.5rem;
        display:flex;
        border: 1px solid aqua;
    }
    .table-content{
        display:grid;
        margin-top:3rem;
        color: white;
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
    h2 {
        text-align:left;
        min-width:50%;
        font-size: 4.5rem;
        line-height: 1;
    }
    .text-content {
        margin-left: auto;
        margin-right: auto;
  align-items: center; 
  font-family: "Roboto", "Lato", sans-serif;
   color: white;
   padding-left: 1rem;
   padding-right: 1rem;
   max-width: 80rem;
   box-sizing: border-box;
    }

    img {
        object-fit: scale-down;
    }

 .card{
     height: 800px;
     max-width: 23%;
     background: rgb(56,56,56);
     transform: skewX(-5deg);
     margin-top:-20px;
     min-width:10%;
     box-shadow: 10px 10px rgba(0,0,0,0.3);
    transition-property: min-width;
    transition: 500ms linear;
     overflow:hidden;
    }

    .card:hover {
        min-width:75%;
        
    }
.content{
    margin-top:100px;
    margin-right:2%;
    max-width:100%;
    margin-left:1%;
    background-color:rgb(54,54,54);
    flex-direction:row;
    height: 900px;
    display:flex;
    width: 100%;
    justify-content: center;
}
</style>