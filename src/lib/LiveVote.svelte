<script>
  import { onDestroy, onMount } from "svelte";
  import { t } from "$lib/translations/index.js";

  const link = "https://atagaia.shop/event";
  let team_one = { name: "Red", score: 0 };
  let team_two = { name: "Blue", score: 0 };
  let vote_score = null;
  let interval = null;
  let user_id = null;
  let leader = null;
  let voted = false;
  let rounds = null;
  let nextRound = null;
  let currentRound = null;
  onMount(async () => {
    user_id = localStorage.getItem("user_id");
    if (user_id == null) {
      user_id = "user" + Math.floor(Math.random() * 100000);
      localStorage.setItem("user_id", user_id);
    }
    console.log(localStorage.getItem("user_id"));
    getCurrentRound();
    getRounds();
    getAllVotes();
    //getNextRound();
    interval = setInterval(() => {
      getCurrentRound();
    }, 5000);
  });
  onDestroy(() => {
    if (interval) {
      window.clearInterval(interval);
    }
  });
  async function getRounds() {
    let response = await fetch(link + "/rounds").then((res) => res.json());
    if (response.status == 200) {
      rounds = response.data.rounds;
      console.log("rounds:", rounds);
    }
    console.log(response);
  }
  async function getAllVotes() {
    let response = await fetch(link + "/votes").then((res) => res.json());
    console.log(response);
  }
  async function getNextRound() {
    let response = await fetch(link + "/next_round").then((res) => res.json());
    console.log(response);
    if (response.status == 200) {
      nextRound = response.data.round;
      console.log(nextRound);
    }
  }
  async function getCurrentRound() {
    let response = await fetch(link + "/current_round").then((res) =>
      res.json()
    );
    console.log(response);
    team_one = { name: response.data.round.teams[0], score: 0 };
    team_two = { name: response.data.round.teams[1], score: 0 };
    let hasVoted = false;
    if (response.data.round.voters) {
      response.data.round.voters.forEach((voter) => {
        if (voter.user_id == user_id) {
          hasVoted = true;
        }
        if (voter.team == team_one.name) {
          team_one.score += 1;
        } else if (voter.team == team_two.name) {
          team_two.score += 1;
        }
      });
      if (team_two.score > team_one.score) {
        leader = team_two.name;
      } else if (team_two.score == team_one.score) {
        leader = "Tie";
      } else {
        leader = team_one.name;
      }
      vote_score = team_one.score + team_two.score;
    }
    currentRound = response.data.round;
    console.log("current:", currentRound);
    voted = hasVoted;
  }
  async function sendVote(team) {
    let vote = JSON.stringify({ voter: user_id, team: team });
    let response = await fetch(link + "/add_vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: vote,
    }).then((res) => res.json());
    if (response.status == 302) {
      alert(response.message);
    }
    console.log(response);
    getCurrentRound();
  }
  function addEffect(target) {
    console.log(target);
    if (!target.classList.contains("button-effect")) {
      target.classList.add("button-effect");
    }
  }
  function removeEffect(target) {
    console.log(target);
    if (target.classList.contains("button-effect")) {
      setTimeout(() => {
        target.classList.remove("button-effect");
      }, 150);
    }
  }
</script>

<div id="live-vote-container">
  <h4
    style="top:0; left:0; margin:0; text-align:right; color: white; position:absolute;"
  >
    {$t("content.home.live_event.banner_start")}
    <span style="color:red"
      >{$t("content.home.live_event.banner_highlight")}</span
    >
    {$t("content.home.live_event.banner_end")} - July 9
  </h4>
  <h1 style="margin-top:40px;">{$t("content.home.live_event.top")}</h1>
  {#if currentRound}
    <h2>{currentRound.round}</h2>
  {/if}
  <h3>{team_one.name}</h3>
  <button
    id="vote-red"
    class="vote-button"
    on:pointerdown={(ev) => addEffect(ev.currentTarget)}
    on:pointerup={(ev) => removeEffect(ev.currentTarget)}
    on:click={() => sendVote(team_one.name)}
    >Vote {$t("content.home.live_event.first_color")}}</button
  >
  <h3>{team_two.name}</h3>
  <button
    id="vote-blue"
    class="vote-button"
    on:pointerdown={(ev) => addEffect(ev.currentTarget)}
    on:pointerup={(ev) => removeEffect(ev.currentTarget)}
    on:click={() => sendVote(team_two.name)}
    >Vote {$t("content.home.live_event.second_color")}</button
  >
  {#if voted}
    <h4>Vote Accepted</h4>
  {/if}

  <!--<h2 style="margin: 20px 0px">{$t("content.home.live_event.bottom")}</h2>
  <div id="rounds-container">
    {#if rounds}
      {#each rounds as round}
        {#if rounds.round < currentRound.round}
          <div class="previous-round">
            {#each round.teams as team, idx}
              {#if idx == 0}
                <h4>{team}</h4>
                <h4>&nbsp;VS&nbsp;</h4>
              {:else}
                <h4>{team}</h4>
              {/if}
            {/each}
          </div>
          {#if true}
            <p class="winner">Winner: test</p>
          {/if}
        {/if}
      {/each}
    {/if}
  </div>-->
  <!--{#if leader != null}
    <h4>{leader} is in the lead!</h4>
  {/if}
  {#if vote_score != null}
    <h4>Vote score: {vote_score}</h4>
  {/if}-->
</div>

<style>
  :global(.button-effect) {
    box-shadow: white 3px 3px 0px 1px !important;
    opacity: 0.6;
  }
  .winner {
    text-align: center;
    margin: 0;
  }
  #next-round-container {
    display: flex;
  }
  #rounds-container {
    overflow: scroll;
  }
  .previous-round {
    display: flex;
    padding: 10px;
    justify-content: center;
  }
  .previous-round h4 {
    margin: 0;
    font-weight: 300;
  }
  h2 {
    margin: 5px;
    text-decoration: underline;
  }
  #vote-red {
    background-color: red;
  }
  #vote-blue {
    background-color: blue;
  }
  .vote-button {
    border: none;
    font-size: 1rem;
    border-radius: 10px;
    padding: 10px 20px;
    z-index: 2;
    box-shadow: black 2px 2px 0px 2px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
  }
  #vote-button-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    translate: -50%;
  }
  #live-vote-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
</style>
