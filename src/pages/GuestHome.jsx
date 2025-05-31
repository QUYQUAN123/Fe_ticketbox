import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Swipper from "../components/screens/guest-home/Swipper";
import ListEvent from "../components/screens/guest-home/ListEvent";
import { getListEvent } from "../utils/api/event";
import { getTicketStats } from "../utils/api/ticket";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Recommendations from "../components/common/Recommendations";
import Pagination from "@mui/material/Pagination";

function GuestHome() {
  const [listEvent, setListEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotEvents, setHotEvents] = useState([]);
  const [searchParams] = useSearchParams();
  const lastViewedTypeEvent = localStorage.getItem("lastViewedTypeEvent");


const [page, setPage] = useState(1);
const limit = 8;


const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;
const currentPageData = listEvent.slice(startIndex, endIndex);


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const showHotEvents = searchParams.get("hot") === "true";

        const queryParams = {
          permission: 1,
          isApprove: 1,
        };
        const nameParam = searchParams.get("name");
        if (nameParam) {
          queryParams.name = nameParam;
        }

        // Thêm tham số typeEvent nếu có
        const typeEventParam = searchParams.get("typeEvent");
        if (typeEventParam) {
          queryParams.typeEvent = typeEventParam;
        }

        // Thêm tham số city nếu có
        const cityParam = searchParams.get("city");
        if (cityParam) {
          queryParams.city = cityParam;
        }

        // Nếu đang ở trang Hot Events, lấy dữ liệu từ API thống kê vé
        if (showHotEvents) {
          const statsResponse = await getTicketStats();
          if (
            statsResponse &&
            statsResponse.data &&
            statsResponse.data.topSelling
          ) {
            setHotEvents(statsResponse.data.topSelling);
            setListEvent(statsResponse.data.topSelling);
          } else {
            setListEvent([]);
          }
        } else {
          // Gọi API sự kiện thông thường
          const response = await getListEvent(queryParams);
          setListEvent(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setListEvent([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [searchParams]);

  const renderPageTitle = () => {
    const isHotEvents = searchParams.get("hot") === "true";
    const typeEventParam = searchParams.get("typeEvent");
    const cityParam = searchParams.get("city");
    const nameParam = searchParams.get("name");

    if (isHotEvents) {
      return "Sự Kiện Bán Chạy Nhất";
    }

    let title = "Tất Cả Sự Kiện";

    if (typeEventParam) {
      switch (typeEventParam) {
        case "1":
          title = "Sự Kiện Âm Nhạc";
          break;
        case "2":
          title = "Sự Kiện Văn Hóa Nghệ Thuật";
          break;
        case "3":
          title = "Sự Kiện Sân khấu";
          break;
        case "4":
          title = "Sự Kiện Ngoài trời";
          break;
        case "5":
          title = "Sự Kiện Tham Quan";
          break;
        case "6":
          title = "Sự Kiện Khóa Học";
          break;
        case "7":
          title = "Sự Kiện Thể Thao";
          break;
        default:
          title = "Tất Cả Sự Kiện";
      }
    } else if (cityParam) {
      title =
        cityParam === "hcm" ? "Sự Kiện Tại Hồ Chí Minh" : "Sự Kiện Tại Hà Nội";
    }

    if (nameParam) {
      title += ` - Tìm Kiếm "${nameParam}"`;
    }

    return title;
  };

  const renderHotEventsBanner = () => {
    if (searchParams.get("hot") === "true") {
      return (
        <Box
          sx={{
            backgroundColor: "#ffe8e6",
            padding: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <LocalFireDepartmentIcon
            sx={{ color: "#ff4d4f", fontSize: 32, marginRight: 2 }}
          />
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ color: "#ff4d4f", fontWeight: "bold" }}
            >
              Sự Kiện Bán Chạy Nhất
            </Typography>
            <Typography variant="body2" sx={{ color: "#595959" }}>
              Danh sách những sự kiện được đặt vé nhiều nhất. Nhanh tay đặt vé
              trước khi hết!
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      {searchParams.get("hot") !== "true" && <Swipper />}

      <Box my={4}>
        {renderHotEventsBanner()}

        <Recommendations typeEvent={lastViewedTypeEvent} />
        <Typography variant="h4" component="h1" gutterBottom>
          {renderPageTitle()}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {loading
            ? "Đang tải sự kiện..."
            : `Tìm thấy ${listEvent.length} sự kiện`}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      <ListEvent
  data={currentPageData}
  isHotEvents={searchParams.get("hot") === "true"}
/>

      {listEvent.length > limit && (
      <Box display="flex" justifyContent="center" my={4}>
        <Pagination
          count={Math.ceil(listEvent.length / limit)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    )}

    </MainLayout>
  );
}

export default GuestHome;
