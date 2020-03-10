const toggleLoader = loaderid => {
    const loader = document.getElementById(loaderid)
    if (loader.classList.contains('visible')) loader.classList.remove('visible')
    else loader.classList.add('visible')
}
