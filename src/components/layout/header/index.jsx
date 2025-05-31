import {
  Box,
  Button,
  Typography,
  styled,
  ClickAwayListener,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { getListEvent } from "../../../utils/api/event";

const InputCustom = styled("input")({
  outline: "none",
  border: "none",
  fontSize: 16,
  height: 44,
  width: "100%",
  background: "rgb(245, 247, 252)",
});

const WrapInput = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "0px 8px",
  background: "rgb(245, 247, 252)",
  gap: 8,
  borderRadius: "4px",
  color: "rgb(42, 45, 52)",
  border: "1px solid transparent",
  width: "300px",
  position: "relative",
  "&:hover": {
    borderColor: "rgb(175, 184, 201)",
  },
  "&:focus-within": {
    borderColor: "rgb(175, 184, 201)",
  },
});

const SuggestionsContainer = styled(Paper)({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: "300px",
  overflowY: "auto",
  marginTop: "4px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

const SuggestionItem = styled(ListItem)({
  padding: "8px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(45, 194, 117, 0.1)",
  },
});

const CreateEvent = styled(Box)({
  color: "rgb(45, 194, 117)",
  border: "1px solid rgb(45, 194, 117)",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: 16,
  minWidth: 88,
  lineHeight: "24px",
  padding: "10px 24px",
  cursor: "pointer",
  "&:hover": {
    borderColor: "rgb(35, 168, 100)",
    color: "rgb(35, 168, 100)",
  },
});

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);
  useEffect(() => {
    // Chỉ thiết lập giá trị tìm kiếm từ URL nếu không phải từ trang chi tiết sự kiện
    const searchParams = new URLSearchParams(location.search);
    const nameParam = searchParams.get("name");

    // Chỉ cập nhật searchTerm nếu đang ở trang chính (có tham số name) và có giá trị
    if (nameParam && location.pathname === "/") {
      setSearchTerm(nameParam);
    }
  }, [location.search, location.pathname]);

  const debounce = (func, delay) => {
    return function (...args) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  const fetchSuggestions = useCallback(
    debounce(async (term) => {
      if (!term || term.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        // Thêm tham số để đảm bảo chỉ lấy các sự kiện đã được phê duyệt
        const response = await getListEvent({
          name: term,
          permission: 1,
          isApprove: 1
        });

        if (response && response.data) {
          const eventSuggestions = response.data.slice(0, 5);
          // Log dữ liệu để xem cấu trúc của các event
          console.log("Event suggestions:", eventSuggestions);
          setSuggestions(eventSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchSuggestions(searchTerm);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, fetchSuggestions]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = () => {
    setShowSuggestions(false);
    navigate(`/?name=${searchTerm}`);
  };

  const handleSuggestionClick = (suggestion) => {
    // Khi user bấm vào gợi ý, lưu tên để hiển thị tạm thời
    const eventName = suggestion.name;
    setSearchTerm(eventName);
    setShowSuggestions(false);

    // Đảm bảo có typeEvent, nếu không có thì mặc định là 0
    const typeEvent = suggestion.typeEvent !== undefined ? suggestion.typeEvent : 0;

    // Điều hướng đến trang chi tiết
    navigate(`/event/${suggestion._id}-${typeEvent}`);

    // Xóa nội dung tìm kiếm sau khi đã chuyển hướng
    setTimeout(() => {
      setSearchTerm("");
    }, 100);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const getCurrentUser = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    };
    getCurrentUser();
  }, []);

  return (
    <Box
      bgcolor={"#fff"}
      height={76}
      display={"flex"}
      alignItems={"center"}
      paddingX={"32px"}
      justifyContent={"space-between"}
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={999}
    >
      <Box display={"flex"} alignItems={"center"} gap={"32px"}>
        <Box
          component={"img"}
          src="/img/LogoHCMUTE.jpg"
          height={44}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <ClickAwayListener onClickAway={handleClickAway}>
          <WrapInput>
            <SearchOutlinedIcon
              sx={{ color: "rgb(42, 45, 52)" }}
              onClick={handleSearch}
            />
            <InputCustom
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() =>
                searchTerm.trim() !== "" && setShowSuggestions(true)
              }
            />
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionsContainer>
                <List>
                  {suggestions.map((suggestion) => (
                    <SuggestionItem
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Typography variant="body2">{suggestion.name}</Typography>
                    </SuggestionItem>
                  ))}
                </List>
              </SuggestionsContainer>
            )}
          </WrapInput>
        </ClickAwayListener>      </Box>      <Box display={"flex"} alignItems={"center"} gap={"32px"}>
         {user?.role === 0 && (
  <CreateEvent onClick={() => navigate(`/account/${user?._id}`)}>
    Thông tin tài khoản
  </CreateEvent>
)}

{user?.role === 1 && (
  <CreateEvent onClick={() => navigate("/admin-manager-ticket")}>
    Quản lý Website 
  </CreateEvent>
)}

{user?.role === 2 && (
  <CreateEvent onClick={() => navigate("/my-revenue")}>
    Tạo sự kiện và Cài đặt
  </CreateEvent>
)}
        <DvrOutlinedIcon
          sx={{
            color: "rgb(42, 45, 52)",
            cursor: "pointer",
            "&:hover": {
              color: "rgb(35, 168, 100)",
            },
          }}
        />
        {user?.name ? (
          <Box display={"flex"} alignItems={"center"} gap={4}>
            <Typography
              fontSize={16}
              fontWeight={500}
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              {user?.name}
            </Typography>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"} gap={"8px"}>
            <Typography
              fontSize={16}
              fontWeight={500}
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              Đăng nhập
            </Typography>
            <Box width={"1px"} height={"16px"} bgcolor={"rgb(42, 45, 52)"} />
            <Typography
              fontSize={16}
              fontWeight={500}
              onClick={() => navigate("/sign-up")}
              sx={{ cursor: "pointer" }}
            >
              Đăng ký
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Header;
