import React, { useEffect, useState } from "react";
import EventLayout from "../components/layout/EventLayout";
import InfoEvent from "../components/screens/detail-event/InfoEvent";
import MainDetailContent from "../components/screens/detail-event/MainDetailContent";
import { useParams } from "react-router-dom";
import { getListEvent, getListEventById } from "../utils/api/event";

function DetailEvent() {
  const { id } = useParams();
  const [detailEvent, setDetailEvent] = useState({});
  const [listRecommend, setListRecommend] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const idParts = id?.split("-");
        const eventId = idParts[0];
        // Nếu không có typeEvent trong URL, sử dụng giá trị mặc định là 0
        const typeEvent = idParts.length > 1 ? idParts[1] : "0";

        const res = await getListEventById(eventId);

        if (res && res.data) {
          setDetailEvent(res.data);

          // Lấy typeEvent từ event hoặc sử dụng giá trị từ URL
          const eventTypeEvent = res.data.typeEvent !== undefined ? res.data.typeEvent : Number(typeEvent);

          try {
            const res1 = await getListEvent({
              permission: 1,
              isApprove: 1,
              typeEvent: eventTypeEvent,
            });

            // Store the typeEvent of the viewed event in local storage
            localStorage.setItem("lastViewedTypeEvent", eventTypeEvent);

            if (res1 && res1.data) {
              setListRecommend(res1.data?.filter((e) => e._id !== res.data._id));
            }
          } catch (recommError) {
            console.error("Error fetching recommendations:", recommError);
            setListRecommend([]);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    getData();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <EventLayout>
      <InfoEvent event={detailEvent} />
      <MainDetailContent event={detailEvent} recommend={listRecommend} />
    </EventLayout>
  );
}

export default DetailEvent;
