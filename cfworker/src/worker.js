const init = {
	headers: {
		'content-type': 'application/json',
	},
};

export default {
	async scheduled(event, env, ctx) {
		ctx.waitUntil(fetch(env.URL, init));
		ctx.waitUntil(fetch(env.DELETEOODAPPTURL, init));
		ctx.waitUntil(fetch(env.SYNCCALS, init));
	},
};
