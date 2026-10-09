
const loanModel = require('../models/loanModel');

const allowedStatuses = [
    'Dipinjam',
    'Dikembalikan',
    'Terlambat'
];

function isValidId(id) {
    return /^\d+$/.test(id) && Number(id) > 0;
}

function handleError(res, error) {
    console.error(error);
    return res.status(500).json({
        message: 'Terjadi kesalahan pada server'
    });
}

async function getAll(req, res) {
    try {
        const { status } = req.query;

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Status tidak valid'
            });
        }

        const { data, error } = await loanModel.getAllLoans(status);

        if (error) return handleError(res, error);

        return res.json(data);
    } catch (error) {
        return handleError(res, error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'ID tidak valid' });
        }

        const { data, error } = await loanModel.getLoanById(Number(id));

        if (error?.code === 'PGRST116') {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        if (error) return handleError(res, error);

        return res.json(data);
    } catch (error) {
        return handleError(res, error);
    }
}

async function create(req, res) {
    try {
        const {
            borrower_name,
            book_title,
            loan_date,
            due_date,
            return_date,
            status = 'Dipinjam'
        } = req.body;

        if (
            !borrower_name?.trim() ||
            !book_title?.trim() ||
            !loan_date ||
            !due_date ||
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: 'Data peminjaman tidak lengkap atau tidak valid'
            });
        }

        const { data, error } = await loanModel.createLoan({
            borrower_name: borrower_name.trim(),
            book_title: book_title.trim(),
            loan_date,
            due_date,
            return_date: return_date ?? null,
            status: status ?? 'Dipinjam'
        });

        if (error) return handleError(res, error);

        return res.status(201).json({
            message: 'Data peminjaman berhasil ditambahkan',
            data
        });
    } catch (error) {
        return handleError(res, error);
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const {
            borrower_name,
            book_title,
            loan_date,
            due_date,
            return_date,
            status
        } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'ID tidak valid' });
        }

        const dataToUpdate = {};

        if (borrower_name !== undefined) {
            if (typeof borrower_name !== 'string' || !borrower_name.trim()) {
                return res.status(400).json({ message: 'Nama peminjam tidak valid' });
            }
            dataToUpdate.borrower_name = borrower_name.trim();
        }

        if (book_title !== undefined) {
            if (typeof book_title !== 'string' || !book_title.trim()) {
                return res.status(400).json({ message: 'Judul buku tidak valid' });
            }
            dataToUpdate.book_title = book_title.trim();
        }

        if (loan_date !== undefined) dataToUpdate.loan_date = loan_date;
        if (due_date !== undefined) dataToUpdate.due_date = due_date;
        if (return_date !== undefined) dataToUpdate.return_date = return_date;

        if (status !== undefined) {
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Status tidak valid' });
            }
            dataToUpdate.status = status;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Tidak ada data untuk diubah' });
        }

        const { data, error } = await loanModel.updateLoan(
            Number(id),
            dataToUpdate
        );

        if (error?.code === 'PGRST116') {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        if (error) return handleError(res, error);

        return res.json({
            message: 'Data peminjaman berhasil diperbarui',
            data
        });
    } catch (error) {
        return handleError(res, error);
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'ID tidak valid' });
        }

        const { data, error } = await loanModel.deleteLoan(Number(id));

        if (error?.code === 'PGRST116') {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        if (error) return handleError(res, error);

        return res.json({
            message: 'Data peminjaman berhasil dihapus',
            data
        });
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = { getAll, getById, create, update, remove };