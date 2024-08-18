function displayServiceMenu(message) {
    message.reply(`Silakan pilih keperluan dengan mengetik nomor:

1. Kartu Keluarga (KK)
2. Kartu Tanda Penduduk (KTP)
3. Surat Keterangan Pindah
4. Surat Keterangan Pindah Datang
5. Surat Keterangan Pindah Keluar Negri
6. Surat Keterangan Datang dari luar negri
7. Surat Keterangan tempat tinggal
8. Surat Keterangan kelahiran
9. Surat Keterangan lahir mati
10. Surat Keterangan Pembatalan Perkawinan
11. Surat Keterangan Pembatalan Perceraian
12. Surat Keterangan Kematian
13. Surat Keterangan Pengangkatan Anak
14. Surat Keterangan pelepasan kewarganegaraan Indonesia
15. Surat Keterangan Pengganti Tanda Identitas
99. Logout

Ketik nomor layanan untuk memilih.`);
}

function displaySubmissionMenu(message) {
    message.reply(`
Layanan sudah dipilih. Pilih opsi:

100. Ajukan
101. Edit

Ketik nomor opsi untuk memilih.`);
}


function displayResidentDetails(resident, service = '') {
    return `NIK sudah valid. Berikut adalah detail Anda:

Nama: ${resident.NAMA}
NIK: ${resident.NIK}
Jenis Kelamin: ${resident['JENIS KELAMIN']}
Tempat/Tanggal Lahir: ${resident['TEMPAT/TANGGAL LAHIR']}
Agama: ${resident.AGAMA}
Pekerjaan: ${resident.PEKERJAAN}
Alamat: ${resident.ALAMAT}
Keperluan: ${service || 'Belum dipilih'}`;
}

module.exports = { displayServiceMenu, displayResidentDetails, displaySubmissionMenu};
