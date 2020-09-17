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


function setNotification(count) {
  // set notification icon
  chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
  count > 0
    ? chrome.browserAction.setBadgeText({ text: `${count}` })
    : chrome.browserAction.setBadgeText({ text: `` })
}
