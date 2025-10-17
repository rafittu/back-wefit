import * as bcrypt from 'bcrypt';

export interface MockUser {
	id: string;
	email: string;
	password: string;
	name: string;
}

// user1@example.com -> password: Password123!
// user2@example.com -> password: Secret456$
// user3@example.com -> password: HelloWorld789#

const saltRounds = 10;

const users: MockUser[] = [
	{
		id: '1',
		email: 'user1@example.com',
		password: bcrypt.hashSync('Password123!', saltRounds),
		name: 'User One',
	},
	{
		id: '2',
		email: 'user2@example.com',
		password: bcrypt.hashSync('Secret456$', saltRounds),
		name: 'User Two',
	},
	{
		id: '3',
		email: 'user3@example.com',
		password: bcrypt.hashSync('HelloWorld789#', saltRounds),
		name: 'User Three',
	},
];

export function findUserByEmail(email: string): MockUser | undefined {
	return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
}

export default { findUserByEmail };
