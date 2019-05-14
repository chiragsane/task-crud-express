const
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? process.env.DB_PORT : '3306',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

conn.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
});

app.get('/', (_req, res) => res.send('You are on Home route'));

app.get('/tasks', async (_req, res) => {
    const sql = 'SELECT * FROM demo_rest_db.new_table';
    try {
        await conn.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
});

app.post('/tasks', async (req, res) => {
    const sql = `INSERT INTO demo_rest_db.new_table (task) VALUES ("${req.body.task}")`;
    try {
        await conn.query(sql, (err, _result) => {
            if (err) throw err;
            conn.query('SELECT * FROM demo_rest_db.new_table', (err, result) => {
                if (err) throw err;
                res.json(result);
            });
        });
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const sql = `DELETE FROM demo_rest_db.new_table WHERE id = "${req.params.id}"`;
    try {
        await conn.query(sql, (err, _result) => {
            if (err) throw err;
            conn.query('SELECT * FROM demo_rest_db.new_table', (err, result) => {
                if (err) throw err;
                res.json(result);
            });
        });
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
});

app.listen(3000, () => console.log('API hosted successfully'));