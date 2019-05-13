const
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    conn = mysql.createConnection({
        host: 'localhost',
        port: '3309',
        user: 'cs_aurora_user',
        password: 'csaurorapassword'
    });

const app = express();
app.use(cors());
app.use(bodyParser.json());

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