const login = accessToken => {
    if (accessToken === undefined) return
    localStorage.setItem('accessToken', accessToken)
    document.body.classList.remove('isLoggedOut')
    document.body.classList.add('isLoggedIn')
    goToPage('/')
}
const logout = () => {
    localStorage.removeItem('accessToken')
    document.body.classList.remove('isLoggedIn')
    document.body.classList.add('isLoggedOut')
}
const setError = error => {
    document.getElementById('errorText').innerText = error
}
document.querySelector('#login-page form').addEventListener('submit', event => {
    event.preventDefault()
    document.getElementById('errorText').innerText = ''
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
            if (response.status === 400) throw 'Invalid username or password'
            return response.json()
        })
        .then(body => {
            // TODO: Read out information about the user account from the id_token.
            login(body.access_token)
        })
        .catch(error => {
            setError(error)
        })
})
if (localStorage.getItem('accessToken')) {
    login(localStorage.getItem('accessToken'))
} else {
    logout()
}
