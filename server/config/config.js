// ============================
// ======== PUERTO ============
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
// ======== ENTORNO ===========
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// ===== PUEBASE DE DATOS =====
// ============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://lobo:TW6yDYtwmBXKnwdw@cluster0-qgjvj.mongodb.net/cafe';
};

process.env.URLDB = urlDB;