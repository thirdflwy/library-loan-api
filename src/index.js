
require('dotenv').config();

const express = require('express');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Library Loan API',
        endpoints: '/api/loans'
    });
});

app.use('/api/loans', loanRoutes);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;