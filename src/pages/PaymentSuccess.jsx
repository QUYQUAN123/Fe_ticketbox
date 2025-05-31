import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { checkVnPayStatus } from '../utils/api/payment';
import { formatCurrency } from '../utils/helpers/formatCurrency';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy paymentId từ query parameters
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {    // Kiểm tra trạng thái thanh toán từ server
    const checkPaymentStatus = async () => {
      try {
        const response = await checkVnPayStatus(paymentId);
        if (response.data.success) {
          setPayment(response.data.payment);
        } else {
          setError('Không thể tải thông tin thanh toán');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      checkPaymentStatus();
    } else {
      setError('Không tìm thấy mã thanh toán');
      setLoading(false);
    }
  }, [paymentId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Đang xác thực thanh toán...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Quay về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thanh toán thành công!
        </Typography>
        <Typography variant="body1" paragraph>
          Cảm ơn bạn đã thanh toán. Chúng tôi đã gửi thông tin vé đến email của bạn.
        </Typography>

        {payment && (
          <Box sx={{ my: 4, textAlign: 'left' }}>            <Typography variant="h6" gutterBottom>
            Thông tin thanh toán:
          </Typography>
            <Typography variant="body1">Tên vé: {payment.name}</Typography>
            <Typography variant="body1">Giá vé: {formatCurrency(payment.price)}</Typography>
            <Typography variant="body1">Số lượng: {payment.number}</Typography>
            <Typography variant="body1">Tổng tiền: {formatCurrency(payment.amount)}</Typography>
            <Typography variant="body1">Phương thức thanh toán: VNPay</Typography>
            {payment.vnpayTransactionId && (
              <Typography variant="body1">Mã giao dịch: {payment.vnpayTransactionId}</Typography>
            )}
            {payment.vnpayPayDate && (
              <Typography variant="body1">Ngày thanh toán: {payment.vnpayPayDate}</Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Quay về trang chủ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
