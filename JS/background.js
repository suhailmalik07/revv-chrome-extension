chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    const { tabId, url } = details
    const matches = ["https://", ".revvsales.com/documents/"]
    let flag = true
    matches.forEach(item => {
        if (!url.includes(item)) {
            flag = false
        }
    })

    if (flag) {
        chrome.tabs.sendMessage(tabId, { action: "SendIt" });
    }
});


let user;
chrome.storage.local.get("user", (data) => {
    user = data?.user || {}
    console.log(user, "user")
    getActivities()
})

// fetch activites
function getActivities() {
    chrome.storage.local.get("activities", async (data) => {
        console.log("fetching activities", data)
        let activities = []
        if (data?.activities) {
            activities = data.activities
        }

        setNotification(activities.filter(item => !item.status).length)

        const lastTime = activities[0]?.timestamp || "2006-01-02T15:04:05.000000Z"

        try {
            const { page } = await fetchApi("https://api.revvsales.com/api/folders/?page_num=1&sort_by_doc_num=true")
            const allDocs = page.inodes.filter(item => item.type === "f").map(item => item.doc_no).map(item => fetchApi(`https://api.revvsales.com/api/documents/${item}?after=${lastTime}&limit=40`))
            const promises = await Promise.all(allDocs)

            const objectIdsTmp = promises.map(item => item.Document)
            updateDocs(objectIdsTmp)

            const objectIds = objectIdsTmp.map(item => item.object_id).map(item => fetchApi(`https://api.revvsales.com/api/object-activities/objects/${item}`))

            const Activities = await Promise.all(objectIds)
            let arr = []
            Activities.forEach(act => {
                arr.push(...act)
            })

            arr = arr.filter(item => item.event !== "DOCUMENT_OPENED" && new Date(item.timestamp) > new Date(lastTime)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            activities.unshift(...arr)
            activities = activities.slice(0, 25)

            chrome.storage.local.set({ "activities": activities })
            setNotification(activities.filter(item => !item.status).length)

        } catch (err) {
            console.log(err)
        }
    })

}


async function fetchApi(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            "AccessToken": user.access_token,
            'Content-Type': 'application/json',
            'GrantType': 'password'
        }
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}


function setNotification(count) {
    // set notification icon
    chrome.browserAction.setBadgeBackgroundColor({ color: "#fe7171" });
    count > 0
        ? chrome.browserAction.setBadgeText({ text: `${count}` })
        : chrome.browserAction.setBadgeText({ text: `` })
}


function updateDocs(data) {
    console.log(data)
    chrome.storage.local.get("docs", (d) => {
        let docs = []
        if (d?.docs) {
            docs = d.docs
        }
        docs = docs.map(item => ({ ...item, ...data.find(i => i["doc_no"] == item.docId) }))
        chrome.storage.local.set({ "docs": docs })
    })
}

setInterval(() => {
    getActivities()
}, 60000)