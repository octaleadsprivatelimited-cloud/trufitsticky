import React from "react";

const Serve = () => {
  return (
    <>
        <div className="ser__section">
            <div className="ser__container">
                <div className="ser__content">
                    <div className="ser__head">
                        <h2>Who We <span>Serve</span></h2>
                    </div>
                    <div className="ser__card-layout">
                        <div className="ser__card">
                            <h3 className="ser__card-title">Busy Executives</h3>
                            <p className="ser__card-desc">Deadlines, meetings, and travel schedules don't leave much time for the gym. We build fitness routines that work around your packed calendar, not against it.</p>
                        </div>
                        <div className="ser__card">
                            <h3 className="ser__card-title">Working Parents</h3>
                            <p className="ser__card-desc">Juggling career and family leaves you exhausted. Our coaches understand your time constraints and create sustainable plans that fit your real life, not an idealized version of it.</p>
                        </div>
                        <div className="ser__card">
                            <h3 className="ser__card-title">Desk Warriors</h3>
                            <p className="ser__card-desc">Years of sitting have taken their toll on your body and energy. We specialize in helping sedentary professionals rebuild strength, mobility, and confidence, starting exactly where you are.</p>
                        </div>
                        <div className="ser__card">
                            <h3 className="ser__card-title">Career Climbers</h3>
                            <p className="ser__card-desc">Ambitious and driven, but your health has taken a backseat to your goals. We help you use fitness as fuel for peak performance, not another thing that drains your energy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Serve;
