import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';  
import { createAddress } from '../../app/api/address';
import { useHistory } from 'react-router';

// Membuat skema validasi menggunakan Yup
const schema = yup.object().shape({
  nama: yup.string().required('Nama alamat harus diisi'),
  detail: yup.string().required('Detail alamat harus diisi'),
  provinsi: yup.string().required('Provinsi belum dipilih').nullable(),
  kabupaten: yup.string().required('Kabupaten belum dipilih').nullable(),
  kecamatan: yup.string().required('Kecamatan belum dipilih').nullable(),
  kelurahan: yup.string().required('Kelurahan belum dipilih').nullable(),
  
}).required();

export default function AddAddress() {
  const { register, formState: { errors }, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });
  const [status, setStatus] = useState('idle');
  const history = useHistory();
  const allField = watch();

// State untuk data provinsi, kabupaten, kecamatan, dan kelurahan
  const [provinces, setProvinces] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState(null);
  const [dataKabupaten, setDataKabupaten] = useState(null);
  const [dataKecamatan, setDataKecamatan] = useState(null);
  const [dataKelurahan, setDataKelurahan] = useState(null);

  // Mengambil data provinsi menggunakan axios
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        
        if (response.status === 200) {
          setProvinces(response.data);
        } else {
          console.error('Gagal mengambil data provinsi');
        }
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Mengambil fungsi untuk mengambil data kabupaten, kecamatan, kelurahan
  const fetchKabupatenData = async (provinceId) => {
    try {
      const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      if (response.status === 200) {
        setKabupaten(response.data);
      } else {
        console.error('Gagal mengambil data kabupaten');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  const fetchKecamatanData = async (regencyId) => {
    try {
      const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
      if (response.status === 200) {
        setKecamatan(response.data);
      } else {
        console.error('Gagal mengambil data kecamatan');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  const fetchKelurahanData = async (districtId) => {
    try {
      const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
      if (response.status === 200) {
        setKelurahan(response.data);
      } else {
        console.error('Gagal mengambil data kelurahan');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

// Fungsi yang dipanggil saat formulir disubmit
  const onSubmit = async (formData) => {
    if (dataProvinsi) {
      const payload = {
        nama: formData.nama,
        detail: formData.detail,
        provinsi: dataProvinsi.provinsi,
        kabupaten: dataKabupaten.kabupaten,
        kecamatan: dataKecamatan.kecamatan,
        kelurahan: dataKelurahan.kelurahan,
      }

      setStatus('process');
      try {
        const response = await createAddress(payload);
        if (!response.data.error) {
          setStatus('success');
          history.push('/account/address');
        }
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setStatus('error');
      }
    } else {
      console.error('Data Provinsi belum diisi');
    }
  }

  // Mengatur ulang nilai field terkait ketika pilihan provinsi, kabupaten, atau kecamatan berubah
  useEffect(() => {
    setValue('kabupaten', null);
    setValue('kecamatan', null);
    setValue('kelurahan', null);
  }, [allField.provinsi, setValue]);

  useEffect(() => {
    setValue('kecamatan', null);
    setValue('kelurahan', null);
  }, [allField.kabupaten, setValue]);

  useEffect(() => {
    setValue('kelurahan', null);
  }, [allField.kecamatan, setValue]);

  return (
    
    // Formulir penambahan alamat
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={6}>
          <Form.Group controlId="nama">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              name="nama"
              placeholder="Masukan nama alamat"
              {...register('nama')}
              isInvalid={errors.nama}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nama?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="detail">
            <Form.Label>Detail Alamat</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukan detail alamat"
              as="textarea"
              isInvalid={errors.detail}
              rows={9}
              {...register('detail')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.detail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="provinsi">
            <Form.Label>Provinsi</Form.Label>
            <Form.Control
              as="select"
              name="provinsi"
              {...register('provinsi')}
              isInvalid={errors.provinsi}
              onChange={(e) => {
                const selectedProvinceId = e.target.value;
                fetchKabupatenData(selectedProvinceId);
                setValue('kabupaten', '');
                setDataProvinsi({
                  ...dataProvinsi,
                  provinsi: e.target.options[e.target.selectedIndex].dataset.provinsi
                });
              }}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((province) => (
                <option key={province.name} data-provinsi={province.name} value={province.id}>
                  {province.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.provinsi?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="kabupaten">
            <Form.Label>Kabupaten</Form.Label>
            <Form.Control
              as="select"
              name="kabupaten"
              {...register('kabupaten')}
              isInvalid={errors.kabupaten}
              onChange={(e) => {
                const selectedRegencyId = e.target.value;
                fetchKecamatanData(selectedRegencyId);
                setValue('kecamatan', '');
                setDataKabupaten({
                  ...dataKabupaten,
                  kabupaten: e.target.options[e.target.selectedIndex].dataset.kabupaten
                });
              }}
            >
              <option value="">Pilih Kabupaten</option>
              {kabupaten.map((regency) => (
                <option key={regency.name} data-kabupaten={regency.name} value={regency.id}>
                  {regency.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.kabupaten?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="kecamatan">
            <Form.Label>Kecamatan</Form.Label>
            <Form.Control
              as="select"
              name="kecamatan"
              {...register('kecamatan')}
              isInvalid={errors.kecamatan}
              onChange={(e) => {
                const selectedDistrictId = e.target.value;
                fetchKelurahanData(selectedDistrictId);
                setValue('kelurahan', '');
                setDataKecamatan({
                  ...dataKecamatan,
                  kecamatan: e.target.options[e.target.selectedIndex].dataset.kecamatan
                });
              }}
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatan.map((district) => (
                <option key={district.name} data-kecamatan={district.name} value={district.id}>
                  {district.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.kecamatan?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="kelurahan">
            <Form.Label>Kelurahan</Form.Label>
            <Form.Control
              as="select"
              name="kelurahan"
              {...register('kelurahan')}
              isInvalid={errors.kelurahan}
              onChange={(e) => {
                setDataKelurahan({
                  ...dataKelurahan,
                  kelurahan: e.target.options[e.target.selectedIndex].dataset.kelurahan
                });
              }}
            >
              <option value="">Pilih Kelurahan</option>
              {kelurahan.map((village) => (
                <option key={village.name} data-kelurahan={village.name} value={village.id}>
                  {village.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.kelurahan?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid gap-2">
        <Button type="submit" variant="primary" disabled={status === 'process'}>
          {status === 'process' ? 'Memproses...' : 'Simpan'}
        </Button>
      </div>
    </Form>
  );
}