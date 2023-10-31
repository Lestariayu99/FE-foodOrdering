import React from 'react';

const Footer = () => {
 
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container text-center">
        <div className="row">
          <div className="col-md-6">
            <h4>Info Kontak</h4>
            <p>Jl. Dr. Cipta Mangunkusumo no. 66</p>
            <p>Email: maroonfood@gmail.com</p>
            <p>Telp: (123) 123 123</p>
          </div>
          <div className="col-md-6">
            <h4>Tautan</h4>
            <ul className="list-unstyled">
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Produk</a></li>
              <li><a href="#">Kontak</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
