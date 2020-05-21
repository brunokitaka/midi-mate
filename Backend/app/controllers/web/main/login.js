/**
 * MODULES
 */
const bcrypt = require('bcryptjs'); /* Hash generator.        */
const empty = require('is-empty');  /* Check if data's empty. */
const token = require('token');     /* Session token.         */

/**
 * TOKEN CONFIG
 */
const tokenSecret = process.env.TOKEN_SECRET
token.defaults.secret = tokenSecret;
token.defaults.timeStep = 60 * 60;


/**
 * IS VALID:
 * Checks if session's token is valid.
 */
module.exports.isValid = function (a, b) {
	return token.verify(a, b);
}


/**
 * HAS PERMISSION:
 * Checks if user can access the route.
 */
module.exports.hasPermission = function (route, permissions) {
	/* Permission flag. */
	let permission = false;

	/* Checks if permissions list contains the desired route. */
	permissions.forEach(element => {
		if(element.route === route) {
			permission = true;
		}
	});

	return permission;	
}


/**
 * LOGIN VALIDATION:
 * Compares login data with database.
 * If all matches, a new session is created. 
 */
module.exports.loginValidation = function (app, req, res) {
    /* Data from request. */
	const login = req.body;
	
	/* Freezes object, making it unalterable. */
	Object.freeze(login);

    /* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* If email data is incorrect, sends error message. */
	if(login.email == undefined || login.email == null || login.email == "") {
        returnPacket.status = "error";
        returnPacket.msg = "Check email input!";
        res.send(returnPacket);
        return;
	}
	
	/* If password data is incorrect, sends error message. */
    if(login.password == undefined || login.password == "" || login.password.length < 8){
        returnPacket.status = "error";
        returnPacket.msg = "Invalid passoword!";
        res.send(returnPacket);
        return;
    }

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.common.login(connection);

	/* Search for email in database. */
	model.loginValidation(login, function (error, result) {		

		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + login.email);
			console.log("Controller: loginValidation");
			console.log("Msg: Erro ao acessar o banco de dados para consultar login do usuário");
			console.log("Error(loginValidation): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Erro ao acessar o banco de dados para consultar login!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		} 
		else if (empty(result.rows)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + login.email);
			console.log("Controller: loginValidation");
			console.log("Msg: Nenhum usuário encontrado");
			console.log("Error(loginValidation): Result is empty" + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Usuário não encontrado!";
            res.send(returnPacket);
            return;
		} else {
			/* If user found, stored password hash is compared with login's. */
			if (bcrypt.compareSync(login.password, result.rows[0].password)) {
				
				const account = result.rows;
				let permissions = [];

				/*Loop responsável por recuperar a penas as rotas e permissões do usuário.*/
				account.forEach(element => {
					/*Verificação se o objeto contém a chave (route) e (permission).*/
					if (element.hasOwnProperty("route") && element.hasOwnProperty("namepermission")) {
						permissions.push({route: element.route, permission: element.namepermission, icon: element.icon});
					}
				});

				/*Verificação se o usuário contém perfil com informações extras.*/
				if (account[0].nameprofile == "Manufacturer" || account[0].nameprofile == "Company" || account[0].nameprofile == "Unity") {

					const userInfo = {
						idAccount: account[0].idaccount,
						nameProfile: account[0].nameprofile
					};

					/*Chamada da função que executa a query de busca de informações do usuario no banco de dados*/
					model.selectUserInfo(userInfo, function (error, result) {		
						/*Verificação de erro no retorno do banco de dados*/
						if (error) {
							console.log("==================================================");
							console.log("DateTime: " + Date(Date.now()).toString());
							console.log("Email: " + login.email);
							console.log("Controller: loginValidation");
							console.log("Msg: Erro ao acessar o banco de dados para consultar mais informações do usuário");
							console.log("Error(selectUserInfo): " + error);
							console.log("==================================================\n");
							returnPacket.status = "error";
							returnPacket.msg = "Erro ao acessar o banco de dados para consultar login!";
							returnPacket.data = error;
							res.send(returnPacket);
							return;
						} 
						/*Verificação se o retorno do banco de dados está vazio*/
						else if (empty(result.rows)) {
							console.log("==================================================");
							console.log("DateTime: " + Date(Date.now()).toString());
							console.log("Email: " + login.email);
							console.log("Controller: loginValidation");
							console.log("Msg: Nenhuma informação extra do usuário encontrada");
							console.log("Error(selectUserInfo): Result is empty" + result.rows);
							console.log("==================================================\n");
							returnPacket.status = "none";
							returnPacket.msg = "Nenhuma informação extra do usuário encontrada!";
							res.send(returnPacket);
							return;
						} else {

							/*Cria a session do usuario*/
							req.session.idAccount   = account[0].idaccount;
							req.session.email    	= account[0].email;
							req.session.profile     = account[0].nameprofile;
							req.session.permissions = permissions;
							req.session.token = token.generate(req.session.email + req.session.profile + req.session.idAccount);
							
							/*Envio da respostas*/
							returnPacket.status = "success";
							returnPacket.msg = "Welcome!";
							res.send(returnPacket);
							return;
						}
					});
				} 
				else if (account[0].nameprofile == "Admin"){
					/*Cria a session do usuario Admin*/
					req.session.idAccount   = account[0].idaccount;
					req.session.email    	= account[0].email;
					req.session.profile     = account[0].nameprofile;
					req.session.permissions = permissions;
					req.session.token = token.generate(req.session.email + req.session.profile + req.session.idAccount);

					returnPacket.status = "success";
					returnPacket.msg = "Welcome!";
					res.send(returnPacket);
					return;
				} 
				else {
					returnPacket.status = "error";
					returnPacket.msg = "Check login data!";
					res.send(returnPacket);
					return;
				}
			} 
			/* Wrong password. */
			else {
				/*Envio da respostas*/
				returnPacket.status = "error";
				returnPacket.msg = "Check login data!";
				res.send(returnPacket);
				return;
			}
		}
	});
}

/*==================================LOGOUT====================================*/
/**
 * ================================================================
 * |Controller responsável por verificar se existe sessão aberta. |
 * |Caso a condição seja verdadeira, é encerrada a sessão do      |
 * |usuário, caso contrário, é redirecinado diretamento para      |
 * |tela de login.                                                |
 * ================================================================
 */
module.exports.logout = function (app, req, res) {
    
    /*Atribuição da função isValid para validação do token.*/
    const isValid = app.app.controllers.common.login.isValid;

    /*Verifica se o usuário possui uma sessão aberta.*/
	if (req.session.token != undefined && isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {

		/*Remoção da sessão.*/
		req.session.destroy(res.render('common/login'));
		return;
	}
	else {
		res.render('common/login');
		return;
	}
}
/*============================================================================*/


