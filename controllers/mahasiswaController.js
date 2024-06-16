// controllers/mahasiswaController.js
const { Mahasiswa, JenisBeasiswa, PeriodePengajuan, ProgramStudi, Fakultas, PengajuanBeasiswa} = require('../models');
const {where} = require("sequelize");


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
            periode: b.nama_periode
        }));

        res.render('mahasiswa/pengajuan', { result });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
            namaBeasiswa : timelines.nama_beasiswa,
            nrp : mhswData.nrp,
            nama : mhswData.nama_mahasiswa,
            prodi : mhswData.ProgramStudi.nama_program_studi,
            ipk : mhswData.ipk_terakhir,
            periode : timelines.PeriodePengajuan.nama_periode


        }
        res.render('mahasiswa/history', {result : result})
    }catch (error){
        res.status(500).json({error: error.message})
    }
}



module.exports = {
    index,
    timeline,
    showPendaftaran,
    history
};
