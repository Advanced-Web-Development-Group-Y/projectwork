const login = accessToken => {
    localStorage.setItem('accessToken', accessToken)
    document.body.classList.remove('isLoggedOut')
    document.body.classList.add('isLoggedIn')
}
const logout = () => {
    localStorage.removeItem('accessToken')
    document.body.classList.remove('isLoggedIn')
    document.body.classList.add('isLoggedOut')
}

document.querySelector('#login-page form').addEventListener('submit', event => {
    event.preventDefault()
    const username = document.querySelector('#login-page .username').value
    const password = document.querySelector('#login-page .password').value

    fetch('http://localhost:8080/api/tokens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
        body:
            'grant_type=password&username=' + username + '&password=' + password
    })
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(body => {
            // TODO: Read out information about the user account from the id_token.
            login(body.access_token)
        })
        .catch(error => {
            console.log(error)
        })
})
if (localStorage.getItem('accessToken')) {
    login(localStorage.getItem('accessToken'))
} else {
    logout()
}
