"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _routes = require("./routes/routes.js");

var _routes2 = _interopRequireDefault(_routes);

var _routerInfo = require("./routes/routerInfo.js");

var _routerInfo2 = _interopRequireDefault(_routerInfo);

var _dbConfig = require("./config/dbConfig.js");

var _config = require("./config/config.js");

var _expressHandlebars = require("express-handlebars");

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _socket = require("socket.io");

var _normalizr = require("normalizr");

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _connectMongo = require("connect-mongo");

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _users = require("./model/users.js");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _url = require("url");

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _cluster = require("cluster");

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _ContenedorChat = require("./managers/ContenedorChat.js");

var _ContainerSql = require("./managers/ContainerSql.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import faker from '@faker-js/faker'
// import {commerce, datatype} from  "@faker-js/faker"
// * - Session -

// * - Authentication -


// const __filename = fileURLToPath(import.meta.url)
var __dirname = _path2.default.dirname(__filename);

// ? ---------------------------------

var container = new _ContainerSql.Containersql(_dbConfig.options.mariaDB, "products");
// const chatApi = new Containersql(options.sqliteDB,"chat")
var chatApi = new _ContenedorChat.ContenedorChat("chat.txt");

var app = (0, _express2.default)();

// ? ---------------------------------

// * Arguments
var argOptions = { alias: { m: "mode" }, default: { mode: "FORK" } };
var objArguments = (0, _minimist2.default)(process.argv.slice(2), argOptions);

// console.log("objArguments", objArguments)

var mode = objArguments.mode;

// ? --------------------------------------------------------

if (mode === "CLUSTER" && _cluster2.default.isPrimary) {
    console.log("CLUSTER mode");
    var numCPUS = _os2.default.cpus().length; // * number of processors
    console.log("Numero de procesadores: " + numCPUS);

    for (var i = 0; i < numCPUS; i++) {
        _cluster2.default.fork(); // * subprocess
        console.log("cluster created");
    }

    _cluster2.default.on("exit", function (worker) {
        console.log("El subproceso " + worker.process.pid + " fall\xF3");
        _cluster2.default.fork();
    });
} else {
    console.log("FORK mode");
    // * We use the port that the enviroment provide or the 8080
    var PORT = process.env.PORT || 8080;
    var server = app.listen(PORT, function () {
        console.log("Server listening in " + PORT + " on process " + process.pid);
    });

    // * Connecting Web Socket with server
    var _io = new _socket.Server(server);

    // * Connections Client-Server

    _io.on("connection", function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(socket) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            // * Connected
                            console.log("El usuario con el id " + socket.id + " se ha conectado");

                            // * Sending the info to the new user
                            _context3.t0 = _io.sockets;
                            _context3.next = 4;
                            return container.getAll();

                        case 4:
                            _context3.t1 = _context3.sent;

                            _context3.t0.emit.call(_context3.t0, 'products', _context3.t1);

                            _context3.t2 = _io.sockets;
                            _context3.next = 9;
                            return _normalizarMensajes();

                        case 9:
                            _context3.t3 = _context3.sent;

                            _context3.t2.emit.call(_context3.t2, 'chat', _context3.t3);

                            // * Message to the users
                            socket.broadcast.emit("Ha ingresado un nuevo usuario");

                            //* Receiving the new product and saving it in the file, then updating the list
                            socket.on('newProduct', function () {
                                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newProduct) {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return container.save(newProduct);

                                                case 2:
                                                    _context.t0 = _io.sockets;
                                                    _context.next = 5;
                                                    return container.getAll();

                                                case 5:
                                                    _context.t1 = _context.sent;

                                                    _context.t0.emit.call(_context.t0, "products", _context.t1);

                                                case 7:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, undefined);
                                }));

                                return function (_x2) {
                                    return _ref2.apply(this, arguments);
                                };
                            }());

                            // * Receiving the message and saving it in the file, then update the chats
                            socket.on('newMessage', function () {
                                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newMessage) {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    _context2.next = 2;
                                                    return chatApi.save(newMessage);

                                                case 2:
                                                    _context2.t0 = _io.sockets;
                                                    _context2.next = 5;
                                                    return _normalizarMensajes();

                                                case 5:
                                                    _context2.t1 = _context2.sent;

                                                    _context2.t0.emit.call(_context2.t0, "chat", _context2.t1);

                                                case 7:
                                                case "end":
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, undefined);
                                }));

                                return function (_x3) {
                                    return _ref3.apply(this, arguments);
                                };
                            }());

                        case 14:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());

    var _authorSchema = new _normalizr.schema.Entity("authors", {}, { idAttribute: "email" });

    // * message schema
    var _messageSchema = new _normalizr.schema.Entity("messages", { author: _authorSchema });

    // * chat schema, global schema

    var _chatSchema = new _normalizr.schema.Entity("chat", {
        messages: [_messageSchema]
    }, { idAttribute: "id" });

    // * Normalize data
    var _normalizarData = function _normalizarData(data) {
        var normalizeData = (0, _normalizr.normalize)({ id: "chatHistory", messages: data }, _chatSchema);
        return normalizeData;
    };

    var _normalizarMensajes = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var results, sinNormalizarTamaño, messagesNormalized, normalizadoTamaño, porcentajeCompresion;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return chatApi.getAll();

                        case 2:
                            results = _context4.sent;
                            sinNormalizarTamaño = JSON.stringify(results).length;
                            messagesNormalized = _normalizarData(results);
                            normalizadoTamaño = JSON.stringify(messagesNormalized).length;
                            porcentajeCompresion = (1 - normalizadoTamaño / sinNormalizarTamaño) * 100;
                            // porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100

                            console.log(porcentajeCompresion);
                            _io.sockets.emit("compressPercent", porcentajeCompresion);
                            return _context4.abrupt("return", messagesNormalized);

                        case 10:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        return function _normalizarMensajes() {
            return _ref4.apply(this, arguments);
        };
    }();
}

