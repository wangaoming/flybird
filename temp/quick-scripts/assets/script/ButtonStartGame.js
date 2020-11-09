(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ButtonStartGame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '09f35ECojVKRZ0eoWzH82Zv', 'ButtonStartGame', __filename);
// script/ButtonStartGame.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {

        maskLayer: {
            default: null,
            type: cc.Node
        },
        swooshingAudio: {
            default: null,
            url: cc.AudioClip
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
        // 播放音效
        cc.audioEngine.playEffect(this.swooshingAudio);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ButtonStartGame.js.map
        