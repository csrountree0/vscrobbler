const urlbase = 'https://vscrobblerapihandler.colbyr416-927.workers.dev/'

export async function fmlogin() {
    // check if the user already has a session key(since they dont expire)
    // if not then navigate the user to the login page
    if (localStorage.getItem('sk')) {
        localStorage.removeItem('sk');
        localStorage.removeItem('token');
        return false;
    } else {
        window.location.href = urlbase + "fmlogin";
        return true;
    }
}

// Call the cloudflare worker to get the sessionkey
export async function getSK() {
    const response = await fetch(urlbase + "getsk" + "&" + localStorage.getItem('token'));
    const json = await response.json();
    const js = JSON.parse(JSON.stringify(json));
    if (response.status === 200) {
        localStorage.setItem("sk", js.session.key);
        return true;
    }
    return false;
}

// take the discogs data and provided timestamp to submit a scrobble
export async function submit_scrobble(params, timestamp) {
    let urladdon = "subscrob";

    // initialize a date object to use for timestamp calculation by setting the time to the user provided time
    const now = new Date();
    let ms = timestamp.split(":");
    now.setHours(parseInt(ms[0]), parseInt(ms[1]));
    let ts = Math.floor(now.getTime()/1000);

    /*
       Take each tracks timestamp and add it to the "current" time (user provided time)
       push it after the addition since a track isnt scrobbled until after half the song has been played,
       but assuming you're listening to a vinyl record you will just listen to the full album
     */
    const trackTimestamps = [];
    for(let i = 0; i < params.track.length; i++) {
        ts += params.timestamp[i];
        trackTimestamps.push(ts);
    }

    // construct the request in the format i created for the cloudflare worker and update ui based on response
    for(let k in params) {
        if(k === "api_key" || k === "method") continue;
        
        if(k === "sk") {
            urladdon += `&sk=${params.sk}`;
            continue;
        }

        const values = k === "timestamp" ? trackTimestamps : params[k];
        urladdon += `&${k}=${values.join(",")}`;
    }

    const response = await fetch(urlbase + urladdon, { mode: "cors" });
    return response.status === 200;
} 