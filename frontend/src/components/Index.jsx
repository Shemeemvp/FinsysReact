import React from "react";
import '../styles/Index.css';
import { Link } from "react-router-dom";

function Index() {

  function handleToggle() {
    const toggleButton = document.getElementById("navbarToggleBtn");
    const navbar = document.getElementById("navbar");
    if (navbar.classList.contains("navbar-mobile")) {
      navbar.classList.remove("navbar-mobile");
    } else {
      navbar.classList.add("navbar-mobile");
    }

    if (toggleButton.classList.contains("bi-list")) {
      toggleButton.classList.remove("bi-list");
      toggleButton.classList.add("bi-x");
    } else {
      toggleButton.classList.remove("bi-x");
      toggleButton.classList.add("bi-list");
    }
  }
  return (
    <>
      <header id="header">
        <div class="container d-flex align-items-center justify-content-between">
          <div class="logo">
            <h1>
              <a href="#">
                FinsYs<span>.</span>
              </a>
            </h1>
          </div>

          <nav id="navbar" class="navbar">
            <ul>
              <li>
                <a class="nav-link scrollto active" href="#hero">
                  Home
                </a>
              </li>
              <li>
                <a class="nav-link scrollto" href="#about">
                  About Us
                </a>
              </li>
              <li>
                <a class="nav-link scrollto" href="#services">
                  Services
                </a>
              </li>
              <li>
                <a class="nav-link scrollto" href="#contact">
                  Contact Us
                </a>
              </li>
              <li class="dropdown">
                <a href="#" class="nav-link scrollto">
                  Sign Up <i class="bi bi-chevron-down"></i>
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <Link to="/distributor_registration">
                      Distributor Registration
                    </Link>
                  </li>
                  <li>
                    <Link to="/company_registration">
                      Company Registration
                    </Link>
                  </li>
                  <li>
                    <Link to="/staff_registration">
                      Staff Registration
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <a class="getstarted scrollto" href="#about">
                  Get Started
                </a>
              </li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle" onClick={handleToggle} id="navbarToggleBtn"></i>
          </nav>
        </div>
      </header>

      <section id="hero" style={{paddingBottom: "50px", paddingTop: "50px"}}>
        <div class="container">
          <div class="row d-flex align-items-center">
            <div
              class=" col-lg-6 py-5 py-lg-0 order-2 order-lg-1"
              data-aos="fade-right"
            >
              <h1>Your new ERP experience with FinsYs</h1>
              <h2>
                “The cost of control obviously should not exceed the cost of
                inaccuracies.” ERP: Making It Happen,{" "}
              </h2>
              <a href="#about" class="btn-get-started scrollto">
                Get Started
              </a>
            </div>
            <div
              class="col-lg-6 order-1 order-lg-2 hero-img"
              data-aos="fade-left"
            >
              <img
                src="../static/assets/img/rrr.png"
                class="img-fluid"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <main id="main">
        <section id="about" class="about section-bg">
          <div class="container">
            <div class="section-title">
              <h2 data-aos="fade-in">About Us</h2>
            </div>
          </div>
        </section>

        <section id="services" class="services section-bg">
          <div class="container">
            <div class="section-title">
              <h2 data-aos="fade-in">Services</h2>
              <p data-aos="fade-in">
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div class="row">
              <div
                class="col-md-6 d-flex align-items-stretch"
                data-aos="fade-right"
              >
                <div class="card">
                  <div class="card-img">
                    <img src="../static/assets/img/services-1.jpg" alt="..." />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="">Temporibus laudantium</a>
                    </h5>
                    <p class="card-text">
                      Lorem ipsum dolor sit amet, consectetur elit, sed do
                      eiusmod tempor ut labore et dolore magna aliqua. Ut enim
                      ad minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat
                    </p>
                    <div class="read-more">
                      <a href="#">
                        <i class="bi bi-arrow-right"></i> Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-md-6 d-flex align-items-stretch"
                data-aos="fade-left"
              >
                <div class="card">
                  <div class="card-img">
                    <img src="../static/assets/img/services-2.jpg" alt="..." />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="">Aperiores voluptates</a>
                    </h5>
                    <p class="card-text">
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem doloremque laudantium, totam rem aperiam, eaque
                      ipsa quae ab illo inventore veritatis et quasi architecto
                      beatae vitae dicta sunt explicabo
                    </p>
                    <div class="read-more">
                      <a href="#">
                        <i class="bi bi-arrow-right"></i> Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-md-6 d-flex align-items-stretch"
                data-aos="fade-right"
              >
                <div class="card">
                  <div class="card-img">
                    <img src="../static/assets/img/services-3.jpg" alt="..." />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="">Veritatis natus nisi</a>
                    </h5>
                    <p class="card-text">
                      Nemo enim ipsam voluptatem quia voluptas sit aut odit aut
                      fugit, sed quia magni dolores eos qui ratione voluptatem
                      sequi nesciunt Neque porro quisquam est, qui dolorem ipsum
                      quia dolor sit amet
                    </p>
                    <div class="read-more">
                      <a href="#">
                        <i class="bi bi-arrow-right"></i> Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-md-6 d-flex align-items-stretch"
                data-aos="fade-left"
              >
                <div class="card">
                  <div class="card-img">
                    <img src="../static/assets/img/services-4.jpg" alt="..." />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">
                      <a href="">Aliquam veritatis</a>
                    </h5>
                    <p class="card-text">
                      Nostrum eum sed et autem dolorum perspiciatis. Magni porro
                      quisquam laudantium voluptatem. In molestiae earum ab sit
                      esse voluptatem. Eos ipsam cumque ipsum officiis qui nihil
                      aut incidunt aut
                    </p>
                    <div class="read-more">
                      <a href="#">
                        <i class="bi bi-arrow-right"></i> Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" class="features section-bg">
          <div class="container">
            <div class="section-title">
              <h2 data-aos="fade-in">Features</h2>
              <p data-aos="fade-in">
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div class="row content">
              <div class="col-md-5" data-aos="fade-right">
                <img
                  src="../static/assets/img/features-1.svg"
                  class="img-fluid"
                  alt=""
                />
              </div>
              <div class="col-md-7 pt-4" data-aos="fade-left">
                <h3>
                  Voluptatem dignissimos provident quasi corporis voluptates sit
                  assumenda.
                </h3>
                <p class="font-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <ul>
                  <li>
                    <i class="bi bi-check"></i> Ullamco laboris nisi ut aliquip
                    ex ea commodo consequat.
                  </li>
                  <li>
                    <i class="bi bi-check"></i> Duis aute irure dolor in
                    reprehenderit in voluptate velit.
                  </li>
                </ul>
              </div>
            </div>

            <div class="row content">
              <div class="col-md-5 order-1 order-md-2" data-aos="fade-left">
                <img
                  src="../static/assets/img/features-2.svg"
                  class="img-fluid"
                  alt=""
                />
              </div>
              <div
                class="col-md-7 pt-5 order-2 order-md-1"
                data-aos="fade-right"
              >
                <h3>Corporis temporibus maiores provident</h3>
                <p class="font-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum
                </p>
              </div>
            </div>

            <div class="row content">
              <div class="col-md-5" data-aos="fade-right">
                <img
                  src="../static/assets/img/features-3.svg"
                  class="img-fluid"
                  alt=""
                />
              </div>
              <div class="col-md-7 pt-5" data-aos="fade-left">
                <h3>
                  Sunt consequatur ad ut est nulla consectetur reiciendis animi
                  voluptas
                </h3>
                <p>
                  Cupiditate placeat cupiditate placeat est ipsam culpa.
                  Delectus quia minima quod. Sunt saepe odit aut quia voluptatem
                  hic voluptas dolor doloremque.
                </p>
                <ul>
                  <li>
                    <i class="bi bi-check"></i> Ullamco laboris nisi ut aliquip
                    ex ea commodo consequat.
                  </li>
                  <li>
                    <i class="bi bi-check"></i> Duis aute irure dolor in
                    reprehenderit in voluptate velit.
                  </li>
                  <li>
                    <i class="bi bi-check"></i> Facilis ut et voluptatem
                    aperiam. Autem soluta ad fugiat.
                  </li>
                </ul>
              </div>
            </div>

            <div class="row content">
              <div class="col-md-5 order-1 order-md-2" data-aos="fade-left">
                <img
                  src="../static/assets/img/features-4.svg"
                  class="img-fluid"
                  alt=""
                />
              </div>
              <div
                class="col-md-7 pt-5 order-2 order-md-1"
                data-aos="fade-right"
              >
                <h3>
                  Quas et necessitatibus eaque impedit ipsum animi consequatur
                  incidunt in
                </h3>
                <p class="font-italic">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" class="contact section-bg">
          <div class="container" data-aos="fade-up">
            <div class="section-title">
              <h2>Contact Us</h2>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-md-12">
                    <div class="info-box" data-aos="fade-up">
                      <i class="bx bx-map"></i>
                      <h3>Our Address</h3>
                      <p>Carnival 1, Infopark, Kakkanad</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div
                      class="info-box mt-4"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <i class="bx bx-envelope"></i>
                      <h3>Email Us</h3>
                      <p>
                        finsys@gmail.com
                        <br />
                        infox@gmail.com
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div
                      class="info-box mt-4"
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      <i class="bx bx-phone-call"></i>
                      <h3>Call Us</h3>
                      <p>
                        +91 9995805992
                        <br />
                        +91 9995805299
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 mt-4 mt-lg-0">
                <div class="mapouter" style={{border: "1"}}>
                  <div class="gmap_canvas">
                    <iframe
                      class="gmap_iframe"
                      width="100%"
                      frameborder="0"
                      scrolling="no"
                      marginheight="0"
                      marginwidth="0"
                      src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=infox&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                    <a href="https://www.embedmymap.com/">Embed My Map</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div class="container">
          <div class="container text-center text-md-left ">
            <div class="row mt">
              <div
                class="col-md-12 col-lg-12 col-xl-12 mx-auto mb-4"
                style={{marginTop:"6%"}}
              >
                <h1 style={{fontSize: "150%",color: "white"}}>
                  Contact information
                </h1>
                <p style={{color:"white"}}>
                  Indian Address:
                  <br />
                  Blue Mount Tower
                  <br />1<sup>st</sup> floor Kakkanad Kochi
                  <br />
                  Kerala
                  <br />
                  Pin :6820481
                  <br />
                  phone: +91 9171181277
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a
        href="#"
        class="back-to-top d-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

export default Index;
