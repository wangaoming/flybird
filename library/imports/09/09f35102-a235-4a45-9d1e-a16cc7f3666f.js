"use strict";
cc._RF.push(module, '09f35ECojVKRZ0eoWzH82Zv', 'ButtonStartGame');
// script/ButtonStartGame.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {

        maskLayer: {
            default: null,
            type: cc.Node
        }

    },

    startGame: function startGame() {

        this.maskLayer.active = true; //激活蒙版
        this.maskLayer.opacity = 0; //将蒙版的都名都设置为0 
        this.maskLayer.color = cc.Color.BLACK; //将蒙版设置为黑色
        this.maskLayer.runAction(cc.sequence(cc.fadeIn(0.2), cc.callFunc(function () {
            console.log('切换场景');
            cc.director.loadScene('game');
        }, this))); //运行一个action ，先让蒙版在0.2秒中逐渐显示出来，然后打印一个log
    }
});

cc._RF.pop();