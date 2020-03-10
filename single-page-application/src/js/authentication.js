const login = (accessToken, idToken) => {
    if (accessToken === undefined) return
    if (idToken === undefined) return
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('id_token', idToken)

    document.body.classList.remove('isLoggedOut')
    document.body.classList.add('isLoggedIn')
    goToPage('/')
}
const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    document.body.classList.remove('isLoggedIn')
    document.body.classList.add('isLoggedOut')
}
const fetchToken = (username, password) => {
    document.getElementById('loginButton').disabled = true
    toggleLoader('loginloader')
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
            const accessToken = body.access_token
            const id_token = body.id_token
            login(accessToken, id_token)
        })
        .catch(error => {
            setError('loginErrorText', error)
            console.log(error)
        })
        .then(() => {
            document.getElementById('loginButton').disabled = false
            toggleLoader('loginloader')
        })
}
const register = data => {
    toggleLoader('registerloader')
    document.getElementById('registerButton').disabled = true

    fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(body => {
            login(body.access_token, body.id_token)
            goToPage('/')
        })
        .catch(error => {
            setError('registerErrorText', error)
        })
        .then(() => {
            toggleLoader('registerloader')
            document.getElementById('registerButton').disabled = false
        })
}
const setError = (id, error) => {
    document.getElementById(id).innerText = error
}

document.querySelector('#login-page form').addEventListener('submit', event => {
    event.preventDefault()
    document.getElementById('loginErrorText').innerText = ''
    const username = document.querySelector('#login-page .username').value
    const password = document.querySelector('#login-page .password').value
    fetchToken(username, password)
})
document
    .querySelector('#register-page form')
    .addEventListener('submit', event => {
        event.preventDefault()
        document.getElementById('registerErrorText').innerText = ''
        const username = document.querySelector('#register-page .username')
            .value
        const password = document.querySelector('#register-page .password')
            .value
        const confirmpassword = document.querySelector(
            '#register-page .confirmpassword'
        ).value
        const firstname = document.querySelector('#register-page .firstname')
            .value
        const lastname = document.querySelector('#register-page .lastname')
            .value
        const email = document.querySelector('#register-page .email').value

        const formdata = {
            username: username,
            password: password,
            confirmpassword: confirmpassword,
            firstname: firstname,
            lastname: lastname,
            email: email
        }
        register(formdata)
    })
if (localStorage.getItem('access_token')) {
    login(
        localStorage.getItem('access_token'),
        localStorage.getItem('id_token')
    )
} else {
    logout()
}
