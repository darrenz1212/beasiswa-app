const { PengajuanBeasiswa, Mahasiswa } = require('../models');
const express = require('express');

const createResponse = (data, status = 200) => {
    return { data, status };
};

const getPengajuanByPeriode = async (req, res) => {
    try {
        const { periode_id } = req.params;
        const pengajuanList = await PengajuanBeasiswa.findAll({
            where: { periode_id }
        });
        const result = pengajuanList.map(p => ({
            pengajuan_id: p.pengajuan_id,
            nrp: p.nrp,
            beasiswa_id: p.beasiswa_id,
            periode_id: p.periode_id,
            tanggal_pengajuan: p.tanggal_pengajuan,
            status_pengajuan: p.status_pengajuan,
            status_pengajuan_fakultas: p.status_pengajuan_fakultas,
            dokumen_pengajuan: p.dokumen_pengajuan
        }));
        res.status(200).json(createResponse({ pengajuan: result }));
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
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
        res.status(200).json(createResponse({ message: 'Pengajuan approved by Program Studi' }));
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
        res.status(200).json(createResponse({ message: 'Pengajuan declined by Program Studi' }));
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

module.exports = {
    getPengajuanByPeriode,
    getPengajuanDetail,
    approvePengajuan,
    declinePengajuan
};