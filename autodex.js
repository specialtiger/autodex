auto(); // 初始化引擎
console.show(); // 调试时开启日志

// 监听弹窗出现的条件
const DEX_WINDOW_ID = "android:id/button1";

// 初始化标记和定时器
let isRunning = false;
let intervalId = null;

// 主任务函数（示例：每隔3秒输出日志）
function mainTask() {
    if (!device.isScreenOn()) return; // 二次验证屏幕状态
    
    // 在此编写你的核心逻辑
    console.log("屏幕亮起，执行任务中...", new Date().toLocaleString());
    // 通过控件ID精准定位（需提前抓取）
    let btn = id(DEX_WINDOW_ID).findOne(2000); // 2秒内查找控件
    if (btn) {
        btn.click();
        console.log("通过ID点击成功");
        return true;
    }
    // 如果找不到，尝试遍历所有Button
    className("android.widget.Button").find().forEach(n => console.log(n.id()));
    return false;
}
  
// 监听屏幕亮起事件
events.on('screen_on', () => {
    if (isRunning) return; // 避免重复启动

    isRunning = true;
    intervalId = setInterval(() => {
        mainTask();
    }, 3000); // 3秒执行一次任务
    console.log("检测到屏幕亮起，启动任务");
});

// 监听屏幕关闭事件
events.on('screen_off', () => {
    if (!isRunning) return;

    clearInterval(intervalId);
    isRunning = false;
    console.log("屏幕关闭，任务已暂停");
});

// 脚本退出时清理资源
events.on('exit', () => {
    clearInterval(intervalId);
});

// 初始启动检测（适用于脚本启动时屏幕已亮）
if (device.isScreenOn()) {
    events.emit('screen_on');
}

console.log("脚本已启动，等待屏幕亮起...");
