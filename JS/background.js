chrome.storage.local.get(["user", "docs"], (data) => {
    const { user } = data
    getActivities(user)
})

const getActivities = (user) => {
    console.log(user)
}