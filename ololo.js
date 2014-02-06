var data = {};
document.getElementById('button').addEventListener('click', findUser);

//Bщем юзера
function findUser(){
	var user = document.getElementById('user').value;
	var xhttp = new XMLHttpRequest();
	xhttp.open('GET', 'https://api.github.com/users/'+ user, true);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState !=4){
			return;
		}

		if  (xhttp.status == 404) {
			document.getElementsByClassName('content')[0].style.display = "none";
			document.getElementsByClassName('repos')[0].style.display = "none";
			alert('Пользователь не найден');
			return;
		}

		if (xhttp.status == 200) {
			document.getElementsByClassName('content')[0].style.display = "block";
			data = JSON.parse(this.response);
			findUserRepositories(user);
		}
	}
	xhttp.send(null);
}
//Ищем его репозитории
function findUserRepositories(user){
	var xhttp = new XMLHttpRequest();
	xhttp.open('GET', 'https://api.github.com/users/' + user + "/repos", true);
	
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState !=4){
			return;
		}

		data.repos = JSON.parse(this.response);
		parseInfo(data);
	}
	xhttp.send(null);	
}
//Парсим данные
function parseInfo(){
	 if (data.name) document.getElementsByClassName('name')[0].innerHTML = "Name: " + data.name;
	 if (data.email) document.getElementsByClassName('email')[0].innerHTML = "Email: " + data.email;
	 document.getElementsByClassName('foll')[0].innerHTML = "Followers: " + data.followers;
    if (data.repos) {
    var repos = document.getElementsByClassName('repos')[0];
    			repos.style.display = "block"
                data.repos.forEach(createLinks);
 
     function createLinks(element) {
         var newLink = document.createElement('a');
         newLink.href = element['html_url'];
         newLink.textContent = element['name'];
         repos.appendChild(newLink);
         newLink.appendChild(document.createElement("br"))
     }
   }
}