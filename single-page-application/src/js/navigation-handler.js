const goToPage = url => {
    changeToPage(url)
    history.pushState({}, '', url)
}

const changeToPage = url => {
    const currentPageDiv = document.getElementsByClassName('current-page')[0]
    if (currentPageDiv) {
        currentPageDiv.classList.remove('current-page')
    }

    // TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
    // TODO: Factor out common code in all branches.
    if (url == '/') {
        document.getElementById('home-page').classList.add('current-page')
        fetchPosts()
    } else if (url == '/about') {
        document.getElementById('about-page').classList.add('current-page')
    } else if (url == '/login') {
        document.getElementById('login-page').classList.add('current-page')
    } else if (url == '/register') {
        document.getElementById('register-page').classList.add('current-page')
    } else if (url == '/logout') {
        document.getElementById('home-page').classList.add('current-page')
        logout()
    } else if (new RegExp('^/post/[0-9]+$').test(url)) {
        document.getElementById('post-page').classList.add('current-page')
        const id = url.split('/')[2]
        fetchPost(id).then(post => {
            setPostPage(post)
        })
    } else if (new RegExp('^/post/update/[0-9]+$').test(url)) {
        document
            .getElementById('update-post-page')
            .classList.add('current-page')
        const id = url.split('/')[3]
        fetchPost(id).then(post => {
            setUpdatePostPage(post)
        })
    } else if (new RegExp('^/post/delete/[0-9]+$').test(url)) {
        document
            .getElementById('delete-post-page')
            .classList.add('current-page')
        const id = url.split('/')[3]
        setDeletePostPage(id)
    } else if (url == '/add-post') {
        document.getElementById('add-post-page').classList.add('current-page')
    } else {
        document.getElementById('error-page').classList.add('current-page')
    }
}

document.body.addEventListener('click', event => {
    if (event.target.tagName == 'A') {
        event.preventDefault()
        const url = event.target.getAttribute('href')
        goToPage(url)
    }
})
window.addEventListener('popstate', function(event) {
    const url = location.pathname
    changeToPage(url)
})
const setError = (id, error) => {
    document.getElementById(id).innerText = error
}
changeToPage(location.pathname)
