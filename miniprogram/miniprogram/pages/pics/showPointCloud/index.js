// pages/pics/showPointCloud/index.js
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;
		console.log('test')
		app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/%E7%82%B9%E4%BA%91%E5%9B%BE%E7%89%87.md?sign=25d683bc11eb1434d712933ed491519b&t=1644932287',res => {
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