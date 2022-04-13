var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => en,
  home: () => home
});
module.exports = __toCommonJS(stdin_exports);
const home = {
  hero: {
    title: "Built for",
    description_start: "AllSkills is a platform that looks to bring",
    description_highlight: "creativity, sustainable growth, and increased competition",
    description_end: "to the talent world. Our platform provides an opportunity to witness people of all skills showcasing their talents and competing against others all while earning benefits through our carefully crafted token based Vote and Challenge system and NFT marketplace."
  },
  table: {
    title1: "Skills Competition",
    p1_start: "Creators",
    p1_highlight: "challenge others to a 1on1",
    p1_end: "using a video showcasing their talents. Users vote using our stablecoin $VOTE tokens for the video they like most and the winning video has a chance to be minted as an NFT. Both creators and voters share in the success.",
    title2: "Earnings & Rewards",
    p2_start: "Creators earn $VOTE tokens",
    p2_middle: "for winning challenges which can be easily exchanged into various currencies. Successful",
    p2_highlight: "voters are rewarded with $SKILL tokens",
    p2_end: "to be used in our app and on our Marketplace.",
    title3: "GM Mode",
    p3_start: "Don\u2019t have a skill but still want to compete and earn $VOTE tokens? Then GM Mode is for you. Users with at least 3 NFTs of winning challenge videos in their collection will unlock GM Mode. In GM Mode,",
    p3_highlight: "users can participate in challenges using NFTs",
    p3_end: "and level them up to unlock additional rewards.",
    title4: "Ambassador Program",
    p4_start: "Try and",
    p4_highlight: "out-perform your favourite pros and earn prizes doing it.",
    p4_end: "Every week top athletes from different domains submit a challenge to the community to try and replicate one of their iconic moves. Submit your best attempt to get entered into a raffle and earn prizes."
  },
  highlighted: {
    company: "AllSkills",
    start: "uses future-proof blockchain & smart contract technology to",
    highlight1: "connect talented people & audiences",
    middle: ", and foster skill development through competition all while providing",
    highlight2: "incentives for everyone involved."
  },
  challenges: {
    videos: {
      title: "Take videos showcasing your skills",
      pStart: "No matter if your skill is",
      highlighted: "athletic, artistic, musical,  strategic,  incredibly precise, or even one-of-a-kind",
      pEnd: ", we want to see it. Set your camera up to capture your finest moment and use our custom editing features to make it stand out even more.",
      tooltips: []
    },
    challenges: {
      title: "Put videos up for Challenge",
      pStart: "After you\u2019re satisfied with your video, it\u2019s time to put it up for Challenge.",
      highlighted: "Winning a challenge round is how your video becomes eligible for minting.",
      pEnd: "Choose between putting your video up for Open Challenge or directly challenging another video or user. Rounds last 72h.",
      tooltips: []
    },
    votes: {
      title: "Users vote to determine winner",
      pStart: "Once the challenge starts,",
      highlighted: "the control is now in the voters hands.",
      pEnd: "Users can use Vote tokens to show their support and become part of the journey. Once the challenge is complete, the video with the most votes is declared the winner and has the opportunity to be minted as an NFT.",
      tooltips: []
    },
    earn: {
      title: "Earn money from voting and winning challenges",
      pStart: "Get rewarded for showing off your skills. The creator of the winning video will receive between 1-25% of all vote tokens cast during the challenge while the voters that voted for it get rewarded in SKILL tokens. The creators cut changes based on how close the vote is.",
      highlighted: " Closer vote count = bigger cut.",
      pEnd: "",
      tooltips: []
    }
  },
  vote: {
    win: {
      title: "Earn by winning",
      pStart: "Challenge winners earn a portion of all $VOTE tokens cast during the challenge, making it",
      highlighted: "easier than ever to monetize your skills.",
      pEnd: " "
    },
    cast: {
      title: "Cast your vote",
      pStart: "Use $VOTE tokens to show your support and",
      highlighted: "vote for the challenge videos you love.",
      pEnd: "Vote for the winner and you'll get to share in their success."
    },
    marketplace: {
      title: "Collect Community Content",
      pStart: "Spend your $SKILL tokens on community content featured in our Marketplace like",
      highlighted: "video filters, sound effects, Mint Tokens, and NFTs",
      pEnd: "to use in GM Mode."
    },
    earn: {
      title: "Earn through voting",
      pStart: "Use a keen eye and vote in our Challenge system to collect $SKILL tokens.",
      highlighted: "Voting for the winner of a challenge will earn you $SKILL tokens.",
      pEnd: " "
    },
    stable: {
      title: "Stablecoin for all skills",
      pStart: "Whether buying them to cast votes, or cashing out your hard-earned rewards, $VOTE tokens are guaranteed to be",
      highlighted: "always worth $0.10 each.",
      pEnd: " "
    },
    utility: {
      title: "Platform Utility Token",
      pStart: "Posting a new challenge? Taking a shot at the Ambassador challenge? Selling on our Marketplace? Use $SKILL tokens and pay",
      highlighted: "tiny gas fees.",
      pEnd: ""
    }
  },
  nft: {
    "1": {
      pStart: "All challenge wins that end in the daily",
      highlight: "top 10% of votes received",
      pEnd: "get minted."
    },
    "2": {
      pStart: "To guarantee your wins get minted, purchase a",
      highlight: "Mint Token",
      pEnd: "on our Marketplace or"
    },
    "3": {
      pStart: "Level up by winning challenges and unlock exclusive benefits like NFT",
      highlight: "minting for all your challenge wins.",
      pEnd: ""
    },
    "4": {
      pStart: "Sell your NFTs on our Marketplace for a quick payout or save them for",
      highlight: "GM Mode",
      pEnd: "to continue earning $VOTE tokens."
    },
    "5": {
      pStart: "Your NFTs are safely stored using decentralized cloud storage providers combined with the IPFS, and backed up forever using a \u201Ccollectively owned hard drive that never forgets\u201D, called",
      link: "arweave.",
      pEnd: ""
    }
  },
  gm: {
    "1": {
      pStart: "Build up a collection of amazing content and unlock GM Mode once you own",
      highlight: "at least 3 NFTs."
    },
    "2": {
      pStart: "Save your own NFTs or",
      highlight: "collect NFTs of talented creators on our marketplace",
      pEnd: "using $SKILL tokens earned from voting."
    },
    "3": {
      pStart: "Challenge other GMs to a 1on1 to",
      highlight: "earn $VOTE tokens",
      pEnd: "and level up your NFTs."
    },
    "4": {
      pStart: "Each level your NFT goes up",
      highlight: "increases the base cut",
      pEnd: "you receive for winning."
    }
  },
  ambassador: {
    line1: "Compete in new Ambassador Challenges every week hosted by different athletes",
    line2: "Chance to win an NFT of Ambassador's Challenge video + additional prizes.",
    line3: "Stay tuned for more details."
  },
  roadmap: {
    socials: "Join our Discord and follow our Twitter to get access to the latest announcements and enter raffles to earn prizes from our Ambassadors",
    idea: {
      cleared: [
        "Ideation",
        "Business plan",
        "Feasability study",
        "Olympic skater Charles Hamelin joins project"
      ]
    },
    research: {
      cleared: [
        "Market research",
        "Acquired advisors & CTO",
        "Backed by PME Montreal",
        "Finalist in NBA Launchpad",
        "Pivot towards NFT platform",
        "Launch website",
        "Release whitepaper and tokenomics"
      ]
    },
    plan: {
      cleared: [
        "Setup social community",
        "Release marketing plan",
        "Trailer",
        "Announce partners"
      ],
      uncleared: [
        "Reveal plan for Ambassador program",
        "Reveal first AllSkills Ambassadors",
        "Mint $Skills token"
      ]
    },
    launch: {
      cleared: [],
      uncleared: [
        "Token presale",
        "Mint stablecoin Vote token",
        "Launch closed beta",
        "Public sale",
        "Full release of challenge system and marketplace",
        "Start Ambassador program"
      ]
    },
    post: {
      cleared: [],
      uncleared: [
        "Add unique Tap-to-Record",
        "Release Scout mode",
        "Release GM mode",
        "Add more cosmetics and editing features"
      ]
    }
  },
  tokenomics: {
    pTitle: "10,000,000,000 Tokens",
    paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    list: [
      "Team 10%",
      "Advisors & Partners 10%",
      "Private Sale 10%",
      "Public Sale 20%",
      "Liquidity Pool 20%",
      "Foundation 30%"
    ]
  },
  team: {
    position: "Co-Founder",
    button: "MORE INFO",
    noah: "Noah has been in and around the sport industry since he was 16. After graduating from Brock University\u2019s Sport Management program, he began to focus his career on marketing. Through his experience in Junior Hockey, CFL, AHL and NHL, as well as freelance, Noah has learned the art of connecting with athletes. Noah\u2019s passion for making sports and competition more accessible helps guide AllSkills and stems from his desire to improve the world around him.",
    frank: "A director, conceptualist and creative, Fran\xE7ois, known as the Skating Cameraman, is quick to navigate and come up with new and forward ideas. A lover of all things skills, he has worked on honing his craft and meeting with people across multiple sectors for over 14 years. From musicians to athletes to editors, Fran\xE7ois has learned from them all and applies this knowledge and passion to AllSkills.",
    christopher: "Christopher has a wide range of interests and knowledge. On top of taking on the role of full-stack engineer and smart contract developer, Christopher is an all-round problem solver and helps out wherever he can. With 17 years experience in software development and 9 years being involved in the blockchain world, his vision of bringing AllSkills in to the emerging Web 3.0 space has brought out the true potential of AllSkills and his foresight continues to be invaluable.",
    charles: "A \uFB01ve-time Olympian and two-time Speed Skating World Champion, Charles has worked with some of the world\u2019s biggest brands and brings a competitive edge to AllSkills. Charles not only has experience on the ice, but is also an avid gamer, which combined with his athletic background helps provides great insight in to the minds of athletes and gamers."
  },
  partners: {
    reach: "We're always open to working with exceptional talents and organizations. Reach out if you're interested in being a Partner, Ambassador, or helping us build and grow AllSkills.",
    buttonText: "Reach Out"
  },
  news: {}
};
var en = {
  home
};
