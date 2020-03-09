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
                title.innerText = post.title
                content.innerText = post.content
                date.innerText = post.date
                platform.innerText = post.platform
                container.appendChild(title)
                container.appendChild(content)
                container.appendChild(date)
                container.appendChild(platform)
                parent.append(container)
            }
        })
        .catch(function(error) {
            console.log(error)
        })
}
