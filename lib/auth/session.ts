import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface SessionData {
    userId: string;
    email: string;
    name: string;
}

export function createSession(data: SessionData): string {
    return jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionData | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
        return decoded;
    } catch (error) {
        return null;
    }
}
