import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import logo from './logo.png';
import HourlyChart from './HourlyChart';


const weatherTranslations = {
  "Sunny": "Güneşli",
  "Clear": "Açık",
  "Rain": "Yağmurlu",
  "Snow": "Karlı",
  "Overcast": "Kapalı",
  "Patchy rain nearby": "Yağmurlu",
  "Partly Cloudy ": "Parçalı Bulutlu",
  "Moderate rain": "Ilımlı yağmurlu",
  "Clear ": "Açık",
  "Partly cloudy": "Parçalı Bulutlu",
  "Overcast ": "Bulutlu"
};

// Çeviri fonksiyonu
const translateWeatherCondition = (condition) => {
  return weatherTranslations[condition] || condition; // Çeviri yoksa orijinal metni döndürelim
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState('');

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr', { weekday: 'long' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = config.VITE_WEATHER_API;
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${submittedLocation}&days=7&aqi=yes&alerts=yes`);
        setWeatherData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (submittedLocation) {
      fetchData();
    }
  }, [submittedLocation]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedLocation(location);
  };


  return (
    <>
      <div className='app-container'>
        <div className='header'>
          <img src={logo} alt="Weather Knowledge Logo" className='app-logo' />
          <form className='input-container' onSubmit={handleSubmit}>
            <input className='location-input' type='text' placeholder='Lütfen bir şehir giriniz' value={location} onChange={handleLocationChange} />
            <button type="submit" >Ara</button>
          </form>
          {submittedLocation && (
            <div className='location-bar'>
              <img src="https://cdn-icons-png.flaticon.com/512/10502/10502008.png" alt="Location Icon" className='location-logo' />
              <div className='location-display'>{submittedLocation}</div>
            </div>
          )}
        </div>

        {weatherData && (
          <div className='weather-container'>
            <div className='today-container'>
              <h2 className='date'>{getDayName(weatherData.forecast.forecastday[0].date)}</h2>
              <img className='weather-icon' src={weatherData.forecast.forecastday[0].day.condition.icon} alt={weatherData.forecast.forecastday[0].day.condition.text} />
              <p className='temperature'>{weatherData.forecast.forecastday[0].day.maxtemp_c} °C</p>
              <p className='temperature'> {translateWeatherCondition(weatherData.forecast.forecastday[0].day.condition.text)} </p>
              <div>Nem: <p className='weather-current'>{weatherData.forecast.forecastday[0].day.avghumidity} %</p></div>
              <div>Rüzgar Hızı: <p className='weather-current'>{weatherData.forecast.forecastday[0].day.maxwind_kph} km/s</p></div>
              <div>Yağmur Yağma İhtimali: <p className='weather-current' id='rain'>{weatherData.forecast.forecastday[0].day.daily_chance_of_rain} %</p></div>
            </div>

            <div className='upcoming-days'>
              {weatherData.forecast.forecastday.slice(1).map((day) => (
                <div className='day-container' key={day.date}>
                  <h2 className='date'>{getDayName(day.date)}</h2>
                  <img className='weather-icon' src={day.day.condition.icon} alt={day.day.condition.text} />
                  <p className='temperature'>{day.day.maxtemp_c} °C</p>
                  <p className='temperature'> {translateWeatherCondition(day.day.condition.text)} </p>
                  <div>Nem: <p className='weather-current'>{day.day.avghumidity} %</p></div>
                  <div>Rüzgar Hızı: <p className='weather-current'>{day.day.maxwind_kph} km/s</p></div>
                  <div>Yağmur Yağma İhtimali: <p className='weather-current'>{day.day.daily_chance_of_rain} %</p></div>
                </div>
              ))}
            </div>

            <div className='hourly-forecast'>
              <h2>Saatlik Tahmin</h2>
              <ul>
                {weatherData.forecast.forecastday[0].hour.map((hourData, index) => (
                  <li key={index}>
                    <strong>{new Date(hourData.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}:</strong> Sıcaklık: {hourData.temp_c}°C, {translateWeatherCondition(hourData.condition.text)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hourly-chart-component">
                <h2>Saatlik Tahmin</h2>
                <HourlyChart hourlyData={weatherData.forecast.forecastday[0].hour} />
            </div>
            <div className='social-container'>
            <a href="https://github.com/halil-akalin" target='blank'><img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png" alt="Location Icon" className='social-link' id='github' /></a>
            <a href="https://www.linkedin.com/in/halil-akal%C4%B1n/" target='blank'><img src="https://blog.waalaxy.com/wp-content/uploads/2021/01/linkedin-2.png" alt="Location Icon" className='social-link' id='linkedin' /></a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
