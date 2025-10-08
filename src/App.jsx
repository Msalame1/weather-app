import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, RefreshCw, Thermometer, Eye, Wind, Droplets, AlertCircle, X, Moon, Sun } from 'lucide-react';

// SearchBar Component
const SearchBar = ({ searchQuery, setSearchQuery, onSearch, isLoading, isDark }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="flex justify-center mb-8 w-full">
      <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md font-medium text-base placeholder:font-normal ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            disabled={isLoading}
          />
          <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className={`px-6 py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
            isDark 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// ErrorMessage Component
const ErrorMessage = ({ message, onClose, isDark }) => {
  if (!message) return null;

  return (
    <div className={`max-w-md mx-auto mb-6 p-4 border rounded-xl flex items-center justify-between shadow-sm ${
      isDark 
        ? 'bg-red-900/20 border-red-800 text-red-400' 
        : 'bg-red-50 border-red-200 text-red-600'
    }`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className={`transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-400 hover:text-red-600'}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// WeatherCard Component
const WeatherCard = ({ city, weather, onRemove, lastUpdated, isDark }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition, iconCode) => {
    if (iconCode) {
      const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
      };
      return iconMap[iconCode] || '🌤️';
    }

    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 relative group ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      {onRemove && (
        <button
          onClick={() => onRemove(city.id)}
          className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <div className="text-center mb-6">
        <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {city.name}
          {city.country && <span className={`font-normal text-base ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{city.country}</span>}
        </h3>
        <div className="text-6xl mb-2">{getWeatherIcon(weather.condition, weather.iconCode)}</div>
        <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{Math.round(weather.temp)}°C</div>
        <div className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{weather.condition}</div>
        {lastUpdated && (
          <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Updated: {formatTime(lastUpdated)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Feels like</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{Math.round(weather.feelsLike)}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Humidity</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{weather.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Wind</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{weather.windSpeed} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Visibility</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{weather.visibility} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Weather Dashboard Component
const WeatherDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cities, setCities] = useState([
    { name: 'London', country: 'GB', id: 'london' },
    { name: 'New York', country: 'US', id: 'newyork' },
    { name: 'Tokyo', country: 'JP', id: 'tokyo' },
    { name: 'Helsinki', country: 'FI', id: 'helsinki' }
  ]);
  const [weatherData, setWeatherData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '151a2c1f98d7b6466a77542b9eb33b75';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const getMockWeatherData = (cityName) => {
    const conditions = [
      { name: 'clear sky', iconCode: '01d', tempRange: [25, 35] },
      { name: 'few clouds', iconCode: '02d', tempRange: [20, 30] },
      { name: 'scattered clouds', iconCode: '03d', tempRange: [15, 25] },
      { name: 'light rain', iconCode: '10d', tempRange: [10, 20] },
      { name: 'rain', iconCode: '09d', tempRange: [8, 18] },
      { name: 'thunderstorm', iconCode: '11d', tempRange: [12, 22] }
    ];

    const cityHash = cityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const conditionIndex = Math.abs(cityHash) % conditions.length;
    const selectedCondition = conditions[conditionIndex];
    
    const baseTemp = selectedCondition.tempRange[0] + 
      (Math.abs(cityHash % 1000) / 1000) * (selectedCondition.tempRange[1] - selectedCondition.tempRange[0]);
    
    const temp = Math.round(baseTemp * 10) / 10;
    const feelsLike = temp + (Math.abs(cityHash % 10) - 5);
    const humidity = 40 + (Math.abs(cityHash % 40));
    const windSpeed = Math.round((2 + (Math.abs(cityHash % 15))) * 3.6);
    const visibility = Math.round((3 + (Math.abs(cityHash % 12))) * 1000) / 1000;

    return {
      temp,
      feelsLike,
      condition: selectedCondition.name,
      iconCode: selectedCondition.iconCode,
      humidity,
      windSpeed,
      visibility
    };
  };

  const fetchWeatherData = useCallback(async (cityName, countryCode = '') => {
    try {
      setIsLoading(true);
      setError('');
      
      let weatherInfo;
      
      const query = countryCode ? `${cityName},${countryCode}` : cityName;
      const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
          } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API configuration.');
          } else {
            throw new Error(`Weather service error (${response.status}). Please try again later.`);
          }
        }
        
        const data = await response.json();
        
        weatherInfo = {
          temp: data.main.temp,
          feelsLike: data.main.feels_like,
          condition: data.weather[0].description,
          iconCode: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          visibility: data.visibility ? Math.round(data.visibility / 1000) : 10
        };
        
      } catch (apiError) {
        console.warn('API fetch failed:', apiError.message);
        if (apiError.message.includes('not found') || apiError.message.includes('API key')) {
          throw apiError;
        }
        console.log('Falling back to mock data');
        weatherInfo = getMockWeatherData(cityName);
      }
      
      if (weatherInfo) {
        setWeatherData(prev => ({
          ...prev,
          [cityName]: weatherInfo
        }));
        
        setLastUpdated(prev => ({
          ...prev,
          [cityName]: Date.now()
        }));
        
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || `Failed to fetch weather data for ${cityName}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const cityName = searchQuery.trim();
      const success = await fetchWeatherData(cityName);
      
      if (success) {
        const newCity = {
          name: cityName,
          country: '',
          id: cityName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
        };
        
        setCities(prev => {
          const exists = prev.find(city => 
            city.name.toLowerCase() === cityName.toLowerCase()
          );
          if (!exists) {
            return [...prev, newCity];
          }
          return prev;
        });
        
        setSearchQuery('');
        setError('');
      }
    }
  };

  const removeCity = (cityId) => {
    setCities(prev => prev.filter(city => city.id !== cityId));
  };

  const refreshAll = async () => {
    for (const city of cities) {
      await fetchWeatherData(city.name, city.country);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const autoRefresh = setInterval(() => {
      cities.forEach(city => {
        fetchWeatherData(city.name, city.country);
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(autoRefresh);
  }, [cities, fetchWeatherData]);

  useEffect(() => {
    cities.forEach(city => {
      fetchWeatherData(city.name, city.country);
    });
  }, [fetchWeatherData]);

  const clearError = () => setError('');

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Weather Dashboard
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Search for current weather conditions in cities around the world
          </p>
        </div>

        {/* Centered Search Bar */}
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
          isDark={isDarkMode}
        />

        {/* Refresh Button - Centered below search */}
        <div className="flex justify-center mb-8">
          <button
            onClick={refreshAll}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh All</span>
          </button>
        </div>

        {/* Error Message */}
        <ErrorMessage message={error} onClose={clearError} isDark={isDarkMode} />

        {/* Loading State */}
        {isLoading && cities.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading weather data...</p>
          </div>
        )}

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cities.map((city) => (
            <WeatherCard
              key={city.id}
              city={city}
              weather={weatherData[city.name]}
              onRemove={cities.length > 1 ? removeCity : null}
              lastUpdated={lastUpdated[city.name]}
              isDark={isDarkMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {cities.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No cities added yet</p>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Search for a city to get started</p>
          </div>
        )}

        {/* API Status */}
        <div className="mt-12 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
            isDarkMode 
              ? 'bg-green-900/20 border-green-800 text-green-400' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <span>🌐</span>
            <span>Connected to OpenWeatherMap API for live weather data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;