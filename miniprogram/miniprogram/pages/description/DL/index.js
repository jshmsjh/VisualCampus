//获取应用实例
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;

		app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/DL.md?sign=7f50ef3368b2f9bd2cefd7842b48a36b&t=1644931769',res => {
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