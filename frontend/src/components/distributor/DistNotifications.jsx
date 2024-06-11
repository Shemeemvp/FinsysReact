import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../functions/config";
import { Link } from "react-router-dom";
import DistributorBase from "./DistributorBase";
import Cookies from 'js-cookie';

function DistNotifications() {
  const ID = Cookies.get('Login_id');
  const [noti, setNoti] = useState(false);
  const [notification, setNotification] = useState([]);
  const fetchNotifications = () => {
    axios
      .get(`${config.base_url}/fetch_distributor_notifications/${ID}/`)
      .then((res) => {
        console.log("NOTIFICATIONSLIST", res);
        if (res.data.status) {
          var ntfs = res.data.notifications;
          setNoti(res.data.status);
          setNotification([]);
          ntfs.map((i) => {
            var obj = {
                id: i.id,
              title: i.Title,
              desc: i.Discription,
              date: i.date_created,
              time: i.time,
            };
            setNotification((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  function formatTimeInput(timeString) {
    let [hours, minutes] = timeString.split(":").slice(0, 2);

    hours = parseInt(hours, 10);

    let meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Handle midnight (0) and noon (12)

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    return `${hours}:${minutes} ${meridiem}`;
  }
  return (
    <>
      <DistributorBase />
      <div
        class="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div class="container-fluid">
          {noti ? (
            <>
              {notification &&
                notification.map((i) => (
                  <div class="row p-3">
                    <div class="col-md-12">
                      <div class="card radius-15 p-3">
                        <div class="card-body">
                          <div class="card-title">
                            <h6 class="card-title mb-9 fw-semibold">
                              <b>{i.title}</b>
                            </h6>
                            <hr />
                          </div>
                          <h6 class="msg-name pl-5">
                            {i.desc}
                            <span
                              class="msg-time float-right"
                              style={{ color: "gray" }}
                            >
                              {i.date} {formatTimeInput(i.time)}
                            </span>
                          </h6>
                          {i.title != "Payment Terms Alert" ? (
                            <div class="row mt-5">
                              <div class="col-5"></div>
                              <div class="col-4"></div>
                              <div class="col-3">
                                <Link
                                  class="btn btn-info btn-sm"
                                  to={`/dnotification_overview/${i.id}/`}
                                  style={{width: '90px', height:'30px'}}
                                >
                                  View More
                                </Link>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <div class="row p-3">
              <div class="col-md-12">
                <div class="card radius-15 p-3">
                  <div class="card-body">
                    <div class="card-title">
                      <h5 class="card-title mb-9 fw-semibold text-center">
                        <b> No New Notifications</b>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DistNotifications;
