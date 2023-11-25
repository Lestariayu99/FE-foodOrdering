import React from 'react';

const Home = () => {
  return (
    <div className="section bg-dark text-white" id="home">
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <h1 className="display-4 text-danger">NEW PRODUCT</h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, quaerat? 
              Doloribus nobis necessitatibus eligendi eius alias illum vero officiis minus magni consequuntur delectus magnam eaque, 
              provident molestiae omnis. 
              Doloribus, temporibus!
            </p>
            <br />
            <a href="#" className="btn btn-outline-light" style={{ marginRight: '50%', marginBottom: '50px' }}>
              Get Started
            </a>
          </div>

          <div className="col-md-6">
            <img
              src="/img/bg.jpg"
              alt=""
              style={{ width: '120%', height: '200%' }}
              className="mt-4 mb-4 p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
