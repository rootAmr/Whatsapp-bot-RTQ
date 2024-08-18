const fs = require('fs');
const csv = require('csv-parser');

const RESIDENTS_FILE_PATH = './data_warga.csv';

let residents = {};

function loadResidents() {
    try {
        if (fs.existsSync(RESIDENTS_FILE_PATH)) {
            residents = {};
            fs.createReadStream(RESIDENTS_FILE_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    residents[row.NIK] = row;
                });
        } else {
            console.log('File warga tidak ditemukan, menginisialisasi objek warga kosong.');
        }
    } catch (error) {
        console.error('Kesalahan memuat data warga:', error);
        residents = {}; // Reset warga jika terjadi kesalahan
    }
    return residents;
}

module.exports = loadResidents;
