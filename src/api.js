// const baseURL = 'http://127.0.0.1:8000/';
const baseURL = 'https://otlibraryback.herokuapp.com/';

const api = {        
    books: baseURL + 'api/items/books',
    categories: baseURL + 'api/items/categories',
    authors: baseURL + 'api/items/authors',
    publishers: baseURL + 'api/items/publishers',    
    orders: baseURL + 'api/items/orders',
    vote_options: baseURL + 'api/items/vote_options',
    votes: baseURL + 'api/items/votes',
    vote_selects: baseURL + 'api/items/vote_selects',
    customers: baseURL + 'api/users/customers',
    users: baseURL + 'api/users/users',        
    signin: baseURL + 'rest-auth/login/',
    signup: baseURL + 'rest-auth/registration/',
    profile: baseURL + 'rest-auth/user/',
    mediaItems: baseURL + 'media/items',
    mediaUsers: baseURL + 'media/users',    
}

export default api;