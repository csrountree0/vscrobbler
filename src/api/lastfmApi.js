const urlbase = 'https://vscrobblerapihandler.colbyr416-927.workers.dev/'

export async function fmlogin() {

    if (localStorage.getItem('sk')) {
        localStorage.removeItem('sk');
        localStorage.removeItem('token');
        return false;
    } else {
        window.open(urlbase + "fmlogin");
        return true;
    }
}

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

export async function submit_scrobble(params, timestamp) {
    let urladdon = "subscrob";

    const now = new Date();
    let ms = timestamp.split(":");
    now.setHours(parseInt(ms[0]), parseInt(ms[1]));
    let ts = Math.floor(now.getTime()/1000);
    
    const trackTimestamps = [];
    for(let i = 0; i < params.track.length; i++) {
        ts += params.timestamp[i];
        trackTimestamps.push(ts);
    }

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