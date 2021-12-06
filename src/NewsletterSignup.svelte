<script>
    export let color;
</script>
<div class="signup">
    <input style="color: {color}; border-color: {color}" placeholder="Sign up for our newsletter">
    <button style="color: {color}; border-color: {color}" onclick="alert('test')">REGISTER NOW</button>
</div>

<style>
.signup {
    display:flex;
    width: 100%;
}
button {
    font-weight: 500;
    padding-top: 2rem;
    font-weight: 500;
    padding-bottom: 2rem;
    width: 40%;
    letter-spacing: .1em;
    align-items: center;
    background-color:transparent;
    border: 2px solid;
    background-image: none;
    /* color:black; */
    text-align: center;
    cursor: pointer;
}
input {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 2rem;
    padding-bottom:2rem;
    font-size: 1rem;
    background-color:transparent;
    width: 60%;
    border: 2px solid black;
    /* color:black; */
    pointer-events:initial;
    cursor:pointer;
}
</style>