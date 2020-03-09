const fetchPosts = () => {
    toggleLoader('homeloader')
    fetch('http://localhost:8080/api/posts')
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(posts => {
            const parent = document.querySelector('#home-page .posts-container')
            parent.innerHTML = ''
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
            toggleLoader('homeloader')
        })
        .catch(function(error) {
            console.log(error)
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
            toggleLoader('postloader')
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
        })
        .catch(error => {
            toggleLoader('postloader')

            console.log(error)
        })
}
const addPost = post => {
    document.getElementById('addPostButton').disabled = true
    toggleLoader('addloader')
    fetch('http://localhost:8080/api/post/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.accessToken
        },
        body: JSON.stringify(post)
    })
        .then(response => {
            document.getElementById('addPostButton').disabled = false
            toggleLoader('addloader')
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            if (response.status === 200) {
                goToPage('/')
            }
        })

        .catch(error => {
            toggleLoader('addloader')

            // TODO: Update the view and display error.
            console.log(error)
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

        const post = {
            title,
            content,
            platform
        }
        addPost(post)
    })
