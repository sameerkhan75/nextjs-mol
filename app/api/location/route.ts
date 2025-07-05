import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { UserLocation } from '@/lib/db/models/user-location.model';

// POST - Update user location
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, username, game, location, isOnline = true, level, achievements } = body;

    if (!userId || !username || !game || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create user location
    const userLocation = await UserLocation.findOneAndUpdate(
      { userId },
      {
        userId,
        username,
        game,
        location,
        isOnline,
        lastSeen: new Date(),
        level,
        achievements,
        deviceInfo: {
          userAgent: request.headers.get('user-agent') || '',
          platform: request.headers.get('sec-ch-ua-platform') || '',
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: userLocation });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

// GET - Get nearby players
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const maxDistance = parseFloat(searchParams.get('maxDistance') || '10');
    const game = searchParams.get('game');
    const onlineOnly = searchParams.get('onlineOnly') === 'true';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Build query
    const query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat], // MongoDB uses [lng, lat] order
          },
          $maxDistance: maxDistance * 1000, // Convert km to meters
        },
      },
    };

    if (game && game !== 'all') {
      query.game = game;
    }

    if (onlineOnly) {
      query.isOnline = true;
    }

    // Find nearby players
    const nearbyPlayers = await UserLocation.find(query)
      .sort({ lastSeen: -1 })
      .limit(50);

    return NextResponse.json({ 
      success: true, 
      data: nearbyPlayers,
      count: nearbyPlayers.length 
    });
  } catch (error) {
    console.error('Error fetching nearby players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby players' },
      { status: 500 }
    );
  }
} 