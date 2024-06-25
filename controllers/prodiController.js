const { PengajuanBeasiswa, Mahasiswa, PeriodePengajuan } = require('../models');
const express = require('express');

const createResponse = (data, status = 200) => {
    return { data, status };
};

const index = async (req, res) => {
    res.render('prodi/index');
};

const getPengajuanByPeriode = async (req, res) => {
    try {
        const getPeriode = await PeriodePengajuan.findOne({
            where: {
                status: true
            }
        });
        const periode_id = getPeriode.periode_id;

        const pengajuanList = await PengajuanBeasiswa.findAll({
            where: { periode_id },
            include: [
                { model: Mahasiswa }
            ]
        });

        const result = pengajuanList.map(p => ({
            pengajuan_id: p.pengajuan_id,
            nrp: p.nrp,
            beasiswa_id: p.beasiswa_id,
            periode_id: p.periode_id,
            tanggal_pengajuan: p.tanggal_pengajuan,
            status_pengajuan: p.status_pengajuan,
            status_pengajuan_fakultas: p.status_pengajuan_fakultas,
            dokumen_pengajuan: p.dokumen_pengajuan,
            nama_mahasiswa: p.Mahasiswa ? p.Mahasiswa.nama_mahasiswa : 'Tidak ditemukan',
            program_studi_id: p.Mahasiswa ? p.Mahasiswa.program_studi_id : 'Tidak ditemukan',
            ipk_terakhir: p.Mahasiswa ? p.Mahasiswa.ipk_terakhir : 'Tidak ditemukan',
            status_aktif: p.Mahasiswa ? p.Mahasiswa.status_aktif : 'Tidak ditemukan'
        }));

        res.render('prodi/showPengajuan', { result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPengajuanDetail = async (req, res) => {
    try {
        const { pengajuan_id } = req.params;
        const pengajuan = await PengajuanBeasiswa.findOne({ where: { pengajuan_id } });
        if (!pengajuan) {
            return res.status(404).json(createResponse({ message: 'Pengajuan not found' }));
        }
        const mahasiswa = await Mahasiswa.findOne({ where: { nrp: pengajuan.nrp } });
        if (!mahasiswa) {
            return res.status(404).json(createResponse({ message: 'Mahasiswa not found' }));
        }
        const result = {
            pengajuan: {
                pengajuan_id: pengajuan.pengajuan_id,
                nrp: pengajuan.nrp,
                beasiswa_id: pengajuan.beasiswa_id,
                periode_id: pengajuan.periode_id,
                tanggal_pengajuan: pengajuan.tanggal_pengajuan,
                status_pengajuan: pengajuan.status_pengajuan,
                status_pengajuan_fakultas: pengajuan.status_pengajuan_fakultas,
                dokumen_pengajuan: pengajuan.dokumen_pengajuan
            },
            mahasiswa: {
                nrp: mahasiswa.nrp,
                nama_mahasiswa: mahasiswa.nama_mahasiswa,
                program_studi_id: mahasiswa.program_studi_id,
                ipk_terakhir: mahasiswa.ipk_terakhir,
                status_aktif: mahasiswa.status_aktif
            }
        };
        res.status(200).json(createResponse(result));
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const approvePengajuan = async (req, res) => {
    try {
        const { pengajuan_id } = req.params;
        const pengajuan = await PengajuanBeasiswa.findOne({ where: { pengajuan_id } });
        if (!pengajuan) {
            return res.status(404).json(createResponse({ message: 'Pengajuan not found' }));
        }
        pengajuan.status_pengajuan = 'Disetujui Prodi';
        await pengajuan.save();
        res.redirect(`/prodi/pengajuan?status=approved&pengajuan_id=${pengajuan_id}`);
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const declinePengajuan = async (req, res) => {
    try {
        const { pengajuan_id } = req.params;
        const pengajuan = await PengajuanBeasiswa.findOne({ where: { pengajuan_id } });
        if (!pengajuan) {
            return res.status(404).json(createResponse({ message: 'Pengajuan not found' }));
        }
        pengajuan.status_pengajuan = 'Tidak Disetujui Prodi';
        await pengajuan.save();
        res.redirect(`/prodi/pengajuan?status=declined&pengajuan_id=${pengajuan_id}`);
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const periode = async (req, res) => {
    try {
        const periode = await PeriodePengajuan.findAll();
        res.render('prodi/periode', { periode: periode });
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const createPeriode = async (req, res) => {
    try {
        const { periode_id, nama_periode, tanggal_mulai, tanggal_selesai, status } = req.body;
        const newPeriode = await PeriodePengajuan.create({
            periode_id,
            nama_periode,
            tanggal_mulai,
            tanggal_selesai,
            status
        });
        res.redirect('/prodi/periode');
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const updatePeriode = async (req, res) => {
    try {
        const { periode_id } = req.params;
        const { nama_periode, tanggal_mulai, tanggal_selesai, status } = req.body;
        const periode = await PeriodePengajuan.findOne({ where: { periode_id } });
        if (!periode) {
            return res.status(404).json(createResponse({ message: 'Periode not found' }));
        }
        periode.nama_periode = nama_periode;
        periode.tanggal_mulai = tanggal_mulai;
        periode.tanggal_selesai = tanggal_selesai;
        periode.status = status;
        await periode.save();
        res.redirect('/prodi/periode');
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const deletePeriode = async (req, res) => {
    try {
        const { periode_id } = req.params;
        const periode = await PeriodePengajuan.findOne({ where: { periode_id } });
        if (!periode) {
            return res.status(404).json(createResponse({ message: 'Periode not found' }));
        }
        await periode.destroy();
        res.redirect('/prodi/periode');
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

module.exports = {
    index,
    getPengajuanByPeriode,
    getPengajuanDetail,
    approvePengajuan,
    declinePengajuan,
    periode,
    createPeriode,
    updatePeriode,
    deletePeriode
};
