// pages/description/Web/index.js
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;

		app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/miniprogram.md?sign=227bbbd6f4d1226e2bf333437b884a64&t=1644976819',res => {
			let obj = app.towxml(res.data,'markdown',{
				// theme:'dark',
				events:{
					tap:e => {
						console.log('tap',e);
					},
					change:e => {
						console.log('todo',e);
					}
				}
			});
			console.log(obj)
			_ts.setData({
				article:obj,
				isLoading: false
			});
		});
		
	}
})