'use strict';

const nconf = require('nconf');
const assert = require('assert');
const request = require('../src/request');
const helpers = require('./helpers');

const topics = require('../src/topics');
const posts = require('../src/posts');
const user = require('../src/user');
const groups = require('../src/groups');
const categories = require('../src/categories');

describe('Official Answers', () => {
	let topic;
	let post;
	let categoryObj;
	let adminUid;
	let adminJar;
	let csrf_token;
	let fooUid;

	before(async () => {
		adminUid = await user.create({ username: 'admin', password: '123456' });
		fooUid = await user.create({ username: 'foo' });
		await groups.join('administrators', adminUid);
		const adminLogin = await helpers.loginUser('admin', '123456');
		adminJar = adminLogin.jar;
		csrf_token = adminLogin.csrf_token;

		categoryObj = await categories.create({
			name: 'Test Category',
			description: 'Test category created by testing script',
		});
		const topicInfo = {
			userId: adminUid,
			categoryId: categoryObj.cid,
			title: 'Test Topic Title',
			content: 'The content of test topic',
		};
		const { topicData } = await topics.post({
			uid: topicInfo.userId,
			title: topicInfo.title,
			content: topicInfo.content,
			cid: topicInfo.categoryId,
		});
		const { tid, uid } = topicData;
		const postData = await topics.reply({
			tid,
			uid,
			content: 'This is an official answer',
		});

		topic = topicData;
		post = postData;
	});

	it('should mark answer as official', async () => {
		const { response } = await request.post(
			`${nconf.get('url')}/api/v3/plugins/posts/official/${post.tid}`,
			{
				body: {
					...post,
					official: true,
				},
				jar: adminJar,
				headers: {
					'x-csrf-token': csrf_token,
				},
			},
		);
		const editedPost = await posts.getPostData(post.pid);

		assert.strictEqual(response.statusCode, 200);
		assert.strictEqual(editedPost.official, 'true');
	});

	it('should unmark answer as official', async () => {
		const { response } = await request.post(
			`${nconf.get('url')}/api/v3/plugins/posts/official/${post.tid}`,
			{
				body: {
					...post,
					official: false,
				},
				jar: adminJar,
				headers: {
					'x-csrf-token': csrf_token,
				},
			},
		);
		const editedPost = await posts.getPostData(post.pid);

		assert.strictEqual(response.statusCode, 200);
		assert.strictEqual(editedPost.official, 'false');
	});

	it('should send notificaions to topic watchers', (done) => {
		topics.follow(topic.tid, adminUid);
		topics.follow(topic.tid, fooUid);

		const res = request.post(
			`${nconf.get('url')}/api/v3/plugins/posts/official/${post.tid}`,
			{
				body: {
					...post,
					official: true,
				},
				jar: adminJar,
				headers: {
					'x-csrf-token': csrf_token,
				},
			},
		);

		res.then(({ response }) => {
			setTimeout(() => {
				assert.strictEqual(response.statusCode, 200);

				const userNotificationsA = user.notifications.get(adminUid);
				const userNotificationB = user.notifications.get(fooUid);
				userNotificationsA
					.then(({ unread }) => {
						assert.strictEqual(unread.length, 1);
						assert.strictEqual(unread[0].pid, post.pid);
					})
					.catch((err) => {
						assert.ifError(err);
					});
				userNotificationB
					.then(({ unread }) => {
						assert.strictEqual(unread.length, 1);
						assert.strictEqual(unread[0].pid, post.pid);
					})
					.catch((err) => {
						assert.ifError(err);
					});

				done();
			}, 3000);
		});
	});
});
