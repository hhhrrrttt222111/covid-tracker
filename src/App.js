import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';

import './App.css';
import 'leaflet/dist/leaflet.css'
import { sortData, prettyPrintStat } from "./utils";
import InfoBox from './Components/InfoBox/InfoBox';
import Map from './Components/Map/Map';
import Table from './Components/Table/Table';
import LineGraph from './Components/LineGraph/LineGraph';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      })
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' 
                                            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    });
  };

  return (
    <div className="app">
      <div className="left">
        <div className="header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="dropdown">
            <Select onChange={onCountryChange} variant="outlined" value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>    
          </FormControl>
        </div>

        <div className="stats">
          <InfoBox onClick={(e) => setCasesType("cases")} isRed active={casesType === "cases"} title="Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}/>
          <InfoBox onClick={(e) => setCasesType("recovered")} active={casesType === "recovered"} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered}/>
          <InfoBox onClick={(e) => setCasesType("deaths")} isBlack active={casesType === "deaths"} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths}/>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className="right">
          <CardContent>
            <h3>Cases by Country</h3>
                <Table countries={tableData} />
            <h3>Worldwide new cases</h3>
                <LineGraph className="graph" casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
