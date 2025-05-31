import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { createVnPayUrl } from '../../utils/api/payment';
import { notify } from '../../utils/helpers/notify';

const VNPayButtonCustom = ({ paymentData }) => {
  const [loading, setLoading] = useState(false);

  const handleVNPayCheckout = async () => {
    try {
      setLoading(true);
      // Hiển thị thông báo cho người dùng biết đang xử lý
      notify('info', 'Đang khởi tạo giao dịch thanh toán...');

      // Gọi API để tạo URL thanh toán VNPay
      const response = await createVnPayUrl(paymentData);

      if (response.data && response.data.success && response.data.paymentUrl) {
        // Lưu payment ID vào localStorage để có thể kiểm tra trạng thái sau này nếu cần
        localStorage.setItem('pendingPaymentId', response.data.paymentId);

        // Chuyển hướng người dùng đến cổng thanh toán VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        notify('error', 'Không thể tạo liên kết thanh toán VNPay. Vui lòng thử lại sau.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating VNPay payment URL:', error);
      notify('error', 'Đã xảy ra lỗi khi khởi tạo thanh toán VNPay. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleVNPayCheckout}
      disabled={loading}
      sx={{
        bgcolor: '#0066FF',
        color: 'white',
        p: 1.5,
        mb: 2,
        '&:hover': {
          bgcolor: '#0044CC',
        },
        position: 'relative',
      }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <>
          <img
            src="/img/vnpay-logo.png"
            alt="VNPay Logo"
            style={{
              width: '24px',
              height: '24px',
              marginRight: '8px',
              objectFit: 'contain'
            }}
          />
          Thanh toán với VNPay
        </>
      )}
    </Button>
  );
};

export default VNPayButtonCustom;
