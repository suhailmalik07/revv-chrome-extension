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



// fetch activites
async function getActivities() {
    let data = []
    try {
        const { page } = await fetchApi("https://api.revvsales.com/api/folders/?page_num=1&sort_by_doc_num=true")
        const allDocs = page.inodes.filter(item => item.type === "f").map(item => item.doc_no).map(item => fetchApi(`https://api.revvsales.com/api/documents/${item}`))
        const promises = await Promise.all(allDocs)
        const objectIds = promises.map(item => item.Document.object_id).map(item => fetchApi(`https://api.revvsales.com/api/object-activities/objects/${item}`))


        const Activities = await Promise.all(objectIds)
        Activities.forEach(act => {
            data.push(...act)
        })
        data = data.filter(item => item.event !== "DOCUMENT_OPENED").sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        chrome.storage.local.set({ "activities": data })

    } catch (err) {
        console.log(err)
    }
}


async function fetchApi(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            "AccessToken": "eyJraWQiOiIyWm1yRW1rdHpJamxCQTlhTzE0MzhBUWxmcmZOV3ROYTV0RXJ4WHJTTlB3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1OTA5M2I2My1lYzEyLTQ1MmUtYjMwZC01NThhZThkMmQ2NzciLCJldmVudF9pZCI6IjRlNjVkZmRhLTg5OTEtNDcxYy04MWIyLThlZmYxZWQzNGE3MSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MDAzMzI5MjQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2Z0MWRTOTZTYyIsImV4cCI6MTYwMDMzNjUyNCwiaWF0IjoxNjAwMzMyOTI0LCJqdGkiOiJiMWNmOGUxZC04NTY2LTRkMDUtODQ4OC1hNmM4MzI4NmJkNzAiLCJjbGllbnRfaWQiOiI3dDd0OHBjNGZjOWIwZm50OWFrOW5zMzg1NiIsInVzZXJuYW1lIjoiNTkwOTNiNjMtZWMxMi00NTJlLWIzMGQtNTU4YWU4ZDJkNjc3In0.JHHZn4araGE7sul6XilL_-Kpk5JHN4yM6eq6hlXfFV4Oe6RdfxlWzG-ow87EB2a6L2G1-4L__af0k_NydIiujU-loSZzjOn13sVWHTBKakTknhECQ3wgqnBbKEmvV45hnrs16mkqXqv2AdCul8-7taVw_0J-PyB2wnvcpY6VI1A8E5kN49s3MVBG5Kud4QuUNgCLD3uW6dCJhpYGm2mfDK0oPbpLv87y2A7-_VTR-tHo7_Zn3FW8b6yiJMOM1-E7vfoJD9WQGrcPuQAv1AmqPOXMMfAS_NaWo_kWKeNmCYQkheq5a_9bMe1G7AIoYKzrEN2dblvkI5YpRO6mT-OpVg",
            'Content-Type': 'application/json',
            'GrantType': 'password'
        }
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

getActivities()