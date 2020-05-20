/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {
   
   /**
    * LOGIN:
    * Logs in users with valid sessions, if not, returns login page.
    */
    app.get('/login', function (req, res) {
        /*Atribuição da função isValid para validação do token.*/
        const isValid = app.app.controllers.web.main.login.isValid;
        /*Verificação se o usuário possui permissão para acessar essa rota.*/
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)) {
            /*Renderiza tela de home do usúario.*/
            res.render("./main/home");
            return;
        }
        else{
            /*Redirecionamento para página de login pois não possui sessão aberta.*/
            res.render("./main/login");
            return;
        }
    });


    /**
     * VALIDATE LOGIN:
     * Sends login page data for validation, if correct, user will be logged in.
     */
    app.post(
        '/loginValidation', 
        [
            check('email', 'Check email input!').not().isEmpty().escape().isEmail(),
            check('password', 'Invalid password!').not().isEmpty().isLength({ min: 8, max: 32 })
        ], 
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
            app.app.controllers.web.main.login.loginValidation(app, req, res);
        }
    });

    /**
     * LOGOUT:
     * Kills current session.
     */
    app.get('/logout', function (req, res) {
        /*Chamada do controller parar realizar a fechamento da sessão.*/
        app.app.controllers.common.login.logout(app, req, res);
    });

}
