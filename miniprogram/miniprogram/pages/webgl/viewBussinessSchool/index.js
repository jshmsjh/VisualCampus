// pages/webgl/viewBussinessSchool/index.js
import * as THREE from '../../../libs/three.weapp.js'
import loadObj from './loadObj'

const app = getApp();
Page({
	data: {},
	onLoad: function () {
		let _ts = this
		// wx.getSystemInfo({
		// 	success: res => {
		// 			this.globalData.windowHeight = res.windowHeight;
		// 			this.globalData.windowHeight = res.windowHeight;
		// 	},
		// })
		wx.createSelectorQuery()
			.select('#c')
			.node()
			.exec((res) => {
				const canvas = new THREE.global.registerCanvas(res[0].node)
				console.log(canvas)
				loadObj(canvas, THREE)
			})
			app.getText('https://7465-testsduwh030201-icc8o-1301103668.tcb.qcloud.la/VisualCampus/md/test.md?sign=ee690365e006714121448da819e0225b&t=1644908186',res => {
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
	},
	onUnload: function () {
		THREE.global.clearCanvas()
	},
	touchStart(e) {
		// console.log('canvas', e)
		THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
	},
	touchMove(e) {
		// console.log('canvas', e)
		THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
	},
	touchEnd(e) {
		// console.log('canvas', e)
		THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
	},
	touchCancel(e) {
		// console.log('canvas', e)
	},
	longTap(e) {
		// console.log('canvas', e)
	},
	tap(e) {
		// console.log('canvas', e)
	},
})
