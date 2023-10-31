import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { getLocation } from '../../app/api/address';
import PropTypes from 'prop-types';

export default function CustomFormSelect({location, code, onChange, isInvalid, value}) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getLocation(location, code)
    .then(({data}) => setLocations(data))
  }, [location, code]);


return (
    <Form.Control
      as="select"
      onChange={e => onChange(e.target.value)}
      isInvalid={isInvalid}
      value={value}
    >
      <option value="">Pilih lokasi...</option>
      {locations.map((location, i) => (
        <option value={JSON.stringify({ label: location.nama, value: location.kode })} key={i}>
          {location.nama}
        </option>
      ))}
       
    </Form.Control>
  );
}

CustomFormSelect.defaultProps = {
  location: 'provinsi',
  isInvalid: false,
  value: ''
}

CustomFormSelect.propTypes = {
  location: PropTypes.oneOf(['provinsi', 'kabupaten', 'kecamatan', 'kelurahan']).isRequired,
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
}


























