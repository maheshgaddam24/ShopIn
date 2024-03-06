const Mysqli = require('mysqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let conn = new Mysqli({
    Host: 'localhost', 
    post: 3306, 
    user: 'admin', 
    passwd: '1234',
    db: 'demo'
});

let db = conn.emit(false, '');

const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

module.exports = {
    database: db,
    isPasswordAndUserMatch: async (req, res, next) => {
        const myPlaintextPassword = req.body.password;
        const myEmail = req.body.email;  
        
        const user = await db.table('users').filter({$or:[{ email : myEmail },{ username : myEmail }]}).get();
        if (user) {
            const match = await bcrypt.compare(myPlaintextPassword, user.password);
            
            if (match) {
                req.username = user.username;
                req.email = user.email;
                next();
            } else {
                res.status(401).send("Username or password incorrect");
            }
            
        } else {
            res.status(401).send("Username or password incorrect");
        }
    }
};
