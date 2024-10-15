'use client';

import { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Asteroid from './interfaces/asteroid';
import AsteroidList from './asteroidList';

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import './page.css';

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
        } finally {
          setLoading(false);
        }
      }
    }

    fetchAsteroids();
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