// * Read in JSON
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

// * HandleBars & views
app.engine("handlebars", _expressHandlebars2.default.engine());
app.set("views", "./src/public/views");
app.set("view engine", "handlebars");

// ? ---------------------------------------------------------

// * Cookies, session

app.use((0, _cookieParser2.default)());

app.use((0, _expressSession2.default)({
    store: _connectMongo2.default.create({
        mongoUrl: _config.config.MONGO_SESSION
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}));

// ? --------------------------------------------------------

// * Authentication DB
var mongoUrl = _config.config.MONGO_AUTENTICATION;

_mongoose2.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) return console.log("hubo un error: " + err);
    console.log('conexion a base de datos exitosa');
});

// * Passport

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

// * Serializing
_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
    _users.UserModel.findById(id, function (error, userFound) {
        if (error) return done(error);
        return done(null, userFound);
    });
});

// * Encrypt password
var createHash = function createHash(password) {
    var hash = _bcrypt2.default.hashSync(password, _bcrypt2.default.genSaltSync(10));
    return hash;
};
// * Validate the password
var isValidPassword = function isValidPassword(user, password) {
    return _bcrypt2.default.compareSync(password, user.password);
};

// * Passport Strategy create User
_passport2.default.use('signupStrategy', new _passportLocal.Strategy({
    passReqToCallback: true,
    usernameField: "email"
}, function (req, username, password, done) {
    console.log(username);
    _users.UserModel.findOne({ username: username }, function (error, userFound) {
        if (error) return done(error, null, { message: 'hubo un error' });
        if (userFound) return done(null, null, { message: 'el usuario existe' });
        var newUser = {
            name: req.body.name,
            username: username,
            password: createHash(password)
        };
        console.log(newUser);
        _users.UserModel.create(newUser, function (error, userCreated) {
            if (error) return done(error, null, { message: 'error al registrar' });
            return done(null, userCreated, { message: 'usuario creado' });
        });
    });
}));

// * Passport Strategy Login
_passport2.default.use('loginStrategy', new _passportLocal.Strategy(function (username, password, done) {
    console.log(username);
    _users.UserModel.findOne({ username: username }, function (err, user) {
        console.log(user);
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!user.password) return done(null, false);
        if (!isValidPassword(user, password)) {
            console.log('existen datos');
            return done(null, false, { message: 'Contraseña inválida' });
        }
        return done(null, user);
    });
}));

// ? ------------------------------------------------------


// * Main route
app.use("/api/products", _routes2.default);
app.use("/api/info", _routerInfo2.default);

app.get('/', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.t0 = res;
                        _context5.next = 3;
                        return container.getAll();

                    case 3:
                        _context5.t1 = _context5.sent;
                        _context5.t2 = {
                            products: _context5.t1
                        };

                        _context5.t0.render.call(_context5.t0, "home", _context5.t2);

                    case 6:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x4, _x5) {
        return _ref5.apply(this, arguments);
    };
}());

