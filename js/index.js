document.addEventListener("DOMContentLoaded", () => {
    const userList = document.querySelector("#user-list");
    const repoList = document.querySelector("#repos-list");
    const byUser = document.querySelector("#search-by-user");
    const byRepo = document.querySelector("#search-by-repo");
    let searchByUser = true;

    //search user
    document.querySelector("#github-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (searchByUser) {
            fetch(`https://api.github.com/search/users?q=${e.target.search.value}`)
            .then(res => res.json())
            // .then(data => console.log(data))
            .then(data => {
                data.items.forEach(user => {
                    // console.log(user);
                    showUsers(user);
                });
            })
        } else {
            fetch(`https://api.github.com/search/repositories?q=${e.target.search.value}`)
            .then(res => res.json())
            // .then(data => console.log(data))
            .then(data => showRepos(data.items))
        }
    })

    //function to show user to DOM
    function showUsers(user) {
        const li = document.createElement("li");
        const account = document.createElement("p");
        const avatar = document.createElement("img");
        const link = document.createElement("a");

        account.textContent = `User: ${user.login}`;
        avatar.src = user.avatar_url;
        avatar.alt = `User: ${user.login}`;
        link.href = user.html_url;
        link.textContent = "Profile link"

        li.append(account, link, avatar)
        userList.append(li);

        account.style.cursor = "pointer";
        account.addEventListener("click", e => {
            const user = e.target.textContent.slice(6);
            fetch(`https://api.github.com/users/${user}/repos`)
            .then(res => res.json())
            .then(data => showRepos(data));
            // .then(data => console.log(data))
        })
    }

    //function to shows repo on selected user
    function showRepos(data){
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.textContent = `${data[0].owner.login}'s repos:`
            li.append(p);

            data.forEach(repo => {
                const p = document.createElement("p");
                const link = document.createElement("a");

                link.href = repo.html_url;
                link.textContent = repo.name;
                
                p.append(link);
                li.append(p);
            })

            repoList.append(li);
        }

    //add switch button behavior
    byUser.addEventListener("click", (e) => {
        byRepo.hidden = false;
        e.target.hidden = true;
        searchByUser = !searchByUser;
    })

    byRepo.addEventListener("click", (e) => {
        byUser.hidden = false;
        e.target.hidden = true;
        searchByUser = !searchByUser;
    })
})

