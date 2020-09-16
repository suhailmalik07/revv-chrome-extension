const postData = async (url = "", data = {}) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json',
                'GrantType': 'password'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        return response.json()
    }
    catch (err) {
        console.log(err)
    }
}


export const loginUser = payload => {
    const url = `https:/api.revvsales.com/api/v2/auth/initiate-auth`
    const { User } = await postData(url, payload)
    chrome.storage.local.set({ "user": JSON.stringify(user) })
    return User
}