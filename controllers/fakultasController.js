const { PengajuanBeasiswa } = require('../models');
const express = require('express');

const getSession = async () => {
    return PengajuanBeasiswa;
};

const index = (req, res) => {
    res.render('fakultas/index', { username: req.session.username || 'User' });
};

const createResponse = (data, status = 200) => {
    return { data, status };
};

const getAllPengajuan = async (req, res) => {
    try {
        const pengajuanList = await PengajuanBeasiswa.findAll();
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
        res.render('fakultas/showPengajuan',{pengajuan:result})
        // res.send(result)
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

const getApprovedByProdiPengajuan = async (req, res) => {
    try {
        const pengajuanList = await PengajuanBeasiswa.findAll({
            where: { status_pengajuan: 'Disetujui Prodi' }
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

const approvePengajuan = async (req, res) => {
    try {
        const { pengajuan_id } = req.params;
        const pengajuan = await PengajuanBeasiswa.findOne({ where: { pengajuan_id } });
        if (!pengajuan) {
            return res.status(404).json(createResponse({ message: 'Pengajuan not found' }));
        }
        if (pengajuan.status_pengajuan === 'Disetujui Prodi') {
            pengajuan.status_pengajuan_fakultas = 'Disetujui Fakultas';
            await pengajuan.save();
            return res.status(200).json(createResponse({ message: 'Pengajuan approved by Fakultas' }));
        }
        res.status(400).json(createResponse({ message: 'Pengajuan not approved by program studi' }));
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
        if (pengajuan.status_pengajuan === 'Disetujui Prodi') {
            pengajuan.status_pengajuan_fakultas = 'Tidak Disetujui Fakultas';
            await pengajuan.save();
            return res.status(200).json(createResponse({ message: 'Pengajuan declined by Fakultas' }));
        }
        res.status(400).json(createResponse({ message: 'Pengajuan not approved by program studi' }));
    } catch (error) {
        res.status(500).json(createResponse({ message: error.message }));
    }
};

module.exports = {
    getAllPengajuan,
    getApprovedByProdiPengajuan,
    approvePengajuan,
    declinePengajuan,
    index
};
