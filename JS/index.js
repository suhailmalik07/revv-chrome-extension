const btn = document.getElementById("loginBtn")
const root = document.getElementById("root")
let user = {}


document.addEventListener("DOMContentLoaded", function () {
    renderDOM()
})


function renderDOM() {
    loadData()
    !user?.access_token ? loadForm() : renderApp()
}

const loadData = () => {
    chrome.storage.local.get(["user"], function (items) {
        user = JSON.parse(items["user"] || "{}")
        renderDOM()
    })
}

function renderApp() {
    root.innerHTML = user
}


function loadForm() {
    root.innerHTML = `<form id="loginForm">
        <input type="email" value="coldforce+revvhack@gmail.com" name="email" placeholder="Email" >
        <input type="password" value="Coldforce@1" name="password" id="" placeholder="Password" >
        <input type="text" value="ftal37a3" name="org_domain" placeholder="org_domain" name="org_domain">
        <button id="loginBtn">Login</button>
    </form>`

    const loginForm = document.getElementById("loginForm")
    loginForm.onsubmit = e => {
        e.preventDefault()
        handleLogin(loginForm)
    }
}

const handleLogin = async (form) => {
    const data = new FormData(form)
    const payload = { user_email: data.get("email"), password: data.get("password"), org_domain: data.get("org_domain") }

    for (let key in payload) {
        if (!payload[key]) {
            return
        }
    }

    const url = `https:/api.revvsales.com/api/v2/auth/initiate-auth`
    const { User } = await postData(url, payload)
    user = User
    chrome.storage.local.set({ "user": JSON.stringify(user) })
    chrome.storage.local.get("user", (item) => {
        console.log(item)
    })

    renderDOM()
}


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

