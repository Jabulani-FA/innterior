import React, { useEffect, useState } from "react";

const timeCapsule = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

const ComingSoon = () => {
  const [timeRemainder, settimeRemainder] = useState(timeCapsule);
  const { days, hours, minutes, seconds } = timeRemainder;
  useEffect(() => {
    const releaseDate = new Date("July 1, 2025 12:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeDistance = releaseDate - now;
      if (timeDistance <= 0) {
        clearInterval(interval);
        settimeRemainder(timeCapsule);
        return;
      }
      const days = Math.floor(timeDistance / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (timeDistance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor(
        (timeDistance % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((timeDistance % (60 * 1000)) / 1000);
      settimeRemainder({
        days: String(days).padStart(2, 0),
        hours: String(hours).padStart(2, 0),
        minutes: String(minutes).padStart(2, 0),
        seconds: String(seconds).padStart(2, 0),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coming-soon container">
      <div className="row">
        <div className="col-md-4">
          <img
            src="/Innterior.png"
            width={150}
            className="otherinnterior"
            alt="innterior designs - build it, see it, love it"
          />
          <div className="ps-3">
            <h5>
              Your Home,
              <br />
              Your Rules,
              <br />
              Your Vision,
              <br />
              In 3D.
            </h5>
            <h3 className="mt-4">
              Launching <br />
              Soon.
            </h3>
            <img
              className="comingSoon-object"
              src="/pexels-medhat-ayad-122846-447592-removebg-preview.png"
              width={150}
              alt="comingSoon-object"
            />
          </div>
        </div>
        <div className="col-md-8 col-sm-12">
          <div className="countdown-container">
            <div>
              <h3>Launching in...</h3>
            </div>
            <div>
              <div className="countdown-unit-card">
                <p>{days}d</p>
              </div>
              <div className="countdown-unit-card">
                <p>{hours}h</p>
              </div>
              <div className="countdown-unit-card">
                <p>{minutes}m</p>
              </div>
              <div className="countdown-unit-card">
                <p>{seconds}s</p>
              </div>
            </div>
          </div>
          <h4 className="text-bottom playfair-display">
            Design it.<span className="gold">See it. </span> Love it.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
