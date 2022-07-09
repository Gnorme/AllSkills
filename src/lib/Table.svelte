<script>
  import { t } from "$lib/translations/index.js";
  let tableIcons = [
    "handshake.png",
    "earn.png",
    "stamps.png",
    "ambassador.png",
  ];
  let softTableIcons = [
    "handshake_soft.png",
    "earn_soft.png",
    "stamps_soft.png",
    "ambassador_soft.png",
  ];
</script>

<section id="About">
  <h2
    class="section-title"
    style="text-decoration-line: none; -webkit-text-decoration-line:none"
  >
    {$t("content.home.table.main_title")}
  </h2>
  <div class="table-content" id="Table">
    <div
      class="grid-item"
      style="background-image: url('../images/black_bg_s.png')"
    >
      <div class="table-icon">
        <img
          alt="Handshake"
          style="width:100%"
          src="images/{softTableIcons[0]}"
        />
      </div>
      <h3>{$t("content.home.table.title1")}</h3>
      <p>
        {$t("content.home.table.p1_start")}
        <span class="highlight">{$t("content.home.table.p1_highlight")}</span>
        {$t("content.home.table.p1_end")}
      </p>
    </div>
    <div
      class="grid-item"
      style="background-image: url('../images/black_bg_s.png')"
    >
      <div class="table-icon">
        <img
          alt="Earnings"
          style="width:100%"
          src="images/{softTableIcons[1]}"
        />
      </div>
      <h3>{$t("content.home.table.title2")}</h3>
      <p>
        <span class="highlight">{$t("content.home.table.p2_start")}</span>
        {$t("content.home.table.p2_middle")}
        <span class="highlight">{$t("content.home.table.p2_highlight")}</span>
        {$t("content.home.table.p2_end")}
      </p>
    </div>
    <div
      class="grid-item"
      style="background-image: url('../images/black_bg_s.png')"
    >
      <div class="table-icon">
        <img
          alt="Collectibles"
          style="width:100%"
          src="images/{softTableIcons[2]}"
        />
      </div>
      <h3>{$t("content.home.table.title3")}</h3>
      <p>
        {$t("content.home.table.p3_start")}
        <span class="highlight">{$t("content.home.table.p3_highlight")}</span>
        {$t("content.home.table.p3_end")}
      </p>
    </div>
    <div
      class="grid-item"
      style="background-image: url('../images/black_bg_s.png')"
    >
      <div class="table-icon">
        <img
          alt="Marketplace"
          style="width:100%"
          src="images/{softTableIcons[3]}"
        />
      </div>
      <h3>{$t("content.home.table.title4")}</h3>
      <p>
        {$t("content.home.table.p4_start")}
        <span class="highlight">{$t("content.home.table.p4_highlight")}</span>
        {$t("content.home.table.p4_end")}
      </p>
    </div>
  </div>
</section>

<style>
  @media screen and (max-width: 820px) {
    .table-content {
      display: block !important;
      border: 2px solid aqua !important;
    }
    h3 {
      font-size: 2.5rem !important;
    }
    .grid-item {
      grid-template:
        "a b b"
        "c c c"
        "c c c" !important;
      padding: 1.25rem !important;
      grid-template-columns: 0.5fr 1fr !important;
      border: 2px solid aqua !important;
    }
    .table-icon {
      width: 75% !important;
      padding: 0 !important;
    }
  }
  .highlight {
    color: var(--highlight);
  }
  h3 {
    font-size: 3rem;
    margin-top: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: 500;
    font-family: var(--headerFont);
    grid-area: b;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.5rem;
    font-weight: 400;
    font-family: "Lato";
    padding-top: 2.5rem;
    margin-block-start: 0;
    grid-area: c;
  }
  .table-icon {
    align-items: center;
    grid-area: a;
    display: grid;
    padding-right: 2rem;
  }
  .grid-item {
    display: grid;
    grid-template:
      "a b b"
      "a c c"
      "a c c";
    grid-template-columns: 0.35fr 1fr;
    padding: 2rem;
    border: 3px solid aqua;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  :global(.soft-mode .table-content, .soft-mode .grid-item) {
    border: none !important;
  }
  :global(.soft-mode) .table-content {
    background-color: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  }
  :global(.soft-mode) div {
    border-radius: 30px !important;
    background-image: none !important;
  }
  .table-content {
    display: grid;
    margin-left: auto;
    margin-right: auto;
    max-width: 1180px;
    margin-top: 3rem;
    margin-bottom: 3rem;
    border: 3px solid aqua;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>
