import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin lỗi từ query parameters
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('paymentId');
  const errorCode = searchParams.get('error');

  // Hàm để hiển thị mô tả lỗi dựa vào mã lỗi VNPay
  const getErrorDescription = (code) => {
    switch (code) {
      case '01':
        return 'Giao dịch đã thanh toán';
      case '02':
        return 'Merchant không hợp lệ';
      case '03':
        return 'Dữ liệu gửi sang không đúng định dạng';
      case '04':
        return 'Khởi tạo GD không thành công do Website đang bị tạm khóa';
      case '05':
        return 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định';
      case '06':
        return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch';
      case '07':
        return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)';
      case '09':
        return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
      case '10':
        return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
      case '11':
        return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch';
      case '12':
        return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa';
      case '13':
        return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch';
      case '24':
        return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
      case '51':
        return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch';
      case '65':
        return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày';
      case '75':
        return 'Ngân hàng thanh toán đang bảo trì';
      case '79':
        return 'KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch';
      case '99':
        return 'Các lỗi khác';
      case 'verification_failed':
        return 'Xác thực thông tin thanh toán không thành công';
      case 'payment_not_found':
        return 'Không tìm thấy thông tin thanh toán';
      case 'server_error':
        return 'Đã xảy ra lỗi từ phía máy chủ';
      default:
        return 'Giao dịch không thành công vì lý do không xác định';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thanh toán thất bại
        </Typography>

        <Typography variant="body1" paragraph>
          Rất tiếc, thanh toán của bạn không thành công.
        </Typography>

        {errorCode && (
          <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body1" color="error.dark">
              Lỗi: {getErrorDescription(errorCode)}
            </Typography>
            {paymentId && (
              <Typography variant="body2" mt={1}>
                Mã thanh toán: {paymentId}
              </Typography>
            )}
          </Box>
        )}

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Quay về trang chủ
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            Thử lại
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentFailed;
