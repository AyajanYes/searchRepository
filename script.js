const searchWrapper = document.querySelector('.wrapper');
const searchInput = searchWrapper.querySelector('.search-input');
const autoCom = searchWrapper.querySelector('.autocomplit');
const listOfRepositories = searchWrapper.querySelector('.repository-list');
const allRepositories = listOfRepositories.querySelectorAll('li');
const deleteFromList = listOfRepositories.querySelectorAll('div');

const debounce = (fn, debounceTime) => {
    let timeout; 
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            fn.apply(context, args);
        }, debounceTime);
    }
};

function createAuto(repos) {
    const reposElement = document.createElement('li');
    reposElement.textContent = repos.name;
    reposElement.addEventListener('click', function () {
        searchInput.value = '';
        autoCom.innerHTML = '';
        const listElement = document.createElement('li');
        listElement.innerHTML = `Name: ${repos.name}` + '<br />' 
                                + `Owner: ${repos.owner.login}` + '<br />'
                                + `Stars: ${repos.stargazers_count}` +
                                '<div></div>';
        listElement.querySelector('div').addEventListener('click', function() {
            listElement.remove();
        });
        listOfRepositories.append(listElement);   
    });
    autoCom.appendChild(reposElement);
}

async function githubApi(e) {
    console.log(e.target.value);
    autoCom.innerHTML = '';
    return await fetch(`https://api.github.com/search/repositories?q=${e.target.value}&per_page=${5}`)
    .then(res => res.json())
    .then(res => {
        res.items.forEach(value => createAuto(value));
    })
    .catch(err => console.log(err));
};

githubApi = debounce(githubApi, 500);
searchInput.addEventListener('keyup', githubApi);

