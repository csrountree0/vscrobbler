const apiurl = "https://api.discogs.com/releases/";

async function searchDiscogs(query) {
    let params = {
        album: [],
        artist: [],
        method: 'track.scrobble',
        sk: '',
        timestamp: [],
        track: []
    };

    // Parse the query to get the release ID
    let q = query.split('/');
    if (q.length > 1) {
        for (let i = 0; i < q.length; i++) {
            if (q[i] === "release") {
                query = q[i + 1].split('-')[0];
                break;
            }
        }
    } else {
        // Remove [r12345678] format and any whitespace
        query = query.replace(/\[r?(\d+)\]|\s+/g, '$1');
    }

    try {
        const response = await fetch(apiurl + query);
        const json = await response.json();
        let pjson = JSON.parse(JSON.stringify(json));

        params.timestamp = new Array(pjson.tracklist.length).fill("");

        // Process tracklist
        for (let i = 0; i < pjson.tracklist.length; i++) {
            params.artist[i] = pjson.artists[0].name.replace(/\([^)]*\)/g, '');
            params.track[i] = pjson.tracklist[i].title;
            let ms = pjson.tracklist[i].duration.split(":");
            params.timestamp[i] = parseInt(ms[0]) * 60 + parseInt(ms[1]);
            params.album[i] = pjson.title;
        }

        return {
            success: true,
            data: {
                title: pjson.title,
                artist: params.artist[0],
                image: pjson.images[0].uri,
                params: params
            }
        };
    } catch (err) {
        return {
            success: false,
            error: "An error occurred, please make sure input is correct and try again."
        };
    }
}

export { searchDiscogs }; 