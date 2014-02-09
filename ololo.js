var data = {};
document.getElementById('button').addEventListener('click', checkLocalStorage);
function checkLocalStorage(){
	var user = document.getElementById('user').value;
	user = user.toLowerCase();
	console.log(user);
	if (localStorage.getItem(user)!= undefined) {
		var test = JSON.parse(localStorage.getItem(user));
		if (test.expiration < +new Date()) {
			localStorage.removeItem(user);
			findUser(user);
		}
		else{
			parseInfo(test);
		}
	}
	else{
		findUser(user);
	}
}

function findUser(user){
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
			data.expiration = +new Date() + 86400000;
			console.log(data);
			findUserRepositories(user);
		}
	}
	xhttp.send(null);
}

function findUserRepositories(user){
	var xhttp = new XMLHttpRequest();
	xhttp.open('GET', 'https://api.github.com/users/' + user + "/repos", true);
	
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState !=4){
			return;
		}
		data.repos = JSON.parse(this.response);
		console.log(data);
		localStorage.setItem(user,JSON.stringify(data));
		parseInfo(data);
	}
	xhttp.send(null);	
}

function parseInfo(userData){
	if (userData.name) {
		document.getElementsByClassName('name')[0].innerHTML = "Name: " + userData.name;
	}
	else{
		document.getElementsByClassName('name')[0].innerHTML = "";
	}
	if (userData.email) {
		document.getElementsByClassName('email')[0].innerHTML = "Email: " + userData.email;
	}
	else{
		document.getElementsByClassName('email')[0].innerHTML = "";
	}
	document.getElementsByClassName('foll')[0].innerHTML = "Followers: " + userData.followers;
	parseRepository(userData);
}
function parseRepository(userData){
	    if (userData.repos) {
    var repos = document.getElementsByClassName('repos')[0];
    			repos.style.display = "block";
    			repos.innerHTML = "";
                userData.repos.forEach(createLinks);
 
     function createLinks(element) {
         var newLink = document.createElement('a');
         newLink.href = element['html_url'];
         newLink.textContent = element['name'];
         repos.appendChild(newLink);
         newLink.appendChild(document.createElement("br"))
     }
   }
}