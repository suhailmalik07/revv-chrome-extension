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
                      <div><b>${e.actor.name}</b><img src=${e.actor.image_url
                    } alt='profile_img'/></div>
                      <div><b>${e.actor.name
                    }</b> received the email & document for acceptance</div>
                      <div><i>${findCurrentTime(timestamp)}</i></div>
                  </td>
                  `;
                break;
            case "DOCUMENT_SENT_FOR_ACCEPT":
                var timestamp = Math.round(Date.parse(e.timestamp) / 1000);
                let arr = []
                e.subjects.map(ele => {
                    arr.push(ele.name)
                })
                activityList.innerHTML = `<td>
                      <img src='../Resources/activity.png' alt='document'/>
                  </td>
                  <td>
                      <div><b>${e.actor.name}</b><img src=${e.actor.image_url
                    } alt='profile_img'/></div>
                      <div>Document sent for acceptance to <b>${arr.join(', ')}</b></div>
                      <div><i>${findCurrentTime(timestamp)}</i></div>
                  </td>
                  `;
                break;
            case "DOCUMENT_CREATED":
                var timestamp = Math.round(Date.parse(e.timestamp) / 1000);
                activityList.innerHTML = `<td>
                      <img src='../Resources/activity.png' alt='document'/>
                  </td>
                  <td>
                      <div><b>${e.actor.name}</b><img src=${e.actor.image_url
                    } alt='profile_img'/></div>
                      <div><b>Congrats!</b> A new document created successfully</div>
                      <div><i>${findCurrentTime(timestamp)}</i></div>
                  </td>
                  `;
                break;
            default:
                activityList.innerHTML = `<td>
              <img src='../Resources/activity.png' alt='document'/>
          </td>
          <td>Something Happened magically!</td>`
        }
        activityTable.append(activityList);
    });
};

const displayData = (docs) => {
    const recentTable = document.getElementById("recent-table");
    recentTable.addEventListener("click", handleClickOnRecent)
    console.log(docs);
    docs.map((e) => {
        const recentList = document.createElement("tr");
        recentList.className = "recent-list";
        let a = `<td class='recent-items'>
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
              
              <td class='recent-dir'>`
        if (e.object_id) {
            a += `<button name="gen_parmaLink" id="${e.object_id || ""}" >Generate Link</button>`
        }
        a += `
                  <div>
                      Directory: ${e.dir ? e.dir : "/"}
                  </div>
              </td>
              `;
        recentList.innerHTML = a
        recentTable.append(recentList);
    });
};

const postData = (url = "", data = {}) => {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            'GrantType': 'password'
        }
    }).then(res => res.json())
}

const handleLogin = (form) => {
    const data = new FormData(form)
    const payload = { user_email: data.get("email"), password: data.get("password"), org_domain: data.get("org_domain") }
    console.log(payload)
    for (let key in payload) {
        if (!payload[key]) {
            return
        }
    }

    const url = `https:/api.revvsales.com/api/v2/auth/initiate-auth`
    return postData(url, payload)
        .then(res => res.User)
        .then(res => {
            chrome.storage.local.set({ "user": res })
            return res
        })
}

const getParmaLink = (docId) => {
    return fetch("https://api.revvsales.com/api/perma-link", {
        method: "POST",
        body: JSON.stringify({ object_id: docId, object_type: "DOC" }),
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            'GrantType': 'password',
            "AccessToken": user.access_token
        }
    }).then(res => res.json())
}

const handleClickOnRecent = e => {
    const { name, id } = e.target
    if (name === "gen_parmaLink" && id) {
        getParmaLink(id)
            .then(res => {
                const { url } = res
                console.log(res, "parma link")
                const el = document.createElement('textarea');
                el.value = url;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                document.getElementById("message").style.display = "flex"
                setTimeout(() => {
                    document.getElementById("message").style.display = "none"
                }, 1000)
            })
            .catch(err => console.log(err))
    }
}