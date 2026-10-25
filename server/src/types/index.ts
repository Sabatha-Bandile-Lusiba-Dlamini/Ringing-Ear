export interface User{
    id: number
    username: string
    email: string
    password: string
    created_at: Date
}

export interface Review{
    id: number
    user_id: number
    spotify_id: string
    title: string
    artist: string
    album_genre: string
    artwork_url: string
    ear_rating: number
    review_text: string
    created_at: Date
}


//These accomodate Spotify API's JSON response, nothing to do with postgres
export interface SpotifyArtist{
    id: string
    name: string
    followers:{
        total: number
    }
}

//These accomodate Spotify API's JSON response, nothing to do with postgres
export interface SpotifyAlbum {
    id: string
    name: string
    artists: SpotifyArtist[]
    album_genre: string
    release_date: string
    images: {url: string}[]
}