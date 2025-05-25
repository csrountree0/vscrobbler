const apiurl = "https://api.discogs.com/releases/";

/*
    This function takes in a query parameter and extracts the
    discogs ID from the string using regex to then make a call
    to the discogs api and pull all the data pertaining to the
    provided ID for the album the user wishes to scrobble.
*/
async function searchDiscogs(query) {
    // create a structure to hold data about a given album
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
        query = query.replace(/\[r?(\d+)\]|\s+/g, '$1');
    }

    // Make a call to the discogs api and extract and place data in the structure
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