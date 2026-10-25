/*interface - checklist of tools you need to build whatever tf

export - makes it available in other classes that need your checklist
e.g. import {User} from './index';

if this was default (one super important checklist) it would be...
e.g. import User from './index';

*/

export interface User {
    id: number
    username: string
    email: string
}

export interface Review {
    id: number
    user_id: number 
    spotify_id: string
    title: string
    artist: string 
    album_genre: string
    release_date: string
    artwork_url: string
    ear_rating: number
    review_text: string
    created_at: string
}

export interface SearchResult {
    spotify_id: string
    title: string 
    artist: string
    album_type: string
    release_date: string 
    artwork_url: string
    followers: number
}

export interface TopRated {
    spotify_id: string
    title: string
    artist: string
    artwork_url: string
    release_date: string
    average_rating: string
    review_count: string 
}