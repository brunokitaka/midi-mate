/*===============================IMPORT MODULES===============================*/
const bcrypt = require('bcryptjs'); /*Modulo responsável por gerar o hash da senha do usuário.*/
const empty = require('is-empty');  /*Modulo responsável por fazer a verificação dos dados retornados pelo banco.*/
/*============================================================================*/

/*==============================USER CONTROLLERS==============================*/

/*================================INSERT USER=================================*/
/**
 * ================================================================
 * |Controller responsável por verificar se existe sessão aberta e|
 * |se contém permissão para acessar esse controller.             |
 * |Caso as condições sejam verdadeiras, é calculado o Hash da    |
 * |senha enviada, e realizado a inserção na base de dados.       |
 * ================================================================
 */
module.exports.insertUser = function (user, app, req, res) {

	/*Atribuição da função isValid para validação do token.*/
	const isValid = app.app.controllers.common.login.isValid;

    /*Verificação se o usuário possui permissão para acessar esse controller.*/
    if (req.session.token != undefined   && 
        (req.session.profile == "Admin" || req.session.profile == "Manufacturer") &&
        isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
        
        /*Chamada da função que realiza o calculo do Hash.*/
		user.password = bcrypt.hashSync(user.password, 11);
		
		/*Chamada da função que torna o objeto user imutável.*/
		Object.freeze(user);

        /*Abertura de conexão com o banco de dados.*/
        const connection = app.config.dbConnection();
        const model = new app.app.models.common.user(connection);

        /*Variavel de retorno.*/
        let returnPacket = {
            status: "",
            msg: "",
            data: {}
        };

        return new Promise((resolve,reject) => {

			/*Chamada do model que executa a query de inserção de novo usuario na base de dados.*/
			model.insertUser(user, app, req, res, function (error, result) {

				/*Verificação de erro no retorno do banco de dados.*/
				if (error) {
					console.log("==================================================");
					console.log("DateTime: " + Date(Date.now()).toString());
					console.log("Email: " + req.session.email);
					console.log("Controller: insertUser");
					console.log("Msg: Erro ao acessar o banco de dados para inserir novo usuário");
					console.log("Error(insertUser): " + error);
					console.log("==================================================\n");
					// returnPacket.status = "error";
					// returnPacket.msg = "Erro ao acessar o banco de dados para inserir novo usuario!";
					// returnPacket.data = error;
					// res.send(returnPacket);
					resolve(0);
				}
				/*Verificação se o retorno do banco de dados está vazio.*/
				else if (empty(result.rows)) {
					console.log("==================================================");
					console.log("DateTime: " + Date(Date.now()).toString());
					console.log("Email: " + req.session.email);
					console.log("Controller: insertUser");
					console.log("Msg: Nenhum usuário inserido");
					console.log("Error(insertUser): Result is empty" + result);
					console.log("==================================================\n");
					// returnPacket.status = "none";
					// returnPacket.msg = "Usuário não foi inserido!";
					// res.send(returnPacket);
					resolve(0);
				} else {
					
					resolve(result.rows[0].idaccount);
				}
			});
		});
	} else {
        /*Envio da respostas.*/
        return 0;
    } 
}
/*============================================================================*/

/*================================SELECT USER=================================*/
/**
 * ================================================================
 * |Controller responsável por verificar se existe sessão aberta e|
 * |se contém permissão para acessar esse controller.             |
 * |Caso as condições sejam verdadeiras, é verificado os dados    |
 * |enviados e realizado a busca pelos usuários requisitados.     |
 * ================================================================
 */
