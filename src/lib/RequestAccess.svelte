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
    let response = await fetch(link + "/request_access", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: body,
    }).then((res) => res.json());
    if (response.status == 201) {
      alert(
        `You are number ${response.data.count} in line. Thank you for your interest.`
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
    <h1 style="color:rgb(33,33,33)">Request access to AllSkills beta</h1>
    <img
      style="width:128px; margin: 10px;"
      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSItMi42MTYgLTMuNzAxIDQyMS4zNTEgNDIyLjYxMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZWxsaXBzZSBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS13aWR0aDogM3B4OyIgY3g9IjIwOC44NTMiIGN5PSIyMDguOTE0IiByeD0iMjA2LjkxNCIgcnk9IjIwNi45MTQiLz4KICA8ZyBmaWxsPSIjNkNDIiBzdHJva2Utd2lkdGg9IjAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMjE1ODEsIDAsIDAsIDEuMjE1ODEsIC0xMDcxLjA1MDY1OSwgLTQ4My45MDkyNDEpIiBzdHlsZT0iIj4KICAgIDxwYXRoIGQ9Ik0gMTA2OS4yIDQ5My41IEwgMTA3Ny41IDUxMCBDIDEwNzcuNSA1MTAgMTEwMS4zIDUxMC4zIDExMTIgNTEwLjMgTCAxMTMxLjUgNTEwLjQgTCAxMTMxLjggNDkzLjcgTCAxMTMyIDQ3NyBMIDEwNjEgNDc3IEwgMTA2OS4yIDQ5My41IFogTSAxMDQwLjQgNDk2LjIgTCAxMDMxLjMgNTE0LjUgTCAxMDU3LjEgNTY2LjIgTCAxMDgzIDYxOCBMIDEwMjguMiA2MTggTCAxMDIwLjMgNjMzLjcgQyAxMDE2IDY0Mi4zIDEwMTIuNCA2NDkuNyAxMDEyLjIgNjUwLjIgQyAxMDEyIDY1MC42IDEwNDAgNjUxIDEwNzQuNCA2NTEgTCAxMTM3IDY1MSBMIDEwOTMuOCA1NjQuNSBDIDEwNzAgNTE2LjkgMTA1MC4zIDQ3OCAxMDUwIDQ3OCBDIDEwNDkuNyA0NzggMTA0NS40IDQ4Ni4yIDEwNDAuNCA0OTYuMiBaIiBzdHlsZT0icGFpbnQtb3JkZXI6IGZpbGw7IGZpbGw6IHJnYigwLCAyNTUsIDIzNCk7Ii8+CiAgICA8cGF0aCBkPSJNIDEwMjYuNyA1MjguNSBDIDEwMjUuMyA1MjYuNyA5NjMgNjUxIDk2MyA2NTEgTCAxMDAwLjUgNjUxIEwgMTAyMi40IDYwNy4yIEwgMTA0NC4zIDU2My40IEwgMTAzNi4yIDU0Ni45IEMgMTAzMS44IDUzNy45IDEwMjcuNSA1MjkuNiAxMDI2LjcgNTI4LjUgWiIgc3R5bGU9InBhaW50LW9yZGVyOiBmaWxsOyBmaWxsOiByZ2IoMCwgMjU1LCAyMjkpOyIvPgogIDwvZz4KPC9zdmc+"
      alt="logo"
    />
    <input
      style="width:100%; border:none; border-bottom: 1px solid rgb(33,33,33); margin: 20px; font-size: 1rem;"
      type="text"
      bind:value={email}
      placeholder="Email"
    />
    <div>
      <button
        on:click={requestAccess}
        style="border: none;background-color: rgb(33,33,33);color: aqua;padding: 10px 20px;"
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
    padding: 10px;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
</style>
