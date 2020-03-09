const fetchPosts = () => {
    fetch('http://localhost:8080/api/posts')
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(posts => {
            const parent = document.querySelector('#home-page')
            parent.innerHTML = ''
            for (const post of posts.posts) {
                const container = document.createElement('div')
                container.className += 'postContainer'
                const title = document.createElement('h1')
                const content = document.createElement('p')
                const date = document.createElement('p')
                const platform = document.createElement('p')
                const visit = document.createElement('a')
                title.innerText = post.title
                content.innerText = post.content
                date.innerText = post.createdAt
                platform.innerText = post.platform
                visit.href = '/post/' + post.id
                visit.innerText = 'More info'
                container.appendChild(title)
                container.appendChild(content)
                container.appendChild(date)
                container.appendChild(platform)
                container.appendChild(visit)
                parent.append(container)
            }
        })
        .catch(function(error) {
            console.log(error)
        })
}
function fetchPost(id) {
    fetch('http://localhost:8080/api/post/' + id)
        .then(response => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        })
        .then(post => {
            const parent = document.querySelector('#post-page')
            parent.innerHTML = ''
            const title = document.createElement('h1')
            const content = document.createElement('p')
            const date = document.createElement('p')
            const platform = document.createElement('p')
            title.innerText = post.post[0].title
            content.innerText = post.post[0].content
            date.innerText = post.post[0].createdAt
            platform.innerText = post.post[0].platform
            parent.appendChild(title)
            parent.appendChild(content)
            parent.appendChild(date)
            parent.appendChild(platform)
        })
        .catch(error => {
            console.log(error)
        })
}
