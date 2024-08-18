require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { displayServiceMenu, displayResidentDetails, displaySubmissionMenu } = require('./bot/services');
const loadResidents = require('./bot/loadResidents');
const { loadFile, saveFile, generateFromTemplate } = require('./documentUtils');

// Initialize client
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    })
});

// File paths
const SESSION_FILE_PATH = path.join(__dirname, 'sessions.json');
const SUBMISSIONS_FILE_PATH = path.join(__dirname, 'submissions.json');

// Sessions and submissions
let sessions = loadFile(SESSION_FILE_PATH, {});
let submissions = loadFile(SUBMISSIONS_FILE_PATH, {
    lastNoSurat: process.env.NO_SURAT || '001',
    lastId: parseInt(process.env.ID_pengajuan, 10) || 1,
    records: {}
});

// Service selections (in-memory only)
let serviceSelections = {};

// Load residents
let residents = loadResidents();

// Ensure the submissions directory exists
const submissionsDir = path.join(__dirname, 'submissions');
if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir);
}

// Save sessions to file
function saveSessions() {
    saveFile(SESSION_FILE_PATH, sessions);
}

// Save submissions to file
function saveSubmissions() {
    saveFile(SUBMISSIONS_FILE_PATH, submissions);
}

// Authenticate and initialize client
client.on('authenticated', () => {
    console.log('Authenticated');
    saveSessions();
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Client is ready");
});

