function saveData(payload) {
    chrome.storage.local.get("docs", (docs) => {
        let { docs: documentsArr } = docs || { docs: [] }

        documentsArr = documentsArr.filter(item => item.docId != payload.docId)
        documentsArr.unshift(payload)


        chrome.storage.local.set({ "docs": documentsArr })
        console.log(documentsArr)
    })
}

const t = setInterval(() => {
    if (document.querySelector(".quotedetails-docname")) {
        clearInterval(t)
        const url = location.href.split("/")
        const docId = url[url.length - 1]
        const docName = document.querySelector(".quotedetails-docname").textContent
        const payload = { url: location.href, docId, docName }
        saveData(payload)
    }
}, 1000)