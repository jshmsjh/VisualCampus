// pages/description/CV/index.js
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;

		app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/CV.md?sign=1de0417a53f3967cd116faa85baab0e4&t=1644931821',res => {
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