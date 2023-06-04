<script>
  export let requestingAccess;
  const link = "https://atagaia.shop";
  let email = null;
  async function requestAccess() {
    //alert('not impletmented');
    if (!email) {
      alert("Email is empty");
      return;
    }
    if (email.length < 10) {
      alert("Email too short");
      return;
    }
    let body = JSON.stringify({ email: email });
    console.log(body);
    let response = await fetch(link + "/beta_signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: body,
    }).then((res) => res.json());
    if (response.status == 201) {
      alert(
        "Thanks for signing up, keep an eye on your email for further instructions."
      );
      requestingAccess = false;
    } else if (response.status == 409) {
      alert("Request already submitted with that email");
    } else {
      alert("Invalid request");
    }
    console.log(response);
  }
</script>

<div class="request-bg">
  <div class="request-modal">
    <h1>Sign up for AllSkills beta</h1>
    <img
      style="width:128px; margin: 10px;"
      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSItMi42MTYgLTMuNzAxIDQyMS4zNTEgNDIyLjYxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZWxsaXBzZSBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS13aWR0aDogM3B4OyIgY3g9IjIwOC44NTMiIGN5PSIyMDguOTE0IiByeD0iMjA2LjkxNCIgcnk9IjIwNi45MTQiLz4KICA8ZyBmaWxsPSIjNkNDIiBzdHJva2Utd2lkdGg9IjAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMjE1ODEsIDAsIDAsIDEuMjE1ODEsIC0xMDcxLjA1MDY1OSwgLTQ4My45MDkyNDEpIiBzdHlsZT0iIj4KICAgIDxwYXRoIGQ9Ik0gMTA2OS4yIDQ5My41IEwgMTA3Ny41IDUxMCBDIDEwNzcuNSA1MTAgMTEwMS4zIDUxMC4zIDExMTIgNTEwLjMgTCAxMTMxLjUgNTEwLjQgTCAxMTMxLjggNDkzLjcgTCAxMTMyIDQ3NyBMIDEwNjEgNDc3IEwgMTA2OS4yIDQ5My41IFogTSAxMDQwLjQgNDk2LjIgTCAxMDMxLjMgNTE0LjUgTCAxMDU3LjEgNTY2LjIgTCAxMDgzIDYxOCBMIDEwMjguMiA2MTggTCAxMDIwLjMgNjMzLjcgQyAxMDE2IDY0Mi4zIDEwMTIuNCA2NDkuNyAxMDEyLjIgNjUwLjIgQyAxMDEyIDY1MC42IDEwNDAgNjUxIDEwNzQuNCA2NTEgTCAxMTM3IDY1MSBMIDEwOTMuOCA1NjQuNSBDIDEwNzAgNTE2LjkgMTA1MC4zIDQ3OCAxMDUwIDQ3OCBDIDEwNDkuNyA0NzggMTA0NS40IDQ4Ni4yIDEwNDAuNCA0OTYuMiBaIiBzdHlsZT0icGFpbnQtb3JkZXI6IGZpbGw7IGZpbGw6IHJnYigwLCAyNTUsIDIzNCk7Ii8+CiAgICA8cGF0aCBkPSJNIDEwMjYuNyA1MjguNSBDIDEwMjUuMyA1MjYuNyA5NjMgNjUxIDk2MyA2NTEgTCAxMDAwLjUgNjUxIEwgMTAyMi40IDYwNy4yIEwgMTA0NC4zIDU2My40IEwgMTAzNi4yIDU0Ni45IEMgMTAzMS44IDUzNy45IDEwMjcuNSA1MjkuNiAxMDI2LjcgNTI4LjUgWiIgc3R5bGU9InBhaW50LW9yZGVyOiBmaWxsOyBmaWxsOiByZ2IoMCwgMjU1LCAyMjkpOyIvPgogIDwvZz4KPC9zdmc+"
      alt="logo"
    />
    <label class="custom-field">
      <input type="text" placeholder="&nbsp;" name="email" bind:value={email} />
      <span class="placeholder">Email</span>
    </label>
    <!--<input
      style="width:100%; border:none; border-bottom: 1px solid rgb(33,33,33); margin: 20px; font-size: 1rem;"
      type="text"
      bind:value={email}
      placeholder="Email"
    />-->
    <div>
      <button
        on:click={requestAccess}
        style="border: none;background-color: aqua;color: rgb(33,33,33);padding: 10px 20px; font-weight: 600;"
        >Submit</button
      >
      <button
        style="padding: 10px 20px; border: none"
        on:click={() => {
          requestingAccess = false;
        }}>Cancel</button
      >
    </div>
  </div>
</div>

<style>
  h1 {
    font-size: 2rem;
    font-family: "Bebas Neue";
    color: white;
    text-align: center;
  }
  button {
    cursor: pointer;
  }
  .request-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 11;
    top: 0;
    left: 0;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .request-modal {
    position: absolute;
    width: 300px;
    font-size: 1.5rem;
    display: flex;
    z-index: 11;
    flex-direction: column;
    align-items: center;
    top: 50%;
    left: 50%;
    gap: 10px;
    padding: 30px;
    box-shadow: black 1px 10px 10px;
    transform: translate(-50%, -50%);
    background-color: rgb(20, 20, 20);
  }
  .custom-field {
    position: relative;
    font-size: 14px;
    border-top: 20px solid transparent;
    margin-bottom: 5px;
    display: inline-block;
    --field-padding: 12px;
    font-weight: 400;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .custom-field input {
    border: none;
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
    padding: var(--field-padding);
    width: 250px;
    outline: none;
    font-size: 14px;
    color: white;
    border-bottom: 1px solid;
    border-radius: 0px;
  }
  .custom-field .placeholder {
    position: absolute;
    left: var(--field-padding);
    width: calc(100% - (var(--field-padding) * 2));
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    top: 22px;
    line-height: 100%;
    transform: translateY(-50%);
    color: white;
    transition: top 0.3s ease, color 0.3s ease, font-size 0.3s ease;
  }
  .custom-field input.dirty + .placeholder,
  .custom-field input:focus + .placeholder,
  .custom-field input:not(:placeholder-shown) + .placeholder {
    top: -10px;
    font-size: 10px;
    color: white;
  }
</style>
