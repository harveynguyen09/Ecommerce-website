var express = require('express');
var shortId = require('shortid');
var bcrypt = require('bcrypt');
// databasse Postgres
const { sql, createPool } = require('slonik');
const { connection } = require('pg');
const pool = createPool('postgres://postgres:12394nph@localhost:5432/project_ecommerce');



module.exports.view = (req, res) => {
    res.render('account',{
        errors:'',
    });

}
module.exports.login = (req, res) => {
    pool.connect(async (connection) => {
        const result = await connection.query(sql`select * from public.user where user_name = ${req.body.login_username} and user_password = ${req.body.login_password}`);
        if (result.rowCount==0) {
            res.render('account',{
                errors: [
                    'wrong account'
                ]
            })
            return;          
        }
        res.cookie('user_id',result.rows[0].user_id, { maxAge: 2592000000 })
        res.redirect('/home')
    })
    
}
module.exports.postRegister = (req, res, next) => {
    // bcrypt
    if (req.body.email) {
        var request = req.body;
        var saltRounds = 10;

        var myPlaintextPassword = req.body.password;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                request.password = hash
                console.log(hash);
            });
        });
        pool.connect(async (connection) => {
            const res2 = await connection.query(sql`insert into "user"(user_name,user_email,user_password) values (${request.username},${request.email},${request.password}) `);
        });
        res.redirect('/account');
    }
    next()
}