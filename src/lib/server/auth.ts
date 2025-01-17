import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCase, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCase(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	if (!token || !userId) {
		throw new Error('Token and userId are required');
	}

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = Math.floor((Date.now() + DAY_IN_MS * 30) / 1000);
	
	await db.insert(session).values({
		id: sessionId,
		user_id: userId,
		expires_at: expiresAt
	});

	return {
		id: sessionId,
		userId,
		expiresAt
	};
}

export async function validateSessionToken(token: string) {
	if (!token) {
		return { session: null, user: null };
	}

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	
	const results = await db
		.select()
		.from(session)
		.leftJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, sessionId));

	const result = results[0];
	
	if (!result?.session) {
		return { session: null, user: null };
	}

	const now = Math.floor(Date.now() / 1000);

	if (now >= result.session.expiresAt) {
		await db.delete(session).where(eq(session.id, result.session.id));
		return { session: null, user: null };
	}

	const renewSession = now >= result.session.expiresAt - DAY_IN_MS * 15 / 1000;
	if (renewSession) {
		const newExpiresAt = Math.floor((Date.now() + DAY_IN_MS * 30) / 1000);
		await db
			.update(session)
			.set({ expires_at: newExpiresAt })
			.where(eq(session.id, result.session.id));
		result.session.expiresAt = newExpiresAt;
	}

	return { 
		session: result.session, 
		user: result.user 
	};
}

export async function invalidateSession(sessionId: string) {
	if (!sessionId) {
		throw new Error('SessionId is required');
	}
	await db.delete(session).where(eq(session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	if (!token || !expiresAt) {
		throw new Error('Token and expiresAt are required');
	}
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
