const recentTable = document.getElementById('recent-table')
const recentData = [0, 1, 2, 3, 4];

recentData.map(() => {
    const recentList = document.createElement('tr')
    recentList.className = 'recent-list'
    recentList.innerHTML =
        `<td class='recent-items'>
        <button>For Something</button>
        <button class='activities'>Activities</button>
    </td>`
    recentTable.append(recentList)
})

const toggleRecentActiv = () => {
    const recent = document.getElementById('recent')
    const activity = document.getElementById('activity')

    const recentDisplay = recent.style.display === 'none' ? 'inline' : 'none'
    recent.style.display = recentDisplay

    const activityDisplay = activity.style.display === 'none' ? 'inline' : 'none'
    activity.style.display = activityDisplay

}

document.getElementById('activityBack').addEventListener('click', toggleRecentActiv)

const activityButton = document.getElementsByClassName('activities')
for (let i = 0; i < activityButton.length; i++) {
    activityButton[i].addEventListener('click', toggleRecentActiv)
}


const getDocs = async () => {
    await chrome.storage.local.get("docs", (data) => {
        const { docs } = data
        return docs
    })
}


// const btn = document.getElementById("loginBtn")
// const root = document.getElementById("root")
// let user = {}


// document.addEventListener("DOMContentLoaded", function () {
//     renderDOM()
// })


// function renderDOM() {
//     loadData()
//     !user?.access_token ? loadForm() : renderApp()
// }

// const loadData = () => {
//     console.log(chrome.storage)
//     chrome.storage.local.get(["user"], function (items) {
//         user = JSON.parse(items["user"] || "{}")
//         renderDOM()
//     })
// }

// function renderApp() {
//     root.innerHTML = user
// }


// function loadForm() {
//     root.innerHTML = `<form id="loginForm">
//         <input type="email" value="coldforce+revvhack@gmail.com" name="email" placeholder="Email" >
//         <input type="password" value="Coldforce@1" name="password" id="" placeholder="Password" >
//         <input type="text" value="ftal37a3" name="org_domain" placeholder="org_domain" name="org_domain">
//         <button id="loginBtn">Login</button>
//     </form>`

//     const loginForm = document.getElementById("loginForm")
//     loginForm.onsubmit = e => {
//         e.preventDefault()
//         handleLogin(loginForm)
//     }
// }

// const handleLogin = async (form) => {
//     const data = new FormData(form)
//     const payload = { user_email: data.get("email"), password: data.get("password"), org_domain: data.get("org_domain") }

//     for (let key in payload) {
//         if (!payload[key]) {
//             return
//         }
//     }

//     const url = `https:/api.revvsales.com/api/v2/auth/initiate-auth`
//     const { User } = await postData(url, payload)
//     user = User
//     chrome.storage.local.set({ "user": JSON.stringify(user) })
//     chrome.storage.local.get("user", (item) => {
//         console.log(item)
//     })

//     renderDOM()
// }


// const postData = async (url = "", data = {}) => {
//     try {
//         const response = await fetch(url, {
//             method: "POST",
//             body: JSON.stringify(data),
//             mode: 'cors', // no-cors, *cors, same-origin
//             headers: {
//                 'Content-Type': 'application/json',
//                 'GrantType': 'password'
//                 // 'Content-Type': 'application/x-www-form-urlencoded',
//             }
//         })
//         return response.json()
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

