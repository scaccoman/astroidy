import Asteroid from './interfaces/asteroid';

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
    <div className="space-y-6 text-white">
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
            <div
              className={`asteroid-details ${expandedAsteroids.has(asteroid.id) ? 'open' : ''}`}
            >
              {expandedAsteroids.has(asteroid.id) && (
                <div className="mt-2 rounded-lg bg-gray-800 p-4 text-white">
                  <a
                    href={asteroid.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400"
                  >
                    <h1 className="text-lg font-medium">{asteroid.name}</h1>
                  </a>
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
                      {
                        asteroid.estimated_diameter.meters
                          .estimated_diameter_min
                      }{' '}
                      -{' '}
                      {
                        asteroid.estimated_diameter.meters
                          .estimated_diameter_max
                      }
                    </li>
                    <li>
                      Miles:{' '}
                      {asteroid.estimated_diameter.miles.estimated_diameter_min}{' '}
                      -{' '}
                      {asteroid.estimated_diameter.miles.estimated_diameter_max}
                    </li>
                    <li>
                      Feet:{' '}
                      {asteroid.estimated_diameter.feet.estimated_diameter_min}{' '}
                      -{' '}
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
          </div>
        ))
      )}
    </div>
  );
}

export default AsteroidList;
