var express = require('express');
var shortId = require('shortid');
var bcrypt = require('bcrypt');
// databasse Postgres
const { sql, createPool } = require('slonik');
const { connection } = require('pg');
const pool = createPool('postgres://postgres:12394nph@localhost:5432/project_ecommerce');

module.exports.view = (req, res) => {
    res.render('account', {
        errors: '',
        result_register: '',
        errors_register: '',
    });

}
module.exports.login = (req, res) => {
    pool.connect(async (connection) => {
        const user_name = await connection.query(sql`select * from public.user where user_name = ${req.body.login_username}`);
        if (user_name.rowCount > 0) {
            var x;
            bcrypt.compare(req.body.login_password, user_name.rows[0].user_password, function (err, result) {
                if (!result) {
                    res.render('account', {
                        errors: ['wrong password'],
                        result_register: '',
                        errors_register: '',
                    });
                } else {
                    res.cookie('user_id', user_name.rows[0].user_id, { maxAge: 2592000000 });
                    res.redirect('home');
                }
            })
        } else {
            res.render('account', {
                errors: ['wrong account'],
                result_register: '',
                errors_register: '',
            })
        }
    })
}

module.exports.postRegister = (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    if (username == '' || email === '' || password == '') {
        res.render('account', {
            errors: '',
            result_register: '',
            errors_register: ['please fill all the information'],
        })
        return;
    }
    pool.connect(async (connection) => {
        const result = await connection.query(sql`select * from public.user where user_name = ${username} `);
        if (result.rowCount > 0) {
            res.render('account', {
                errors: '',
                result_register: 'username`s already existed',
                errors_register: '',
            })
        } else {
            var request = req.body;
            var saltRounds = 10;

            var myPlaintextPassword = req.body.password;
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                    request.password = hash;
                });
            });
            pool.connect(async (connection) => {
                const res2 = await connection.query(sql`insert into "user"(user_name,user_email,user_password) values (${request.username},${request.email},${request.password}) `);
            });
            res.redirect('/account');
        }
    })
    next();
}