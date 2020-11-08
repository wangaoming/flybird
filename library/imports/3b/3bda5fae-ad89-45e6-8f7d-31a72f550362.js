"use strict";
cc._RF.push(module, '3bda5+urYlF5o99MacvVQNi', 'Game');
// script/Game.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Bird = require('Bird');
var PipeManager = require('PipeManager');
var Scroller = require('Scroller');
cc.Class({
    extends: cc.Component,

    properties: {
        /** 得金牌的分数 */
        goldScore: 30,
        /** 得银牌的分数 */
        silverScore: 10,
        /** 管道管理组件 */
        pipeManager: PipeManager,
        /** 小鸟组件 */
        bird: Bird,
        /** 分数显示节点 */
        scoreLabel: cc.Label,
        /** 遮罩节点 */
        maskLayer: {
            default: null,
            type: cc.Node
        },
        /** 地面节点 */
        ground: {
            default: null,
            type: cc.Node
        },
        /** 背景节点 */
        background: {
            default: null,
            type: cc.Node
        },
        /** 准备开始菜单节点 */
        readyMenu: {
            default: null,
            type: cc.Node
        },
        /** 游戏结束的菜单节点 */
        gameOverMenu: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.score = 0;
        this.scoreLabel.string = this.score;
        this.bird.init(this);
        this._enableInput(true);
        this._revealScene();
    },
    _revealScene: function _revealScene() {
        this.maskLayer.active = true;
        this.maskLayer.color = cc.Color.BLACK;
        this.maskLayer.runAction(cc.fadeOut(0.3));
    },
    _enableInput: function _enableInput(enable) {
        if (enable) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        } else {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        }
    },
    onKeyDown: function onKeyDown() {
        this._startGameOrJumpBird();
    },
    onTouch: function onTouch() {
        this._startGameOrJumpBird();
        return true;
    },
    _hideReadyMenu: function _hideReadyMenu() {
        var _this = this;

        this.readyMenu.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
            _this.readyMenu.active = false;
        }, this)));
    },

    //开始或者飞行
    _startGameOrJumpBird: function _startGameOrJumpBird() {
        if (this.bird.state === Bird.State.Ready) {
            this._gameStart();
        } else {
            this.bird.rise(); //继续飞行
        }
    },

    //游戏开始
    _gameStart: function _gameStart() {
        this._hideReadyMenu(); //隐藏menu
        this.pipeManager.startSpawn(); //生产管道
        this.bird.startFly(); //开始飞行
    },
    gameOver: function gameOver() {
        this.pipeManager.reset();
        this.ground.getComponent(Scroller).stopScroll(); //地板停止滚动
        this.background.getComponent(Scroller).stopScroll(); //背景停止滚动
        this._enableInput(false); //停止接受事件
        this._blinkOnce(); //闪烁一下
        this._showGameOverMenu(); //显示有些结束菜单
    },


    /** 屏幕闪烁一下 */
    _blinkOnce: function _blinkOnce() {
        this.maskLayer.color = cc.Color.WHITE;
        this.maskLayer.runAction(cc.sequence(cc.fadeTo(0.1, 200), cc.fadeOut(0.1)));
    },
    _showGameOverMenu: function _showGameOverMenu() {
        var _this2 = this;

        // 隐藏分数
        this.scoreLabel.node.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
            _this2.scoreLabel.node.active = false;
        }, this)));

        // 获取游戏结束界面的各个节点
        var gameOverNode = this.gameOverMenu.getChildByName("gameOverLabel");
        var resultBoardNode = this.gameOverMenu.getChildByName("resultBoard");
        var startButtonNode = this.gameOverMenu.getChildByName("startButton");
        var currentScoreNode = resultBoardNode.getChildByName("currentScore");
        var bestScoreNode = resultBoardNode.getChildByName("bestScore");
        var medalNode = resultBoardNode.getChildByName("medal");

        // 保存最高分到本地
        var KEY_BEST_SCORE = "bestScore";
        var bestScore = cc.sys.localStorage.getItem(KEY_BEST_SCORE);
        if (bestScore === "null" || this.score > bestScore) {
            bestScore = this.score;
        }
        cc.sys.localStorage.setItem(KEY_BEST_SCORE, bestScore);

        // 显示当前分数、最高分
        currentScoreNode.getComponent(cc.Label).string = this.score;
        bestScoreNode.getComponent(cc.Label).string = bestScore;

        // 决定是否显示奖牌
        var showMedal = function showMedal(err, spriteFrame) {
            medalNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        };
        if (this.score >= this.goldScore) {
            // 显示金牌
            cc.loader.loadRes("image/medal_gold.png/medal_gold", showMedal);
        } else if (this.score >= this.silverScore) {
            // 显示银牌
            cc.loader.loadRes("image/medal_silver.png/medal_silver", showMedal);
        } else {
            // 不显示奖牌
            showMedal();
        }

        // 依次显示各个节点
        var showNode = function showNode(node, action, callback) {
            startButtonNode.active = true;
            node.runAction(cc.sequence(action, cc.callFunc(function () {
                if (callback) {
                    callback();
                }
            }, _this2)));
        };
        this.gameOverMenu.active = true;
        var showNodeFunc = function showNodeFunc() {
            return showNode(gameOverNode, cc.spawn(cc.fadeIn(0.2), cc.sequence(cc.moveBy(0.2, cc.p(0, 10)), cc.moveBy(0.5, cc.p(0, -10)))), function () {
                return showNode(resultBoardNode, cc.moveTo(0.5, cc.p(resultBoardNode.x, 0)).easing(cc.easeCubicActionOut()), function () {
                    return showNode(startButtonNode, cc.fadeIn(0.5));
                });
            });
        };
        this.scheduleOnce(showNodeFunc, 0.55);
    },
    gainScore: function gainScore() {
        this.score++;
        this.scoreLabel.string = this.score;
    },

    /** 点击游戏结束菜单中的重新开始游戏按钮会调用此方法 */
    restart: function restart() {
        this.maskLayer.color = cc.Color.BLACK;
        this.maskLayer.runAction(cc.sequence(cc.fadeIn(0.3), cc.callFunc(function () {
            // 重新加载场景
            cc.director.loadScene('game');
        }, this)));
    }
}
// update (dt) {},
);

cc._RF.pop();