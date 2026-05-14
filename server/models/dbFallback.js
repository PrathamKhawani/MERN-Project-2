import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local_db.json');

const initDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
    }
};

const getData = () => {
    initDb();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

const saveData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

export const MockUsers = {
    findOne: async (query) => {
        const data = getData();
        const user = data.users.find(u => {
            return Object.keys(query).every(key => u[key] === query[key]);
        });
        if (user) {
            return {
                ...user,
                select: function() { return this; },
                save: async function() { return this; }
            };
        }
        return null;
    },
    create: async (userData) => {
        const data = getData();
        const newUser = { ...userData, _id: Date.now().toString() };
        data.users.push(newUser);
        saveData(data);
        return newUser;
    },
    findById: async (id) => {
        const data = getData();
        return data.users.find(u => u._id === id);
    },
    findByIdAndUpdate: async (id, update, options) => {
        const data = getData();
        const index = data.users.findIndex(u => u._id === id);
        if (index !== -1) {
            data.users[index] = { ...data.users[index], ...update.$set };
            saveData(data);
            return data.users[index];
        }
        return null;
    }
};
