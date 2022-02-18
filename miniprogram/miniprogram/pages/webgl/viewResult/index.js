//获取应用实例
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;
		console.log('test')
		app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/%E5%AE%9E%E9%AA%8C%E7%BB%93%E6%9E%9C.md?sign=48026aba988971752c417cb9d7e42d64&t=1644934498',res => {
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