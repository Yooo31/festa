import { NextResponse } from 'next/server';

export const formatResponse = <T>(data: T, status = 200) => NextResponse.json(data, { status });