module.exports.selectUsers = function (app, req, res) {

	/*Atribuição da função isValid para validação do token.*/
	const isValid = app.app.controllers.common.login.isValid;

    /*Verificação se o usuário possui permissão para acessar esse controller.*/
    if (req.session.token != undefined       && 
        req.session.profile == "Diretoria" &&
        isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
        
        /*Atribuição dos dados enviados no corpo da requisição.*/
		const idUsers = req.body.idUsers;
		
		/*Chamada da função que torna o objeto user imutável.*/
		Object.freeze(idUsers);

        /*Variavel de retorno.*/
        let returnPacket = {
            status: "",
            msg: "",
            data: {}
        };
        
        /*Verificação se os dados da requisição estão no formato correto.*/
        if(!Array.isArray(idUsers)) {
            /*Envio da respostas*/
            returnPacket.status = "error";
            returnPacket.msg = "idUsers inválido!";
            res.send(returnPacket);
            return;
		}

		/*Abertura de conexão com o banco de dados*/
		const connection = app.config.dbConnection();
		const model = new app.app.models.diretoria.user(connection);

		/*Chamada da função que executa a query de busca de usuarios na base de dados*/
		model.selectUsers(idUsers, app, req, function (error, result) {

			/*Verificação de erro no retorno do banco de dados*/
			if (error) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: selectUser");
				console.log("Msg: Erro ao acessar o banco para buscar usuários");
				console.log("Error(selectUser): " + error);
				console.log("==================================================\n");
				returnPacket.status = "error";
				returnPacket.msg = "Erro ao acessar o banco para buscar usuários!";
				returnPacket.data = error;
				res.send(returnPacket);
				return;
			}
			/*Verificação se o retorno do banco de dados está vazio*/
			else if (empty(result)) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: selectUser");
				console.log("Msg: Nenhum usuário foi encontrado");
				console.log("Error(selectUser): Result is empty" + result);
				console.log("==================================================\n");
				returnPacket.status = "none";
				returnPacket.msg = "Usuários não foram encontrados!";
				res.send(returnPacket);
				return;
			} else {

				/*Chamada da função que torna o objeto user imutável.*/
				Object.freeze(result);

				/*Envio da respostas*/
				returnPacket.status = "success";
                returnPacket.msg = "Usuários encontrados com sucesso!";
                returnPacket.data = result;
				res.send(returnPacket);
				return;
			}
		});
	} else {
		/*Envio da respostas*/
		returnPacket.status = "error";
		returnPacket.msg = "Acesso negado!";
		res.send(returnPacket);
		return;
	}
}
/*============================================================================*/

/*================================UPDATE USER=================================*/
/**
 * ================================================================
 * |Controller responsável por verificar se existe sessão aberta e|
 * |se contém permissão para acessar esse controller.             |
 * |Caso as condições sejam verdadeiras, é verificado os dados    |
 * |enviados e realizado a atualização do usuário.                |
 * ================================================================
 */
module.exports.updateUser = function (app, req, res) {

	/*Atribuição da função isValid para validação do token.*/
	const isValid = app.app.controllers.common.login.isValid;

    /*Verificação se o usuário possui permissão para acessar esse controller.*/
    if (req.session.token != undefined       && 
        req.session.profile == "Diretoria" &&
        isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
        
        /*Atribuição dos dados enviados no corpo da requisição.*/
        let user = req.body;

        /*Variavel de retorno.*/
        let returnPacket = {
            status: "",
            msg: "",
            data: {}
        };
        
        /*Verificação se vai ser feito troca de senha.*/
        if(user.userPassword != ""){
            /*Verificação se a senha possui o tamanho mínimo.*/
            if(user.userPassword.toString().length >= 8) {
                /*Chamada da função que realiza o calculo do Hash.*/
		        user.userPassword = bcrypt.hashSync(user.userPassword, 11);
            } else {
                /*Envio da respostas*/
				returnPacket.status = "error";
				returnPacket.msg = "A senha deve conter no mínimo 8 caracteres!";
				res.send(returnPacket);
				return;
            }
		}
		
		/*Chamada da função que torna o objeto user imutável.*/
		Object.freeze(user);

		/*Abertura de conexão com o banco de dados*/
		const connection = app.config.dbConnection();
		const model = new app.app.models.diretoria.user(connection);

		/*Chamada da função que executa a query de update de usuario na base de dados*/
		model.updateUser(user, app, req, function (error, result) {

			/*Verificação de erro no retorno do banco de dados*/
			if (error) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUser");
				console.log("Msg: Erro ao acessar o banco para atualizar usuário");
				console.log("Error(updateUser): " + error);
				console.log("==================================================\n");
				returnPacket.status = "error";
				returnPacket.msg = "Erro ao acessar o banco para atualizar usuário!";
				returnPacket.data = error;
				res.send(returnPacket);
				return;
			}
			/*Verificação se o retorno do banco de dados está vazio*/
			else if (empty(result)) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUser");
				console.log("Msg: Nenhum usuário foi atualizado");
				console.log("Error(updateUser): Result is empty" + result);
				console.log("==================================================\n");
				returnPacket.status = "none";
				returnPacket.msg = "Usuário não foi atualizado!";
				res.send(returnPacket);
				return;
			} else {

				/*Chamada do controller responsável por fazer a inserção da ação do usuário na base de dados.*/
				app.app.controllers.common.history.insertUserHistory("Atualização do usuário " + user.userName + " - " + user.cpf + " com Sucesso!", app, req);

				/*Envio da respostas*/
				returnPacket.status = "success";
				returnPacket.msg = "Usuário atualizado com sucesso!";
				res.send(returnPacket);
				return;
			}
		});
	} else {
		/*Envio da respostas*/
		returnPacket.status = "error";
		returnPacket.msg = "Acesso negado!";
		res.send(returnPacket);
		return;
	}
}
/*============================================================================*/

