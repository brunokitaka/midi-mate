/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {

    /**
     * CREATE USER:
     * Returns user creation page.
     */
    app.get('/createUser', function (req, res) {
        res.render('user/createUser');
        return;
    });


    /**
     * EDIT USER:
     * Returns user edit page.
     */
    app.get('/editUser', function (req, res) {
        const isValid = app.app.controllers.web.main.login.isValid;
        /*Verifica se o usuário possui permissão para acessar essa página.*/
        if (req.session.token != undefined && isValid(req.session.email + req.session.cpf.toString() + req.session.idUser.toString(), req.session.token)) {
            /*Renderiza tela de edição dos dados do usúario.*/
            res.render("./user/editUser");
            return;
        }
        else{
            /*Redirecionamento para página de login pois não possui permissão de acesso.*/
            res.render("./main/login");
            return;
        }
    });


    app.post('/insertUser', [check('userName', 'Nome inválido!').not().isEmpty().escape(),
                             check('userEmail', 'Email inválido!').not().isEmpty().isEmail(), 
                             check('cpf', 'CPF inválido').not().isEmpty().escape().isLength({ max: 15 }),
                             check('userPassword', 'Senha inválida!').not().isEmpty().isLength({ min: 8 }),
                             check('userPhone', 'Telefone inválido!').not().isEmpty().escape().isLength({ max: 20 }),
                             check('userAddress', 'Endereço inválido!').not().isEmpty().escape().isLength({ max: 250})], 
    function (req, res) {
        const errors = validationResult(req)
        /*Verificação se os parâmetros não apresentam inconsistências.*/            
        if (!errors.isEmpty()) {
            /*Envio da respostas.*/
            res.send({status: "error", msg: errors.array()});
            return;
        }
        else {
            res.send({status: "error", msg: "Rota Fechada Temporariamente!"});
            //app.app.controllers.web.user.insertUser(app, req, res);
        }
    });
}