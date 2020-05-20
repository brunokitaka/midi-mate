/*===============================IMPORT MODULES===============================*/
const { check, validationResult } = require('express-validator'); /*Modulo responsável por fazer a validação dos dados que chegam nas requisições.*/
/*============================================================================*/

/*===============================COMMON ROUTES================================*/
module.exports = function (app) {

/*=================================INDEX PAGE=================================*/
    /** 
     * =======================================================================
     * |Route / responsável por retornar a pagina de index do usuário.       |
     * =======================================================================
    */
    app.get('/', function (req, res) {
        /*Redirecionamento para página de index.*/
        res.render("./main/index");
        return;
    });
/*============================================================================*/

/*=================================HOME PAGE==================================*/
    /** 
     * =======================================================================
     * |Route login responsável por verificar se o usuário possuí sessão     |
     * |aberta.                                                              |
     * |Caso as condições sejam verdadeiras, retorna a pagina de home do     |
     * |usuários, caso contrário, retorna a pagina de login.                 |
     * =======================================================================
    */
    app.get('/home', function (req, res) {
        /*Atribuição da função isValid para validação do token.*/
        const isValid = app.app.controllers.common.login.isValid;
        /*Verificação se o usuário possui permissão para acessar essa rota.*/
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
            /*Renderiza tela de home do usúario.*/
            res.render("./common/home");
            return;
        }
        else{
            /*Redirecionamento para página de login pois não possui sessão aberta.*/
            res.redirect("/login");
            return;
        }
    });
/*============================================================================*/

/*==============================EDIT PASSWORD PAGE============================*/
    /** 
     * =======================================================================
     * |Route editPassword responsável por verificar se o usuário possuí     |
     * |sessão aberta.                                                       |
     * |Caso as condições sejam verdadeiras, retorna a página de alteração   |
     * |de senha do usuário.                                                 |
     * =======================================================================
    */
    app.get('/editPassword', function (req, res) {
        /*Atribuição da função isValid para validação do token.*/
        const isValid = app.app.controllers.common.login.isValid;
        /*Verificação se o usuário possui sessão aberta para acessar essa rota.*/
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
            /*Renderiza tela de home do usúario.*/
            res.render("./common/editPassword");
            return;
        }
        else{
            /*Redirecionamento para página de login pois não possui sessão aberta.*/
            res.redirect("/login");
            return;
        }
    });
/*============================================================================*/

/*===============================UPDATE PASSWORD==============================*/
    /** 
     * ========================================================================
     * |Route updatePassword responsável por verificar se o usuário possuí    |
     * |sessão aberta. Caso as condição sejam verdadeira, é verificado se os  |
     * |dados enviados na requisição estão no formato correto, e realizado    |
     * |a alteração da senha do usuário, caso contrário é retornado um erro.  |
     * ========================================================================
    */
    app.post('/updatePassword', [check('oldPassword', 'Senha atual inválida!').not().isEmpty().escape().isString().isLength({ min: 8 }),
                                check('newPassword', 'Senha nova inválida!')  .not().isEmpty().escape().isString().isLength({ min: 8 })], 
    function (req, res) {
        /*Chamada da função que valida os dados da requisição.*/
        const errors = validationResult(req)
        /*Verificação se os parâmetros não apresentam inconsistências.*/            
        if (!errors.isEmpty()) {
            /*Envio da respostas.*/
            res.send({status: "error", msg: errors.array()});
            return;
        }
        else {
            /*Chamada do controller parar realizar a autenticação de login e criação de sessão.*/
            app.app.controllers.common.password.updatePassword(app, req, res);
        }
    });
/*============================================================================*/

/*===============================GET PERMISSION===============================*/
    /** 
     * =======================================================================
     * |Route getPermissions responsável por verificar se o usuário possuí   |
     * |sessão aberta.                                                       |
     * |Caso as condições sejam verdadeiras, retorna a as permissões de      |
     * |acesso do usuário, e seu perfil.                                     |
     * =======================================================================
    */
    app.get('/getPermissions', function (req, res) {
        /*Atribuição da função isValid para validação do token.*/
        const isValid = app.app.controllers.common.login.isValid;
        /*Verificação se o usuário possui sessão aberta para acessar essa rota.*/
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
            /*Variável que conterá as permissões a serem enviadas para o usuário.*/
            let permissions = [];
            /*Loop responsável por recuperar apenas as permissões de acesso a páginas.*/
            req.session.permissions.forEach(element => {
                /*Verifição se o campo icon foi preenchido.*/
                if(element.icon != null && element.icon != ""){
                    permissions.push(element);
                }
            });

            /*Chamada da função que torna o objeto user imutável.*/
	        Object.freeze(permissions);

            /*Envio da respostas.*/
            res.send({
                status: "success",
                msg: "Permissões recuperadas com sucesso!",
                data: {permissions: permissions, profile: req.session.profile}
            });
            return;
        }
        else{
            /*Envio da resposta.*/
            res.send({status: "error", msg: "Acesso Negado!"});
            return;
        }
    });
/*============================================================================*/

}
/*============================================================================*/