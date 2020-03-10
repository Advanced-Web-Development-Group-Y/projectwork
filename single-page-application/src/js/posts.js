const fetchPosts = () => {
    toggleLoader('homeloader')
    const parent = document.querySelector('#home-page .posts-container')
    parent.innerHTML = ''

    fetch('http://localhost:8080/api/posts')
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(posts => {
            for (const post of posts.posts) {
                const personalcontainer = document.createElement('div')
                personalcontainer.className += 'post'
                const title = document.createElement('h1')
                const price = document.createElement('p')
                const platform = document.createElement('p')
                const visit = document.createElement('a')
                title.innerText = post.title
                price.innerText = post.price + ' ' + post.currency
                platform.innerText = post.platform
                visit.href = '/post/' + post.id
                visit.innerText = 'More info'
                personalcontainer.appendChild(title)
                personalcontainer.appendChild(price)
                personalcontainer.appendChild(platform)
                personalcontainer.appendChild(visit)
                parent.appendChild(personalcontainer)
            }
        })
        .catch(function(error) {
            console.log(error)
        })
        .then(() => {
            toggleLoader('homeloader')
        })
}
function fetchPost(id) {
    toggleLoader('postloader')
    const parent = document.querySelector('#post-page #post-container')
    parent.innerHTML = ''
    fetch('http://localhost:8080/api/post/' + id)
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(post => {
            const title = document.createElement('h1')
            const content = document.createElement('p')
            const date = document.createElement('p')
            const platform = document.createElement('p')
            const price = document.createElement('p')
            title.innerText = post.post[0].title
            price.innerText = post.post[0].price + ' ' + post.post[0].currency
            content.innerText = post.post[0].content
            date.innerText = post.post[0].createdAt
            platform.innerText = post.post[0].platform
            parent.appendChild(title)
            parent.appendChild(content)
            parent.appendChild(price)
            parent.appendChild(date)
            parent.appendChild(platform)
            if (!localStorage.getItem('id_token')) return
            const currentUser = parseJwt(localStorage.getItem('id_token'))
            if (
                post.post[0].posterid === currentUser.userid ||
                currentUser.permission === 1
            ) {
                const updatetext = document.createElement('p')
                const updateanchor = document.createElement('a')
                updateanchor.href = '/post/update/' + post.post[0].id
                updatetext.innerText = 'UPDATE'
                updateanchor.appendChild(updatetext)
                const deletetext = document.createElement('p')
                const deleteanchor = document.createElement('a')
                deleteanchor.href = '/post/delete/' + post.post[0].id
                deletetext.innerText = 'DELETE'
                deleteanchor.appendChild(deletetext)
                parent.appendChild(deleteanchor)
                parent.appendChild(updateanchor)
            }
        })
        .catch(error => {
            console.log(error)
        })
        .then(() => {
            toggleLoader('postloader')
        })
}
const addPost = post => {
    document.getElementById('addPostButton').disabled = true
    toggleLoader('addloader')
    fetch('http://localhost:8080/api/post/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(post)
    })
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            if (response.status === 200) {
                goToPage('/')
            }
        })

        .catch(error => {
            // TODO: Update the view and display error.
            console.log(error)
        })
        .then(() => {
            document.getElementById('addPostButton').disabled = false
            toggleLoader('addloader')
        })
}
document
    .querySelector('#add-post-page form')
    .addEventListener('submit', event => {
        event.preventDefault()

        const title = document.querySelector('#add-post-page .title').value
        const content = document.querySelector('#add-post-page .content').value
        const platform = document.querySelector('#add-post-page .platform')
            .value
        const currency = document.querySelector('#add-post-page .currency')
            .value
        const price = document.querySelector('#add-post-page .price').value
        const post = {
            title,
            content,
            platform,
            currency,
            price
        }
        addPost(post)
    })