app.get("/chat", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.t0 = res;
                        _context6.next = 3;
                        return chatApi.getAll();

                    case 3:
                        _context6.t1 = _context6.sent;
                        _context6.t2 = {
                            messages: _context6.t1
                        };

                        _context6.t0.render.call(_context6.t0, "partials/chat", _context6.t2);

                    case 6:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x6, _x7) {
        return _ref6.apply(this, arguments);
    };
}());

app.get("/products", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.t0 = res;
                        _context7.next = 3;
                        return container.getAll();

                    case 3:
                        _context7.t1 = _context7.sent;
                        _context7.t2 = {
                            products: _context7.t1
                        };

                        _context7.t0.render.call(_context7.t0, "partials/products", _context7.t2);

                    case 6:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x8, _x9) {
        return _ref7.apply(this, arguments);
    };
}());

// app.get("/products-test", (req,res)=>{
//     let test = []
//     for(let i= 0; i<5; i++){
//         test.push(
//             {
//                 id : datatype.uuid(),
//                 name : commerce.product(),
//                 price : commerce.price(),
//                 url : `${datatype.uuid()}.jpg`           
//             }
//         )
//     }
//     res.render("products-test",{products: test})
// })

app.get('/registro', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
        var errorMessage;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        errorMessage = req.session.messages ? req.session.messages[0] : '';

                        console.log(req.session);
                        res.render('signup', { error: errorMessage });
                        req.session.messages = [];

                    case 4:
                    case "end":
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x10, _x11) {
        return _ref8.apply(this, arguments);
    };
}());

app.get('/inicio-sesion', function (req, res) {
    res.render('login');
});

app.post('/signup', _passport2.default.authenticate('signupStrategy', {
    failureRedirect: '/registro',
    failureMessage: true
}), function (req, res) {
    res.redirect('/perfil');
});

app.post('/login', _passport2.default.authenticate('loginStrategy', {
    failureRedirect: '/inicio-sesion',
    failureMessage: true
}), function (req, res) {
    res.redirect('/perfil');
});

app.get('/perfil', function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
        var name;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        if (req.isAuthenticated()) {
                            name = req.user.name;

                            res.render('home', { user: name });
                        } else {
                            res.send("<div>Debes <a href='/inicio-sesion'>iniciar sesion</a> o <a href='/registro'>registrarte</a></div>");
                        }

                    case 1:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x12, _x13) {
        return _ref9.apply(this, arguments);
    };
}());

app.get('/logout', function (req, res) {
    req.session.destroy();
    setTimeout(function () {
        res.redirect('./inicio-sesion');
    }, 3000);
});

// * Public route
app.use(_express2.default.static(__dirname + "/public"));

// * Schemas normalizr
// * author schema
var authorSchema = new _normalizr.schema.Entity("authors", {}, { idAttribute: "email" });

// * message schema
var messageSchema = new _normalizr.schema.Entity("messages", { author: authorSchema });

// * chat schema, global schema

var chatSchema = new _normalizr.schema.Entity("chat", {
    messages: [messageSchema]
}, { idAttribute: "id" });

// * Normalize data
var normalizarData = function normalizarData(data) {
    var normalizeData = (0, _normalizr.normalize)({ id: "chatHistory", messages: data }, chatSchema);
    return normalizeData;
};

var normalizarMensajes = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var results, sinNormalizarTamaño, messagesNormalized, normalizadoTamaño, porcentajeCompresion;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return chatApi.getAll();

                    case 2:
                        results = _context10.sent;
                        sinNormalizarTamaño = JSON.stringify(results).length;
                        messagesNormalized = normalizarData(results);
                        normalizadoTamaño = JSON.stringify(messagesNormalized).length;
                        porcentajeCompresion = (1 - normalizadoTamaño / sinNormalizarTamaño) * 100;
                        // porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100

                        console.log(porcentajeCompresion);
                        io.sockets.emit("compressPercent", porcentajeCompresion);
                        return _context10.abrupt("return", messagesNormalized);

                    case 10:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function normalizarMensajes() {
        return _ref10.apply(this, arguments);
    };
}();

// ? ---------------------------------------------------------------
// ? ---------------------------------------------------------------
