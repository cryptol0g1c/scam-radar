<template>
  <div class="container">
    <div class="img-container">
      <img :src="logo" alt="" />
      <p>Tools</p>
    </div>

    <div v-if="siteStatus" class="text-container">
      <div class="title-container">
        <h1>This site is {{ getTitle(siteStatus) }}</h1>
        <img :src="`icons/${siteStatus}.png`" alt="" />
      </div>
      <p>Domain: {{ tablink }}</p>
      <div v-if="siteStatus === 'unknown'" class="buttons-container">
        <a
          href="https://github.com/cryptol0g1c/scam-radar/edit/main/src/data/safeSites.json"
          target="_blank"
          rel="noopener noreferrer"
          ><button class="button pr-button">Sitio Seguro</button></a
        >
        <a
          href="https://github.com/cryptol0g1c/scam-radar/edit/main/src/data/scamSites.json"
          target="_blank"
          rel="noopener noreferrer"
          ><button class="button scam-button">Reportar Scam</button></a
        >
      </div>
    </div>
  </div>
</template>

<script>
import safeSites from "../data/safeSites.json";
import scamSites from "../data/scamSites.json";

import logo from "../assets/logo.svg";
const browser = require("webextension-polyfill");

export default {
  name: "HelloWorld",
  data() {
    return {
      tablink: "",
      siteSafe: null,
      siteScam: null,
      siteStatus: "",
      logo,
    };
  },
  mounted() {
    browser.runtime.sendMessage({});

    browser.tabs
      .query({ currentWindow: true, active: true })
      .then(this.updateTabInfo.bind(this))
      .catch();

    browser.tabs
      .query({
        highlighted: true,
      })
      .then(this.updateTabInfo.bind(this))
      .catch();

    chrome.tabs.onActivated.addListener(this.updateTabInfo);
  },
  methods: {
    updateTabInfo(tabs) {
      const url = new URL(tabs[0].url);
      this.tablink = url.hostname.replace("www.", "");

      this.siteSafe = safeSites.find((el) => el === this.tablink);
      this.scamSite = scamSites.find((el) => el === this.tablink);

      if (this.siteSafe) {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/success.png",
          },
        });
        this.siteStatus = "success";
      } else if (this.scamSite) {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/error.png",
          },
        });
        this.siteStatus = "error";
      } else {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/unknown.png",
          },
        });
        this.siteStatus = "unknown";
      }
    },
    getTitle(status) {
      if (status === "success") return "safe";
      else if (status === "error") return "scam";
      else return "unkown";
    },
  },
};
</script>

<style scoped>
p {
  font-size: 18px;
  margin: 5px 0;
}
h1 {
  font-size: 24px;
  margin: 5px 0;
}
.container {
  width: 300px;
}

.img-container {
  background: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img-container img {
  height: 50px;
}
.img-container p {
  padding-right: 1rem;
}
.text-container {
  padding: 0.5rem;
}
.title-container {
  display: flex;
  align-items: center;
}
.title-container img {
  padding-left: 0.5rem;
}

.buttons-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button {
  margin: 0.5rem 0 0 0;
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.pr-button {
  background: green;
}
.scam-button {
  background: red;
}
</style>
