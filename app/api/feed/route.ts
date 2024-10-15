import { NextRequest, NextResponse } from 'next/server';
import config from '#/app/config';
import Asteroid from '#/app/interfaces/asteroid';
import 'server-only';

const allowedParams = ['start_date', 'end_date', 'sort'];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(`${config.nasa.host}${config.nasa.feed}`);

    const params = allowedParams.reduce(
      (acc: { [key: string]: string }, param) => {
        const value = req.nextUrl.searchParams.get(param);
        if (value) {
          acc[param] = value;
        }
        return acc;
      },
      {},
    );

    url.searchParams.append('api_key', config.nasa.apiKey ?? '');
    params.start_date && url.searchParams.append('start_date', params.end_date);
    params.end_date && url.searchParams.append('end_date', params.end_date);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const data: { near_earth_objects: { [key: string]: Asteroid[] } } =
      await response.json();
    const asteroids = Object.values(data.near_earth_objects).flat();
    if (params.sort === 'true') {
      asteroids.sort((a, b) => a.name.localeCompare(b.name));
    }

    return new NextResponse(JSON.stringify(asteroids), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!' }),
      { status: 500 },
    );
  }
}
