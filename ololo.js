var obj = {
	clear: function(){
		for (var user in localStorage){
		var test = (JSON.parse(localStorage.getItem(user)));
		if (test.expiration < +new Date()) {
				localStorage.removeItem(user);
			};
		}
		this.check();
	},
	check: function(){
		var user = document.getElementById('user').value.toLowerCase();
		if (localStorage.getItem(user)!= undefined) {
		var test = JSON.parse(localStorage.getItem(user));
			this.parse_info(test);
		}
		else{
			this.find_user(user);
		}
	},
	find_user: function(user){
		var xhttp = new XMLHttpRequest(),
		self = this;
		xhttp.open('GET', 'https://api.github.com/users/'+ user);
		xhttp.onreadystatechange = function(){
			if (xhttp.readyState !=4) return;

			if  (xhttp.status == 404) {
				document.getElementsByClassName('content')[0].style.display = "none";
				document.getElementsByClassName('repos')[0].style.display = "none";
				alert('Пользователь не найден');
				return;
			}

			if (xhttp.status == 200) {
				var data = JSON.parse(this.response);
				data.expiration = +new Date() + 86400000;
				self.find_userRepositories(user,data);
			}
		}
		xhttp.send();
	},
	find_userRepositories: function(user,data){
		var xhttp = new XMLHttpRequest(),
		self = this;
		xhttp.open('GET', 'https://api.github.com/users/' + user + "/repos");
	
		xhttp.onreadystatechange = function(){
			if (xhttp.readyState !=4){
				return;
			}
		data.repos = JSON.parse(this.response);
		localStorage.setItem(user,JSON.stringify(data));
		self.parse_info(data);
		}	
		xhttp.send();	

	},
	parse_info: function(userData){
		getElem('content').style.display = "block";
		if (userData.name) {
            updateText('name', "Name: " + userData.name);
		}
		else {
			updateText('name', '');
		}
        
		if (userData.email) {
			updateText('email', "Email: " + userData.email);
		}
		else{
			updateText('email', "");
		}
        
		updateText('foll', "Followers: " + userData.followers);
        
        function getElem(clsName) {
            return document.getElementsByClassName(clsName)[0]
        }
        
        function updateText(clsName, text) {
            getElem(clsName).innerHTML = text;
        }
        
		this.parse_repo(userData);
	},	
	parse_repo: function(userData){
		if (userData.repos) {
    	    var repos = document.getElementsByClassName('repos')[0];
    	
            repos.style.display = "block";
    	    repos.innerHTML = "";
            userData.repos.forEach(createLinks);

   		}
        
        function createLinks(element) {
            var newLink = document.createElement('a');
            
            newLink.href = element['html_url'];
            newLink.textContent = element['name'];
            repos.appendChild(newLink);
            newLink.appendChild(document.createElement("br"))
        }
	}
}
document.getElementById('button').addEventListener('click', obj.clear.bind(obj));