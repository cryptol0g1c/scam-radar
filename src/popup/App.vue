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
  computed: {
    defaultText() {
      return browser.i18n.getMessage("extName");
    },
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
</style>
