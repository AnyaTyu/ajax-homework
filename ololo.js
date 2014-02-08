var data = {};
document.getElementById('button').addEventListener('click', findUser);


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

function parseInfo(){
	if (data.name) {
		document.getElementsByClassName('name')[0].innerHTML = "Name: " + data.name;
	}
	else{
		document.getElementsByClassName('name')[0].innerHTML = "";
	}
	if (data.email) {
		document.getElementsByClassName('email')[0].innerHTML = "Email: " + data.email;
	}
	else{
		document.getElementsByClassName('email')[0].innerHTML = "";
	}
	document.getElementsByClassName('foll')[0].innerHTML = "Followers: " + data.followers;
	parseRepository();
}
function parseRepository(){
	    if (data.repos) {
    var repos = document.getElementsByClassName('repos')[0];
    			repos.style.display = "block";
    			repos.innerHTML = "";
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