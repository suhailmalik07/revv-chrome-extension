chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    //Send message to content Script -> Page was changed
    //or execute parser from here 
    // chrome.tabs.executeScript
    const { tabId, url } = details

    const matches = ["https://", ".revvsales.com/documents/"]
    let flag = true
    matches.forEach(item => {
        if (!url.includes(item)) {
            flag = false
        }
    })

    if (flag) {
        chrome.tabs.sendMessage(details.tabId, { action: "SendIt" });
    }
});


setInterval(() => {
    chrome.storage.local.get(["user", "docs"], (data) => {
        const { user } = data
        getActivities(user)
    })
}, 10000)



const getActivities = (user) => {
    console.log(user)
}

const fetchApi = (url, token) => {
    return fetch({
        method: "GET",
        url,
        headers: {
            AccessToken: token
        }
    }).then(({ response }) => response.json())
}