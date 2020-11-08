"use strict";
cc._RF.push(module, '28ff1E9+WVP26ujk69fFahe', 'Scroller');
// script/Scroller.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 滚动的速度，单位px/s
        speed: -300,
        // x到达此位置后开始重头滚动
        resetX: -300
    },

    onLoad: function onLoad() {
        this.canScroll = true;
    },
    update: function update(dt) {
        if (!this.canScroll) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x <= this.resetX) {
            this.node.x -= this.resetX;
        }
    },
    stopScroll: function stopScroll() {
        this.canScroll = false;
    },
    startScroll: function startScroll() {
        this.canScroll = true;
    }
});

cc._RF.pop();