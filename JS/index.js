let user;

const getDocs = () => {
  chrome.storage.local.get("docs", (data) => {
    const { docs } = data;
    displayData(docs);
    return docs;
  });
};

const getActivities = () => {
  chrome.storage.local.get("activities", (data) => {
    const activities = data.activities.map(item => ({ ...item, status: true }))
    // set notification
    chrome.storage.local.set({ "activities": activities })
    // set notification icon
    setNotification(0)
    displayActivity(activities);

    console.log(activities)
  })
}


function handleClickOnRecent(e) {
  const { name, id } = e.target
  if (name == "gen_parmaLink" && id) {
    fetch("https://api.revvsales.com/api/perma-link", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'AccessToken': 'access_token'
      },
      body: {
        "object_id": id,
        "object_type": "DOC"
      }
    })
  }
}

const toggleToActivity = () => {
  document.getElementById("activity").style.display = "inline";
  document.getElementById("recent").style.display = "none";
  document.getElementById("goToActivity").style.background = "wheat";
  document.getElementById("goToActivity").style.color = "black";
  document.getElementById("goToRecent").style.background = "none";
  document.getElementById("goToRecent").style.color = "white";
};

const toggleToRecent = () => {
  document.getElementById("activity").style.display = "none";
  document.getElementById("recent").style.display = "inline";
  document.getElementById("goToRecent").style.background = "wheat";
  document.getElementById("goToRecent").style.color = "black";
  document.getElementById("goToActivity").style.background = "none";
  document.getElementById("goToActivity").style.color = "white";
};


const goToActivity = document.getElementById("goToActivity");
goToActivity.addEventListener("click", toggleToActivity);

const goToRecent = document.getElementById("goToRecent");
goToRecent.addEventListener("click", toggleToRecent);


function renderDOM(user) {
  !user.access_token ? showForm() : showApp()
}

function showApp() {
  document.getElementById("app").style.display = "block"
  document.getElementById("form").style.display = "none"

  getDocs();
  getActivities();
}

function showForm() {
  document.getElementById("app").style.display = "none"
  document.getElementById("form").style.display = "block"

  // add event listener to form
  document.getElementById("form").addEventListener("submit", async e => {
    e.preventDefault()
    try {
      user = await handleLogin(e.target)
      console.log(user)
      renderDOM(user)
    } catch (err) {
      console.log(err)
    }
  })
}

chrome.storage.local.get("user", (data) => {
  user = data?.user || {}
  console.log(user, "user")
  renderDOM(user)
})

// const btn = document.getElementById("loginBtn")
// const root = document.getElementById("root")
// let user = {}


// document.addEventListener("DOMContentLoaded", function () {
//     renderDOM()
// })

function renderDOM() {
    loadData()
    !user?.access_token ? loadForm() : renderApp()
}

const loadData = () => {
    console.log(chrome.storage)
    chrome.storage.local.get(["user"], function (items) {
        user = JSON.parse(items["user"] || "{}")
        renderDOM()
    })
}


// function loadForm() {
//     root.innerHTML = `<form id="loginForm">
//         
//     </form>`


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


function setNotification(count) {
  // set notification icon
  chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
  count > 0
    ? chrome.browserAction.setBadgeText({ text: `${count}` })
    : chrome.browserAction.setBadgeText({ text: `` })
}
