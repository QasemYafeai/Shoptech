const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./dbConnection');
const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const { router: authRoutes } = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

(async () => {
  await connectToDB();
})();

app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
