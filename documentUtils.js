// documentUtils.js
const fs = require('fs');
const path = require('path');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

// File paths
const TEMPLATE_FILE_PATH = path.join(__dirname, 'template.docx');
const submissionsDir = path.join(__dirname, 'submissions');

// Helper function to load a file
function loadFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            return defaultValue;
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return defaultValue;
    }
}

// Helper function to save a file
function saveFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`File ${filePath} saved.`);
    } catch (error) {
        console.error(`Error saving ${filePath}:`, error);
    }
}

// Generate a document from a template
async function generateFromTemplate(resident, service, noSurat) {
    try {
        const content = fs.readFileSync(TEMPLATE_FILE_PATH, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // Get current date
        const now = new Date();
        const date = now.getDate().toString().padStart(2, '0');
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const month = monthNames[now.getMonth()]; // Get month name
        const year = now.getFullYear();
        const dmy = `${date} ${month} ${year}`;

        // Render the document with placeholders
        doc.render({
            NAMA: resident.NAMA,
            NIK: resident.NIK,
            JENIS_KELAMIN: resident["JENIS KELAMIN"],
            TEMPAT_TANGGAL_LAHIR: resident["TEMPAT/TANGGAL LAHIR"],
            AGAMA: resident.AGAMA,
            PEKERJAAN: resident.PEKERJAAN,
            ALAMAT: resident.ALAMAT,
            KEPERLUAN: service,
            DATE: date,
            MONTH: now.getMonth() + 1, // Numeric month
            YEAR: year,
            DMY: dmy,
            NO_SURAT: noSurat
        });

        const buffer = doc.getZip().generate({ type: 'nodebuffer' });
        const filePath = path.join(submissionsDir, `${resident.NIK}_${now.toISOString().slice(0, 10)}.docx`);
        fs.writeFileSync(filePath, buffer);

        return filePath;
    } catch (error) {
        console.error('Error creating document:', error);
        throw new Error('Unable to create document');
    }
}

module.exports = {
    loadFile,
    saveFile,
    generateFromTemplate
};
