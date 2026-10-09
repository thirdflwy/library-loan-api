
const supabase = require('../config/supabaseClient');

async function getAllLoans(status) {
    let query = supabase
        .from('loans')
        .select('*')
        .order('id', { ascending: true });

    if (status) {
        query = query.eq('status', status);
    }

    return await query;
}

async function getLoanById(id) {
    return await supabase
        .from('loans')
        .select('*')
        .eq('id', id)
        .single();
}

async function createLoan(data) {
    return await supabase
        .from('loans')
        .insert([data])
        .select()
        .single();
}

async function updateLoan(id, data) {
    return await supabase
        .from('loans')
        .update(data)
        .eq('id', id)
        .select()
        .single();
}

async function deleteLoan(id) {
    return await supabase
        .from('loans')
        .delete()
        .eq('id', id)
        .select()
        .single();
}

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan
};