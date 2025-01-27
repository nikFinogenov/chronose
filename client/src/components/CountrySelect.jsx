import React, { useMemo, useEffect, useState } from 'react';
import Select from 'react-select';
import { CountryDropdown } from 'react-country-region-selector';

const renameCountry = (name) => {
  const renamedCountries = {
    "Korea, Republic of": "South Korea",
    "Korea, Democratic People's Republic of": "North Korea",
    "Macedonia, Republic of": "Macedonia",
    "Micronesia, Federated States of": "Micronesia",
    "Russian Federation":"Russia",
    "Saint Barthélemy":"St. Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha":"St. Helena",
    "Saint Kitts and Nevis":"St. Kitts and Nevis",
    "Saint Lucia":"St. Lucia",
    "Saint Martin":"St. Martin",
    "Saint Pierre and Miquelon":"St. Pierre and Miquelon",
    "Saint Vincent and the Grenadines":"St. Vincent and Grenadines",
    "Sint Maarten (Dutch part)":"Sint Maarten",
    "Syrian Arab Republic":"Syria",
    "Tanzania, United Republic of":"Tanzania",
    "Virgin Islands, U.S.":"U.S. Virgin Islands",
    "United States Minor Outlying Islands":"U.S. Minor Outlying Islands",
    "Venezuela, Bolivarian Republic of":"Venezuela",
    "Bonaire, Sint Eustatius and Saba":"Bonaire",
    "Virgin Islands, British":"British Virgin Islands",
    "Congo, Republic of the (Brazzaville)":"Congo (Brazzaville)",
    "Congo, the Democratic Republic of the (Kinshasa)":"Congo (Kinshasa)",
    "Côte d'Ivoire, Republic of":"Cote d'Ivoire",
    "Iran, Islamic Republic of":"Iran",
    "Gambia, The":"Gambia"
  };

  return renamedCountries[name] || name; // Use the renamed value or fallback to the original name
};

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

  const modifiedOptions = options.map((option) => ({
    ...option,
    label: renameCountry(option.label),
    value: renameCountry(option.value)
  }));

  return (
    <Select
      {...selectProps}
      options={modifiedOptions}
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
  const blacklist = useMemo(
    () => [
      // 'AF',
    ],
    []
  );

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
          blacklist={blacklist}
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
