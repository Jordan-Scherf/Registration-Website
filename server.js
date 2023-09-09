const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const formidable = require('formidable');

const server = http.createServer((req, res) => {
  let filePath;

  if (req.method === 'POST' && req.url === '/register') {
    // Handle registration data here
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error parsing form data');
        return;
      }

      const username = fields.Username;
      const email = fields.email;
      const password = fields.Password;


      createUserAccount(username, email, password, (err, userId) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error creating user account');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`User account created successfully! ID: ${userId}`);
        }
      });
    });
  } else if(req.method === 'POST' && req.url === '/login'){
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error parsing form data');
        return;
      }

      const username = fields.Username;
      const password = fields.Password;


      checkUsernameExists(username, (err, usernameExists) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error checking username');
          return;
        }
  
        if (!usernameExists) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Username Does Not Exist' }));
          return;
        }
  
  // Check if username exists
  const checkUsernameQuery = `SELECT * FROM users WHERE username = ?`;
  connection.query(checkUsernameQuery, [username], (error, results) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Database error' }));
    } else {
      if (results.length === 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Username not found' }));
      } else {
        const storedPassword = results[0].Password;
        console.log('Password:', storedPassword);
        console.log('wwPassword:', password[0]);
        // Compare the submitted password with the stored password
        if (password[0] === storedPassword) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Login successful' }));
        } else {
          console.log('stored Password:', storedPassword);
          res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Incorrect password' }));
        }
      }
    }
  });
    });
      
    });
  }
  else{
    // Serve files based on URL paths
    if (req.url === '/') {
      filePath = path.join(__dirname, 'Login Page HTML, CSS, JS', 'login.html');
    } else if (req.url === '/createAccount') {
      filePath = path.join(__dirname, 'Login Page HTML, CSS, JS', 'createAccount.html');
    } else if (req.url === '/confirmation') {
      filePath = path.join(__dirname, 'Login Page HTML, CSS, JS', 'confirmation.html');
    } else {
      filePath = path.join(__dirname, 'Login Page HTML, CSS, JS', req.url);
    }

    // Check if the file exists
    fs.exists(filePath, (exists) => {
      if (!exists) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File not found');
        return;
      }

      // Read and serve the file
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Internal Server Error');
        } else {
          // Determine the appropriate Content-Type based on the file extension
          let contentType = 'text/html';
          if (filePath.endsWith('.css')) {
            contentType = 'text/css';
          } else if (filePath.endsWith('.js')) {
            contentType = 'application/javascript';
          }

          res.writeHead(200, {'Content-Type': contentType});
          res.end(content);
        }
      });
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
// MySQL connection: Must provide Information below to work
const connection = mysql.createConnection({
    host: 'YOUR HOST IP',
    port:YOURPORTNUMBER,
    user: 'YOUR USERNAME',
    password: 'YOUR PASSWORD!',
    database: 'YOUR DATABASE'
});

//Mysql Connection and Table Creator if it doesnt exist yet
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL server and database!');

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255)
        )
    `;

    connection.query(createTableSQL, (err, result) => {
        if (err) {
            console.error('Error creating table: ', err);
            return;
        }
        console.log('Table created successfully!');
        
    });
});

function checkUsernameExists(username, callback) {
  const checkUsernameSQL = 'SELECT COUNT(*) AS count FROM users WHERE Username = ?'; // Using 'name' instead of 'Username'
  connection.query(checkUsernameSQL, [username], (err, results) => {
      if (err) {
          console.error('Error checking username: ', err);
          callback(err, null);
          return;
      }
      const usernameCount = results[0].count;
      callback(null, usernameCount > 0);
  });
}

function createUserAccount(username, email, password, callback) {
  checkUsernameExists(username, (err, usernameExists) => {
      if (err) {
          callback(err, null);
          return;
      }

      if (usernameExists) {
          const error = new Error('Username already exists');
          callback(error, null);
          return;
      }
      const insertUserSQL = 'INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)'; 
      connection.query(insertUserSQL, [username, email, password], (err, result) => {
          if (err) {
              console.error('Error inserting user data: ', err);
              callback(err, null);
              return;
          }
          console.log('User account created successfully!');
          connection.end();
          callback(null, result.insertId); // Pass the newly inserted user's ID to the callback
      });
  });
}

/* Example usage
createUserAccount('exampleUser', 'user@example.com', 'password123', (err, userId) => {
  if (err) {
      console.error('Error creating user account: ', err.message);
      return;
  }
  console.log('User ID:', userId); // This is the ID of the newly inserted user
  connection.end();
});
*/

