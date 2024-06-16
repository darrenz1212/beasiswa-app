// controllers/mahasiswaController.js
const { Mahasiswa, JenisBeasiswa, PeriodePengajuan, ProgramStudi, Fakultas, PengajuanBeasiswa, DokumenPengajuan} = require('../models');
const {where} = require("sequelize");
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const index = async (req, res) => {
    try {
        const mahasiswaList = await Mahasiswa.findAll();
        const result = mahasiswaList.map(m => ({
            nrp: m.nrp,
            user_id: m.user_id,
            nama_mahasiswa: m.nama_mahasiswa,
            prodi: m.program_studi_id,
            ipk: m.ipk_terakhir,
            status: m.status_aktif ? 'Aktif' : 'Tidak Aktif'
        }));
        console.log(req.session.user_id)
        res.render('mahasiswa/index', { mahasiswa: result, user : req.session.user_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const timeline = async (req, res) => {
    try {
        const timelines = await JenisBeasiswa.findAll({
            include: [{
                model: PeriodePengajuan,
                attributes: ['nama_periode','tanggal_mulai','tanggal_selesai'],
                required: true
            }]
        });

        const result = timelines.map(t => ({
            beasiswa_id: t.beasiswa_id,
            nama_beasiswa: t.nama_beasiswa,
            deskripsi_beasiswa: t.deskripsi_beasiswa,
            nama_periode: t.PeriodePengajuan.nama_periode,
            tanggal_mulai : t.PeriodePengajuan.tanggal_mulai,
            tanggal_selesai : t.PeriodePengajuan.tanggal_selesai
        }));

        res.render('mahasiswa/timeline', {
            timeline: result
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const showPendaftaran = async (req, res) => {
    try {
        const user = req.session.user_id;

        const timelines = await JenisBeasiswa.findAll({
            include: [{
                model: PeriodePengajuan,
                attributes: ['periode_id', 'nama_periode'],
                required: true
            }]
        });

        const beasiswaDetail = timelines.map(t => ({
            periode_id: t.PeriodePengajuan.periode_id,
            beasiswa_id: t.beasiswa_id,
            nama_beasiswa: t.nama_beasiswa,
            deskripsi_beasiswa: t.deskripsi_beasiswa,
            nama_periode: t.PeriodePengajuan.nama_periode,
            tanggal_mulai: t.PeriodePengajuan.tanggal_mulai,
            tanggal_selesai: t.PeriodePengajuan.tanggal_selesai
        }));

        const mhswData = await Mahasiswa.findOne({
            where: {
                'user_id': user
            }
        });

        const jurusan = await ProgramStudi.findOne({
            include: [{
                model: Fakultas,
                attributes: ['nama_fakultas'],
                required: true
            }],
            where: {
                'program_studi_id': mhswData.program_studi_id
            }
        });

        const result = beasiswaDetail.map(b => ({
            nrp: mhswData.nrp,
            nama: mhswData.nama_mahasiswa,
            ipk: mhswData.ipk_terakhir,
            fakultas: jurusan.Fakulta.nama_fakultas,
            prodi: jurusan.nama_program_studi,
            namaBeasiswa: b.nama_beasiswa,
            periode: b.nama_periode,
            beasiswa_id : b.beasiswa_id,
            periode_id : b.periode_id
        }));

        res.render('mahasiswa/pengajuan', { result });
        // res.send(result)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/dokumenMahasiswa');
    },
    filename: async function (req, file, cb) {
        try {
            const user = req.session.user_id;

            // Ambil data mahasiswa berdasarkan user_id
            const mahasiswa = await Mahasiswa.findOne({
                where: { user_id: user },
                include: [{
                    model: ProgramStudi,
                    include: [Fakultas]
                }]
            });

            if (!mahasiswa) {
                return cb(new Error("Data mahasiswa tidak ditemukan."));
            }

            const { nrp, nama_mahasiswa } = mahasiswa;
            const { beasiswa_id } = req.body;

            const fakultas = mahasiswa.ProgramStudi.Fakulta.nama_fakultas;
            const programStudi = mahasiswa.ProgramStudi.nama_program_studi;

            // Buat nama file baru sesuai format yang diinginkan
            const fileName = `${nrp}_${nama_mahasiswa.replace(/\s+/g, '_')}_${beasiswa_id}_${fakultas.replace(/\s+/g, '_')}_${programStudi.replace(/\s+/g, '_')}${path.extname(file.originalname)}`;

            cb(null, fileName);
        } catch (error) {
            cb(error);
        }
    }
});

const upload = multer({ storage: storage });
const ajukanBeasiswa = async (req, res) => {
    upload.single('dokumen')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        try {
            const user = req.session.user_id;
            const { beasiswa_id } = req.body;
            const mahasiswa = await Mahasiswa.findOne({ where: { user_id: user } });

            const periode = await JenisBeasiswa.findOne({
                where:{
                    'beasiswa_id' : beasiswa_id
                }
            })

            const pengajuan = await PengajuanBeasiswa.create({
                nrp: mahasiswa.nrp,
                beasiswa_id,
                periode_id: periode.periode_id,
                tanggal_pengajuan: new Date(),
                status_pengajuan: 'Diajukan',
                status_pengajuan_fakultas: 'Diajukan',
                dokumen_pengajuan: req.file.filename
            });

            await DokumenPengajuan.create({
                pengajuan_id: pengajuan.pengajuan_id,
                nama_dokumen: req.file.originalname,
                path_dokumen: req.file.path
            });

            res.redirect('/mahasiswa/pengajuan');
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });
};

const history = async (req,res) =>{
    try {
        const user = req.session.user_id;

        const mhswData = await Mahasiswa.findOne({
            where: {
                'user_id': user
            },
            include : [{
                model : ProgramStudi,
                attributes : ['nama_program_studi'],
                required : true
            }]
        })

        const history = await PengajuanBeasiswa.findOne({
            where : {
                'nrp' : mhswData.nrp
            }
        })
        if (!history){
            res.render('mahasiswa/history',{result : null})
        }else{
            const timelines = await JenisBeasiswa.findOne({
                where :{
                    'beasiswa_id' :  history.beasiswa_id
                },
                include: [{
                    model: PeriodePengajuan,
                    attributes: ['periode_id', 'nama_periode'],
                    required: true
                }]
            });

            const result = {
                pengajuanId : history.pengajuan_id,
                namaBeasiswa : timelines.nama_beasiswa,
                nrp : mhswData.nrp,
                nama : mhswData.nama_mahasiswa,
                prodi : mhswData.ProgramStudi.nama_program_studi,
                ipk : mhswData.ipk_terakhir,
                periode : timelines.PeriodePengajuan.nama_periode


            }
            res.render('mahasiswa/history', {result : result})
        }

        // res.send()
    }catch (error){
        res.status(500).json({error: error.message})
    }
}
const deletePengajuan = async (req, res) => {
    try {
        const { pengajuanId } = req.params;


        const pengajuan = await PengajuanBeasiswa.findByPk(pengajuanId);
        if (!pengajuan) {
            return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
        }
        await pengajuan.destroy();
        res.json({ success: true, message: "Pengajuan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = {
    index,
    timeline,
    showPendaftaran,
    history,
    deletePengajuan,
    ajukanBeasiswa
};
