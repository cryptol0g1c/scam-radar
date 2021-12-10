import safeSites from "./data/safeSites.json";
import scamSites from "./data/scamSites.json";

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.action === "updateIcon") {
    const url = new URL(msg.value);
    const tablink = url.hostname.replace("www.", "");

    const siteSafe = safeSites.find((el) => el === tablink);
    const scamSite = scamSites.find((el) => el === tablink);

    if (siteSafe) {
      chrome.browserAction.setIcon({
        path: {
          19: "icons/success.png",
        },
      });
    } else if (scamSite) {
      chrome.browserAction.setIcon({
        path: {
          19: "icons/error.png",
        },
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          19: "icons/unknown.png",
        },
      });
    }
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (array_of_tabs) {
      //Gives details of the active tab in the current window.
      const url = new URL(array_of_tabs[0].url);
      const tablink = url.hostname.replace("www.", "");

      const siteSafe = safeSites.find((el) => el === tablink);
      const scamSite = scamSites.find((el) => el === tablink);

      if (siteSafe) {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/success.png",
          },
        });
      } else if (scamSite) {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/error.png",
          },
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            19: "icons/unknown.png",
          },
        });
      }
    }
  );
  //   const url = new URL(tabs[0].url);
  //   const tablink = url.hostname.replace("www.", "");

  //   const siteSafe = safeSites.find((el) => el === tablink);
  //   const scamSite = scamSites.find((el) => el === tablink);

  //   if (siteSafe) {
  //     chrome.browserAction.setIcon({
  //       path: {
  //         19: "icons/success.png",
  //       },
  //     });
  //   } else if (scamSite) {
  //     chrome.browserAction.setIcon({
  //       path: {
  //         19: "icons/error.png",
  //       },
  //     });
  //   } else {
  //     chrome.browserAction.setIcon({
  //       path: {
  //         19: "icons/unknown.png",
  //       },
  //     });
  //   }
});
