import { Box, Stack, Typography, styled } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const Items = styled(Typography)(({ active }) => ({
  display: "flex",
  alignItems: "center",
  padding: "6px 0",
  paddingLeft: "16px",
  gap: 12,
  cursor: "pointer",
  backgroundColor: active ? "rgb(255, 255, 255)" : "transparent",
  "&:hover": {
    background: "rgb(255, 255, 255)",
  },
}));

const Text = styled(Typography)(({ active }) => ({
  fontSize: 14,
  lineHeight: "24px",
  width: "100%",
  fontWeight: active ? "bold" : "normal",
  "&:hover": {
    fontWeight: "bold",
  },
}));

const ItemsBottom = styled(Items)({
  paddingLeft: "unset",
  borderBottom: "1px solid rgb(230, 235, 245)",
});

const TextBottom = styled(Typography)({
  fontSize: 14,
  lineHeight: "24px",
  width: "100%",
});

const HotEventBadge = styled(Box)({
  display: "flex",
  alignItems: "center",
  color: "#ff4d4f",
  fontSize: 12,
  fontWeight: "bold",
  marginLeft: 8,
});

const listSidebarTop = [
  { icon: "/img/sidebar1.png", name: "Trang chủ", path: "/", typeEvent: null },
  {
    icon: "/img/fire-icon.png",
    name: "Sự kiện bán chạy nhất",
    path: "/?hot=true",
    isHot: true,
    customIcon: <LocalFireDepartmentIcon sx={{ color: "#ff4d4f" }} />,
  },
  {
    icon: "/img/sidebar2.png",
    name: "Nhạc sống",
    path: "/?typeEvent=1",
    typeEvent: 1,
  },
  {
    icon: "/img/sidebar3.png",
    name: "Văn hóa nghệ thuật",
    path: "/?typeEvent=2",
    typeEvent: 2,
  },
  {
    icon: "/img/sidebar4.png",
    name: "Sân khấu",
    path: "/?typeEvent=3",
    typeEvent: 3,
  },
  {
    icon: "/img/sidebar5.png",
    name: "Ngoài trời",
    path: "/?typeEvent=4",
    typeEvent: 4,
  },
  {
    icon: "/img/sidebar6.png",
    name: "Khóa học",
    path: "/?typeEvent=6",
    typeEvent: 6,
  },
  {
    icon: "/img/sidebar7.png",
    name: "Tham quan",
    path: "/?typeEvent=5",
    typeEvent: 5,
  },
  {
    icon: "/img/sidebar8.png",
    name: "Thể thao",
    path: "/?typeEvent=9",
    typeEvent: 9,
  },
  {
    icon: "/img/sidebar9.png",
    name: "Sự kiện tại TP.Hồ Chí Minh",
    path: "/?city=hcm",
    city: "hcm",
  },
  {
    icon: "/img/sidebar10.png",
    name: "Sự kiện tại Hà Nội",
    path: "/?city=hn",
    city: "hn",
  },
];

const listSidebarBottom = [
  { icon: "/img/sidebar11.png", name: "Về chúng tôi" },
  { icon: "/img/sidebar12.png", name: "Dành cho nhà tổ chức" },
  { icon: "/img/sidebar13.png", name: "Câu hỏi thường gặp" },
  { icon: "/img/sidebar14.png", name: "Quy chế hoạt động" },
  { icon: "/img/sidebar15.png", name: "Chính sách bảo mật thông tin" },
  { icon: "/img/sidebar16.png", name: "Chính sách giải quyết tranh chấp" },
  { icon: "/img/sidebar17.png", name: "Chính sách bảo mật thanh toán" },
  { icon: "/img/sidebar18.png", name: "Chính sách đổi trả và kiểm hàng" },
  { icon: "/img/sidebar20.png", name: "Điều khoản sử dụng cho khách hàng" },
  { icon: "/img/sidebar21.png", name: "Điều khoản sử dụng cho nhà tổ chức" },
  { icon: "/img/sidebar22.png", name: "Phương thức thanh toán" },
];


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTypeEvent = searchParams.get("typeEvent");
  const currentCity = searchParams.get("city");
  const currentSearch = searchParams.get("name");
  const isHotEvents = searchParams.get("hot") === "true";

  const handleItemClick = (item) => {
    let newPath = item.path;
    if (currentSearch && item.path !== "/") {
      const searchParams = new URLSearchParams(item.path.substring(1));
      searchParams.append("name", currentSearch);
      newPath = `/?${searchParams.toString()}`;
    }

    navigate(newPath);
  };

  const isItemActive = (item) => {
    if (item.isHot && isHotEvents) {
      return true;
    }
    if (item.typeEvent && parseInt(currentTypeEvent) === item.typeEvent) {
      return true;
    }
    if (item.city && currentCity === item.city) {
      return true;
    }
    if (
      item.path === "/" &&
      !currentTypeEvent &&
      !currentCity &&
      !isHotEvents
    ) {
      return true;
    }
    return false;
  };

  return (
    <Stack maxHeight={"100vh"} sx={{ overflowY: "scroll" }}>
      {listSidebarTop?.map((item, index) => (
        <Items
          key={index}
          active={isItemActive(item)}
          onClick={() => handleItemClick(item)}
        >
          {item.customIcon || (
            <Box
              component={"img"}
              src={item.icon}
              width={24}
              height={24}
              sx={{ objectFit: "cover" }}
            />
          )}
          <Text active={isItemActive(item)}>
            {item.name}
            {item.isHot && <HotEventBadge component="span">HOT</HotEventBadge>}
          </Text>
        </Items>
      ))}
      <Box
        height={"1px"}
        width={"100%"}
        bgcolor={"rgb(230, 235, 245)"}
        mt={"16px"}
      />

      <Box paddingLeft={"16px"}>
        {listSidebarBottom?.map((e, index) => (
          <ItemsBottom key={index + 100}>
            <Box
              component={"img"}
              src={e.icon}
              width={24}
              height={24}
              sx={{ objectFit: "cover" }}
            />
            <TextBottom>{e.name}</TextBottom>
          </ItemsBottom>
        ))}
      </Box>

      <Box padding={"16px 16px 0"}>
        <Box src={"/img/sidebar23.png"} component={"img"} height={39} />
        <Typography
          mt={"4px"}
          fontSize={"10px"}
          color={"rgb(96,103,120)"}
          lineHeight={"16px"}
        >
          Ticketbox UTE System
        </Typography>
        <Typography
          mt={"4px"}
          fontSize={"10px"}
          color={"rgb(96,103,120)"}
          lineHeight={"16px"}
        >
          Address: 01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh
        </Typography>
        <Typography
          mt={"4px"}
          fontSize={"10px"}
          color={"rgb(96,103,120)"}
          lineHeight={"16px"}
        >
          Tel: 1900.6408 - Hotline: support@ticketbox.vn
        </Typography>
        <Box
          display={"flex"}
          gap={2}
          alignItems={"center"}
          mt={"16px"}
          sx={{ cursor: "pointer" }}
        >
          <Box component={"img"} src={"/img/sidebar24.png"} width={24} />
          <Box component={"img"} src={"/img/sidebar25.png"} width={24} />
          <Box component={"img"} src={"/img/sidebar26.png"} width={24} />
          <Box component={"img"} src={"/img/sidebar27.png"} width={24} />
        </Box>
      </Box>
    </Stack>
  );
}

export default Sidebar;
