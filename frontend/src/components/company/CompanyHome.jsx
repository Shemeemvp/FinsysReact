import React from "react";
import FinBase from "./FinBase";

function CompanyHome() {
  return (
    <>
    <FinBase />
    <div className="page-content" style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}>
      <div className="card radius-15">
        <div className="card-body">
          <div className="card-title">
            <form method="post">
              <div className="row w-100">
                <div className="col"></div>
                <div className="col">
                  <center className="w-100">
                    {/* {% if  data.User_Type == 'Company' %} */}
                    <label style={{textAlign: "center", fontSize: "30px",textTransform: "uppercase"}}>
                      <b>{"COMPANY NAME"}</b>
                    </label>
                    {/* {% else %}    
                                            <label style={{textAlign: "center", fontSize: "30px",textTransform: "uppercase"}}><b>{{ com.company_id.Company_name }}</b></label>
                                        {% endif %}     */}
                  </center>
                </div>
                <div className="col"></div>
              </div>
            </form>
            <hr />
          </div>
        </div>
      </div>
      {/* <!-- <div className="card-body">
            <div className="alert alert-primary alert-dismissible fade show" role="alert">A simple primary alert with <a
                    href="#" className="alert-link">an example link</a>. Give it a click if you like.
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="alert alert-primary alert-dismissible fade show" role="alert">A simple primary alert with <a
                    href="#" className="alert-link">an example link</a>. Give it a click if you like.
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div> --> */}
      <div className="card-deck flex-column flex-lg-row">
        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">PROFIT AND LOSS </h5>
            </div>
            <hr />
            <br />
            <h6 id="pf"></h6>
            <br />
            <canvas id="pie-chart"></canvas>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">EXPENSES: &#8377 {'EXP'} </h5>
            </div>
            <hr />
            <div id="chartexp"></div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">BANK ACCOUNTS </h5>
            </div>
            <hr />
            {/* <!-- <div className="row-cols-md">
                        <div className="col-md">
                            <h6><b>Bank Account</b></h6>
                            <label>Bank balance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$0</label><br>
                            <label>In Finsys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$0</label>

                        </div>
                    </div>
                    <hr>
                    <div className="row-md">
                        <div className="col-md">
                            <h6><b>Bank Account</b></h6>
                            <label>Bank balance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$0</label><br>
                            <label>In Finsys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$0</label>


                        </div>
                    </div>
                    <hr> --> */}
          </div>
        </div>
      </div>

      <div className="card-deck flex-column flex-lg-row">
        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">INCOME: &#8377 {'inc'} </h5>
            </div>
            <hr />
            <div id="chartinc"></div>
          </div>
        </div>
        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">INVOICE </h5>
            </div>
            <hr />
            <br />
            <h6>UNPAID:&#8377 {'up'}</h6>
            <h6>PAID:&#8377 {'p'}</h6>

            <br />
            <canvas id="pie-chart5"></canvas>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <h5 className="mb-0">SALES: &#8377 {"s"} </h5>
            </div>
            <hr />

            <canvas id="pie-chart12"></canvas>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CompanyHome;
