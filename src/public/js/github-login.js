const $btnGithub = document.getElementById('btn-github')

$btnGithub.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = '/auth/github'
})