// Handle incoming messages
client.on('message', async (message) => {
    const userId = message.from;
    const body = message.body.trim().toLowerCase();
    const serviceOptions = [
        'Kartu Keluarga (KK)',
        'Kartu Tanda Penduduk (KTP)',
        'Surat Keterangan Pindah',
        'Surat Keterangan Pindah Datang',
        'Surat Keterangan Pindah Keluar Negeri',
        'Surat Keterangan Datang dari Luar Negeri',
        'Surat Keterangan Tempat Tinggal',
        'Surat Keterangan Kelahiran',
        'Surat Keterangan Lahir Mati',
        'Surat Keterangan Pembatalan Perkawinan',
        'Surat Keterangan Pembatalan Perceraian',
        'Surat Keterangan Kematian',
        'Surat Keterangan Pengangkatan Anak',
        'Surat Keterangan Pelepasan Kewarganegaraan Indonesia',
        'Surat Keterangan Pengganti Tanda Identitas'
    ];

    try {
        const today = new Date().toISOString().slice(0, 10);

        if (userId === process.env.RECEIVER_NUMBER) {
            if (body === 'edit') {
                await message.reply('Silakan masukkan nomor surat sebelumnya \n(yang sudah digunakan terakhir) dengan format:\n\nnomor surat <nomor surat sebelumnya>');
                return;
            } else if (body.startsWith('nomor surat')) {
                const previousNoSurat = body.split('nomor surat')[1].trim();
                
                // Validate previous number
                const previousNoSuratParsed = parseInt(previousNoSurat, 10);
                if (isNaN(previousNoSuratParsed) || previousNoSuratParsed <= 0) {
                    await message.reply('Nomor surat sebelumnya tidak valid. Silakan coba lagi.');
                    return;
                }
                
                // Update lastNoSurat
                submissions.lastNoSurat = previousNoSurat;
                saveSubmissions();
                
                // Calculate nextNoSurat
                const nextNoSurat = (previousNoSuratParsed + 1).toString().padStart(3, '0');
                await message.reply(`Nomor surat telah diperbarui menjadi ${previousNoSurat}. Nomor surat selanjutnya akan dimulai dari ${nextNoSurat}.`);
                return;
            }
        
            const idToCheck = body;
            let userIdToNotify = null;
            for (const [user, records] of Object.entries(submissions.records)) {
                const submission = records.find(sub => sub.id_pengajuan === idToCheck);
                if (submission) {
                    userIdToNotify = submission.userId;
                    break;
                }
            }
            
            if (userIdToNotify) {
                // Find resident and generate document
                const submission = submissions.records[userIdToNotify].find(sub => sub.id_pengajuan === idToCheck);
                const nik = submission.nik;
                const resident = residents[nik];
                if (resident) {
                    const newNoSurat = (parseInt(submissions.lastNoSurat, 10) + 1).toString().padStart(3, '0');
                    const filePath = await generateFromTemplate(resident, submission.service, newNoSurat);
            
                    // Update lastNoSurat
                    submissions.lastNoSurat = newNoSurat;
                    saveSubmissions();
            
                    const media = MessageMedia.fromFilePath(filePath);
                    await client.sendMessage(process.env.RECEIVER_NUMBER, media, { caption: `File .docx untuk ID pengajuan ${idToCheck} telah dibuat dengan NO_SURAT ${newNoSurat}.` });
                    
                    // Notify user
                    await client.sendMessage(userIdToNotify, `Pengajuan anda telah diterima. Silakan mengambil dokumen di rumah ketua RT.`);
                } else {
                    await message.reply('Data warga tidak ditemukan.');
                }
            } else {
                await message.reply('ID pengajuan tidak ditemukan.');
            }
            return;
        }
        
        if (sessions[userId] && sessions[userId].nik) {
            const nikWarga = sessions[userId].nik;
            const resident = residents[nikWarga];
            const namaWarga = resident ? resident.NAMA : 'Unknown';

            switch (body) {
                case '99':
                    // Handle logout
                    delete sessions[userId];
                    delete serviceSelections[userId];
                    saveSessions();
                    await message.reply('Anda telah logout. Silakan ketik NIK Anda untuk login kembali.');
                    break;

                case '100':
                    if (serviceSelections[userId]) {
                        // Handle 'Ajukan'
                        if (!submissions.records[userId]) {
                            submissions.records[userId] = [];
                        }
                        const submissionsToday = submissions.records[userId].filter(submission => submission.date === today);
                        if (submissionsToday.length >= 100) {
                            // Logout after reaching submission limit
                            delete sessions[userId];
                            delete serviceSelections[userId];
                            saveSessions();
                            await message.reply('Anda telah mencapai batas pengajuan (100 kali) untuk hari ini. Anda telah logout. Silakan ketik NIK Anda untuk login kembali.');
                        } else {
                            const submission = {
                                id_pengajuan: submissions.lastId.toString().padStart(3, '0'),
                                service: serviceSelections[userId],
                                date: today,
                                nik: nikWarga,
                                id: resident ? resident.ID : 'Unknown',
                                NAMA: resident.NAMA,
                                JENIS_KELAMIN: resident["JENIS KELAMIN"],
                                TEMPAT_TANGGAL_LAHIR: resident["TEMPAT/TANGGAL LAHIR"],
                                AGAMA: resident.AGAMA,
                                PEKERJAAN: resident.PEKERJAAN,
                                ALAMAT: resident.ALAMAT,
                                KEPERLUAN: serviceSelections[userId],
                                DATE: new Date().getDate().toString().padStart(2, '0'),
                                MONTH: new Date().getMonth() + 1,
                                YEAR: new Date().getFullYear(),
                                DMY: `${new Date().getDate().toString().padStart(2, '0')} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][new Date().getMonth()]} ${new Date().getFullYear()}`,
                                userId: userId
                            };
                            submissions.lastId++;
                            submissions.records[userId].push(submission);
                            saveSubmissions();
                
                            await message.reply(`Pengajuan untuk layanan ${serviceSelections[userId]} berhasil dilakukan.`);
                
                            // Notify RECEIVER_NUMBER
                            await client.sendMessage(process.env.RECEIVER_NUMBER, `Pengajuan diterima: \n\nNama: ${namaWarga}\nNIK: ${nikWarga}\nTanggal: ${today}\nID Pengajuan: ${submission.id_pengajuan}`);
                
                            // Logout user after successful submission
                            delete sessions[userId];
                            delete serviceSelections[userId];
                            saveSessions();
                
                            // Send confirmation and redirect to service menu
                            await message.reply('Pengajuan berhasil diproses. Anda telah logout. Silakan ketik NIK Anda untuk login kembali.');
                        }
                    }
                    break;

                case '101':
                    // Handle 'Edit'
                    await message.reply('Silakan pilih layanan baru untuk diubah:');
                    displayServiceMenu(message);
                    break;

                default:
                    if (parseInt(body, 10) >= 1 && parseInt(body, 10) <= 15) {
                        // Handle valid service selection
                        const selectedService = serviceOptions[parseInt(body, 10) - 1];
                        serviceSelections[userId] = selectedService;
                        await message.reply(displayResidentDetails(resident, selectedService));
                        displaySubmissionMenu(message);
                    } else if (body === '0') {
                        // Reset service selection and redirect to service menu
                        delete serviceSelections[userId];
                        await message.reply(displayResidentDetails(resident, 'Belum dipilih'));
                        displayServiceMenu(message);
                    } else {
                        // Display service menu if user hasn't selected a service
                        await message.reply(displayResidentDetails(resident, serviceSelections[userId] || 'Belum dipilih'));
                        displayServiceMenu(message);
                    }
                    break;
            }
        } else if (residents[body]) {
            // Valid NIK, save to session
            sessions[userId] = { nik: body };
            saveSessions();
            await message.reply(displayResidentDetails(residents[body]));
            displayServiceMenu(message);
        } else {
            // Welcome message for new users
            await message.reply('Selamat datang di layanan RT 17 Desa Badak Baru. Untuk mengurus keperluan, silahkan masukkan NIK anda dengan benar.');
        }
    } catch (error) {
        console.error('Error handling message:', error);
        await message.reply('Terjadi kesalahan dalam memproses permintaan Anda.');
    }
});

client.initialize();
