let accessToken = null;
const clientID = '5287d3b2a4cb4369a25a85cfdd96baef';
const redirectURI = 'http://localhost:3000';
const Spotify = {
    getAccessToken() {
        if(accessToken) return accessToken;
        const tokenInUrl = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);
        if(tokenInUrl && expiryTime) {
        // Setting access token and expiry time vars
            accessToken = tokenInUrl[1];
            const expiresIn = Number(expiryTime[1])
        
        // Setting the function which will reset the access token when it expires
        window.setTimeout(() => (accessToken = ''), expiresIn * 1000 )
            
        // clearing the url after the access token expires
            window.history.pushState("Access token", null,"/");
            return accessToken;
        }

        //Third check for accessToken
        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        window.location.href = redirect;
    },
    async search(term) {
        accessToken = Spotify.getAccessToken();
    try{
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
    {
        method: 'GET',
        headers: {Authorization: `Bearer ${accessToken}`},
    })
    if(!response.ok){
        throw new Error('Failed to fetch');
    }
        const data = await response.json();
        return data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,

        }))}
        catch(error){
            console.error('Error fetching data: ',error);
            throw error;
        }
    },
    async getCurrentUser() {
        const accessToken = Spotify.getAccessToken();
        try{
                const response = await fetch('https://api.spotify.com/v1/me',{
                    method: 'GET',
                    headers: {Authorization: `Bearer ${accessToken}`}
                })
                if(!response.ok){
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                return data;

            }catch(error){
                console.log(error);
            }
        },
    async createPlaylist(name) {
        const accessToken = Spotify.getAccessToken();
        let user = await Spotify.getCurrentUser();
        const response = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`,{
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'},
            body: JSON.stringify({name: name}),
        });
        if(!response.ok){
            throw new Error('Failed to create Playlist');
        }
        const data = await response.json();
        return data;
    },
    async savePlaylist(name,trackUris) {
        if(!name || !trackUris) return;
        const accessToken = Spotify.getAccessToken();
        const newPlaylist = await Spotify.createPlaylist(name);
        return await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({uris: trackUris}),
        })
    },

    }
export { Spotify }