/*================================DISABLE USER================================*/
/**
 * ================================================================
 * |Controller responsável por verificar se existe sessão aberta e|
 * |se contém permissão para acessar esse controller.             |
 * |Caso as condições sejam verdadeiras, é verificado os dados    |
 * |enviados e realizado a desativação do usuário.                |
 * ================================================================
 */
module.exports.disableUser = function (app, req, res) {

	/*Atribuição da função isValid para validação do token.*/
	const isValid = app.app.controllers.common.login.isValid;

    /*Verificação se o usuário possui permissão para acessar esse controller.*/
    if (req.session.token != undefined       && 
        req.session.profile == "Diretoria" &&
        isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
        
        /*Atribuição dos dados enviados no corpo da requisição.*/
		const idUser = req.body.idUser;
		
		/*Chamada da função que torna o objeto user imutável.*/
		Object.freeze(idUser);

        /*Variavel de retorno.*/
        let returnPacket = {
            status: "",
            msg: "",
            data: {}
        };
        
        /*Verificação se o idUser é válido.*/
        if(isNaN(idUser)) {
            /*Envio da respostas*/
            returnPacket.status = "error";
            returnPacket.msg = "idUser inválido!";
            res.send(returnPacket);
            return;
        }

		/*Abertura de conexão com o banco de dados*/
		const connection = app.config.dbConnection();
		const model = new app.app.models.diretoria.user(connection);

		/*Chamada da função que executa a query de atualização do status do usuario na base de dados*/
		model.disableUser(idUser, app, req, function (error, result) {

			/*Verificação de erro no retorno do banco de dados*/
			if (error) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUserStatus");
				console.log("Msg: Erro ao acessar o banco para desativar o usuário");
				console.log("Error(updateUserStatus): " + error);
				console.log("==================================================\n");
				returnPacket.status = "error";
				returnPacket.msg = "Erro ao acessar o banco para desativar o usuário!";
				returnPacket.data = error;
				res.send(returnPacket);
				return;
			}
			/*Verificação se o retorno do banco de dados está vazio*/
			else if (empty(result) || result.affectedRows == 0) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUserStatus");
				console.log("Msg: NENHUM usuário foi Desativado");
				console.log("Error(updateUserStatus): Result is empty" + result);
				console.log("==================================================\n");
				returnPacket.status = "none";
				returnPacket.msg = "Usuário NÃO foi Desativado!";
				res.send(returnPacket);
				return;
			} else {

				/*Chamada do controller responsável por fazer a inserção da ação do usuário na base de dados.*/
				app.app.controllers.common.history.insertUserHistory("Desativação do usuário " + idUser + " com Sucesso!", app, req);


				/*Envio da respostas*/
				returnPacket.status = "success";
				returnPacket.msg = "Usuário desativado com SUCESSO!";
				res.send(returnPacket);
				return;
			}
		});
	} else {
		/*Envio da respostas*/
		returnPacket.status = "error";
		returnPacket.msg = "Acesso negado!";
		res.send(returnPacket);
		return;
	}
}
/*============================================================================*/

/*============================================================================*/

