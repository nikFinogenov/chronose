import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { CountryDropdown } from 'react-country-region-selector';

const customRender = (props) => {
  const {
    options,
    value,
    disabled,
    onChange,
    onBlur,
    customProps,
    ...selectProps
  } = props;

  return (
    <Select
      {...selectProps}
      options={options}
      isDisabled={disabled}
      isSearchable={true}
      isClearable={true}
      value={customProps.reactSelectValue}
      onChange={customProps.onChange}
    />
  );
};

const ReactSelect = ({ onSelectionChange }) => {
  const [country, setCountry] = useState(undefined);
  //   const [region, setRegion] = useState(undefined);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data && data.country_name) {
          setCountry({ label: data.country_name, value: data.country_name });
        }
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, []);
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(country);
    }
  }, [country, onSelectionChange]);

  return (
    <>
      <div style={{ width: 200, display: 'inline-block', marginRight: 8 }}>
        <CountryDropdown
          value={country ? country.value : ''}
          className="country"
          name="country-field"
          customRender={customRender}
          customProps={{
            reactSelectValue: country,
            classNamePrefix: 'country-',
            onChange: (value) => {
              setCountry(value || undefined);
              //   setRegion(null);
            },
          }}
        />
      </div>
      {/* <div style={{ width: 200, display: 'inline-block' }}>
        <RegionDropdown
          country={country ? country.value : ''}
          value={region ? region.value : null}
          className="region"
          name="region-field"
          customRender={customRender}
          customProps={{
            reactSelectValue: region,
            classNamePrefix: 'region-',
            onChange: (value) => {
              setRegion(value || undefined);
            },
          }}
        />
      </div> */}
    </>
  );
};

export default ReactSelect;
