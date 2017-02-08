let
    debug = require('debug')('app:utils:' + process.pid),
    path = require('path'),
    util = require('util'),
    redis = require("redis"),
    client = redis.createClient(),
    _ = require("lodash"),
    config = require("./config.js"),
    jsonwebtoken = require("jsonwebtoken"),
    TOKEN_EXPIRATION = 60,
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60*24*5;
// UnauthorizedAccessError = require(path.join(__dirname, 'errors', 'UnauthorizedAccessError.js'));


client.on('error', function (err) {
    debug(err);
});

client.on('connect', function () {
    debug("Redis successfully connected");
});

module.exports.fetch = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports.create = function (user, req, res, next) {

    debug("Create token");

    if (_.isEmpty(user)) {
        return next(new Error('User data cannot be empty.'));
    }

    var data = {
        id: user.id,
        user_login: user.user_login,
        user_nickname: user.user_nickname,
        user_email: user.user_email,
        user_url: user.user_url,
        user_registered: user.user_registered,
        user_status: user.user_status,
        display_name: user.display_name,
        token: jsonwebtoken.sign({
            _id: user._id,
            user_login: user.user_login,
            user_email: user.user_email,
            user_status: user.user_status,
            display_name: user.display_name,
        }, C.secret, {
            expiresIn: "5d"
        })
    };

    var decoded = jsonwebtoken.decode(data.token);

    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    debug("Token generated for user: %s, token: %s", data.user_login, data.token);

    client.set(data.token, JSON.stringify(data), function (err, reply) {
        if (err) {
            return next(new Error(err));
        }
        if (reply) {
            client.expire(data.token, TOKEN_EXPIRATION_SEC, function (err, reply) {
                if (err) {
                    return next(new Error("Can not set the expire value for the token key"));
                }
                if (reply) {
                    res.map = {
                        code: 0,
                        msg: "Token generated",
                        data: data
                    }
                    res.cookie("u", data.token, {maxAge: 60000*60*24*5,httpOnly:true});
                    next(); // we have succeeded
                } else {
                    return next(new Error('Expiration not set on redis'));
                }
            });
        } else {
            return next(new Error('Token not set in redis'));
        }
    });

    return data;

};
module.exports.retrieve = function (id, done) {

    debug("Calling retrieve for token: %s", id);

    if (_.isNull(id)) {
        return done(new Error("token_invalid"), {
            "message": "Invalid token"
        });
    }

    client.get(id, function (err, reply) {
        if (err) {
            return done(err, {
                code:200,
                "message": err
            });
        }

        if (_.isNull(reply)) {
            return done(new Error("token_invalid"), {
                code:200,
                "msg": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
            });
        } else {
            var data = JSON.parse(reply);
            debug("User data fetched from redis store for user: %s", data.user_login);

            if (_.isEqual(data.token, id)) {
                return done(null, data);
            } else {
                return done(new Error("token_doesnt_exist"), {
                    code:200,
                    "msg": "Token doesn't exists, login into the system so it can generate new token."
                });
            }

        }

    });

};

module.exports.expire = function (req) {

    var token = req.cookies.u;

    debug("Expiring token: %s", token);

    if (token !== null) {
        client.expire(token, 0);
    }

    return token !== null;

};

module.exports.middleware = function () {

    var func = function (req, res, next) {
        var token = req.cookies.u;
        // console.log("u",token);
        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                // next(new UnauthorizedAccessError("invalid_token", data))
                return res.status(200).json(data);
            } else {
                req.user = _.merge(req.user, data);
                next();
            }

        });
    };

    func.unless = require("express-unless");

    return func;

};