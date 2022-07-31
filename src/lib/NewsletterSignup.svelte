<script>
  export let color;
  import { t } from "$lib/translations/index.js";
</script>

<form
  name="newsletter"
  data-netlify-honeypot="bot-field"
  method="POST"
  data-netlify="true"
  netlify
  class="signup"
>
  <input type="hidden" name="form-name" value="newsletter" />
  <input
    name="email"
    style="color: {color}; border-color: {color}; --placeholder: {color}"
    placeholder={$t("content.home.newsletter.placeholder_text")}
  />
  <button style="color: {color}; border-color: {color}"
    >{$t("content.home.newsletter.button_text")}</button
  >
</form>

<style>
  :global(.soft-mode) input {
    border-color: white !important;
    color: white !important;
  }
  :global(.soft-mode) button {
    border-color: white !important;
    color: white !important;
  }
  :global(.soft-mode) input::placeholder {
    color: white !important;
  }
  .signup {
    display: flex;
    width: 100%;
  }
  button {
    font-weight: 500;
    padding-top: 2rem;
    font-weight: 500;
    padding-bottom: 2rem;
    width: 40%;
    letter-spacing: 0.1em;
    align-items: center;
    background-color: transparent;
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
    padding-bottom: 2rem;
    font-size: 1rem;
    background-color: transparent;
    width: 60%;
    border: 2px solid black;
    /* color:black; */
    pointer-events: initial;
    cursor: pointer;
  }
  @media screen and (max-width: 820px) {
    input {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  input::placeholder {
    color: var(--placeholder);
  }
</style>
