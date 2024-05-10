let accessToken = '';
const clientID = '5287d3b2a4cb4369a25a85cfdd96baef';
const redirectURI = 'https://jamming20.netlify.app';
// const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
// const RESPONSE_TYPE = 'token';
// const scopes = ['user-read-private',
// 'user-read-email',
// 'user-library-read',
// 'user-library-modify',
// 'user-top-read',
// 'playlist-read-private',
// 'playlist-modify-public',
// 'playlist-modify-private',
// 'playlist-read-collaborative',
//     // Add more scopes as needed
//   ];
const Spotify = {
    async getAccessToken() {
            
            // accessToken = window.localStorage.getItem("token");
            // if(accessToken)
            // return accessToken;
            // window.location.href = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${RESPONSE_TYPE}&scope=${scopes.join('%20')}`
            // const hash = window.location.hash;

            // if(!accessToken && hash){

            //     accessToken = hash.substring(1).split("&").find(elem => elem.startsWith('access_token')).split("=")[1];
                
            //     window.location.hash = "";
            //     window.localStorage.setItem("token", accessToken)
            //     return accessToken;
            // }
            // Check if there is already a valid access token
            // if (accessToken) return accessToken;
        
            // // If no valid access token exists, obtain a new one using client credentials grant
            // const authParams = {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     body: `grant_type=client_credentials&client_id=${clientID}&client_secret=${client_secret}`
            // };
        
            // try {
            //     const response = await fetch('https://accounts.spotify.com/api/token', authParams);
            //     if (!response.ok) {
            //         throw new Error('Failed to obtain access token');
            //     }
        
            //     const data = await response.json();
            //     accessToken = data.access_token; // Store the new access token
            //     return accessToken;
            // } catch (error) {
            //     console.error('Error renewing access token:', error);
            //     throw error; // Rethrow the error to handle it in the caller function
            // }

        // // VARIANTA2
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
        accessToken = await Spotify.getAccessToken();
    try{
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
    {
        method: 'GET',
        headers: {Authorization: `Bearer ${accessToken}`},
    })
    if(!response.ok){
        console.log('failed fetching');;
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
        const accessToken = await Spotify.getAccessToken();
                const response = await fetch(`https://api.spotify.com/v1/me`,{
                    method: 'GET',
                    headers: {Authorization: `Bearer ${accessToken}`}
                })
                if(!response.ok){
                    console.log(await response.json())
                }
                const data = await response.json();
                return data;
        },
        
    async createPlaylist(name) {
        const accessToken = await Spotify.getAccessToken();
        let user = await Spotify.getCurrentUser();
        const response = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`,{
            method: 'POST',
            headers: {Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'},
            body: JSON.stringify({name: name}),
        });
        if(!response.ok){
            console.log(await response.json())
        }
        const data = await response.json();
        return data;
    },
    async savePlaylist(name,trackUris) {
        if(!name || !trackUris) return;
        const accessToken = await Spotify.getAccessToken();
        const newPlaylist = await Spotify.createPlaylist(name);
        return await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({uris: trackUris}),
        })
    },
    async getUserPlaylist() {
        const accessToken = await Spotify.getAccessToken();
        let user = await Spotify.getCurrentUser();
        try{
            const response = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`,{
            method: 'GET',
            headers: {Authorization: `Bearer ${accessToken}`}}
        )
        if(!response.ok){
            console.log('Failed to get Playlists')
        }
        const data = await response.json()
        return data;
        }catch(error){
            console.log(error);
        }

    },
    async getUserPlaylistById(id) {
        try{
            const accessToken = await Spotify.getAccessToken();
            const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`,{
                method: 'GET',
                headers: {Authorization: `Bearer ${accessToken}`}
            })
            if(!response.ok)
                console.log('Failed to fetch playlistById');
            const data = response.json();
            return data;
        }catch(error){
            console.log(error);
        }
    },
    async updatePlaylist(id,trackUris) {
        const accessToken = await Spotify.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`,{
            method:'PUT',
            headers: {Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'},
            body: JSON.stringify({uris: trackUris})
        })
        if(!response.ok){
            const errorResponse = await response.json();
            console.log(errorResponse);
        }
        
    }
    }
export { Spotify }