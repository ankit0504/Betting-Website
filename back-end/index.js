const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const shpassword = require('password-hash-and-salt')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SELECT_ALL_BETS_QUERY = 'SELECT * FROM bets'
const SELECT_ALL_USERS_QUERY = 'SELECT * FROM users'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '19ankit99',
    database: 'betting'
})

connection.connect(err => {
    if(err) {
        return err;
    }
})

app.use(cors())

app.get('/', (req, res) =>{
    res.send('Go to /bets to view the bets. Go to /users to see users')
})

app.get('/bets', (req, res) => {
    connection.query(SELECT_ALL_BETS_QUERY, (err, results, fields) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.get('/users', (req, res) => {
    connection.query(SELECT_ALL_USERS_QUERY, (err, results, fields) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

app.post('/user/add', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    shpassword(password).hash(function(error, hash) {
        if (error) throw new Error('Something went wrong with password hash')
        let INSERT_USER_QUERY = "INSERT INTO users(username, password) VALUES(?, ?)"
        const inserts = [username, hash]
        INSERT_USER_QUERY = mysql.format(INSERT_USER_QUERY, inserts);
        connection.query(INSERT_USER_QUERY, (err, results) => {
            if(err) {
                return res.send(err)
            } else {
                return res.send('User added successfully')
            }
        })
    })
})

app.post('/bet/add', (req, res) => {
    const category = req.body.category;
    const open = (req.body.open) ? 1: 0
    const user1 = req.body.user1;
    const user2 = (req.body.open) ? null : req.body.user2;
    const completed = 0;
    const description = req.body.description;
    const public = (req.body.public) ? 1 : 0;
    const title = req.body.title;

    let INSERT_BET_QUERY = "INSERT into bets(user1, user2, title, description, open, completed, public, category) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
    const inserts = [user1, user2, title, description, open, completed, public, category];
    INSERT_BET_QUERY = mysql.format(INSERT_BET_QUERY, inserts);
    connection.query(INSERT_BET_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Bet added successfully')
        }
    })
})

app.post('/bet/delete', (req, res) => {
    const id = req.body.id;
    let DELETE_BET_QUERY = "DELETE from bets WHERE id=?"
    const inserts = [id]
    DELETE_BET_QUERY = mysql.format(DELETE_BET_QUERY, inserts);
    connection.query(DELETE_BET_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Bet deleted successfully')
        }
    })
})

app.post('/bet/complete', (req, res) => {
    const id = req.body.id;
    let COMPLETE_BET_QUERY = "UPDATE bets SET completed=1 WHERE id=?"
    const inserts = [id]
    COMPLETE_BET_QUERY = mysql.format(COMPLETE_BET_QUERY, inserts);
    connection.query(COMPLETE_BET_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Bet completed successfully')
        }
    })
})

app.post('/bet/challenge', (req, res) => {
    const id = req.body.id;
    const user = req.body.user;
    let CHALLENGE_BET_QUERY = "UPDATE bets SET open=0, user2=? WHERE id=?"
    const inserts = [user, id]
    CHALLENGE_BET_QUERY = mysql.format(CHALLENGE_BET_QUERY, inserts);
    connection.query(CHALLENGE_BET_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.send('Bet challenged successfully!')
        }
    })

})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let SELECT_USER_QUERY = "SELECT PASSWORD from users WHERE username = ?"
    const inserts = [username]
    SELECT_USER_QUERY = mysql.format(SELECT_USER_QUERY, inserts)
    connection.query(SELECT_USER_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            const hashed_pass = results[0]["PASSWORD"]
            shpassword(password).verifyAgainst(hashed_pass, function(error, verified) {
                if(error)
                    throw new Error('Something went wrong!');
                if(!verified) {
                    return res.send(false);
                } else {
                    return res.send(true);
                }
            })
        }
    })
})


app.listen(4000, () => {
    console.log('The server is running on port 4000')
})
