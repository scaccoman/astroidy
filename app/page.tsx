'use client';

import { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import './page.css';
import Asteroid from './interfaces/asteroid';

type DateRangePiece = Date | null;
type DateRange = DateRangePiece | [DateRangePiece, DateRangePiece];

export default function Page() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>([
    new Date(),
    new Date(),
  ]);
  const [expandedAsteroids, setExpandedAsteroids] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(false);
  // const isInitialRender = useRef(true);

  useEffect(() => {
    async function fetchAsteroids() {
      const [startDate, endDate] = dateRange as [Date, Date];
      if (startDate && endDate) {
        setLoading(true);
        try {
          const [start] = startDate.toISOString().split('T');
          const [end] = endDate.toISOString().split('T');
          const response = await fetch(
            `/api/feed?start_date=${start}&end_date=${end}&sort=${sort}`,
          );
          const data = await response.json();

          if (Array.isArray(data)) {
            setAsteroids(data);
          }
        } catch (error) {
          console.error('Error fetching asteroids:', error);
          alert(
            'Failed to fetch asteroids. Please check your internet connection and try again.',
          );
        } finally {
          setLoading(false);
        }
      }
    }

    fetchAsteroids();
    // if (isInitialRender.current) {
    //   isInitialRender.current = false;
    // } else {
    //   fetchAsteroids();
    // }
  }, [dateRange, sort]);

  const handleDateRangeChange = (dateRange: DateRange) => {
    if (!dateRange || !Array.isArray(dateRange)) return;

    const [startDate, endDate] = dateRange;

    if (!startDate || !endDate) return;

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 7) {
      alert('The maximum date range is 7 days.');
      return;
    }

    setDateRange(dateRange);
  };

  const handleAsteroidClick = (asteroidId: string) => {
    setExpandedAsteroids((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(asteroidId)) {
        newSet.delete(asteroidId);
      } else {
        newSet.add(asteroidId);
      }
      return newSet;
    });
  };

  const filteredAsteroids = asteroids.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">Astroidy</h1>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <DateRangePicker
            onChange={handleDateRangeChange}
            format="yyyy-MM-dd"
            value={dateRange}
            calendarIcon={null}
            clearIcon={null}
            rangeDivider="to"
            className="dark-theme block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            onClick={() => setSort((prev) => !prev)}
            className={`rounded-md px-4 py-2 ${sort ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {sort ? 'Sorted' : 'Sort'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="relative h-2 w-full rounded bg-gray-700">
          <div className="loading-bar absolute left-0 top-0 h-2 rounded bg-indigo-500"></div>
        </div>
      ) : (
        <AsteroidList
          asteroids={filteredAsteroids}
          expandedAsteroids={expandedAsteroids}
          handleAsteroidClick={handleAsteroidClick}
        />
      )}
    </div>
  );
}

interface AsteroidListProps {
  asteroids: Asteroid[];
  expandedAsteroids: Set<string>;
  handleAsteroidClick: (asteroidId: string) => void;
}

function AsteroidList({
  asteroids,
  expandedAsteroids,
  handleAsteroidClick,
}: AsteroidListProps) {
  return (
    <div className="space-y-10 text-white">
      {asteroids.length === 0 ? (
        <div className="text-center text-gray-400">
          No asteroids found for the selected date range.
        </div>
      ) : (
        asteroids.map((asteroid) => (
          <div key={asteroid.id}>
            <div
              className="group block cursor-pointer space-y-1.5 rounded-lg bg-gray-900 px-5 py-3 hover:bg-gray-800"
              onClick={() => handleAsteroidClick(asteroid.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-200 group-hover:text-gray-50">
                  {asteroid.name}
                </div>
                <div className="text-gray-400 group-hover:text-gray-300">
                  {expandedAsteroids.has(asteroid.id) ? '▼' : '►'}
                </div>
              </div>
              {asteroid.description && (
                <div className="line-clamp-3 text-sm text-gray-400 group-hover:text-gray-300">
                  {asteroid.description}
                </div>
              )}
            </div>
            {expandedAsteroids.has(asteroid.id) && (
              <div className="mt-4 rounded-lg bg-gray-800 p-4 text-white">
                <h2 className="text-lg font-medium">{asteroid.name}</h2>
                <p>
                  <strong>Description:</strong> {asteroid.description}
                </p>
                <p>
                  <strong>Size:</strong> {asteroid.size}
                </p>
                <p>
                  <strong>Velocity:</strong> {asteroid.velocity}
                </p>
                <p>
                  <strong>NASA JPL URL:</strong>{' '}
                  <a
                    href={asteroid.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400"
                  >
                    {asteroid.nasa_jpl_url}
                  </a>
                </p>
                <p>
                  <strong>Absolute Magnitude:</strong>{' '}
                  {asteroid.absolute_magnitude_h}
                </p>
                <p>
                  <strong>Estimated Diameter:</strong>
                </p>
                <ul className="ml-4 list-disc">
                  <li>
                    Kilometers:{' '}
                    {
                      asteroid.estimated_diameter.kilometers
                        .estimated_diameter_min
                    }{' '}
                    -{' '}
                    {
                      asteroid.estimated_diameter.kilometers
                        .estimated_diameter_max
                    }
                  </li>
                  <li>
                    Meters:{' '}
                    {asteroid.estimated_diameter.meters.estimated_diameter_min}{' '}
                    -{' '}
                    {asteroid.estimated_diameter.meters.estimated_diameter_max}
                  </li>
                  <li>
                    Miles:{' '}
                    {asteroid.estimated_diameter.miles.estimated_diameter_min} -{' '}
                    {asteroid.estimated_diameter.miles.estimated_diameter_max}
                  </li>
                  <li>
                    Feet:{' '}
                    {asteroid.estimated_diameter.feet.estimated_diameter_min} -{' '}
                    {asteroid.estimated_diameter.feet.estimated_diameter_max}
                  </li>
                </ul>
                <p>
                  <strong>Potentially Hazardous:</strong>{' '}
                  {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Close Approach Data:</strong>
                </p>
                <ul className="ml-4 list-disc">
                  {asteroid.close_approach_data.map((approach, index) => (
                    <li key={index}>
                      <p>Date: {approach.close_approach_date_full}</p>
                      <p>
                        Relative Velocity:{' '}
                        {approach.relative_velocity.kilometers_per_hour} km/h
                      </p>
                      <p>
                        Miss Distance: {approach.miss_distance.kilometers} km
                      </p>
                      <p>Orbiting Body: {approach.orbiting_body}</p>
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Sentry Object:</strong>{' '}
                  {asteroid.is_sentry_object ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
