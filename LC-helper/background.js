chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("leetcode.com/contest")) {
      const urlParts = tab.url.split('/');
      const contestIdIndex = urlParts.indexOf("contest") + 1;
      const contestId = urlParts[contestIdIndex];
      const problemIdIndex = urlParts.indexOf("problems") + 1;
      const problemId = urlParts.slice(problemIdIndex).join('/');

      console.log(contestId)
      console.log(problemId)
      // contentScript will have access to below generated message
      chrome.tabs.sendMessage(tabId, {
          type: "NEW", // new contest event
          contestId: contestId,
          problemId: problemId
      });
  }
});
