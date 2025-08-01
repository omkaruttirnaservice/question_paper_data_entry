import db from '../config/db.connect.js';

const authModel = {
    checkUserCredentials: async (username, password) => {
        const sql = `SELECT * FROM aouth WHERE a_master_name = ? AND a_master_password = ?`;
        return db.query(sql, [username, password]);
    },
};

export default authModel;
