module.exports = function(app, swig, gestorBD) {
    app.get("/registrarse", function(req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var usuario = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.insertarUsuario(usuario, function(id) {
            if (id == null){
                res.send("Error al insertar ");
            } else {
                res.send('Usuario Insertado ' + id);
            }
        });
    });
    app.get("/identificarse", function(req, res) {
        console.log("entro en el get")
        var respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });
    app.post("/identificarse", function(req, res) {
        console.log("entro en el post")
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        console.log("encripto la contraseña");
        var criterio = {
            email : req.body.email,
            password : seguro
        }
        console.log("creo el JSON del usuario");
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            console.log("llamo a la BBDD");
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.send("No identificado: ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.send("identificado");
            }
        });
    });
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    });
};