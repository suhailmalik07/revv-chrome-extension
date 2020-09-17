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

window.addEventListener("load", () => {
  getDocs();
  getActivities();
});

const findCurrentTime = (timestamp) => {
  var d = new Date(timestamp * 1000),
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2),
    dd = ("0" + d.getDate()).slice(-2),
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2),
    ampm = "AM",
    time;
  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }
  time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
  return time;
};

const displayActivity = (data) => {
  const activityTable = document.getElementById("activity-table");
  data.map((e) => {
    const activityList = document.createElement("tr");
    activityList.className = "activity-list";
    switch (e.event) {
      case "ACCEPTANCE_EMAIL_DELIVERED":
        var timestamp = Math.round(Date.parse(e.timestamp) / 1000);
        activityList.innerHTML = `<td>
                    <img src='../Resources/activity.png' alt='document'/>
                </td>
                <td>
                    <div><b>${e.actor.name}</b><img src=${
          e.actor.image_url
        } alt='profile_img'/></div>
                    <a href="mailto:${e.actor.user_email}">
                        <div>${e.actor.user_email}</div>
                    </a>
                    <div><b>${
                      e.actor.name
                    }</b> received the email & document for acceptance</div>
                    <br/>
                    <div><i>${findCurrentTime(timestamp)}</i></div>
                </td>
                `;
        break;
        case "DOCUMENT_SENT_FOR_ACCEPT":
        var timestamp = Math.round(Date.parse(e.timestamp) / 1000);
        let arr = []
        e.subjects.map(ele=>{
            arr.push(ele.name)
        })
        activityList.innerHTML = `<td>
                    <img src='../Resources/activity.png' alt='document'/>
                </td>
                <td>
                    <div><b>${e.actor.name}</b><img src=${
          e.actor.image_url
        } alt='profile_img'/></div>
                    <a href="mailto:${e.actor.user_email}">
                        <div>${e.actor.user_email}</div>
                    </a>
                    <div>Document sent for acceptanceto <b>${arr.join(', ')}</b></div>
                    <br/>
                    <div><i>${findCurrentTime(timestamp)}</i></div>
                </td>
                `;
        break;
        default:
            activityList.innerHTML = `Something Happened magically!`
    }
    activityTable.append(activityList);
  });
};

const displayData = (docs) => {
  const recentTable = document.getElementById("recent-table");
  console.log(docs);
  docs.map((e) => {
    const recentList = document.createElement("tr");
    recentList.className = "recent-list";
    recentList.innerHTML = `<td class='recent-items'>
                <img src='../Resources/document.png' alt='document'/>
            </td>
            <td>
                <div class='docName'>
                    <b>${e.docName}</b>
                </div>

                <div>
                    <i>Doc No: ${e.docId}</i>
                </div>

            </td>
            <td>
                <a target='_blank' href=${e.url}><button>Open</button></a>
            </td>            
            
            <td class='recent-dir'>
                <button>Generate Link</button>
                <div>
                    Directory: ${e.dir ? e.dir : "/"}
                </div>
            </td>
            `;
    recentTable.append(recentList);
  });
};

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


function setNotification(count) {
  // set notification icon
  chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
  count > 0
    ? chrome.browserAction.setBadgeText({ text: `${count}` })
    : chrome.browserAction.setBadgeText({ text: `` })
}
